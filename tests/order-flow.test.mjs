import test from 'node:test';import assert from 'node:assert/strict';
import {convertPieces,availableArea,validateOrder} from '../docs/order-flow.js';
import {products,customers,lots} from '../docs/data.js';
test('piece / box / area / price conversion follows SKU packaging',()=>{
 const p60=products.find(p=>p.size==='60 × 60'),p80=products.find(p=>p.size==='80 × 80'),p120=products[0];
 assert.deepEqual(convertPieces(p60,13),{valid:true,pieces:13,boxes:2,loose:1,area:4.68,amount:1006200});
 assert.equal(convertPieces(p80,8).boxes,2);assert.equal(convertPieces(p80,8).area,5.12);
 assert.equal(convertPieces(p120,5).boxes,2);assert.equal(convertPieces(p120,5).loose,1);assert.equal(convertPieces(p120,5).area,3.6);
 for(const qty of [0,-1,1.5,NaN,''])assert.equal(convertPieces(p60,qty).valid,false);
});
test('customer and SKU are required, and wrong factory selections are rejected',()=>{
 const value={customer:'NPP-001',date:'2026-11-01',lines:[{product:products[0].id,pieces:10}]};
 assert.equal(validateOrder(value,[products[0]],[customers[0]]),null);
 assert.ok(validateOrder({...value,customer:''},products,customers));
 assert.ok(validateOrder({...value,lines:[{product:'',pieces:1}]},products,customers));
 assert.ok(validateOrder(value,[products[1]],[customers[0]]));
});
test('orders exceeding credit limit can still be created for approval',()=>{
 const value={customer:'NPP-001',date:'2026-11-01',lines:[{product:products[0].id,pieces:2400}]};
 assert.ok(convertPieces(products[0],2400).amount>customers[0].limit);
 assert.equal(validateOrder(value,products,customers),null);
});
test('availability excludes held quality and stock reserved at the same plant',()=>{
 const id=products[0].id,plant='Prime Tiền Phong';
 const orders=[{plantId:plant,status:'Đã xác nhận',lines:[{product:id,area:200,deliveredArea:50}]},{plantId:'Prime Đại Việt',status:'Đang giao',lines:[{product:id,area:400}]}];
 assert.equal(availableArea(id,lots,orders,plant),1640-150);
 assert.equal(availableArea(id,lots,orders,'Prime Ngói Việt'),0);
});
