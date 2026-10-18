
/* ===== Auth hook (เดิม: ยังไม่มีหน้า login ฝั่งเว็บ การเขียนฐานข้อมูลถูกจำกัดโดยสิทธิ์เจ้าของ/ผู้แก้ไขของแพลตฟอร์ม) ===== */
/* ===== Supabase client + Auth (ใช้เฉพาะ anon/publishable key; สิทธิ์เขียนควบคุมด้วย RLS ในฐานข้อมูล) ===== */
const CFG=window.KIT_CONFIG||{};
/* ===== Loading Screen: ตัวควบคุมอยู่ใน index.html (inline) ที่นี่แค่แจ้งว่า app.js เริ่มทำงาน และแจ้งเมื่อข้อมูลหน้าแรกพร้อม ===== */
const KLD=window.KITLOADER||null;if(KLD)KLD.booted=true;
const kldReady=()=>{try{if(KLD)KLD.ready()}catch(e){}};
let SB=null;
try{if(CFG.supabaseUrl&&CFG.supabaseAnonKey&&window.supabase)SB=window.supabase.createClient(CFG.supabaseUrl,CFG.supabaseAnonKey,{auth:{persistSession:true,autoRefreshToken:true,detectSessionInUrl:false}})}catch(e){SB=null}
const Auth={session:null,staff:false,email:'',canAccessAdmin(){return !!(this.session&&this.staff)}};
const LOGIN={busy:false,msg:'',email:''};
/* ===== Published snapshot: ข้อมูลที่ฝังตอนกด "เผยแพร่" (เริ่มต้นว่างจริง) ===== */
const EMB={};
/* ===== ธีมกลางวัน/กลางคืน (จำค่าใน localStorage ของเบราว์เซอร์ผู้ใช้) ===== */
const SUN='<circle cx="12" cy="12" r="4"/><path d="M12 2v2M12 20v2M4.9 4.9l1.4 1.4M17.7 17.7l1.4 1.4M2 12h2M20 12h2M4.9 19.1l1.4-1.4M17.7 6.3l1.4-1.4"/>',MOON='<path d="M21 12.8A9 9 0 1111.2 3a7 7 0 009.8 9.8z"/>';
const stGet=()=>{try{const v=localStorage.getItem('kit-theme');return v==='light'||v==='dark'?v:null}catch(e){return null}};
const sysDark=()=>!!(window.matchMedia&&matchMedia('(prefers-color-scheme: dark)').matches);
const curTheme=()=>document.documentElement.getAttribute('data-theme')||(sysDark()?'dark':'light');
const thLabel=()=>curTheme()==='dark'?'สลับเป็นโหมดกลางวัน':'สลับเป็นโหมดกลางคืน';
function initTheme(){document.documentElement.setAttribute('data-theme',stGet()||(sysDark()?'dark':'light'));if(window.matchMedia)try{matchMedia('(prefers-color-scheme: dark)').addEventListener('change',e=>{if(!stGet()){document.documentElement.setAttribute('data-theme',e.matches?'dark':'light');thSync()}})}catch(e){}}
function thSync(){document.querySelectorAll('.tgl').forEach(b=>{b.title=thLabel();b.setAttribute('aria-label',thLabel())})}
function toggleTheme(){const n=curTheme()==='dark'?'light':'dark',h=document.documentElement;h.classList.add('tt');h.setAttribute('data-theme',n);try{localStorage.setItem('kit-theme',n)}catch(e){}thSync();clearTimeout(window.__tt);window.__tt=setTimeout(()=>h.classList.remove('tt'),450)}
const themeBtn=()=>`<button type="button" class="tgl" onclick="toggleTheme()" title="${thLabel()}" aria-label="${thLabel()}"><span class="ti sun"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${SUN}</svg></span><span class="ti moon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${MOON}</svg></span></button>`;
initTheme();
/* ===== Brand: ชื่อและโลโก้ชุดเดียว (แหล่งข้อมูลกลาง) ===== */
const BRAND={th:'โรงเรียนสาธิตโกศาดิลก',en:'Kosadilok Demonstration School',short:'KDS'};
const OLDNAMES=['วิทยาลัยเทคโนโลยีโกศาดิลก','KOSADILOK COLLEGE OF TECHNOLOGY','สถาบันเทคโนโลยีโกศาดิลก','Kosadilok Institute of Technology'];
const KL='M0 0h11v48H0zM11 24L31 0H44L24 24L44 48H31zM52 0h11v48H52zM70 0h38v11H94.5v37H83.5V11H70z';let kid=0;
const KDS_LOGO='logo-kds-256.png';
function kitMark(h){return `<img class="kit kds" src="${KDS_LOGO}" height="${h}" alt="${BRAND.short}" decoding="async">`}
function kitTile(s){return `<img class="kit kds" src="${KDS_LOGO}" width="${s}" height="${s}" alt="${BRAND.short}" decoding="async">`}
/* ===== helpers ===== */
const byo=(a,b)=>(+a.order||0)-(+b.order||0),clone=o=>JSON.parse(JSON.stringify(o));
const STRIP=s=>typeof s==='string'?s.replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,''):s;
const E=s=>String(s==null?'':s).replace(/[\p{Extended_Pictographic}\uFE0F\u200D]/gu,'').replace(/[&<>"]/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;'}[c]));
const $=id=>document.getElementById(id);
const okU=u=>/^https:\/\//i.test(u||'');
const okL=u=>/^https:\/\//i.test(u||'')||/^#\//.test(u||'');
const I={calendar:'<rect x="3" y="4" width="18" height="18" rx="2"/><path d="M16 2v4M8 2v4M3 10h18"/>',pin:'<path d="M20 10c0 6-8 12-8 12S4 16 4 10a8 8 0 0116 0z"/><circle cx="12" cy="10" r="3"/>',clock:'<circle cx="12" cy="12" r="10"/><path d="M12 6v6l4 2"/>',left:'<path d="M15 18l-6-6 6-6"/>',right:'<path d="M9 18l6-6-6-6"/>',ext:'<path d="M15 3h6v6M10 14L21 3M18 13v6a2 2 0 01-2 2H5a2 2 0 01-2-2V8a2 2 0 012-2h6"/>',grad:'<path d="M22 10L12 5 2 10l10 5 10-5z"/><path d="M6 12v5c3 3 9 3 12 0v-5"/>',users:'<path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 00-3-3.9M16 3.1a4 4 0 010 7.8"/>',user:'<path d="M20 21v-2a4 4 0 00-4-4H8a4 4 0 00-4 4v2"/><circle cx="12" cy="7" r="4"/>',award:'<circle cx="12" cy="8" r="6"/><path d="M15.5 13.5L17 22l-5-3-5 3 1.5-8.5"/>',search:'<circle cx="11" cy="11" r="8"/><path d="M21 21l-4.3-4.3"/>',edit:'<path d="M12 20h9"/><path d="M16.5 3.5a2.1 2.1 0 013 3L7 19l-4 1 1-4z"/>',check:'<path d="M22 11.1V12a10 10 0 11-5.9-9.1"/><path d="M22 4L12 14l-3-3"/>',withdraw:'<path d="M10 21H6a2 2 0 01-2-2V5a2 2 0 012-2h7l5 5v2"/><path d="M13 3v5h5"/><path d="M9 16h12M17 12l4 4-4 4"/>',close:'<path d="M18 6L6 18M6 6l12 12"/>',lock:'<rect x="5" y="11" width="14" height="10" rx="2"/><path d="M8 11V8a4 4 0 018 0v3"/>',chev:'<path d="M6 9l6 6 6-6"/>',menu:'<path d="M4 7h16M4 12h16M4 17h16"/>'};
const ic=n=>`<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" style="vertical-align:-.15em" aria-hidden="true">${I[n]||''}</svg>`;
const empty=()=>'<p style="opacity:.6">ยังไม่มีรายการ</p>';
const nf=()=>'<div class="w sec"><h1>ไม่พบหน้านี้</h1><p><a href="#/">กลับหน้าแรก</a></p></div>';
let DBS=SB?'pending':'noconfig',CW=null;
const dbOff=()=>({pending:'กำลังเชื่อมต่อฐานข้อมูล รอสักครู่ ยังบันทึกไม่ได้ในตอนนี้',noconfig:'ยังไม่ได้ตั้งค่า Supabase (ไม่พบ SUPABASE_URL / SUPABASE_ANON_KEY ตอน Build) จึงบันทึกไม่ได้',error:'เชื่อมต่อฐานข้อมูลไม่ได้ ตรวจสอบการตั้งค่า Supabase และลองโหลดหน้าใหม่'}[DBS]||'ฐานข้อมูลใช้ไม่ได้ในมุมมองนี้');
const ERR={'42501':'ไม่มีสิทธิ์เขียนข้อมูล (บัญชีนี้ต้องอยู่ในรายชื่อทีมงาน)','PGRST301':'เซสชันหมดอายุ ให้เข้าสู่ระบบใหม่','PGRST303':'เซสชันหมดอายุ ให้เข้าสู่ระบบใหม่','23514':'รูปแบบข้อมูลไม่ถูกต้อง','403':'ไม่มีสิทธิ์อัปโหลด (บัญชีต้องเป็นทีมงาน และต้องรัน supabase/schema.sql แล้ว)','404':'ไม่พบ Storage bucket "campus" (รัน supabase/schema.sql)','413':'ไฟล์ใหญ่เกินกำหนด','42P01':'ยังไม่ได้สร้างตารางใน Supabase (รัน supabase/schema.sql)'};
const dbErr=(m,e)=>{const c=(e&&(e.code||e.status))||'error';say(m+': '+(ERR[c]||(e&&e.message)||'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')+' ('+c+')',false)};
/* ===== State & data (ไม่มีค่าเริ่มต้นใด ๆ: ว่างจนกว่าผู้ดูแลจะสร้างเอง) ===== */
const SHR={};let WC={},RL=null,DBH=null,toast=null,sbc=innerWidth<760,last='';
const BASE={nameTh:BRAND.th,nameEn:BRAND.en,footer:''};
const PVK=['ptypes','pgroups','pdepartments','ctplans','ctcourses','cttables'];/* ประเภทบุคลากร/กลุ่มสาระ/แผนการเรียน/รายวิชาในโครงสร้างหลักสูตร/ตารางเรียน: เก็บใน settings[k] (site_docs 'settings') ไม่เพิ่ม key ใหม่ในฐานข้อมูล */
const getSH=k=>{if(PVK.includes(k)){const st=SHR.settings!=null?SHR.settings:EMB.settings;return st&&Array.isArray(st[k])?st[k]:null}const a=SHR[k]!=null?SHR[k]:EMB[k];return a!=null?a:null};
const getMenu=()=>getSH('menu')||[];
const getEvents=()=>getSH('events')||[];
const getPages=()=>getSH('pages')||[];
const getSet=()=>{const o=Object.assign({},BASE,getSH('settings')||{});if(OLDNAMES.includes(o.nameTh))o.nameTh=BASE.nameTh;if(OLDNAMES.some(n=>n.toLowerCase()===String(o.nameEn).toLowerCase()))o.nameEn=BASE.nameEn;return o};
const pgById=id=>getPages().find(p=>p.id===id);
const hrefOf=m=>{if(m.kind!=='cms')return m.href;const p=pgById(m.pageId);return p&&p.slug?'#/p/'+p.slug:''};
const say=(t,ok=true)=>{toast={t,ok};render()};
const KINDS=[['cms','หน้าที่สร้างจากหลังบ้าน'],['url','ลิงก์ภายนอก'],['heading','หัวข้อ (เปิดเมนูย่อย)']];
const STY=[['heading','หัวข้อ'],['text','ข้อความ'],['image','รูปภาพ'],['cards','การ์ด'],['button','ปุ่ม'],['linkcards','การ์ดลิงก์ปุ่ม'],['calendar','ปฏิทินกิจกรรม'],['campusmap','แผนผังสถาบัน'],['faculties','รวมคณะและวิทยาลัย'],['people','บุคลากรและทีมผู้บริหาร'],['news','ข่าวสารและประกาศ (กรองตามหมวด)'],['clubs','ชมรมนักศึกษา'],['courses','รายวิชาทั้งหมด'],['timetable','ตารางเรียน']];
const ICONS=[['','ไม่มีไอคอน'],['grad','นักศึกษา'],['award','ทุน/รางวัล'],['users','อาจารย์/กลุ่ม'],['user','บุคคล'],['search','ตรวจสอบ'],['edit','แก้ไข'],['check','ยืนยัน'],['withdraw','แจ้งถอน/ยกเลิก']];
const stTag=p=>`<span class="tag">${p.status==='published'?'เผยแพร่':'ฉบับร่าง'}</span>`;
const mkId=p=>p+Date.now().toString(36)+Math.random().toString(36).slice(2,4);
async function putDoc(k,val){if(!SB||!DBH)throw {code:'42501',message:dbOff()};if(PVK.includes(k)){const cur=Object.assign({},getSH('settings')||{});cur[k]=val;const {error:e2}=await SB.from('site_docs').upsert({key:'settings',data:cur,updated_at:new Date().toISOString()});if(e2)throw e2;SHR.settings=cur;return}const {error}=await SB.from('site_docs').upsert({key:k,data:val,updated_at:new Date().toISOString()});if(error)throw error;SHR[k]=val}
/* ===== โหลดข้อมูล: ผู้เข้าชม = get_public_site() (เฉพาะที่เผยแพร่) / ทีมงาน = ตาราง site_docs ทั้งหมด + Realtime ===== */
const liveRender=()=>{if(CE.on&&$('ce-view')){ceRemote();return}const a=document.activeElement;if(location.hash.startsWith('#/admin')&&a&&a.matches('input,textarea,select'))return;const pq=a&&a.id==='pvq',ss=pq?a.selectionStart:0,se=pq?a.selectionEnd:0;render();if(pq){const n=$('pvq');if(n){n.focus();try{n.setSelectionRange(ss,se)}catch(e){}}}};
async function loadPublic(){const {data,error}=await SB.rpc('get_public_site');if(error)throw error;['menu','pages','events','settings','campus','fgroups','faculties','majors','programs','people','clubcats','clubs','cposts','news'].forEach(k=>{if(data&&data[k]!=null)SHR[k]=data[k]});
 /* get_public_site() ใหม่ส่ง cposts/news มาแล้ว (เรียกครั้งเดียว) — ถ้ายังไม่ได้รัน migration_homepage.sql ให้ถอยไปใช้ RPC เดิมของโพสต์ */if(!data||!Array.isArray(data.cposts)){try{const {data:cp,error:ce}=await SB.rpc('get_public_cposts');if(!ce&&Array.isArray(cp))SHR.cposts=cp}catch(e){}}}
async function loadAll(){const {data,error}=await SB.from('site_docs').select('key,data');if(error)throw error;(data||[]).forEach(r=>{SHR[r.key]=r.data})}
async function bootStaff(){const {data:{session}}=await SB.auth.getSession();Auth.session=session||null;Auth.staff=false;Auth.email=session&&session.user?session.user.email||'':'';DBH=null;CW=null;
 if(!session)return;const {data,error}=await SB.rpc('is_staff');if(error)throw error;Auth.staff=data===true;
 if(!Auth.staff)return;DBH=SB;CW=true;await loadAll();
 SB.channel('site_docs_rt').on('postgres_changes',{event:'*',schema:'public',table:'site_docs'},p=>{if(p.eventType==='DELETE'){if(p.old&&p.old.key)delete SHR[p.old.key]}else if(p.new&&p.new.key)SHR[p.new.key]=p.new.data;liveRender()}).subscribe()}
async function initDb(){if(!SB){DBS='noconfig';try{render()}finally{kldReady()}return}
 try{await bootStaff();if(!Auth.staff)await loadPublic();DBS='ok'}catch(e){DBS='error';console.error('Supabase:',e)}
 try{render()}finally{kldReady()}}
/* ===== หน้าเข้าสู่ระบบทีมงาน ===== */
function loginView(){let b;
 if(!SB)b=`<div class="msg er">${E(dbOff())}</div>`;
 else if(DBS==='pending')b='<p>กำลังตรวจสอบสิทธิ์...</p>';
 else b=`<div class="w sec" style="max-width:420px;padding:0"><h1>Staff Only</h1><p>Authorized personnel only.</p>${LOGIN.msg?`<div class="msg er">${E(LOGIN.msg)}</div>`:''}${Auth.session&&!Auth.staff?`<div class="msg er">บัญชี ${E(Auth.email)} ไม่ได้อยู่ในรายชื่อทีมงาน <button type="button" class="btn s" onclick="doLogout()">ออกจากระบบ</button></div>`:''}<form onsubmit="doLogin();return false"><label for="lg_e">อีเมล</label><input id="lg_e" type="email" autocomplete="username" required value="${E(LOGIN.email)}"><label for="lg_p">รหัสผ่าน</label><input id="lg_p" type="password" autocomplete="current-password" required><p><button type="submit" class="btn b"${LOGIN.busy?' disabled':''}>${LOGIN.busy?'กำลังเข้าสู่ระบบ...':'เข้าสู่ระบบ'}</button></p></form><p><a class="bk" href="#/">&#8592; กลับหน้าเว็บไซต์</a></p></div>`;
 return shell(`<div class="w sec">${b}</div>`)}
async function doLogin(){const e=$('lg_e').value.trim(),p=$('lg_p').value;LOGIN.email=e;if(!e||!p){LOGIN.msg='กรอกอีเมลและรหัสผ่าน';return render()}
 LOGIN.busy=true;LOGIN.msg='';render();
 try{const {error}=await SB.auth.signInWithPassword({email:e,password:p});if(error){LOGIN.msg='เข้าสู่ระบบไม่สำเร็จ: อีเมลหรือรหัสผ่านไม่ถูกต้อง';LOGIN.busy=false;return render()}
  await bootStaff();if(!Auth.staff){LOGIN.msg='บัญชีนี้ไม่ได้รับอนุญาตให้เข้าหลังบ้าน';await SB.auth.signOut();Auth.session=null;Auth.email=''}}
 catch(er){LOGIN.msg='เชื่อมต่อไม่สำเร็จ: '+((er&&er.message)||'ไม่ทราบสาเหตุ')}
 LOGIN.busy=false;render()}
async function doLogout(){try{await SB.auth.signOut()}catch(e){}location.hash='#/';location.reload()}
/* ===== Shell (เมนูมาจากฐานข้อมูลเท่านั้น) ===== */
const visMenu=()=>getMenu().filter(m=>m.show!==false&&(m.kind!=='cms'||(pgById(m.pageId)||{}).status==='published')).map(m=>m.kind==='cms'?Object.assign({},m,{href:hrefOf(m)}):m);
function shell(body){const s=getSet(),h=location.hash||'#/';
 const lb=m=>`<span class="dl">${E(m.label)}</span><span class="ml">${E(m.m||m.label)}</span>`,act=m=>m.kind!=='url'&&m.kind!=='heading'&&m.href&&(h===m.href||(m.href!=='#/'&&h.startsWith(m.href))),tg=m=>m.kind==='url'&&m.tab==='new'?' target="_blank" rel="noopener noreferrer"':'',vis=visMenu(),
 A=(m,c)=>m.href?`<a href="${E(m.href)}" class="${c}"${tg(m)}>${lb(m)}</a>`:`<span class="dis" aria-disabled="true">${lb(m)} <small>(ยังไม่ได้ตั้งค่าลิงก์)</small></span>`,
 lk=vis.filter(m=>!m.parent).sort(byo).map(m=>{const ch=vis.filter(c=>c.parent===m.id).sort(byo);if(!ch.length)return m.kind==='heading'||!m.href?'':`<a href="${E(m.href)}" class="${act(m)?'on':''}"${tg(m)}>${lb(m)}</a>`;const it=(m.kind!=='heading'&&m.href?[m]:[]).concat(ch);return `<div class="dd${it.some(act)?' act':''}"><button type="button" class="ddb" aria-haspopup="true" aria-expanded="false" onclick="ddt(this)">${lb(m)} ${ic('chev')}</button><div class="dd-m"><div class="dd-i">${it.map(c=>A(c,act(c)?'on':'')).join('')}</div></div></div>`}).join('');
 return `<header><div class="hw"><nav><a class="logo" href="#/" aria-label="${E(s.nameEn)}">${kitMark(44)}<span class="ln"><span class="le">${E(s.nameEn)}</span><span class="lt">${E(s.nameTh)}</span></span></a><button class="burger" aria-label="เมนู" onclick="nv()">${ic('menu')}</button><div class="links">${lk}</div></nav>${soundBtn()}${themeBtn()}<a class="lock" href="#/admin" aria-label="Staff Only" title="Staff Only">${ic('lock')}</a></div></header>${body}
 <footer><div class="w"><div class="fbd">${kitMark(60)}<div class="fbt"><b>${E(s.nameTh)}</b><br>${E(s.nameEn)} (${BRAND.short})${s.footer?`<p class="pl">${E(s.footer)}</p>`:''}</div></div>${(fl=>fl.length?`<p class="fl">${fl.map(m=>`<a href="${E(m.href)}"${tg(m)}>${E(m.label)}</a>`).join('')}</p>`:'')(vis.filter(m=>!m.parent&&m.href&&m.kind!=='heading').sort(byo))}</div></footer>`}
function closeDd(){document.querySelectorAll('.dd.open').forEach(d=>{d.classList.remove('open');d.querySelector('.ddb').setAttribute('aria-expanded','false')})}
function ddt(b){const d=b.parentElement,o=!d.classList.contains('open');closeDd();d.classList.toggle('open',o);b.setAttribute('aria-expanded',o)}
function nv(){document.querySelector('.links').classList.toggle('open')}

/* ===== ปฏิทินและกิจกรรม (ข้อมูลชุดเดียว: site/events) ===== */
const TH_M=['มกราคม','กุมภาพันธ์','มีนาคม','เมษายน','พฤษภาคม','มิถุนายน','กรกฎาคม','สิงหาคม','กันยายน','ตุลาคม','พฤศจิกายน','ธันวาคม'],TH_MS=['ม.ค.','ก.พ.','มี.ค.','เม.ย.','พ.ค.','มิ.ย.','ก.ค.','ส.ค.','ก.ย.','ต.ค.','พ.ย.','ธ.ค.'],TH_D=['อา.','จ.','อ.','พ.','พฤ.','ศ.','ส.'];
const p2=n=>String(n).padStart(2,'0'),ymd=(y,m,d)=>y+'-'+p2(m+1)+'-'+p2(d);
const todayS=()=>thNow().slice(0,10);
const okD=v=>{if(!/^\d{4}-\d{2}-\d{2}$/.test(v||''))return false;const [y,m,d]=v.split('-').map(Number),t=new Date(y,m-1,d);return t.getFullYear()===y&&t.getMonth()===m-1&&t.getDate()===d};
const okT=v=>/^([01]\d|2[0-3]):[0-5]\d$/.test(v||'');
const fmtD=v=>{const [y,m,d]=v.split('-').map(Number);return d+' '+TH_MS[m-1]+' '+(y+543)};
const fmtRange=e=>e.endDate&&e.endDate!==e.startDate?fmtD(e.startDate)+' – '+fmtD(e.endDate):fmtD(e.startDate);
const fmtTime=e=>e.startTime?'เวลา '+e.startTime+(e.endTime?'–'+e.endTime:'')+' น.':'ตลอดวัน';
let PVW=false,CAL={y:null,m:null,sel:null,f:'all'};
const evVis=()=>getEvents().filter(e=>okD(e.startDate)&&(PVW||e.status==='published')).sort((a,b)=>(a.startDate+(a.startTime||'')).localeCompare(b.startDate+(b.startTime||'')));
/* เวลาไทย (UTC+7 ไม่มีเวลาออมแสง) 'YYYY-MM-DD HH:MM' — ใช้เทียบสถานะกิจกรรมแทนเวลาเครื่องผู้เข้าชม */
const thNow=()=>{const d=new Date(Date.now()+252e5),p=n=>String(n).padStart(2,'0');return d.getUTCFullYear()+'-'+p(d.getUTCMonth()+1)+'-'+p(d.getUTCDate())+' '+p(d.getUTCHours())+':'+p(d.getUTCMinutes())};
const EV_ST={up:'กำลังจะมาถึง',on:'กำลังดำเนินอยู่',past:'สิ้นสุดแล้ว'},EV_FL=[['all','ทั้งหมด','กิจกรรมทั้งหมด'],['up','กำลังจะมาถึง','กิจกรรมที่กำลังจะมาถึง'],['on','กำลังดำเนินอยู่','กิจกรรมที่กำลังดำเนินอยู่'],['past','สิ้นสุดแล้ว','กิจกรรมที่สิ้นสุดแล้ว']];
/* สถานะกิจกรรม: up=ยังไม่ถึงเวลาเริ่ม · on=อยู่ระหว่างเริ่ม–สิ้นสุด · past=เลยเวลาสิ้นสุด · null=ข้อมูลไม่พอ/ขัดแย้ง (แสดงเฉพาะ "ทั้งหมด")
   ไม่มีเวลาเริ่ม = เริ่มต้นวัน · ไม่มีเวลาสิ้นสุด/วันสิ้นสุด = นับถึงสิ้นวัน (สิ้นสุดของวันเริ่มถ้าไม่มีวันสิ้นสุด) · ค่าที่กรอกแต่รูปแบบผิด หรือสิ้นสุดก่อนเริ่ม = null */
function evStatus(e,now){now=now||thNow();if(!e||!okD(e.startDate))return null;if((e.startTime&&!okT(e.startTime))||(e.endTime&&!okT(e.endTime))||(e.endDate&&!okD(e.endDate)))return null;
 const s=e.startDate+' '+(e.startTime||'00:00'),en=(e.endDate||e.startDate)+' '+(e.endTime||'23:59');if(en<s)return null;return now<s?'up':now<=en?'on':'past'}
const evOn=(d,L)=>L.filter(e=>e.startDate<=d&&d<=(e.endDate||e.startDate));
function calView(){const now=new Date();if(CAL.y==null){CAL.y=now.getFullYear();CAL.m=now.getMonth()}const L=evVis(),y=CAL.y,m=CAL.m,first=new Date(y,m,1).getDay(),n=new Date(y,m+1,0).getDate(),td=todayS(),tail=(7-(first+n)%7)%7;
 let cells=TH_D.map(d=>`<div class="cw" aria-hidden="true">${d}</div>`).join('');for(let i=0;i<first;i++)cells+='<div class="cd off" aria-hidden="true"></div>';
 for(let d=1;d<=n;d++){const s=ymd(y,m,d),ev=evOn(s,L),ch=ev.slice(0,2).map(e=>`<span class="chip" role="button" tabindex="0" onclick="event.stopPropagation();calEv('${e.id}')" onkeydown="if(event.key==='Enter'){event.stopPropagation();calEv('${e.id}')}">${E(e.title)}</span>`).join(''),more=ev.length>2?`<span class="more">+${ev.length-2} กิจกรรม</span>`:'';
  cells+=`<button type="button" class="cd${s===td?' td':''}${CAL.sel===s?' sel':''}${ev.length?' has':''}" data-d="${s}" onclick="calSel('${s}')" aria-label="${d} ${TH_M[m]} ${y+543}${ev.length?' มี '+ev.length+' กิจกรรม':''}"${s===td?' aria-current="date"':''}><span class="dn">${d}</span><span class="ce">${ch}${more}</span>${ev.length?`<span class="cdots">${'<i></i>'.repeat(Math.min(ev.length,3))}</span>`:''}</button>`}
 for(let i=0;i<tail;i++)cells+='<div class="cd off" aria-hidden="true"></div>';
 const f=EV_FL.some(x=>x[0]===CAL.f)?CAL.f:'all',tn=thNow(),ST=new Map(L.map(e=>[e.id,evStatus(e,tn)])),cnt={all:L.length,up:0,on:0,past:0};ST.forEach(s=>{if(s)cnt[s]++});
 const rk={on:0,up:1,past:3},rkOf=e=>{const r=rk[ST.get(e.id)];return r===undefined?2:r},kf=e=>e.startDate+(e.startTime||''),
 ord=a=>a.slice().sort((a,b)=>{const ra=rkOf(a),rb=rkOf(b);if(ra!==rb)return ra-rb;const c=kf(a).localeCompare(kf(b));return ra===3?-c:c}),
 sh=CAL.sel?evOn(CAL.sel,L):ord(f==='all'?L:L.filter(e=>ST.get(e.id)===f)),
 ttl=CAL.sel?'กิจกรรมวันที่ '+fmtD(CAL.sel):EV_FL.find(x=>x[0]===f)[2]+' ('+cnt[f]+')',
 emp=!L.length?'ยังไม่มีกิจกรรมที่เผยแพร่':CAL.sel?'ไม่มีกิจกรรมในวันนี้':'ไม่มีกิจกรรมในหมวดนี้',
 flt=`<div class="evf" role="group" aria-label="กรองกิจกรรมตามสถานะ">${EV_FL.map(x=>`<button type="button" class="evfb${f===x[0]&&!CAL.sel?' on':''}" aria-pressed="${f===x[0]&&!CAL.sel}" onclick="calFil('${x[0]}')">${x[1]} <small>${cnt[x[0]]}</small></button>`).join('')}</div>`,
 stg=e=>{const s=ST.get(e.id);return s?`<span class="tag evst evst-${s}">${EV_ST[s]}</span>`:''};
 const item=e=>`<button type="button" class="ev" data-ev="${e.id}" onclick="calEv('${e.id}')"><span class="evd">${ic('calendar')} ${E(fmtRange(e))}</span><b>${E(e.title)}</b><span class="evm">${ic('clock')} ${E(fmtTime(e))}</span>${e.place?`<span class="evm">${ic('pin')} ${E(e.place)}</span>`:''}<span>${stg(e)}${e.type?`<span class="tag">${E(e.type)}</span>`:''}${e.status!=='published'?'<span class="tag">ฉบับร่าง</span>':''}</span>${e.desc?`<span class="evx">${E(e.desc)}</span>`:''}</button>`;
 return `<div class="calwrap"><div class="cal"><div class="ct"><button type="button" class="cb" onclick="calNav(-1)" aria-label="เดือนก่อนหน้า">${ic('left')}</button><h2 class="cm" aria-live="polite">${TH_M[m]} ${y+543}</h2><button type="button" class="cb" onclick="calNav(1)" aria-label="เดือนถัดไป">${ic('right')}</button><button type="button" class="btn s" onclick="calToday()">เดือนปัจจุบัน</button></div><div class="cg">${cells}</div></div><div class="evl">${flt}<h3 class="evh">${E(ttl)}</h3>${CAL.sel?'<p style="margin:0"><button type="button" class="btn s" onclick="calSel(CAL.sel)">ดูตามตัวกรอง</button></p>':''}<div class="evlist">${sh.length?sh.map(item).join(''):`<div class="empty-ev">${emp}</div>`}</div></div></div>`}
function calNav(d){CAL.m+=d;if(CAL.m<0){CAL.m=11;CAL.y--}if(CAL.m>11){CAL.m=0;CAL.y++}CAL.sel=null;render()}
function calToday(){const n=new Date();CAL.y=n.getFullYear();CAL.m=n.getMonth();CAL.sel=null;render()}
function calFil(k){CAL.f=k;CAL.sel=null;render()}
function calSel(d){CAL.sel=CAL.sel===d?null:d;render()}
const calClose=()=>{$('md').innerHTML=''};
const kdZoom=(u,t)=>{if(!okU(u))return;$('md').innerHTML=`<div class="modal wide kdz" role="dialog" aria-modal="true" aria-label="${E(t||'รูปภาพ')}" onclick="if(event.target===this)calClose()"><div><button type="button" class="mx" aria-label="ปิดรูปภาพ" onclick="calClose()">${ic('close')}</button><img class="evi" src="${E(u)}" alt="${E(t||'')}"></div></div>`};
document.addEventListener('click',e=>{const t=e.target.closest&&e.target.closest('img[data-zoom]');if(t)kdZoom(t.dataset.zoom,t.dataset.zalt)});
function calEv(id){const e=evVis().find(x=>x.id===id);if(!e)return;$('md').innerHTML=`<div class="modal wide" role="dialog" aria-modal="true" aria-label="${E(e.title)}" onclick="if(event.target===this)calClose()"><div><button type="button" class="mx" aria-label="ปิดรายละเอียด" onclick="calClose()">${ic('close')}</button>${okU(e.img)?`<img class="evi" src="${E(e.img)}" alt="${E(e.title)}">`:''}<h3>${E(e.title)}</h3><p class="evm">${ic('calendar')} ${E(fmtRange(e))}</p><p class="evm">${ic('clock')} ${E(fmtTime(e))}</p>${e.place?`<p class="evm">${ic('pin')} ${E(e.place)}</p>`:''}<p>${e.type?`<span class="tag">${E(e.type)}</span>`:''}${e.status!=='published'?'<span class="tag">ฉบับร่าง</span>':''}</p>${e.desc?`<p class="pl">${E(e.desc)}</p>`:''}${okU(e.url)&&!cpUrlBasic(e.url)?`<p><a class="btn b" href="${E(e.url)}" target="_blank" rel="noopener noreferrer">ลิงก์รายละเอียดเพิ่มเติม ${ic('ext')}<span class="sr">(เปิดในแท็บใหม่)</span></a></p>`:''}<p><button type="button" class="btn" onclick="calClose()">ปิด</button></p></div></div>`}
/* ===== การ์ดลิงก์ปุ่ม (ลิงก์ตั้งจากหลังบ้าน ไม่มี URL สมมติ) ===== */
function lcHtml(s){const it=(s.items||[]).filter(c=>c&&(c.t||c.d||c.u||c.b));if(!it.length)return '<div class="empty-ev">ยังไม่มีการ์ด</div>';return `<div class="lcg">${it.map(c=>{const ok=okU(c.u),lb=E(c.b||'เปิดลิงก์'),ed=elD(c.st);return `<div class="lc${ed.c}"${ed.a}>${c.i&&I[c.i]?`<span class="lci">${ic(c.i)}</span>`:''}<h3>${E(c.t)}</h3>${c.d?`<p>${E(c.d)}</p>`:''}${ok?`<a class="btn b" href="${E(c.u)}" target="_blank" rel="noopener noreferrer">${lb} ${ic('ext')}<span class="sr">(เปิดในแท็บใหม่)</span></a>`:`<p class="unset">ยังไม่ได้ตั้งค่าลิงก์</p><button type="button" class="btn" disabled aria-disabled="true">${lb}</button>`}</div>`}).join('')}</div>`}
/* ===== Admin: จัดการกิจกรรม ===== */
function eventsAdmin(){const L=getEvents().slice().sort((a,b)=>(a.startDate||'').localeCompare(b.startDate||''));
 return `<h1>จัดการกิจกรรมปฏิทิน</h1><p>กิจกรรมทั้งหมดอยู่ในชุดข้อมูลเดียว ใช้ทั้งปฏิทินและรายการกิจกรรม ผู้เข้าชมเห็นเฉพาะกิจกรรมที่เผยแพร่</p>${dbBanner()}${L.length?`<p><button class="btn b" onclick="evnew()">+ เพิ่มกิจกรรม</button></p>`+L.map(e=>`<div class="row" data-evr="${e.id}"><b>${E(e.title)}</b> ${stTag(e)}<br><small>${okD(e.startDate)?E(fmtRange(e))+' · '+E(fmtTime(e)):'ยังไม่ได้ตั้งวันที่'}${e.place?' · '+E(e.place):''}${e.type?' · '+E(e.type):''}</small><br><a class="btn s" href="#/admin/events/edit/${e.id}">แก้ไข</a> <button class="btn s" onclick="evtog('${e.id}')">${e.status==='published'?'ซ่อนกิจกรรม':'เผยแพร่กิจกรรม'}</button> <button class="btn s c" onclick="evask('${e.id}')">ลบ</button></div>`).join(''):`<div class="hint"><h2>ยังไม่มีกิจกรรม</h2><p>เพิ่มกิจกรรมแรก ปฏิทินจะแสดงเมื่อกิจกรรมมีสถานะเผยแพร่และกด "เผยแพร่ให้ผู้เข้าชมทั่วไป"</p><button class="btn b" onclick="evnew()">+ เพิ่มกิจกรรมแรก</button></div>`}<h2>เผยแพร่ให้ผู้เข้าชมทั่วไป</h2>${dbBanner()}`}
async function evnew(){if(!DBH)return say(dbOff(),false);const id=mkId('ev'),L=clone(getEvents());L.push({id,title:'กิจกรรมใหม่',startDate:todayS(),endDate:'',startTime:'',endTime:'',place:'',type:'',desc:'',img:'',url:'',status:'draft',updated:Date.now()});try{await putDoc('events',L);location.hash='#/admin/events/edit/'+id}catch(e){dbErr('เพิ่มกิจกรรมไม่สำเร็จ',e)}}
async function evtog(id){if(!DBH)return say(dbOff(),false);const L=clone(getEvents()),e=L.find(x=>x.id===id);e.status=e.status==='published'?'draft':'published';e.updated=Date.now();try{await putDoc('events',L);say(e.status==='published'?'ตั้งสถานะเผยแพร่แล้ว (ผู้เข้าชมทั่วไปเห็นทันที)':'ซ่อนกิจกรรมแล้ว (กลับเป็นฉบับร่าง)')}catch(er){dbErr('บันทึกไม่สำเร็จ',er)}}
function evask(id){$('md').innerHTML=`<div class="modal"><div><h3>ยืนยันการลบกิจกรรม</h3><p>กิจกรรมนี้จะถูกลบถาวรจากปฏิทินและรายการ</p><button class="btn c" onclick="evdel('${id}')">ลบกิจกรรม</button> <button class="btn" onclick="$('md').innerHTML=''">ยกเลิก</button></div></div>`}
async function evdel(id){$('md').innerHTML='';if(!DBH)return say(dbOff(),false);try{await putDoc('events',getEvents().filter(e=>e.id!==id));location.hash='#/admin/events';say('ลบกิจกรรมเรียบร้อย')}catch(e){dbErr('ลบไม่สำเร็จ',e)}}
function eventEditor(id){if(!WC.ev)WC.ev=clone(getEvents());const e=WC.ev.find(x=>x.id===id);if(!e)return '<p><a href="#/admin/events">← จัดการกิจกรรม</a></p><h1>ไม่พบกิจกรรม</h1>';
 const f=(l,k,v,t,ph)=>`<label>${l}</label><input name="ev_${k}" type="${t||'text'}" value="${E(v)}" ${ph?`placeholder="${ph}"`:''}>`;
 return `<p><a href="#/admin/events">← จัดการกิจกรรม</a></p><h1>แก้ไขกิจกรรม</h1>${dbBanner()}<form id="af" onsubmit="return false">${f('ชื่อกิจกรรม','title',e.title)}<div class="g2">${f('วันที่เริ่ม','startDate',e.startDate,'date')}${f('วันที่สิ้นสุด (ว่าง = วันเดียว)','endDate',e.endDate,'date')}${f('เวลาเริ่ม (ว่าง = ตลอดวัน)','startTime',e.startTime,'time')}${f('เวลาสิ้นสุด','endTime',e.endTime,'time')}</div>${f('สถานที่','place',e.place)}${f('ประเภทหรือสถานะกิจกรรม (ถ้ามี)','type',e.type,'text','เช่น วิชาการ ประชุม')}${f('URL ภาพประกอบ (https://)','img',e.img,'text','https://')}<label>หรืออัปโหลดรูปใหม่ (PNG/JPG/WebP/GIF ไม่เกิน 5 MB — อัปโหลดเมื่อกดบันทึก)</label><input type="file" name="ev_file" accept="image/png,image/jpeg,image/webp,image/gif">${f('ลิงก์รายละเอียดเพิ่มเติม (https:// ถ้ามี)','url',e.url,'text','https://')}<label>รายละเอียด</label><textarea name="ev_desc">${E(e.desc)}</textarea><label>สถานะการเผยแพร่</label><select name="ev_status"><option value="draft" ${e.status!=='published'?'selected':''}>ฉบับร่าง (ไม่แสดงต่อสาธารณะ)</option><option value="published" ${e.status==='published'?'selected':''}>เผยแพร่</option></select><p><button type="button" class="btn b" onclick="evsave('${id}')">บันทึก</button> <button type="button" class="btn s c" onclick="evask('${id}')">ลบกิจกรรม</button></p><small>หลังบันทึกเป็น "เผยแพร่" ผู้เข้าชมทั่วไปจะเห็นหลังกด "เผยแพร่ให้ผู้เข้าชมทั่วไป"</small></form><h2>เผยแพร่ให้ผู้เข้าชมทั่วไป</h2>${dbBanner()}`}
function evsync(id){const e=WC.ev.find(x=>x.id===id),d=new FormData($('af'));['title','startDate','endDate','startTime','endTime','place','type','img','url','desc','status'].forEach(k=>{if(d.has('ev_'+k))e[k]=k==='status'?d.get('ev_'+k):STRIP(String(d.get('ev_'+k))).trim()})}
async function evsave(id){evsync(id);const e=WC.ev.find(x=>x.id===id);e.updated=Date.now();
 if(!e.title)return say('ต้องระบุชื่อกิจกรรม',false);if(!okD(e.startDate))return say('ต้องระบุวันที่เริ่มให้ถูกต้อง',false);if(e.endDate&&(!okD(e.endDate)||e.endDate<e.startDate))return say('วันที่สิ้นสุดต้องไม่ก่อนวันที่เริ่ม',false);
 if((e.startTime&&!okT(e.startTime))||(e.endTime&&!okT(e.endTime)))return say('รูปแบบเวลาไม่ถูกต้อง',false);if(e.endTime&&!e.startTime)return say('ถ้าระบุเวลาสิ้นสุด ต้องระบุเวลาเริ่มด้วย',false);if(e.startTime&&e.endTime&&(e.endDate||e.startDate)===e.startDate&&e.endTime<e.startTime)return say('เวลาสิ้นสุดต้องไม่ก่อนเวลาเริ่ม',false);
 if(e.img&&!okU(e.img))return say('URL ภาพต้องขึ้นต้นด้วย https://',false);if(e.url){const er=cpUrlBasic(e.url);if(er)return say('ลิงก์รายละเอียด: '+er,false)}if(!DBH)return say(dbOff(),false);{const fi=document.querySelector('#af input[name="ev_file"]');if(fi&&fi.files&&fi.files[0]){try{e.img=await mdUpload(fi.files[0],'events')}catch(er){return say('อัปโหลดรูปไม่สำเร็จ: '+((er&&er.message)||er),false)}}}
 try{await putDoc('events',WC.ev);WC={};say(e.status==='published'?'บันทึกและตั้งสถานะเผยแพร่แล้ว (ผู้เข้าชมทั่วไปเห็นทันที)':'บันทึกเป็นฉบับร่างแล้ว')}catch(er){dbErr('บันทึกไม่สำเร็จ',er)}}
/* ===== Public rendering ===== */
const secRaw=s=>{const t=E(s.text),tg=u=>u[0]==='#'?'':' target="_blank" rel="noopener noreferrer"';if(s.type==='heading')return `<h2>${t}</h2>`;if(s.type==='text')return `<p class="pl">${t}</p>`;if(s.type==='image')return okU(s.url)?`<img src="${E(s.url)}" alt="${E(s.alt)}" style="max-width:100%;height:auto;border-radius:16px;margin:12px 0">`:'';if(s.type==='button')return okL(s.url)?`<p><a class="btn b" href="${E(s.url)}"${tg(s.url)}>${E(s.label)}</a></p>`:'';if(s.type==='cards')return `<div class="grid">${(s.items||[]).map(c=>{const ed=elD(c.st),b=`${okU(c.m)?`<img src="${E(c.m)}" alt=""${okL(c.l)?'':` data-zoom="${E(c.m)}" style="cursor:zoom-in"`}>`:''}<div class="p">${okU(c.ico)?`<div class="chd"><img class="cic" src="${E(c.ico)}" alt="" loading="lazy" decoding="async" onerror="this.style.display='none'"><h3>${E(c.t)}</h3></div>`:`<h3>${E(c.t)}</h3>`}<p class="pl">${E(c.d)}</p></div>`;return okL(c.l)?`<a class="card${ed.c}"${ed.a} href="${E(c.l)}"${tg(c.l)}>${b}</a>`:`<div class="card h${ed.c}"${ed.a}>${b}</div>`}).join('')}</div>`;if(s.type==='calendar')return calView();if(s.type==='campusmap')return cmView();if(s.type==='faculties')return facView();if(s.type==='people')return pplView();if(s.type==='courses')return crsView();if(s.type==='linkcards')return lcHtml(s);if(s.type==='clubs')return clubView();if(s.type==='news')return nwSecView(s);if(s.type==='timetable')return ctView();return ''};
const secOne=s=>{const h=secRaw(s),a=h?elA(s.st,s.type,'se'):'';return a?`<div${a}>${h}</div>`:h};
const secsHtml=(a,G)=>{a=a||[];G=G||[];let out='',i=0;while(i<a.length){const s=a[i],g=s.grp&&G.find(x=>x.id===s.grp);if(!g){out+=secOne(s);i++;continue}let j=i,h='';while(j<a.length&&a[j].grp===s.grp){h+=secOne(a[j]);j++}const b=elBuild(g.st,'group');out+=b.ds?`<div class="sg" data-e="${b.ds}" style="${b.st}">${h}</div>`:h;i=j}return out};
const pageView=(p,pv)=>{PVW=!!pv;PPL_PG=p.id;return `<div class="w sec${psC(p.id)}"${psA(p.id)}>${pv?`<div class="msg">ตัวอย่าง: หน้านี้สถานะ${p.status==='published'?'เผยแพร่':'ฉบับร่าง'} · <a href="#/admin/pages/edit/${p.id}">กลับไปแก้ไข</a></div>`:''}<h1>${E(p.title)}</h1>${p.sections&&p.sections.length?secsHtml(p.sections,p.groups):'<p style="opacity:.6">ยังไม่ได้เพิ่มเนื้อหา</p>'}${cpPageSec(p.id)}${pplPageSec(p)}</div>`};
const emptyPub=()=>'<div class="empty-pub"><h1>ยังไม่มีหน้าเว็บที่เผยแพร่</h1><p>เว็บไซต์นี้ยังไม่มีเนื้อหา กรุณากลับมาใหม่ภายหลัง</p></div>';
/* ===== หน้าแรก: เนื้อหาเก็บใน settings.home (ฐานข้อมูลเดิม site/settings) ===== */
const HD=()=>Object.assign({t:'',x:'',img:'',b1t:'',b1u:'',b2t:'',b2u:'',it:'',ix:'',iimg:'',sc:null,pt:'',pn:null,stx:false,stt:'',stu:'',stf:'',sl_mj:'',sl_fa:'',sl_stu:'',sl_stf:'',sn_mj:'',sn_fa:'',sta:'',nt:'',nn:null,et:'',en:null},getSet().home||{});
const scAll=()=>visMenu().filter(m=>m.kind==='cms'&&m.href).sort((a,b)=>(a.parent?1:0)-(b.parent?1:0)||byo(a,b));
const scItems=()=>{const h=HD(),V=scAll();return Array.isArray(h.sc)?V.filter(m=>h.sc.includes(m.id)):V.filter(m=>!m.parent).slice(0,6)};
/* ===== HERO หลายภาพ: ใช้ home.imgs (รายการ URL) ถ้ามี ไม่งั้นอ่าน home.img เดิม · home.img เก็บภาพแรกเสมอ เพื่อให้ข้อมูลเดิม/โค้ดเดิมอ่านได้ ===== */
const HERO_MAX=5,heroImgs=h=>(Array.isArray(h.imgs)&&h.imgs.length?h.imgs:(h.img?[h.img]:[])).filter(okU).slice(0,HERO_MAX);
const heroBg=L=>L.length<2?(L.length?`<img class="hi" src="${E(L[0])}" alt="" decoding="async" fetchpriority="high" onerror="this.classList.add('hx')">`:''):`<div class="hsl"><div class="hst">${L.map((u,i)=>`<img class="hi" src="${E(u)}" alt=""${i?' loading="lazy"':' fetchpriority="high"'} decoding="async" onerror="this.classList.add('hx')">`).join('')}</div></div>`;
const heroCtl=L=>L.length<2?'':`<div class="hctl"><button type="button" class="hbb hbp" data-hs="prev" aria-label="ภาพก่อนหน้า">${ic('right')}</button><span class="hdots">${L.map((_,i)=>`<button type="button" class="hdot${i?'':' on'}" data-hs="go" data-i="${i}" aria-label="ไปยังภาพที่ ${i+1}"${i?'':' aria-current="true"'}></button>`).join('')}</span><button type="button" class="hbb" data-hs="next" aria-label="ภาพถัดไป">${ic('right')}</button></div>`;
function hsGo(el,i){const n=+el.dataset.n||1;i=((i%n)+n)%n;el.dataset.i=i;const st=el.querySelector('.hst');if(st)st.style.transform='translateX(-'+i*100+'%)';el.querySelectorAll('.hdot').forEach((d,k)=>{d.classList.toggle('on',k===i);if(k===i)d.setAttribute('aria-current','true');else d.removeAttribute('aria-current')})}
(()=>{const RM=window.matchMedia?matchMedia('(prefers-reduced-motion: reduce)'):{matches:false};let x0=null,y0=0;
 document.addEventListener('click',e=>{const b=e.target.closest&&e.target.closest('[data-hs]'),el=b&&b.closest('.hero.hsx');if(!el)return;const i=+el.dataset.i||0,a=b.dataset.hs;hsGo(el,a==='prev'?i-1:a==='next'?i+1:+b.dataset.i);el.dataset.skip='1'});
 document.addEventListener('touchstart',e=>{const el=e.target.closest&&e.target.closest('.hero.hsx');if(el&&e.touches.length===1){x0=e.touches[0].clientX;y0=e.touches[0].clientY}else x0=null},{passive:true});
 document.addEventListener('touchend',e=>{if(x0===null)return;const el=e.target.closest&&e.target.closest('.hero.hsx'),t=e.changedTouches[0],dx=t.clientX-x0,dy=t.clientY-y0;x0=null;if(el&&Math.abs(dx)>45&&Math.abs(dx)>Math.abs(dy)*1.5){hsGo(el,(+el.dataset.i||0)+(dx<0?1:-1));el.dataset.skip='1'}},{passive:true});
 setInterval(()=>{const el=document.querySelector('.hero.hsx');if(!el||document.hidden||RM.matches)return;if(el.dataset.skip){delete el.dataset.skip;return}if(el.matches(':hover')||el.querySelector(':focus-visible'))return;hsGo(el,(+el.dataset.i||0)+1)},6000)})();
const heroFb=()=>`<div class="hfb"><img src="logo_head_website.png" alt="${E(BRAND.en)}" decoding="async"></div>`;
function homeView(){PVW=false;const s=getSet(),h=HD(),bt=(l,u,c)=>l&&okL(u)?`<a class="btn ${c}" href="${E(u)}"${u[0]==='#'?'':' target="_blank" rel="noopener noreferrer"'}>${E(l)}</a>`:'',HI=heroImgs(h);
return `<section class="hero${HI.length>1?' hsx':''}"${HI.length>1?` data-n="${HI.length}" data-i="0" aria-roledescription="carousel" aria-label="ภาพปก"`:''}><div class="w hgrid"><div class="hmedia">${heroBg(HI)||heroFb()}${heroCtl(HI)}</div><div class="hc"><div class="hk"><span>${E(BRAND.en.toUpperCase())}</span></div><h1>${E(h.t||s.nameTh)}</h1><p class="pl">${E(h.x||'ยินดีต้อนรับสู่ '+s.nameEn)}</p><div class="hb">${bt(h.b1t,h.b1u,'b')}${bt(h.b2t,h.b2u,'')}</div></div></div></section><div class="w sec hn${psC('home')}"${psA('home')}>${statsSec()}<div class="hin${okU(h.iimg)?' hm':''}"><div><h2>${E(h.it||'เกี่ยวกับโรงเรียน')}</h2><p class="pl">${E(h.ix||'ติดตามข่าวสารและกิจกรรมของโรงเรียนได้จากเว็บไซต์นี้')}</p></div>${okU(h.iimg)?`<img src="${E(h.iimg)}" alt="">`:''}</div>${ncHomeRow()}${eaHomeRow()}</div>`}
function homeAdmin(){const W=WC.hm,h=W?W.h:HD(),s=getSet(),V=scAll(),cur=W?W.h.sc:scItems().map(m=>m.id),f=(l,k,v,p)=>`<label>${l}</label><input name="h_${k}" value="${E(v)}"${p?` placeholder="${p}"`:''}>`,a=(l,k,v)=>`<label>${l}</label><textarea name="h_${k}" rows="4">${E(v)}</textarea>`;
return `<h1>เนื้อหาหน้าแรก</h1><p>แก้ไขภาพปก ข้อความ ปุ่ม ทางลัด และ Footer ข้อมูลเก็บใน Supabase ผู้เข้าชมเห็นทันทีหลังบันทึก กิจกรรมดึงจากปฏิทินเดิมอัตโนมัติ ข่าวสารจัดการที่ <a href="#/admin/news">จัดการข่าวสารและประกาศ</a> ส่วนตัวเลขคณะและสาขานับจากข้อมูลที่เผยแพร่แล้ว</p>${dbBanner()}<form id="af" onsubmit="return false">${f('ชื่อบนภาพปก (ว่าง = ใช้ชื่อสถาบัน)','t',h.t)}${a('ข้อความบนภาพปก','x',h.x)}${himgs(h)}${f('ปุ่มที่ 1: ข้อความ','b1t',h.b1t)}${f('ปุ่มที่ 1: ลิงก์','b1u',h.b1u,'https://… หรือ #/p/ชื่อหน้า')}${f('ปุ่มที่ 2: ข้อความ','b2t',h.b2t)}${f('ปุ่มที่ 2: ลิงก์','b2u',h.b2u,'https://… หรือ #/p/ชื่อหน้า')}${f('หัวข้อส่วนแนะนำ','it',h.it)}${a('ข้อความแนะนำสถาบัน','ix',h.ix)}${f('URL ภาพประกอบส่วนแนะนำ (https://)','iimg',h.iimg)}<h3 class="fqhd">ส่วน KDS ในตัวเลข</h3><label class="ck"><input type="checkbox" name="h_stx" value="1" ${h.stx?'checked':''}> ซ่อนส่วนนี้จากหน้าแรก</label>${f('หัวข้อส่วน (ว่าง = "KDS ในตัวเลข")','stt',h.stt)}${[['mj','แผนการเรียน','sn_mj'],['fa','ระดับชั้นเรียน','sn_fa'],['stu','นักเรียน','stu'],['stf','คณะครูและบุคลากร','stf']].map(([k,d,n],i)=>f('รายการที่ '+(i+1)+' · ชื่อหัวข้อ (ว่าง = "'+d+'")','sl_'+k,h['sl_'+k],d)+f('รายการที่ '+(i+1)+' · จำนวน (ตัวเลขจริง; ว่าง = ซ่อนรายการนี้)',n,h[n])).join('')}${f('ที่มาหรือวันที่ของตัวเลข (ไม่บังคับ เช่น ข้อมูล ณ ปีการศึกษา 2568)','sta',h.sta)}<p><small>สถิติหน้าแรกมี 4 รายการ แก้ชื่อหัวข้อและจำนวนได้เอง ตัวเลขต้องเป็นจำนวนเต็ม หากเว้นว่างหรือเป็น 0 จะไม่แสดงรายการนั้น และต้องกรอกจากข้อมูลทางการ</small></p><h3 class="fqhd">ส่วนข่าวสารและประกาศ</h3>${f('หัวข้อส่วนข่าว (ว่าง = "'+NW_T+'")','nt',h.nt)}<label for="h_nn">จำนวนข่าวที่แสดงบนหน้าแรก (0–${NW_MAX} ; 0 = ซ่อนส่วนนี้)</label><input id="h_nn" name="h_nn" type="number" min="0" max="${NW_MAX}" step="1" value="${hnOf(h.nn,NW_DEF,NW_MAX)}"><p><small>เพิ่ม/แก้ไข/ซ่อน/ลบข่าวได้ที่ <a href="#/admin/news">จัดการข่าวสารและประกาศ</a></small></p><h3 class="fqhd">ส่วนโพสต์</h3>${f('หัวข้อส่วนโพสต์ (ว่าง = "'+CP_T+'")','pt',h.pt)}<label for="h_pn">จำนวนโพสต์ที่แสดงบนหน้าแรก (0–${CP_MAX} ; 0 = ซ่อนส่วนนี้)</label><input id="h_pn" name="h_pn" type="number" min="0" max="${CP_MAX}" step="1" value="${cpHomeNOf(h)}"><p><small>เพิ่ม/แก้ไข/เรียงลำดับโพสต์ได้ที่ <a href="#/admin/cposts">จัดการโพสต์</a></small></p><h3 class="fqhd">ส่วนกิจกรรมที่กำลังจะมาถึง</h3>${f('หัวข้อส่วนกิจกรรม (ว่าง = "กิจกรรมที่กำลังจะมาถึง")','et',h.et)}<label for="h_en">จำนวนกิจกรรมที่แสดงบนหน้าแรก (0–${EV_MAX} ; 0 = ซ่อนส่วนนี้)</label><input id="h_en" name="h_en" type="number" min="0" max="${EV_MAX}" step="1" value="${hnOf(h.en,EV_DEF,EV_MAX)}"><p><small>ใช้ข้อมูลจาก <a href="#/admin/events">จัดการกิจกรรมปฏิทิน</a> แสดงเฉพาะกิจกรรมที่เผยแพร่และยังไม่สิ้นสุด (กำลังจะมาถึงหรือกำลังดำเนินอยู่) กิจกรรมทั้งหมดดูได้ที่หน้าปฏิทินกิจกรรม</small></p><h3 class="fqhd">ทางลัด</h3><label>หน้าที่แสดงเป็นทางลัด (เฉพาะหน้าที่เผยแพร่แล้วและอยู่ในเมนู)</label>${V.length?V.map(m=>`<label class="ck"><input type="checkbox" name="h_sc" value="${m.id}" ${cur.includes(m.id)?'checked':''}> ${E(m.label)}</label>`).join(''):'<div class="empty-ev">ยังไม่มีหน้าที่เผยแพร่ให้เลือก</div>'}<label>ข้อความ Footer</label><textarea name="f" rows="3">${E(W?W.f:s.footer)}</textarea><p><button type="button" class="btn b" onclick="hsave()">บันทึก</button> <a class="btn" href="#/">ดูหน้าแรก</a></p></form>`}
const himgRow=v=>`<div class="himg"><input name="h_imgs" value="${E(v)}" placeholder="https://…" aria-label="URL ภาพปก"><button type="button" class="btn s" onclick="himgMv(this,-1)" aria-label="เลื่อนขึ้น">↑</button><button type="button" class="btn s" onclick="himgMv(this,1)" aria-label="เลื่อนลง">↓</button><button type="button" class="btn s" onclick="himgDel(this)" aria-label="ลบภาพ">✕</button></div>`;
const himgs=h=>{const L=Array.isArray(h.imgs)&&h.imgs.length?h.imgs:(h.img?[h.img]:[]);return `<label>ภาพปก (https://) สูงสุด ${HERO_MAX} ภาพ</label><div id="himgs">${(L.length?L:['']).map(himgRow).join('')}</div><p><button type="button" class="btn s" id="himgadd" onclick="himgAdd()"${L.length>=HERO_MAX?' disabled':''}>+ เพิ่มภาพ</button> <small>ภาพแรกคือภาพหลัก · ใส่ 2 ภาพขึ้นไปจะเลื่อนสลับอัตโนมัติ ข้อความและปุ่มคงเดิมทุกภาพ</small></p>`};
const himgLim=()=>{const a=$('himgadd');if(a)a.disabled=$('himgs').children.length>=HERO_MAX};
function himgAdd(){const b=$('himgs');if(b.children.length>=HERO_MAX)return;b.insertAdjacentHTML('beforeend',himgRow(''));himgLim();b.lastElementChild.querySelector('input').focus()}
function himgMv(btn,d){const r=btn.closest('.himg'),s=d<0?r.previousElementSibling:r.nextElementSibling;if(!s)return;if(d<0)r.parentNode.insertBefore(r,s);else r.parentNode.insertBefore(s,r)}
function himgDel(btn){const b=$('himgs');btn.closest('.himg').remove();if(!b.children.length)b.insertAdjacentHTML('beforeend',himgRow(''));himgLim()}
async function hsave(){const d=new FormData($('af')),g=k=>STRIP(d.get('h_'+k)||'').trim(),h={};['t','x','b1t','b1u','b2t','b2u','it','ix','iimg','pt','stt','sta','sl_mj','sl_fa','sl_stu','sl_stf','nt','et'].forEach(k=>h[k]=g(k));{const L=d.getAll('h_imgs').map(x=>STRIP(x||'').trim()).filter(Boolean);h.imgs=L;h.img=L[0]||''}h.sc=d.getAll('h_sc');WC.hm={h,f:STRIP(d.get('f')||'').trim()};
{const pr=String(d.get('h_pn')==null?'':d.get('h_pn')).trim();if(pr==='')h.pn=null;else{const n=Number(pr);if(!Number.isInteger(n)||n<0||n>CP_MAX)return say('จำนวนโพสต์บนหน้าแรกต้องเป็นจำนวนเต็ม 0 ถึง '+CP_MAX,false);h.pn=n}}
{const chk=(k,l,mx)=>{const pr=String(d.get('h_'+k)==null?'':d.get('h_'+k)).trim();if(pr===''){h[k]=null;return ''}const n=Number(pr);if(!Number.isInteger(n)||n<0||n>mx)return 'จำนวน'+l+'ต้องเป็นจำนวนเต็ม 0 ถึง '+mx;h[k]=n;return ''};const er=chk('nn','ข่าวบนหน้าแรก',NW_MAX)||chk('en','กิจกรรมบนหน้าแรก',EV_MAX);if(er)return say(er,false)}
h.stx=d.get('h_stx')==='1';for(const k of ['sl_mj','sl_fa','sl_stu','sl_stf'])if(h[k].length>40)return say('ชื่อหัวข้อสถิติยาวเกิน 40 ตัวอักษร',false);for(const [k,l] of [['sn_mj','จำนวนแผนการเรียน'],['sn_fa','จำนวนระดับชั้นเรียน'],['stu','จำนวนนักเรียน'],['stf','จำนวนคณะครูและบุคลากร']]){const raw=g(k).replace(/[,\s]/g,'');if(raw===''){h[k]='';continue}if(!/^\d{1,9}$/.test(raw))return say(l+'ต้องเป็นจำนวนเต็มไม่ติดลบ (ไม่เกิน 9 หลัก) หรือเว้นว่าง',false);h[k]=Number(raw)}
if(h.imgs.some(u=>!okU(u))||(h.iimg&&!okU(h.iimg)))return say('URL ภาพต้องขึ้นต้นด้วย https://',false);
if(h.imgs.length>HERO_MAX)return say('ภาพปกได้สูงสุด '+HERO_MAX+' ภาพ',false);
for(const [l,u] of [[h.b1t,h.b1u],[h.b2t,h.b2u]])if((l&&!okL(u))||(!l&&u))return say('ปุ่มต้องมีทั้งข้อความและลิงก์ (https:// หรือ #/)',false);
if(!DBH)return say(dbOff(),false);try{await putDoc('settings',Object.assign({},getSH('settings')||{},{home:h,footer:STRIP(d.get('f')||'').trim()}));WC.hm=null;say('บันทึกเนื้อหาหน้าแรกเรียบร้อย ผู้เข้าชมเห็นทันที')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
const PUB={p(sl){const q=getPages().find(x=>x.slug===sl);return q&&q.status==='published'?pageView(q):nf()},preview(id){const q=pgById(id);return q?pageView(q,1):nf()}};
/* ===== Admin: shell ===== */
const AG=[['ภาพรวม',[['dash','แดชบอร์ด']]],['จัดการเว็บไซต์',[['home','เนื้อหาหน้าแรก'],['news','จัดการข่าวสารและประกาศ'],['cposts','จัดการโพสต์'],['pages','จัดการเมนูและหน้าเว็บ'],['menu','แก้ไขเมนูแบบละเอียด'],['events','จัดการกิจกรรมปฏิทิน'],['campus','จัดการแผนผังสถาบัน'],['pexec','จัดการคณะผู้บริหาร'],['pstaff','จัดการอาจารย์และบุคลากร'],['ptypes','จัดการประเภทบุคลากร'],['pdepartments','จัดการฝ่ายงาน'],['pgroups','จัดการกลุ่มสาระการเรียนรู้'],['clubs','จัดการชมรมนักศึกษา'],['clubcats','จัดการหมวดหมู่ชมรม']]],['ข้อมูลการศึกษา',[['curriculum','โครงสร้างหลักสูตรและตารางเรียน'],['fgroups','จัดการหลักสูตร'],['typo','ตั้งค่าตัวอักษร']],true],['ตั้งค่า',[['settings','การตั้งค่าเว็บไซต์']]]];
function adminNav(sec){return `<aside aria-label="เมนูหลังบ้าน"><b class="ab">${kitTile(30)}<span>Admin · ${BRAND.short}</span>${soundBtn()}${themeBtn()}</b><br><a href="#/">&#8592; ดูเว็บไซต์</a><small style="display:block;opacity:.7;margin:6px 0;word-break:break-all">${E(Auth.email)}</small><button type="button" class="btn s" onclick="doLogout()">ออกจากระบบ</button>${AG.map(([g,it,fold])=>{const ln=it.map(([k,t])=>{const on=sec===k;return `<a href="#/admin/${k}" class="${on?'on':''}"${on?' aria-current="page"':''}>${t}</a>`}).join('');return fold?`<details class="agd"${FQN.open||it.some(x=>x[0]===sec)?' open':''} ontoggle="FQN.open=this.open"><summary class="ag">${g}</summary>${ln}</details>`:`<div class="ag">${g}</div>${ln}`}).join('')}</aside>`}
function sbt(){sbc=!sbc;render()}
function admin(parts){if(!Auth.canAccessAdmin())return loginView();const sec=(parts[0]==='people'?'pstaff':parts[0])||'dash';if(sec!=='home')WC.hm=null;let main;
 if(sec==='dash')main=dashboard();else if(sec==='pages'&&parts[1]==='edit')main=pageEditor(parts[2]);else if(sec==='pages')main=pagesAdmin();else if(sec==='home')main=homeAdmin();else if(sec==='menu')main=menuAdmin();else if(sec==='events'&&parts[1]==='edit')main=eventEditor(parts[2]);else if(sec==='events')main=eventsAdmin();else if(sec==='campus'&&parts[1]==='layout')main=ceAdmin();else if(sec==='campus'&&parts[1]==='edit')main=cmpEditor(parts[2]);else if(sec==='campus')main=campusAdmin();else if(sec==='curriculum')main=ctAdmin();else if(FQE[sec])main=parts[1]==='edit'?fqEditor(sec,parts[2]):fqAdmin(sec);else if(sec==='typo')main=typoAdmin();else if(sec==='settings')main=settingsAdmin();else main='<p>ไม่พบเมนู</p>';
 return `<div class="adm${sbc?' c':''}">${adminNav(sec)}<main><button class="btn s" onclick="sbt()" aria-expanded="${!sbc}" aria-label="ย่อหรือขยายเมนู">${ic('menu')} เมนู</button>${toast?`<div class="msg ${toast.ok?'ok':'er'}">${E(toast.t)}</div>`:''}${main}</main></div>`}
const dbBanner=()=>`<div class="msg ${DBH&&CW!==false?'ok':'er'}">${DBH?(CW===false?'เชื่อมต่อฐานข้อมูลแล้ว แต่บัญชีนี้ไม่มีสิทธิ์เขียนข้อมูล (ดูได้อย่างเดียว) ต้องเป็นเจ้าของหรือผู้แก้ไข':'เชื่อมต่อ Supabase แล้ว บันทึกลงฐานข้อมูลจริง (เฉพาะทีมงานที่ได้รับอนุญาต)'):dbOff()}</div>`;
/* ===== โครงสร้างหลักสูตรและตารางเรียน (ระบบใหม่ เมนูเดียว #/admin/curriculum) — ไม่เพิ่มตาราง/คีย์ในฐานข้อมูล: เก็บเป็นอาร์เรย์ใน settings (site_docs 'settings') เหมือน ptypes/pgroups
   ctplans   = แผนการเรียน ม.4–ม.6 [{id,code,name}] (รหัสแผน '1' = แสดง '/1' · รหัสห้อง = ชั้น+'/'+รหัสแผน เช่น ม.4/1) · ม.1–ม.3 ใช้แผนทั่วไปแผนเดียวต่อชั้น (ไม่เก็บเป็นรายการ)
   ctcourses = รายวิชาในโครงสร้างหลักสูตร [{id,g,t,p?,code,name,credits}] แยกตามชั้น g · ภาคเรียน t · แผน p (เฉพาะ ม.4–ม.6)
   cttables  = ตารางเรียน [{id,g,t,p?,pub,home,cells:{'<วัน>_<คาบ0>':{cid?,code?,name,room?,teacher?}}}] id 'g<ชั้น>t<ภาค>' (ม.1–3) / 'g<ชั้น>p<id แผน>t<ภาค>' (ม.4–6) · id 'cfg' = จำนวนคาบและเวลา
   ข้อมูลระบบเดิม (majors/programs/settings.timetable) ไม่ถูกลบหรือย้าย แต่ระบบใหม่ไม่ใช้ ===== */
const CT_G=[1,2,3,4,5,6],CT_T=[1,2],CT_D=[['mon','จันทร์'],['tue','อังคาร'],['wed','พุธ'],['thu','พฤหัสบดี'],['fri','ศุกร์']],CT_NMAX=12,CT_DN=8,CT_TM=['08:30-09:20','09:20-10:10','10:10-11:00','11:00-11:50','11:50-12:40','12:40-13:30','13:30-14:20','14:20-15:10'],CT_NAME=120,CT_CODE=20,CT_NOTE=60,CT_PNAME=80,CT_GEN='ทั่วไป';
const CT_SEED=[['pl1','1','วิทย์ - คณิต'],['pl2','2','ศิลป์ - คำนวณ'],['pl3','3','ศิลป์ - จีน'],['pl4','4','ศิลป์ - ญี่ปุ่น'],['pl5','5','ศิลป์ - ฝรั่งเศส'],['pl6','6','ศิลป์ - ทั่วไป'],['pl7','7','ศิลป์ - คหกรรม']].map(([id,code,name])=>({id,code,name}));
const CT={tab:'struct',g:1,t:1,p:'',edit:'',dirty:false,seeded:false},CTV={g:1,t:1,p:''};
const ctPlansRaw=()=>getSH('ctplans'),ctPlans=()=>(ctPlansRaw()||[]).filter(x=>x&&x.id),ctCrs=()=>(getSH('ctcourses')||[]).filter(x=>x&&x.id),ctTabs=()=>(getSH('cttables')||[]).filter(x=>x&&x.id);
const ctOkG=v=>CT_G.includes(+v)?+v:1,ctOkT=v=>CT_T.includes(+v)?+v:1;
const ctPlan=id=>ctPlans().find(x=>x.id===id)||null;
const ctKey=(g,t,p)=>g>=4?'g'+g+'p'+p+'t'+t:'g'+g+'t'+t;
const ctTab=(g,t,p)=>ctTabs().find(x=>x.id===ctKey(g,t,p))||null;
const ctScope=(g,t,p)=>ctCrs().filter(c=>c.g===g&&c.t===t&&(g<4||c.p===p));
/* ชื่อห้องเรียน: ม.4–6 = ม.<ชั้น>/<รหัสแผน> · ม.1–3 = ม.<ชั้น> · แสดงคู่กับชื่อแผนเสมอ เช่น ม.4/1 — แผนการเรียนวิทย์ - คณิต */
function ctRoom(g,p){if(g<4)return 'ม.'+g;const pl=ctPlan(p);return 'ม.'+g+'/'+(pl?pl.code:'?')}
function ctRoomLbl(g,p){if(g<4)return 'ม.'+g+' — แผนการเรียน'+CT_GEN;const pl=ctPlan(p);return ctRoom(g,p)+' — แผนการเรียน'+(pl?pl.name:'(ไม่พบแผน)')}
const ctCfg=()=>{const c=ctTabs().find(x=>x.id==='cfg')||{},n=Math.floor(+c.n);return {n:Number.isFinite(n)&&n>=1&&n<=CT_NMAX?n:CT_DN,times:Array.isArray(c.times)?c.times.map(x=>String(x==null?'':x)):[]}};
const ctTime=(c,i)=>c.times[i]!=null&&c.times[i]!==''?c.times[i]:(c.times.length?'':(CT_TM[i]||''));
const ctCOpt=c=>c.code?c.code+' — '+c.name:c.name;
const ctCellTxt=(c,crs)=>{if(!c)return '';const x=c.cid&&crs.find(k=>k.id===c.cid);return x?ctCOpt(x):(c.code?c.code+' — '+c.name:c.name)};
const ctUsedBy=cid=>ctTabs().filter(x=>x.cells&&Object.values(x.cells).some(c=>c&&c.cid===cid));
function ctErr(m){const x=$('cterr');if(!x)return say(m,false);x.textContent=m;x.hidden=false;try{x.scrollIntoView({block:'center'})}catch(e){}}
function ctDirty(){CT.dirty=true}
function ctSel(k,v){if(CT.dirty&&!confirm('มีการแก้ไขที่ยังไม่ได้บันทึก ต้องการเปลี่ยนโดยไม่บันทึกหรือไม่?'))return;CT[k]=k==='g'?ctOkG(v):k==='t'?ctOkT(v):k==='tab'?(v==='table'?'table':'struct'):String(v);if(k!=='edit')CT.edit='';CT.dirty=false;render()}
function ctvSel(k,v){CTV[k]=k==='g'?ctOkG(v):k==='t'?ctOkT(v):String(v);render()}
async function ctPut(key,arr,msg,onErr){try{await putDoc(key,arr);CT.dirty=false;say(msg)}catch(e){const c=(e&&(e.code||e.status))||'error';(onErr||ctErr)('บันทึกไม่สำเร็จ: '+(ERR[c]||(e&&e.message)||'เกิดข้อผิดพลาดที่ไม่ทราบสาเหตุ')+' ('+c+')')}}
/* แผนเริ่มต้น 7 แผน: สร้างครั้งเดียวเมื่อยังไม่เคยมีรายการ ctplans (id คงที่ pl1–pl7 จึงไม่เกิดแผนซ้ำ) */
async function ctSeed(manual){if(!DBH||CW===false)return;if(ctPlansRaw()!==null){if(manual)say('มีแผนการเรียนอยู่แล้ว ไม่สร้างซ้ำ',false);return}await ctPut('ctplans',CT_SEED.map(x=>Object.assign({},x)),'สร้างแผนการเรียน ม.4–ม.6 เริ่มต้น 7 แผนแล้ว แก้ชื่อ เพิ่ม หรือลบได้')}
/* ---------- แผนการเรียน ม.4–ม.6 ---------- */
function ctPlanRow(m){const nc=ctCrs().filter(c=>c.p===m.id).length,nt=ctTabs().filter(x=>x.p===m.id).length;return `<div class="row"><b>/${E(m.code)}</b> <label class="sr" for="ctpn_${E(m.id)}">ชื่อแผน /${E(m.code)}</label><input id="ctpn_${E(m.id)}" value="${E(m.name)}" maxlength="${CT_PNAME}" style="max-width:320px"> <button type="button" class="btn s b" data-id="${E(m.id)}" onclick="ctPSave(this.dataset.id)">บันทึกชื่อ</button> <button type="button" class="btn s c" data-id="${E(m.id)}" onclick="ctPDel(this.dataset.id)">ลบ</button><br><small>ห้อง ม.4/${E(m.code)} · ม.5/${E(m.code)} · ม.6/${E(m.code)} · รายวิชา ${nc} รายการ · ตารางเรียน ${nt} ตาราง</small></div>`}
function ctPlansBox(){const P=ctPlans();return `<h2>แผนการเรียน</h2><p><small>ม.1–ม.3 ใช้แผนการเรียนทั่วไปแผนเดียวในแต่ละระดับชั้น (ไม่ต้องตั้งค่า) · ม.4–ม.6 มีแผนด้านล่าง รหัสแผน (เช่น /1) ต่างจากรหัสห้อง (เช่น ม.4/1) ห้องเรียนคือระดับชั้น + รหัสแผน</small></p>${P.length?P.map(ctPlanRow).join(''):`<p><small>ยังไม่มีแผนการเรียน ม.4–ม.6</small></p>${ctPlansRaw()===null?'<p><button type="button" class="btn b" onclick="ctSeed(true)">สร้างแผนเริ่มต้น 7 แผน</button></p>':''}`}<p><button type="button" class="btn s" onclick="ctPAdd()">+ เพิ่มแผนการเรียน</button></p>`}
function ctPSave(id){const m=ctPlan(id),n=$('ctpn_'+id);if(!m||!n)return say('ไม่พบแผนนี้แล้ว',false);const nm=STRIP(n.value).trim();if(!nm)return say('กรุณากรอกชื่อแผน',false);if([...nm].length>CT_PNAME)return say('ชื่อแผนต้องไม่เกิน '+CT_PNAME+' ตัวอักษร',false);ctPut('ctplans',clone(ctPlans()).map(x=>x.id===id?Object.assign(x,{name:nm}):x),'บันทึกชื่อแผน /'+m.code+' เรียบร้อย',m=>say(m,false))}
function ctPAdd(){if(!DBH)return say(dbOff(),false);const P=clone(ctPlans()),mx=P.reduce((a,x)=>Math.max(a,parseInt(x.code,10)||0),0),code=String(mx+1);P.push({id:mkId('pl'),code,name:'แผนการเรียนใหม่'});ctPut('ctplans',P,'เพิ่มแผน /'+code+' แล้ว กรุณาแก้ชื่อแผน',m=>say(m,false))}
function ctPDel(id){const m=ctPlan(id);if(!m)return;const nc=ctCrs().filter(c=>c.p===id).length,nt=ctTabs().filter(x=>x.p===id).length;if(nc||nt)return say('ลบแผน /'+m.code+' "'+m.name+'" ไม่ได้ เพราะยังมีรายวิชา '+nc+' รายการ และตารางเรียน '+nt+' ตารางอ้างอิงอยู่ กรุณาลบรายการเหล่านั้นก่อน',false);if(!DBH)return say(dbOff(),false);if(!confirm('ลบแผน /'+m.code+' "'+m.name+'" ถาวรหรือไม่ (ยังไม่มีรายวิชาหรือตารางใช้แผนนี้)'))return;if(CT.p===id)CT.p='';ctPut('ctplans',clone(ctPlans()).filter(x=>x.id!==id),'ลบแผนแล้ว',m=>say(m,false))}
/* ---------- โครงสร้างหลักสูตร: รายวิชาตามชั้น/ภาค/แผน ---------- */
function ctCForm(c){return `<fieldset class="fqfs"><legend>${c.id?'แก้ไขรายวิชา':'เพิ่มรายวิชา'}</legend><div class="g2"><div><label for="cc_code">รหัสวิชา</label><input id="cc_code" maxlength="${CT_CODE}" value="${E(c.code||'')}" placeholder="เช่น ท21101"></div><div><label for="cc_cr">หน่วยกิต</label><input id="cc_cr" maxlength="5" inputmode="decimal" value="${E(c.credits||'')}" placeholder="เช่น 1.5"></div></div><label for="cc_name">ชื่อรายวิชา *</label><input id="cc_name" maxlength="${CT_NAME}" value="${E(c.name||'')}"><p><button type="button" class="btn b" onclick="ctCSave()">บันทึกรายวิชา</button> <button type="button" class="btn" onclick="ctSel('edit','')">ยกเลิก</button></p></fieldset>`}
function ctStruct(g,t,pid,can){const L=ctScope(g,t,pid),ed=CT.edit==='new'?{}:L.find(c=>c.id===CT.edit);
 if(!can)return '';
 return `<h2>รายวิชา ${E(ctRoomLbl(g,pid))} · ภาคเรียนที่ ${t}</h2><p><small>รายวิชาที่กำหนดที่นี่จะถูกนำไปเลือกในตารางเรียนของห้อง/แผนและภาคเรียนเดียวกันโดยอัตโนมัติ</small></p>${L.length?`<div class="cqw"><table class="cqt"><thead><tr><th>รหัสวิชา</th><th>ชื่อรายวิชา</th><th>หน่วยกิต</th><th><span class="sr">จัดการ</span></th></tr></thead><tbody>${L.map(c=>`<tr><td data-l="รหัสวิชา">${E(c.code||'-')}</td><td data-l="ชื่อรายวิชา">${E(c.name)}</td><td data-l="หน่วยกิต">${E(c.credits||'-')}</td><td><button type="button" class="btn s" data-id="${E(c.id)}" onclick="ctSel('edit',this.dataset.id)">แก้ไข</button> <button type="button" class="btn s c" data-id="${E(c.id)}" onclick="ctCDel(this.dataset.id)">ลบ</button></td></tr>`).join('')}</tbody></table></div>`:'<div class="empty-ev">ยังไม่มีรายวิชาในชั้น/ภาค/แผนนี้</div>'}${ed?ctCForm(ed):'<p><button type="button" class="btn b" onclick="ctSel(\'edit\',\'new\')">+ เพิ่มรายวิชา</button></p>'}`}
function ctCSave(){if(!DBH)return say(dbOff(),false);const g=ctOkG(CT.g),t=ctOkT(CT.t),pid=g>=4?CT.p:'';if(g>=4&&!ctPlan(pid))return say('กรุณาเลือกแผนการเรียนก่อน',false);
 const code=STRIP($('cc_code').value).trim(),name=STRIP($('cc_name').value).trim(),cr=STRIP($('cc_cr').value).trim();
 if(!name)return say('กรุณากรอกชื่อรายวิชา',false);if([...name].length>CT_NAME)return say('ชื่อรายวิชายาวเกิน '+CT_NAME+' ตัวอักษร',false);if([...code].length>CT_CODE)return say('รหัสวิชายาวเกิน '+CT_CODE+' ตัวอักษร',false);
 if(cr&&!/^\d{1,2}(\.\d{1,2})?$/.test(cr))return say('หน่วยกิตต้องเป็นตัวเลข เช่น 1 หรือ 1.5',false);
 const norm=s=>String(s||'').replace(/\s+/g,'').toUpperCase(),all=clone(ctCrs()),id=CT.edit==='new'?'':CT.edit;
 if(code&&all.some(c=>c.id!==id&&c.g===g&&c.t===t&&(g<4||c.p===pid)&&norm(c.code)===norm(code)))return say('รหัสวิชา '+code+' มีอยู่แล้วในชั้น/ภาค/แผนนี้',false);
 if(id){const c=all.find(x=>x.id===id);if(!c)return say('ไม่พบรายวิชานี้แล้ว (อาจถูกลบโดยผู้ดูแลคนอื่น)',false);Object.assign(c,{code,name,credits:cr})}
 else{const c={id:mkId('cs'),g,t,code,name,credits:cr};if(g>=4)c.p=pid;all.push(c)}
 CT.edit='';ctPut('ctcourses',all,id?'แก้ไขรายวิชาเรียบร้อย':'เพิ่มรายวิชาเรียบร้อย',m=>say(m,false))}
function ctCDel(id){const c=ctCrs().find(x=>x.id===id);if(!c)return;const u=ctUsedBy(id);if(u.length)return say('ลบ "'+c.name+'" ไม่ได้ เพราะถูกใช้ในตารางเรียน '+u.length+' ตาราง ('+u.slice(0,4).map(x=>ctRoom(x.g,x.p)+' ภาค '+x.t).join(', ')+') กรุณานำออกจากตารางก่อน',false);if(!DBH)return say(dbOff(),false);if(!confirm('ลบรายวิชา "'+c.name+'" ออกจากโครงสร้างหลักสูตรหรือไม่'))return;ctPut('ctcourses',clone(ctCrs()).filter(x=>x.id!==id),'ลบรายวิชาแล้ว',m=>say(m,false))}
/* ---------- ตารางเรียน ---------- */
function ctTable(g,t,pid,can){const cfg=ctCfg(),it=(can&&ctTab(g,t,pid))||{cells:{}},cells=it.cells||{},crs=ctScope(g,t,pid);
 if(!can)return '';
 const head=Array.from({length:cfg.n},(_,p)=>`<th scope="col">คาบ ${p+1}${ctTime(cfg,p)?'<br><small>'+E(ctTime(cfg,p))+'</small>':''}</th>`).join(''),
 rows=CT_D.map(([dk,dn])=>`<tr><th scope="row">${dn}</th>${Array.from({length:cfg.n},(_,p)=>{const c=cells[dk+'_'+p];return `<td><input list="ctl" name="c_${dk}_${p}" value="${E(ctCellTxt(c,crs))}" maxlength="${CT_NAME+30}" placeholder="วิชา" aria-label="${dn} คาบ ${p+1} วิชา"><input name="r_${dk}_${p}" value="${E(c&&c.room||'')}" maxlength="${CT_NOTE}" placeholder="ห้อง" aria-label="${dn} คาบ ${p+1} ห้องเรียน"><input name="n_${dk}_${p}" value="${E(c&&c.teacher||'')}" maxlength="${CT_NOTE}" placeholder="ครู" aria-label="${dn} คาบ ${p+1} ครูผู้สอน"></td>`}).join('')}</tr>`).join('');
 return `<form id="ctf" onsubmit="return false" oninput="ctDirty()"><h2>${E(ctRoomLbl(g,pid))} · ภาคเรียนที่ ${t} ${it.id?(it.pub?'<span class="tag">เผยแพร่</span>':'<span class="tag">ฉบับร่าง</span>'):'<span class="tag">ยังไม่มีตาราง</span>'}</h2>
<datalist id="ctl">${crs.map(c=>`<option value="${E(ctCOpt(c))}"></option>`).join('')}</datalist>
<label for="cthome">ห้องประจำ (ใช้แสดงในคาบที่ไม่ได้ระบุห้อง)</label><input id="cthome" name="home" maxlength="${CT_NOTE}" value="${E(it.home||'')}" placeholder="เช่น อาคาร 2 ห้อง 421">
${crs.length?'':'<div class="msg er">ห้อง/แผนและภาคเรียนนี้ยังไม่มีรายวิชาในโครงสร้างหลักสูตร <button type="button" class="btn s" onclick="ctSel(\'tab\',\'struct\')">ไปเพิ่มรายวิชา</button> (หรือพิมพ์ชื่อกิจกรรมเอง เช่น พัก ชุมนุม ในช่องวิชา)</div>'}
<p><small>เลือกวิชาจากรายการของห้อง/แผนนี้ (พิมพ์ค้นหาได้) แต่ละคาบระบุห้องเรียนและครูผู้สอนแยกกันได้ เว้นห้องว่าง = ใช้ห้องประจำ</small></p>
<div class="ttw"><table class="ttt"><thead><tr><th scope="col">วัน</th>${head}</tr></thead><tbody>${rows}</tbody></table></div>
<label class="ck"><input type="checkbox" name="pub" value="1"${it.pub?' checked':''}> เผยแพร่ตารางนี้บนเว็บไซต์</label>
<p><button type="button" class="btn b" onclick="ctTSave()">บันทึกตาราง ${E(ctRoom(g,pid))} ภาคเรียนที่ ${t}</button> <button type="button" class="btn c" onclick="ctTClearAsk()"${it.id?'':' disabled'}>ลบตารางนี้</button> <a class="btn" href="#/timetable/${g}/${t}">ดูหน้าเว็บ</a></p></form>
<form id="ctc" onsubmit="return false"><fieldset class="fqfs"><legend>จำนวนคาบและเวลา (ใช้ร่วมทุกห้อง)</legend><label for="ct_n">จำนวนคาบต่อวัน (1–${CT_NMAX})</label><input id="ct_n" name="ct_n" type="number" min="1" max="${CT_NMAX}" step="1" value="${cfg.n}"><div class="g2">${Array.from({length:cfg.n},(_,p)=>`<div><label for="ct_t${p}">เวลาคาบ ${p+1}</label><input id="ct_t${p}" name="ct_t${p}" maxlength="30" value="${E(ctTime(cfg,p))}" placeholder="เช่น 08:30-09:20"></div>`).join('')}</div><p><button type="button" class="btn" onclick="ctCfgSave()">บันทึกคาบและเวลา</button> <small>ถ้าลดจำนวนคาบ ข้อมูลคาบที่เกินจะถูกซ่อนแต่ยังเก็บไว้ บันทึกตารางก่อนเปลี่ยนจำนวนคาบ</small></p></fieldset></form>`}
function ctTSave(){if(!DBH)return ctErr(dbOff());const f=$('ctf');if(!f)return;const d=new FormData(f),cfg=ctCfg(),g=ctOkG(CT.g),t=ctOkT(CT.t),pid=g>=4?CT.p:'';if(g>=4&&!ctPlan(pid))return ctErr('กรุณาเลือกแผนการเรียนก่อนบันทึก');
 const crs=ctScope(g,t,pid),by=new Map(crs.map(c=>[ctCOpt(c),c])),old=ctTab(g,t,pid),cells={},gv=n=>STRIP(String(d.get(n)==null?'':d.get(n))).trim(),home=gv('home');
 if([...home].length>CT_NOTE)return ctErr('ห้องประจำยาวเกิน '+CT_NOTE+' ตัวอักษร');
 if(old&&old.cells)Object.keys(old.cells).forEach(k=>{if(+k.split('_')[1]>=cfg.n)cells[k]=old.cells[k]});
 for(const [dk,dn] of CT_D)for(let p=0;p<cfg.n;p++){const raw=gv('c_'+dk+'_'+p),room=gv('r_'+dk+'_'+p),tc=gv('n_'+dk+'_'+p);if(!raw&&!room&&!tc)continue;if(!raw)return ctErr(dn+' คาบ '+(p+1)+': กรุณาเลือกหรือกรอกวิชา (หรือเว้นว่างทั้งห้องและครู)');
  if([...raw].length>CT_NAME)return ctErr(dn+' คาบ '+(p+1)+': ชื่อวิชายาวเกิน '+CT_NAME+' ตัวอักษร');if([...room].length>CT_NOTE)return ctErr(dn+' คาบ '+(p+1)+': ห้องเรียนยาวเกิน '+CT_NOTE+' ตัวอักษร');if([...tc].length>CT_NOTE)return ctErr(dn+' คาบ '+(p+1)+': ชื่อครูยาวเกิน '+CT_NOTE+' ตัวอักษร');
  const m=by.get(raw),c=m?{cid:m.id,code:m.code||'',name:m.name}:{name:raw};if(room)c.room=room;if(tc)c.teacher=tc;cells[dk+'_'+p]=c}
 const item={id:ctKey(g,t,pid),g,t,pub:d.get('pub')==='1',home,cells};if(g>=4)item.p=pid;
 const arr=ctTabs().slice(),i=arr.findIndex(x=>x.id===item.id);if(i>=0)arr[i]=item;else arr.push(item);ctPut('cttables',arr,'บันทึกตาราง '+ctRoom(g,pid)+' ภาคเรียนที่ '+t+' เรียบร้อย')}
function ctCfgSave(){if(!DBH)return ctErr(dbOff());const f=$('ctc');if(!f)return;const d=new FormData(f),n=Math.floor(+d.get('ct_n')),old=ctCfg();if(!Number.isFinite(n)||n<1||n>CT_NMAX)return ctErr('จำนวนคาบต้องเป็นจำนวนเต็ม 1–'+CT_NMAX);
 const times=[];for(let p=0;p<n;p++){const v=d.has('ct_t'+p)?STRIP(String(d.get('ct_t'+p)||'')).trim():ctTime(old,p);if([...v].length>30)return ctErr('เวลาคาบ '+(p+1)+' ยาวเกิน 30 ตัวอักษร');times.push(v)}
 for(let p=n;p<old.times.length;p++)times.push(old.times[p]);const arr=ctTabs().filter(x=>x.id!=='cfg');arr.unshift({id:'cfg',n,times});ctPut('cttables',arr,'บันทึกจำนวนคาบและเวลาเรียบร้อย')}
function ctTClearAsk(){const g=ctOkG(CT.g),t=ctOkT(CT.t),pid=g>=4?CT.p:'',it=ctTab(g,t,pid);if(!it)return;if(!confirm('ลบตารางเรียน '+ctRoomLbl(g,pid)+' ภาคเรียนที่ '+t+' ทั้งตารางหรือไม่ (ลบแล้วกู้คืนไม่ได้ ไม่กระทบรายวิชาในโครงสร้างหลักสูตร)'))return;ctPut('cttables',ctTabs().filter(x=>x.id!==it.id),'ลบตาราง '+ctRoom(g,pid)+' ภาคเรียนที่ '+t+' แล้ว')}
const ctMakePage=()=>secPageMake('timetable','ตารางเรียน','timetable');
/* ---------- หน้าจัดการหน้าเดียว ---------- */
function ctAdmin(){const g=CT.g=ctOkG(CT.g),t=CT.t=ctOkT(CT.t),P=ctPlans();if(g>=4&&!P.some(m=>m.id===CT.p))CT.p=P[0]?P[0].id:'';const pid=g>=4?CT.p:'',can=!(g>=4&&!pid);
 if(ctPlansRaw()===null&&DBH&&CW!==false&&!CT.seeded){CT.seeded=true;setTimeout(()=>ctSeed(false),0)}
 const gb=CT_G.map(n=>`<button type="button" class="btn s${n===g?' b':''}" aria-pressed="${n===g}" onclick="ctSel('g',${n})">ม.${n}</button>`).join(''),tb=CT_T.map(n=>`<button type="button" class="btn s${n===t?' b':''}" aria-pressed="${n===t}" onclick="ctSel('t',${n})">ภาคเรียนที่ ${n}</button>`).join(''),
 pb=g>=4?(P.length?`<div class="cuh" role="group" aria-label="แผนการเรียน (ห้องเรียน)">${P.map(m=>`<button type="button" class="btn s${m.id===pid?' b':''}" aria-pressed="${m.id===pid}" data-id="${E(m.id)}" onclick="ctSel('p',this.dataset.id)">${E('ม.'+g+'/'+m.code+' — '+m.name)}</button>`).join('')}</div>`:'<div class="msg er">ยังไม่มีแผนการเรียน ม.4–ม.6 เพิ่มแผนได้ในหัวข้อ "แผนการเรียน" ด้านล่าง</div>'):`<p><small>${E(ctRoomLbl(g))}</small></p>`,
 tabs=`<nav class="cuh" aria-label="ส่วนของระบบ"><button type="button" class="btn s${CT.tab==='struct'?' b':''}" aria-pressed="${CT.tab==='struct'}" onclick="ctSel('tab','struct')">1. โครงสร้างหลักสูตร</button><button type="button" class="btn s${CT.tab==='table'?' b':''}" aria-pressed="${CT.tab==='table'}" onclick="ctSel('tab','table')">2. ตารางเรียน</button></nav>`;
 return `<h1>โครงสร้างหลักสูตรและตารางเรียน</h1>${dbBanner()}<div id="cterr" class="msg er" role="alert" hidden></div>${tabs}<div class="cuh" role="group" aria-label="ระดับชั้น">${gb}</div>${pb}<div class="cuh" role="group" aria-label="ภาคเรียน">${tb}</div>
${CT.tab==='table'?secPageBox('timetable','ตารางเรียน','timetable','ctMakePage')+ctTable(g,t,pid,can):ctStruct(g,t,pid,can)+ctPlansBox()}`}
/* ---------- หน้าเว็บ (ผู้เข้าชม): #/timetable/<ม.1–6>/<ภาค> หรือส่วน "ตารางเรียน" ในหน้า CMS · เห็นเฉพาะตารางที่เผยแพร่ ทีมงานเห็นฉบับร่างพร้อมป้าย ---------- */
function ctView(){const g=CTV.g=ctOkG(CTV.g),t=CTV.t=ctOkT(CTV.t),adm=Auth.canAccessAdmin(),cfg=ctCfg(),P=g>=4?ctPlans():[];if(g>=4&&!P.some(m=>m.id===CTV.p))CTV.p=P[0]?P[0].id:'';const pid=g>=4?CTV.p:'',it=g>=4&&!pid?null:ctTab(g,t,pid),lbl=g>=4&&!pid?'':ctRoomLbl(g,pid),
 gb=CT_G.map(n=>`<button type="button" class="btn s${n===g?' b':''}" aria-pressed="${n===g}" onclick="ctvSel('g',${n})">ม.${n}</button>`).join(''),tb=CT_T.map(n=>`<button type="button" class="btn s${n===t?' b':''}" aria-pressed="${n===t}" onclick="ctvSel('t',${n})">ภาคเรียนที่ ${n}</button>`).join(''),
 pb=g>=4&&P.length?`<div class="cuh" role="group" aria-label="เลือกห้องเรียน/แผนการเรียน">${P.map(m=>`<button type="button" class="btn s${m.id===pid?' b':''}" aria-pressed="${m.id===pid}" data-id="${E(m.id)}" onclick="ctvSel('p',this.dataset.id)">${E('ม.'+g+'/'+m.code+' — '+m.name)}</button>`).join('')}</div>`:'',
 bar=`<div class="cuh" role="group" aria-label="เลือกระดับชั้น">${gb}</div>${pb}<div class="cuh" role="group" aria-label="เลือกภาคเรียน">${tb}</div>`;
 if(!it||(!it.pub&&!adm))return `<div class="fq">${bar}<div class="empty-ev"><b>ยังไม่มีตารางเรียน ${E(lbl||'ม.'+g)} ภาคเรียนที่ ${t}</b><br>${adm?'<a href="#/admin/curriculum">จัดตารางเรียนที่หลังบ้าน</a>':'กรุณากลับมาใหม่ภายหลัง'}</div></div>`;
 const cells=it.cells||{},crs=ctCrs(),head=Array.from({length:cfg.n},(_,p)=>`<th scope="col">คาบ ${p+1}${ctTime(cfg,p)?'<br><small>'+E(ctTime(cfg,p))+'</small>':''}</th>`).join(''),
 rows=CT_D.map(([dk,dn])=>`<tr><th scope="row">${dn}</th>${Array.from({length:cfg.n},(_,p)=>{const c=cells[dk+'_'+p];if(!c)return '<td class="ttx"></td>';const x=c.cid&&crs.find(k=>k.id===c.cid),nm=x?x.name:c.name,cd=x?x.code:c.code,rm=c.room||it.home||'';return `<td><b>${E(nm)}</b>${cd?`<br><small>${E(cd)}</small>`:''}${rm?`<br><small>ห้อง ${E(rm)}</small>`:''}${c.teacher?`<br><small>${E(c.teacher)}</small>`:''}</td>`}).join('')}</tr>`).join(''),ttl='ตารางเรียน '+lbl+' ภาคเรียนที่ '+t;
 return `<div class="fq">${bar}${it.pub?'':'<div class="msg er">ฉบับร่าง — ผู้เข้าชมทั่วไปยังไม่เห็นตารางนี้ (เปิดเผยแพร่ได้ที่หลังบ้าน)</div>'}<h2 class="tth">${E(ttl)}</h2><div class="ttw"><table class="ttt"><caption class="sr">${E(ttl)}</caption><thead><tr><th scope="col">วัน</th>${head}</tr></thead><tbody>${rows}</tbody></table></div></div>`}
PUB.timetable=(a,b)=>{if(a)CTV.g=ctOkG(a);if(b)CTV.t=ctOkT(b);return `<div class="w sec"><p><a class="bk" href="#/">← กลับหน้าแรก</a></p><h1>ตารางเรียน</h1>${ctView()}</div>`};
/* ===== Admin: dashboard ===== */
function dashboard(){const P=getPages(),M=getMenu(),pb=P.filter(x=>x.status==='published').length,rc=P.filter(x=>x.updated).sort((a,b)=>b.updated-a.updated).slice(0,5);
 const start=(!M.length&&!P.length)?`<div class="hint"><h2>เริ่มสร้างเว็บไซต์</h2><p>เว็บไซต์ยังว่างอยู่ เริ่มจากสร้างเมนูแรก หรือสร้างหน้าแรกโดยตรง</p><button class="btn b" onclick="qask('')">สร้างเมนูแรก</button> <button class="btn" onclick="pnew(1)">สร้างหน้าแรก</button></div>`:'';
 return `<h1>แดชบอร์ด</h1>${dbBanner()}${start}<div class="grid"><div class="card"><div class="p"><h2>${M.length}</h2>เมนู</div></div><div class="card"><div class="p"><h2>${pb}</h2>หน้าที่เผยแพร่แล้ว</div></div><div class="card"><div class="p"><h2>${P.length-pb}</h2>ฉบับร่าง</div></div><div class="card"><div class="p"><h2>${getEvents().length}</h2>กิจกรรมปฏิทิน</div></div></div><h2>แก้ไขล่าสุด</h2>${rc.length?rc.map(x=>`<div class="row"><b>${E(x.title)}</b> <small>${new Date(x.updated).toLocaleString('th-TH')}</small> <a class="btn s" href="#/admin/pages/edit/${x.id}">แก้ไขเนื้อหา</a></div>`).join(''):'<p>ยังไม่มีประวัติการแก้ไขหน้าเว็บ</p>'}<h2>ทางลัด</h2><p><a class="btn b" href="#/admin/pages">จัดการเมนูและหน้าเว็บ</a> <a class="btn" href="#/admin/settings">ตั้งค่าเว็บไซต์</a></p>`}
/* ===== Admin: จัดการเมนูและหน้าเว็บ (จุดเริ่มต้นหลัก) ===== */
function pagesAdmin(){const m=getMenu(),P=getPages(),tops=m.filter(x=>!x.parent).sort(byo);
 const bt=x=>{const p=x.kind==='cms'&&pgById(x.pageId);return [p?`<a class="btn s" href="#/admin/pages/edit/${p.id}">แก้ไขเนื้อหา</a> <a class="btn s" href="#/preview/${p.id}">ดูตัวอย่าง</a> <button class="btn s" onclick="ptog('${p.id}')">${p.status==='published'?'ซ่อนหน้า':'เผยแพร่หน้า'}</button>`:'',x.kind==='url'&&x.href?`<a class="btn s" href="${E(x.href)}"${okU(x.href)?' target="_blank" rel="noopener noreferrer"':''}>เปิดลิงก์</a>`:'',`<button class="btn s" onclick="qmv('${x.id}',-1)">ขึ้น</button> <button class="btn s" onclick="qmv('${x.id}',1)">ลง</button>`,`<button class="btn s" onclick="qren('${x.id}')">เปลี่ยนชื่อ</button>`,x.parent?'':`<button class="btn s" onclick="qask('${x.id}')">เพิ่มเมนูย่อย</button>`,`<button class="btn s" onclick="qtog('${x.id}')">${x.show===false?'แสดงเมนู':'ซ่อนเมนู'}</button>`,`<button class="btn s c" onclick="qdel('${x.id}')">ลบเมนู</button>`].join(' ')},
 r=(x,l)=>{const p=x.kind==='cms'&&pgById(x.pageId);return `<div class="row mr" data-s="${E(x.label.toLowerCase())}" style="margin-left:${l*28}px"><b>${E(x.label)}</b> ${x.show===false?'<span class="tag">ซ่อน</span>':''}${p?stTag(p):''} <small>${x.kind==='heading'?'หัวข้อหมวดหมู่ (เปิดเมนูย่อย)':'เชื่อมกับ: '+E(p?p.title+' (#/p/'+p.slug+')':hrefOf(x)||'ยังไม่ได้ตั้งค่าลิงก์')}</small><br>${bt(x)}</div>`};
 const first=(!m.length&&!P.length)?`<div class="hint"><h2>ยังไม่มีเมนูหรือหน้าเว็บ</h2><p>เว็บไซต์เริ่มต้นด้วยสถานะว่าง เริ่มต้นโดยสร้างเมนูแรก (ระบบจะสร้างหน้าที่ผูกกับเมนูให้) หรือสร้างหน้าแรกโดยตรง</p><button class="btn b" onclick="qask('')">สร้างเมนูแรก</button> <button class="btn" onclick="pnew(1)">สร้างหน้าแรก</button></div>`:'';
 return `<h1>จัดการเมนูและหน้าเว็บ</h1><p>เพิ่มเมนู สร้างหน้า แก้ไขเนื้อหา ซ่อน เผยแพร่ และลบได้จากหน้านี้ ไม่ต้องแก้โค้ด</p>${dbBanner()}${first}${m.length?`<p><button class="btn b" onclick="qask('')">+ เพิ่มเมนู</button> <input id="msr" placeholder="ค้นหาเมนู" oninput="msrch()" style="max-width:260px;display:inline-block" aria-label="ค้นหาเมนู"></p>`:''}${tops.map(t=>r(t,0)+m.filter(c=>c.parent===t.id).sort(byo).map(c=>r(c,1)).join('')).join('')}<h2>หน้าเว็บทั้งหมด</h2>${P.map(p=>`<div class="row"><b>${E(p.title)}</b> <small>#/p/${E(p.slug)}</small> ${stTag(p)}${p.home?' <span class="tag">หน้าแรก</span>':''} <a class="btn s" href="#/admin/pages/edit/${p.id}">แก้ไขเนื้อหา</a> <a class="btn s" href="#/preview/${p.id}">ดูตัวอย่าง</a> <button class="btn s" onclick="ptog('${p.id}')">${p.status==='published'?'ซ่อนหน้า':'เผยแพร่หน้า'}</button> <button class="btn s c" onclick="pask('${p.id}')">ลบหน้า</button></div>`).join('')||empty()}<p><button class="btn" onclick="pnew()">+ สร้างหน้าใหม่ (ยังไม่ผูกกับเมนู)</button></p><h2>เผยแพร่ให้ผู้เข้าชมทั่วไป</h2>${dbBanner()}`}
function msrch(){const q=$('msr').value.toLowerCase();document.querySelectorAll('.mr').forEach(e=>e.style.display=e.dataset.s.includes(q)?'':'none')}
async function qsave(M,P,msg){if(!DBH){say(dbOff(),false);return false}try{if(P)await putDoc('pages',P);await putDoc('menu',M);say(msg);return true}catch(e){dbErr('บันทึกไม่สำเร็จ',e);return false}}
function qtog(id){const M=clone(getMenu()),x=M.find(y=>y.id===id);x.show=x.show===false;qsave(M,null,x.show?'แสดงเมนูแล้ว':'ซ่อนเมนูแล้ว (ข้อมูลและหน้าไม่ถูกลบ)')}
function qmv(id,d){const M=clone(getMenu()),x=M.find(y=>y.id===id),sb=M.filter(y=>(y.parent||'')===(x.parent||'')).sort(byo);sb.forEach((y,i)=>y.order=i*10);const i=sb.indexOf(x),j=i+d;if(j<0||j>=sb.length)return;const t=x.order;x.order=sb[j].order;sb[j].order=t;qsave(M,null,'เปลี่ยนลำดับเมนูแล้ว')}
function qren(id){const x=getMenu().find(y=>y.id===id);$('md').innerHTML=`<div class="modal"><div><h3>เปลี่ยนชื่อเมนู</h3><label>ชื่อเมนู</label><input id="qrn" value="${E(x.label)}"><p style="margin-top:14px"><button class="btn b" onclick="qrdo('${id}')">บันทึก</button> <button class="btn" onclick="$('md').innerHTML=''">ยกเลิก</button></p></div></div>`}
function qrdo(id){const n=STRIP($('qrn').value).trim();if(!n)return say('กรุณาใส่ชื่อเมนู',false);$('md').innerHTML='';const M=clone(getMenu());M.find(y=>y.id===id).label=n;qsave(M,null,'เปลี่ยนชื่อเมนูแล้ว')}
function qask(pid){$('md').innerHTML=`<div class="modal"><div><h3>${pid?'เพิ่มเมนูย่อย':'เพิ่มเมนู'}</h3><label>ชื่อเมนู</label><input id="qn" placeholder="เช่น เกี่ยวกับเรา"><label>ประเภท</label><select id="qk"><option value="cms">สร้างหน้าเว็บใหม่ให้เมนูนี้</option><option value="url">ลิงก์ภายนอก</option>${pid?'':'<option value="heading">หัวข้อหมวดหมู่ (มีเมนูย่อย)</option>'}</select><label>URL (เฉพาะลิงก์ภายนอก)</label><input id="qu" placeholder="https://example.com"><p style="margin-top:14px"><button class="btn b" onclick="qadd('${pid}')">เพิ่ม</button> <button class="btn" onclick="$('md').innerHTML=''">ยกเลิก</button></p></div></div>`}
function qadd(pid){const n=STRIP($('qn').value).trim(),k=$('qk').value,u=$('qu').value.trim();if(!n)return say('กรุณาใส่ชื่อเมนู',false);if(k==='url'&&u&&!okU(u))return say('URL ต้องขึ้นต้นด้วย https://',false);$('md').innerHTML='';const M=clone(getMenu()),P=k==='cms'?clone(getPages()):null,mx=Math.max(-10,...M.filter(y=>(y.parent||'')===(pid||'')).map(y=>+y.order||0)),x={id:mkId('m'),label:n,m:'',kind:k,href:k==='url'?u:'',tab:'same',show:true,order:mx+10,parent:pid||''};let go='';if(k==='cms'){const id=mkId('pg');P.push({id,title:n,slug:id,status:'draft',sections:[],updated:Date.now()});x.pageId=id;go='#/admin/pages/edit/'+id}M.push(x);qsave(M,P,'เพิ่มเมนูเรียบร้อย').then(ok=>{if(ok&&go)location.hash=go})}
function qdel(id){const M=getMenu(),x=M.find(y=>y.id===id),ch=M.filter(c=>c.parent===id),hp=[x].concat(ch).some(y=>y.kind==='cms'&&y.pageId);$('md').innerHTML=`<div class="modal"><div><h3>ยืนยันการลบเมนู</h3><p>${ch.length?'เมนูนี้มีเมนูย่อย '+ch.length+' รายการ ซึ่งจะถูกลบไปด้วย ':''}${hp?'เลือกได้ว่าจะเก็บหน้าเว็บที่เชื่อมอยู่ไว้หรือลบไปด้วย (การลบหน้าจะลบเนื้อหาทั้งหมดของหน้านั้น)':''}</p><button class="btn" onclick="qdo('${id}',0)">ลบเฉพาะเมนู (เก็บหน้าไว้)</button> ${hp?`<button class="btn c" onclick="qdo('${id}',1)">ลบเมนูและหน้าเว็บ</button> `:''}<button class="btn" onclick="$('md').innerHTML=''">ยกเลิก</button></div></div>`}
function qdo(id,wp){$('md').innerHTML='';const M=clone(getMenu()),ids=[id].concat(M.filter(c=>c.parent===id).map(c=>c.id));let P=null;if(wp){const pids=M.filter(x=>ids.includes(x.id)&&x.kind==='cms').map(x=>x.pageId);P=clone(getPages()).filter(p=>!pids.includes(p.id))}qsave(M.filter(x=>!ids.includes(x.id)),P,'ลบเรียบร้อย')}
/* ===== Admin: หน้าเว็บ (สร้าง/ซ่อน/ลบ) ===== */
async function pnew(home){if(!DBH)return say(dbOff(),false);const id=mkId('pg'),L=clone(getPages());if(home)L.forEach(x=>x.home=false);L.push({id,title:home?'หน้าแรก':'หน้าใหม่',slug:home&&!L.some(x=>x.slug==='home')?'home':id,status:'draft',sections:[],home:!!home,updated:Date.now()});try{await putDoc('pages',L);location.hash='#/admin/pages/edit/'+id}catch(e){dbErr('สร้างหน้าไม่สำเร็จ',e)}}
async function ptog(id){if(!DBH)return say(dbOff(),false);const L=clone(getPages()),p=L.find(x=>x.id===id);p.status=p.status==='published'?'draft':'published';p.updated=Date.now();try{await putDoc('pages',L);say(p.status==='published'?'ตั้งสถานะเผยแพร่แล้ว (ผู้เข้าชมทั่วไปเห็นทันที)':'ซ่อนหน้าแล้ว (กลับเป็นฉบับร่าง เนื้อหาไม่ถูกลบ)')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
function pask(id){$('md').innerHTML=`<div class="modal"><div><h3>ยืนยันการลบหน้าเว็บ</h3><p>เนื้อหาทั้งหมดของหน้านี้จะถูกลบถาวร เมนูที่เชื่อมอยู่จะไม่แสดงจนกว่าจะเปลี่ยนปลายทาง</p><button class="btn c" onclick="pdelp('${id}')">ลบหน้า</button> <button class="btn" onclick="$('md').innerHTML=''">ยกเลิก</button></div></div>`}
async function pdelp(id){$('md').innerHTML='';if(!DBH)return say(dbOff(),false);const L=getPages().filter(p=>p.id!==id);try{await putDoc('pages',L);say('ลบหน้าเรียบร้อย')}catch(e){dbErr('ลบไม่สำเร็จ',e)}}
function pageEditor(id){if(!WC.pg)WC.pg=clone(getPages());const p=WC.pg.find(x=>x.id===id);if(!p)return '<p><a class="bk" href="#/admin/pages">← จัดการเมนูและหน้าเว็บ</a></p><h1>ไม่พบหน้า</h1>';
 const o=(a,v)=>a.map(([k,t])=>`<option value="${k}" ${v===k?'selected':''}>${t}</option>`).join('');
 const sec=(s,i)=>{const n=s.id+'_',f=(l,k,v,ta)=>`<label>${l}</label>${ta?`<textarea name="${n}${k}">${E(v)}</textarea>`:`<input name="${n}${k}" value="${E(v)}" placeholder="${/(^|_)(u|m|l)$/.test(k)?'ตัวอย่าง: https://example.com':''}">`}`;let b='';
  if(s.type==='heading')b=f('ข้อความหัวข้อ','tx',s.text);else if(s.type==='text')b=f('ข้อความ','tx',s.text,1);else if(s.type==='image')b=f('URL รูปภาพ (https://)','u',s.url)+f('คำอธิบายภาพ','a',s.alt);else if(s.type==='button')b=f('ข้อความบนปุ่ม','lb',s.label)+f('URL ปลายทาง (https:// หรือ #/หน้า)','u',s.url);
  else if(s.type==='courses')b='<p>ส่วนนี้แสดงหน้าค้นหารายวิชาทั้งหมด ข้อมูลมาจากแผนการศึกษาของหลักสูตรเดิมที่บันทึกไว้ (แสดงเฉพาะหลักสูตรที่เผยแพร่ และรายวิชาที่ไม่ได้ซ่อน)</p>';else if(s.type==='faculties')b='<p>ส่วนนี้แสดงรายการคณะและวิทยาลัย ข้อมูลมาจากข้อมูลคณะเดิมที่บันทึกไว้</p>';else if(s.type==='people')b='<p>ส่วนนี้แสดงรายชื่อบุคลากรและทีมผู้บริหาร ข้อมูลมาจาก <a href="#/admin/pstaff">จัดการอาจารย์และบุคลากร</a> และ <a href="#/admin/pexec">จัดการคณะผู้บริหาร</a> (แยกตามประเภทและกลุ่มสาระ)</p>';else if(s.type==='campusmap')b='<p>ส่วนนี้แสดงแผนผังสถาบัน ข้อมูลมาจาก <a href="#/admin/campus">จัดการแผนผังสถาบัน</a></p>';else if(s.type==='calendar')b='<p>ส่วนนี้แสดงปฏิทินและรายการกิจกรรม ข้อมูลมาจากชุดเดียวกับ <a href="#/admin/events">จัดการกิจกรรมปฏิทิน</a></p>';
  else if(s.type==='news')b=nwSecEd(s,n,id);
  else if(s.type==='timetable')b='<p>ส่วนนี้แสดงตารางเรียน ม.1–ม.6 (เลือกระดับชั้นและภาคเรียนได้) ข้อมูลมาจาก <a href="#/admin/curriculum">โครงสร้างหลักสูตรและตารางเรียน</a> (แสดงเฉพาะตารางที่เผยแพร่)</p>';
  else if(s.type==='clubs')b='<p>ส่วนนี้แสดงหน้ารวมชมรมนักศึกษา ข้อมูลมาจาก <a href="#/admin/clubs">จัดการชมรมนักศึกษา</a> และ <a href="#/admin/clubcats">จัดการหมวดหมู่ชมรม</a> (แสดงเฉพาะชมรมที่เผยแพร่)</p>';
  else if(s.type==='linkcards')b=(s.items||[]).map((c,j)=>`<div class="row"><b>การ์ด ${j+1}</b> <button type="button" class="btn s" onclick="imv('${id}','${s.id}',${j},-1)">ขึ้น</button> <button type="button" class="btn s" onclick="imv('${id}','${s.id}',${j},1)">ลง</button> <button type="button" class="btn s c" onclick="idel('${id}','${s.id}',${j})">ลบการ์ด</button>${f('ชื่อการ์ด',j+'_t',c.t)}${f('คำอธิบายสั้น',j+'_d',c.d,1)}${f('ข้อความบนปุ่ม',j+'_b',c.b)}${f('URL ปลายทาง (https:// ถ้าว่างจะแสดง "ยังไม่ได้ตั้งค่าลิงก์")',j+'_u',c.u)}<label>ไอคอน</label><select name="${n}${j}_i">${o(ICONS,c.i||'')}</select>${elCardUI(s,c,j)}</div>`).join('')+`<button type="button" class="btn s" onclick="iadd('${id}','${s.id}')">+ เพิ่มการ์ด</button>`;
  else b=(s.items||[]).map((c,j)=>`<div class="row"><b>การ์ด ${j+1}</b> <button type="button" class="btn s c" onclick="idel('${id}','${s.id}',${j})">ลบการ์ด</button>${f('ชื่อ',j+'_t',c.t)}${f('คำอธิบาย',j+'_d',c.d,1)}<label>ไอคอนการ์ด (แสดงทางซ้ายของชื่อ)</label>${okU(c.ico)?`<img class="fqpv cipv" src="${E(c.ico)}" alt="ตัวอย่างไอคอน">`:'<p><small>ยังไม่มีไอคอน</small></p>'}<input type="hidden" name="${n}${j}_ico" value="${E(c.ico||'')}"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" aria-label="อัปโหลดหรือเปลี่ยนไอคอนการ์ด" onchange="pico('${id}','${s.id}',${j},this)"><p><small>PNG, JPG, WebP หรือ GIF ไม่เกิน 5 MB · เลือกไฟล์ใหม่เพื่อเปลี่ยนไอคอน · กด "บันทึก" ของหน้านี้เพื่อให้มีผลกับผู้เข้าชม</small>${c.ico?` <button type="button" class="btn s c" onclick="picoClear('${id}','${s.id}',${j})">ลบไอคอน</button>`:''}</p>${f('URL รูปภาพ',j+'_m',c.m)}${f('ลิงก์',j+'_l',c.l)}${elCardUI(s,c,j)}</div>`).join('')+`<button type="button" class="btn s" onclick="iadd('${id}','${s.id}')">+ เพิ่มการ์ด</button>`;
  return `<div class="row"><b>ส่วนที่ ${i+1}</b> <button type="button" class="btn s" onclick="pmv('${id}','${s.id}',-1)">ขึ้น</button> <button type="button" class="btn s" onclick="pmv('${id}','${s.id}',1)">ลง</button> <button type="button" class="btn s" onclick="pdup('${id}','${s.id}')">ทำซ้ำ</button> <button type="button" class="btn s c" onclick="psd('${id}','${s.id}')">ลบส่วน</button><label>ประเภท</label><select name="${n}ty" onchange="psync('${id}');render()">${o(STY,s.type)}</select>${b}${elSecUI(p,s)}</div>`};
 return `<p><a class="bk" href="#/admin/pages">← จัดการเมนูและหน้าเว็บ</a></p><h1>จัดการหน้า: ${E(p.title)}</h1><p>URL: <code>#/p/${E(p.slug)}</code> <a class="btn s" href="#/preview/${p.id}">ดูตัวอย่าง</a> ${stTag(p)}</p>${dbBanner()}<form id="af" onsubmit="return false"><label>ชื่อหน้า</label><input name="p_title" value="${E(p.title)}"><label>URL (a-z 0-9 - เท่านั้น) #/p/...</label><input name="p_slug" value="${E(p.slug)}"><input type="hidden" name="p_hm" value="1"><label style="display:inline"><input type="checkbox" name="p_home" ${p.home?'checked':''}> ใช้เป็นหน้าแรกของเว็บไซต์ (#/)</label><input type="hidden" name="p_status" value="${p.status}">${elGroupsUI(p)}${p.sections.map(sec).join('')||'<p style="opacity:.6">ยังไม่มีส่วนเนื้อหา เลือกเพิ่มส่วนด้านล่าง</p>'}<p>เพิ่มส่วน: ${STY.map(([k,t])=>`<button type="button" class="btn s" onclick="padd('${id}','${k}')">${t}</button>`).join(' ')}</p><p><button type="button" class="btn" onclick="psave('${id}',0,'draft')">บันทึกฉบับร่าง</button> <button type="button" class="btn" onclick="psave('${id}',1)">บันทึกแล้วดูตัวอย่าง</button> <button type="button" class="btn b" onclick="psave('${id}',0,'published')">เผยแพร่หน้านี้</button> <button type="button" class="btn s" onclick="pcancel('${id}')">ยกเลิกการแก้ไข</button></p><small>"เผยแพร่หน้านี้" ตั้งสถานะเป็นเผยแพร่ ผู้เข้าชมทั่วไปจะเห็นหลังกด "เผยแพร่ให้ผู้เข้าชมทั่วไป" ที่แดชบอร์ด</small></form>`}
function psync(id){const p=WC.pg.find(x=>x.id===id),d=new FormData($('af'));if(!p)return;if(d.has('p_title'))p.title=STRIP(d.get('p_title'));if(d.has('p_slug'))p.slug=(d.get('p_slug')||'').trim();if(d.has('p_hm'))p.home=d.has('p_home');if(d.has('p_status'))p.status=d.get('p_status');elGSync(p,d);p.sections.forEach(s=>{const g=k=>d.get(s.id+'_'+k),st=(k,n)=>{const v=g(n);if(v!=null)s[k]=STRIP(v)};if(g('ty'))s.type=g('ty');elSSync(s,d);st('text','tx');st('url','u');st('alt','a');st('label','lb');if(d.has(s.id+'_nm')){s.nm=g('nm')==='some'?'some':'all';if(d.has(s.id+'_nx'))s.cats=nwCats(d.getAll(s.id+'_nc'))}if(d.has(s.id+'_nn')){const v=Math.floor(+g('nn'));s.nn=Number.isFinite(v)&&v>=1&&v<=24?v:NW_PER}(s.items||[]).forEach((c,j)=>{['t','d','m','l','b','u','i','ico'].map(k=>[k,k]).forEach(([k,n])=>{const v=g(j+'_'+n);if(v!=null)c[k]=STRIP(v)})})})}
const pcur=id=>WC.pg.find(x=>x.id===id);
function padd(id,t){psync(id);pcur(id).sections.push({id:mkId('s'),type:t,text:'',url:'',alt:'',label:'',items:(t==='cards'||t==='linkcards')?[{t:'',d:'',m:'',l:'',b:'',u:'',i:''}]:[]});render()}
function pmv(id,sid,d){psync(id);const a=pcur(id).sections,i=a.findIndex(x=>x.id===sid),j=i+d;if(j>=0&&j<a.length){[a[i],a[j]]=[a[j],a[i]]}render()}
function psd(id,sid){psync(id);const p=pcur(id);p.sections=p.sections.filter(x=>x.id!==sid);render()}
function iadd(id,sid){psync(id);pcur(id).sections.find(x=>x.id===sid).items.push({t:'',d:'',m:'',l:'',b:'',u:'',i:''});render()}
function imv(id,sid,j,d){psync(id);const a=pcur(id).sections.find(x=>x.id===sid).items,k=j+d;if(k>=0&&k<a.length){[a[j],a[k]]=[a[k],a[j]]}render()}
async function pico(id,sid,j,inp){const f=inp.files&&inp.files[0];inp.value='';if(!f)return;if(!CM_MIME[f.type])return say('รองรับเฉพาะไฟล์ PNG, JPG, WebP, GIF',false);if(f.size>5*1024*1024)return say('ไฟล์ใหญ่เกิน 5 MB',false);if(!DBH)return say(dbOff(),false);psync(id);let u;try{u=await mdUpload(f,'cards')}catch(e){return dbErr('อัปโหลดไอคอนไม่สำเร็จ',e)}
 if(!$('af')||!WC.pg)return;psync(id);const p=pcur(id),s=p&&p.sections.find(x=>x.id===sid),it=s&&s.items&&s.items[j];if(!it)return;it.ico=u;render()}
function picoClear(id,sid,j){psync(id);const p=pcur(id),s=p&&p.sections.find(x=>x.id===sid),it=s&&s.items&&s.items[j];if(!it)return;it.ico='';render()}
function idel(id,sid,j){psync(id);pcur(id).sections.find(x=>x.id===sid).items.splice(j,1);render()}
function pdup(id,sid){psync(id);const a=pcur(id).sections,i=a.findIndex(x=>x.id===sid),c=clone(a[i]);c.id=mkId('s');a.splice(i+1,0,c);render()}
async function psave(id,go,st){psync(id);const p=pcur(id),A=WC.pg;if(st)p.status=st;p.updated=Date.now();if(!p.title.trim())return say('ต้องระบุชื่อหน้า',false);if(!/^[a-z0-9-]+$/.test(p.slug))return say('URL ใช้ได้เฉพาะ a-z 0-9 และ -',false);if(A.some(x=>x!==p&&x.slug===p.slug))return say('URL นี้ถูกใช้แล้ว',false);if(p.home)A.forEach(x=>{if(x!==p)x.home=false});
 for(const s of p.sections){if(s.type==='image'&&s.url&&!okU(s.url))return say('URL รูปภาพต้องขึ้นต้นด้วย https://',false);if(s.type==='button'&&s.url&&!okL(s.url))return say('URL ปุ่มต้องขึ้นต้นด้วย https:// หรือ #/',false);for(const c of s.items||[]){if(s.type==='linkcards'&&c.u&&!okU(c.u))return say('URL การ์ดลิงก์ต้องขึ้นต้นด้วย https://',false);if(c.m&&!okU(c.m))return say('URL รูปการ์ดต้องขึ้นต้นด้วย https://',false);if(c.ico&&!okU(c.ico))return say('URL ไอคอนการ์ดต้องขึ้นต้นด้วย https://',false);if(c.l&&!okL(c.l))return say('ลิงก์การ์ดต้องขึ้นต้นด้วย https:// หรือ #/',false)}}
 if(!DBH)return say(dbOff(),false);
 try{await putDoc('pages',A);WC={};if(go)location.hash='#/preview/'+id;else say(st==='published'?'ตั้งสถานะเผยแพร่แล้ว (ผู้เข้าชมทั่วไปเห็นทันที)':st==='draft'?'บันทึกเป็นฉบับร่างแล้ว':'บันทึกเรียบร้อย')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
function pcancel(id){psync(id);const p=pcur(id),o=getPages().find(x=>x.id===id),d=JSON.stringify(p)!==JSON.stringify(o);if(!d){WC={};return render()}$('md').innerHTML=`<div class="modal"><div><h3>ยกเลิกการแก้ไข</h3><p>มีการเปลี่ยนแปลงที่ยังไม่ได้บันทึก ต้องการทิ้งและกลับไปใช้ข้อมูลที่บันทึกไว้ล่าสุดหรือไม่</p><button class="btn c" onclick="$('md').innerHTML='';WC={};render()">ทิ้งการแก้ไข</button> <button class="btn" onclick="$('md').innerHTML=''">แก้ไขต่อ</button></div></div>`}
/* ===== Admin: เมนูแบบละเอียด ===== */
/* สถานะหุบ/ขยาย: เก็บเฉพาะ id ที่ "ขยาย" (ค่าเริ่มต้นหุบ) จำใน localStorage ถ้าเบราว์เซอร์อนุญาต ไม่เช่นนั้นจำเฉพาะระหว่างเปิดหน้า ไม่แตะข้อมูลเมนู */
let MQ='';const MO=new Set((()=>{try{const a=JSON.parse(localStorage.getItem('kit-menu-open')||'[]');return Array.isArray(a)?a:[]}catch(e){return[]}})());
const msv=()=>{try{localStorage.setItem('kit-menu-open',JSON.stringify([...MO]))}catch(e){}};
const mel=id=>document.querySelector('.mn[data-id="'+id+'"]');
function msetOpen(e,o){e.classList.toggle('cl',!o);const b=e.querySelector(':scope>.mh>.chv');if(b)b.setAttribute('aria-expanded',String(o));const id=e.dataset.id;o?MO.add(id):MO.delete(id)}
function mtg(id){const e=mel(id);if(!e)return;msetOpen(e,e.classList.contains('cl'));msv()}
function mopen(id){const e=mel(id);if(!e)return;msetOpen(e,true);msv();const i=e.querySelector('[name="'+id+'_l"]');if(i)i.focus()}
function mall(o){document.querySelectorAll('#mtree .mn').forEach(e=>msetOpen(e,!!o));msv()}
function mlv(id,v){const e=mel(id);if(!e)return;e.querySelector(':scope>.mh .mtn').textContent=v||'(ไม่มีชื่อ)';e.dataset.s=(v||'').toLowerCase();mfs()}
function mst(id){const e=mel(id),c=document.querySelector('[name="'+id+'_s"]');if(!e||!c)return;e.querySelector(':scope>.mh .mhd').hidden=c.checked;e.querySelector(':scope>.mh .msh').textContent=c.checked?'ซ่อน':'แสดง'}
function mshow(id){const c=document.querySelector('[name="'+id+'_s"]');if(!c)return;c.checked=!c.checked;mst(id)}
function mfs(){const i=$('mq'),t=$('mtree');if(!i||!t)return;MQ=i.value;const q=MQ.trim().toLowerCase();t.classList.toggle('mqa',!!q);let n=0;t.querySelectorAll(':scope>.mn').forEach(m=>{const ms=!q||m.dataset.s.includes(q);let any=false;m.querySelectorAll(':scope>.mk>.mn').forEach(c=>{const cm=!q||c.dataset.s.includes(q);if(cm&&q)any=true;const v=cm||(ms&&!!q);c.classList.toggle('mx',!v);if(v)n++});const v=ms||any;m.classList.toggle('mx',!v);if(ms)n++});const z=$('mnone');if(z)z.style.display=q&&!n?'block':'none'}
function menuAdmin(){if(!WC.menu)WC.menu=clone(getMenu());const L=WC.menu,tops=L.filter(x=>!x.parent).sort(byo);
 const row=(x,lv,kids)=>{const hc=L.some(c=>c.parent===x.id),o=(a,v)=>a.map(([k,t])=>`<option value="${k}" ${v===k?'selected':''}>${t}</option>`).join('');const cl=MO.has(x.id)?'':' cl',nk=lv?0:L.filter(c=>c.parent===x.id).length,pa=lv?(L.find(t=>t.id===x.parent)||{}).label||'':'';return `<div class="mn${cl} l${lv}" data-id="${x.id}" data-s="${E((x.label||'').toLowerCase())}"><div class="mh"><button type="button" class="chv" onclick="mtg('${x.id}')" aria-expanded="${!cl}" aria-label="หุบหรือขยายเมนู ${E(x.label)}"><svg viewBox="0 0 24 24" width="18" height="18" fill="none" stroke="currentColor" stroke-width="2.4" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="m6 9 6 6 6-6"/></svg></button><div class="mt"><span class="pth">${E(pa)} › </span><b class="mtn">${E(x.label)||'(ไม่มีชื่อ)'}</b> <small>${lv?'เมนูย่อย':'เมนูหลัก'}${nk?' · '+nk+' เมนูย่อย':''}</small> <span class="tag mhd" ${x.show!==false?'hidden':''}>ซ่อนอยู่</span></div><div class="ma"><button type="button" class="btn s" onclick="mopen('${x.id}')">แก้ไข</button><button type="button" class="btn s" onclick="mvm('${x.id}',-1)">ขึ้น</button><button type="button" class="btn s" onclick="mvm('${x.id}',1)">ลง</button>${lv?'':`<button type="button" class="btn s" onclick="madd('${x.id}')">+ เมนูย่อย</button>`}<button type="button" class="btn s msh" onclick="mshow('${x.id}')">${x.show!==false?'ซ่อน':'แสดง'}</button><button type="button" class="btn s c" onclick="mask('${x.id}')">ลบ</button></div></div><div class="mb row">
 <label>ชื่อเมนู</label><input name="${x.id}_l" value="${E(x.label)}" oninput="mlv('${x.id}',this.value)"><label>ชื่อบนมือถือ (ว่าง = ใช้ชื่อเดียวกัน)</label><input name="${x.id}_m" value="${E(x.m)}"><label>ประเภท</label><select name="${x.id}_k">${o(KINDS,x.kind)}</select><label>หน้าเว็บที่เชื่อม (ประเภทหน้าที่สร้างจากหลังบ้าน)</label><select name="${x.id}_g">${o([['__new','+ สร้างหน้าใหม่ให้อัตโนมัติ']].concat(getPages().map(p=>[p.id,p.title])),x.pageId||'__new')}</select>${x.kind==='cms'&&x.pageId?`<a class="btn s" href="#/admin/pages/edit/${x.pageId}">จัดการเนื้อหาหน้านี้</a>`:''}<label>URL ปลายทาง (ลิงก์ภายนอก)</label><input name="${x.id}_h" value="${E(x.href)}"><label>การเปิดลิงก์ (ลิงก์ภายนอก)</label><select name="${x.id}_t">${o([['same','แท็บเดิม'],['new','แท็บใหม่']],x.tab)}</select><label>อยู่ใต้เมนู</label><select name="${x.id}_p" ${hc?'disabled':''}>${o([['','เมนูหลัก']].concat(tops.filter(t=>t.id!==x.id).map(t=>[t.id,t.label])),x.parent||'')}</select><label style="display:inline"><input type="checkbox" name="${x.id}_s" ${x.show!==false?'checked':''} onchange="mst('${x.id}')"> แสดงผล</label></div>${lv?'':`<div class="mk">${kids||''}</div>`}</div>`};
 return `<h1>เมนูนำทาง</h1><p>เมนูหลักและเมนูย่อย: ซ่อนเมนูไม่ลบหน้าปลายทาง ต้องกดบันทึกเพื่อให้มีผล</p>${dbBanner()}<div class="mtb"><input id="mq" type="search" placeholder="ค้นหาเมนูจากชื่อ" value="${E(MQ)}" oninput="mfs()" aria-label="ค้นหาเมนู"><button type="button" class="btn s" onclick="mall(0)">หุบทั้งหมด</button><button type="button" class="btn s" onclick="mall(1)">ขยายทั้งหมด</button></div><form id="af" onsubmit="return false"><div id="mtree">${tops.map(t=>row(t,0,L.filter(c=>c.parent===t.id).sort(byo).map(c=>row(c,1,'')).join(''))).join('')||'<div class="hint"><h2>ยังไม่มีเมนู</h2><p>กด "เพิ่มเมนูหลัก" เพื่อเริ่มต้น</p></div>'}</div><div id="mnone" class="hint" style="display:none"><p>ไม่พบเมนูที่ตรงกับคำค้นหา</p></div><p><button type="button" class="btn" onclick="madd('')">+ เพิ่มเมนูหลัก</button> <button type="button" class="btn b" onclick="msave()">บันทึก</button></p></form>`+(queueMicrotask(mfs),'')}
function msync(){const d=new FormData($('af'));WC.menu.forEach(x=>{const g=k=>d.get(x.id+'_'+k);x.label=STRIP(g('l')||'');x.m=STRIP(g('m')||'');x.kind=g('k')||x.kind;x.href=(g('h')||'').trim();x.tab=g('t')||'same';x.show=d.has(x.id+'_s');const pg=g('g');if(pg!=null)x.pageId=pg;const p=g('p');if(p!=null&&p!==(x.parent||'')){x.parent=p;x.order=1e6}})}
function mnorm(){const L=WC.menu;[''].concat(L.filter(x=>!x.parent).map(x=>x.id)).forEach(pid=>L.filter(x=>(x.parent||'')===pid).sort(byo).forEach((x,i)=>x.order=i*10))}
function mvm(id,d){msync();mnorm();const x=WC.menu.find(y=>y.id===id),sb=WC.menu.filter(y=>(y.parent||'')===(x.parent||'')).sort(byo),i=sb.indexOf(x),j=i+d;if(j>=0&&j<sb.length){const t=x.order;x.order=sb[j].order;sb[j].order=t}render()}
function madd(pid){msync();mnorm();const nid=mkId('m');MO.add(nid);if(pid)MO.add(pid);msv();WC.menu.push({id:nid,label:'เมนูใหม่',m:'',kind:'cms',pageId:'__new',href:'',tab:'same',show:true,order:1e6,parent:pid||''});mnorm();render()}
function mask(id){const x=WC.menu.find(y=>y.id===id),n=WC.menu.filter(c=>c.parent===id).length,hp=[x].concat(WC.menu.filter(c=>c.parent===id)).some(y=>y.kind==='cms'&&y.pageId&&y.pageId!=='__new');$('md').innerHTML=`<div class="modal"><div><h3>ยืนยันการลบเมนู</h3><p>${n?'เมนูนี้มีเมนูย่อย '+n+' รายการ ซึ่งจะถูกลบไปด้วย ':''}การลบมีผลเมื่อกดบันทึก ${hp?'เลือกได้ว่าจะเก็บหน้าเว็บที่เชื่อมอยู่ไว้หรือลบไปด้วย (การลบหน้าจะลบเนื้อหาทั้งหมดของหน้านั้น)':''}</p><button class="btn" onclick="mdel('${id}',0)">ลบเฉพาะเมนู (เก็บหน้าไว้)</button> ${hp?`<button class="btn c" onclick="mdel('${id}',1)">ลบเมนูและหน้าเว็บ</button> `:''}<button class="btn" onclick="$('md').innerHTML=''">ยกเลิก</button></div></div>`}
function mdel(id,wp){$('md').innerHTML='';msync();const ids=[id].concat(WC.menu.filter(c=>c.parent===id).map(c=>c.id));if(wp){const pids=WC.menu.filter(x=>ids.includes(x.id)&&x.kind==='cms').map(x=>x.pageId);WC.pg=(WC.pg||clone(getPages())).filter(p=>!pids.includes(p.id))}WC.menu=WC.menu.filter(x=>!ids.includes(x.id));mnorm();render()}
async function msave(){msync();mnorm();const M=WC.menu,pl=()=>WC.pg||(WC.pg=clone(getPages()));for(const x of M)if(x.kind==='cms'&&!pl().some(p=>p.id===x.pageId)){const id=mkId('pg');pl().push({id,title:x.label,slug:id,status:'draft',sections:[],updated:Date.now()});x.pageId=id}
 for(const x of M){if(!x.label.trim())return say('ทุกเมนูต้องมีชื่อ',false);if(x.kind==='heading'||x.kind==='cms')x.href='';else if(x.kind==='url'&&x.href&&!okU(x.href)&&!/^#\//.test(x.href))return say('ลิงก์ของ '+x.label+' ต้องขึ้นต้นด้วย https://',false);if(x.kind==='heading'&&x.parent)return say('หัวข้อเปิดเมนูย่อยต้องเป็นเมนูหลัก',false)}
 if(!DBH)return say(dbOff(),false);
 try{if(WC.pg)await putDoc('pages',WC.pg);await putDoc('menu',M);WC={};say('บันทึกเรียบร้อย เมนูถูกเก็บใน Supabase')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
/* ===== Admin: ตั้งค่าเว็บไซต์ (ชื่อ โลโก้ สี ท้ายเว็บ) ===== */
const SETF=[['nameTh','ชื่อเว็บไซต์ (ไทย)','t'],['nameEn','ชื่อภาษาอังกฤษ','t'],['footer','ข้อความท้ายเว็บ (ว่างได้)','a']];
function settingsAdmin(){const s=getSet();return `<h1>การตั้งค่าเว็บไซต์</h1>${dbBanner()}<form id="af" onsubmit="return false">${SETF.map(([k,l,t])=>`<label>${l}</label>${t==='a'?`<textarea name="${k}">${E(s[k])}</textarea>`:`<input name="${k}" value="${E(s[k])}">`}`).join('')}<p><button type="button" class="btn b" onclick="setSave()">บันทึก</button></p></form>`}
async function setSave(){const d=new FormData($('af')),o={};SETF.forEach(([k])=>o[k]=STRIP(d.get(k)||'').trim());if(!o.nameTh)return say('ต้องระบุชื่อเว็บไซต์',false);if(!DBH)return say(dbOff(),false);try{await putDoc('settings',Object.assign({},getSH('settings')||{},o));say('บันทึกการตั้งค่าเรียบร้อย')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
const CQ_F=['code','name','nameEn','credits','desc','descEn','scope'];
const cqNorm=c=>String(c||'').trim().replace(/\s+/g,'').toUpperCase();

/* ===== รวมรายวิชา (Merge Courses): เลือกหลายรหัสที่เป็นวิชาเดียวกัน → รหัสหลักเดียว =====
   เขียนกลับเฉพาะ code/name/nameEn/credits/desc/descEn ของรายวิชาที่เลือก ไม่แตะ type/pre/show/id ของแต่ละหลักสูตร
   ตรวจซ้ำกับข้อมูลล่าสุดในฐานข้อมูลก่อนเขียน แล้วเขียนเอกสาร programs ครั้งเดียว (ไม่เกิดการแก้ไขเพียงบางส่วน) */

/* ===== Router ===== */

/* ===== แผนผังสถาบัน (Campus Map): ข้อมูลใน site_docs key 'campus' + รูปใน Storage bucket 'campus' (ไม่มีข้อมูลตัวอย่าง) ===== */
const CM_TYPES=[['building','อาคารเรียน'],['office','สำนักงาน'],['lab','ห้องปฏิบัติการ'],['library','ห้องสมุด'],['canteen','โรงอาหาร'],['activity','พื้นที่กิจกรรม'],['facility','สิ่งอำนวยความสะดวก'],['other','อื่น ๆ']];
const CM_INTRO='เลือกหมุดบนแผนผังหรือเลือกสถานที่จากรายการเพื่อดูรายละเอียด ใช้ปุ่ม + − เลื่อนลูกกลิ้งเมาส์ หรือบีบนิ้วเพื่อซูม และลากเพื่อเลื่อนดูแผนผัง';
const CM_MIME={'image/png':'png','image/jpeg':'jpg','image/webp':'webp','image/gif':'gif'};
const cmTypeName=k=>(CM_TYPES.find(t=>t[0]===k)||CM_TYPES[CM_TYPES.length-1])[1];
const getCampus=()=>{const c=getSH('campus');return Object.assign({image:'',imgW:0,imgH:0,intro:'',places:[]},c&&typeof c==='object'&&!Array.isArray(c)?c:{})};
const cmAll=()=>{const p=getCampus().places;return Array.isArray(p)?p.filter(x=>x&&x.id):[]};
const cmPlaces=()=>cmAll().filter(p=>p.show!==false);
const cmHas=p=>!!p&&typeof p.x==='number'&&typeof p.y==='number'&&isFinite(p.x)&&isFinite(p.y);
const cmTy=p=>CM_TYPES.some(t=>t[0]===p.type)?p.type:'other';
const CM={key:null,sel:'',q:'',type:'',s:1,tx:0,ty:0,s0:1,vw:0,vh:0,init:false,ptr:new Map(),drag:null,pinch:null,moved:false,pk:false};
const cmEl=i=>document.getElementById(i);
const cmMatch=p=>(!CM.type||cmTy(p)===CM.type)&&(!CM.q||[p.name,p.floor,p.desc,cmTypeName(cmTy(p))].join(' ').toLowerCase().includes(CM.q));
const cmCount=(n,t)=>!t?'ยังไม่มีสถานที่ในแผนผัง':n?'แสดง '+n+' จาก '+t+' แห่ง':'ไม่พบสถานที่ที่ตรงกับการค้นหา';
const PINSVG='<svg viewBox="0 0 24 32" width="28" height="36" aria-hidden="true"><path d="M12 31C12 31 2 19 2 12a10 10 0 0120 0c0 7-10 19-10 19z" stroke="#20243A" stroke-width="2"/><circle cx="12" cy="12" r="4" fill="#20243A"/></svg>';
function cmDetail(id){const p=cmPlaces().find(x=>x.id===id);if(!p)return '<p class="evm">เลือกสถานที่จากรายการหรือหมุดบนแผนผังเพื่อดูรายละเอียด</p>';
 const row=(l,v)=>v?`<dt>${l}</dt><dd>${E(v)}</dd>`:'';
 return `<div class="cmdc"><button type="button" class="cmx" aria-label="ปิดรายละเอียด" onclick="cmPick('')">${ic('close')}</button>${okU(p.img)?`<img class="cmdi" src="${E(p.img)}" alt="${E(p.name)}">`:''}<h2>${E(p.name)}</h2><p><span class="tag">${E(cmTypeName(cmTy(p)))}</span></p>${p.desc?`<p class="pl">${E(p.desc)}</p>`:''}<dl class="cmdl">${row('ชั้น/ห้อง',p.floor)}${row('เวลาเปิดให้บริการ',p.hours)}${row('ข้อมูลติดต่อ',p.contact)}</dl>${cmHas(p)?`<p><button type="button" class="btn s" onclick="cmFocus('${E(p.id)}',true)">${ic('pin')} ดูตำแหน่งบนแผนผัง</button></p>`:'<p class="evm">ยังไม่ได้กำหนดตำแหน่งบนแผนผัง</p>'}</div>`}
function cmView(){
 if(CM.key!==location.hash){CM.key=location.hash;CM.init=false;CM.sel='';CM.q='';CM.type=''}
 const c=getCampus(),P=cmPlaces(),intro=E(c.intro||CM_INTRO);
 if(!okU(c.image))return `<div class="cm"><p class="pl">${intro}</p><div class="empty-ev"><b>ยังไม่มีแผนผังสถาบัน</b><br>${Auth.canAccessAdmin()?'<a href="#/admin/campus">อัปโหลดภาพแผนผังที่หลังบ้าน</a>':'ผู้ดูแลระบบยังไม่ได้อัปโหลดภาพแผนผัง กรุณากลับมาใหม่ภายหลัง'}</div></div>`;
 const used=CM_TYPES.filter(t=>P.some(p=>cmTy(p)===t[0])),dim=c.imgW>0&&c.imgH>0?`width:${+c.imgW}px;height:${+c.imgH}px;`:'',tf=CM.init?`transform:translate(${CM.tx}px,${CM.ty}px) scale(${CM.s});`:'',n=P.filter(cmMatch).length;
 return `<div class="cm"><p class="pl">${intro}</p><div class="cmt"><input id="cmq" type="search" placeholder="ค้นหาชื่ออาคารหรือสถานที่" value="${E(CM.q)}" oninput="cmFilter()" aria-label="ค้นหาชื่ออาคารหรือสถานที่"><div class="cmcs" role="group" aria-label="กรองประเภทสถานที่"><button type="button" class="cmc${CM.type===''?' on':''}" data-t="" onclick="cmType('')">ทั้งหมด</button>${used.map(t=>`<button type="button" class="cmc${CM.type===t[0]?' on':''}" data-t="${t[0]}" onclick="cmType('${t[0]}')">${t[1]}</button>`).join('')}</div></div>
<div class="cmw"><div class="cmmain"><div class="cmv" id="cmv" tabindex="0" role="application" aria-label="แผนผังสถาบัน ลากเพื่อเลื่อน ใช้ปุ่มบวกลบหรือลูกกลิ้งเมาส์เพื่อซูม"><div class="cms" id="cms" style="${dim}${tf}"><img src="${E(c.image)}" alt="แผนผังสถาบัน" draggable="false">${P.filter(cmHas).map(p=>`<button type="button" class="cmp${CM.sel===p.id?' on':''}" data-id="${E(p.id)}" style="left:${p.x}%;top:${p.y}%"${cmMatch(p)?'':' hidden'} onclick="cmPin('${E(p.id)}')" aria-label="${E(p.name)}" title="${E(p.name)}">${PINSVG}</button>`).join('')}</div><div class="cmz"><button type="button" onclick="cmZoom(1.4)" aria-label="ซูมเข้า">+</button><button type="button" onclick="cmZoom(1/1.4)" aria-label="ซูมออก">&minus;</button><button type="button" onclick="cmReset()" aria-label="ดูทั้งแผนผัง" title="ดูทั้งแผนผัง">&#8634;</button></div></div><div class="cmd" id="cmd" aria-live="polite">${cmDetail(CM.sel)}</div></div>
<div class="cml"><p class="evm" id="cmn" aria-live="polite">${cmCount(n,P.length)}</p><ul id="cml">${P.map(p=>`<li${cmMatch(p)?'':' hidden'} data-id="${E(p.id)}"><button type="button" class="cmi${CM.sel===p.id?' on':''}" onclick="cmPick('${E(p.id)}',true)"><b>${E(p.name)}</b><span class="tag">${E(cmTypeName(cmTy(p)))}</span>${p.floor?`<small>${E(p.floor)}</small>`:''}</button></li>`).join('')}</ul></div></div></div>`}
function cmApplyT(){const s=cmEl('cms');if(!s)return;s.style.transform='translate('+CM.tx+'px,'+CM.ty+'px) scale('+CM.s+')';s.style.setProperty('--inv',(1/CM.s).toFixed(4))}
function cmClamp(){const s=cmEl('cms');if(!s)return;const w=s.offsetWidth*CM.s,h=s.offsetHeight*CM.s;CM.tx=w<=CM.vw?(CM.vw-w)/2:Math.min(0,Math.max(CM.vw-w,CM.tx));CM.ty=h<=CM.vh?(CM.vh-h)/2:Math.min(0,Math.max(CM.vh-h,CM.ty))}
function cmFit(){const v=cmEl('cmv'),s=cmEl('cms');if(!v||!s)return;CM.vw=v.clientWidth;CM.vh=v.clientHeight;const w=s.offsetWidth,h=s.offsetHeight;if(!w||!h||!CM.vw||!CM.vh)return;const f=Math.min(CM.vw/w,CM.vh/h);if(!CM.init||Math.abs(f-CM.s0)>1e-6){const keep=CM.init&&CM.s>CM.s0*1.0001;CM.s0=f;if(!keep)CM.s=f}CM.init=true;cmClamp();cmApplyT()}
function cmZoomAt(f,cx,cy){const ns=Math.min(CM.s0*10,Math.max(CM.s0,CM.s*f)),r=ns/CM.s;CM.tx=cx-(cx-CM.tx)*r;CM.ty=cy-(cy-CM.ty)*r;CM.s=ns;cmClamp();cmApplyT()}
function cmZoom(f){cmAnim();cmZoomAt(f,CM.vw/2,CM.vh/2)}
function cmReset(){cmAnim();CM.s=CM.s0;CM.tx=0;CM.ty=0;cmClamp();cmApplyT()}
function cmAnim(){const s=cmEl('cms');if(!s||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches))return;s.classList.add('an');clearTimeout(CM.at);CM.at=setTimeout(()=>s.classList.remove('an'),420)}
function cmFocus(id,anim){const p=cmPlaces().find(x=>x.id===id),s=cmEl('cms');if(!p||!cmHas(p)||!s)return;if(anim!==false)cmAnim();CM.s=Math.min(CM.s0*10,Math.max(CM.s,CM.s0*2.5));CM.tx=CM.vw/2-(p.x/100*s.offsetWidth)*CM.s;CM.ty=CM.vh/2-(p.y/100*s.offsetHeight)*CM.s;cmClamp();cmApplyT()}
function cmPick(id,fromList){CM.sel=id||'';document.querySelectorAll('.cmp,.cmi').forEach(e=>{const i=e.dataset.id||(e.parentElement&&e.parentElement.dataset.id);e.classList.toggle('on',!!id&&i===id)});const d=cmEl('cmd');if(d)d.innerHTML=cmDetail(CM.sel);if(id){cmFocus(id);if(fromList){const v=cmEl('cmv');if(v&&v.scrollIntoView)try{v.scrollIntoView({block:'nearest',behavior:'smooth'})}catch(e){}}}}
function cmPin(id){if(CM.moved)return;cmPick(id)}
function cmFilter(){const i=cmEl('cmq');CM.q=i?i.value.trim().toLowerCase():'';cmApplyFilter()}
function cmType(t){CM.type=t||'';document.querySelectorAll('.cmc').forEach(b=>b.classList.toggle('on',(b.dataset.t||'')===CM.type));cmApplyFilter()}
function cmApplyFilter(){const P=cmPlaces(),m=new Map(P.map(p=>[p.id,cmMatch(p)]));let n=0;P.forEach(p=>{if(m.get(p.id))n++});document.querySelectorAll('.cmp').forEach(e=>{e.hidden=!m.get(e.dataset.id)});document.querySelectorAll('#cml li').forEach(e=>{e.hidden=!m.get(e.dataset.id)});const c=cmEl('cmn');if(c)c.textContent=cmCount(n,P.length)}
function cmDown(e){if(e.pointerType==='mouse'&&e.button!==0)return;if(e.target.closest&&e.target.closest('.cmz'))return;const v=cmEl('cmv'),s=cmEl('cms');CM.ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});if(s)s.classList.remove('an');if(v)v.classList.add('dr');
 if(CM.ptr.size===1){CM.drag={x:e.clientX,y:e.clientY,tx:CM.tx,ty:CM.ty};CM.pinch=null;CM.moved=false}
 else if(CM.ptr.size===2){const a=[...CM.ptr.values()];CM.pinch={d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1,mx:(a[0].x+a[1].x)/2,my:(a[0].y+a[1].y)/2};CM.drag=null;CM.moved=true}}
function cmMove(e){if(CM.pk&&e.pointerType==='mouse'&&(e.buttons&1))cmpkSet(e);if(!CM.ptr.has(e.pointerId))return;CM.ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});const v=cmEl('cmv');if(!v)return;
 if(CM.pinch&&CM.ptr.size>=2){const a=[...CM.ptr.values()],d=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1,mx=(a[0].x+a[1].x)/2,my=(a[0].y+a[1].y)/2,r=v.getBoundingClientRect();CM.tx+=mx-CM.pinch.mx;CM.ty+=my-CM.pinch.my;cmZoomAt(d/CM.pinch.d,mx-r.left,my-r.top);CM.pinch.d=d;CM.pinch.mx=mx;CM.pinch.my=my}
 else if(CM.drag){const dx=e.clientX-CM.drag.x,dy=e.clientY-CM.drag.y;if(Math.abs(dx)+Math.abs(dy)>5)CM.moved=true;if(CM.moved){CM.tx=CM.drag.tx+dx;CM.ty=CM.drag.ty+dy;cmClamp();cmApplyT()}}}
function cmUp(e){CM.pk=false;if(!CM.ptr.has(e.pointerId))return;CM.ptr.delete(e.pointerId);const v=cmEl('cmv');if(CM.ptr.size===0){CM.drag=null;CM.pinch=null;if(v)v.classList.remove('dr');setTimeout(()=>{CM.moved=false},0)}else if(CM.ptr.size===1){const a=[...CM.ptr.values()][0];CM.drag={x:a.x,y:a.y,tx:CM.tx,ty:CM.ty};CM.pinch=null}}
function cmWheel(e){e.preventDefault();const v=cmEl('cmv');if(!v)return;const r=v.getBoundingClientRect();cmZoomAt(Math.exp(-e.deltaY*(e.ctrlKey?0.01:0.0015)),e.clientX-r.left,e.clientY-r.top)}
function cmKey(e){const k=e.key,st=48;if(k==='+'||k==='='){cmZoom(1.3)}else if(k==='-'||k==='_'){cmZoom(1/1.3)}else if(k==='ArrowLeft')CM.tx+=st;else if(k==='ArrowRight')CM.tx-=st;else if(k==='ArrowUp')CM.ty+=st;else if(k==='ArrowDown')CM.ty-=st;else return;e.preventDefault();cmClamp();cmApplyT()}
function cmMount(){const v=cmEl('cmv');if(!v)return;v.addEventListener('pointerdown',cmDown);v.addEventListener('wheel',cmWheel,{passive:false});v.addEventListener('keydown',cmKey);
 const s=cmEl('cms'),im=s&&s.querySelector('img');if(!im)return;cmFit();
 const go=()=>{if(!s.offsetWidth||!s.offsetHeight){s.style.width=im.naturalWidth+'px';s.style.height=im.naturalHeight+'px'}cmFit()};
 if(im.complete&&im.naturalWidth)go();else{im.onload=go;im.onerror=()=>{const d=cmEl('cmd');if(d)d.innerHTML='<p class="evm">โหลดภาพแผนผังไม่สำเร็จ</p>'}}}
(function(){try{document.addEventListener('pointermove',cmMove);document.addEventListener('pointerup',cmUp);document.addEventListener('pointercancel',cmUp);addEventListener('resize',()=>{if(cmEl('cmv'))cmFit()})}catch(e){}})();

/* ===== ตัวแก้ไขผัง Isometric (ลากวาง): เก็บ items + lay ใน site_docs 'campus' ร่วมกับภาพ/สถานที่/หมุดเดิม (ไม่แตะ field เดิม) =====
   Asset: assets/campus/*.svg + catalog.json (เสิร์ฟจากโฟลเดอร์โปรเจกต์) · พิกัดเป็นพิกัดผัง (ไม่ใช่พิกเซลหน้าจอ) · ลำดับซ้อน: layer → z → y */
const CE_BASE='assets/campus/',CE_HASH='#/admin/campus/layout',CE_U=24;
const CE={on:false,cat:null,am:null,catErr:'',lay:{w:1440,h:900,ox:720,oy:170,bg:'#cfe8f3'},items:[],sel:new Set(),hist:[],redo:[],base:null,savedStr:'',src:'',loaded:false,booting:false,force:false,saving:false,grid:true,snap:true,hand:false,space:false,q:'',cg:'',lib:false,prop:false,remote:false,v:{s:1,tx:0,ty:0,init:false},ptr:new Map(),drag:null,ld:null,ac:new Map(),gl:false,gp:false,n:0,rank:null};
const ceN=(v,d,lo,hi)=>{v=+v;return isFinite(v)?Math.min(hi,Math.max(lo,v)):d};
const ceId=()=>'it'+Date.now().toString(36)+(++CE.n).toString(36)+Math.random().toString(36).slice(2,4);
const ceClean=a=>(Array.isArray(a)?a:[]).filter(i=>i&&typeof i==='object'&&typeof i.a==='string'&&isFinite(+i.x)&&isFinite(+i.y)).map(i=>Object.assign({},i,{id:String(i.id||ceId()),a:i.a,x:+i.x,y:+i.y,s:ceN(i.s,1,.2,4),r:ceN(i.r,0,-360,360),z:Math.round(ceN(i.z,0,-9999,9999)),fx:i.fx?1:0}));
const ceCleanLay=l=>{l=l&&typeof l==='object'?l:{};return {w:Math.round(ceN(l.w,1440,400,6000)),h:Math.round(ceN(l.h,900,300,6000)),ox:ceN(l.ox,720,-6000,6000),oy:ceN(l.oy,170,-6000,6000),bg:/^#[0-9a-f]{6}$/i.test(l.bg||'')?l.bg:'#cfe8f3'}};
const ceSS=v=>JSON.stringify(v,(k,x)=>x&&typeof x==='object'&&!Array.isArray(x)?Object.keys(x).sort().reduce((o,q)=>(o[q]=x[q],o),{}):x);
const ceStr=()=>ceSS([CE.items,CE.lay]);
const ceDirty=()=>CE.loaded&&ceStr()!==CE.savedStr;
const ceAs=id=>CE.am&&CE.am.get(id);
const ceSorted=()=>CE.items.map((it,k)=>[it,k]).sort((p,q)=>{const a=ceAs(p[0].a),b=ceAs(q[0].a);return ((a?a.layer:1)-(b?b.layer:1))||(p[0].z-q[0].z)||(p[0].y-q[0].y)||(p[1]-q[1])}).map(p=>p[0]);
const ceModal=h=>{$('md').innerHTML=`<div class="modal"><div>${h}</div></div>`};
const ceClose=()=>{$('md').innerHTML=''};
function ceMsg(t,ok=true){const m=$('ce-msg');if(!m)return;m.textContent=t;m.className='msg '+(ok?'ok':'er');m.hidden=false;clearTimeout(CE.mt);if(ok)CE.mt=setTimeout(()=>{const x=$('ce-msg');if(x)x.hidden=true},4500)}

/* ---------- โหลด/เริ่มต้น ---------- */
async function ceLoadDoc(){let doc=null,upd=null;
 if(DBH){const {data,error}=await DBH.from('site_docs').select('data,updated_at').eq('key','campus').maybeSingle();if(error)throw error;if(data){doc=data.data;upd=data.updated_at}CE.src='db'}
 else{doc=getCampus();CE.src='local'}
 doc=doc&&typeof doc==='object'&&!Array.isArray(doc)?doc:{};
 CE.base=clone(doc);CE.baseUpd=upd;CE.items=ceClean(doc.items);CE.lay=ceCleanLay(doc.lay);CE.sel=new Set();CE.hist=[];CE.redo=[];CE.savedStr=ceStr();CE.remote=false}
async function ceBoot(){if(CE.booting)return;CE.booting=true;
 try{
  if(!CE.cat){try{const r=await fetch(CE_BASE+'catalog.json',{cache:'no-cache'});if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();if(!j||!Array.isArray(j.assets)||!Array.isArray(j.cats))throw new Error('รูปแบบ catalog.json ไม่ถูกต้อง');CE.cat=j;CE.am=new Map(j.assets.map(a=>[a.id,a]));CE.catErr='';j.assets.forEach(a=>{if(CE.ac.get(a.id)===undefined)ceAlphaFor(a)})}catch(e){CE.catErr='โหลดคลัง Asset ไม่สำเร็จ ('+e.message+') ตรวจสอบว่าโฟลเดอร์ assets/campus/ ถูก deploy ขึ้นเว็บพร้อมกับ index.html'}}
  if(!CE.loaded||CE.force){CE.force=false;await ceLoadDoc();CE.loaded=true}
 }catch(e){CE.catErr=(CE.catErr?CE.catErr+' · ':'')+'โหลดข้อมูลผังไม่สำเร็จ: '+((e&&e.message)||e)}
 finally{CE.booting=false;ceFull()}}
function ceAdmin(){if(!CE.on){CE.on=true;CE.force=CE.loaded&&!ceDirty();ceBoot()}
 const b=(id,fn,t,c)=>`<button type="button" class="btn s${c?' '+c:''}"${id?` id="${id}"`:''} onclick="${fn}">${t}</button>`,sep='<span class="ce-sep"></span>';
 return `<div class="cedt"><p><a class="bk" href="#/admin/campus" onclick="return ceLeave()">&#8592; กลับไปหน้าจัดการแผนผังสถาบัน</a></p><h1>ตัวแก้ไขผัง Isometric</h1>${dbBanner()}<div id="ce-banner"></div>
<div class="ce-bar" role="toolbar" aria-label="เครื่องมือแก้ไขผัง">${b('ce-undo','ceUndo()','&#8630; ย้อนกลับ')}${b('ce-redo','ceRedo()','ทำซ้ำ &#8631;')}${sep}${b('ce-dup','ceDup()','คัดลอก')}${b('ce-flip','ceFlip()','พลิกซ้าย-ขวา')}${b('ce-del','ceDel()','ลบ','c')}${sep}${b('','ceZoom(1.25)','+')}${b('','ceZoom(.8)','&minus;')}${b('','ceFit()','พอดีจอ')}${b('ce-hand','ceHand()','มือเลื่อน')}
<label class="ce-ck"><input type="checkbox" ${CE.grid?'checked':''} onchange="ceGrid(this.checked)"> กริด</label><label class="ce-ck"><input type="checkbox" ${CE.snap?'checked':''} onchange="CE.snap=this.checked"> จับกริด</label>${sep}${b('','ceSampleAsk()','โหลดผังตัวอย่าง')}${b('','ceBackup()','ดาวน์โหลดสำรอง')}${b('','ceClearAsk()','ล้างผัง','c')}<span class="ce-grow"></span><span id="ce-st" class="ce-st"></span>${b('ce-save','ceSave()','บันทึก','b')}</div>
<div class="ce-mt">${b('','ceTog(\'lib\')','คลัง Asset')}${b('','ceTog(\'prop\')','คุณสมบัติ')}</div><div id="ce-msg" class="msg" hidden role="status"></div>
<div class="ce-wrap${CE.lib?' lo':''}${CE.prop?' po':''}" id="ce-wrap"><aside class="ce-lib" id="ce-lib" aria-label="คลัง Asset"></aside><div class="ce-main"><div class="ce-view${CE.hand?' hand':''}" id="ce-view" tabindex="0" role="application" aria-label="พื้นที่ทำแผนผัง ลากเพื่อวางหรือย้าย Asset ใช้ลูกกลิ้งเมาส์เพื่อซูม"><div class="ce-stage" id="ce-stage"></div></div><p class="evm"><small>คลิกเลือก · ลากย้าย · Shift+คลิกเลือกหลายชิ้น · มุมล่างขวาของชิ้นที่เลือก = ปรับขนาด · Space/ปุ่มกลางเมาส์/ปุ่ม "มือเลื่อน" = เลื่อนพื้นที่ · Del ลบ · Ctrl+Z/Y ย้อน/ทำซ้ำ · Ctrl+D คัดลอก · Ctrl+S บันทึก</small></p></div><aside class="ce-prop" id="ce-prop" aria-label="คุณสมบัติ"></aside></div></div>`}
function ceMount(){const v=$('ce-view');if(!v){CE.on=false;return}
 if(!CE.gl){CE.gl=true;document.addEventListener('pointermove',ceMove);document.addEventListener('pointerup',ceUp);document.addEventListener('pointercancel',ceCancel);document.addEventListener('keydown',ceKey);document.addEventListener('keyup',ceKeyUp);addEventListener('resize',()=>{if($('ce-view')&&!CE.v.init)ceFit()});addEventListener('beforeunload',e=>{if(ceDirty()){e.preventDefault();e.returnValue=''}})}
 v.addEventListener('pointerdown',ceDown);v.addEventListener('wheel',ceWheel,{passive:false});
 if(CE.loaded&&CE.src==='local'&&DBH&&!ceDirty()&&!CE.booting){CE.force=true;ceBoot();return}
 ceFull();if(!CE.v.init)ceFit()}
function ceFull(){if(!$('ce-view'))return;ceLibDraw();ceDraw();ceProp();ceStatus();ceBanner();const e=$('ce-view');if(e&&!CE.v.init)ceFit();const m=$('ce-msg');if(m&&CE.catErr){m.textContent=CE.catErr;m.className='msg er';m.hidden=false}}

/* ---------- วาดพื้นที่ทำงาน ---------- */
function ceBox(it){const a=ceAs(it.a);if(!a)return {l:it.x-20,t:it.y-20,w:40,h:40};const s=it.s,w=a.w*s,h=a.h*s;return {l:it.fx?it.x-(a.w-a.ax)*s:it.x-a.ax*s,t:it.y-a.ay*s,w,h}}
function ceIs(it,k){const a=ceAs(it.a);if(!a)return `left:${it.x-20}px;top:${it.y-20}px;width:40px;height:40px;z-index:${k+1}`;const s=it.s;return `left:${(it.x-a.ax*s).toFixed(1)}px;top:${(it.y-a.ay*s).toFixed(1)}px;width:${(a.w*s).toFixed(1)}px;height:${(a.h*s).toFixed(1)}px;z-index:${k+1};transform-origin:${(a.ax*s).toFixed(1)}px ${(a.ay*s).toFixed(1)}px;${it.fx?'transform:scaleX(-1)':''}`}
function ceGridSvg(){if(!CE.grid)return '';const L=CE.lay,U=CE_U,P=(gx,gy)=>(L.ox+(gx-gy)*U).toFixed(0)+','+(L.oy+(gx+gy)*U/2).toFixed(0);let d1='',d2='';for(let k=-10;k<=45;k++){const t=`M${P(k,-10)}L${P(k,45)}M${P(-10,k)}L${P(45,k)}`;if(k%5===0)d2+=t;else d1+=t}
 return `<svg class="ce-grid" width="${L.w}" height="${L.h}" viewBox="0 0 ${L.w} ${L.h}" aria-hidden="true"><path d="${d1}" stroke="#000" stroke-opacity=".10" fill="none"/><path d="${d2}" stroke="#000" stroke-opacity=".24" fill="none"/></svg>`}
function ceDraw(){const st=$('ce-stage');if(!st)return;const L=CE.lay,S=ceSorted();CE.rank=new Map(S.map((it,k)=>[it.id,k]));
 let h=`<div class="ce-bg" style="width:${L.w}px;height:${L.h}px;background:${E(L.bg)}"></div>`;
 S.forEach((it,k)=>{const a=ceAs(it.a);h+=a?`<img class="ce-it" data-id="${E(it.id)}" src="${E(a.file)}" alt="" draggable="false" style="${ceIs(it,k)}">`:`<div class="ce-it ce-miss" data-id="${E(it.id)}" title="ไม่พบ Asset ${E(it.a)}" style="${ceIs(it,k)}">?</div>`});
 h+=ceGridSvg()+'<div id="ce-sels"></div>';st.style.width=L.w+'px';st.style.height=L.h+'px';st.innerHTML=h;ceSelBoxes();ceApplyV()}
function ceSelBoxes(){const h=$('ce-sels');if(!h)return;let o='';const one=CE.sel.size===1;CE.items.forEach(it=>{if(!CE.sel.has(it.id))return;const b=ceBox(it);o+=`<div class="ce-sel" style="left:${b.l}px;top:${b.t}px;width:${b.w}px;height:${b.h}px"></div>`;if(one)o+=`<div class="ce-h" id="ce-h" style="left:${b.l+b.w}px;top:${b.t+b.h}px" title="ลากเพื่อปรับขนาด"></div>`});h.innerHTML=o;ceBtns()}
function ceMoveEls(){const st=$('ce-stage');if(!st)return;CE.items.forEach(it=>{if(!CE.sel.has(it.id))return;const el=st.querySelector('[data-id="'+CSS.escape(it.id)+'"]');if(el)el.style.cssText=ceIs(it,CE.rank&&CE.rank.has(it.id)?CE.rank.get(it.id):0)});ceSelBoxes();ceStatus()}
function ceApplyV(){const s=$('ce-stage');if(!s)return;const v=CE.v;s.style.transform=`translate(${v.tx}px,${v.ty}px) scale(${v.s})`;s.style.setProperty('--inv',(1/v.s).toFixed(4))}
function ceFit(){const v=$('ce-view');if(!v)return;const L=CE.lay,w=v.clientWidth,h=v.clientHeight;if(!w||!h)return;const s=Math.min(w/L.w,h/L.h)*.98;CE.v={s,tx:(w-L.w*s)/2,ty:(h-L.h*s)/2,init:true};ceApplyV()}
function ceZoomAt(f,cx,cy){const v=CE.v,ns=Math.min(4,Math.max(.1,v.s*f)),r=ns/v.s;v.tx=cx-(cx-v.tx)*r;v.ty=cy-(cy-v.ty)*r;v.s=ns;ceApplyV()}
function ceZoom(f){const v=$('ce-view');if(v)ceZoomAt(f,v.clientWidth/2,v.clientHeight/2)}
function ceW(e){const r=$('ce-view').getBoundingClientRect(),v=CE.v;return {x:(e.clientX-r.left-v.tx)/v.s,y:(e.clientY-r.top-v.ty)/v.s}}
function ceSnapP(x,y){if(!CE.snap)return {x,y};const L=CE.lay,U=CE_U,sx=x-L.ox,sy=y-L.oy,gx=(2*sy/U+sx/U)/2,gy=(2*sy/U-sx/U)/2,q=v=>Math.round(v*2)/2,a=q(gx),b=q(gy);return {x:L.ox+(a-b)*U,y:L.oy+(a+b)*U/2}}
function ceGrid(on){CE.grid=!!on;ceDraw()}
function ceHand(){CE.hand=!CE.hand;const v=$('ce-view');if(v)v.classList.toggle('hand',CE.hand||CE.space);const b=$('ce-hand');if(b)b.classList.toggle('b',CE.hand)}
function ceTog(k){CE[k]=!CE[k];const w=$('ce-wrap');if(w){w.classList.toggle('lo',CE.lib);w.classList.toggle('po',CE.prop);if(k==='lib'&&CE.lib){CE.prop=false;w.classList.remove('po')}if(k==='prop'&&CE.prop){CE.lib=false;w.classList.remove('lo')}}}

/* ---------- เลือก/ลาก/ปรับขนาด ---------- */
function ceAlphaFor(a){CE.ac.set(a.id,null);const im=new Image();im.onload=()=>{try{const c=document.createElement('canvas');c.width=a.w;c.height=a.h;const x=c.getContext('2d',{willReadFrequently:true});x.drawImage(im,0,0,a.w,a.h);CE.ac.set(a.id,{d:x.getImageData(0,0,a.w,a.h).data,w:a.w})}catch(e){CE.ac.set(a.id,false)}};im.onerror=()=>CE.ac.set(a.id,false);im.src=a.file;return null}
function ceHit(wx,wy){const L=ceSorted();for(let k=L.length-1;k>=0;k--){const it=L[k],a=ceAs(it.a);if(!a)continue;const s=it.s;let px=(wx-(it.x-a.ax*s))/s;const py=(wy-(it.y-a.ay*s))/s;if(it.fx)px=2*a.ax-px;if(px<0||py<0||px>=a.w||py>=a.h)continue;let m=CE.ac.get(a.id);if(m===undefined)m=ceAlphaFor(a);if(m&&m.d){if(m.d[(Math.floor(py)*m.w+Math.floor(px))*4+3]<20)continue}return it}return null}
const ceSelItems=()=>CE.items.filter(i=>CE.sel.has(i.id));
function ceDown(e){const v=$('ce-view');if(!v)return;if(e.pointerType==='mouse'&&e.button===2)return;try{v.focus({preventScroll:true})}catch(x){}CE.ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});
 if(CE.ptr.size===2){const a=[...CE.ptr.values()];CE.drag={t:'pinch',d:Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1,mx:(a[0].x+a[1].x)/2,my:(a[0].y+a[1].y)/2};return}
 if(CE.ptr.size>2)return;const w=ceW(e),mid=e.pointerType==='mouse'&&e.button===1;
 if(e.target&&e.target.id==='ce-h'&&CE.sel.size===1){const it=ceSelItems()[0];CE.drag={t:'size',id:it.id,s0:it.s,d0:Math.hypot(w.x-it.x,w.y-it.y)||1,pushed:false};e.preventDefault();return}
 if(mid||CE.hand||CE.space){CE.drag={t:'pan',x:e.clientX,y:e.clientY,tx:CE.v.tx,ty:CE.v.ty};v.classList.add('dr');e.preventDefault();return}
 const hit=ceHit(w.x,w.y),add=e.shiftKey||e.ctrlKey||e.metaKey;
 if(hit){if(add){if(CE.sel.has(hit.id))CE.sel.delete(hit.id);else CE.sel.add(hit.id)}else if(!CE.sel.has(hit.id))CE.sel=new Set([hit.id]);const o=new Map();ceSelItems().forEach(i=>o.set(i.id,{x:i.x,y:i.y}));CE.drag={t:'move',sx:e.clientX,sy:e.clientY,o,pid:hit.id,pushed:false,moved:false};ceSelBoxes();ceProp()}
 else{if(!add&&CE.sel.size){CE.sel=new Set();ceSelBoxes();ceProp()}CE.drag={t:'pan',x:e.clientX,y:e.clientY,tx:CE.v.tx,ty:CE.v.ty};v.classList.add('dr')}}
function ceMove(e){if(CE.ld)return ceLibMove(e);if(!CE.ptr.has(e.pointerId))return;CE.ptr.set(e.pointerId,{x:e.clientX,y:e.clientY});const d=CE.drag;if(!d)return;
 if(d.t==='pinch'&&CE.ptr.size>=2){const a=[...CE.ptr.values()],nd=Math.hypot(a[0].x-a[1].x,a[0].y-a[1].y)||1,mx=(a[0].x+a[1].x)/2,my=(a[0].y+a[1].y)/2,r=$('ce-view').getBoundingClientRect();CE.v.tx+=mx-d.mx;CE.v.ty+=my-d.my;ceZoomAt(nd/d.d,mx-r.left,my-r.top);d.d=nd;d.mx=mx;d.my=my}
 else if(d.t==='pan'){CE.v.tx=d.tx+e.clientX-d.x;CE.v.ty=d.ty+e.clientY-d.y;ceApplyV()}
 else if(d.t==='move'){if(!d.moved&&Math.abs(e.clientX-d.sx)+Math.abs(e.clientY-d.sy)<4)return;if(!d.pushed){cePush();d.pushed=true}d.moved=true;const dx=(e.clientX-d.sx)/CE.v.s,dy=(e.clientY-d.sy)/CE.v.s,p0=d.o.get(d.pid);let ox=dx,oy=dy;if(p0){const sp=ceSnapP(p0.x+dx,p0.y+dy);ox=sp.x-p0.x;oy=sp.y-p0.y}CE.items.forEach(it=>{const o=d.o.get(it.id);if(o){it.x=+(o.x+ox).toFixed(1);it.y=+(o.y+oy).toFixed(1)}});ceMoveEls()}
 else if(d.t==='size'){const it=CE.items.find(i=>i.id===d.id);if(!it)return;const w=ceW(e),r=Math.hypot(w.x-it.x,w.y-it.y)/d.d0;if(!d.pushed){cePush();d.pushed=true}it.s=ceN(+(d.s0*r).toFixed(2),it.s,.2,4);ceMoveEls()}}
function ceUp(e){if(CE.ld)return ceLibUp(e);if(!CE.ptr.has(e.pointerId))return;CE.ptr.delete(e.pointerId);const v=$('ce-view'),d=CE.drag;
 if(CE.ptr.size===0){CE.drag=null;if(v)v.classList.remove('dr');if(d&&(d.t==='move'||d.t==='size')&&d.pushed)ceAfter();else ceProp()}
 else if(CE.ptr.size===1){const a=[...CE.ptr.values()][0];CE.drag={t:'pan',x:a.x,y:a.y,tx:CE.v.tx,ty:CE.v.ty}}}
function ceCancel(e){if(CE.ld){if(CE.ld.g)CE.ld.g.remove();CE.ld=null;return}ceUp(e)}
function ceWheel(e){e.preventDefault();const v=$('ce-view');if(!v)return;const r=v.getBoundingClientRect();ceZoomAt(Math.exp(-e.deltaY*(e.ctrlKey?.01:.0015)),e.clientX-r.left,e.clientY-r.top)}
function ceKey(e){if(!CE.on||!$('ce-view')||($('md')&&$('md').innerHTML))return;const t=e.target;if(t&&t.matches&&t.matches('input,textarea,select'))return;const k=e.key,K=(k||'').toLowerCase(),m=e.ctrlKey||e.metaKey;
 if(k===' '&&t&&(t.id==='ce-view'||t===document.body)){CE.space=true;const v=$('ce-view');if(v)v.classList.add('hand');e.preventDefault();return}
 if(m&&K==='z'){e.preventDefault();e.shiftKey?ceRedo():ceUndo()}else if(m&&K==='y'){e.preventDefault();ceRedo()}else if(m&&K==='d'){e.preventDefault();ceDup()}else if(m&&K==='a'){e.preventDefault();CE.sel=new Set(CE.items.map(i=>i.id));ceSelBoxes();ceProp()}else if(m&&K==='s'){e.preventDefault();ceSave()}
 else if((k==='Delete'||k==='Backspace')&&CE.sel.size){e.preventDefault();ceDel()}else if(k==='Escape'&&CE.sel.size){CE.sel=new Set();ceSelBoxes();ceProp()}else if(k==='['&&CE.sel.size)ceZ('d');else if(k===']'&&CE.sel.size)ceZ('u');
 else if(k.indexOf('Arrow')===0&&CE.sel.size){e.preventDefault();const st=e.shiftKey?12:2,dx=k==='ArrowLeft'?-st:k==='ArrowRight'?st:0,dy=k==='ArrowUp'?-st:k==='ArrowDown'?st:0;cePush();ceSelItems().forEach(i=>{i.x+=dx;i.y+=dy});ceAfter()}}
function ceKeyUp(e){if(e.key===' '&&CE.space){CE.space=false;const v=$('ce-view');if(v)v.classList.toggle('hand',CE.hand)}}

/* ---------- แก้ไขข้อมูล (ทุกการแก้ไขบันทึกประวัติ Undo) ---------- */
function cePush(){CE.hist.push(JSON.stringify(CE.items));if(CE.hist.length>80)CE.hist.shift();CE.redo=[]}
function ceUndo(){if(!CE.hist.length)return;CE.redo.push(JSON.stringify(CE.items));CE.items=JSON.parse(CE.hist.pop());ceAfter()}
function ceRedo(){if(!CE.redo.length)return;CE.hist.push(JSON.stringify(CE.items));CE.items=JSON.parse(CE.redo.pop());ceAfter()}
function ceAfter(){const ids=new Set(CE.items.map(i=>i.id));CE.sel=new Set([...CE.sel].filter(i=>ids.has(i)));ceDraw();ceProp();ceStatus()}
function ceAdd(aid,x,y){const a=ceAs(aid);if(!a)return;const p=ceSnapP(x,y);cePush();const it={id:ceId(),a:aid,x:+p.x.toFixed(1),y:+p.y.toFixed(1),s:1,r:0,z:0,fx:0};CE.items.push(it);CE.sel=new Set([it.id]);ceAfter()}
function ceAddCenter(aid){const v=$('ce-view');if(!v)return;const r=v.getBoundingClientRect(),w=ceW({clientX:r.left+r.width/2,clientY:r.top+r.height/2});ceAdd(aid,w.x,w.y);if(innerWidth<1000&&CE.lib)ceTog('lib')}
function ceDup(){const S=ceSelItems();if(!S.length)return;cePush();const ns=new Set();S.forEach(i=>{const c=Object.assign({},i,{id:ceId(),x:+(i.x+CE_U).toFixed(1),y:+(i.y+CE_U/2).toFixed(1)});CE.items.push(c);ns.add(c.id)});CE.sel=ns;ceAfter()}
function ceDel(){if(!CE.sel.size)return;cePush();CE.items=CE.items.filter(i=>!CE.sel.has(i.id));CE.sel=new Set();ceAfter()}
function ceFlip(){const S=ceSelItems();if(!S.length)return;cePush();S.forEach(i=>{i.fx=i.fx?0:1});ceAfter()}
function ceZ(m){const S=ceSelItems();if(!S.length)return;cePush();const zs=CE.items.map(i=>i.z),mx=Math.max(...zs),mn=Math.min(...zs);S.forEach(i=>{i.z=m==='f'?mx+1:m==='b'?mn-1:m==='u'?i.z+1:i.z-1});ceAfter()}
function ceSet(k,v){const S=ceSelItems();if(!S.length)return;cePush();S.forEach(i=>{if(k==='x'||k==='y')i[k]=ceN(v,i[k],-20000,20000);else if(k==='s')i.s=ceN(v,i.s,.2,4);else if(k==='z')i.z=Math.round(ceN(v,i.z,-9999,9999))});ceAfter()}
function ceScaleLive(v){const S=ceSelItems();if(!S.length)return;if(!CE.gp){cePush();CE.gp=true}S.forEach(i=>{i.s=ceN(v,i.s,.2,4)});ceMoveEls()}
function ceScaleEnd(){CE.gp=false;ceAfter()}
function ceLay(k,v){if(k==='bg'){if(/^#[0-9a-f]{6}$/i.test(v))CE.lay.bg=v}else CE.lay[k]=Math.round(ceN(v,CE.lay[k],400,6000));ceDraw();ceStatus()}

/* ---------- คลัง Asset ---------- */
function ceTiles(){const c=CE.cat;if(!c)return '';const q=CE.q.trim().toLowerCase(),L=c.assets.filter(a=>(!CE.cg||a.cat===CE.cg)&&(!q||(a.name+' '+a.nameEn+' '+a.id).toLowerCase().includes(q)));
 return L.map(a=>`<button type="button" class="ce-tile" onpointerdown="ceLibDown(event,'${E(a.id)}')" onkeydown="if(event.key==='Enter'||event.key===' '){ceAddCenter('${E(a.id)}');event.preventDefault()}" title="${E(a.nameEn)}"><img src="${E(a.file)}" alt="" draggable="false"><span>${E(a.name)}</span></button>`).join('')||'<p class="evm">ไม่พบ Asset ที่ตรงกับการค้นหา</p>'}
function ceLibDraw(){const p=$('ce-lib');if(!p)return;const c=CE.cat;if(!c){p.innerHTML=CE.catErr?`<div class="msg er">${E(CE.catErr)}</div>`:'<p class="evm">กำลังโหลดคลัง Asset...</p>';return}
 p.innerHTML=`<input id="ce-q" type="search" placeholder="ค้นหา Asset" value="${E(CE.q)}" oninput="ceQ(this.value)" aria-label="ค้นหา Asset"><div class="cmcs ce-cg" role="group" aria-label="หมวดหมู่ Asset"><button type="button" class="cmc${CE.cg===''?' on':''}" data-g="" onclick="ceCg('')">ทั้งหมด</button>${c.cats.map(t=>`<button type="button" class="cmc${CE.cg===t.id?' on':''}" data-g="${E(t.id)}" onclick="ceCg('${E(t.id)}')">${E(t.name)}</button>`).join('')}</div><div class="ce-tiles" id="ce-tiles">${ceTiles()}</div><p class="evm"><small>ลากไปวางบนพื้นที่ทำงาน หรือแตะ/กด Enter เพื่อวางกลางจอ</small></p>`}
function ceQ(v){CE.q=v;const t=$('ce-tiles');if(t)t.innerHTML=ceTiles()}
function ceCg(g){CE.cg=g;document.querySelectorAll('.ce-cg .cmc').forEach(b=>b.classList.toggle('on',(b.dataset.g||'')===g));const t=$('ce-tiles');if(t)t.innerHTML=ceTiles()}
function ceLibDown(e,id){if(e.pointerType==='mouse'&&e.button!==0)return;CE.ld={id,sx:e.clientX,sy:e.clientY,g:null,moved:false,pid:e.pointerId}}
function ceLibMove(e){const d=CE.ld;if(!d||e.pointerId!==d.pid)return;if(!d.moved&&Math.hypot(e.clientX-d.sx,e.clientY-d.sy)>6){d.moved=true;const a=ceAs(d.id),g=document.createElement('img');g.className='ce-ghost';g.src=a.file;g.alt='';g.style.width=(a.w*CE.v.s)+'px';document.body.appendChild(g);d.g=g}
 if(d.g){const a=ceAs(d.id);d.g.style.left=(e.clientX-a.ax*CE.v.s)+'px';d.g.style.top=(e.clientY-a.ay*CE.v.s)+'px'}}
function ceLibUp(e){const d=CE.ld;if(e.pointerId!==d.pid)return;CE.ld=null;if(d.g)d.g.remove();const v=$('ce-view');
 if(d.moved){if(v){const r=v.getBoundingClientRect();if(e.clientX>=r.left&&e.clientX<=r.right&&e.clientY>=r.top&&e.clientY<=r.bottom){const w=ceW(e);ceAdd(d.id,w.x,w.y)}}}else ceAddCenter(d.id)}

/* ---------- แถบคุณสมบัติ / สถานะ ---------- */
function ceProp(){const p=$('ce-prop');if(!p)return;const S=ceSelItems(),b=(fn,t,c)=>`<button type="button" class="btn s${c?' '+c:''}" onclick="${fn}">${t}</button>`;let h;
 if(!S.length)h=`<h3>ผัง</h3><p class="evm">ทั้งหมด ${CE.items.length} ชิ้น · คลิกชิ้นบนผังเพื่อแก้ไขคุณสมบัติ</p><label>ขนาดผัง (px) กว้าง × สูง</label><div class="ce-two"><input type="number" min="400" max="6000" value="${CE.lay.w}" onchange="ceLay('w',this.value)" aria-label="กว้าง"><input type="number" min="300" max="6000" value="${CE.lay.h}" onchange="ceLay('h',this.value)" aria-label="สูง"></div><label>สีพื้นหลัง</label><input type="color" value="${E(CE.lay.bg)}" onchange="ceLay('bg',this.value)"><p class="evm"><small>ตำแหน่งทุกชิ้นอ้างอิงพื้นที่ผังนี้ ไม่ใช่พิกเซลหน้าจอ จึงไม่คลาดเคลื่อนเมื่อเปลี่ยนขนาดหน้าต่าง</small></p>`;
 else if(S.length===1){const it=S[0],a=ceAs(it.a);h=`<h3>${E(a?a.name:'ไม่พบ Asset')}</h3><p class="evm"><small>${E(it.a)}${a?' · '+E(a.nameEn):''}</small></p><label>ตำแหน่ง X / Y (พิกัดผัง)</label><div class="ce-two"><input type="number" step="1" value="${+it.x.toFixed(1)}" onchange="ceSet('x',this.value)" aria-label="X"><input type="number" step="1" value="${+it.y.toFixed(1)}" onchange="ceSet('y',this.value)" aria-label="Y"></div><label>ขนาด (${Math.round(it.s*100)}%)</label><input type="range" min=".2" max="4" step=".05" value="${it.s}" oninput="ceScaleLive(this.value)" onchange="ceScaleEnd()" aria-label="ขนาด"><label class="ce-ck"><input type="checkbox" ${it.fx?'checked':''} onchange="ceFlip()"> พลิกซ้าย-ขวา</label><label>ลำดับซ้อนภาพ (z: มาก = อยู่หน้า)</label><input type="number" step="1" value="${it.z}" onchange="ceSet('z',this.value)"><p>${b("ceZ('f')",'ไปด้านหน้าสุด')} ${b("ceZ('b')",'ไปด้านหลังสุด')} ${b("ceZ('u')",'ขึ้น 1 ชั้น')} ${b("ceZ('d')",'ลง 1 ชั้น')}</p><p>${b('ceDup()','คัดลอก')} ${b('ceDel()','ลบ','c')}</p><h4>สถานที่ที่เชื่อมโยง</h4><p class="evm"><small>${a&&a.linkable?'Asset นี้เชื่อมกับคณะ/สถานที่ได้ (เปิดใช้งานในระยะถัดไป)':'Asset ตกแต่ง ไม่ผูกกับสถานที่'}</small></p>`}
 else h=`<h3>เลือก ${S.length} ชิ้น</h3><p class="evm">ลากเพื่อย้ายพร้อมกัน</p><p>${b('ceDup()','คัดลอก')} ${b('ceFlip()','พลิกซ้าย-ขวา')} ${b('ceDel()','ลบ','c')}</p><p>${b("ceZ('f')",'ไปด้านหน้าสุด')} ${b("ceZ('b')",'ไปด้านหลังสุด')}</p>`;
 p.innerHTML=h}
function ceBtns(){const n=CE.sel.size;['ce-dup','ce-flip','ce-del'].forEach(i=>{const e=$(i);if(e)e.disabled=!n})}
function ceStatus(){const d=ceDirty(),s=$('ce-st');if(s){s.textContent=!CE.loaded?'กำลังโหลด...':(d?'มีการแก้ไขที่ยังไม่ได้บันทึก':'บันทึกแล้ว')+' · '+CE.items.length+' ชิ้น';s.className='ce-st'+(d?' d':'')}const u=$('ce-undo'),r=$('ce-redo'),sv=$('ce-save');if(u)u.disabled=!CE.hist.length;if(r)r.disabled=!CE.redo.length;if(sv)sv.disabled=CE.saving||!CE.loaded;ceBtns()}
function ceBanner(){const b=$('ce-banner');if(b)b.innerHTML=CE.remote?'<div class="msg er">มีการแก้ไขผังจากผู้ดูแลคนอื่นหลังจากคุณเปิดตัวแก้ไข ระบบจะเตือนก่อนบันทึกเพื่อไม่ให้เขียนทับโดยไม่ตั้งใจ</div>':''}
function ceRemote(){if(!CE.base)return;const n=getSH('campus');CE.remote=ceSS((n&&n.items)||[])!==ceSS(CE.base.items||[]);ceBanner()}

/* ---------- บันทึก (เฉพาะเมื่อกดปุ่ม): รวมเข้ากับเอกสารล่าสุด เปลี่ยนเฉพาะ items/lay + ตรวจการแก้ไขซ้อน ---------- */
async function ceSave(force){if(!DBH)return ceMsg(dbOff(),false);if(CE.saving||!CE.loaded)return;if(CW===false)return ceMsg('บัญชีนี้ไม่มีสิทธิ์เขียนข้อมูล',false);CE.saving=true;ceStatus();ceClose();
 try{
  const {data:row,error}=await DBH.from('site_docs').select('data,updated_at').eq('key','campus').maybeSingle();if(error)throw error;
  const latest=row&&row.data&&typeof row.data==='object'&&!Array.isArray(row.data)?row.data:{};
  if(!force&&ceSS(latest.items||[])!==ceSS((CE.base&&CE.base.items)||[])&&!(row&&CE.baseUpd===row.updated_at)){CE.saving=false;ceStatus();return ceConflict()}
  if(!force&&!CE.items.length&&(latest.items||[]).length){CE.saving=false;ceStatus();return ceModal('<h3>บันทึกผังว่าง</h3><p>ผังที่บันทึกไว้มี '+(latest.items||[]).length+' ชิ้น แต่ตอนนี้ผังว่าง ต้องการบันทึกทับเป็นผังว่างหรือไม่ (ควรกด "ดาวน์โหลดสำรอง" ไว้ก่อน)</p><button class="btn c" onclick="ceSave(true)">บันทึกเป็นผังว่าง</button> <button class="btn" onclick="ceClose()">ยกเลิก</button>')}
  const doc=Object.assign({},latest,{items:CE.items,lay:CE.lay});let res;
  if(row){res=await DBH.from('site_docs').update({data:doc,updated_at:new Date().toISOString()}).eq('key','campus').eq('updated_at',row.updated_at).select('data,updated_at');if(res.error)throw res.error;if(!res.data||!res.data.length){CE.saving=false;ceStatus();return ceConflict()}}
  else{res=await DBH.from('site_docs').insert({key:'campus',data:doc,updated_at:new Date().toISOString()}).select('data,updated_at');if(res.error)throw res.error}
  const r=res.data[0];SHR.campus=r.data;CE.base=clone(r.data);CE.baseUpd=r.updated_at;CE.savedStr=ceStr();CE.remote=false;ceBanner();ceMsg('บันทึกผังเรียบร้อย ผังเดิม (ภาพ สถานที่ หมุด) ไม่ถูกแก้ไข')
 }catch(e){const c=(e&&(e.code||e.status))||'error';ceMsg('บันทึกไม่สำเร็จ: '+(ERR[c]||(e&&e.message)||'เกิดข้อผิดพลาด')+' ('+c+')',false)}
 finally{CE.saving=false;ceStatus()}}
function ceConflict(){ceModal('<h3>ข้อมูลผังถูกแก้ไขโดยผู้อื่น</h3><p>มีผู้ดูแลคนอื่นบันทึกผังหลังจากที่คุณเปิดตัวแก้ไข การบันทึกตอนนี้จะเขียนทับงานของเขา ยังไม่มีอะไรถูกบันทึก</p><p><button class="btn s" onclick="ceDlMine()">ดาวน์โหลดงานของฉันเก็บไว้</button></p><p><button class="btn b" onclick="ceTakeLatest()">โหลดข้อมูลล่าสุด (ทิ้งงานของฉัน)</button></p><p><button class="btn c" onclick="ceSave(true)">บันทึกทับ (ใช้งานของฉัน)</button> <button class="btn" onclick="ceClose()">ยกเลิก</button></p>')}
function ceDl(obj,name){const bl=new Blob([JSON.stringify(obj,null,1)],{type:'application/json'}),a=document.createElement('a');a.href=URL.createObjectURL(bl);a.download=name;document.body.appendChild(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(a.href),3000)}
const ceDay=()=>new Date().toISOString().slice(0,10);
function ceDlMine(){ceDl({items:CE.items,lay:CE.lay},'campus-layout-mine-'+ceDay()+'.json');ceMsg('ดาวน์โหลดงานของคุณแล้ว')}
async function ceTakeLatest(){ceClose();CE.savedStr=ceStr();CE.force=true;await ceBoot();ceMsg('โหลดข้อมูลล่าสุดแล้ว')}
async function ceBackup(){try{let doc=CE.base;if(DBH){const {data,error}=await DBH.from('site_docs').select('data').eq('key','campus').maybeSingle();if(error)throw error;if(data)doc=data.data}ceDl(doc||{},'campus-backup-'+ceDay()+'.json');ceMsg('ดาวน์โหลดไฟล์สำรองเอกสารแผนผัง (campus) ทั้งหมดแล้ว')}catch(e){ceMsg('สำรองข้อมูลไม่สำเร็จ: '+((e&&e.message)||e),false)}}
function ceSampleAsk(){if(!CE.items.length)return ceSample();ceModal('<h3>โหลดผังตัวอย่าง</h3><p>ผังปัจจุบัน '+CE.items.length+' ชิ้นในตัวแก้ไขจะถูกแทนที่ (ย้อนกลับได้ด้วย Undo และยังไม่บันทึกลงฐานข้อมูลจนกว่าจะกด "บันทึก")</p><button class="btn b" onclick="ceSample()">แทนที่ด้วยผังตัวอย่าง</button> <button class="btn" onclick="ceClose()">ยกเลิก</button>')}
async function ceSample(){ceClose();try{const r=await fetch(CE_BASE+'sample_layout.json',{cache:'no-cache'});if(!r.ok)throw new Error('HTTP '+r.status);const j=await r.json();cePush();CE.items=ceClean(j.items);CE.lay=ceCleanLay(j);CE.sel=new Set();ceFull();ceFit();ceMsg('โหลดผังตัวอย่างเข้าตัวแก้ไขแล้ว (ยังไม่ได้บันทึกลงฐานข้อมูล)')}catch(e){ceMsg('โหลดผังตัวอย่างไม่สำเร็จ: '+e.message,false)}}
function ceClearAsk(){if(!CE.items.length)return ceMsg('ผังยังว่างอยู่แล้ว');ceModal('<h3>ล้างผัง</h3><p>ลบ Asset ทั้ง '+CE.items.length+' ชิ้นออกจากตัวแก้ไข (ย้อนกลับได้ด้วย Undo และไม่กระทบข้อมูลในฐานข้อมูลจนกว่าจะกด "บันทึก") ภาพแผนผังเดิมและหมุดสถานที่ไม่ถูกลบ</p><button class="btn c" onclick="ceClear()">ล้างผัง</button> <button class="btn" onclick="ceClose()">ยกเลิก</button>')}
function ceClear(){ceClose();cePush();CE.items=[];CE.sel=new Set();ceAfter()}
function ceLeave(){if(!ceDirty())return true;ceModal('<h3>ยังไม่ได้บันทึก</h3><p>มีการแก้ไขผังที่ยังไม่ได้บันทึก</p><button class="btn b" onclick="ceClose()">กลับไปแก้ไขต่อ</button> <button class="btn c" onclick="ceLeaveGo()">ทิ้งการแก้ไขและออก</button>');return false}
function ceLeaveGo(){ceClose();CE.savedStr=ceStr();CE.loaded=false;location.hash='#/admin/campus'}

/* ===== Admin: จัดการแผนผังสถาบัน ===== */
async function cmUpload(file,dir){if(!SB||!DBH)throw {message:dbOff()};if(!file)throw {message:'ไม่ได้เลือกไฟล์'};const ext=CM_MIME[file.type];if(!ext)throw {message:'รองรับเฉพาะไฟล์ PNG, JPG, WebP, GIF'};if(file.size>5*1024*1024)throw {message:'ไฟล์ใหญ่เกิน 5 MB'};
 const path=dir+'/'+mkId('f')+'.'+ext,{error}=await SB.storage.from('campus').upload(path,file,{contentType:file.type,cacheControl:'31536000',upsert:false});if(error)throw error;return SB.storage.from('campus').getPublicUrl(path).data.publicUrl}
const cmDims=u=>new Promise((res,rej)=>{const i=new Image();i.onload=()=>res({w:i.naturalWidth,h:i.naturalHeight});i.onerror=()=>rej({message:'โหลดรูปจากลิงก์นี้ไม่ได้'});i.src=u});
async function cmSave(c,msg){if(!DBH){say(dbOff(),false);return false}try{await putDoc('campus',c);say(msg);return true}catch(e){dbErr('บันทึกไม่สำเร็จ',e);return false}}
function cmPageInfo(){const P=getPages(),M=getMenu(),pg=P.find(p=>(p.sections||[]).some(s=>s.type==='campusmap')),mi=pg&&M.find(m=>m.kind==='cms'&&m.pageId===pg.id);return {pg,mi}}
async function cmMakePage(){if(!DBH)return say(dbOff(),false);const P=clone(getPages()),M=clone(getMenu());let pg=P.find(p=>(p.sections||[]).some(s=>s.type==='campusmap'));
 if(!pg){const id=mkId('pg');let slug='campus-map';if(P.some(x=>x.slug===slug))slug=id;pg={id,title:'แผนผังสถาบัน',slug,status:'published',sections:[{id:mkId('s'),type:'campusmap',text:'',url:'',alt:'',label:'',items:[]}],updated:Date.now()};P.push(pg)}
 if(!M.some(m=>m.kind==='cms'&&m.pageId===pg.id)){const mx=Math.max(-10,...M.filter(y=>!y.parent).map(y=>+y.order||0));M.push({id:mkId('m'),label:'แผนผังสถาบัน',m:'',kind:'cms',pageId:pg.id,href:'',tab:'same',show:true,order:mx+10,parent:''})}
 try{await putDoc('pages',P);await putDoc('menu',M);say('เพิ่มหน้าและเมนู "แผนผังสถาบัน" แล้ว (ย้ายตำแหน่งเมนูได้ที่ แก้ไขเมนูแบบละเอียด)')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
function campusAdmin(){const c=getCampus(),L=cmAll(),{pg,mi}=cmPageInfo();
 const pgBox=pg&&mi?`<div class="msg ok">หน้าอยู่ในเมนูแล้ว ${stTag(pg)} · <a href="#/p/${E(pg.slug)}">เปิดหน้า</a> · <a href="#/admin/pages/edit/${E(pg.id)}">แก้ไขหน้า</a> · <a href="#/admin/menu">จัดตำแหน่งเมนู</a></div>`:`<div class="msg er">${pg?'มีหน้าแผนผังแล้วแต่ยังไม่อยู่ในเมนู':'ยังไม่มีหน้า "แผนผังสถาบัน" ในเมนูของเว็บไซต์'}</div><p><button type="button" class="btn b" onclick="cmMakePage()">${pg?'เพิ่มลงในเมนู':'สร้างหน้าและเมนู "แผนผังสถาบัน"'}</button></p>`;
 return `<h1>จัดการแผนผังสถาบัน</h1><p>ภาพแผนผัง สถานที่ และหมุดตำแหน่ง ข้อมูลบันทึกใน Supabase ผู้เข้าชมเห็นทันทีหลังบันทึก</p>${dbBanner()}
<h2>ตัวแก้ไขผัง Isometric (ลากวาง)</h2><p>วางอาคาร ถนน ต้นไม้ จากคลัง Asset แล้วบันทึกเป็นผังของสถาบัน (แยกจากภาพแผนผังและหมุดเดิม ซึ่งไม่ถูกแก้ไข)</p><p><a class="btn b" href="#/admin/campus/layout">เปิดตัวแก้ไขผัง Isometric</a></p>
<h2>เมนูและหน้าเว็บ</h2>${pgBox}
<h2>ภาพแผนผังหลัก</h2>${okU(c.image)?`<img src="${E(c.image)}" alt="แผนผังสถาบัน" style="max-width:100%;max-height:320px;border-radius:12px;border:1px solid var(--line)"><p><small>ขนาดภาพ ${+c.imgW||'?'} × ${+c.imgH||'?'} px</small></p>`:'<div class="msg er">ยังไม่มีภาพแผนผัง</div>'}
<form id="af" onsubmit="return false"><label>อัปโหลดภาพใหม่ (PNG, JPG, WebP, GIF ไม่เกิน 5 MB)</label><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onchange="cmPickMap(this)"><label>หรือใช้ลิงก์ภาพ (https://)</label><input name="cm_url" value="${E(c.image)}" placeholder="https://..."><p><button type="button" class="btn s" onclick="cmMapUrl()">ใช้ลิงก์นี้</button> ${okU(c.image)?'<button type="button" class="btn s c" onclick="cmClearAsk()">ลบภาพแผนผัง</button>':''}</p><p><small>ตำแหน่งหมุดเก็บเป็นเปอร์เซ็นต์ของภาพ หากเปลี่ยนเป็นภาพที่สัดส่วนต่างจากเดิม ควรตรวจตำแหน่งหมุดอีกครั้ง</small></p>
<label>คำอธิบายสั้น ๆ บนหน้า (ว่าง = ใช้ข้อความแนะนำมาตรฐาน)</label><textarea name="cm_intro" rows="3">${E(c.intro)}</textarea><p><button type="button" class="btn s" onclick="cmIntroSave()">บันทึกคำอธิบาย</button></p></form>
<h2>รายการสถานที่ (${L.length})</h2><p><button type="button" class="btn b" onclick="cmNew()">+ เพิ่มสถานที่</button></p>${L.length?L.map((p,i)=>`<div class="row"><b>${E(p.name)}</b> <span class="tag">${E(cmTypeName(cmTy(p)))}</span> ${p.show===false?'<span class="tag">ซ่อน</span>':''} ${cmHas(p)?'':'<span class="tag">ยังไม่กำหนดตำแหน่ง</span>'}${p.floor?`<br><small>${E(p.floor)}</small>`:''}<br><a class="btn s" href="#/admin/campus/edit/${E(p.id)}">แก้ไข</a> <button type="button" class="btn s"${i?'':' disabled'} onclick="cmMv('${E(p.id)}',-1)">ขึ้น</button> <button type="button" class="btn s"${i<L.length-1?'':' disabled'} onclick="cmMv('${E(p.id)}',1)">ลง</button> <button type="button" class="btn s" onclick="cmTog('${E(p.id)}')">${p.show===false?'แสดง':'ซ่อน'}</button> <button type="button" class="btn s c" onclick="cmDelAsk('${E(p.id)}')">ลบ</button></div>`).join(''):'<p style="opacity:.6">ยังไม่มีสถานที่ กดเพิ่มสถานที่เพื่อเริ่มต้น</p>'}`}
async function cmPickMap(inp){const f=inp.files&&inp.files[0];inp.value='';if(!f)return;if(!DBH)return say(dbOff(),false);say('กำลังอัปโหลดภาพ...');try{const url=await cmUpload(f,'maps'),d=await cmDims(url);await cmSave(Object.assign({},getCampus(),{image:url,imgW:d.w,imgH:d.h}),'อัปโหลดภาพแผนผังเรียบร้อย')}catch(e){dbErr('อัปโหลดไม่สำเร็จ',e)}}
async function cmMapUrl(){const u=STRIP(new FormData($('af')).get('cm_url')||'').trim();if(!okU(u))return say('ลิงก์ภาพต้องขึ้นต้นด้วย https://',false);if(!DBH)return say(dbOff(),false);try{const d=await cmDims(u);await cmSave(Object.assign({},getCampus(),{image:u,imgW:d.w,imgH:d.h}),'ตั้งภาพแผนผังจากลิงก์เรียบร้อย')}catch(e){dbErr('ตั้งภาพไม่สำเร็จ',e)}}
function cmClearAsk(){$('md').innerHTML=`<div class="modal"><div><h3>ลบภาพแผนผัง</h3><p>เว็บไซต์จะแสดงสถานะ "ยังไม่มีแผนผัง" จนกว่าจะอัปโหลดภาพใหม่ รายการสถานที่และตำแหน่งหมุดยังอยู่</p><button class="btn c" onclick="cmClearDo()">ลบภาพ</button> <button class="btn" onclick="$('md').innerHTML=''">ยกเลิก</button></div></div>`}
async function cmClearDo(){$('md').innerHTML='';await cmSave(Object.assign({},getCampus(),{image:'',imgW:0,imgH:0}),'ลบภาพแผนผังแล้ว')}
async function cmIntroSave(){const t=STRIP(new FormData($('af')).get('cm_intro')||'').trim();await cmSave(Object.assign({},getCampus(),{intro:t}),'บันทึกคำอธิบายเรียบร้อย')}
async function cmNew(){if(!DBH)return say(dbOff(),false);const c=clone(getCampus()),id=mkId('pl');c.places=cmAll().concat([{id,name:'สถานที่ใหม่',type:'building',desc:'',floor:'',hours:'',contact:'',img:'',x:null,y:null,show:false}]);try{await putDoc('campus',c);location.hash='#/admin/campus/edit/'+id}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
async function cmMv(id,d){const c=clone(getCampus()),a=cmAll(),i=a.findIndex(p=>p.id===id),j=i+d;if(i<0||j<0||j>=a.length)return;[a[i],a[j]]=[a[j],a[i]];c.places=a;await cmSave(c,'เปลี่ยนลำดับแล้ว')}
async function cmTog(id){const c=clone(getCampus()),a=cmAll(),p=a.find(x=>x.id===id);if(!p)return;p.show=p.show===false;c.places=a;await cmSave(c,p.show?'แสดงสถานที่บนเว็บไซต์แล้ว':'ซ่อนสถานที่แล้ว')}
function cmDelAsk(id){const p=cmAll().find(x=>x.id===id);if(!p)return;$('md').innerHTML=`<div class="modal"><div><h3>ยืนยันการลบสถานที่</h3><p>"${E(p.name)}" จะถูกลบถาวรจากรายการและแผนผัง</p><button class="btn c" onclick="cmDelDo('${E(id)}')">ลบสถานที่</button> <button class="btn" onclick="$('md').innerHTML=''">ยกเลิก</button></div></div>`}
async function cmDelDo(id){$('md').innerHTML='';const c=clone(getCampus());c.places=cmAll().filter(p=>p.id!==id);if(await cmSave(c,'ลบสถานที่เรียบร้อย'))location.hash='#/admin/campus'}
function cmpEditor(id){if(!WC.cm)WC.cm=clone(getCampus());const c=WC.cm,p=(c.places||[]).find(x=>x.id===id);if(!p)return '<p><a class="bk" href="#/admin/campus">← จัดการแผนผังสถาบัน</a></p><h1>ไม่พบสถานที่</h1>';
 const f=(l,k,v,ph)=>`<label>${l}</label><input name="cp_${k}" value="${E(v)}"${ph?` placeholder="${ph}"`:''}>`,hasImg=okU(c.image);
 return `<p><a class="bk" href="#/admin/campus">← จัดการแผนผังสถาบัน</a></p><h1>แก้ไขสถานที่</h1>${dbBanner()}<form id="af" onsubmit="return false">${f('ชื่อสถานที่หรืออาคาร','name',p.name)}<label>ประเภทสถานที่</label><select name="cp_type">${CM_TYPES.map(t=>`<option value="${t[0]}"${cmTy(p)===t[0]?' selected':''}>${t[1]}</option>`).join('')}</select><label>คำอธิบายและหน้าที่การใช้งาน</label><textarea name="cp_desc" rows="4">${E(p.desc)}</textarea><div class="g2">${f('ชั้น/ห้องที่เกี่ยวข้อง (ถ้ามี)','floor',p.floor)}${f('เวลาเปิดให้บริการ (ถ้ามี)','hours',p.hours)}</div>${f('ข้อมูลติดต่อ (ถ้ามี)','contact',p.contact)}
<label>รูปภาพประกอบ (ถ้ามี)</label>${okU(p.img)?`<img src="${E(p.img)}" alt="" style="max-width:260px;max-height:180px;border-radius:12px;display:block;margin:6px 0">`:''}<input name="cp_img" value="${E(p.img)}" placeholder="https://... หรืออัปโหลดด้านล่าง"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onchange="cmpUp('${E(id)}',this)"><p><small>อัปโหลดไม่เกิน 5 MB ภาพจะถูกใช้เมื่อกดบันทึก</small></p>
<label><input type="checkbox" name="cp_show"${p.show===false?'':' checked'} style="width:auto"> แสดงสถานที่นี้บนเว็บไซต์</label>
<h2>ตำแหน่งหมุดบนแผนผัง</h2>${hasImg?`<p>คลิกหรือลากบนภาพเพื่อกำหนดตำแหน่งหมุด (หรือกรอกเปอร์เซ็นต์เอง)</p><div class="cmpk" id="cmpk" onclick="cmpkClick(event)" onpointerdown="cmpkDown(event)"><img src="${E(c.image)}" alt="แผนผังสำหรับกำหนดตำแหน่ง" draggable="false"><span class="cmpkp" id="cmpkp"${cmHas(p)?` style="left:${p.x}%;top:${p.y}%"`:' hidden'}>${PINSVG}</span></div><div class="g2"><div><label>X (% จากซ้าย)</label><input name="cp_x" type="number" min="0" max="100" step="0.01" value="${cmHas(p)?p.x:''}" oninput="cmpkInput()"></div><div><label>Y (% จากบน)</label><input name="cp_y" type="number" min="0" max="100" step="0.01" value="${cmHas(p)?p.y:''}" oninput="cmpkInput()"></div></div><p><button type="button" class="btn s" onclick="cmpkClear()">ล้างตำแหน่ง</button></p>`:'<div class="msg er">ต้องอัปโหลดภาพแผนผังก่อน จึงจะกำหนดตำแหน่งหมุดได้ <a href="#/admin/campus">ไปอัปโหลด</a></div>'}
<p><button type="button" class="btn b" onclick="cmpSave('${E(id)}')">บันทึก</button> <a class="btn" href="#/admin/campus">กลับรายการ</a></p></form>`}
function cmpCur(id){return WC.cm&&(WC.cm.places||[]).find(x=>x.id===id)}
function cmpSync(id){const p=cmpCur(id);if(!p)return null;const d=new FormData($('af')),g=k=>STRIP(String(d.get('cp_'+k)==null?'':d.get('cp_'+k))).trim();['name','desc','floor','hours','contact','img'].forEach(k=>{if(d.has('cp_'+k))p[k]=g(k)});if(d.has('cp_type'))p.type=g('type');p.show=d.has('cp_show');
 if(d.has('cp_x')){const x=g('x'),y=g('y');p.x=x===''?null:+x;p.y=y===''?null:+y}return p}
async function cmpSave(id){const p=cmpSync(id);if(!p)return;if(!p.name)return say('ต้องระบุชื่อสถานที่',false);if(!CM_TYPES.some(t=>t[0]===p.type))return say('ประเภทสถานที่ไม่ถูกต้อง',false);if(p.img&&!okU(p.img))return say('URL รูปภาพต้องขึ้นต้นด้วย https://',false);
 const hx=p.x!=null,hy=p.y!=null;if(hx!==hy||(hx&&!(isFinite(p.x)&&isFinite(p.y)&&p.x>=0&&p.x<=100&&p.y>=0&&p.y<=100)))return say('ตำแหน่ง X และ Y ต้องเป็นตัวเลข 0–100 ทั้งคู่ (หรือเว้นว่างทั้งคู่)',false);
 if(p.x!=null){p.x=Math.round(p.x*100)/100;p.y=Math.round(p.y*100)/100}
 if(!DBH)return say(dbOff(),false);const c=WC.cm;try{await putDoc('campus',c);WC={};say('บันทึกสถานที่เรียบร้อย')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
async function cmpUp(id,inp){const f=inp.files&&inp.files[0];inp.value='';if(!f)return;const p=cmpSync(id);if(!p)return;if(!DBH)return say(dbOff(),false);try{p.img=await cmUpload(f,'places');say('อัปโหลดรูปแล้ว กดบันทึกเพื่อยืนยัน')}catch(e){dbErr('อัปโหลดไม่สำเร็จ',e)}}
function cmpkSet(e){const im=document.querySelector('#cmpk img');if(!im)return;const r=im.getBoundingClientRect();if(!r.width||!r.height)return;const x=Math.round(Math.min(100,Math.max(0,(e.clientX-r.left)/r.width*100))*100)/100,y=Math.round(Math.min(100,Math.max(0,(e.clientY-r.top)/r.height*100))*100)/100,f=document.getElementById('af');if(f){const ix=f.elements['cp_x'],iy=f.elements['cp_y'];if(ix)ix.value=x;if(iy)iy.value=y}cmpkDraw(x,y)}
function cmpkDraw(x,y){const p=cmEl('cmpkp');if(!p)return;if(x==null||y==null||isNaN(x)||isNaN(y)){p.hidden=true;return}p.hidden=false;p.style.left=x+'%';p.style.top=y+'%'}
function cmpkClick(e){cmpkSet(e)}
function cmpkDown(e){if(e.pointerType==='mouse'&&e.button===0){CM.pk=true;cmpkSet(e)}}
function cmpkInput(){const f=document.getElementById('af');if(!f)return;const x=f.elements['cp_x'].value,y=f.elements['cp_y'].value;cmpkDraw(x===''?null:+x,y===''?null:+y)}
function cmpkClear(){const f=document.getElementById('af');if(f){f.elements['cp_x'].value='';f.elements['cp_y'].value=''}cmpkDraw(null,null)}
/* ===== คณะ สาขาวิชา หลักสูตร: กลุ่มคณะ → คณะ/วิทยาลัย → สาขาวิชา → หลักสูตร (site_docs keys: fgroups, faculties, majors, programs; เชื่อมกันด้วย id) ===== */
const FQ_LV=[['bachelor','ปริญญาตรี'],['master','ปริญญาโท'],['doctor','ปริญญาเอก'],['other','อื่น ๆ']];
const fqLv=k=>(FQ_LV.find(x=>x[0]===k)||FQ_LV[FQ_LV.length-1])[1];
/* ประเภทรายวิชา: 'required' / 'elective' เป็นค่าเดิมในข้อมูลอยู่แล้ว (elective เดิมแสดงว่า "วิชาเลือก" ตอนนี้เรียก "วิชาเลือกเฉพาะทาง") เพิ่ม 'free' */
const CS_TY=[['required','วิชาบังคับ'],['elective','วิชาเลือกเฉพาะทาง'],['curr_elective','วิชาเลือกในหลักสูตร'],['free','วิชาเลือกเสรี']];
const csTyK=k=>CS_TY.some(x=>x[0]===k)?k:'required';
const csTy=k=>CS_TY.find(x=>x[0]===csTyK(k))[1];
const fqArr=k=>{const v=getSH(k);return Array.isArray(v)?v.filter(x=>x&&x.id):[]};
const fqG=()=>fqArr('fgroups'),fqF=()=>fqArr('faculties'),fqM=()=>fqArr('majors'),fqP=()=>fqArr('programs'),fqPeople=()=>fqArr('people'),fqCC=()=>fqArr('clubcats'),fqCL=()=>fqArr('clubs'),fqCP=()=>fqArr('cposts');
const CP_PF=[['mixi2','Mixi2',['mixi.social']],['x','X (Twitter)',['x.com','twitter.com']],['instagram','Instagram',['instagram.com']],['facebook','Facebook',['facebook.com','fb.com','fb.watch']],['threads','Threads',['threads.net','threads.com']],['bluesky','Bluesky',['bsky.app']],['youtube','YouTube',['youtube.com','youtu.be']],['other','อื่น ๆ',null]];
const CP_T='โพสต์',CP_PER=12,CP_DEF=6,CP_MAX=24,CP_TXT=1000,CP_NAME=80;
/* หมวดหมู่โพสต์ (เก็บใน it.cat) และหน้าแสดงผล (เก็บใน it.pages = อาร์เรย์ id หน้า) — ฟิลด์ใหม่อยู่ใน JSON ของโพสต์เดิม ไม่เพิ่มตาราง
   โพสต์เก่าที่ไม่มี pages = แสดงที่ 'home' และ 'community' เหมือนเดิม ไม่ถูกซ่อน */
const CP_CAT=[['player','โพสต์ของผู้เล่น'],['school','โพสต์ของโรงเรียน']],CP_BI=[['home','หน้าแรก'],['community','หน้ารวมโพสต์ (#/community)']];
/* ข่าวสารและประกาศ: site_docs 'news' (อาร์เรย์) · NW_SRV ต้องตรงกับ limit ใน _pub_news() ของ migration_homepage.sql */
const NW_T='ข่าวสารและประกาศ',NW_CAT=[['announcement','ประกาศสำคัญ'],['school','ข่าวโรงเรียน'],['kosa','รอบรั้วโกศา'],['council','สภานักเรียน']],NW_OLD=[['university','ข่าวมหาวิทยาลัย'],['faculty','ข่าวจากคณะ']]/* หมวดเดิมที่ยกเลิก: ข่าวเก่าไม่ถูกแก้/ลบ ยังแสดงป้ายเดิมได้ แต่เลือกใหม่ไม่ได้ และต้องเลือกหมวดใหม่ก่อนบันทึกการแก้ไข */,NW_PER=12,NW_DEF=3,NW_MAX=12,NW_TTL=150,NW_SUM=300,NW_BODY=5000,NW_SRV=60,EV_DEF=3,EV_MAX=12;
const fqNW=()=>fqArr('news'),hnOf=(v,d,m)=>{if(v===null||v===undefined||v==='')return d;const n=Math.floor(+v);return Number.isFinite(n)?Math.max(0,Math.min(m,n)):d};
const fqIsPub=x=>x.status==='published';
/* ค่าเล่าเรียน (บาท/ภาคการศึกษา): เก็บใน programs[].tuition เป็นตัวเลขไม่ติดลบ หรือ '' เมื่อยังไม่มีข้อมูล (0 ถือเป็นค่าที่ระบุแล้ว) */
const fqTuiParse=v=>{if(v==null)return null;if(typeof v==='number')return Number.isFinite(v)&&v>=0?v:NaN;if(typeof v!=='string')return NaN;const s=v.replace(/[\s,]/g,'');if(s==='')return null;return /^\d+(\.\d{1,2})?$/.test(s)?parseFloat(s):NaN};
const fqTui=p=>{const n=fqTuiParse(p&&p.tuition);return n!=null&&Number.isFinite(n)?n:null};
const fqBaht=n=>n.toLocaleString('th-TH',{minimumFractionDigits:0,maximumFractionDigits:2});
const fqTuiTxt=n=>'ค่าเล่าเรียน '+fqBaht(n)+' บาท/ภาคการศึกษา';
function fqTuiRange(ps){const a=ps.map(fqTui).filter(n=>n!=null);if(!a.length)return null;return {lo:Math.min(...a),hi:Math.max(...a),n:a.length,all:a.length===ps.length}}
/* สิ่งที่ผู้เข้าชมเห็น: ต้องเผยแพร่ทุกระดับตั้งแต่กลุ่มลงมา (ซ่อนต้นสังกัด = ซ่อนรายการลูก) */
function fqPub(){const G=fqG().filter(fqIsPub),gi=new Set(G.map(x=>x.id)),F=fqF().filter(f=>fqIsPub(f)&&gi.has(f.groupId)),fi=new Set(F.map(x=>x.id)),M=fqM().filter(m=>fqIsPub(m)&&fi.has(m.facultyId)),mi=new Set(M.map(x=>x.id)),P=fqP().filter(p=>fqIsPub(p)&&mi.has(p.majorId));return {G,F,M,P}}
const FS={key:null,q:'',g:'',lv:''};
const fqFlower=f=>{const w=f&&f.flower||{};return {img:okU(w.img)?w.img:'',nameTh:w.nameTh||'',nameEn:w.nameEn||'',meaning:w.meaning||''}};
function fqInfo(f,D){const Ms=D.M.filter(m=>m.facultyId===f.id),mi=new Set(Ms.map(m=>m.id));return {Ms,Ps:D.P.filter(p=>mi.has(p.majorId))}}
function fqMatchF(f,D){const {Ms,Ps}=fqInfo(f,D);if(FS.g&&f.groupId!==FS.g)return null;if(FS.lv&&!(Ms.some(m=>(m.levels||[]).includes(FS.lv))||Ps.some(p=>p.level===FS.lv)))return null;
 const q=FS.q;if(!q)return {hits:[]};const hay=x=>[x.nameTh,x.nameEn,x.abbr,x.degree].join(' ').toLowerCase();if(hay(f).includes(q))return {hits:[]};
 const hits=Ms.filter(m=>hay(m).includes(q)).map(m=>m.nameTh).concat(Ps.filter(p=>hay(p).includes(q)).map(p=>p.nameTh));return hits.length?{hits}:null}
function fqListHtml(D){let n=0;const body=D.G.map(g=>{const cs=D.F.filter(f=>f.groupId===g.id).map(f=>({f,m:fqMatchF(f,D)})).filter(x=>x.m);if(!cs.length)return '';n+=cs.length;
 return `<section class="fqg"><h2>${E(g.name)}</h2>${g.desc?`<p class="pl">${E(g.desc)}</p>`:''}<div class="fcg">${cs.map(({f,m})=>{const {Ms,Ps}=fqInfo(f,D),cv=okU(f.cover),im=cv?f.cover:okU(f.logo)?f.logo:'',cnt=[Ms.length?Ms.length+' สาขาวิชา':'',Ps.length?Ps.length+' หลักสูตร':''].filter(Boolean).join(' · ');
  return `<a class="fcd" href="#/faculty/${E(f.id)}"><div class="fcm${im?(cv?'':' lg'):' fcp'}"${im?'':' aria-hidden="true"'}>${im?`<img src="${E(im)}" alt="" loading="lazy">`:kitMark(30)}</div><div class="fcb"><h3>${E(f.nameTh)}</h3>${f.nameEn?`<p class="fcen">${E(f.nameEn)}</p>`:''}${f.brief?`<p class="pl fqbr">${E(f.brief)}</p>`:''}${cnt?`<p class="fcn">${cnt}</p>`:''}${m.hits.length?`<p class="fcn">ตรงกับ: ${m.hits.slice(0,3).map(E).join(', ')}${m.hits.length>3?' …':''}</p>`:''}<span class="fcgo">ดูรายละเอียด</span></div></a>`}).join('')}</div></section>`}).join('');
 return `<p class="evm" id="fqn" aria-live="polite">${n?'พบ '+n+' คณะ/วิทยาลัย':''}</p>${n?body:'<div class="empty-ev"><b>ไม่พบข้อมูลที่ตรงกับการค้นหา</b><br>ลองเปลี่ยนคำค้นหาหรือตัวกรอง</div>'}`}
function facView(){if(FS.key!==location.hash){FS.key=location.hash;FS.q='';FS.g='';FS.lv=''}
 const D=fqPub();if(!D.F.length)return `<div class="fq"><div class="empty-ev"><b>ยังไม่มีข้อมูลคณะและวิทยาลัย</b><br>กรุณากลับมาใหม่ภายหลัง</div></div>`;
 const gs=D.G.filter(g=>D.F.some(f=>f.groupId===g.id)),lvs=FQ_LV.filter(l=>D.M.some(m=>(m.levels||[]).includes(l[0]))||D.P.some(p=>p.level===l[0])),chip=(k,v,t)=>`<button type="button" class="cmc fqc${FS[k]===v?' on':''}" data-k="${k}" data-v="${E(v)}" onclick="fqSet('${k}','${E(v)}')">${E(t)}</button>`;
 return `<div class="fq ty" style="${tyStyle(tyGet(null))}"><div class="cmt"><input id="fqq" type="search" placeholder="ค้นหาชื่อคณะ สาขาวิชา หรือหลักสูตร" value="${E(FS.q)}" oninput="fqFilter()" aria-label="ค้นหาชื่อคณะ สาขาวิชา หรือหลักสูตร"></div>
<div class="cmcs" role="group" aria-label="กรองตามกลุ่มคณะ">${chip('g','','ทุกกลุ่มคณะ')}${gs.map(g=>chip('g',g.id,g.name)).join('')}</div>${lvs.length?`<div class="cmcs" role="group" aria-label="กรองตามระดับการศึกษา" style="margin-top:8px">${chip('lv','','ทุกระดับการศึกษา')}${lvs.map(l=>chip('lv',l[0],l[1])).join('')}</div>`:''}<div id="fql">${fqListHtml(D)}</div></div>`}
function fqRefresh(){const l=$('fql');if(l)l.innerHTML=fqListHtml(fqPub());document.querySelectorAll('.fqc').forEach(b=>b.classList.toggle('on',FS[b.dataset.k]===b.dataset.v))}
function fqFilter(){const i=$('fqq');FS.q=i?i.value.trim().toLowerCase():'';fqRefresh()}
function fqSet(k,v){FS[k]=FS[k]===v&&v!==''?'':v;fqRefresh()}
function fqFacTuition(f,D){const {Ps}=fqInfo(f,D),r=fqTuiRange(Ps);if(!r)return '';
 const v=r.lo===r.hi?fqBaht(r.lo):fqBaht(r.lo)+' – '+fqBaht(r.hi);
 return `<section class="fqs"><h2>ค่าเล่าเรียน</h2><div class="fqtu"><p class="fqtv"><span class="fqtul">ค่าเล่าเรียน</span> <b>${E(v)}</b> <span class="fqtn">บาท/ภาคการศึกษา</span></p><p class="evm">${r.lo===r.hi?'':'ค่าเล่าเรียนแตกต่างกันตามหลักสูตร '}${r.all?'':'(แสดงจากหลักสูตรที่ระบุไว้ '+r.n+' จาก '+Ps.length+' หลักสูตร) '}ดูค่าเล่าเรียนของแต่ละหลักสูตรได้ในหน้ารายละเอียดหลักสูตร</p></div></section>`}
function facDetail(id){const D=fqPub(),f=D.F.find(x=>x.id===id);
 if(!f)return ('<div class="w sec"><h1>ไม่พบคณะหรือวิทยาลัยนี้</h1><p>อาจยังไม่เผยแพร่หรือถูกลบแล้ว</p><p><a class="bk" href="#/">← กลับหน้าแรก</a></p></div>');
 const lp=getPages().find(p=>p.status==='published'&&(p.sections||[]).some(s=>s.type==='faculties')),back=lp?'#/p/'+lp.slug:'#/',g=D.G.find(x=>x.id===f.groupId),fl=fqFlower(f),hasFl=fl.img||fl.nameTh||fl.nameEn||fl.meaning,{Ms}=fqInfo(f,D),blk=(t,v)=>v?`<section class="fqs"><h2>${t}</h2><p class="pl">${E(v)}</p></section>`:'';
 const prog=p=>`<a class="fqpr" href="#/program/${E(p.id)}"><span class="fqpn"><b>${E(p.nameTh)}</b>${p.nameEn?`<small>${E(p.nameEn)}</small>`:''}</span><span class="fqpt"><span class="tag">${E(fqLv(p.level))}</span><span class="tag">${p.open==='open'?'เปิดรับสมัคร':'ปิดรับสมัคร'}</span></span>${fqTui(p)!=null?`<span class="fqpu">${E(fqTuiTxt(fqTui(p)))}</span>`:''}<span class="fqpm">ดูรายละเอียด →</span></a>`;
 return (`<div class="w sec fqd ty" style="${tyStyle(tyFac(f))}"><p><a class="bk" href="${E(back)}">← กลับหน้ารวมคณะและวิทยาลัย</a></p>${okU(f.cover)?`<div class="fqb"><img src="${E(f.cover)}" alt=""></div>`:''}<div class="fqh">${okU(f.logo)?`<img class="fql" src="${E(f.logo)}" alt="ตราสัญลักษณ์ ${E(f.nameTh)}">`:''}<div>${g?`<p class="evm">${E(g.name)}</p>`:''}<h1>${E(f.nameTh)}</h1>${f.nameEn?`<p class="evm">${E(f.nameEn)}</p>`:''}${f.abbr?`<span class="tag">${E(f.abbr)}</span>`:''}</div></div>${blk('เกี่ยวกับคณะ',f.about||f.brief)}${fqFacTuition(f,D)}${blk('ข้อมูลการรับสมัคร',f.admission)}${blk('ช่องทางติดต่อ',f.contact)}${fqBlocksHtml(f.blocks)}
${hasFl?`<section class="fqs"><h2>ดอกไม้ประจำคณะ</h2><div class="fqfl">${fl.img?`<img src="${E(fl.img)}" alt="${E(fl.nameTh||'ดอกไม้ประจำคณะ')}">`:''}<div>${fl.nameTh?`<h3>${E(fl.nameTh)}</h3>`:''}${fl.nameEn?`<p class="evm">${E(fl.nameEn)}</p>`:''}${fl.meaning?`<p class="pl">${E(fl.meaning)}</p>`:''}</div></div></section>`:''}
<section class="fqs"><h2>สาขาวิชาและหลักสูตร</h2>${Ms.length?Ms.map(m=>{const ps=D.P.filter(p=>p.majorId===m.id);return `<section class="fqm"><h3>${E(m.nameTh)}</h3>${m.nameEn?`<p class="evm">${E(m.nameEn)}</p>`:''}<p>${(m.levels||[]).map(l=>`<span class="tag">${E(fqLv(l))}</span>`).join('')}</p>${m.desc?`<p class="pl">${E(m.desc)}</p>`:''}${Array.isArray(m.suitableFor)&&m.suitableFor.some(Boolean)?`<h4>สาขาที่เหมาะกับผู้เรียน</h4>${fqUl(m.suitableFor)}`:''}${ps.length?`<div class="fqpl">${ps.map(prog).join('')}</div>`:'<p class="evm">ยังไม่มีข้อมูลหลักสูตร</p>'}</section>`}).join(''):'<div class="empty-ev">ยังไม่มีข้อมูลสาขาวิชาและหลักสูตร</div>'}</section></div>`)}
PUB.faculty=facDetail;

/* ===== ตัวอักษร (Typography): ค่าส่วนกลางใน settings.typo และค่าเฉพาะคณะใน faculties[].typo ===== */
const TY_DEF={h1:40,h2:28,h3:21,h4:17,hw:700,hb:.9,ha:.5,b:16,bw:400,lh:1.7,pg:12,li:6,ff:'def',ta:'left',cw:270,cc:4,pc:1};
const TY_R={h1:[24,72,1],h2:[18,48,1],h3:[16,36,1],h4:[14,28,1],hw:[400,700,1],hb:[0,4,.1],ha:[0,3,.1],b:[13,24,1],bw:[400,600,1],lh:[1.2,2.4,.05],pg:[0,40,1],li:[0,24,1],cw:[200,480,10],cc:[1,6,1],pc:[1,4,1]};
const TY_U={h1:'px',h2:'px',h3:'px',h4:'px',hw:'',hb:'em',ha:'em',b:'px',bw:'',lh:'',pg:'px',li:'px',cw:'px',cc:'',pc:''};
const TY_L={h1:'ขนาดชื่อคณะ/วิทยาลัย/หลักสูตร (px)',h2:'ขนาดหัวข้อหลัก (px)',h3:'ขนาดหัวข้อรอง (px)',h4:'ขนาดหัวข้อย่อย (px)',hw:'น้ำหนักตัวอักษรหัวข้อ',hb:'ระยะห่างก่อนหัวข้อ (em)',ha:'ระยะห่างหลังหัวข้อ (em)',b:'ขนาดข้อความปกติ/รายละเอียด (px)',bw:'น้ำหนักตัวอักษรข้อความ',lh:'ความสูงของบรรทัด (Line Height)',pg:'ระยะห่างระหว่างย่อหน้า (px)',li:'ระยะห่างระหว่างรายการ (px)',ff:'ฟอนต์',ta:'การจัดแนวข้อความ',cw:'ความกว้างขั้นต่ำของการ์ด (px)',cc:'จำนวนการ์ดคณะต่อแถว (สูงสุด บนคอมพิวเตอร์)',pc:'จำนวนการ์ดหลักสูตรต่อแถว (บนคอมพิวเตอร์)'};
const TY_W={hw:[[400,'ปกติ (400)'],[600,'ค่อนข้างหนา (600)'],[700,'หนา (700)']],bw:[[400,'ปกติ (400)'],[600,'ค่อนข้างหนา (600)']]};
/* รายการฟอนต์ที่รองรับ: ค่าเริ่มต้น = ฟอนต์เดิมของเว็บไซต์ (ไม่โหลดเพิ่ม) ฟอนต์อื่นโหลดจาก Google Fonts เฉพาะเมื่อถูกเลือกใช้ */
const TY_FF=[{id:'def',t:'ค่าเริ่มต้นของเว็บไซต์ (Anuphan)'},{id:'sarabun',t:'Sarabun (สารบรรณ)',css:"Sarabun,'Noto Sans Thai',sans-serif",gf:'Sarabun:wght@400;600;700'},{id:'prompt',t:'Prompt',css:"Prompt,'Noto Sans Thai',sans-serif",gf:'Prompt:wght@400;600;700'},{id:'kanit',t:'Kanit',css:"Kanit,'Noto Sans Thai',sans-serif",gf:'Kanit:wght@400;600;700'},{id:'notosans',t:'Noto Sans Thai',css:"'Noto Sans Thai',system-ui,sans-serif",gf:'Noto+Sans+Thai:wght@400;600;700'},{id:'plex',t:'IBM Plex Sans Thai',css:"'IBM Plex Sans Thai','Noto Sans Thai',sans-serif",gf:'IBM+Plex+Sans+Thai:wght@400;600;700'},{id:'notoserif',t:'Noto Serif Thai (มีหัว)',css:"'Noto Serif Thai',serif",gf:'Noto+Serif+Thai:wght@400;600;700'},{id:'system',t:'ฟอนต์ของระบบ (เร็วที่สุด)',css:"system-ui,'Noto Sans Thai',sans-serif"}];
const TY_O={ta:[['left','ชิดซ้าย'],['center','กึ่งกลาง'],['right','ชิดขวา']],ff:TY_FF.map(x=>[x.id,x.t])};
function tyLoad(id){const o=TY_FF.find(x=>x.id===id);if(!o||!o.gf)return;const i='tyf-'+o.id;if(document.getElementById(i))return;const l=document.createElement('link');l.id=i;l.rel='stylesheet';l.href='https://fonts.googleapis.com/css2?family='+o.gf+'&display=swap';document.head.appendChild(l)}
const tyNum=(v,k)=>{if(TY_O[k]){const s=String(v);return TY_O[k].some(o=>o[0]===s)?s:TY_DEF[k]}const r=TY_R[k],n=parseFloat(v);return Number.isFinite(n)?Math.min(r[1],Math.max(r[0],n)):TY_DEF[k]};
const tyGet=over=>{const g=getSet().typo||{},o={};Object.keys(TY_DEF).forEach(k=>{const a=over&&over[k]!=null&&over[k]!==''?over[k]:g[k];o[k]=tyNum(a!=null&&a!==''?a:TY_DEF[k],k)});return o};
const tyStyle=t=>{const fid=tyNum(t.ff,'ff'),ff=TY_FF.find(x=>x.id===fid),a=tyNum(t.ta,'ta'),o=Object.keys(TY_DEF).filter(k=>!TY_O[k]).map(k=>'--ty-'+k+':'+tyNum(t[k],k)+TY_U[k]);
 o.push('--ty-ta:'+a,'--ty-ml:'+(a==='left'?'0':'auto'),'--ty-mr:'+(a==='right'?'0':'auto'),'--ty-jc:'+(a==='center'?'center':a==='right'?'flex-end':'flex-start'));
 if(ff&&ff.css){tyLoad(fid);o.push('--ty-ff:'+ff.css)}return o.join(';')};
const tyFac=f=>tyGet(f&&f.typo&&f.typo.on?f.typo:null);
function tyInputs(pre,t){const row=k=>{const r=TY_R[k],op=TY_W[k]||TY_O[k];return `<div><label for="${pre}${k}">${TY_L[k]}</label>${op?`<select id="${pre}${k}" name="${pre}${k}" onchange="tyPrev('${pre}')">${op.map(([v,x])=>`<option value="${v}"${String(t[k])===String(v)?' selected':''}>${x}</option>`).join('')}</select>`:`<input id="${pre}${k}" name="${pre}${k}" type="number" inputmode="decimal" min="${r[0]}" max="${r[1]}" step="${r[2]}" value="${t[k]}" oninput="tyPrev('${pre}')">`}</div>`};
 const fc=n=>`<div class="fcd"><div class="fcb"><h3>คณะตัวอย่าง ${n}</h3><p class="fcen">Sample Faculty ${n}</p><p class="pl fqbr">คำอธิบายสั้น ๆ ของคณะ</p><span class="fcgo">ดูรายละเอียด</span></div></div>`,pr=n=>`<div class="fqpr"><span class="fqpn"><b>หลักสูตรตัวอย่าง ${n}</b><small>Sample Program ${n}</small></span><span class="fqpt"><span class="tag">ปริญญาตรี</span></span><span class="fqpm">ดูรายละเอียด →</span></div>`;
 return `<h3>หัวข้อ (Heading)</h3><div class="g2">${['h1','h2','h3','h4','hw','hb','ha'].map(row).join('')}</div><h3>ข้อความ (Body Text)</h3><div class="g2">${['b','bw','lh','pg','li'].map(row).join('')}</div><h3>ฟอนต์และการจัดแนวข้อความ</h3><div class="g2">${['ff','ta'].map(row).join('')}</div><h3>การจัดวางการ์ด</h3><div class="g2">${['cw','cc','pc'].map(row).join('')}</div><p><small>จำนวนต่อแถวเป็นค่าสูงสุด หากหน้าจอแคบจนการ์ดกว้างไม่ถึงค่าขั้นต่ำ ระบบจะลดจำนวนใบต่อแถวให้เองอัตโนมัติ (แท็บเล็ตและมือถือจึงเหลือน้อยลงหรือเรียง 1 ใบ)</small></p>
<h3>ตัวอย่างก่อนบันทึก</h3><div id="pv_${pre}" class="ty typv" style="${tyStyle(t)}"><h1>ชื่อคณะหรือหลักสูตร</h1><h2>หัวข้อหลัก</h2><p>ตัวอย่างข้อความอธิบายปกติ ใช้ดูขนาดตัวอักษร ความสูงบรรทัด และระยะห่างระหว่างย่อหน้า</p><p>ย่อหน้าที่สอง สำหรับดูระยะห่างระหว่างย่อหน้า</p><h3>หัวข้อรอง</h3><ul><li>รายการที่หนึ่ง</li><li>รายการที่สอง</li></ul><h4>หัวข้อย่อย</h4><p>ข้อความใต้หัวข้อย่อย</p><h4>การ์ดคณะ/วิทยาลัย</h4><div class="fcg">${fc(1)}${fc(2)}${fc(3)}${fc(4)}</div><h4>การ์ดหลักสูตร</h4><div class="fqpl">${pr(1)}${pr(2)}${pr(3)}</div></div>`}
function tyRead(pre,d){const o={};Object.keys(TY_DEF).forEach(k=>{o[k]=tyNum(d.get(pre+k),k)});return o}
function tyPrev(pre){const f=$('af');if(!f)return;const el=$(('pv_')+pre);if(el)el.style.cssText=tyStyle(tyRead(pre,new FormData(f)))}
function tyReset(pre){Object.keys(TY_DEF).forEach(k=>{const el=$(pre+k);if(el)el.value=TY_DEF[k]});tyPrev(pre)}
function typoSite(){const t=tyGet(null);return `<p>ค่ามาตรฐานของทั้งเว็บไซต์สำหรับหน้าคณะ วิทยาลัย และหลักสูตร (ขนาด/น้ำหนัก/ฟอนต์/การจัดแนวข้อความ และการจัดวางการ์ด) ดูตัวอย่างด้านล่างก่อนบันทึก ผู้เข้าชมเห็นผลทันทีหลังบันทึก หากต้องการปรับเฉพาะคณะ ให้ไปที่หน้าแก้ไขคณะนั้น</p>${dbBanner()}<form id="af" onsubmit="return false">${tyInputs('ty_',t)}<p><button type="button" class="btn b" onclick="tySave()">บันทึก</button> <button type="button" class="btn" onclick="tyReset('ty_')">คืนค่าเริ่มต้น</button></p><p><small>กดคืนค่าเริ่มต้นแล้วต้องกดบันทึกอีกครั้งจึงจะมีผลกับเว็บไซต์</small></p></form>`}
async function tySave(){const f=$('af');if(!f)return;if(!DBH)return say(dbOff(),false);const t=tyRead('ty_',new FormData(f));try{await putDoc('settings',Object.assign({},getSH('settings')||{},{typo:t}));say('บันทึกการตั้งค่าตัวอักษรเรียบร้อย ผู้เข้าชมเห็นทันที')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}


/* ===== ตั้งค่ารูปแบบรายหน้า (หน้าแรก + หน้าที่สร้างจากระบบเพจ): เก็บใน settings.pagestyle[คีย์หน้า] ในเอกสาร settings เดิม =====
   เลือกใช้เป็นรายหน้า (on) และเป็นรายช่อง: ช่องที่เว้นว่าง = ใช้หน้าตาเดิมของหน้านั้น ไม่มีการเปลี่ยนอัตโนมัติ */
const PS_K=['ff','ta','hta','bta','h1','h2','h3','hw','b','bw','cw','cc','gap','sp'];
const PS_R={h1:[24,72,1],h2:[18,48,1],h3:[14,36,1],b:[13,24,1],cw:[160,480,10],cc:[1,6,1],gap:[0,48,1],sp:[0,64,1]};
const PS_U={h1:'px',h2:'px',h3:'px',b:'px',cw:'px',cc:'',gap:'px',sp:'px'};
const PS_L={ff:'ฟอนต์',ta:'การจัดแนวข้อความ (ทั้งหมด)',hta:'การจัดแนวหัวข้อ (แยกจากรายละเอียด)',bta:'การจัดแนวข้อความและรายละเอียด (แยกจากหัวข้อ)',h1:'ขนาดชื่อหน้า (px)',h2:'ขนาดหัวข้อหลัก (px)',h3:'ขนาดหัวข้อการ์ด/หัวข้อรอง (px)',hw:'น้ำหนักตัวอักษรหัวข้อ',b:'ขนาดข้อความและรายละเอียด (px)',bw:'น้ำหนักตัวอักษรข้อความ',cw:'ความกว้างขั้นต่ำของการ์ด (px)',cc:'จำนวนการ์ดต่อแถว สูงสุด (1 = เรียงลงมา)',gap:'ระยะห่างระหว่างการ์ด (px)',sp:'ระยะห่างระหว่างส่วนเนื้อหา (px)'};
const PS_O={ff:[['','ไม่ปรับ (ใช้ฟอนต์เดิม)']].concat(TY_FF.filter(x=>x.css).map(x=>[x.id,x.t])),ta:[['','ไม่ปรับ (ใช้ค่าเดิม)'],['left','ชิดซ้าย'],['center','กึ่งกลาง'],['right','ชิดขวา']],hw:[['','ไม่ปรับ (ใช้ค่าเดิม)'],['400','ปกติ (400)'],['600','ค่อนข้างหนา (600)'],['700','หนา (700)']],bw:[['','ไม่ปรับ (ใช้ค่าเดิม)'],['400','ปกติ (400)'],['600','ค่อนข้างหนา (600)']]};
PS_O.hta=PS_O.bta=PS_O.ta;
/* ===== ตั้งค่าการจัดวางรายองค์ประกอบ: เก็บในออบเจ็กต์ของแต่ละส่วน (s.st) การ์ดแต่ละใบ (c.st) และกลุ่ม (p.groups[].st) ในเอกสาร pages เดิม
   ไม่มีตารางใหม่ ค่าย้ายตามองค์ประกอบเมื่อเรียงลำดับ/ทำซ้ำ/ลบ ช่องที่เว้นว่าง = ใช้หน้าตาเดิม ลำดับความสำคัญ: หน้า → กลุ่ม → ส่วน → การ์ด (ใกล้กว่าชนะ) ===== */
const EL_AL=[['','ไม่ปรับ (ใช้ค่าเดิม)'],['left','ชิดซ้าย'],['center','กึ่งกลาง'],['right','ชิดขวา']];
const EL_O={ba:EL_AL,ta:EL_AL,hta:EL_AL,bta:EL_AL,hfw:PS_O.hw,bfw:PS_O.bw,hff:PS_O.ff,bff:PS_O.ff,lay:[['','ไม่ปรับ (ใช้ค่าเดิม)'],['row','เรียงอยู่ข้างกัน'],['col','เรียงลงมาทีละใบ']],ja:[['','ไม่ปรับ (ใช้ค่าเดิม)'],['start','ชิดซ้าย'],['center','กึ่งกลาง'],['end','ชิดขวา']]};
const EL_R={w:[160,1100,10],sp:[0,96,1],hfs:[14,72,1],bfs:[12,28,1],cw:[160,480,10],cc:[1,6,1],gap:[0,48,1]};
const EL_U={w:'px',sp:'px',hfs:'px',bfs:'px',cw:'px',gap:'px'};
const EL_L={ba:'ตำแหน่งของบล็อกในหน้า',w:'ความกว้างสูงสุด (px)',sp:'ระยะห่างบน-ล่าง (px)',ta:'จัดแนวข้อความทั้งหมด',hta:'จัดแนวหัวข้อ',hfs:'ขนาดหัวข้อ (px)',hfw:'ความหนาหัวข้อ',hff:'ฟอนต์หัวข้อ',bta:'จัดแนวข้อความและรายละเอียด',bfs:'ขนาดข้อความ (px)',bfw:'ความหนาข้อความ',bff:'ฟอนต์ข้อความ',lay:'การเรียงการ์ด',cw:'ความกว้างขั้นต่ำของการ์ด (px)',cc:'จำนวนการ์ดต่อแถว สูงสุด',gap:'ระยะห่างระหว่างการ์ด (px)',ja:'ตำแหน่งการ์ดในแถว'};
const EL_CL={w:'ความกว้างสูงสุดของการ์ด (px)',sp:'ระยะเว้นรอบการ์ด (px)',ta:'จัดแนวข้อความทั้งการ์ด',hta:'จัดแนวหัวข้อในการ์ด',bta:'จัดแนวรายละเอียดในการ์ด',hfs:'ขนาดหัวข้อในการ์ด (px)',bfs:'ขนาดข้อความในการ์ด (px)'};
const EL_K=Object.keys(EL_L);
const EL_C=['ja','w','sp','ta','hta','bta','hfs','bfs'],EL_G=['ba','w','sp','ta','hta','bta'];
const EL_T={heading:['ba','w','sp','hta','hfs','hfw','hff'],text:['ba','w','sp','bta','bfs','bfw','bff'],image:['ba','w','sp'],button:['ba','w','sp'],cards:['ba','w','sp','ta','hta','bta','hfs','hfw','hff','bfs','bfw','bff','lay','cw','cc','gap'],linkcards:['ba','w','sp','ta','hta','bta','hfs','hfw','hff','bfs','bfw','bff','lay','cw','cc','gap']};
EL_T.clubs=EL_T.cards;
function elVal(v,k){if(v==null||v==='')return '';if(EL_O[k]){const x=String(v);return EL_O[k].some(o=>o[0]===x&&x!=='')?x:''}const r=EL_R[k],n=parseFloat(v);return r&&Number.isFinite(n)?Math.min(r[1],Math.max(r[0],n)):''}
/* แปลงค่า → {ds: ชื่อช่องที่ปรับ, st: ตัวแปร CSS --e-*} เฉพาะช่องที่มีค่า; ta/hta/bta รวมเป็น --e-h (หัวข้อ) และ --e-b (รายละเอียด) เพื่อให้ค่าที่ใกล้กว่าชนะเสมอ */
function elBuild(o,type){const st=[],ds=[];o=o||{};const A=v=>v==='center'?'center':v==='right'?'flex-end':'flex-start',V={};EL_K.forEach(k=>{V[k]=elVal(o[k],k)});
 EL_K.forEach(k=>{const v=V[k];if(v===''||k==='ta'||k==='hta'||k==='bta')return;
  if(k==='ba'){ds.push('ba');st.push('--e-ml:'+(v==='left'?'0':'auto'),'--e-mr:'+(v==='right'?'0':'auto'))}
  else if(k==='lay')ds.push(v);
  else if(k==='hff'||k==='bff'){const f=TY_FF.find(x=>x.id===v);if(f&&f.css){tyLoad(v);ds.push(k);st.push('--e-'+k+':'+f.css)}}
  else{ds.push(k);st.push('--e-'+k+':'+v+(EL_U[k]||''))}});
 const h=V.hta||V.ta,b=V.bta||V.ta;if(h){ds.push('eh');st.push('--e-h:'+h)}if(b){ds.push('eb');st.push('--e-b:'+b,'--e-bai:'+A(b))}
 if(V.ba&&!V.w&&['heading','text','button','image'].includes(type))ds.push('fit');
 return {ds:ds.join(' '),st:st.join(';')}}
const elA=(o,type,cls)=>{const b=elBuild(o,type);return b.ds?` class="${cls}" data-e="${b.ds}" style="${b.st}"`:''};
const elD=o=>{const b=elBuild(o,'card');return b.ds?{c:' ce',a:` data-e="${b.ds}" style="${b.st}"`}:{c:'',a:''}};
/* ---- แก้ไข: ส่วนติดต่อผู้ดูแล ---- */
function elRow(pre,k,v,lab){const op=EL_O[k],r=EL_R[k],x=v==null?'':v;return `<div><label>${lab||EL_L[k]}</label>${op?`<select name="${pre}${k}">${op.map(([a,t])=>`<option value="${a}"${String(x)===a?' selected':''}>${t}</option>`).join('')}</select>`:`<input name="${pre}${k}" type="number" inputmode="decimal" min="${r[0]}" max="${r[1]}" step="${r[2]}" value="${x}" placeholder="ไม่ปรับ">`}</div>`}
function elBox(title,pre,keys,st,labs,extra){st=st||{};const on=Object.keys(st).length>0;return `<details class="eld"${on?' open':''}><summary>${title}${on?' (ตั้งค่าแล้ว)':''}</summary><div class="g2">${extra||''}${keys.map(k=>elRow(pre,k,st[k],labs&&labs[k])).join('')}</div><small>เว้นว่าง = ใช้หน้าตาเดิม การตั้งค่านี้ไม่กระทบส่วนหรือการ์ดอื่น</small></details>`}
function elSecUI(p,s){const n=s.id+'_',G=p.groups||[],gs=G.length?`<div><label>กลุ่มองค์ประกอบ</label><select name="${n}grp"><option value="">ไม่อยู่ในกลุ่ม</option>${G.map(g=>`<option value="${E(g.id)}"${s.grp===g.id?' selected':''}>${E(g.name)}</option>`).join('')}</select></div>`:'';return elBox('การจัดวางเฉพาะส่วนนี้',n+'st_',EL_T[s.type]||['ba','w','sp'],s.st,null,gs)}
const elCardUI=(s,c,j)=>elBox('การจัดวางเฉพาะการ์ดใบนี้',s.id+'_'+j+'_st_',EL_C,c.st,EL_CL);
function elGroupsUI(p){const G=p.groups||[];return `<fieldset class="fqfs"><legend>กลุ่มองค์ประกอบ (ไม่บังคับ)</legend><p><small>รวมส่วนเนื้อหาที่เกี่ยวข้องไว้ในกลุ่มเดียวกัน แล้วตั้งการจัดวางของทั้งกลุ่ม จากนั้นเลือกกลุ่มที่แต่ละส่วนด้านล่าง ควรเรียงส่วนที่อยู่กลุ่มเดียวกันให้ติดกัน ส่วนและการ์ดในกลุ่มยังตั้งค่าแยกจากกลุ่มได้ ตำแหน่งของกลุ่มต้องกำหนดความกว้างสูงสุดจึงจะเห็นผล</small></p>${G.map(g=>`<div class="row"><b>${E(g.name||'กลุ่ม')}</b> <button type="button" class="btn s c" onclick="gdel('${p.id}','${g.id}')">ลบกลุ่ม</button><label>ชื่อกลุ่ม</label><input name="gp_${g.id}_name" value="${E(g.name||'')}">${elBox('การจัดวางทั้งกลุ่ม','gp_'+g.id+'_',EL_G,g.st)}</div>`).join('')}<button type="button" class="btn s" onclick="gadd('${p.id}')">+ เพิ่มกลุ่ม</button></fieldset>`}
function elApply(t,key,d,pre){const o=Object.assign({},t[key]||{});EL_K.forEach(k=>{if(d.has(pre+k)){const v=elVal(d.get(pre+k),k);if(v==='')delete o[k];else o[k]=v}});if(Object.keys(o).length)t[key]=o;else delete t[key]}
function elSSync(s,d){const n=s.id+'_';if(d.has(n+'grp')){const v=d.get(n+'grp');if(v)s.grp=v;else delete s.grp}elApply(s,'st',d,n+'st_');(s.items||[]).forEach((c,j)=>elApply(c,'st',d,n+j+'_st_'))}
function elGSync(p,d){(p.groups||[]).forEach(g=>{const k='gp_'+g.id+'_name';if(d.has(k)){const v=STRIP(d.get(k)).trim();if(v)g.name=v}if(!g.st)g.st={};elApply(g,'st',d,'gp_'+g.id+'_')})}
function gadd(id){psync(id);const p=pcur(id);p.groups=p.groups||[];p.groups.push({id:mkId('g'),name:'กลุ่ม '+(p.groups.length+1)});render()}
function gdel(id,gid){psync(id);const p=pcur(id);p.groups=(p.groups||[]).filter(g=>g.id!==gid);if(!p.groups.length)delete p.groups;p.sections.forEach(s=>{if(s.grp===gid)delete s.grp});render()}
function psVal(v,k){if(v==null||v==='')return '';if(PS_O[k]){const s=String(v);return PS_O[k].some(o=>o[0]===s&&s!=='')?s:''}const r=PS_R[k],n=parseFloat(v);return Number.isFinite(n)?Math.min(r[1],Math.max(r[0],n)):''}
/* แปลงค่า → {st: ตัวแปร CSS, ds: รายชื่อช่องที่ปรับ} เฉพาะช่องที่มีค่า */
function psBuild(o){const st=[],ds=[];o=o||{};PS_K.forEach(k=>{const v=psVal(o[k],k);if(v==='')return;ds.push(k);
 if(k==='ff'){const f=TY_FF.find(x=>x.id===v);if(f&&f.css){tyLoad(v);st.push('--pg-ff:'+f.css)}}
 else if(k==='ta')st.push('--pg-ta:'+v,'--pg-ml:'+(v==='left'?'0':'auto'),'--pg-mr:'+(v==='right'?'0':'auto'),'--pg-ai:'+(v==='center'?'center':v==='right'?'flex-end':'flex-start'));
 else if(k==='hta')st.push('--pg-hta:'+v,'--pg-hml:'+(v==='left'?'0':'auto'),'--pg-hmr:'+(v==='right'?'0':'auto'));
 else st.push('--pg-'+k+':'+v+(PS_U[k]||''))});return {st:st.join(';'),ds:ds.join(' ')}}
const psOn=key=>{const o=(getSet().pagestyle||{})[key];return o&&o.on?o:null};
const psC=key=>psOn(key)?' pgs':'';
const psA=key=>{const o=psOn(key);if(!o)return '';const b=psBuild(o);return b.ds?` data-s="${b.ds}" style="${b.st}"`:''};
function psFields(key){const base=['ff','ta','hta','bta','h1','hw','sp'];if(key==='home')return ['ff','ta','hta','bta','h2','h3','hw','b','bw','cw','cc','gap','sp'];
 const p=getPages().find(x=>x.id===key),T=new Set(((p&&p.sections)||[]).map(x=>x.type)),has=(...a)=>a.some(x=>T.has(x));
 const f=base.slice();if(has('heading'))f.push('h2');if(has('cards','linkcards','people','clubs'))f.push('h3','cw','cc','gap');if(has('text','list','group','cards','linkcards'))f.push('b','bw');return PS_K.filter(k=>f.includes(k))}
function psScope(v){WC.psScope=v;render()}
function psScopeBar(){const sc=WC.psScope||'site',P=getPages();return `<p><label for="ps_scope"><b>เลือกหน้าที่ต้องการตั้งค่า</b></label><select id="ps_scope" onchange="psScope(this.value)"><option value="site"${sc==='site'?' selected':''}>ค่ามาตรฐานหน้าคณะ วิทยาลัย หลักสูตร และรายวิชา</option><option value="home"${sc==='home'?' selected':''}>หน้าแรก (ไม่รวมแบนเนอร์ด้านบน)</option>${P.map(p=>`<option value="${E(p.id)}"${sc===p.id?' selected':''}>หน้า: ${E(p.title)}${p.status==='published'?'':' (ฉบับร่าง)'}</option>`).join('')}</select></p>`}
function psInputs(key,o){const row=k=>{const r=PS_R[k],op=PS_O[k],v=o[k]==null?'':o[k];return `<div><label for="ps_${k}">${PS_L[k]}</label>${op?`<select id="ps_${k}" name="ps_${k}" onchange="psPrev()">${op.map(([x,t])=>`<option value="${x}"${String(v)===x?' selected':''}>${t}</option>`).join('')}</select>`:`<input id="ps_${k}" name="ps_${k}" type="number" inputmode="decimal" min="${r[0]}" max="${r[1]}" step="${r[2]}" value="${v}" placeholder="ไม่ปรับ" oninput="psPrev()">`}</div>`},F=psFields(key),g=(t,a)=>{const l=F.filter(k=>a.includes(k));return l.length?`<h3>${t}</h3><div class="g2">${l.map(row).join('')}</div>`:''};
 return g('ข้อความ',['ff','ta','hta','bta','h1','h2','h3','hw','b','bw'])+g('การจัดวางการ์ด',['cw','cc','gap'])+g('ระยะห่าง',['sp'])}
function psAdmin(key){const o=((getSet().pagestyle||{})[key])||{},isH=key==='home',p=isH?null:getPages().find(x=>x.id===key);if(!isH&&!p){WC.psScope='site';return typoSite()}
 const T=new Set(((p&&p.sections)||[]).map(x=>x.type)),note=!isH&&(T.has('faculties')||T.has('courses'))?'<p><small>ส่วนคณะ/วิทยาลัย/รายวิชาในหน้านี้ใช้ค่ามาตรฐานของระบบเดิม (เลือกจากรายการด้านบน) ไม่ถูกเปลี่ยนโดยการตั้งค่านี้</small></p>':'',link=isH?'#/':(p.status==='published'?'#/p/'+p.slug:'#/preview/'+p.id);
 const sample=`<div id="pv_ps" class="pgs typv"${(()=>{const b=psBuild(o);return b.ds?` data-s="${b.ds}" style="${b.st}"`:''})()}><h1>ชื่อหน้าตัวอย่าง</h1><h2>หัวข้อหลัก</h2><p class="pl">ตัวอย่างข้อความอธิบายปกติ ใช้ดูขนาด ความหนา ฟอนต์ และการจัดแนว</p><h2>การ์ด</h2><div class="grid">${[1,2,3].map(n=>`<div class="card h"><div class="p"><h3>การ์ด ${n}</h3><p class="pl">รายละเอียดการ์ด</p></div></div>`).join('')}</div><h2>การ์ดลิงก์</h2><div class="lcg">${[1,2].map(n=>`<div class="lc"><h3>หัวข้อ ${n}</h3><p>คำอธิบายสั้น ๆ</p></div>`).join('')}</div></div>`;
 return `<p>ตั้งค่ารูปแบบเฉพาะ <b>${isH?'หน้าแรก':E(p.title)}</b> เลือกใช้เป็นรายหน้า และเว้นช่องว่างไว้ = ใช้หน้าตาเดิมของหน้านั้น (ไม่เปลี่ยนอัตโนมัติ)</p>${dbBanner()}${note}<form id="af" onsubmit="return false"><label style="display:block"><input type="checkbox" id="ps_on" name="ps_on" value="1"${o.on?' checked':''} style="width:auto"> ใช้การตั้งค่ารูปแบบเฉพาะหน้านี้ (ไม่เลือก = ใช้หน้าตาเดิม)</label>${psInputs(key,o)}<p><small>บนจอแคบ ระบบลดจำนวนการ์ดต่อแถวให้อัตโนมัติ และจำกัดขนาดหัวข้อไม่ให้ล้นจอ</small></p><h3>ตัวอย่างก่อนบันทึก</h3>${sample}<p><button type="button" class="btn b" onclick="psSave()">บันทึก</button> <button type="button" class="btn" onclick="psClear()">ล้างค่าทั้งหมด (ใช้หน้าตาเดิม)</button> <a class="btn" href="${E(link)}">เปิดหน้านี้เพื่อดูผลจริง</a></p><p><small>ล้างค่าแล้วต้องกดบันทึกอีกครั้งจึงจะมีผลกับเว็บไซต์</small></p></form>`}
function psRead(d){const o={};PS_K.forEach(k=>{if(d.has('ps_'+k))o[k]=psVal(d.get('ps_'+k),k)});return o}
function psPrev(){const f=$('af'),el=$('pv_ps');if(!f||!el)return;const b=psBuild(psRead(new FormData(f)));if(b.ds)el.setAttribute('data-s',b.ds);else el.removeAttribute('data-s');el.setAttribute('style',b.st)}
function psClear(){PS_K.forEach(k=>{const e=$('ps_'+k);if(e)e.value=''});psPrev()}
async function psSave(){const f=$('af'),key=WC.psScope;if(!f||!key||key==='site')return;if(!DBH)return say(dbOff(),false);const d=new FormData(f),all=Object.assign({},getSet().pagestyle||{}),old=all[key]||{},nw=Object.assign({},old,psRead(d),{on:!!d.get('ps_on')});
 PS_K.forEach(k=>{if(nw[k]===''||nw[k]==null)delete nw[k]});all[key]=nw;const ids=new Set(getPages().map(p=>p.id));Object.keys(all).forEach(k=>{if(k!=='home'&&!ids.has(k))delete all[k]});
 try{await putDoc('settings',Object.assign({},getSH('settings')||{},{pagestyle:all}));say('บันทึกรูปแบบเฉพาะหน้าเรียบร้อย ผู้เข้าชมเห็นทันที')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
function typoAdmin(){const sc=WC.psScope||'site';return `<h1>ตั้งค่าตัวอักษร</h1>${psScopeBar()}${sc==='site'?typoSite():psAdmin(sc)}`}
function fqMig(it){if(isPpl(WC.fqEnt))pplMig(it);const sp=s=>String(s||'').split(/\n+/).map(x=>x.replace(/^\s*(?:[-•·]|\d+[.)])\s*/,'').trim()).filter(Boolean);
 if(!Array.isArray(it.blocks))it.blocks=[];
 
 }
/* แผนการศึกษา: ชั้นปี → ภาคการศึกษา → รายวิชา */
const fqIsOpen=(id,i)=>WC.fqo&&id in WC.fqo?WC.fqo[id]:i===0;
/* ตัวช่วยรายวิชา/วิชาบังคับก่อน (วิชาอ้างอิงด้วย id ของรายวิชาในแผนการศึกษาของหลักสูตรเดียวกัน) */
const fqCsAll=pl=>{const a=[];(pl||[]).forEach((y,yi)=>(y.terms||[]).forEach((t,ti)=>(t.courses||[]).forEach(c=>{if(c)a.push({c,y,t,yi,ti})})));return a};
function fqPlFilter(){const bx=$('fqpl');if(!bx)return;const q=(WC.fqq||'').trim().toLowerCase(),k=WC.fqk||'',yf=WC.fqyf||'',tf=WC.fqtf||'',on=!!(q||k||yf||tf);let hit=0;
 bx.querySelectorAll('.fqcr').forEach(r=>{const v=f=>{const x=r.querySelector('[data-f="'+f+'"]');return x?x.value:''};const yy=r.closest('details.fqy'),tt=r.closest('details.fqt');const ok=(!q||(v('code')+' '+v('name')+' '+v('en')).toLowerCase().includes(q))&&(!k||v('ty')===k)&&(!yf||(yy&&yy.dataset.y===yf))&&(!tf||(tt&&tt.dataset.tn===tf));r.hidden=!ok;if(ok)hit++});
 const cnt=d=>[...d.querySelectorAll('.fqcr')].filter(r=>!r.hidden).length;
 bx.querySelectorAll('details.fqt').forEach(t=>{const n=cnt(t);t.hidden=on&&!n;if(on&&n)t.open=true});
 bx.querySelectorAll('details.fqy').forEach(y=>{const n=cnt(y);y.hidden=on&&!n;if(on&&n)y.open=true});
 const m=$('fqqn');if(m)m.textContent=on?(hit?'พบ '+hit+' รายวิชา':'ไม่พบรายวิชาที่ตรงกัน'):''}
/* อ่านค่าจากฟอร์มกลับเข้า state (เรียกจาก fqSync) */
function fqSyncX(ent,it,d,g){const has=n=>d.has(n);
 {const lk=ent==='programs'?['reqList','careerList']:ent==='majors'?['suitableFor']:[];lk.forEach(k=>{if(Array.isArray(it[k]))it[k]=it[k].map((v,i)=>has('ls_'+k+'_'+i)?g('ls_'+k+'_'+i):v)})}
 (it.blocks||[]).forEach(b=>{const n=s=>'bk_'+b.id+'_'+s;
  if(has(n('lv')))b.level=['2','3','4'].includes(d.get(n('lv')))?d.get(n('lv')):'2';
  if(has(n('tx')))b.text=g(n('tx'));if(has(n('url')))b.url=g(n('url'));if(has(n('cp')))b.caption=g(n('cp'));if(has(n('ti')))b.title=g(n('ti'));
  if(has(n('st')))b.style=d.get(n('st'))==='number'?'number':'bullet';
  if(has(n('it')))b.items=String(d.get(n('it'))||'').split(/\n/).map(x=>STRIP(x).trim()).filter(Boolean)});
 
 }
/* ตรวจและทำความสะอาดก่อนบันทึก: คืนข้อความผิดพลาดหรือ '' */
function fqClean(ent,it){if(isPpl(ent)){if(Array.isArray(it.pages)){const ok=new Set(getPages().map(x=>x.id));it.pages=[...new Set(it.pages.filter(id=>typeof id==='string'&&ok.has(id)))]}if(!fqPT().some(t=>t.id===it.typeId))return 'ประเภทบุคลากรไม่ถูกต้อง';if(it.typeId==='pt_exec'){it.groupId='';it.departmentId=''}else{if(it.groupId&&!fqPG().some(g=>g.id===it.groupId))return 'กลุ่มสาระไม่ถูกต้อง';if(it.departmentId&&!fqPD().some(d=>d.id===it.departmentId))return 'ฝ่ายงานไม่ถูกต้อง'}}
 if(ent==='ptypes'||ent==='pgroups'||ent==='pdepartments'){it.name=String(it.name||'').trim();if(!it.name)return 'กรุณากรอกชื่อ';if(it.name.length>80)return 'ชื่อต้องไม่เกิน 80 ตัวอักษร'}if(ent==='cposts')return cpClean(it);if(ent==='news')return nwClean(it);
 
 
 return ''}
const fqBlkOk=b=>b&&(b.type==='divider'||(b.type==='heading'&&b.text)||(b.type==='text'&&b.text)||(b.type==='image'&&b.url)||(b.type==='list'&&(b.items||[]).length)||(b.type==='group'&&(b.title||b.text)));

/* ===== หน้าเว็บ: ตัวช่วยแสดงผล ===== */
const fqUl=(a,ord)=>{const x=(a||[]).filter(Boolean);if(!x.length)return '';const t=ord?'ol':'ul';return `<${t} class="fqli">${x.map(i=>`<li>${E(i)}</li>`).join('')}</${t}>`};
const fqSecH=(t,b)=>b?`<section class="fqs"><h2>${E(t)}</h2>${b}</section>`:'';
const fqTx=s=>s?`<p class="pl">${E(s)}</p>`:'';
function fqBlocksHtml(bs){return (bs||[]).map(b=>{if(!b)return '';
 if(b.type==='heading'&&b.text){const l=({2:2,3:3,4:4})[+b.level]||2;return `<h${l}>${E(b.text)}</h${l}>`}
 if(b.type==='text'&&b.text)return fqTx(b.text);
 if(b.type==='image'&&okU(b.url))return `<figure class="fqfg"><img src="${E(b.url)}" alt="${E(b.caption||'')}" loading="lazy">${b.caption?`<figcaption>${E(b.caption)}</figcaption>`:''}</figure>`;
 if(b.type==='list')return fqUl(b.items,b.style==='number');
 if(b.type==='divider')return '<hr class="fqhr">';
 if(b.type==='group'&&(b.title||b.text))return `<div class="fqgp">${b.title?`<h3>${E(b.title)}</h3>`:''}${fqTx(b.text)}</div>`;
 return ''}).join('')}
const crN=c=>{const n=parseFloat(c);return Number.isFinite(n)?n:0};
/* ===== แผนการศึกษา (หน้าสาธารณะ): เลือกชั้นปี/ภาคเรียน + ค้นหาวิชา สร้างจากข้อมูล plan ของหลักสูตรโดยตรง ===== */
const PV={pid:'',y:'',t:'',q:'',all:false,open:{},m:[]};
function pvModel(plan){const idx={};fqCsAll(plan).forEach(({c})=>{idx[c.id]=c.code||c.name||''});
 return (plan||[]).map((y,yi)=>({id:y.id||'y'+yi,name:y.name||'ชั้นปีที่ '+(yi+1),note:y.note||'',terms:(y.terms||[]).map((t,ti)=>({id:t.id||'t'+ti,name:t.name||'',label:t.name||'ไม่แบ่งภาค',courses:(t.courses||[]).filter(c=>c&&(c.name||c.code||c.nameEn)&&c.show!==false).map(c=>Object.assign({},c,{preCodes:(c.pre||[]).map(id=>idx[id]).filter(Boolean)}))}))})).filter(y=>y.terms.length)}
function pvCur(){const m=PV.m,y=m.find(x=>x.id===PV.y)||m[0];if(!y)return {y:null,t:null};const t=y.terms.find(x=>x.id===PV.t)||y.terms[0];PV.y=y.id;PV.t=t.id;return {y,t}}
const pvMatch=(c,q)=>!q||[c.code,c.name,c.nameEn].some(v=>String(v||'').toLowerCase().includes(q));
const pvSum=cs=>{const n=cs.reduce((s,c)=>s+crN(c.credits),0);return n?' · หน่วยกิตรวม '+(+n.toFixed(2)):''};
function pvRow(c){const id='pc_'+(c.id||c.code||c.name),k=csTyK(c.type),pre=c.preCodes&&c.preCodes.length?c.preCodes.map(x=>`<span class="pvpc">${E(x)}</span>`).join(' '):'ไม่มี';
 const dsc=(c.desc||c.descEn)?`<details class="pvd"${PV.open[id]?' open':''} ontoggle="pvTg('${E(id)}',this.open)"><summary>คำอธิบายรายวิชา</summary><div class="pvds">${c.desc?`<p>${E(c.desc).replace(/\n/g,'<br>')}</p>`:''}${c.descEn?`<p lang="en">${E(c.descEn).replace(/\n/g,'<br>')}</p>`:''}</div></details>`:'';
 return `<tr><td data-l="รหัสวิชา" class="pvcd">${E(c.code)||'-'}</td><td data-l="ชื่อวิชา (ไทย)"><div>${E(c.name)||'-'}${dsc}</div></td><td data-l="ชื่อวิชา (English)" lang="en">${E(c.nameEn)||'-'}</td><td data-l="หน่วยกิต" class="pvn">${E(c.credits)||'-'}</td><td data-l="ประเภทวิชา"><span class="tag pvk-${k}">${E(csTy(k))}</span></td><td data-l="วิชาบังคับก่อน">${pre}</td></tr>`}
const pvTable=cs=>`<div class="pvtw"><table class="pvt"><thead><tr><th scope="col">รหัสวิชา</th><th scope="col">ชื่อวิชา (ไทย)</th><th scope="col">ชื่อวิชา (English)</th><th scope="col" class="pvn">หน่วยกิต</th><th scope="col">ประเภทวิชา</th><th scope="col">วิชาบังคับก่อน</th></tr></thead><tbody>${cs.map(pvRow).join('')}</tbody></table></div>`;
function pvYears(){const {y}=pvCur(),a=PV.all;return PV.m.length>1?`<div class="pvtb" role="group" aria-label="เลือกชั้นปี">${PV.m.map(x=>`<button type="button" class="pvb${!a&&y&&x.id===y.id?' on':''}" aria-pressed="${!a&&y&&x.id===y.id}" onclick="pvY('${E(x.id)}')">${E(x.name)}</button>`).join('')}</div>`:''}
function pvTerms(){const {y,t}=pvCur(),a=PV.all;return y&&(y.terms.length>1||y.terms[0].name)?`<div class="pvtb" role="group" aria-label="เลือกภาคเรียน">${y.terms.map(x=>`<button type="button" class="pvb${!a&&x.id===t.id?' on':''}" aria-pressed="${!a&&x.id===t.id}" onclick="pvT('${E(x.id)}')">${E(x.label)}</button>`).join('')}</div>`:''}
function pvList(){const q=PV.q.trim().toLowerCase(),{y,t}=pvCur();if(!y)return '';
 const clr=`<button type="button" class="btn s" onclick="pvClr()">ล้างคำค้น</button>`;
 if(PV.all){let hit=0,tot=0;const g=PV.m.map(yy=>yy.terms.map(tt=>{tot+=tt.courses.length;const cs=tt.courses.filter(c=>pvMatch(c,q));hit+=cs.length;return cs.length?`<h4>${E(yy.name)}${tt.name?' › '+E(tt.name):''}</h4>${pvTable(cs)}`:''}).join('')).join('');
  return `<p class="evm" role="status">${q?'พบ '+hit+' จาก '+tot+' รายวิชาทั้งหลักสูตร':'ทั้งหมด '+tot+' รายวิชา'}</p>${hit?g:`<p class="pve">${tot?`ไม่พบรายวิชาที่ตรงกับ “${E(PV.q.trim())}” ${clr}`:'ยังไม่มีข้อมูลรายวิชาในหลักสูตรนี้'}</p>`}`}
 const cs=t.courses.filter(c=>pvMatch(c,q)),title=E(y.name)+(t.name?' · '+E(t.name):'');
 const info=q?`พบ ${cs.length} จาก ${t.courses.length} รายวิชา`:`${t.courses.length} รายวิชา${pvSum(t.courses)}`;
 return `<h3 class="pvh">${title}</h3><p class="evm" role="status">${info}</p>${y.note?`<p class="pl">${E(y.note)}</p>`:''}${cs.length?pvTable(cs):`<p class="pve">${q?`ไม่พบรายวิชาที่ตรงกับ “${E(PV.q.trim())}” ในภาคการศึกษานี้ ${clr}`:'ยังไม่มีข้อมูลรายวิชาในภาคการศึกษานี้'}</p>`}`}
function fqPlanHtml(plan,pid){if(PV.pid!==pid){PV.pid=pid;PV.y='';PV.t='';PV.q='';PV.all=false;PV.open={}}
 PV.m=pvModel(plan);if(!PV.m.length)return (plan||[]).length?'<p class="evm">ยังไม่มีข้อมูลรายวิชาในแผนการศึกษา</p>':'';
 return `<div class="plv"><div class="pvbar"><div id="pvys">${pvYears()}</div><div id="pvts">${pvTerms()}</div><div class="pvsr"><input id="pvq" type="search" placeholder="ค้นหารหัสวิชา ชื่อไทย หรือชื่ออังกฤษ" aria-label="ค้นหารายวิชา" autocomplete="off" value="${E(PV.q)}" oninput="pvQ(this.value)"><button type="button" class="btn s" onclick="pvClr()" aria-label="ล้างคำค้น">ล้าง</button></div><label class="pvck"><input id="pvall" type="checkbox"${PV.all?' checked':''} onchange="pvAll(this.checked)"> ค้นหาทั้งหลักสูตร (ทุกชั้นปีและภาคเรียน)</label></div><div id="pvls">${pvList()}</div></div>`}
function pvDraw(){const f=(id,h)=>{const e=$(id);if(e)e.innerHTML=h};f('pvys',pvYears());f('pvts',pvTerms());f('pvls',pvList());const a=$('pvall');if(a)a.checked=PV.all}
function pvY(id){const o=(PV.m.find(x=>x.id===PV.y)||{}).terms,lb=o&&(o.find(x=>x.id===PV.t)||{}).label,y=PV.m.find(x=>x.id===id);PV.all=false;PV.y=id;PV.t=y&&(y.terms.find(x=>x.label===lb)||y.terms[0]).id;pvDraw()}
function pvT(id){PV.all=false;PV.t=id;pvDraw()}
function pvQ(v){PV.q=v||'';pvDraw()}
function pvClr(){PV.q='';const i=$('pvq');if(i){i.value='';i.focus()}pvDraw()}
function pvAll(on){PV.all=!!on;pvDraw()}
function pvTg(id,o){if(o)PV.open[id]=1;else delete PV.open[id]}
function fqTuiBox(p){const n=fqTui(p);return n!=null?`<div class="fqtu" aria-label="ค่าเล่าเรียน"><p class="fqtv"><span class="fqtul">ค่าเล่าเรียน</span> <b>${E(fqBaht(n))}</b> <span class="fqtn">บาท/ภาคการศึกษา</span></p></div>`:`<div class="fqtu fqtu0"><p class="fqtv">ยังไม่ระบุค่าเล่าเรียน</p></div>`}
function progDetail(id){const D=fqPub(),p=D.P.find(x=>x.id===id);
 if(!p)return ('<div class="w sec"><h1>ไม่พบหลักสูตรนี้</h1><p>อาจยังไม่เผยแพร่หรือถูกลบแล้ว</p><p><a class="bk" href="#/">← กลับหน้าแรก</a></p></div>');
 const m=D.M.find(x=>x.id===p.majorId),f=m&&D.F.find(x=>x.id===m.facultyId),t=tyFac(f),req=(p.reqList||[]).filter(Boolean),car=(p.careerList||[]).filter(Boolean),
 info=[['ระดับการศึกษา',fqLv(p.level)],['ระยะเวลาศึกษา',p.duration],['จำนวนหน่วยกิตรวม',p.credits?p.credits+' หน่วยกิต':''],['สาขาวิชา',m&&m.nameTh],['คณะ/วิทยาลัย',f&&f.nameTh],['สถานะการรับสมัคร',p.open==='open'?'เปิดรับสมัคร':'ปิดรับสมัคร']].filter(x=>x[1]),
 so=(p.objectives?`<h3>วัตถุประสงค์ของหลักสูตร</h3>${fqTx(p.objectives)}`:'')+(p.outcomes?`<h3>ผลลัพธ์การเรียนรู้ที่คาดหวัง</h3>${fqTx(p.outcomes)}`:''),
 sections=[fqSecH('คำอธิบายหลักสูตร',fqTx(p.desc)),fqSecH('วัตถุประสงค์และผลลัพธ์การเรียนรู้',so),fqSecH('ข้อมูลหลักสูตร',`<dl class="cmdl">${info.map(([l,v])=>`<dt>${l}</dt><dd>${E(v)}</dd>`).join('')}</dl>`),
  fqSecH('คุณสมบัติผู้สมัคร',req.length?fqUl(req):fqTx(p.requirements)),fqSecH('แผนการศึกษาและรายวิชา',fqPlanHtml(p.plan,p.id)),
  fqSecH('การฝึกงานหรือสหกิจศึกษา',fqTx(p.internship)),fqSecH('แนวทางประกอบอาชีพ',car.length?fqUl(car):fqTx(p.careers)),fqSecH('เงื่อนไขการสำเร็จการศึกษา',fqTx(p.graduation)),fqSecH('หมายเหตุเพิ่มเติม',fqTx(p.notes)),fqBlocksHtml(p.blocks)].join('');
 return (`<div class="w sec fqd ty" style="${tyStyle(t)}"><p><a class="bk" href="${f?'#/faculty/'+E(f.id):'#/'}">← กลับ${f?'หน้า'+E(f.nameTh):'หน้าแรก'}</a></p><div class="fqph"><h1>${E(p.nameTh)}</h1>${p.nameEn?`<p class="evm">${E(p.nameEn)}</p>`:''}${p.degree||p.degreeEn?`<p class="fqdg">${p.degree?E(p.degree):''}${p.degree&&p.degreeEn?' · ':''}${p.degreeEn?E(p.degreeEn):''}</p>`:''}<p><span class="tag">${E(fqLv(p.level))}</span><span class="tag">${p.open==='open'?'เปิดรับสมัคร':'ปิดรับสมัคร'}</span></p>${fqTuiBox(p)}</div>${sections}</div>`)}
PUB.program=progDetail;
/* ===== หน้ารายวิชาทั้งหมด (ผู้เข้าชม) =====
   ไม่มีตารางรายวิชาใหม่: อ่านจากข้อมูลเดิม programs[].plan[].terms[].courses[] ผ่าน fqPub() (ต้องเผยแพร่ทุกระดับ) แล้วรวมตามรหัสวิชาแบบเดียวกับ cqIndex ของหลังบ้าน
   แสดงเฉพาะรายวิชาที่มีรหัส และไม่ได้ซ่อน (show!==false) อ่านอย่างเดียว ไม่เขียนกลับฐานข้อมูล
   เตรียมต่อยอด: แต่ละรายวิชามี uses[] (หลักสูตร/ชั้นปี/ภาคเรียน/ประเภท/วิชาบังคับก่อน) ใช้เป็นฐานของการลงทะเบียน ตรวจ prerequisite และตารางเรียนในอนาคต */
const CR={q:'',fac:'',maj:'',prg:'',n:30};
function crsIndex(){const D=fqPub(),mj=new Map(D.M.map(x=>[x.id,x])),fc=new Map(D.F.map(x=>[x.id,x])),M=new Map();
 D.P.forEach(p=>{const m=mj.get(p.majorId),f=m&&fc.get(m.facultyId),all=fqCsAll(p.plan),cd=new Map(all.map(({c})=>[c.id,c.code||c.name||'']));
  all.forEach(({c,y,t,yi,ti})=>{if(!c||c.show===false)return;const k=cqNorm(c.code);if(!k)return;
   let e=M.get(k);if(!e){e={key:k,uses:[]};CQ_F.forEach(x=>e[x]='');M.set(k,e)}
   CQ_F.forEach(x=>{if(!e[x]&&c[x])e[x]=c[x]});
   e.uses.push({p,m,f,c,y,t,yi,ti,pre:(c.pre||[]).map(id=>cd.get(id)).filter(Boolean)})})});
 return M}
const crsUrl=e=>'#/course/'+encodeURIComponent(e.key);
function crsBack(){const lp=getPages().find(p=>p.status==='published'&&(p.sections||[]).some(s=>s.type==='courses'));return lp?'#/p/'+lp.slug:'#/courses'}
function crsOpts(){const us=[...crsIndex().values()].flatMap(e=>e.uses),F=new Map(),Mm=new Map(),P=new Map(),by=(a,b)=>String(a.nameTh||'').localeCompare(String(b.nameTh||''),'th');
 us.forEach(u=>{if(u.f)F.set(u.f.id,u.f)});if(CR.fac&&!F.has(CR.fac))CR.fac='';
 us.forEach(u=>{if(u.m&&(!CR.fac||(u.f&&u.f.id===CR.fac)))Mm.set(u.m.id,u.m)});if(CR.maj&&!Mm.has(CR.maj))CR.maj='';
 us.forEach(u=>{if((!CR.fac||(u.f&&u.f.id===CR.fac))&&(!CR.maj||(u.m&&u.m.id===CR.maj)))P.set(u.p.id,u.p)});if(CR.prg&&!P.has(CR.prg))CR.prg='';
 return {F:[...F.values()].sort(by),M:[...Mm.values()].sort(by),P:[...P.values()].sort(by)}}
function crsFilter(){const q=CR.q.trim().toLowerCase(),qn=cqNorm(CR.q);
 return [...crsIndex().values()].filter(e=>(!q||[e.code,e.name,e.nameEn].some(v=>String(v||'').toLowerCase().includes(q))||(qn&&cqNorm(e.code).includes(qn)))&&(!(CR.fac||CR.maj||CR.prg)||e.uses.some(u=>(!CR.fac||(u.f&&u.f.id===CR.fac))&&(!CR.maj||(u.m&&u.m.id===CR.maj))&&(!CR.prg||u.p.id===CR.prg)))).sort((a,b)=>a.key.localeCompare(b.key))}
const crsOp=(cur,v,t)=>`<option value="${E(v)}"${cur===v?' selected':''}>${E(t)}</option>`;
function crsRow(e){const ps=[...new Map(e.uses.map(u=>[u.p.id,u.p])).values()],u=crsUrl(e),pn=ps.slice(0,2).map(p=>E(p.nameTh)).join('<br>')+(ps.length>2?`<br><small>และอีก ${ps.length-2} หลักสูตร</small>`:'');
 return `<tr><td data-l="รหัสวิชา" class="pvcd"><a href="${E(u)}">${E(e.code)}</a></td><td data-l="ชื่อวิชา (ไทย)"><a href="${E(u)}">${E(e.name)||'-'}</a></td><td data-l="ชื่อวิชา (English)" lang="en">${E(e.nameEn)||'-'}</td><td data-l="หน่วยกิต" class="pvn">${E(e.credits)||'-'}</td><td data-l="หลักสูตรที่ใช้วิชานี้">${pn}</td></tr>`}
function crsList(){const L=crsFilter(),vis=L.slice(0,CR.n),on=CR.q.trim()||CR.fac||CR.maj||CR.prg;
 if(!L.length)return `<div class="empty-ev" role="status"><b>ไม่พบรายวิชาที่ตรงกับเงื่อนไข</b><br>ลองเปลี่ยนคำค้นหรือตัวกรอง${on?' · <button type="button" class="btn s" onclick="crsClr()">ล้างการค้นหาและตัวกรอง</button>':''}</div>`;
 return `<p class="evm" role="status" aria-live="polite">${on?'พบ '+L.length+' รายวิชา':'ทั้งหมด '+L.length+' รายวิชา'}</p><div class="pvtw"><table class="pvt crt"><thead><tr><th scope="col">รหัสวิชา</th><th scope="col">ชื่อวิชา (ไทย)</th><th scope="col">ชื่อวิชา (English)</th><th scope="col" class="pvn">หน่วยกิต</th><th scope="col">หลักสูตรที่ใช้วิชานี้</th></tr></thead><tbody>${vis.map(crsRow).join('')}</tbody></table></div>${L.length>vis.length?`<p style="text-align:center"><button type="button" class="btn" onclick="crsMore()">แสดงเพิ่ม (เหลืออีก ${L.length-vis.length} รายวิชา)</button></p>`:''}`}
function crsFields(){const o=crsOpts();
 return `<div class="crf"><div><label for="crfa">คณะ/วิทยาลัย</label><select id="crfa" onchange="crsSet('fac',this.value)">${crsOp(CR.fac,'','ทุกคณะ')}${o.F.map(f=>crsOp(CR.fac,f.id,f.nameTh)).join('')}</select></div><div><label for="crmj">สาขาวิชา</label><select id="crmj" onchange="crsSet('maj',this.value)">${crsOp(CR.maj,'','ทุกสาขาวิชา')}${o.M.map(m=>crsOp(CR.maj,m.id,m.nameTh)).join('')}</select></div><div><label for="crpg">หลักสูตร</label><select id="crpg" onchange="crsSet('prg',this.value)">${crsOp(CR.prg,'','ทุกหลักสูตร')}${o.P.map(p=>crsOp(CR.prg,p.id,p.nameTh+' ('+fqLv(p.level)+')')).join('')}</select></div></div>`}
function crsView(){if(!crsIndex().size)return `<div class="fq"><div class="empty-ev"><b>ยังไม่มีข้อมูลรายวิชา</b><br>กรุณากลับมาใหม่ภายหลัง</div></div>`;
 crsOpts();
 return `<div class="fq ty" style="${tyStyle(tyGet(null))}"><div class="cmt" role="search"><input id="crq" type="search" placeholder="ค้นหารหัสวิชาหรือชื่อวิชา เช่น ENG101 หรือ แคลคูลัส" value="${E(CR.q)}" oninput="crsQ(this.value)" aria-label="ค้นหารหัสวิชาหรือชื่อวิชา" autocomplete="off"></div><div id="crfs">${crsFields()}</div><div id="crl">${crsList()}</div></div>`}
function crsDraw(f){const a=$('crl');if(a)a.innerHTML=crsList();if(f){const b=$('crfs');if(b)b.innerHTML=crsFields()}}
function crsQ(v){CR.q=v||'';CR.n=30;crsDraw()}
function crsSet(k,v){CR[k]=v;if(k==='fac'){CR.maj='';CR.prg=''}if(k==='maj')CR.prg='';CR.n=30;crsDraw(1);const e=$({fac:'crfa',maj:'crmj',prg:'crpg'}[k]);if(e)e.focus()}
function crsMore(){CR.n+=30;crsDraw()}
function crsClr(){CR.q='';CR.fac='';CR.maj='';CR.prg='';CR.n=30;const i=$('crq');if(i)i.value='';crsDraw(1);if(i)i.focus()}
function crsDetail(raw){let k='';try{k=cqNorm(decodeURIComponent(raw||''))}catch(er){}
 const e=k&&crsIndex().get(k),bk=`<p><a class="bk" href="${E(crsBack())}">← กลับหน้ารายวิชาทั้งหมด</a></p>`;
 if(!e)return `<div class="w sec">${bk}<h1>ไม่พบรายวิชานี้</h1><p>อาจยังไม่เผยแพร่ ถูกซ่อน หรือถูกลบแล้ว</p></div>`;
 const idx=crsIndex(),lk=c=>{const t=idx.get(cqNorm(c));return t?`<a class="pvpc" href="${E(crsUrl(t))}">${E(c)}</a>`:`<span class="pvpc">${E(c)}</span>`},
 pre=[...new Set(e.uses.flatMap(u=>u.pre))],
 info=[['รหัสวิชา',e.code],['ชื่อวิชา (ไทย)',e.name],['ชื่อวิชา (English)',e.nameEn],['หน่วยกิต',e.credits]].filter(x=>x[1]),
 use=u=>{const pos=[u.y&&(u.y.name||'ชั้นปีที่ '+(u.yi+1)),u.t&&u.t.name].filter(Boolean).join(' · ');
  return `<a class="fqpr" href="#/program/${E(u.p.id)}"><span class="fqpn"><b>${E(u.p.nameTh)}</b><small>${E([u.f&&u.f.nameTh,u.m&&u.m.nameTh].filter(Boolean).join(' › '))}</small></span><span class="fqpt"><span class="tag">${E(fqLv(u.p.level))}</span><span class="tag">${E(csTy(u.c.type))}</span>${pos?`<span class="tag">${E(pos)}</span>`:''}</span><span class="fqpu">วิชาบังคับก่อน: ${u.pre.length?u.pre.map(x=>E(x)).join(', '):'ไม่มี'}</span><span class="fqpm">ดูหลักสูตร →</span></a>`};
 return `<div class="w sec fqd ty" style="${tyStyle(tyGet(null))}">${bk}<div class="fqph"><p class="evm">${E(e.code)}</p><h1>${E(e.name||e.nameEn||e.code)}</h1>${e.name&&e.nameEn?`<p class="evm" lang="en">${E(e.nameEn)}</p>`:''}${e.credits?`<p><span class="tag">${E(e.credits)} หน่วยกิต</span></p>`:''}</div>${fqSecH('ข้อมูลรายวิชา',`<dl class="cmdl">${info.map(([l,v])=>`<dt>${l}</dt><dd>${E(v)}</dd>`).join('')}</dl>`)}${fqSecH('คำอธิบายรายวิชา',fqTx(e.desc)+(e.descEn?`<p class="pl" lang="en">${E(e.descEn)}</p>`:''))}${fqSecH('รายวิชาบังคับก่อน',pre.length?`<p>${pre.map(lk).join(' ')}</p>`:'')}${fqSecH('หลักสูตรและสาขาที่เกี่ยวข้อง',`<div class="fqpl">${e.uses.map(use).join('')}</div>`)}</div>`}
PUB.courses=()=>`<div class="w sec"><h1>รายวิชาทั้งหมด</h1>${crsView()}</div>`;
PUB.course=crsDetail;

/* ===== ชมรมนักศึกษา: site_docs 'clubcats' (หมวดหมู่) และ 'clubs' (ชมรม) เชื่อมกันด้วย clubs[].catId — ไม่มีตารางใหม่ แก้หมวดหมู่ได้จากหลังบ้านโดยไม่แก้โค้ด
   ค้นหา/กรองทำในเบราว์เซอร์จากข้อมูลที่โหลดมาแล้ว (ไม่เรียกฐานข้อมูลเพิ่ม) ชมรมที่หมวดถูกซ่อนจะอยู่ในกลุ่ม "ไม่ระบุหมวดหมู่"
   เตรียมต่อยอดสมัครสมาชิก: clubs[].id คงที่ ใช้เป็นคีย์อ้างอิงของตารางสมาชิกในอนาคตได้ (ยังไม่พัฒนาระบบสมัคร/อนุมัติ/กิจกรรมในรอบนี้) ===== */
const CLUB_CATS0=['วิชาการและการเรียนรู้','กีฬาและนันทนาการ','ศิลปะ ดนตรี และการแสดง','เทคโนโลยีและนวัตกรรม','อาสาสมัครและสังคม','วัฒนธรรมและประเพณี','สิ่งแวดล้อม','งานอดิเรกและความสนใจทั่วไป'];
const CL={key:null,q:'',c:''};
const clubMakePage=()=>secPageMake('clubs','ชมรมนักศึกษา','clubs');
const clubSeedBox=()=>`<div class="msg er">ยังไม่มีหมวดหมู่ชมรม</div><p><button type="button" class="btn b" onclick="clubSeed()">เพิ่มหมวดหมู่เริ่มต้น ${CLUB_CATS0.length} หมวด</button> <small>เพิ่มได้เฉพาะเมื่อยังไม่มีหมวดหมู่ และแก้ไขชื่อ/ลบ/เพิ่มหมวดเองได้ภายหลัง</small></p>`;
async function clubSeed(){if(!DBH)return say(dbOff(),false);
 try{const {data,error}=await SB.from('site_docs').select('data').eq('key','clubcats').maybeSingle();if(error)throw error;
  if((data&&Array.isArray(data.data)&&data.data.length)||fqCC().length)return say('มีหมวดหมู่อยู่แล้ว จึงไม่เพิ่มซ้ำหรือเขียนทับ',false);
  await putDoc('clubcats',CLUB_CATS0.map(n=>({id:mkId('cc'),name:n,status:'published'})));say('เพิ่มหมวดหมู่เริ่มต้นแล้ว')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
const clAll=()=>fqCL().filter(fqIsPub);
const clCats=()=>fqCC().filter(fqIsPub);
const clCat=c=>clCats().find(x=>x.id===c.catId)||null;
const clNorm=s=>String(s==null?'':s).toLowerCase().replace(/\s+/g,'');
const clHay=c=>{const ct=clCat(c);return clNorm([c.name,c.brief,c.about,c.activities,c.keywords,ct&&ct.name].join(' '))};
const clMatch=c=>{if(CL.c&&(CL.c==='-'?clCat(c):c.catId!==CL.c))return false;const q=clNorm(CL.q);return !q||clHay(c).includes(q)};
const clLines=v=>String(v==null?'':v).split(/\n+/).map(x=>x.trim()).filter(Boolean);
function clChan(l){const m=l.match(/https:\/\/[^\s<>"]+/);if(m){const u=m[0],lb=l.slice(0,m.index).replace(/[\s:：\-–]+$/,'').trim()||u.replace(/^https:\/\//,'');return `<a href="${E(u)}" target="_blank" rel="noopener noreferrer">${E(lb)} ${ic('ext')}<span class="sr">(เปิดในแท็บใหม่)</span></a>`}
 const e=l.match(/[^\s@:：]+@[^\s@]+\.[^\s@]+/);if(e)return `${E(l.slice(0,e.index).trim())} <a href="mailto:${E(e[0])}">${E(e[0])}</a>`.trim();return E(l)}
const clubCard=c=>{const ct=clCat(c),im=okU(c.logo)?c.logo:'';return `<a class="card clc" href="#/club/${E(c.id)}"><div class="clm${im?'':' clp'}"${im?'':' aria-hidden="true"'}>${im?`<img src="${E(im)}" alt="" loading="lazy">`:kitMark(40)}</div><div class="p">${ct?`<span class="tag">${E(ct.name)}</span>`:''}<h3>${E(c.name)}</h3>${c.brief?`<p class="pl">${E(c.brief)}</p>`:''}</div></a>`};
function clBody(){const L=clAll().filter(clMatch),on=CL.q.trim()||CL.c;
 return `<p class="evm" aria-live="polite">${on?'พบ '+L.length+' ชมรม':''}</p>${L.length?`<div class="grid">${L.map(clubCard).join('')}</div>`:`<div class="empty-ev"><b>ไม่พบชมรมที่ตรงกับเงื่อนไข</b><br>ลองเปลี่ยนคำค้นหาหรือเลือกหมวดหมู่อื่น${on?'<br><button type="button" class="btn s" onclick="clReset()">แสดงชมรมทั้งหมด</button>':''}</div>`}`}
function clRefresh(){const b=$('clb');if(b)b.innerHTML=clBody();document.querySelectorAll('.clchip').forEach(x=>{const on=x.dataset.v===CL.c;x.classList.toggle('on',on);x.setAttribute('aria-pressed',String(on))})}
function clFilter(){const i=$('clq');CL.q=i?i.value:'';clRefresh()}
function clSet(v){CL.c=CL.c===v&&v!==''?'':v;clRefresh()}
function clReset(){CL.q='';CL.c='';const i=$('clq');if(i)i.value='';clRefresh()}
function clubView(){if(CL.key!==location.hash){CL.key=location.hash;CL.q='';CL.c=''}
 const all=clAll();if(!all.length)return `<div class="fq"><div class="empty-ev"><b>ยังไม่มีข้อมูลชมรมนักศึกษา</b><br>${Auth.canAccessAdmin()?'<a href="#/admin/clubs">เพิ่มข้อมูลที่หลังบ้าน</a>':'กรุณากลับมาใหม่ภายหลัง'}</div></div>`;
 const cats=clCats().filter(ct=>all.some(c=>c.catId===ct.id)),unc=all.some(c=>!clCat(c)),chip=(v,t)=>`<button type="button" class="cmc clchip${CL.c===v?' on':''}" data-v="${E(v)}" aria-pressed="${CL.c===v}" onclick="clSet('${E(v)}')">${E(t)}</button>`;
 return `<div class="fq"><div class="cmt"><input id="clq" type="search" placeholder="ค้นหาชื่อชมรม คำอธิบาย หรือคำสำคัญ" value="${E(CL.q)}" oninput="clFilter()" aria-label="ค้นหาชื่อชมรม คำอธิบาย หรือคำสำคัญ" autocomplete="off"></div>${cats.length?`<div class="cmcs" role="group" aria-label="กรองตามหมวดหมู่">${chip('','แสดงชมรมทั้งหมด')}${cats.map(ct=>chip(ct.id,ct.name)).join('')}${unc?chip('-','ไม่ระบุหมวดหมู่'):''}</div>`:''}<div id="clb">${clBody()}</div></div>`}
function clubDetail(id){const c=clAll().find(x=>x.id===id),lp=getPages().find(p=>p.status==='published'&&(p.sections||[]).some(s=>s.type==='clubs')),back=lp?'#/p/'+lp.slug:'#/';
 if(!c)return `<div class="w sec"><h1>ไม่พบชมรมนี้</h1><p>อาจยังไม่เผยแพร่หรือถูกลบแล้ว</p><p><a class="bk" href="${E(back)}">← กลับหน้ารวมชมรม</a></p></div>`;
 const ct=clCat(c),acts=clLines(c.activities),ch=clLines(c.contact),sec=(t,h)=>h?`<section class="fqs"><h2>${t}</h2>${h}</section>`:'';
 const body=sec('เกี่ยวกับชมรม',(c.about||c.brief)?`<p class="pl">${E(c.about||c.brief)}</p>`:'')+sec('กิจกรรมหลัก',acts.length?`<ul class="cll">${acts.map(a=>`<li>${E(a)}</li>`).join('')}</ul>`:'')+sec('ช่องทางติดต่อและติดตาม',ch.length?`<ul class="cll clch">${ch.map(l=>`<li>${clChan(l)}</li>`).join('')}</ul>`:'');
 return `<div class="w sec fqd ty" style="${tyStyle(tyGet(null))}"><p><a class="bk" href="${E(back)}">← กลับหน้ารวมชมรม</a></p><div class="fqh">${okU(c.logo)?`<img class="fql" src="${E(c.logo)}" alt="โลโก้ ${E(c.name)}">`:''}<div>${ct?`<p class="evm">${E(ct.name)}</p>`:''}<h1>${E(c.name)}</h1></div></div>${body||'<p class="evm">ยังไม่มีรายละเอียดเพิ่มเติม</p>'}</div>`}
PUB.club=clubDetail;
/* ===== Admin: คณะและหลักสูตร (ตัวจัดการกลางใช้ร่วมกันทั้ง 4 ระดับ) ===== */
const PEND={path:'',files:{}};
const AFV={group:'',faculty:'',major:''};
const FQN={open:false};
const fqName=(arr,id,k)=>{const x=arr.find(y=>y.id===id);return x?x[k||'nameTh']||x.name||'':''};
const PT0=[{id:'pt_exec',name:'คณะผู้บริหาร',status:'published'},{id:'pt_staff',name:'อาจารย์และบุคลากร',status:'published'}],PG0=[['pg_th','ภาษาไทย'],['pg_ma','คณิตศาสตร์'],['pg_sc','วิทยาศาสตร์และเทคโนโลยี'],['pg_so','สังคมศึกษา ศาสนา และวัฒนธรรม'],['pg_he','สุขศึกษาและพลศึกษา'],['pg_ar','ศิลปะ'],['pg_wk','การงานอาชีพ'],['pg_fl','ภาษาต่างประเทศ']].map(([id,name])=>({id,name,status:'published'}));
const ptArr=(k,d)=>{const v=getSH(k);return Array.isArray(v)?v.filter(x=>x&&x.id):d.map(x=>Object.assign({},x))};
const PD0=[['pd_ac','ฝ่ายวิชาการ'],['pd_st','ฝ่ายกิจการนักเรียน'],['pd_ge','ฝ่ายบริหารงานทั่วไป']].map(([id,name])=>({id,name,status:'published'}));
const fqPT=()=>ptArr('ptypes',PT0),fqPG=()=>ptArr('pgroups',PG0),fqPD=()=>ptArr('pdepartments',PD0);
const PPL_LOCK=['pt_exec','pt_staff'],isPpl=e=>e==='pexec'||e==='pstaff';
/* ประเภทของบุคลากร: ไม่มี typeId (ข้อมูลเดิม) หรือประเภทไม่มีแล้ว → นับเป็น 'อาจารย์และบุคลากร' โดยไม่แก้ข้อมูลเดิม */
const pplTy=p=>fqPT().some(t=>t.id===p.typeId)?p.typeId:'pt_staff';
const pplUse=(arr,id,k)=>arr.filter(x=>k==='typeId'?pplTy(x)===id:x.groupId===id);
const pplOpt=(a)=>a.map(x=>[x.id,x.name+(fqIsPub(x)?'':' (ปิดใช้งาน)')]);
/* ตั้งค่าหัวข้อแบ่งหมวดหมู่หน้าบุคลากร: settings.pplhead = {type|dept|group: {size(px), align}} · ค่าไม่ถูกต้อง/ไม่มี → ค่าเริ่มต้น */
const PH_K=[['type','หัวข้อประเภทบุคลากร',28],['dept','หัวข้อฝ่ายงาน',22],['group','หัวข้อกลุ่มสาระ/กลุ่มงาน',18]],PH_MIN=12,PH_MAX=64,PH_AL=[['left','ชิดซ้าย'],['center','กึ่งกลาง'],['right','ชิดขวา']];
const pplHd=k=>{const d=PH_K.find(x=>x[0]===k),st=getSH('settings'),v=(st&&st.pplhead&&st.pplhead[k])||{},n=Math.round(+v.size);return {size:Number.isFinite(n)&&n>=PH_MIN&&n<=PH_MAX?n:d[2],align:PH_AL.some(a=>a[0]===v.align)?v.align:'left'}};
const pplHs=k=>{const h=pplHd(k);return 'font-size:'+h.size+'px;text-align:'+h.align};
const pplPgTxt=p=>{const L=pplPgList(),n=Array.isArray(p.pages)?p.pages.filter(id=>L.some(x=>x[0]===id)).length:pplDefPg().length;return n?'แสดง '+n+' หน้า':'ไม่ได้กำหนดหน้า'};
const pplMig=it=>{if(!it.typeId)it.typeId=WC.fqEnt==='pexec'?'pt_exec':'pt_staff'};
const FQE={
 fgroups:{one:'กลุ่มคณะ',title:'จัดการหลักสูตร',pre:'fg',get:fqG,
  blank:()=>({name:'',nameEn:'',desc:'',status:'draft'}),
  fields:[['name','ชื่อกลุ่มคณะ','text',1],['nameEn','ชื่อภาษาอังกฤษ','text'],['desc','คำอธิบายกลุ่ม','area']],
  label:g=>g.name,sub:g=>fqF().filter(f=>f.groupId===g.id).length+' คณะ/วิทยาลัย',kids:g=>fqF().filter(f=>f.groupId===g.id),kidName:'คณะ/วิทยาลัย'},
 pexec:{one:'ผู้บริหาร',title:'จัดการคณะผู้บริหาร',pre:'pp',get:fqPeople,store:'people',
  blank:()=>({first:'',last:'',position:'',photo:'',typeId:'pt_exec',groupId:'',pages:pplDefPg(),status:'draft'}),
  fields:[['first','ชื่อ','text',1],['last','นามสกุล','text',1],['position','ตำแหน่ง','text'],['typeId','ประเภทบุคลากร (เปลี่ยนเพื่อย้ายไปหมวดอื่น)','sel',1,()=>pplOpt(fqPT())],['photo','รูปถ่าย','img'],['pages','หน้าที่แสดงรายชื่อนี้','cpg',0,()=>pplPgList(),()=>pplDefPg()]],
  filter:p=>pplTy(p)==='pt_exec',
  label:p=>((p.first||'')+' '+(p.last||'')).trim(),sub:p=>[p.position||'ยังไม่ระบุตำแหน่ง',pplPgTxt(p)].join(' · '),kids:()=>[],kidName:''},
 pstaff:{one:'อาจารย์/บุคลากร',title:'จัดการอาจารย์และบุคลากร',pre:'pp',get:fqPeople,store:'people',
  blank:()=>({first:'',last:'',position:'',photo:'',typeId:'pt_staff',groupId:'',pages:pplDefPg(),status:'draft'}),
  fields:[['first','ชื่อ','text',1],['last','นามสกุล','text',1],['position','ตำแหน่ง','text'],['typeId','ประเภทบุคลากร','sel',1,()=>pplOpt(fqPT())],['departmentId','ฝ่ายงาน (ไม่บังคับ)','sel',0,()=>pplOpt(fqPD())],['groupId','กลุ่มสาระ/กลุ่มงาน (ไม่บังคับ)','sel',0,()=>pplOpt(fqPG())],['photo','รูปถ่าย','img'],['pages','หน้าที่แสดงรายชื่อนี้','cpg',0,()=>pplPgList(),()=>pplDefPg()]],
  filter:p=>pplTy(p)!=='pt_exec',
  label:p=>((p.first||'')+' '+(p.last||'')).trim(),sub:p=>[p.position||'ยังไม่ระบุตำแหน่ง',fqName(fqPT(),pplTy(p),'name'),fqName(fqPD(),p.departmentId,'name')||'ไม่ระบุฝ่าย',fqName(fqPG(),p.groupId,'name')||'ไม่ระบุกลุ่มสาระ',pplPgTxt(p)].join(' · '),kids:()=>[],kidName:''},
 ptypes:{one:'ประเภทบุคลากร',title:'จัดการประเภทบุคลากร',pre:'pt',get:fqPT,lock:t=>PPL_LOCK.includes(t.id),
  blank:()=>({name:'',status:'published'}),fields:[['name','ชื่อประเภท','text',1]],
  label:t=>t.name,sub:t=>fqPeople().filter(p=>pplTy(p)===t.id).length+' คน'+(PPL_LOCK.includes(t.id)?' · ประเภทพื้นฐาน (ลบไม่ได้ ปิดใช้งานได้)':''),kids:t=>fqPeople().filter(p=>pplTy(p)===t.id),kidName:'คน'},
 pgroups:{one:'กลุ่มสาระการเรียนรู้',title:'จัดการกลุ่มสาระการเรียนรู้',pre:'pg',get:fqPG,
  blank:()=>({name:'',status:'published'}),fields:[['name','ชื่อกลุ่มสาระ','text',1]],
  label:g=>g.name,sub:g=>fqPeople().filter(p=>p.groupId===g.id).length+' คน',kids:g=>fqPeople().filter(p=>p.groupId===g.id),kidName:'คน'},
 pdepartments:{one:'ฝ่ายงาน',title:'จัดการฝ่ายงาน',pre:'pd',get:fqPD,
  blank:()=>({name:'',status:'published'}),fields:[['name','ชื่อฝ่ายงาน','text',1]],
  label:d=>d.name,sub:d=>fqPeople().filter(p=>p.departmentId===d.id).length+' คน',kids:d=>fqPeople().filter(p=>p.departmentId===d.id),kidName:'คน'},
 clubcats:{one:'หมวดหมู่ชมรม',title:'จัดการหมวดหมู่ชมรม',pre:'cc',get:fqCC,
  blank:()=>({name:'',status:'published'}),
  fields:[['name','ชื่อหมวดหมู่','text',1]],
  label:c=>c.name,sub:c=>fqCL().filter(x=>x.catId===c.id).length+' ชมรม',kids:c=>fqCL().filter(x=>x.catId===c.id),kidName:'ชมรม'},
 clubs:{one:'ชมรม',title:'จัดการชมรมนักศึกษา',pre:'cb',get:fqCL,
  blank:()=>({name:'',catId:AFV.club&&AFV.club!=='-'?AFV.club:'',logo:'',brief:'',about:'',activities:'',contact:'',keywords:'',status:'draft'}),
  fields:[['name','ชื่อชมรม','text',1],['catId','หมวดหมู่','sel',0,()=>fqCC().map(c=>[c.id,c.name])],['logo','โลโก้หรือรูปภาพ','img'],['brief','คำอธิบายสั้น (แสดงบนการ์ด)','area'],['about','คำอธิบายชมรม','area8'],['activities','กิจกรรมหลัก (บรรทัดละ 1 รายการ)','area'],['contact','ช่องทางติดต่อหรือติดตาม (บรรทัดละ 1 ช่องทาง เช่น Facebook: https://...)','area'],['keywords','คำสำคัญสำหรับค้นหา (คั่นด้วยเครื่องหมายจุลภาค)','text']],
  filter:c=>!AFV.club||(AFV.club==='-'?!fqCC().some(x=>x.id===c.catId):c.catId===AFV.club),
  label:c=>c.name,sub:c=>fqName(fqCC(),c.catId,'name')||'ไม่ระบุหมวดหมู่',kids:()=>[],kidName:''},
 cposts:{one:'โพสต์',title:'จัดการโพสต์',pre:'cp',get:fqCP,
  blank:()=>({platform:'mixi2',url:'',author:'',text:'',image:'',date:'',cat:'',pages:['home','community'],status:'draft'}),
  fields:[['platform','แพลตฟอร์มต้นทาง','sel',1,()=>CP_PF.map(x=>[x[0],x[1]])],['url','URL ของโพสต์ต้นฉบับ (https://)','text',1],['author','ชื่อผู้โพสต์หรือชื่อบัญชีที่แสดง (ถ้ามี)','text'],['text','ข้อความโพสต์หรือคำอธิบาย (ไม่เกิน '+CP_TXT+' ตัวอักษร)','area'],['image','รูปภาพประกอบ (ไม่บังคับ)','img'],['date','วันที่โพสต์ (ถ้าทราบ)','date'],['cat','หมวดหมู่โพสต์ (ไม่บังคับ)','sel',0,()=>CP_CAT],['pages','หน้าที่แสดงโพสต์นี้','cpg']],
  label:p=>(p.author?p.author+' · ':'')+(p.platform==='other'?(cpHost(p.url)||'ลิงก์ภายนอก'):cpPf(p.platform)[1]),
  sub:p=>[okD(p.date)?fmtD(p.date):'ไม่ระบุวันที่',p.text?String(p.text).replace(/\s+/g,' ').slice(0,60)+(String(p.text).length>60?'…':''):'ไม่มีข้อความ',p.image?'มีรูป':'ไม่มีรูป',cpCatName(p.cat)||'ไม่ระบุหมวดหมู่',cpPgCount(p)+' หน้า',cpHost(p.url)].join(' · '),kids:()=>[],kidName:''},
 news:{one:'ข่าว',title:'จัดการข่าวสารและประกาศ',pre:'nw',get:fqNW,
  blank:()=>({title:'',category:'',date:todayS(),image:'',summary:'',body:'',url:'',status:'draft'}),
  fields:[['title','หัวข้อข่าว','text',1],['category','หมวดหมู่ข่าว','sel',1,()=>NW_CAT.concat(WC.fq&&nwOld(WC.fq.category)?[[WC.fq.category,nwCat(WC.fq.category)+' (หมวดเดิม ยกเลิกแล้ว — กรุณาเลือกหมวดใหม่)']]:[])],['date','วันที่เผยแพร่','date',1],['image','รูปภาพประกอบ (ไม่บังคับ)','img'],['summary','คำอธิบายสั้น ๆ แสดงบนการ์ด (ไม่เกิน '+NW_SUM+' ตัวอักษร)','area'],['body','เนื้อหาข่าวฉบับเต็ม (ไม่บังคับ เว้นบรรทัดว่างเพื่อขึ้นย่อหน้าใหม่ ไม่เกิน '+NW_BODY+' ตัวอักษร)','area8'],['url','ลิงก์ข้อมูลเพิ่มเติม (https:// ถ้ามี)','text']],
  label:n=>n.title,sub:n=>[(nwCat(n.category)?nwCat(n.category)+(nwOld(n.category)?' (หมวดเดิม ต้องเลือกใหม่)':''):'ไม่ระบุหมวดหมู่'),okD(n.date)?fmtD(n.date):'ไม่ระบุวันที่',n.summary?'มีคำอธิบายสั้น':'ไม่มีคำอธิบายสั้น',n.image?'มีรูป':'ไม่มีรูป'].join(' · '),kids:()=>[],kidName:''}
};
/* ===== บุคลากรและทีมผู้บริหาร: ข้อมูลชุด site_docs 'people' จัดการผ่านหลังบ้านกลาง FQE เดิม (#/admin/people) ===== */
const PH_E={ptypes:'type',pdepartments:'dept',pgroups:'group'};
function pplHeadBox(ent){const k=PH_E[ent],d=PH_K.find(x=>x[0]===k),h=pplHd(k);
 return `<fieldset class=\"fqfs\"><legend>รูปแบบ${d[1]}บนหน้าเว็บไซต์</legend><div class=\"g2\"><div><label for=\"ph_n\">ขนาดตัวอักษร (px) ช่วง ${PH_MIN}–${PH_MAX}</label><input id=\"ph_n\" type=\"number\" min=\"${PH_MIN}\" max=\"${PH_MAX}\" step=\"1\" value=\"${h.size}\" oninput=\"pplHeadPrev(this)\"><input id=\"ph_r\" type=\"range\" min=\"${PH_MIN}\" max=\"${PH_MAX}\" step=\"1\" value=\"${h.size}\" aria-label=\"ปรับขนาดตัวอักษร\" oninput=\"pplHeadPrev(this)\" style=\"width:100%\"></div><div><b>การจัดแนวข้อความ</b><br>${PH_AL.map(([a,t])=>`<label style=\"display:inline-block;margin-right:14px\"><input type=\"radio\" name=\"ph_a\" value=\"${a}\"${h.align===a?' checked':''} style=\"width:auto\" onchange=\"pplHeadPrev()\"> ${t}</label>`).join('')}</div></div><p><small>ตัวอย่าง (ขนาดจริงตามที่ตั้ง):</small></p><div style=\"border:1px dashed #8886;padding:8px 12px;overflow:hidden\"><div id=\"ph_pv\" style=\"${pplHs(k)};font-weight:700\">ตัวอย่าง${E(d[1].replace('หัวข้อ',''))}</div></div><p><button type=\"button\" class=\"btn b\" onclick=\"pplHeadSave('${k}')\">บันทึกรูปแบบหัวข้อ</button> <small>มีผลกับหัวข้อเท่านั้น ไม่กระทบข้อความในการ์ดบุคลากร (จัดกึ่งกลางเสมอ)</small></p></fieldset>`}
function pplHeadRead(){const n=$('ph_n'),r=$('ph_r'),a=document.querySelector('input[name=ph_a]:checked');return {n,r,size:Math.round(+(n&&n.value)),align:a?a.value:'left'}}
function pplHeadPrev(src){const x=pplHeadRead();if(src&&src===x.n&&x.r)x.r.value=x.n.value;else if(src&&src===x.r&&x.n)x.n.value=x.r.value;const p=$('ph_pv'),z=Math.max(PH_MIN,Math.min(PH_MAX,Math.round(+x.n.value)||PH_MIN));if(p){p.style.fontSize=z+'px';p.style.textAlign=x.align}}
async function pplHeadSave(k){const x=pplHeadRead();if(!Number.isFinite(x.size)||x.size<PH_MIN||x.size>PH_MAX)return say('ขนาดตัวอักษรต้องเป็นตัวเลข '+PH_MIN+'–'+PH_MAX+' px',false);if(!PH_AL.some(a=>a[0]===x.align))return say('การจัดแนวไม่ถูกต้อง',false);if(!DBH)return say(dbOff(),false);
 const st=getSH('settings')||{},cur=Object.assign({},st.pplhead||{});cur[k]={size:x.size,align:x.align};
 try{await putDoc('settings',Object.assign({},st,{pplhead:cur}));say('บันทึกรูปแบบหัวข้อเรียบร้อย ผู้เข้าชมเห็นทันที')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
const pplMakePage=()=>secPageMake('people','บุคลากรและทีมผู้บริหาร','people');
const PPL={key:null,q:''};
const pplNorm=s=>String(s==null?'':s).toLowerCase().replace(/\s+/g,'');
const pplName=p=>((p.first||'')+' '+(p.last||'')).trim();
/* หน้าแสดงผลของบุคลากร: it.pages = อาร์เรย์ id หน้า CMS · ไม่มี pages (ข้อมูลเดิม) = แสดงทุกหน้าที่มีส่วนบุคลากรเหมือนเดิม */
let PPL_PG='';/* id หน้าที่กำลังแสดง (ตั้งใน pageView) */
const pplPgList=()=>getPages().filter(x=>x&&x.id).map(x=>[x.id,(x.title||x.slug||x.id)+(x.status==='published'?'':' (ฉบับร่าง)')]);
const pplHasSec=pg=>(pg.sections||[]).some(s=>s&&s.type==='people');
const pplDefPg=()=>getPages().filter(x=>x&&x.id&&pplHasSec(x)).map(x=>x.id);
const pplOn=(p,pid)=>!pid||!Array.isArray(p.pages)||p.pages.includes(pid);
const pplAllG=()=>{const ts=new Set(fqPT().filter(fqIsPub).map(t=>t.id));return fqPeople().filter(p=>fqIsPub(p)&&ts.has(pplTy(p)))};
const pplAll=()=>pplAllG().filter(p=>pplOn(p,PPL_PG));
/* หน้า CMS ที่ไม่มีส่วนบุคลากร แต่มีบุคลากรถูกกำหนดให้แสดงไว้ → ต่อท้ายรายชื่อให้ (หน้าอื่นไม่เปลี่ยน) */
function pplPageSec(pg){if(pplHasSec(pg)||!pplAllG().some(p=>Array.isArray(p.pages)&&p.pages.includes(pg.id)))return '';return `<section style="margin-top:28px">${pplView()}</section>`}
const pplMatch=p=>{const q=pplNorm(PPL.q);return !q||pplNorm((p.first||'')+(p.last||'')).includes(q)};
const pplCard=p=>{const ph=okU(p.photo)?p.photo:'',nm=pplName(p);return `<div class=\"card h\" style=\"text-align:center\">${ph?`<img src=\"${E(ph)}\" alt=\"${E(nm)}\" loading=\"lazy\" data-zoom=\"${E(ph)}\" data-zalt=\"${E(nm)}\" style=\"aspect-ratio:3/4;height:auto;object-fit:cover;object-position:center top;cursor:zoom-in\">`:`<div aria-hidden=\"true\" style=\"aspect-ratio:3/4;display:flex;align-items:center;justify-content:center;font-size:3rem;opacity:.35;background:rgba(127,127,127,.12)\">${ic('user')}</div>`}<div class=\"p\" style=\"text-align:center\"><h3 style=\"text-align:center\">${E(nm)}</h3>${p.position?`<p class=\"pl\" style=\"text-align:center\">${E(p.position)}</p>`:''}</div></div>`};
/* แสดงตามประเภท (ลำดับตามหลังบ้าน) → ภายในประเภทแยกตามกลุ่มสาระ (ลำดับตามหลังบ้าน) · กลุ่มที่ปิดใช้งานหรือไม่มี → "ไม่ระบุกลุ่มสาระ" · คณะผู้บริหารแสดงแบบไม่แบ่งกลุ่ม */
function pplSec(L,flat,hl){const gs=fqPG().filter(fqIsPub),gi=p=>gs.some(g=>g.id===p.groupId),grid=a=>`<div class=\"grid\">${a.map(pplCard).join('')}</div>`,h=hl||'h3';
 if(flat||!L.some(gi))return grid(L);const blk=(t,a)=>a.length?`<${h} style=\"margin:22px 0 10px;${pplHs('group')}\">${E(t)}</${h}>${grid(a)}`:'';
 return gs.map(g=>blk(g.name,L.filter(p=>p.groupId===g.id))).join('')+blk('ไม่ระบุกลุ่มสาระ',L.filter(p=>!gi(p)))}
/* ประเภท → ฝ่ายงาน (ปิดใช้งาน/ไม่มี → "ไม่ระบุฝ่าย") → กลุ่มสาระ → คน · ถ้าไม่มีใครในประเภทนั้นมีฝ่าย แสดงแบบไม่แบ่งฝ่าย · คณะผู้บริหารไม่แบ่งฝ่าย/กลุ่ม */
function pplDept(m,exec){if(exec)return pplSec(m,true);const ds=fqPD().filter(fqIsPub),di=p=>ds.some(d=>d.id===p.departmentId);if(!m.some(di))return pplSec(m,false);
 const blk=(t,a)=>a.length?`<h3 style=\"margin:24px 0 10px;${pplHs('dept')}\">${E(t)}</h3>${pplSec(a,false,'h4')}`:'';
 return ds.map(d=>blk(d.name,m.filter(p=>p.departmentId===d.id))).join('')+blk('ไม่ระบุฝ่าย',m.filter(p=>!di(p)))}
function pplBody(all){const L=all.filter(pplMatch);return `<p class=\"evm\" aria-live=\"polite\">${PPL.q.trim()?'พบ '+L.length+' ท่าน':''}</p>${L.length?fqPT().filter(fqIsPub).map(t=>{const m=L.filter(p=>pplTy(p)===t.id);return m.length?`<h2 style=\"margin:30px 0 12px;${pplHs('type')}\">${E(t.name)}</h2>${pplDept(m,t.id==='pt_exec')}`:''}).join(''):'<div class=\"empty-ev\"><b>ไม่พบบุคลากรที่ตรงกับการค้นหา</b><br>ลองเปลี่ยนคำค้นหา</div>'}`}
function pplView(){if(PPL.key!==location.hash){PPL.key=location.hash;PPL.q=''}
 const all=pplAll();if(!all.length)return `<div class="fq"><div class="empty-ev"><b>${pplAllG().length?'ยังไม่มีบุคลากรที่กำหนดให้แสดงในหน้านี้':'ยังไม่มีข้อมูลบุคลากรและทีมผู้บริหาร'}</b><br>${Auth.canAccessAdmin()?'<a href="#/admin/pstaff">เพิ่มข้อมูลที่หลังบ้าน</a>':'กรุณากลับมาใหม่ภายหลัง'}</div></div>`;
 return `<div class="fq"><div class="cmt"><input id="pplq" type="search" placeholder="ค้นหาชื่อหรือนามสกุล" value="${E(PPL.q)}" oninput="pplFilter()" aria-label="ค้นหาชื่อหรือนามสกุล" autocomplete="off"></div><div id="pplb">${pplBody(all)}</div></div>`}
function pplFilter(){const i=$('pplq');PPL.q=i?i.value:'';const b=$('pplb');if(b)b.innerHTML=pplBody(pplAll())}
function secPageInfo(type){const P=getPages(),M=getMenu(),pg=P.find(p=>(p.sections||[]).some(s=>s.type===type)),mi=pg&&M.find(m=>m.kind==='cms'&&m.pageId===pg.id);return {pg,mi}}
function secPageBox(type,title,slugDef,fn){const {pg,mi}=secPageInfo(type);return pg&&mi?`<div class="msg ok">หน้า "${E(pg.title)}" อยู่ในเมนูแล้ว ${stTag(pg)} · <a href="#/p/${E(pg.slug)}">เปิดหน้า</a> · <a href="#/admin/pages/edit/${E(pg.id)}">แก้ไขหน้า</a> · <a href="#/admin/menu">จัดตำแหน่งเมนู</a></div>`:`<div class="msg er">${pg?'มีหน้าแล้วแต่ยังไม่อยู่ในเมนู':'ยังไม่มีหน้า "'+E(title)+'" ในเมนูของเว็บไซต์'}</div><p><button type="button" class="btn b" onclick="${fn}()">${pg?'เพิ่มลงในเมนู':'สร้างหน้าและเมนู "'+E(title)+'"'}</button></p>`}
async function secPageMake(type,title,slugDef){if(!DBH)return say(dbOff(),false);const P=clone(getPages()),M=clone(getMenu());let pg=P.find(p=>(p.sections||[]).some(s=>s.type===type));
 if(!pg){const id=mkId('pg');let slug=slugDef;if(P.some(x=>x.slug===slug))slug=id;pg={id,title,slug,status:'published',sections:[{id:mkId('s'),type,text:'',url:'',alt:'',label:'',items:[]}],updated:Date.now()};P.push(pg)}
 if(!M.some(m=>m.kind==='cms'&&m.pageId===pg.id)){const mx=Math.max(-10,...M.filter(y=>!y.parent).map(y=>+y.order||0));M.push({id:mkId('m'),label:title,m:'',kind:'cms',pageId:pg.id,href:'',tab:'same',show:true,order:mx+10,parent:''})}
 try{await putDoc('pages',P);await putDoc('menu',M);say('เพิ่มหน้าและเมนู "'+title+'" แล้ว (ย้ายตำแหน่งเมนูได้ที่ แก้ไขเมนูแบบละเอียด)')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
function fqAdmin(ent){const C=FQE[ent],all=C.get(),L=C.filter?all.filter(C.filter):all,D=fqPub(),vis=new Set([].concat(D.G,D.F,D.M,D.P).map(x=>x.id));
 const sel=(k,l,opts)=>`<label style="display:inline-block;margin-right:12px">${l} <select onchange="fqAf('${k}',this.value)"><option value="">ทั้งหมด</option>${opts.map(([v,t])=>`<option value="${E(v)}"${AFV[k]===v?' selected':''}>${E(t)}</option>`).join('')}</select></label>`;
 const fl=ent==='clubs'?sel('club','หมวดหมู่',fqCC().map(c=>[c.id,c.name]).concat([['-','ไม่ระบุหมวดหมู่']])):'';
 return `<h1>${C.title}</h1><p>เพิ่ม แก้ไข ซ่อน/เผยแพร่ ลบ และจัดเรียงลำดับ ข้อมูลบันทึกใน Supabase${ent==='news'?' ข่าวที่เผยแพร่จะแสดงบนเว็บไซต์เรียงตามวันที่ล่าสุดก่อน (ไม่ใช้ลำดับในรายการนี้)':isPpl(ent)||ent==='ptypes'||ent==='pgroups'||ent==='pdepartments'||ent==='clubs'||ent==='clubcats'||ent==='cposts'?' ลำดับในรายการนี้คือลำดับการแสดงบนหน้าเว็บไซต์ (แสดงเฉพาะรายการที่เผยแพร่)':' ถ้าซ่อนรายการต้นสังกัด รายการลูกจะไม่แสดงบนเว็บไซต์ด้วย'}</p>${dbBanner()}${isPpl(ent)?secPageBox('people','บุคลากรและทีมผู้บริหาร','people','pplMakePage'):ent==='clubs'?secPageBox('clubs','ชมรมนักศึกษา','clubs','clubMakePage'):ent==='clubcats'&&!all.length?clubSeedBox():ent==='cposts'?cpAdminBox():ent==='news'?nwAdminBox():PH_E[ent]?pplHeadBox(ent):''}
${C.parent&&!C.parent().length?`<div class="msg er">ต้องมี${C.pn}ก่อนจึงจะเพิ่ม${C.one}ได้ <a href="${C.pl}">ไปจัดการ${C.pn}</a></div>`:''}<p><a class="btn b" href="#/admin/${ent}/edit/new">+ เพิ่ม${C.one}</a></p>${fl?`<p>${fl}</p>`:''}<p><small>ทั้งหมด ${all.length} รายการ${L.length!==all.length?' · แสดง '+L.length+' รายการตามตัวกรอง':''}</small></p>
${L.length?L.map((it,i)=>`<div class="row"><b>${E(C.label(it))}</b> ${stTag(it)} ${fqIsPub(it)&&!['pexec','pstaff','ptypes','pgroups','pdepartments','clubs','clubcats','cposts','news'].includes(ent)&&!vis.has(it.id)?'<span class="tag">ไม่แสดงบนเว็บไซต์ (ต้นสังกัดถูกซ่อนหรือไม่มี)</span>':''}<br><small>${E(C.sub(it))}</small><br><a class="btn s" href="#/admin/${ent}/edit/${E(it.id)}">แก้ไข</a> ${ent==='news'?'':`<button type="button" class="btn s"${i?'':' disabled'} onclick="fqMv('${ent}','${E(it.id)}',-1)">ขึ้น</button> <button type="button" class="btn s"${i<L.length-1?'':' disabled'} onclick="fqMv('${ent}','${E(it.id)}',1)">ลง</button>`} <button type="button" class="btn s" onclick="fqTog('${ent}','${E(it.id)}')">${fqIsPub(it)?'ซ่อน':'เผยแพร่'}</button> <button type="button" class="btn s c" onclick="fqDelAsk('${ent}','${E(it.id)}')">ลบ</button></div>`).join(''):'<div class="empty-ev">ยังไม่มีข้อมูล กดเพิ่มเพื่อเริ่มต้น</div>'}`}
function fqAf(k,v){AFV[k]=v;if(k==='faculty')AFV.major='';render()}
async function fqMv(ent,id,d){const C=FQE[ent],all=C.get().slice(),vis=C.filter?all.filter(C.filter):all,i=vis.findIndex(x=>x.id===id),j=i+d;if(i<0||j<0||j>=vis.length)return;if(!DBH)return say(dbOff(),false);const a=all.indexOf(vis[i]),b=all.indexOf(vis[j]);[all[a],all[b]]=[all[b],all[a]];try{await putDoc(FQE[ent].store||ent,all);say('เปลี่ยนลำดับแล้ว')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
async function fqTog(ent,id){if(!DBH)return say(dbOff(),false);const all=clone(FQE[ent].get()),it=all.find(x=>x.id===id);if(!it)return;it.status=fqIsPub(it)?'draft':'published';try{await putDoc(FQE[ent].store||ent,all);say(fqIsPub(it)?'เผยแพร่แล้ว':'ซ่อนแล้ว'+(FQE[ent].kids(it).length&&ent!=='clubcats'?' (รายการที่สังกัดจะไม่แสดงบนเว็บไซต์ด้วย)':''))}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
function fqDelAsk(ent,id){const C=FQE[ent],it=C.get().find(x=>x.id===id);if(!it)return;if(C.lock&&C.lock(it))return say('ประเภทพื้นฐานของระบบลบไม่ได้ ใช้การซ่อน/ปิดใช้งานแทน',false);const k=C.kids(it),r=C.refs?C.refs(it):[];
 $('md').innerHTML=k.length||r.length?`<div class="modal"><div><h3>ลบไม่ได้: ยังมีรายการที่เชื่อมโยง</h3><p>"${E(C.label(it))}" ยังมีข้อมูลอ้างอิงอยู่: ${E([k.length?k.length+' '+C.kidName+' สังกัดอยู่':''].concat(r.slice(0,8),r.length>8?['อีก '+(r.length-8)+' รายการ']:[]).filter(Boolean).join(' · '))} ระบบไม่ลบให้เพื่อป้องกันข้อมูลสูญหาย กรุณาลบหรือย้ายรายการเหล่านั้นก่อน หรือเลือก${C.hideLbl||'ซ่อน'}รายการนี้แทน</p><button class="btn b" onclick="$('md').innerHTML='';fqHideOnly('${ent}','${E(id)}')">${C.hideLbl||'ซ่อน'}แทน</button> <button class="btn" onclick="$('md').innerHTML=''">ปิด</button></div></div>`
 :`<div class="modal"><div><h3>ยืนยันการลบ${C.one}</h3><p>"${E(C.label(it))}" จะถูกลบถาวร</p><button class="btn c" onclick="fqDelDo('${ent}','${E(id)}')">ลบ</button> <button class="btn" onclick="$('md').innerHTML=''">ยกเลิก</button></div></div>`}
async function fqHideOnly(ent,id){const all=clone(FQE[ent].get()),it=all.find(x=>x.id===id);if(!it||!DBH)return;it.status='draft';try{await putDoc(FQE[ent].store||ent,all);say('ซ่อนแล้ว')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
async function fqDelDo(ent,id){$('md').innerHTML='';const C=FQE[ent],it=C.get().find(x=>x.id===id);if(!it)return;if(C.lock&&C.lock(it))return say('ประเภทพื้นฐานของระบบลบไม่ได้',false);if(C.kids(it).length||(C.refs&&C.refs(it).length))return say('ลบไม่ได้ ยังมีรายการสังกัดหรืออ้างอิงอยู่',false);if(!DBH)return say(dbOff(),false);try{await putDoc(FQE[ent].store||ent,C.get().filter(x=>x.id!==id));say('ลบเรียบร้อย')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
/* --- ตัวแก้ไข --- */
function fqPend(){if(PEND.path!==location.hash){PEND.path=location.hash;PEND.files={}}return PEND}
const fqImgGet=(it,k)=>{if(k==='flower')return (it.flower&&it.flower.img)||'';if(k.slice(0,2)==='b:'){const b=(it.blocks||[]).find(x=>x.id===k.slice(2));return (b&&b.url)||''}return it[k]||''};
function fqImgSet(it,k,v){if(k==='flower'){it.flower=it.flower||{};it.flower.img=v}else if(k.slice(0,2)==='b:'){const b=(it.blocks||[]).find(x=>x.id===k.slice(2));if(b)b.url=v}else it[k]=v}
function fqImg(k,l,it,nm){const p=fqPend().files[k],v=fqImgGet(it,k),src=p?p.url:okU(v)?v:'';
 return `<label>${l}</label>${src?`<img class="fqpv" src="${E(src)}" alt="ตัวอย่างภาพ">${p?'<p><small>ภาพตัวอย่าง — ยังไม่ได้บันทึก จะอัปโหลดเมื่อกดบันทึก</small></p>':''}`:'<p><small>ยังไม่มีรูป</small></p>'}<input name="${nm}" value="${E(v)}" placeholder="ลิงก์รูป https:// (หรืออัปโหลด/เลือกจากคลังสื่อด้านล่าง)"><input type="file" accept="image/png,image/jpeg,image/webp,image/gif" onchange="fqPick('${k}',this)"><p><button type="button" class="btn s" onclick="fqLib('${k}')">เลือกจากคลังสื่อ</button> ${src?`<button type="button" class="btn s c" onclick="fqImgClear('${k}')">ลบรูป</button>`:''}</p>`}
function fqEditor(ent,id){const C=FQE[ent],isNew=id==='new';
 if(!WC.fq||WC.fqEnt!==ent||WC.fq.id!==(isNew?WC.fq.id:id)){const ex=isNew?null:C.get().find(x=>x.id===id);if(!isNew&&!ex)return `<p><a class="bk" href="#/admin/${ent}">← ${C.title}</a></p><h1>ไม่พบรายการ</h1>`;WC.fq=isNew?Object.assign({id:mkId(C.pre)},C.blank()):clone(ex);WC.fqNew=isNew;WC.fqEnt=ent;fqMig(WC.fq)}
 const it=WC.fq,fi=fd=>{const [k,l,t,req,opt,dflt]=fd,nm='f_'+k,v=it[k],lb=`<label for="${nm}">${l}${req?' *':''}</label>`;
  if(t==='text')return `${lb}<input id="${nm}" name="${nm}" value="${E(v)}">`;
  if(t==='area'||t==='area8')return `${lb}<textarea id="${nm}" name="${nm}" rows="${t==='area8'?8:4}">${E(v)}</textarea>`;
  if(t==='sel'){const o=opt();let g=null,h='';o.forEach(([a,b,gr])=>{if(gr!==undefined&&gr!==g){if(g!==null)h+='</optgroup>';h+=`<optgroup label="${E(gr)}">`;g=gr}h+=`<option value="${E(a)}"${v===a?' selected':''}>${E(b)}</option>`});if(g!==null)h+='</optgroup>';return `${lb}<select id="${nm}" name="${nm}"><option value="">— เลือก —</option>${h}</select>`}
  if(t==='cpg'){const cur=Array.isArray(v)?v:(dflt?dflt():['home','community']),L=opt?opt():cpPgList(),ex=cur.filter(id=>!L.some(x=>x[0]===id));return `<fieldset><legend>${l}</legend><input type="hidden" name="${nm}_x" value="1">${L.concat(ex.map(id=>[id,'(หน้านี้ถูกลบแล้ว — ติ๊กออกเพื่อนำออก)'])).map(([a,b])=>`<label class="ck"><input type="checkbox" name="${nm}" value="${E(a)}"${cur.includes(a)?' checked':''}> ${E(b)}</label>`).join('')}<small>เลือกได้หลายหน้า โพสต์เดียวแสดงได้หลายหน้าโดยไม่ต้องสร้างซ้ำ ติ๊กออก = นำโพสต์ออกจากหน้านั้น (ไม่ลบโพสต์) โพสต์ที่ซ่อนหรือยังเป็นฉบับร่างจะไม่แสดงบนหน้าเว็บ</small></fieldset>`}
  if(t==='img')return fqImg(k,l,it,nm);
  if(t==='date')return `${lb}<input id="${nm}" name="${nm}" type="date" value="${E(v)}">`;
  return ''};
 const noPar=C.parent&&!C.parent().length;
 return `<p><a class="bk" href="#/admin/${ent}">← ${C.title}</a></p><h1>${isNew?'เพิ่ม':'แก้ไข'}${C.one}</h1>${dbBanner()}${noPar?`<div class="msg er">ต้องมี${C.pn}ก่อน <a href="${C.pl}">ไปจัดการ${C.pn}</a></div>`:''}<form id="af" onsubmit="return false">${C.fields.map(fi).join('')}<label for="f_status">สถานะ</label><select id="f_status" name="f_status"><option value="draft"${it.status==='published'?'':' selected'}>ซ่อน / ฉบับร่าง</option><option value="published"${it.status==='published'?' selected':''}>เผยแพร่</option></select><p><button type="button" class="btn b" onclick="fqSave('${ent}')">บันทึก</button> <a class="btn" href="#/admin/${ent}">กลับรายการ</a></p></form>`}
function fqSync(ent){const C=FQE[ent],it=WC.fq;if(!it)return null;const d=new FormData($('af')),g=n=>STRIP(String(d.get(n)==null?'':d.get(n))).trim();
 C.fields.forEach(([k,,t])=>{const nm='f_'+k;if(t==='chk')it[k]=d.getAll(nm);else if(t==='cpg'){if(d.has(nm+'_x'))it[k]=d.getAll(nm)}else if(t!=='flower'&&d.has(nm))it[k]=g(nm)});
 if(d.has('f_status'))it.status=d.get('f_status')==='published'?'published':'draft';
 fqSyncX(ent,it,d,g);return it}
async function mdUpload(file,dir){if(!SB||!DBH)throw {message:dbOff()};const ext=CM_MIME[file&&file.type];if(!ext)throw {message:'รองรับเฉพาะไฟล์ PNG, JPG, WebP, GIF'};if(file.size>5*1024*1024)throw {message:'ไฟล์ใหญ่เกิน 5 MB'};
 const path=dir+'/'+mkId('f')+'.'+ext,{error}=await SB.storage.from('media').upload(path,file,{contentType:file.type,cacheControl:'31536000',upsert:false});if(error)throw error;return SB.storage.from('media').getPublicUrl(path).data.publicUrl}
function fqPick(k,inp){const f=inp.files&&inp.files[0];inp.value='';if(!f)return;const ent=WC.fqEnt;if(!CM_MIME[f.type])return say('รองรับเฉพาะไฟล์ PNG, JPG, WebP, GIF',false);if(f.size>5*1024*1024)return say('ไฟล์ใหญ่เกิน 5 MB',false);fqSync(ent);const P=fqPend();if(P.files[k]){try{URL.revokeObjectURL(P.files[k].url)}catch(e){}}P.files[k]={file:f,url:URL.createObjectURL(f)};render()}
function fqImgClear(k){fqSync(WC.fqEnt);const P=fqPend();delete P.files[k];fqImgSet(WC.fq,k,'');render()}
let FQLIB=[];
async function fqLib(k){if(!SB||!DBH)return say(dbOff(),false);fqSync(WC.fqEnt);$('md').innerHTML='<div class="modal"><div><h3>คลังสื่อ</h3><p>กำลังโหลด...</p></div></div>';FQLIB=[];
 try{for(const [b,fo] of [['media','faculties'],['media','people'],['media','clubs'],['media','posts'],['media','news'],['media','events'],['campus','places'],['campus','maps']]){const {data,error}=await SB.storage.from(b).list(fo,{limit:100,sortBy:{column:'created_at',order:'desc'}});if(error)throw error;(data||[]).filter(x=>x&&x.id&&/\.(png|jpe?g|webp|gif)$/i.test(x.name||'')).forEach(x=>FQLIB.push(SB.storage.from(b).getPublicUrl(fo+'/'+x.name).data.publicUrl))}}
 catch(e){$('md').innerHTML='';return dbErr('โหลดคลังสื่อไม่สำเร็จ',e)}
 $('md').innerHTML=`<div class="modal"><div class="fqlib"><h3>เลือกจากคลังสื่อ</h3>${FQLIB.length?`<div class="fqlg">${FQLIB.map((u,i)=>`<button type="button" class="fqlb" onclick="fqUse('${k}',${i})"><img src="${E(u)}" alt="" loading="lazy"></button>`).join('')}</div>`:'<p>ยังไม่มีรูปในคลังสื่อ</p>'}<p><button class="btn" onclick="$('md').innerHTML=''">ปิด</button></p></div></div>`}
function fqUse(k,i){const u=FQLIB[i];$('md').innerHTML='';if(!u||!WC.fq)return;fqPend();delete PEND.files[k];fqImgSet(WC.fq,k,u);render()}
async function fqSave(ent){const C=FQE[ent],it=fqSync(ent);if(!it)return;
 for(const [k,l,t,req] of C.fields){if(req&&!it[k])return say('กรุณากรอก/เลือก: '+l,false)}
 if(C.parent&&!C.parent().some(x=>x.id===it[C.pk]))return say('ต้นสังกัดที่เลือกไม่มีอยู่ในระบบ',false);
 
 
 {const er=fqClean(ent,it);if(er)return say(er,false)}
 if(!DBH)return say(dbOff(),false);
 const P=fqPend();
 try{for(const k of Object.keys(P.files))fqImgSet(it,k,await mdUpload(P.files[k].file,isPpl(ent)?'people':ent==='clubs'?'clubs':ent==='cposts'?'posts':ent==='news'?'news':'faculties'));
  
   if(isPpl(ent)&&it.photo&&!okU(it.photo))return say('ลิงก์รูปต้องขึ้นต้นด้วย https://',false);
  if(ent==='clubs'&&it.logo&&!okU(it.logo))return say('ลิงก์โลโก้ต้องขึ้นต้นด้วย https://',false);
  for(const b of it.blocks||[])if(b.type==='image'&&b.url&&!okU(b.url))return say('ลิงก์รูปในเนื้อหาเพิ่มเติมต้องขึ้นต้นด้วย https://',false);
  it.blocks=(it.blocks||[]).filter(fqBlkOk);
  
  const arr=C.get().slice(),i=arr.findIndex(x=>x.id===it.id);if(i>=0)arr[i]=it;else if(ent==='cposts'||ent==='news')arr.unshift(it);else arr.push(it);await putDoc(FQE[ent].store||ent,arr);
  const wasNew=WC.fqNew,nid=it.id;WC={};P.files={};
  if(wasNew){const h='#/admin/'+ent+'/edit/'+nid;if(window.history&&history.replaceState)history.replaceState(null,'',h);else location.hash=h;last=h}
  say('บันทึกเรียบร้อย')}
 catch(e){if((ent==='cposts'||ent==='news')&&e&&e.code==='23514')return say('บันทึกไม่สำเร็จ: ฐานข้อมูลยังไม่รองรับ'+(ent==='news'?'ข่าวสาร':'โพสต์')+' ให้รันไฟล์ migration_homepage.sql ใน Supabase ก่อน (23514)',false);dbErr('บันทึกไม่สำเร็จ',e)}}
/* ===== โพสต์: site_docs 'cposts' (อาร์เรย์) — ลำดับในอาร์เรย์ = ลำดับแสดงผล โพสต์ใหม่แทรกบนสุด
   ระยะแรกกรอกเอง (URL/ชื่อ/ข้อความ/รูป) ไม่มีการดึงข้อมูลจากแพลตฟอร์มภายนอก และไม่เรียก API ภายนอกเมื่อผู้เข้าชมเปิดหน้า ===== */
const cpPf=k=>CP_PF.find(x=>x[0]===k)||CP_PF[CP_PF.length-1];
const cpHost=u=>{try{return new URL(u).hostname.replace(/^www\./i,'')}catch(e){return ''}};
/* ตรวจ URL เชิงโครงสร้าง (ใช้ทั้งตอนบันทึกและตอนแสดงผล): คืน '' ถ้าปลอดภัย ไม่เช่นนั้นคืนข้อความผิดพลาด */
function cpUrlBasic(u){const v=String(u||'').trim();
 if(!v)return 'กรุณากรอก URL';
 if(v.length>2000)return 'URL ยาวเกินไป (เกิน 2000 ตัวอักษร)';
 if(/[\u0000-\u0020\u007f<>"`\\]/.test(v))return 'URL มีช่องว่างหรืออักขระที่ไม่อนุญาต';
 let x;try{x=new URL(v)}catch(e){return 'รูปแบบ URL ไม่ถูกต้อง'}
 if(x.protocol!=='https:')return 'URL ต้องขึ้นต้นด้วย https://';
 if(x.username||x.password)return 'URL ต้องไม่มีชื่อผู้ใช้หรือรหัสผ่านฝังอยู่';
 const h=x.hostname.toLowerCase();
 if(!h.includes('.')||h.startsWith('[')||/^\d{1,3}(\.\d{1,3}){3}$/.test(h)||h==='localhost'||/\.(local|internal|localhost)$/.test(h))return 'โดเมนไม่ถูกต้อง (ไม่รองรับ IP, localhost หรือโดเมนภายใน)';
 return ''}
/* ตรวจตอนบันทึก: ต้องผ่านเกณฑ์พื้นฐาน และโดเมนต้องตรงกับแพลตฟอร์มที่เลือก (เว้นแต่เลือก "อื่น ๆ") */
function cpUrlCheck(u,k){const er=cpUrlBasic(u);if(er)return er;const pf=cpPf(k),ds=pf[2],h=cpHost(u).toLowerCase();
 if(ds&&!ds.some(d=>h===d||h.endsWith('.'+d)))return 'URL ไม่ตรงกับแพลตฟอร์มที่เลือก ('+pf[1]+') โดเมนที่รองรับ: '+ds.join(', ')+' — ถ้าเป็นแพลตฟอร์มอื่นให้เลือก "อื่น ๆ"';
 return ''}
/* รายชื่อหน้าที่เลือกได้ = หน้าในตัว + หน้า CMS ที่มีอยู่จริงในระบบ */
const cpPgList=()=>CP_BI.concat(getPages().filter(x=>x&&x.id).map(x=>[x.id,(x.title||x.slug||x.id)+(x.status==='published'?'':' (ฉบับร่าง)')]));
const cpPgCount=p=>(Array.isArray(p.pages)?p.pages:['home','community']).filter(id=>cpPgList().some(x=>x[0]===id)).length;
function cpClean(it){
 if(it.cat==null)it.cat='';if(it.cat&&!CP_CAT.some(x=>x[0]===it.cat))return 'หมวดหมู่โพสต์ไม่ถูกต้อง';
 if(Array.isArray(it.pages)){const ok=new Set(cpPgList().map(x=>x[0]));it.pages=[...new Set(it.pages.filter(id=>typeof id==='string'&&ok.has(id)))]}else it.pages=['home','community'];

 if(!CP_PF.some(x=>x[0]===it.platform))return 'แพลตฟอร์มไม่ถูกต้อง';
 it.url=String(it.url||'').trim();{const er=cpUrlCheck(it.url,it.platform);if(er)return er}
 it.author=String(it.author||'').trim();it.text=String(it.text||'').trim();
 const nl=[...it.author].length,tl=[...it.text].length;
 if(nl>CP_NAME)return 'ชื่อผู้โพสต์ยาวเกิน '+CP_NAME+' ตัวอักษร (ตอนนี้ '+nl+')';
 if(tl>CP_TXT)return 'ข้อความยาวเกิน '+CP_TXT+' ตัวอักษร (ตอนนี้ '+tl+')';
 it.image=String(it.image||'').trim();if(it.image){const er=cpUrlBasic(it.image);if(er)return 'ลิงก์รูป: '+er}
 if(it.date&&!okD(it.date))return 'วันที่โพสต์ไม่ถูกต้อง';
 return ''}
const cpAll=()=>fqCP().filter(p=>fqIsPub(p)&&!cpUrlBasic(p.url));
const cpCatName=k=>{const c=CP_CAT.find(x=>x[0]===k);return c?c[1]:''};
/* โพสต์นี้ถูกกำหนดให้แสดงในหน้า pid หรือไม่ (ไม่มี pages = โพสต์เก่า → หน้าแรกและหน้ารวมโพสต์) */
const cpOn=(p,pid)=>Array.isArray(p.pages)?p.pages.includes(pid):(pid==='home'||pid==='community');
const cpFor=(pid,cat)=>cpAll().filter(p=>cpOn(p,pid)&&(!cat||p.cat===cat));
const CPF={};/* ตัวกรองหมวดหมู่ต่อหน้า (เก็บในหน่วยความจำ ไม่เรียกฐานข้อมูล) */
function cpFilt(pid,cat){CPF[pid]=CP_CAT.some(x=>x[0]===cat)?cat:'';const h=location.hash;if(pid==='community'&&h!=='#/community'&&h!=='#/community/1'){location.hash='#/community';return}render()}
const cpBar=(pid,all)=>{const cur=CPF[pid]||'',b=(k,t)=>`<button type="button" class="btn s${cur===k?' b':''}" aria-pressed="${cur===k}" onclick="cpFilt('${E(pid)}','${k}')">${E(t)}</button>`;return all.some(p=>p.cat)?`<div class="cpf" role="group" aria-label="กรองตามหมวดหมู่โพสต์">${b('','ทั้งหมด')}${CP_CAT.map(([k,t])=>b(k,t)).join('')}</div>`:''};
const cpNone=()=>'<div class="empty-ev"><b>ไม่มีโพสต์</b></div>';
/* ส่วนโพสต์ท้ายหน้า CMS: แสดงเมื่อมีโพสต์ที่เผยแพร่และถูกกำหนดให้แสดงในหน้านี้เท่านั้น (หน้าอื่นไม่เปลี่ยน) */
function cpPageSec(pid){const all=cpFor(pid);if(!all.length)return '';const L=cpFor(pid,CPF[pid]||''),h=HD();
 return `<section class="cps"><div class="cpt0"><h2>${E(h.pt||CP_T)}</h2></div>${cpBar(pid,all)}${L.length?`<div class="cpg">${L.map(cpCard).join('')}</div>`:cpNone()}</section>`}
const cpHomeNOf=h=>{const v=h&&h.pn;if(v===null||v===undefined||v==='')return CP_DEF;const n=Math.floor(+v);return Number.isFinite(n)?Math.max(0,Math.min(CP_MAX,n)):CP_DEF};
const cpHomeN=()=>cpHomeNOf(HD());
function cpCard(p){const pf=p.platform==='other'?(cpHost(p.url)||'ลิงก์ภายนอก'):cpPf(p.platform)[1],img=!!p.image&&!cpUrlBasic(p.image),nm=String(p.author||'').trim(),tx=String(p.text||'').trim();
 return `<a class="cpc${img?'':' cpn'}" href="${E(p.url)}" target="_blank" rel="noopener noreferrer">${img?`<div class="cpm"><img src="${E(p.image)}" alt="ภาพประกอบโพสต์${nm?' ของ '+E(nm):''}" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.parentNode.classList.add('cpn');this.parentNode.remove()"></div>`:''}<div class="cpb"><div class="cph"><span class="cpp">${E(pf)}</span>${cpCatName(p.cat)?`<span class="cpcat">${E(cpCatName(p.cat))}</span>`:''}${okD(p.date)?`<span>${E(fmtD(p.date))}</span>`:''}</div>${nm?`<b class="cpa">${E(nm)}</b>`:''}${tx?`<p class="cpt">${E(tx)}</p>`:''}<span class="cpgo">ดูโพสต์ต้นฉบับ ${ic('ext')}<span class="sr">(เปิดในแท็บใหม่)</span></span></div></a>`}
function cpHomeSec(){const h=HD(),n=cpHomeN();if(n<=0)return '';const all=cpFor('home'),L=all.slice(0,n),ttl=h.pt||CP_T;
 if(!L.length)return Auth.canAccessAdmin()?`<section class="cps"><h2>${E(ttl)}</h2><div class="empty-ev">ยังไม่มีโพสต์ที่เผยแพร่ (ผู้เข้าชมทั่วไปจะไม่เห็นส่วนนี้) <a href="#/admin/cposts">เพิ่มโพสต์ที่หลังบ้าน</a></div></section>`:'';
 return `<section class="cps" aria-labelledby="cph"><div class="cpt0"><h2 id="cph">${E(ttl)}</h2>${all.length>L.length&&cpFor('community').length?`<a class="cpall" href="#/community">ดูโพสต์ทั้งหมด (${cpFor('community').length}) ${ic('right')}</a>`:''}</div><div class="cpg">${L.map(cpCard).join('')}</div></section>`}
/* หน้ารวมโพสต์ #/community/<หน้า> — แบ่งหน้าละ CP_PER รายการ (ข้อมูลทั้งชุดมากับเอกสารเดียวกับส่วนอื่น แบ่งหน้าเฉพาะการแสดงผล รูปโหลดแบบ lazy) */
function cpPage(pg){const base=cpFor('community'),all=cpFor('community',CPF.community||''),tot=Math.max(1,Math.ceil(all.length/CP_PER)),h=HD();let n=parseInt(pg,10);if(!(n>=1))n=1;if(n>tot)n=tot;
 const L=all.slice((n-1)*CP_PER,n*CP_PER),ps=[];for(let i=1;i<=tot;i++)if(i===1||i===tot||Math.abs(i-n)<=1)ps.push(i);
 const it=[];ps.forEach((i,k)=>{if(k&&i-ps[k-1]>1)it.push('<span class="cpel" aria-hidden="true">…</span>');it.push(i===n?`<a href="#/community/${i}" aria-current="page" aria-label="หน้า ${i} (หน้าปัจจุบัน)">${i}</a>`:`<a href="#/community/${i}" aria-label="ไปหน้า ${i}">${i}</a>`)});
 const pv=n>1?`<a href="#/community/${n-1}" rel="prev">${ic('left')} ก่อนหน้า</a>`:'<span class="cpdis">ก่อนหน้า</span>',nx=n<tot?`<a href="#/community/${n+1}" rel="next">ถัดไป ${ic('right')}</a>`:'<span class="cpdis">ถัดไป</span>';
 return `<div class="w sec"><p><a class="bk" href="#/">← กลับหน้าแรก</a></p><h1>${E(h.pt||CP_T)}</h1>${cpBar('community',base)}${L.length?`<p class="evm" aria-live="polite">โพสต์ทั้งหมด ${all.length} รายการ · หน้า ${n} จาก ${tot}</p><div class="cpg">${L.map(cpCard).join('')}</div>${tot>1?`<div class="cppg" role="navigation" aria-label="แบ่งหน้าโพสต์">${pv}${it.join('')}${nx}</div>`:''}`:`<div class="empty-ev"><b>ยังไม่มีโพสต์</b><br>${Auth.canAccessAdmin()?'<a href="#/admin/cposts">เพิ่มโพสต์ที่หลังบ้าน</a>':'กรุณากลับมาใหม่ภายหลัง'}</div>`}</div>`}
PUB.community=cpPage;
const cpAdminBox=()=>{const n=cpHomeN();return `<div class="msg ok">โพสต์ที่เผยแพร่ ${cpAll().length} รายการ · หน้าแรกแสดง ${n>0?n+' รายการบนสุดของรายการนี้':'ไม่แสดงส่วนโพสต์ (ตั้งเป็น 0)'} · <a href="#/community">เปิดหน้ารวมโพสต์</a> · <a href="#/admin/home">ตั้งค่าจำนวนที่หน้าแรก</a></div><p><small>โพสต์ใหม่จะถูกเพิ่มไว้บนสุด เรียงลำดับด้วยปุ่ม ขึ้น/ลง ระบบแสดงเฉพาะข้อมูลที่ผู้ดูแลกรอกเอง ไม่ดึงข้อมูลจากแพลตฟอร์มอัตโนมัติ</small></p>`};
/* ===== หน้าแรก: KDS ในตัวเลข · ข่าวสารและประกาศ · กิจกรรมที่กำลังจะมาถึง
   ใช้ข้อมูลชุดเดียวกับที่ get_public_site() ส่งมาแล้ว ไม่มีการเรียกฐานข้อมูลเพิ่มตอนแสดงผล ===== */
const fmtN=n=>Number(n).toLocaleString('th-TH');
/* ตัวเลขสถิติ: คณะ/สาขานับจากข้อมูลที่เผยแพร่ครบสายต้นสังกัด · นักศึกษา/บุคลากรใช้ค่าที่ผู้ดูแลกรอก · ไม่มีค่าหรือเป็น 0 = ไม่แสดง */
function statsItems(){const h=HD(),L=[];const add=(k,v,lb,d)=>{const n=Math.floor(+v);if(Number.isFinite(n)&&n>0)L.push({k,n,lb:lb||d})};
 add('mj',h.sn_mj,h.sl_mj,'แผนการเรียน');add('fa',h.sn_fa,h.sl_fa,'ระดับชั้นเรียน');add('stu',h.stu,h.sl_stu,'นักเรียน');add('stf',h.stf,h.sl_stf,'คณะครูและบุคลากร');return L}
function statsSec(){const h=HD();if(h.stx)return '';const L=statsItems(),ttl=h.stt||'KDS ในตัวเลข';
 if(!L.length)return Auth.canAccessAdmin()?`<section class="sts"><h2>${E(ttl)}</h2><div class="empty-ev">ยังไม่มีตัวเลขให้แสดง (ผู้เข้าชมทั่วไปจะไม่เห็นส่วนนี้) <a href="#/admin/home">ตั้งค่าที่หลังบ้าน</a></div></section>`:'';
 const SI={stu:ic('grad'),stf:ic('users'),fa:'<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M3 21h18M6 21V4h8v17M14 9h4v12M9 8h2M9 12h2M9 16h2"/></svg>',mj:'<svg viewBox="0 0 24 24" width="1.1em" height="1.1em" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M12 21v-8M12 13c0-4 3-6 7-6 0 4-3 6-7 6zM12 15c0-3-2.5-5-6-5 0 3.2 2.3 5 6 5z"/></svg>'};
 return `<section class="sts" aria-labelledby="sth"><div class="stb"><div class="stt"><h2 id="sth">${E(ttl)}</h2>${h.sta?`<p class="sta">${E(h.sta)}</p>`:''}</div><div class="stg">${L.map(x=>`<div class="stc"><span class="sti" aria-hidden="true">${SI[x.k]||''}</span><div class="stx"><b class="stn" aria-hidden="true" data-to="${x.n}">${fmtN(x.n)}</b><span class="sr">${fmtN(x.n)}</span><span class="stl">${E(x.lb)}</span></div></div>`).join('')}</div></div></section>`}
/* ตัวเลขวิ่งเมื่อเลื่อนเข้าจอ: เล่นครั้งเดียวต่อการเปิดหน้า · ข้ามเมื่อผู้ใช้ตั้งค่าลดการเคลื่อนไหว · ไม่มี JS/IntersectionObserver ก็เห็นตัวเลขจริงทันที */
let STD=false;
function statsMount(){if(STD)return;const els=document.querySelectorAll('.stn[data-to]');if(!els.length)return;
 if(!('IntersectionObserver' in window)||(window.matchMedia&&matchMedia('(prefers-reduced-motion: reduce)').matches)){STD=true;return}
 const run=el=>{const to=+el.dataset.to,t0=performance.now(),du=1400;const step=t=>{const p=Math.min(1,(t-t0)/du);el.textContent=fmtN(Math.round(to*(1-Math.pow(1-p,3))));if(p<1)requestAnimationFrame(step);else el.textContent=fmtN(to)};requestAnimationFrame(step)};
 const io=new IntersectionObserver(en=>{en.forEach(x=>{if(x.isIntersecting){io.unobserve(x.target);STD=true;run(x.target)}})},{threshold:.4});
 els.forEach(el=>{el.textContent=fmtN(0);io.observe(el)})}

/* ===== ข่าวสารและประกาศ ===== */
const nwCat=k=>(NW_CAT.concat(NW_OLD).find(x=>x[0]===k)||['',''])[1],nwOld=k=>NW_OLD.some(x=>x[0]===k);
/* ตัวกรองหมวดหมู่ข่าว: ใช้ข่าวชุดเดียวกัน (site_docs 'news') · หน้ารวมข่าว #/news ใช้ settings.newscats (ว่าง/ครบทุกหมวด = แสดงทุกหมวด) · ส่วน "ข่าวสารและประกาศ" ในหน้า CMS กำหนดเองรายส่วน: s.nm('all'|'some'), s.cats[], s.nn */
const nwCats=a=>(Array.isArray(a)?a:[]).filter(k=>NW_CAT.some(x=>x[0]===k)),nwSel=x=>x&&x.nm==='some'?nwCats(x.cats):null,nwFilt=(L,sel)=>sel?L.filter(n=>sel.includes(n.category)):L;
const nwMainSel=()=>{const st=getSH('settings')||{},c=nwCats(st.newscats);return c.length&&c.length<NW_CAT.length?c:null};
const NWS={key:'',p:{}};
function nwsGo(id,d){NWS.p[id]=(NWS.p[id]||1)+d;render()}
function nwSecView(s){if(NWS.key!==location.hash){NWS.key=location.hash;NWS.p={}}
 const sel=nwSel(s),all=nwFilt(nwAll(),sel),per=Math.max(1,hnOf(s.nn,NW_PER,24)),tot=Math.max(1,Math.ceil(all.length/per)),pg=Math.min(tot,Math.max(1,NWS.p[s.id]||1)),L=all.slice((pg-1)*per,pg*per),sid=E(s.id);
 if(!L.length)return `<div class="fq"><div class="empty-ev"><b>${sel&&!sel.length?'ยังไม่ได้เลือกหมวดหมู่ข่าวสำหรับส่วนนี้':sel?'ยังไม่มีข่าวในหมวดหมู่นี้':'ยังไม่มีข่าว'}</b></div></div>`;
 return `<div class="fq"><div class="nwg">${L.map(nwCard).join('')}</div>${tot>1?`<div class="cppg" role="navigation" aria-label="แบ่งหน้า"><button type="button" class="btn s"${pg>1?'':' disabled'} onclick="nwsGo('${sid}',-1)">ก่อนหน้า</button> <span class="evm">หน้า ${pg} จาก ${tot}</span> <button type="button" class="btn s"${pg<tot?'':' disabled'} onclick="nwsGo('${sid}',1)">ถัดไป</button></div>`:''}</div>`}
const nwChk=(nm,sel)=>NW_CAT.map(([k,t])=>`<label style="display:inline-block;margin-right:14px"><input type="checkbox" name="${nm}" value="${k}"${sel.includes(k)?' checked':''} style="width:auto"> ${E(t)}</label>`).join('');
function nwSecEd(s,n,id){const sel=nwSel(s),some=!!sel,ch=`psync('${id}');render()`;
 return `<p><small>แสดงข่าวชุดเดียวกับ <a href="#/admin/news">จัดการข่าวสารและประกาศ</a> (เฉพาะที่เผยแพร่ เรียงใหม่สุดก่อน)</small></p><label style="display:inline-block;margin-right:14px"><input type="radio" name="${n}nm" value="all"${some?'':' checked'} style="width:auto" onchange="${ch}"> แสดงทุกหมวด</label><label style="display:inline-block"><input type="radio" name="${n}nm" value="some"${some?' checked':''} style="width:auto" onchange="${ch}"> เฉพาะหมวดที่เลือก</label>${some?`<fieldset><legend>หมวดหมู่ที่แสดง (ข่าวหมวดอื่นจะไม่ปะปน)</legend><input type="hidden" name="${n}nx" value="1">${nwChk(n+'nc',sel)}</fieldset>${sel.length?'':'<div class="msg er">ยังไม่ได้เลือกหมวดหมู่ ส่วนนี้จะไม่แสดงข่าว</div>'}`:''}<label>จำนวนข่าวต่อหน้า (1–24)</label><input name="${n}nn" type="number" min="1" max="24" value="${E(s.nn||NW_PER)}">`}
function nwMainEd(){const c=nwMainSel()||[];
 return `<fieldset class="fqfs"><legend>หมวดหมู่ที่แสดงในหน้ารวมข่าว (#/news)</legend><label style="display:inline-block;margin-right:14px"><input type="radio" name="nm_m" value="all"${c.length?'':' checked'} style="width:auto"> แสดงทุกหมวด</label><label style="display:inline-block"><input type="radio" name="nm_m" value="some"${c.length?' checked':''} style="width:auto"> เฉพาะหมวดที่เลือก</label><p>${nwChk('nm_c',c)}</p><p><small>หน้าอื่นกำหนดหมวดได้ที่ส่วน "ข่าวสารและประกาศ (กรองตามหมวด)" ในหน้าเว็บที่จัดการจาก <a href="#/admin/pages">จัดการเมนูและหน้าเว็บ</a> หากเลือกเฉพาะบางหมวด ข่าวที่ยังใช้หมวดเดิมที่ยกเลิกแล้วจะไม่แสดงในหน้านี้จนกว่าจะเลือกหมวดใหม่</small></p><p><button type="button" class="btn b" onclick="nwMainSave()">บันทึกหมวดที่แสดง</button></p></fieldset>`}
async function nwMainSave(){const m=document.querySelector('input[name=nm_m]:checked'),c=nwCats([...document.querySelectorAll('input[name=nm_c]:checked')].map(x=>x.value));
 if(m&&m.value==='some'&&!c.length)return say('กรุณาเลือกอย่างน้อย 1 หมวดหมู่ หรือเลือก "แสดงทุกหมวด"',false);if(!DBH)return say(dbOff(),false);
 try{await putDoc('settings',Object.assign({},getSH('settings')||{},{newscats:m&&m.value==='some'&&c.length<NW_CAT.length?c:[]}));say('บันทึกหมวดที่แสดงในหน้ารวมข่าวเรียบร้อย')}catch(e){dbErr('บันทึกไม่สำเร็จ',e)}}
const nwAll=()=>fqNW().filter(n=>fqIsPub(n)&&okD(n.date)).sort((a,b)=>b.date.localeCompare(a.date));
function nwCard(n){const img=okU(n.image)&&!cpUrlBasic(n.image),cat=nwCat(n.category);
 return `<a class="nwc${img?'':' nwn'}" href="#/news/${encodeURIComponent(n.id)}">${img?`<div class="nwm"><img src="${E(n.image)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.parentNode.classList.add('nwn');this.parentNode.remove()"></div>`:''}<div class="nwb"><div class="nwh">${cat?`<span class="nwtag">${E(cat)}</span>`:''}<span>${E(fmtD(n.date))}</span></div><h3>${E(n.title)}</h3>${n.summary?`<p class="nwt">${E(n.summary)}</p>`:''}<span class="nwgo">อ่านรายละเอียดเพิ่มเติม ${ic('right')}</span></div></a>`}
function pgNav(base,n,tot){const ps=[];for(let i=1;i<=tot;i++)if(i===1||i===tot||Math.abs(i-n)<=1)ps.push(i);const it=[];
 ps.forEach((i,k)=>{if(k&&i-ps[k-1]>1)it.push('<span class="cpel" aria-hidden="true">…</span>');it.push(i===n?`<a href="${base}${i}" aria-current="page" aria-label="หน้า ${i} (หน้าปัจจุบัน)">${i}</a>`:`<a href="${base}${i}" aria-label="ไปหน้า ${i}">${i}</a>`)});
 const pv=n>1?`<a href="${base}${n-1}" rel="prev">${ic('left')} ก่อนหน้า</a>`:'<span class="cpdis">ก่อนหน้า</span>',nx=n<tot?`<a href="${base}${n+1}" rel="next">ถัดไป ${ic('right')}</a>`:'<span class="cpdis">ถัดไป</span>';
 return `<div class="cppg" role="navigation" aria-label="แบ่งหน้า">${pv}${it.join('')}${nx}</div>`}
function nwFeat(n){const img=okU(n.image)&&!cpUrlBasic(n.image),cat=nwCat(n.category);
 return `<a class="nwf${img?'':' nwn'}" href="#/news/${encodeURIComponent(n.id)}">${img?`<img class="nwfi" src="${E(n.image)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.classList.add('nwn');this.remove()">`:''}${cat?`<span class="nwtag nwft">${E(cat)}</span>`:''}<div class="nwfb"><h3>${E(n.title)}</h3>${n.summary?`<p class="nwfs">${E(n.summary)}</p>`:''}<div class="nwff"><span class="nwfd">${E(fmtD(n.date))}</span><span class="nwfa" aria-hidden="true">${ic('right')}</span><span class="sr">อ่านรายละเอียดเพิ่มเติม</span></div></div></a>`}
function nwRow(n){const img=okU(n.image)&&!cpUrlBasic(n.image),cat=nwCat(n.category);
 return `<a class="nwr" href="#/news/${encodeURIComponent(n.id)}">${img?`<div class="nwrm"><img src="${E(n.image)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.remove()"></div>`:''}<div class="nwrb"><div class="nwh">${cat?`<span class="nwtag">${E(cat)}</span>`:''}<span>${E(fmtD(n.date))}</span></div><h3>${E(n.title)}</h3></div><span class="nwra" aria-hidden="true">${ic('right')}</span></a>`}
function newsHomeSec(){const h=HD(),n=hnOf(h.nn,NW_DEF,NW_MAX);if(n<=0)return '';const all=nwAll(),L=all.slice(0,n),ttl=h.nt||NW_T;
 if(!L.length)return Auth.canAccessAdmin()?`<section class="nws"><h2>${E(ttl)}</h2><div class="empty-ev">ยังไม่มีข่าวที่เผยแพร่ (ผู้เข้าชมทั่วไปจะไม่เห็นส่วนนี้) <a href="#/admin/news">เพิ่มข่าวที่หลังบ้าน</a></div></section>`:'';
 return `<section class="nws" aria-labelledby="nwh"><div class="cpt0"><h2 id="nwh">${E(ttl)}</h2>${all.length>L.length?`<a class="cpall" href="#/news">ดูข่าวทั้งหมด (${all.length}) ${ic('right')}</a>`:''}</div><div class="nwg nwhr">${L.map(nwCard).join('')}</div></section>`}
/* หน้าแรก: ข่าวเด่น (ซ้าย) + โพสต์ชุมชน (ขวา) แถวเดียวกัน — ถ้าส่วนใดว่าง อีกส่วนขยายเต็มแถว */
function ncHomeRow(){const a=newsHomeSec(),b=cpHomeSec();if(!a&&!b)return '';return `<div class="nc${a&&b?'':' nc1'}">${a}${b}</div>`}
/* หน้ารวมข่าว #/news/page/<หน้า> · หน้ารายละเอียด #/news/<id> */
function nwList(pg){const all=nwFilt(nwAll(),nwMainSel()),h=HD(),tot=Math.max(1,Math.ceil(all.length/NW_PER));let n=parseInt(pg,10);if(!(n>=1))n=1;if(n>tot)n=tot;const L=all.slice((n-1)*NW_PER,n*NW_PER);
 return `<div class="w sec"><p><a class="bk" href="#/">← กลับหน้าแรก</a></p><h1>${E(h.nt||NW_T)}</h1>${L.length?`<p class="evm" aria-live="polite">ข่าวทั้งหมด ${all.length} รายการ · หน้า ${n} จาก ${tot}</p><div class="nwg">${L.map(nwCard).join('')}</div>${tot>1?pgNav('#/news/page/',n,tot):''}`:`<div class="empty-ev"><b>${nwMainSel()?'ยังไม่มีข่าวในหมวดหมู่นี้':'ยังไม่มีข่าว'}</b><br>${Auth.canAccessAdmin()?'<a href="#/admin/news">เพิ่มข่าวที่หลังบ้าน</a>':'กรุณากลับมาใหม่ภายหลัง'}</div>`}</div>`}
function nwDetail(raw){let id=String(raw||'');try{id=decodeURIComponent(id)}catch(e){}
 const n=fqNW().find(x=>x.id===id&&(fqIsPub(x)||Auth.canAccessAdmin()));if(!n||!okD(n.date))return nf();
 const img=okU(n.image)&&!cpUrlBasic(n.image),cat=nwCat(n.category),ext=!!n.url&&!cpUrlBasic(n.url),
  body=String(n.body||'').split(/\n{2,}/).map(t=>t.trim()).filter(Boolean).map(t=>`<p>${E(t).replace(/\n/g,'<br>')}</p>`).join('');
 return `<div class="w sec nwd"><p><a class="bk" href="#/news">← ${E(HD().nt||NW_T)}ทั้งหมด</a></p>${fqIsPub(n)?'':`<div class="msg">ตัวอย่าง: ข่าวนี้ยังเป็นฉบับร่าง ผู้เข้าชมทั่วไปจะไม่เห็น · <a href="#/admin/news/edit/${E(n.id)}">กลับไปแก้ไข</a></div>`}<article><div class="nwh">${cat?`<span class="nwtag">${E(cat)}</span>`:''}<span>${E(fmtD(n.date))}</span></div><h1>${E(n.title)}</h1>${img?`<img class="nwi" src="${E(n.image)}" alt="" decoding="async" referrerpolicy="no-referrer">`:''}${n.summary?`<p class="pl nwlead">${E(n.summary)}</p>`:''}${body}${ext?`<p><a class="btn b" href="${E(n.url)}" target="_blank" rel="noopener noreferrer">ข้อมูลเพิ่มเติม ${ic('ext')}<span class="sr">(เปิดในแท็บใหม่)</span></a></p>`:''}</article></div>`}
PUB.news=(a,b)=>a&&a!=='page'?nwDetail(a):nwList(b);
/* ตรวจก่อนบันทึกข่าว (เรียกจาก fqClean): คืนข้อความผิดพลาดหรือ '' */
function nwClean(it){it.title=String(it.title||'').trim();if(!it.title)return 'กรุณากรอกหัวข้อข่าว';if([...it.title].length>NW_TTL)return 'หัวข้อข่าวยาวเกิน '+NW_TTL+' ตัวอักษร';
 if(nwOld(it.category))return 'หมวดหมู่เดิมนี้ถูกยกเลิกแล้ว กรุณาเลือกหมวดหมู่ใหม่ 1 ใน 4 หมวด';if(!NW_CAT.some(x=>x[0]===it.category))return 'กรุณาเลือกหมวดหมู่ข่าว';if(!okD(it.date))return 'วันที่เผยแพร่ไม่ถูกต้อง';
 it.summary=String(it.summary||'').trim();it.body=String(it.body||'').trim();
 if([...it.summary].length>NW_SUM)return 'คำอธิบายสั้นยาวเกิน '+NW_SUM+' ตัวอักษร (ตอนนี้ '+[...it.summary].length+')';
 if([...it.body].length>NW_BODY)return 'เนื้อหาข่าวยาวเกิน '+NW_BODY+' ตัวอักษร (ตอนนี้ '+[...it.body].length+')';
 it.image=String(it.image||'').trim();if(it.image){const er=cpUrlBasic(it.image);if(er)return 'ลิงก์รูป: '+er}
 it.url=String(it.url||'').trim();if(it.url){const er=cpUrlBasic(it.url);if(er)return 'ลิงก์ข้อมูลเพิ่มเติม: '+er}
 return ''}
const nwAdminBox=()=>{const n=hnOf(HD().nn,NW_DEF,NW_MAX),od=fqNW().filter(x=>nwOld(x.category)).length;return `${od?`<div class="msg er">มีข่าว ${od} รายการที่ยังใช้หมวดหมู่เดิม (ข่าวมหาวิทยาลัย/ข่าวจากคณะ) ข่าวเหล่านี้ยังแสดงตามปกติและไม่ถูกเปลี่ยนอัตโนมัติ กรุณาเปิดแก้ไขทีละข่าวแล้วเลือกหมวดหมู่ใหม่</div>`:''}<div class="msg ok">ข่าวที่เผยแพร่ ${nwAll().length} รายการ · หน้าแรกแสดง ${n>0?n+' ข่าวล่าสุด':'ไม่แสดงส่วนข่าว (ตั้งเป็น 0)'} · <a href="#/news">เปิดหน้ารวมข่าว</a> · <a href="#/admin/home">ตั้งค่าหน้าแรก</a></div><p><small>เพื่อไม่ให้ข้อมูลที่ผู้เข้าชมโหลดมีขนาดใหญ่เกินไป ระบบส่งให้ผู้เข้าชมเฉพาะข่าวที่เผยแพร่ล่าสุด ${NW_SRV} รายการ ข่าวที่เก่ากว่านั้นยังอยู่ในหลังบ้านแต่จะไม่แสดงต่อสาธารณะ</small></p>${nwMainEd()}`};

/* ===== กิจกรรมที่กำลังจะมาถึง (ใช้ site_docs 'events' เดิม) =====
   ยังไม่ผ่านกำหนด = วันสิ้นสุด (หรือวันเริ่มถ้าไม่มี) อยู่หลังวันนี้ หรือเป็นวันนี้และเวลาสิ้นสุดยังไม่ถึง (ไม่ระบุเวลาสิ้นสุด = นับทั้งวัน) */
const evUp=e=>{const s=evStatus(e);return s==='up'||s==='on'};
/* ลิงก์ไปหน้าปฏิทินกิจกรรมจริง: หน้าที่เผยแพร่และมีส่วน "ปฏิทิน" (ไม่มี = ไม่แสดงลิงก์) */
const evPageHref=()=>{const p=getPages().find(p=>p&&p.status==='published'&&p.slug&&(p.sections||[]).some(s=>s&&s.type==='calendar'));return p?'#/p/'+p.slug:''};
function evHomeSec(){const h=HD(),n=hnOf(h.en,EV_DEF,EV_MAX);if(n<=0)return '';const all=evVis(),L=all.filter(evUp).slice(0,n),ttl=h.et||'กิจกรรมที่กำลังจะมาถึง',lk=evPageHref();
 return `<section class="evs"><div class="cpt0"><h2>${E(ttl)}</h2>${lk&&all.length?`<a class="cpall" href="${E(lk)}">ดูกิจกรรมทั้งหมด (${all.length}) ${ic('right')}</a>`:''}</div>${L.length?`<div class="evcg">${L.map(e=>{const img=okU(e.img)&&!cpUrlBasic(e.img),lk=!!e.url&&!cpUrlBasic(e.url);
  return `<article class="evc${img?'':' evcn'}">${img?`<div class="evcm"><img src="${E(e.img)}" alt="" loading="lazy" decoding="async" referrerpolicy="no-referrer" onerror="this.parentNode.parentNode.classList.add('evcn');this.parentNode.remove()"></div>`:''}<div class="evcb"><span class="evd">${ic('calendar')} ${E(fmtRange(e))}</span><h3>${E(e.title)}</h3><span class="evm">${ic('clock')} ${E(fmtTime(e))}</span>${e.place?`<span class="evm">${ic('pin')} ${E(e.place)}</span>`:''}${e.desc?`<p class="evx">${E(e.desc)}</p>`:''}<p class="evca"><button type="button" class="btn s" onclick="calEv('${e.id}')">รายละเอียด</button>${lk?` <a class="btn s" href="${E(e.url)}" target="_blank" rel="noopener noreferrer">ลิงก์เพิ่มเติม ${ic('ext')}<span class="sr">(เปิดในแท็บใหม่)</span></a>`:''}</p></div></article>`}).join('')}</div>`:'<div class="empty-ev">ยังไม่มีกิจกรรมที่กำลังจะมาถึง</div>'}</section>`}
/* หน้าแรก: ประกาศ (ขวา) — ใช้ข้อมูลข่าวสารเดิม เฉพาะหมวด "ประกาศสำคัญ" · จำนวนตามค่าตั้งของส่วนข่าว (สูงสุด 5) · ว่าง = ซ่อน (แอดมินเห็นข้อความแนะนำ) */
function anHomeSec(){const h=HD(),n=Math.min(5,hnOf(h.nn,NW_DEF,NW_MAX));if(n<=0)return '';const all=nwAll().filter(x=>x.category==='announcement'),L=all.slice(0,n),ttl=nwCat('announcement');
 if(!L.length)return Auth.canAccessAdmin()?`<section class="ans"><div class="cpt0"><h2>${E(ttl)}</h2></div><div class="empty-ev">ยังไม่มีประกาศที่เผยแพร่ (ผู้เข้าชมทั่วไปจะไม่เห็นส่วนนี้) <a href="#/admin/news">เพิ่มประกาศที่หลังบ้าน</a></div></section>`:'';
 return `<section class="ans" aria-labelledby="anh"><div class="cpt0"><h2 id="anh">${E(ttl)}</h2><a class="cpall" href="#/news">ข่าวสารทั้งหมด ${ic('right')}</a></div><div class="nwrs">${L.map(nwRow).join('')}</div></section>`}
/* หน้าแรก: กิจกรรม (ซ้าย) + ประกาศ (ขวา) แถวเดียวกัน — ถ้าส่วนใดว่าง อีกส่วนขยายเต็มแถว */
function eaHomeRow(){const a=evHomeSec(),b=anHomeSec();if(!a&&!b)return '';return `<div class="ea${a&&b?'':' ea1'}">${a}${b}</div>`}

/* ===== เอฟเฟกต์เสียง (สังเคราะห์ด้วย Web Audio ไม่มีไฟล์เสียง; เริ่มหลังผู้ใช้โต้ตอบครั้งแรกเท่านั้น) ===== */
const SND={on:true,vol:50,ctx:null,master:null,ready:false,nav:false};
(function(){try{const v=JSON.parse(localStorage.getItem('kit-sound')||'null');if(v){if(typeof v.on==='boolean')SND.on=v.on;if(Number.isFinite(+v.vol))SND.vol=Math.max(0,Math.min(100,Math.round(+v.vol)))}}catch(e){}})();
const sndSave=()=>{try{localStorage.setItem('kit-sound',JSON.stringify({on:SND.on,vol:SND.vol}))}catch(e){}};
const SND_ICON=(off)=>`<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><path d="M11 5L6 9H2v6h4l5 4V5z"/>${off?'<path d="M22 9l-6 6M16 9l6 6"/>':'<path d="M15.5 8.5a5 5 0 010 7M18.5 5.5a9 9 0 010 13"/>'}</svg>`;
const sndLabel=()=>SND.on&&SND.vol>0?'ปิดเสียงเอฟเฟกต์':'เปิดเสียงเอฟเฟกต์';
const soundBtn=()=>`<div class="sndw"><button type="button" class="snd" onclick="sndToggle()" aria-pressed="${SND.on}" title="${sndLabel()}" aria-label="${sndLabel()}">${SND_ICON(!SND.on||SND.vol===0)}</button><div class="sndp" role="group" aria-label="ระดับเสียง"><input type="range" class="sndr" min="0" max="100" step="1" value="${SND.vol}" oninput="sndVol(this.value)" onchange="sndPrev()" aria-label="ระดับเสียง" aria-valuetext="${SND.vol}%"><span class="sndv">${SND.vol}%</span></div></div>`;
function sndSync(){try{document.querySelectorAll('.sndw').forEach(w=>{const b=w.querySelector('.snd'),r=w.querySelector('.sndr'),t=w.querySelector('.sndv');if(b){b.innerHTML=SND_ICON(!SND.on||SND.vol===0);b.title=sndLabel();b.setAttribute('aria-label',sndLabel());b.setAttribute('aria-pressed',String(SND.on))}if(r&&String(r.value)!==String(SND.vol)){r.value=SND.vol;r.setAttribute('aria-valuetext',SND.vol+'%')}if(t)t.textContent=SND.vol+'%'})}catch(e){}}
function sndInit(){if(SND.ready)return;try{const AC=window.AudioContext||window.webkitAudioContext;if(!AC)return;if(!SND.ctx){SND.ctx=new AC();SND.master=SND.ctx.createGain();SND.master.connect(SND.ctx.destination)}SND.ready=true}catch(e){}}
function sndWake(){try{if(!SND.ready)sndInit();if(SND.ctx&&SND.ctx.state==='suspended')SND.ctx.resume()}catch(e){}}
function sndNote(f0,f1,dur,g,delay){const x=SND.ctx;if(!x)return;const t=x.currentTime+(delay||0),o=x.createOscillator(),e=x.createGain();o.type='sine';o.frequency.setValueAtTime(f0,t);if(f1!==f0)o.frequency.exponentialRampToValueAtTime(f1,t+dur);e.gain.setValueAtTime(0.0001,t);e.gain.exponentialRampToValueAtTime(g,t+0.012);e.gain.exponentialRampToValueAtTime(0.0001,t+dur);o.connect(e);e.connect(SND.master);o.start(t);o.stop(t+dur+0.03)}
const SNDFX={click:()=>{sndNote(1040,820,0.07,0.5)},nav:()=>{sndNote(660,880,0.11,0.45);sndNote(990,1320,0.14,0.3,0.07)},open:()=>{sndNote(520,780,0.11,0.45)},close:()=>{sndNote(780,520,0.1,0.35)},tick:()=>{sndNote(880,880,0.05,0.4)}};
function sndPlay(k){try{if(!SND.on||SND.vol<=0||!SND.ready||!SND.ctx||SND.ctx.state!=='running')return;SND.master.gain.value=Math.pow(SND.vol/100,1.6)*0.5;SNDFX[k]&&SNDFX[k]()}catch(e){}}
function sndToggle(){sndWake();if(!SND.on&&SND.vol===0)SND.vol=50;else SND.on=!SND.on;sndSave();sndSync();if(SND.on)sndPlay('tick');const w=document.querySelector('.sndw');if(w&&w.classList)w.classList.add('open')}
function sndVol(v){sndWake();SND.vol=Math.max(0,Math.min(100,Math.round(+v)||0));if(SND.vol>0)SND.on=true;sndSave();sndSync()}
function sndPrev(){sndWake();sndPlay('tick')}
(function(){try{
 const first=()=>sndWake();
 ['pointerdown','touchstart','keydown'].forEach(ev=>document.addEventListener(ev,first,{capture:true,passive:true}));
 document.addEventListener('click',e=>{try{const t=e.target&&e.target.closest?e.target:null;if(!t)return;
  if(!t.closest('.sndw'))document.querySelectorAll('.sndw.open').forEach(w=>w.classList.remove('open'));
  if(t.closest('.sndp'))return;
  const el=t.closest('button,a,[role="button"],.cd,.ev,.mh');if(!el)return;
  if(el.classList.contains('snd'))return;
  const oc=el.getAttribute('onclick')||'';
  if(el.classList.contains('ddb')){sndPlay(el.getAttribute('aria-expanded')==='true'?'open':'close');return}
  if(el.classList.contains('burger')||/\bsbt\(|\bnv\(/.test(oc)){sndPlay('open');return}
  if(/\bcalClose\(|innerHTML=''/.test(oc)||el.classList.contains('mx')){sndPlay('close');return}
  if(/\bqask\(|\bqren\(|\bqdel\(|\bevask\(|\bpask\(|\bmask\(|\bcalEv\(/.test(oc)){sndPlay('open');return}
  const h=el.tagName==='A'?(el.getAttribute('href')||''):'';
  if(h.startsWith('#/')&&h!==(location.hash||'#/'))return;
  sndPlay('click')}catch(er){}},true);
 addEventListener('hashchange',()=>{if(SND.nav)sndPlay('nav')});
 setTimeout(()=>{SND.nav=true},0);
}catch(e){}})();
function setTitle(p){const s=getSet();let t=s.nameTh+' | '+s.nameEn+' ('+BRAND.short+')';if(p[0]==='admin')t='Admin · '+BRAND.short+' | '+s.nameTh;else if(p[0]==='faculty'){const q=fqPub().F.find(x=>x.id===p[1]);if(q)t=q.nameTh+' | '+s.nameTh}else if(p[0]==='program'){const q=fqPub().P.find(x=>x.id===p[1]);if(q)t=q.nameTh+' | '+s.nameTh}else if(p[0]==='club'){const q=clAll().find(x=>x.id===p[1]);if(q)t=q.name+' | '+s.nameTh}else if(p[0]==='community')t=(HD().pt||CP_T)+' | '+s.nameTh;else if(p[0]==='news'){let q=null;if(p[1]&&p[1]!=='page'){let k=p[1];try{k=decodeURIComponent(k)}catch(er){}q=fqNW().find(x=>x.id===k&&fqIsPub(x))}t=(q?q.title:(HD().nt||NW_T))+' | '+s.nameTh}else if(p[0]==='courses')t='รายวิชาทั้งหมด | '+s.nameTh;else if(p[0]==='course'){let k='';try{k=cqNorm(decodeURIComponent(p[1]||''))}catch(er){}const q=k&&crsIndex().get(k);if(q)t=q.code+' '+q.name+' | '+s.nameTh}else if(p[0]==='p'){const q=getPages().find(x=>x.slug===p[1]&&x.status==='published');if(q)t=q.title+' | '+s.nameTh}document.title=t}
function render(){const h=location.hash||'#/',p=h.replace(/^#\/?/,'').split('/');if(h!==last){if(innerWidth<760)sbc=true;toast=null;WC={};last=h}
 setTitle(p);let html;try{if(p[0]==='admin')html=admin(p.slice(1));else html=shell(p[0]===''?homeView():PUB[p[0]]?PUB[p[0]](p[1],p[2]):nf())}catch(e){html='<div class="w sec"><div class="msg er">เกิดข้อผิดพลาด: '+E(e.message)+'</div></div>'}
 const y=scrollY;$('app').innerHTML=html;sndSync();cmMount();ceMount();fqPlFilter();statsMount();if(h===last&&!document.activeElement.matches('input,textarea'))scrollTo(0,y)}
addEventListener('hashchange',()=>{render();scrollTo(0,0)});render();initDb();document.addEventListener('click',e=>{if(!e.target.closest('.dd'))closeDd()});document.addEventListener('keydown',e=>{if(e.key==='Escape'){$('md').innerHTML='';const d=document.activeElement&&document.activeElement.closest('.dd');closeDd();if(d)document.activeElement.blur()}});
