import test from 'node:test';
import assert from 'node:assert/strict';
import {trackingData,forCustomer,forPlant,customerOverview,upcomingEvents,exceptions,exceptionCounts,pipeline,dataQuality,orderQty,isLate,CUSTOMER_APP_ACCOUNT} from '../docs/export-tracking-domain.js';

const today=new Date('2026-11-02T09:00:00');
const all=trackingData({},today);

test('customer view only contains the signed-in customer and their purchased SKUs',()=>{
 const d=forCustomer(all,CUSTOMER_APP_ACCOUNT);
 assert.ok(d.orders.length>0);
 assert.ok(d.orders.every(o=>o.customer===CUSTOMER_APP_ACCOUNT));
 assert.ok(d.shipments.every(s=>d.orders.some(o=>o.id===s.pi)));
 assert.equal(d.decisions.length,0);
 const skus=new Set(d.orders.flatMap(o=>o.lines.map(l=>l.product)));
 assert.ok(d.readyStock.every(r=>skus.has(r.product)));
});
test('overview counts come from the same order rows',()=>{
 const d=forCustomer(all,CUSTOMER_APP_ACCOUNT),k=customerOverview(d,today);
 assert.equal(k.open,d.orders.filter(o=>o.stage!=='delivered').length);
 assert.equal(k.late,d.orders.filter(o=>isLate(o,today)).length);
 const ev=upcomingEvents(d,today,14);
 assert.ok(ev.every(e=>e.date>='2026-11-02'&&e.date<='2026-11-16'));
 assert.deepEqual(ev.map(e=>e.date),[...ev.map(e=>e.date)].sort());
});
test('exception board flags late, blank ETD, aged ready, decisions over SLA and missing docs',()=>{
 const rows=exceptions(all,today,today),types=new Set(rows.map(r=>r.type));
 for(const t of ['late','etdBlank','readyAged','decision','docs'])assert.ok(types.has(t),t);
 assert.ok(rows.every(r=>r.owner),'every exception has an owner');
 const k=exceptionCounts(all,today,today);
 assert.equal(k.requests,all.requests.filter(r=>r.status==='open').length);
});
test('a recorded decision leaves the exception board and replies close requests',()=>{
 const saved={decisions:{'BD-1':{choice:'FWD-A $1,250',by:'Test'},'BD-2':{choice:'VP 100%',by:'Test'}},replies:{'RQ-1':{status:'answered',reply:'ok'}}};
 const d=trackingData(saved,today);
 assert.equal(exceptions(d,today,today).filter(r=>r.type==='decision').length,0);
 assert.equal(d.requests.find(r=>r.id==='RQ-1').status,'answered');
});
test('pipeline totals add up and ETD fill excludes shipped volume',()=>{
 const {rows,total}=pipeline(all,today);
 assert.equal(total.total,rows.reduce((s,r)=>s+r.total,0));
 for(const r of rows)assert.equal(r.total,r.confirmed+r.production+r.ready+r.booked+r.shipped);
 const open=all.orders.filter(o=>o.stage!=='delivered'&&o.stage!=='shipped');
 const want=Math.round(100*open.filter(o=>o.etdPlan).reduce((s,o)=>s+orderQty(o),0)/open.reduce((s,o)=>s+orderQty(o),0));
 assert.equal(total.etdFill,want);
});
test('plant scope filters orders and derived rows',()=>{
 const d=forPlant(all,'Prime Tiền Phong');
 assert.ok(d.orders.length>0&&d.orders.every(o=>o.plantId==='Prime Tiền Phong'));
 assert.ok(d.decisions.every(x=>d.orders.some(o=>o.id===x.pi)));
 assert.ok(dataQuality(d,today).every(q=>d.orders.some(o=>o.id===q.pi)));
});
