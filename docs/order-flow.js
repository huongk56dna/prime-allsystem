export function convertPieces(product,pieces){
 const valid=!!product&&Number.isSafeInteger(Number(pieces))&&Number(pieces)>0;
 if(!valid)return {valid:false,pieces:0,boxes:0,loose:0,area:0,amount:0};
 const count=Number(pieces),area=Math.round(count*product.area*1e6)/1e6;
 return {valid:true,pieces:count,boxes:Math.floor(count/product.pack),loose:count%product.pack,area,amount:Math.round(area*product.price)};
}
// Stock is held from Commercial Director approval until delivery. Orders still waiting for approval only flag shortages.
export const RESERVING_STATUSES=['Đã duyệt','Đã xác nhận','Đang lấy hàng','Đang giao'];
export function availableArea(productId,lots,orders,plant,exportReservations=[]){
 const stock=lots.filter(l=>l.product===productId&&l.plant===plant&&l.quality==='Đạt chất lượng').reduce((sum,l)=>sum+Number(l.qty),0);
 const reserved=orders.filter(o=>RESERVING_STATUSES.includes(o.status)&&(o.plantId===plant||!o.plantId)).reduce((sum,o)=>sum+(o.lines||[]).filter(l=>l.product===productId).reduce((s,l)=>s+Math.max(0,Number(l.area??l.qty??0)-Number(l.deliveredArea||0)),0),0);
 const held=exportReservations.filter(r=>r.product===productId&&r.plant===plant).reduce((v,r)=>v+Number(r.area),0);
 return Math.max(0,Math.round((stock-reserved-held)*1e6)/1e6);
}
export function validateOrder({customer,date,lines},products,allowedCustomers){
 if(!allowedCustomers.some(c=>c.id===customer))return 'Chọn khách hàng trong danh mục.';
 if(!/^\d{4}-\d{2}-\d{2}$/.test(date||'')||(!Number.isFinite(Date.parse(date))||new Date(date).toISOString().slice(0,10)!==date))return 'Chọn ngày giao hàng / lấy hàng dự kiến.';
 if(!Array.isArray(lines)||!lines.length)return 'Thêm ít nhất một sản phẩm.';
 if(lines.some(l=>!convertPieces(products.find(p=>p.id===l.product),l.pieces).valid))return 'Chọn mã gạch và nhập số viên nguyên dương cho từng dòng.';
 return null;
}
