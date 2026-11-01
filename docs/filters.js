const norm=v=>String(v??'').normalize('NFD').replace(/[\u0300-\u036f]/g,'').replace(/đ/gi,'d').toLowerCase().trim();
export function matchesModuleRow(row,kind,filters,refs={}){
 const pr=(refs.products||[]).find(p=>p.id===(kind==='products'?row.id:row.product));
 const cu=(refs.customers||[]).find(c=>c.id===(kind==='customers'?row.id:row.customer));
 const text=[row.id,row.name,row.ref,row.reference,row.note,row.customer,row.product,row.plant,row.plantId,row.lot,row.location,row.shade,row.shipment,row.type,row.screen,row.country,row.term,cu?.name,cu?.address,pr?.name,pr?.id,...(row.lines||[]).map(l=>[l.product,(refs.products||[]).find(p=>p.id===l.product)?.name].join(' '))].join(' ');
 if(filters.search&&!norm(text).includes(norm(filters.search)))return false;
 const field=(key,value)=>!filters[key]||filters[key]==='all'||String(value??'')===filters[key];
 if(!field('location',row.location)||!field('status',row.status)||!field('quality',row.quality)||!field('customer',row.customer)||!field('product',row.product||(kind==='products'?row.id:null))||!field('size',row.size||pr?.size)||!field('surface',row.surface||pr?.surface)||!field('group',row.group||pr?.group)||!field('type',row.type)||!field('shipment',row.shipment)||!field('country',row.country)||!field('term',row.term)||!field('channel',row.channel||cu?.channel)||!field('region',row.region||cu?.region))return false;
 if(filters.ownership&&filters.ownership!=='all'){
 const value=row.ownership==='Gạch Prime'?'Prime':row.ownership==='Gạch đối thủ'?'Đối thủ':row.ownership;
 if(value!==filters.ownership)return false;
 }
 const date=String(row.date||row.produced||row.etd||row.at||'').slice(0,10);
 if(filters.from&&(!date||date<filters.from))return false;
 if(filters.to&&(!date||date>filters.to))return false;
 if(filters.period&&String(row.period||row.date||row.id?.match(/2026(11|12)/)?.[0]||'').slice(0,7)!==filters.period){
  // Rolling plans expose the planning horizon explicitly.
  if(kind!=='plans'||!['2026-11','2026-12','2027-01'].includes(filters.period))return false;
 }
 return true;
}
