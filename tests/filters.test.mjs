import test from 'node:test';import assert from 'node:assert/strict';
import {matchesModuleRow as match} from '../docs/filters.js';
import {products,customers,fixtures,lots} from '../docs/data.js';
const refs={products,customers},s=fixtures();
test('stock filters search, size, quality and production dates together',()=>{
 const filter={search:'calacatta',size:'60 × 120',quality:'Đạt chất lượng',from:'2026-10-01',to:'2026-10-20'};
 const rows=lots.filter(l=>match(l,'lots',filter,refs));assert.equal(rows.length,1);assert.equal(rows[0].product,products[0].id);
 assert.equal(lots.filter(l=>match(l,'lots',{...filter,from:'2026-11-01'},refs)).length,0);
});
test('orders filter related customer and line product names',()=>{
 assert.equal(s.orders.filter(o=>match(o,'orders',{search:'An Phu',status:'Chờ duyệt'},refs)).length,1);
 assert.equal(s.orders.filter(o=>match(o,'orders',{search:'Urban Grey'},refs)).length,1);
 assert.equal(s.orders.filter(o=>match(o,'orders',{from:'2026-11-04',to:'2026-11-04'},refs)).length,1);
});
test('AR, export, documents and sell-out use module-specific fields',()=>{
 assert.equal(s.receipts.filter(r=>match(r,'receipts',{status:'Chờ đối chiếu'},refs)).length,1);
 assert.equal(s.exports.filter(r=>match(r,'exports',{country:'Malaysia',term:'LC trả ngay'},refs)).length,1);
 assert.equal(s.documents.filter(r=>match(r,'documents',{type:'VGM',status:'Nháp'},refs)).length,1);
 assert.equal(s.sellouts.filter(r=>match(r,'sellouts',{period:'2026-10',ownership:'Đối thủ'},refs)).length,1);
 assert.equal(s.sellouts.filter(r=>match(r,'sellouts',{period:'2026-11'},refs)).length,0);
});
