import test from 'node:test';
import assert from 'node:assert/strict';
import {translateText,setLanguage,currentLanguage,languagePicker,protectText,freeTextHTML,historyHTML,number,locale} from '../docs/i18n.js';
import {translations} from '../docs/translations.js';
import {IMPORT_FIELDS,validateStockRows} from '../docs/stock-import.js';

test('catalog has complete, unique three-language entries',()=>{
 assert.equal(new Set(translations.map(r=>r[0])).size,translations.length);
 for(const row of translations){assert.equal(row.length,3);for(const cell of row)assert.ok(typeof cell==='string'&&cell.trim(),row[0]);}
});
test('roles, financial and production statuses have precise translations',()=>{
 assert.equal(translateText('Chưa xác nhận','en'),'Unconfirmed');
 assert.equal(translateText('Đã xác nhận','en'),'Confirmed');
 assert.equal(translateText('Chưa xác định','th'),'ยังไม่ระบุ');
 assert.equal(translateText('Chờ Nhà máy duyệt','th'),'รอโรงงานอนุมัติ');
 assert.equal(translateText('Kế toán trưởng','en'),'Chief Accountant');
 assert.equal(translateText('Giám đốc Thương mại','th'),'ผู้อำนวยการฝ่ายพาณิชย์');
 assert.equal(translateText('TT chưa đủ khoản đến hạn','en'),'TT Payment Due Not Met');
 assert.equal(translateText('TT đã đủ khoản đến hạn','en'),'TT Payment Due Met');
});
test('dynamic labels use a single pass without translating IDs or unrelated substrings',()=>{
 assert.equal(translateText('XE-001 · 88C12345 đã vào cổng · SO-001','en'),'XE-001 · 88C12345 entered the gate · SO-001');
 assert.equal(translateText('PR-60120-01 · 60 viên','th'),'PR-60120-01 · 60 แผ่น');
 assert.equal(translateText('forexport-documents-code','en'),'forexport-documents-code');
 assert.equal(translateText('Mã / tên sản phẩm','en'),'Product Code / Name');
});
test('language changes persist independently of business data and reject invalid codes',()=>{
 const original={role:'Kho',status:'Đã duyệt',term:'TT đặt cọc',pieces:120};const snapshot=structuredClone(original);
 setLanguage('th');assert.equal(currentLanguage(),'th');assert.match(languagePicker(),/value="th" selected/);assert.equal(locale(),'th-TH-u-ca-gregory');
 setLanguage('en');assert.equal(number(1200.5),'1,200.5');assert.deepEqual(original,snapshot);
 setLanguage('vi');assert.throws(()=>setLanguage('xx'));assert.equal(currentLanguage(),'vi');
});
test('proper names and free-form evidence remain unmodified and escaped',()=>{
 protectText(['NPP An Phú','Prime Tiền Phong','Customer Test']);
 assert.equal(translateText('NPP An Phú','th'),'NPP An Phú');
 assert.equal(translateText('Customer Test','th'),'Customer Test');
 assert.equal(freeTextHTML('Đã duyệt <script>'),'<span data-i18n-skip>Đã duyệt &lt;script&gt;</span>');
 assert.equal(historyHTML('Thương mại chốt phương án · Giữ nguyên ghi chú'), 'Thương mại chốt phương án · <span data-i18n-skip>Giữ nguyên ghi chú</span>');
 protectText(['Kế toán xuất khẩu · Tiền Phong']);
 assert.equal(historyHTML('Chuyển tài khoản xem thử từ Kế toán xuất khẩu · Tiền Phong'),'Chuyển tài khoản xem thử từ Kế toán xuất khẩu · Tiền Phong');
});
test('export headers and permission errors translate without reversing their meaning',()=>{
 assert.equal(translateText('Viên / hộp','en'),'Pieces / Box');
 assert.equal(translateText('Số tiền thỏa thuận','th'),'จำนวนเงินตามข้อตกลง');
 assert.equal(translateText('Không có quyền xuất file','en'),'Export permission is required');
 assert.equal(translateText('Role and Permission','vi'),'Vai trò và phân quyền');
 assert.equal(translateText('B/L nháp chưa đạt','en'),'Draft B/L has not passed verification');
});
test('translated import templates retain canonical inventory quality and numeric stock',()=>{
 const map=Object.fromEntries(IMPORT_FIELDS.map(([key],i)=>[key,i]));
 for(const lang of ['en','th']){
  const rows=[['SKU-1','Plant A','A01','LOT-1','S01','Loại 1',0,translateText('Đạt chất lượng',lang),'2026-11-01']];
  const result=validateStockRows(rows,map,[{id:'SKU-1'}],['Plant A'],'Plant A',[]);
  assert.equal(result.errors.length,0);assert.equal(result.valid[0].quality,'Đạt chất lượng');assert.equal(result.valid[0].qty,0);
 }
});
