-- ============================================================================
-- migration_homepage.sql  —  ปรับปรุงหน้าแรก KIT (โพสต์ / ข่าวสารและประกาศ)
-- ============================================================================
-- ไฟล์นี้ "ไม่ใช่" schema.sql ฉบับเต็ม และไม่แตะข้อมูลในตาราง site_docs แม้แต่แถวเดียว
-- (ไม่มี INSERT / UPDATE / DELETE / DROP TABLE) — รันซ้ำได้อย่างปลอดภัย (idempotent)
--
-- สิ่งที่ไฟล์นี้ทำ
--   1) ปรับ CHECK constraint ของ public.site_docs ให้รับ key ใหม่ 'cposts' และ 'news'
--      โดยรวม key ที่มีอยู่จริงในตารางตอนนี้เข้าไปด้วย (ไม่ทำให้ข้อมูลเดิมผิดเงื่อนไข)
--   2) เพิ่มฟังก์ชันภายใน public._pub_news() (ผู้เข้าชมเรียกตรงไม่ได้)
--   3) แทนที่ public.get_public_site() ด้วยเวอร์ชันเดียวกับ schema.sql + ส่ง 'cposts' และ 'news' เพิ่ม
--      เพื่อให้หน้าเว็บเรียก RPC ครั้งเดียว (ไม่ต้องเรียก get_public_cposts แยก)
--
-- ไม่แตะ: ตาราง staff, ฟังก์ชัน is_staff(), นโยบาย RLS, Storage bucket 'media' (ใช้ของเดิม),
--         ฟังก์ชัน get_public_cposts() (ถ้ามีอยู่เดิมจะคงไว้ ไม่ลบ ไม่แก้)
--
-- ก่อนรัน แนะนำให้สำรองฟังก์ชันเดิมไว้ (รันแยกต่างหาก แล้วคัดลอกผลลัพธ์เก็บไว้):
--     select pg_get_functiondef('public.get_public_site'::regproc);
--     select conname, pg_get_constraintdef(oid) from pg_constraint where conrelid = 'public.site_docs'::regclass;
-- ============================================================================

begin;

-- 1) CHECK constraint ของ site_docs ---------------------------------------------------
--    สร้างรายการ key ที่อนุญาต = key มาตรฐานของ schema.sql + 'cposts' + 'news' + key ที่มีอยู่จริงในตาราง
--    (กันกรณีฐานข้อมูลจริงมี key เพิ่มเติมจากที่ schema.sql ระบุ)
--    constraint ที่ถูกแทนที่ = เฉพาะ CHECK ที่อ้างถึงคอลัมน์ key หรือ jsonb_typeof ของ site_docs
do $$
declare
  v_keys text[];
  v_objs text[];
  r      record;
begin
  select array_agg(distinct k order by k) into v_keys from (
    select unnest(array['menu','pages','events','settings','campus','fgroups','faculties','majors',
                        'programs','people','clubcats','clubs','cposts','news']) as k
    union
    select key from public.site_docs
  ) s;

  -- key ที่ต้องเป็น object: settings, campus + key ใดก็ตามที่ตอนนี้เก็บเป็น object อยู่แล้ว
  select array_agg(distinct k order by k) into v_objs from (
    select unnest(array['settings','campus']) as k
    union
    select key from public.site_docs where jsonb_typeof(data) = 'object'
  ) s;

  for r in
    select conname from pg_constraint
    where conrelid = 'public.site_docs'::regclass
      and contype = 'c'
      and (pg_get_constraintdef(oid) ~ '\mkey\M' or pg_get_constraintdef(oid) ~ 'jsonb_typeof')
  loop
    raise notice 'drop constraint % (จะสร้างใหม่ทันที)', r.conname;
    execute format('alter table public.site_docs drop constraint %I', r.conname);
  end loop;

  execute format(
    'alter table public.site_docs add constraint site_docs_key_check check (key in (%s))',
    (select string_agg(quote_literal(k), ', ') from unnest(v_keys) k));

  execute format(
    'alter table public.site_docs add constraint site_docs_shape check ('
    || '(key in (%1$s) and jsonb_typeof(data) = ''object'') or '
    || '(key not in (%1$s) and jsonb_typeof(data) = ''array''))',
    (select string_agg(quote_literal(k), ', ') from unnest(v_objs) k));
end $$;

-- 2) ตัวช่วยภายใน: ข่าวที่เผยแพร่ เรียงวันที่ใหม่สุดก่อน จำกัดจำนวน ------------------------
create or replace function public._pub_news(p_limit int)
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(t.v order by t.d desc nulls last, t.n), '[]'::jsonb)
  from (
    select r.v, r.n, r.v->>'date' as d
    from jsonb_array_elements(
           case when jsonb_typeof((select data from public.site_docs where key = 'news')) = 'array'
                then (select data from public.site_docs where key = 'news') else '[]'::jsonb end
         ) with ordinality as r(v, n)
    where r.v->>'status' = 'published'
    order by (r.v->>'date') desc nulls last, r.n
    limit greatest(p_limit, 0)
  ) t;
$$;
revoke all on function public._pub_news(int) from public, anon, authenticated;

-- 3) get_public_site(): เหมือน schema.sql ทุกประการ + เพิ่ม 'cposts' และ 'news' ----------------
create or replace function public.get_public_site()
returns jsonb language plpgsql stable security definer set search_path = '' as $$
declare
  v_pages  jsonb;
  v_ids    text[];
  v_menu   jsonb;
  v_events jsonb;
  v_set    jsonb;
  v_campus jsonb;
  v_fg     jsonb;
  v_fa     jsonb;
  v_mj     jsonb;
  v_pg     jsonb;
  v_pp     jsonb;
  v_cc     jsonb;
  v_cl     jsonb;
  v_cp     jsonb;
  v_nw     jsonb;
begin
  select coalesce(jsonb_agg(p.v order by p.n), '[]'::jsonb) into v_pages
  from jsonb_array_elements(coalesce((select data from public.site_docs where key = 'pages'), '[]'::jsonb)) with ordinality as p(v, n)
  where p.v->>'status' = 'published';

  select coalesce(array_agg(p.v->>'id'), '{}'::text[]) into v_ids
  from jsonb_array_elements(v_pages) as p(v);

  select coalesce(jsonb_agg(m.v order by m.n), '[]'::jsonb) into v_menu
  from jsonb_array_elements(coalesce((select data from public.site_docs where key = 'menu'), '[]'::jsonb)) with ordinality as m(v, n)
  where coalesce(m.v->>'show', 'true') <> 'false'
    and (coalesce(m.v->>'kind', '') <> 'cms' or (m.v->>'pageId') = any (v_ids));

  select coalesce(jsonb_agg(e.v order by e.n), '[]'::jsonb) into v_events
  from jsonb_array_elements(coalesce((select data from public.site_docs where key = 'events'), '[]'::jsonb)) with ordinality as e(v, n)
  where e.v->>'status' = 'published';

  select coalesce((select data from public.site_docs where key = 'settings'), '{}'::jsonb) into v_set;

  -- แผนผังสถาบัน: ส่งเฉพาะสถานที่ที่ไม่ได้ซ่อน
  select coalesce((select data from public.site_docs where key = 'campus'), '{}'::jsonb) into v_campus;
  if jsonb_typeof(v_campus) = 'object' then
    v_campus := jsonb_set(v_campus, '{places}', case when jsonb_typeof(v_campus->'places') = 'array' then
      coalesce((select jsonb_agg(c.v order by c.n)
                from jsonb_array_elements(v_campus->'places') with ordinality as c(v, n)
                where coalesce(c.v->>'show', 'true') <> 'false'), '[]'::jsonb)
      else '[]'::jsonb end);
  end if;

  -- คณะและหลักสูตร: ต้องเผยแพร่ครบทุกระดับต้นสังกัด (กลุ่ม → คณะ → สาขา → หลักสูตร)
  v_fg := public._pub_rows('fgroups', null, null);
  v_fa := public._pub_rows('faculties', 'groupId',
            (select coalesce(array_agg(x->>'id'), '{}'::text[]) from jsonb_array_elements(v_fg) x));
  v_mj := public._pub_rows('majors', 'facultyId',
            (select coalesce(array_agg(x->>'id'), '{}'::text[]) from jsonb_array_elements(v_fa) x));
  v_pg := public._pub_rows('programs', 'majorId',
            (select coalesce(array_agg(x->>'id'), '{}'::text[]) from jsonb_array_elements(v_mj) x));

  -- บุคลากรและทีมผู้บริหาร: ไม่มีต้นสังกัด ส่งเฉพาะแถวที่เผยแพร่
  v_pp := public._pub_rows('people', null, null);

  -- ชมรมนักศึกษา: หมวดหมู่และชมรมที่เผยแพร่ (ชมรมไม่ผูกกับสถานะหมวด: ถ้าหมวดถูกซ่อน/ลบ ชมรมจะแสดงในกลุ่ม "ไม่ระบุหมวดหมู่")
  v_cc := public._pub_rows('clubcats', null, null);
  v_cl := public._pub_rows('clubs', null, null);

  -- โพสต์ (cposts): เฉพาะแถวที่เผยแพร่ เรียงตามลำดับในอาร์เรย์ (ลำดับที่ผู้ดูแลจัดไว้)
  v_cp := public._pub_rows('cposts', null, null);

  -- ข่าวสารและประกาศ (news): เฉพาะที่เผยแพร่ เรียงวันที่ใหม่สุดก่อน จำกัดจำนวนล่าสุดเพื่อไม่ให้ข้อมูลที่ส่งใหญ่เกินไป (ต้องตรงกับ NW_SRV ใน app.js)
  v_nw := public._pub_news(60);

  return jsonb_build_object('menu', v_menu, 'pages', v_pages, 'events', v_events, 'settings', v_set, 'campus', v_campus,
                            'fgroups', v_fg, 'faculties', v_fa, 'majors', v_mj, 'programs', v_pg,
                            'people', v_pp, 'clubcats', v_cc, 'clubs', v_cl,
                            'cposts', v_cp, 'news', v_nw);
end;
$$;
revoke all on function public.get_public_site() from public;
grant execute on function public.get_public_site() to anon, authenticated;

commit;

-- ============================================================================
-- ตรวจผลหลังรัน (รันแยกต่างหาก ใน SQL Editor)
--   select jsonb_object_keys(public.get_public_site());
--     -> ต้องเห็น key: menu, pages, events, settings, campus, fgroups, faculties, majors,
--        programs, people, clubcats, clubs, cposts, news
--   select key, jsonb_typeof(data), jsonb_array_length(case when jsonb_typeof(data)='array' then data else '[]'::jsonb end) as n
--     from public.site_docs order by key;
--     -> จำนวนแถว/ข้อมูลเดิมต้องเท่าเดิมก่อนรัน
-- ============================================================================
