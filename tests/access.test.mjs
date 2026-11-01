import test from 'node:test';
import assert from 'node:assert/strict';
import {ROLES,roleContext,PLANTS,scopedRows,canViewRecord,customerPlant} from '../docs/access.js';
import {fixtures,lots} from '../docs/data.js';
const snapshot=fixtures();
test('six plant roles cannot select all or the other plant',()=>{
 for(const role of ROLES.filter(r=>!r.all)){
  for(const filter of ['all',...PLANTS,'unknown']){
   const ctx=roleContext(role.name,filter);
   assert.equal(ctx.plant,role.plant);
   assert.ok(scopedRows(lots,'lots',ctx).every(r=>r.plant===role.plant));
   assert.equal(scopedRows(lots,'lots',ctx).length,lots.filter(l=>l.plant===role.plant).length);
   assert.ok(scopedRows(snapshot.orders,'orders',ctx).every(o=>customerPlant(o.customer)===role.plant));
   assert.equal(canViewRecord({id:'unknown'},'receipts',ctx),false);
  }
 }
});
test('four group roles can view both plants or narrow to one',()=>{
 assert.equal(ROLES.filter(r=>r.all).length,4);
 for(const role of ROLES.filter(r=>r.all)){
  assert.equal(scopedRows(lots,'lots',roleContext(role.name)).length,12);
  for(const plant of PLANTS){
   const ctx=roleContext(role.name,plant);
   assert.equal(scopedRows(lots,'lots',ctx).length,lots.filter(l=>l.plant===plant).length);
   assert.ok(scopedRows(lots,'lots',ctx).every(r=>r.plant===plant));
  }
 }
});
test('AR, planning and export documents keep their owning plant',()=>{
 const A=roleContext('Sales Admin'),B=roleContext('Kế toán trưởng');
 assert.deepEqual(scopedRows(snapshot.receipts,'receipts',A).map(r=>r.id),['TH-001','TH-003']);
 assert.deepEqual(scopedRows(snapshot.receipts,'receipts',B).map(r=>r.id),['TH-002']);
 assert.equal(scopedRows(snapshot.documents,'documents',A).length,0);
 assert.equal(scopedRows(snapshot.documents,'documents',B).length,6);
 assert.equal(scopedRows(snapshot.plans,'plans',A)[0].plant,'Prime Tiền Phong');
 assert.equal(scopedRows(snapshot.plans,'plans',B)[0].plant,'Prime Đại Việt');
});
test('scope reads do not mutate or remove existing data',()=>{
 const before=JSON.stringify(snapshot);
 for(const role of ROLES)for(const [kind,rows] of Object.entries(snapshot))if(Array.isArray(rows))scopedRows(rows,kind,roleContext(role.name));
 assert.equal(JSON.stringify(snapshot),before);
});
