# โพสต์คอมมูนิตี้ (cposts) — ขั้นตอนนำไปใช้

ไฟล์ที่แก้: `app.js`, `style.css` (เพิ่มท้ายไฟล์เท่านั้น)
ไฟล์ที่ไม่แตะ: `index.html`, `schema.sql`
ไฟล์ SQL ใหม่: `00_preflight_readonly.sql` (อ่านอย่างเดียว), `01_migration_cposts.sql`

## ขั้นตอน
1. (แนะนำ) สำรองตาราง `site_docs` (Table Editor > site_docs > Export CSV)
2. Supabase > SQL Editor: รัน `00_preflight_readonly.sql` ตรวจว่า `site_docs_exists`, `is_staff_exists`, `get_public_site_exists` เป็น true
3. รัน `01_migration_cposts.sql` ผลลัพธ์สุดท้าย (migration_result) ควรมี `key_check` ที่มี 'cposts' และ `get_public_cposts` เป็น `[]`
4. นำ `app.js` และ `style.css` ไป commit/deploy บน Vercel (ลำดับ 3 กับ 4 สลับกันได้ เว็บไม่พังแม้ deploy ก่อน migration)
5. เข้าหลังบ้าน > จัดการโพสต์คอมมูนิตี้ > เพิ่มโพสต์ > ตั้งสถานะเป็น "เผยแพร่"
6. ตรวจหน้าแรกและ `#/community` ด้วยบัญชีที่ไม่ได้ล็อกอิน (หน้าต่างไม่ระบุตัวตน)

## ย้อนกลับ
ถอน `app.js`/`style.css` กลับเป็นเวอร์ชันเดิม ข้อมูลโพสต์ยังอยู่ใน `site_docs` key `cposts` ไม่ถูกลบ
