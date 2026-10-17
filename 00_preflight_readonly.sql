-- KIT — ตรวจสอบก่อน Migration (อ่านอย่างเดียว ไม่แก้ไขอะไรเลย)
-- วางทั้งไฟล์ใน Supabase > SQL Editor แล้วกด Run จะได้ผลลัพธ์เป็นแถวเดียว (JSON)
-- ส่งผลลัพธ์กลับมาได้ถ้าค่าไหนดูผิดปกติ

select jsonb_pretty(jsonb_build_object(
  'site_docs_exists',        to_regclass('public.site_docs') is not null,
  'is_staff_exists',         to_regprocedure('public.is_staff()') is not null,
  'get_public_site_exists',  to_regprocedure('public.get_public_site()') is not null,
  'get_public_cposts_exists',to_regprocedure('public.get_public_cposts()') is not null,
  'keys_in_use',             coalesce((select jsonb_agg(key order by key) from public.site_docs), '[]'::jsonb),
  'cposts_row_exists',       exists (select 1 from public.site_docs where key = 'cposts'),
  'check_constraints',       coalesce((
      select jsonb_agg(jsonb_build_object('name', conname, 'definition', pg_get_constraintdef(oid)) order by conname)
      from pg_constraint
      where conrelid = to_regclass('public.site_docs') and contype = 'c'), '[]'::jsonb),
  'media_bucket_exists',     exists (select 1 from storage.buckets where id = 'media'),
  'media_bucket_public',     coalesce((select public from storage.buckets where id = 'media'), false),
  'rls_enabled_on_site_docs',coalesce((select relrowsecurity from pg_class where oid = to_regclass('public.site_docs')), false)
)) as preflight;
