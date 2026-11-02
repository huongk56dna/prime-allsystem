import {translations} from './translations.js?v=24';

const KEY='prime-language-v1';
export const LANGUAGES={vi:'VN · Tiếng Việt',en:'EN · English',th:'TH · ไทย'};
let language='vi';
try{const saved=globalThis.localStorage?.getItem(KEY);if(saved in LANGUAGES)language=saved;}catch{}
const dictionary=new Map(translations.map(row=>[row[0],row]));
const escapeRE=s=>s.replace(/[.*+?^${}()|[\]\\]/g,'\\$&');
const keys=[...dictionary.keys()].sort((a,b)=>b.length-a.length);
const matcher=new RegExp(keys.map(escapeRE).join('|'),'gu');
const protectedValues=new Set();
const viLabels={'Role and Permission':'Vai trò và phân quyền','Activity Log':'Nhật ký hoạt động','Role':'Vai trò','Module':'Chức năng','Sheet':'Trang tính','Customer':'Khách hàng','Country':'Quốc gia','Version':'Phiên bản','Ready':'Sẵn sàng','Valid until':'Hiệu lực đến','Total':'Tổng cộng','Currency':'Tiền tệ','Prepared':'Ngày lập','Shipment':'Lô giao hàng','Shipment Master':'Thông tin lô giao hàng','Container':'Công-ten-nơ','Seal':'Niêm phong','Net kg':'Tịnh kg','Web':'Web','Customer App':'Ứng dụng khách hàng','Sales App':'Ứng dụng Sales','overview':'Tổng quan','stock':'Tồn kho','orders':'Đơn hàng','ar':'Công nợ','market':'Thị trường','plans':'Kế hoạch','export':'Đơn xuất khẩu','documents':'Chứng từ','roles':'Vai trò','activity':'Hoạt động','sales':'Sales','customer':'Khách hàng','guard':'Bảo vệ','receipts':'Khoản thu','surveys':'Khảo sát','visits':'Chuyến thăm','sellouts':'Số bán ra','inventoryLots':'Tồn theo lô','users':'Người dùng','notifications':'Thông báo','account':'Tài khoản','exportOrders':'Đơn xuất khẩu','exportQuotes':'Báo giá xuất khẩu','exportProduction':'Sản xuất xuất khẩu','exportShipments':'Giao hàng xuất khẩu','exportDocuments':'Chứng từ xuất khẩu','guardTrucks':'Xe ra vào','guardInvoiceRequests':'Yêu cầu hóa đơn'};
Object.assign(viLabels,{'BUSINESS EXPERIENCE':'TRẢI NGHIỆM DOANH NGHIỆP','PRIME BUSINESS SYSTEM':'HỆ THỐNG KINH DOANH PRIME','Prime Business System':'Hệ thống kinh doanh Prime','PRIME BUSINESS WORKSPACE':'KHÔNG GIAN LÀM VIỆC PRIME','Prime Business Workspace':'Không gian làm việc Prime','PRIME EXPORT OPERATIONS':'ĐIỀU HÀNH XUẤT KHẨU PRIME','Export Excel':'Xuất Excel','Import':'Nhập dữ liệu','PROFORMA INVOICE':'HÓA ĐƠN CHIẾU LỆ','QUOTATION':'BÁO GIÁ','Sell-out':'Số bán ra','Booking':'Đặt chỗ vận chuyển'});
const vietnameseLabel=key=>(viLabels[key]||key).replace(/\bRole\b/g,'Vai trò').replace(/\brole\b/g,'vai trò').replace(/\buser\b/g,'người dùng').replace(/\bShipment\b/g,'Lô giao hàng').replace(/\bshipment\b/g,'lô giao hàng').replace(/\bImport\b/g,'Nhập dữ liệu').replace(/\bimport\b/g,'nhập dữ liệu');
export const currentLanguage=()=>language;
export const locale=()=>({vi:'vi-VN',en:'en-GB',th:'th-TH-u-ca-gregory'})[language];
export const number=(value,options={})=>Number(value||0).toLocaleString(locale(),{maximumFractionDigits:2,...options});
export const dateTime=value=>value?new Date(value).toLocaleString(locale()):'—';
export function protectText(values){for(const value of values){if(typeof value==='string'&&value.trim())protectedValues.add(value);}}
export function translateText(value,target=language){
 if(typeof value!=='string'||!value)return value;
 if(protectedValues.has(value))return value;
 const column=target==='en'?1:target==='th'?2:0;
 const direct=dictionary.get(value.trim());
 if(direct)return value.replace(value.trim(),column===0?vietnameseLabel(value.trim()):direct[column]);
 // One pass over source text: translated output is never translated a second time.
 return value.replace(matcher,(match,offset,source)=>{
  const before=source[offset-1]||'',after=source[offset+match.length]||'';
  if((/[\p{L}\p{N}_]/u.test(match[0])&&/[\p{L}\p{N}_-]/u.test(before))||(/[\p{L}\p{N}_]/u.test(match.at(-1))&&/[\p{L}\p{N}_-]/u.test(after)))return match;
  for(const p of protectedValues){const start=source.lastIndexOf(p,offset);if(start>=0&&offset>=start&&offset+match.length<=start+p.length)return match;}
  return column===0?vietnameseLabel(match):dictionary.get(match)[column];
 });
}
export function languagePicker(){return `<label class="language-control"><span class="sr-only">Ngôn ngữ</span><select data-language-picker aria-label="Ngôn ngữ">${Object.entries(LANGUAGES).map(([code,label])=>`<option value="${code}" ${language===code?'selected':''}>${label}</option>`).join('')}</select></label>`;}
const htmlEscape=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
export const freeTextHTML=value=>`<span data-i18n-skip>${htmlEscape(value)}</span>`;
export function historyHTML(value){value=String(value??'');let split=value.indexOf(' · ');while(split>=0&&[...protectedValues].some(p=>{const at=value.indexOf(p);return at>=0&&split>=at&&split<at+p.length;}))split=value.indexOf(' · ',split+3);return split<0?htmlEscape(value):htmlEscape(value.slice(0,split))+' · '+freeTextHTML(value.slice(split+3));}
const texts=new WeakMap(),attributes=new WeakMap();
function localizeNode(node){
 if(node.nodeType===3){
  if(!node.data.trim()||node.parentElement?.closest('script,style,textarea,[data-i18n-skip],[data-language-picker]'))return;
  let item=texts.get(node);if(!item||node.data!==item.last)item={source:node.data,last:node.data};
  item.last=translateText(item.source);if(node.data!==item.last)node.data=item.last;texts.set(node,item);return;
 }
 if(node.nodeType!==1||node.matches('script,style,textarea,[data-i18n-skip]'))return;
 // Native option values are business identifiers, never localized labels.
 if(node.tagName==='OPTION'&&!node.hasAttribute('value'))node.setAttribute('value',node.textContent);
 for(const name of ['placeholder','title','aria-label','alt','label'])if(node.hasAttribute(name)){
  const value=node.getAttribute(name);let cache=attributes.get(node)||{};let item=cache[name];if(!item||item.last!==value)item={source:value,last:value};item.last=translateText(item.source);if(value!==item.last)node.setAttribute(name,item.last);cache[name]=item;attributes.set(node,cache);
 }
 if(node.matches('[data-language-picker]'))return;
 if(node.tagName==='INPUT'&&node.readOnly&&node.type==='text'){
  let cache=attributes.get(node)||{},item=cache.value;if(!item||item.last!==node.value)item={source:node.value,last:node.value};item.last=translateText(item.source);node.value=item.last;cache.value=item;attributes.set(node,cache);
 }
 if(node.tagName==='INPUT'&&node.type==='file'&&!node.closest('.file-btn')&&!node.dataset.i18nFile){
  node.dataset.i18nFile='true';node.classList.add('i18n-file-native');
  const button=document.createElement('button'),name=document.createElement('span');button.type='button';button.className='i18n-file-button';button.textContent='Chọn file';name.className='i18n-file-name';name.textContent='Chưa chọn tệp';
  button.addEventListener('click',event=>{event.preventDefault();event.stopPropagation();node.click();});
  node.addEventListener('change',()=>{name.toggleAttribute('data-i18n-skip',!!node.files.length);name.textContent=node.files.length?Array.from(node.files).map(f=>f.name).join(', '):'Chưa chọn tệp';});
  node.after(button,name);localizeNode(button);localizeNode(name);
 }
 for(const child of node.childNodes)localizeNode(child);
}
export function localize(root=globalThis.document?.body){if(root)localizeNode(root);}
export function setLanguage(code){
 if(!(code in LANGUAGES))throw Error('Unsupported language');
 language=code;try{globalThis.localStorage?.setItem(KEY,code);}catch{}
 if(globalThis.document){document.documentElement.lang=code;document.title=translateText('Prime · Hệ thống kinh doanh');localize();document.querySelectorAll('[data-language-picker]').forEach(el=>el.value=code);document.dispatchEvent(new CustomEvent('prime-language-change',{detail:code}));}
}
export function startLocalization(){
 document.documentElement.lang=language;document.title=translateText('Prime · Hệ thống kinh doanh');
 document.addEventListener('change',event=>{if(event.target.matches('[data-language-picker]'))setLanguage(event.target.value);});
 const validationMessage=el=>translateText(el.validity.valueMissing?'Vui lòng bổ sung trường bắt buộc.':el.validity.typeMismatch?'Nhập email hợp lệ.':el.validity.rangeOverflow||el.validity.rangeUnderflow?'Giá trị ngoài khoảng cho phép.':el.validity.stepMismatch?'Nhập số đúng bước quy định.':'Nhập giá trị hợp lệ.');
 document.addEventListener('invalid',event=>{if(event.target.setCustomValidity)event.target.setCustomValidity(validationMessage(event.target));},true);
 document.addEventListener('input',event=>{if(event.target.setCustomValidity)event.target.setCustomValidity('');},true);
 document.addEventListener('prime-language-change',()=>{document.querySelectorAll('input,select,textarea').forEach(el=>{if(el.validity.customError){el.setCustomValidity('');if(!el.validity.valid)el.setCustomValidity(validationMessage(el));}});});
 const observer=new MutationObserver(records=>{observer.disconnect();for(const record of records){if(record.type==='characterData')localizeNode(record.target);else if(record.type==='attributes')localizeNode(record.target);else for(const node of record.addedNodes)localizeNode(node);}observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label','alt','label']});});
 localize();observer.observe(document.body,{subtree:true,childList:true,characterData:true,attributes:true,attributeFilter:['placeholder','title','aria-label','alt','label']});
}
