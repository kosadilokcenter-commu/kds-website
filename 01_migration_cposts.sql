-- KIT — Migration: เพิ่มโพสต์คอมมูนิตี้ (site_docs key 'cposts')
-- รันทั้งไฟล์ใน Supabase > SQL Editor (รันซ้ำได้) — ไม่ต้องรัน schema.sql ทั้งไฟล์
--
-- สิ่งที่ไฟล์นี้ทำ (เท่านั้น):
--   1) ขยาย CHECK constraint ของ site_docs.key ให้รับค่า 'cposts' เพิ่ม โดยคง key เดิมทั้งหมด
--      และรวม key ที่มีอยู่จริงในตารางตอนนี้เข้าไปด้วย (แถวเดิมจะไม่ถูกปฏิเสธ/ไม่ถูกแก้)
--   2) สร้างฟังก์ชันใหม่ public.get_public_cposts() ให้ผู้เข้าชมอ่านเฉพาะโพสต์ที่เผยแพร่
-- สิ่งที่ไฟล์นี้ "ไม่" ทำ:
--   - ไม่แก้ get_public_site(), ไม่แก้ RLS/policy/staff/storage, ไม่ลบหรือเขียนทับข้อมูลใดในตาราง
--   - ไม่สร้างตารางใหม่ ไม่สร้าง bucket ใหม่ (รูปโพสต์ใช้ bucket 'media' เดิม โฟลเดอร์ posts/)
-- หากมีขั้นตอนใดล้มเหลว ทั้งไฟล์จะถูกย้อนกลับ (อยู่ใน transaction เดียว)

begin;

do $$
declare
  r       record;
  v_base  text[] := array['menu','pages','events','settings','campus','fgroups','faculties','majors','programs','people','clubcats','clubs'];
  v_keys  text[];
begin
  if to_regclass('public.site_docs') is null then
    raise exception 'ไม่พบตาราง public.site_docs — ยังไม่เคยรัน schema.sql ของโปรเจกต์นี้';
  end if;
  if to_regprocedure('public.is_staff()') is null then
    raise exception 'ไม่พบฟังก์ชัน public.is_staff() — ยังไม่เคยรัน schema.sql ของโปรเจกต์นี้';
  end if;

  -- 1) รายการ key ที่อนุญาต = key เดิมตามสคีมา + 'cposts' + key ที่มีอยู่จริงในตาราง (กันแถวเดิมผิดกฎ)
  select coalesce(array_agg(k order by k), '{}') into v_keys
  from (
    select distinct k from unnest(
      v_base || array['cposts'] || coalesce((select array_agg(distinct key) from public.site_docs), '{}'::text[])
    ) as k
  ) s;

  -- 2) ลบเฉพาะ CHECK constraint ที่จำกัดค่า key (ไม่แตะ site_docs_shape ซึ่งตรวจชนิด array/object)
  for r in
    select conname
    from pg_constraint
    where conrelid = 'public.site_docs'::regclass
      and contype = 'c'
      and pg_get_constraintdef(oid) ilike '%key%'
      and pg_get_constraintdef(oid) not ilike '%jsonb_typeof%'
  loop
    execute format('alter table public.site_docs drop constraint %I', r.conname);
  end loop;

  execute format(
    'alter table public.site_docs add constraint site_docs_key_check check (key in (%s))',
    (select string_agg(quote_literal(k), ',') from unnest(v_keys) as k)
  );

  -- 3) ทดสอบจริงภายใน transaction: ลองใส่แถว 'cposts' (array ว่าง) แล้วย้อนกลับทันที
  --    ถ้า constraint (รวม site_docs_shape) ไม่รับ จะ error และทั้ง migration ถูกยกเลิก
  if not exists (select 1 from public.site_docs where key = 'cposts') then
    begin
      insert into public.site_docs (key, data) values ('cposts', '[]'::jsonb);
      raise exception 'cposts_probe_rollback';
    exception when others then
      if sqlerrm <> 'cposts_probe_rollback' then
        raise;
      end if;
    end;
  end if;
end $$;

-- ผู้เข้าชมทั่วไป: อ่านเฉพาะโพสต์ที่เผยแพร่ (status = 'published') เรียงตามลำดับในอาร์เรย์
-- รูปแบบเดียวกับ get_public_site()/_pub_rows แต่เป็นฟังก์ชันแยก จึงไม่กระทบระบบเดิม
create or replace function public.get_public_cposts()
returns jsonb language sql stable security definer set search_path = '' as $$
  select coalesce(jsonb_agg(r.v order by r.n), '[]'::jsonb)
  from jsonb_array_elements(
         case when jsonb_typeof((select data from public.site_docs where key = 'cposts')) = 'array'
              then (select data from public.site_docs where key = 'cposts') else '[]'::jsonb end
       ) with ordinality as r(v, n)
  where r.v->>'status' = 'published';
$$;
revoke all on function public.get_public_cposts() from public;
grant execute on function public.get_public_cposts() to anon, authenticated;

-- ผลตรวจหลังรัน (ดูผลลัพธ์แถวสุดท้ายนี้)
select jsonb_pretty(jsonb_build_object(
  'key_check',          (select pg_get_constraintdef(oid) from pg_constraint
                         where conrelid = 'public.site_docs'::regclass and conname = 'site_docs_key_check'),
  'shape_check',        (select pg_get_constraintdef(oid) from pg_constraint
                         where conrelid = 'public.site_docs'::regclass and conname = 'site_docs_shape'),
  'get_public_cposts',  public.get_public_cposts(),
  'media_bucket_exists',exists (select 1 from storage.buckets where id = 'media'),
  'rows_in_site_docs',  (select count(*) from public.site_docs)
)) as migration_result;

commit;

-- ย้อนกลับ (ถ้าจำเป็น; ไม่ลบข้อมูลโพสต์ที่บันทึกไว้):
--   drop function if exists public.get_public_cposts();
--   (CHECK constraint ที่ขยายแล้วปล่อยไว้ได้ ไม่มีผลเสีย; ถ้าจะถอนจริงให้ลบแถว key 'cposts' ก่อน)
