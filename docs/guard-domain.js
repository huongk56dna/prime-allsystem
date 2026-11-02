import {PLANTS} from './access.js?v=25';
// Default factory for the gate fixtures. The gate itself works on the signed-in user's factory.
export const GUARD_PLANT='Prime Tiền Phong';
export const stationNames=['Cổng vào','Sales Admin','Thủ kho','Xe nâng','Cổng ra','Đã ra cổng'];
const fail=t=>{throw Error(t)};
const log=(t,action,ctx)=>t.history.push({at:ctx.now,actor:ctx.actor,action});
export function guardCommand(source,action,p,ctx){
 const s=structuredClone(source),day=ctx.now.slice(0,10);if(!PLANTS.includes(ctx.plant))fail('Chọn một nhà máy để xử lý cổng.');if(!(ctx.rights||[]).includes(action==='entry'?'create':'update'))fail('Không có quyền xử lý cổng.');
 const notify=(roles,text)=>s.guardNotifications.unshift({id:crypto.randomUUID(),roles,text,at:ctx.now,plantId:ctx.plant});
 let t;
 if(action==='entry'){
  const o=s.orders.find(o=>o.id===p.order&&o.plantId===ctx.plant);if(!o||o.status!=='Đã xác nhận'||!o.guardApproved||o.date>day)fail('Đơn chưa đủ điều kiện xe vào.');
  const plate=p.plate.toUpperCase().replace(/[^A-Z0-9]/g,'');if(!/^[A-Z0-9]{5,15}$/.test(plate))fail('Biển số không hợp lệ.');
  if(s.guardTrucks.some(t=>t.station<5&&(t.plate===plate||t.order===o.id)))fail('Biển số hoặc đơn hàng đã có xe trong bãi.');
  if(!p.platePhoto?.id||!p.conditionPhoto?.id||p.platePhoto.hash===p.conditionPhoto.hash)fail('Cần hai ảnh riêng: biển số và tình trạng xe vào.');
  const lines=o.lines.map((l,i)=>({product:l.product,pieces:Number(p.quantities[i]),area:l.area||0}));
  if(lines.some((l,i)=>!Number.isInteger(l.pieces)||l.pieces<0||l.pieces>o.lines[i].pieces-(o.lines[i].delivered||0))||!lines.some(l=>l.pieces>0))fail('Số viên phải hợp lệ và không vượt lượng còn lại.');
  const seq=s.guardTrucks.filter(t=>t.entered.slice(0,10)===day).reduce((m,t)=>Math.max(m,t.seq||0),0)+1;
  t={id:crypto.randomUUID(),seq,queue:`XE-${day.replaceAll('-','')}-${String(seq).padStart(3,'0')}`,plantId:ctx.plant,order:o.id,customer:o.customer,plate,driver:p.driver,equipment:p.equipment.trim()||'Không có',lines,station:1,entered:ctx.now,platePhoto:p.platePhoto,conditionPhoto:p.conditionPhoto,history:[],hold:false};
  log(t,'Xác nhận xe vào',ctx);s.guardTrucks.unshift(t);o.status='Đang lấy hàng';notify(['Sales','Sales Admin'],`${t.queue} · ${plate} đã vào cổng · ${o.id}`);
 }else{
  t=s.guardTrucks.find(t=>t.id===p.id&&t.plantId===ctx.plant);if(!t||t.station!==4||!t.loadingConfirmed)fail('Xe chưa hoàn tất xếp hàng để ra cổng.');
  if(action==='start'){if(t.started)fail('Đã bắt đầu kiểm tra xe.');t.started=ctx.now;log(t,'Bắt đầu kiểm tra cổng ra',ctx);}
  else if(action==='exit'){
   if(!t.started)fail('Cần bắt đầu kiểm tra cổng ra.');
   if(!p.photo?.id||[t.platePhoto?.hash,t.conditionPhoto?.hash].includes(p.photo.hash))fail('Cần ảnh hàng trên xe tại cổng ra mới.');
   if(!p.checked)fail('Cần xác nhận đã kiểm tra thực tế.');
   if(p.quantities.length!==t.lines.length||p.quantities.some(q=>!Number.isInteger(Number(q))||Number(q)<0))fail('Số viên kiểm đếm không hợp lệ.');
   const mismatch=t.lines.some((l,i)=>l.pieces!==Number(p.quantities[i]))||p.equipment.trim()!==t.equipment;
   if(mismatch){t.hold=true;t.holdReason='Chênh lệch kiểm đếm / thiết bị tại cổng ra';t.exitPhoto=p.photo;log(t,t.holdReason,ctx);notify(['Thủ kho','Xe nâng'],`${t.queue} · ${t.holdReason}`);}
   else{
    if(t.hold&&!p.resolution.trim())fail('Cần ghi lý do xử lý chênh lệch.');
    if(!t.financeClear)fail('Sales Admin chưa xác nhận đủ điều kiện xuất cổng.');
    const o=s.orders.find(o=>o.id===t.order);if(!o)fail('Không tìm thấy đơn hàng.');
    t.lines.forEach(l=>{const line=o.lines.find(x=>x.product===l.product);if(!line||l.pieces>line.pieces-(line.delivered||0))fail('Lượng còn lại của đơn đã thay đổi.');line.delivered=(line.delivered||0)+l.pieces;});
    t.hold=false;t.exitPhoto=p.photo;t.exited=ctx.now;t.station=5;log(t,'Xác nhận xe ra cổng'+(p.resolution?' · '+p.resolution:''),ctx);
    o.status=o.lines.every(l=>(l.delivered||0)===l.pieces)?'Đã giao':'Đã xác nhận';
    s.guardInvoiceRequests??=[];s.guardInvoiceRequests.push({id:crypto.randomUUID(),truck:t.id,order:o.id,lines:t.lines,at:ctx.now,plantId:ctx.plant,status:'Chờ Kế toán xử lý'});
    notify(['Sales','Sales Admin','Kế toán'],`${t.queue} · ${t.plate} đã ra cổng · ${o.id}`);
   }
  }else fail('Bảo vệ không được xử lý bước của bộ phận khác.');
 }
 return {state:s,truck:t};
}
export function seedGuard(s){if(s.guardV1)return;s.guardV1=true;s.guardTrucks=[];s.guardNotifications=[];const today=new Date().toISOString().slice(0,10),at=today+'T08:00:00.000Z';
 for(let i=1;i<=5;i++){const o={id:'BV-DH-'+String(i).padStart(3,'0'),customer:'NPP-001',plantId:GUARD_PLANT,date:today,status:i<3?'Đã xác nhận':'Đang lấy hàng',guardApproved:true,lines:[{product:'PR-60120-01',pieces:200,area:.72,delivered:0},{product:'PR-6060-05',pieces:120,area:.36,delivered:0}],history:['Giám đốc Thương mại duyệt','Khách xác nhận thỏa thuận trả trước']};s.orders.push(o);if(i>=3)s.guardTrucks.push({id:'BV-XE-'+i,seq:i-2,queue:`XE-${today.replaceAll('-','')}-${String(i-2).padStart(3,'0')}`,plantId:GUARD_PLANT,order:o.id,customer:o.customer,plate:['','','','29C12345','88C45678','30H78901'][i],driver:'Nguyễn Văn '+i,equipment:'Không có',station:i===3?1:4,entered:at,lines:structuredClone(o.lines),loadingConfirmed:i>3,financeClear:i>3,hold:i===5,holdReason:i===5?'Chênh lệch thiết bị tại cổng ra':'',history:[{at,actor:'Bảo vệ Tiền Phong',action:'Xác nhận xe vào'}]});}
}
// Department stations between gate entry and gate exit. Each station is done by its own role
// (or a user with Quản trị on that module) with Sửa rights on the module, scoped to the truck's factory.
export const STATION_STEPS={
 1:{role:'Sales Admin',module:'orders',action:'Xác nhận đủ điều kiện xuất',done:'Sales Admin xác nhận đủ điều kiện xuất cổng',next:['Kho']},
 2:{role:'Kho',module:'stock',action:'Xuất phiếu lấy hàng',done:'Thủ kho xuất phiếu lấy hàng',next:['Xe nâng']},
 3:{role:'Xe nâng',module:'stock',action:'Xác nhận đã xếp hàng',done:'Xe nâng xác nhận đã xếp đủ hàng',next:['Bảo vệ']}
};
// ctx: {plant, actor, now, roles:[role names], can:(module,right)=>bool}
export function canDoStation(truck,ctx){const step=STATION_STEPS[truck?.station];return !!step&&!truck.hold&&(ctx.plant==='all'||truck.plantId===ctx.plant)&&ctx.can(step.module,'update')&&((ctx.roles||[]).includes(step.role)||ctx.can(step.module,'manage'));}
export function stationCommand(source,p,ctx){
 const s=structuredClone(source),t=s.guardTrucks.find(t=>t.id===p.id&&(ctx.plant==='all'||t.plantId===ctx.plant));
 if(!t)fail('Không tìm thấy xe tại nhà máy này.');
 if(t.station!==Number(p.station))fail('Xe đã chuyển sang trạm khác. Vui lòng tải lại.');
 const step=STATION_STEPS[t.station];if(!step)fail('Xe không ở trạm của bộ phận.');
 if(t.hold)fail('Xe đang bị giữ, cần xử lý chênh lệch trước.');
 if(!canDoStation(t,ctx))fail(`Chỉ ${step.role} có quyền Sửa mới xử lý được trạm này.`);
 const o=s.orders.find(o=>o.id===t.order);if(!o||o.status!=='Đang lấy hàng')fail('Đơn hàng không còn ở bước lấy hàng.');
 if(t.station===1)t.financeClear=true;
 if(t.station===2)t.pickingIssued=ctx.now;
 if(t.station===3)t.loadingConfirmed=true;
 t.station+=1;log(t,step.done,ctx);
 s.guardNotifications.unshift({id:crypto.randomUUID(),roles:step.next,text:`${t.queue} · ${t.plate} · ${step.done}`,at:ctx.now,plantId:t.plantId});
 return {state:s,truck:t};
}
