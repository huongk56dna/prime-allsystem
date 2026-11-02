import test from 'node:test';import assert from 'node:assert/strict';import {seedAdmin,saveRole,saveUser,hasRight,notificationsFor,diffActivity,userContext,appContext,seedFieldApps} from '../docs/admin-domain.js';import {ROLES,PLANTS} from '../docs/access.js';import {parseCSV,validateStockRows,IMPORT_FIELDS} from '../docs/stock-import.js';
const base=()=>{const s={};seedAdmin(s,ROLES,[]);return s;};
test('custom roles union rights and users require a unique email or phone',()=>{const s=base();const role=saveRole(s,{name:'Kho chỉ xem',scope:'plant',permissions:{stock:['view']}},'cmc-test');const u=saveUser(s,{name:'An',email:'an@example.com',phone:'',roles:[role.id],plant:PLANTS[0],status:'active'},'cmc-test',PLANTS);assert.equal(hasRight(s,u.id,'stock','view'),true);assert.equal(hasRight(s,u.id,'stock','import'),false);assert.equal(hasRight(s,u.id,'roles','manage'),false);assert.equal(userContext(s,u.id,'all').plant,PLANTS[0]);assert.throws(()=>saveUser(s,{...u,id:'new'},'cmc-test',PLANTS));assert.throws(()=>saveRole(s,{name:'Denied',scope:'all',permissions:{}},u.id));u.status='inactive';assert.equal(hasRight(s,u.id,'stock','view'),false);});
test('cannot create write-only role or overwrite protected admin',()=>{const s=base();assert.throws(()=>saveRole(s,{name:'Invalid',scope:'plant',permissions:{stock:['import']}},'cmc-test'));assert.throws(()=>saveUser(s,{id:'cmc-test'},'cmc-test',PLANTS));assert.throws(()=>saveRole(s,{id:'system-admin',name:'Changed',scope:'all',permissions:{}},'cmc-test'));});
test('notifications are recipient and factory scoped; audit omits field values',()=>{const s=base();s.notifications.push({id:'other',userIds:['other'],roles:['Kho'],plantId:PLANTS[1],at:new Date().toISOString()});assert.equal(notificationsFor(s,'cmc-test','Kho',PLANTS[0]).length,1);const next=structuredClone(s);next.users[0].email='private@example.com';const logs=diffActivity(s,next,'Admin',PLANTS[0],'web/roles');assert.equal(logs.length,1);assert.ok(logs[0].details.includes('email'));assert.ok(!JSON.stringify(logs).includes('private@example.com'));});
const mapping=Object.fromEntries(IMPORT_FIELDS.map(([k],i)=>[k,i]));const row=['PR-1',PLANTS[0],'K1-A01','L1','A01','Loại 1','0','Đạt chất lượng','2026-10-31'];
test('import validates scope, quantity, date, duplicates and deterministic replacement',()=>{const ps=[{id:'PR-1'}];let out=validateStockRows([row],mapping,ps,PLANTS,PLANTS[0],[]);assert.equal(out.valid[0].qty,0);assert.equal(out.errors.length,0);const id=out.valid[0].id;out=validateStockRows([[...row.slice(0,6),'12',...row.slice(7)]],mapping,ps,PLANTS,PLANTS[0],out.valid);assert.equal(out.valid[0].id,id);assert.equal(out.valid[0].operation,'Cập nhật');assert.equal(validateStockRows([row,row],mapping,ps,PLANTS,'all',[]).errors.length,1);assert.equal(validateStockRows([row],mapping,ps,PLANTS,PLANTS[1],[]).errors.length,1);for(const [index,value] of [[6,''],[6,'-1'],[8,'2026-02-30'],[0,'UNKNOWN']]){let bad=[...row];bad[index]=value;assert.equal(validateStockRows([bad],mapping,ps,PLANTS,'all',[]).errors.length,1);}});
test('CSV accepts Excel BOM, quoted separators and multiline data',()=>{assert.deepEqual(parseCSV('a,b\n"A, B","one\ntwo"'),[['a','b'],['A, B','one\ntwo']]);assert.throws(()=>parseCSV('a,b\n"unclosed'));});

test('Sales and gate apps use role permissions and the user factory like the Web',()=>{
 const s=base(),role=name=>s.roles.find(r=>r.name===name);
 assert.equal(hasRight(s,'user-sales-tp','sales','create'),true);assert.equal(hasRight(s,'user-sales-tp','guard','view'),false);
 assert.equal(hasRight(s,'user-bv-tp','guard','create'),true);assert.equal(hasRight(s,'user-bv-tp','sales','view'),false);assert.equal(hasRight(s,'user-bv-tp','orders','view'),false);
 assert.equal(hasRight(s,'user-kho-tp','guard','view'),false);assert.equal(hasRight(s,'user-kho-tp','stock','view'),true);
 assert.deepEqual(appContext(s,'user-bv-tp','guard','all',PLANTS),{role:'Bảo vệ',all:false,plant:PLANTS[0]});
 assert.deepEqual(appContext(s,'user-bv-dv','guard',PLANTS[0],PLANTS),{role:'Bảo vệ',all:false,plant:PLANTS[1]});
 assert.equal(appContext(s,'user-sales-tp','sales','all',PLANTS).plant,PLANTS[0]);
 const ceo=saveUser(s,{name:'CEO',email:'ceo@example.com',phone:'',roles:[role('CEO').id],plant:PLANTS[2],status:'active'},'cmc-test',PLANTS);
 assert.equal(appContext(s,ceo.id,'guard','all',PLANTS).plant,PLANTS[2]);assert.equal(appContext(s,ceo.id,'guard',PLANTS[1],PLANTS).plant,PLANTS[1]);assert.equal(appContext(s,ceo.id,'sales','all',PLANTS).plant,'all');
});
test('field app migration upgrades stored roles once and keeps custom data',()=>{
 const s=base();delete s.fieldAppsV1;s.roles=s.roles.filter(r=>r.name!=='Sales');s.users=s.users.filter(u=>!u.id.startsWith('user-sales')&&!u.id.startsWith('user-bv'));
 for(const r of s.roles)if(r.system&&r.id!=='system-admin')r.permissions.guard=['view','create','update'];
 const custom=saveRole(s,{name:'Bảo vệ ca đêm',scope:'plant',permissions:{guard:['view','update']}},'cmc-test');
 seedFieldApps(s);
 assert.ok(s.roles.some(r=>r.name==='Sales'&&r.system));assert.deepEqual(s.roles.find(r=>r.name==='Kho').permissions.guard,[]);
 assert.deepEqual(s.roles.find(r=>r.id===custom.id).permissions.guard,['view','update']);
 assert.equal(s.users.filter(u=>u.id==='user-bv-dv').length,1);seedFieldApps(s);assert.equal(s.users.filter(u=>u.id==='user-bv-dv').length,1);
});
