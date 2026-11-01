export const PLANTS=['Prime Tiền Phong','Prime Đại Việt','Prime Vĩnh Phúc','Prime Ngói Việt'];
export const ROLES=[
 {name:'Sales Admin',group:'Theo nhà máy',plant:'Prime Tiền Phong'},
 {name:'Kế toán trưởng',group:'Theo nhà máy',plant:'Prime Đại Việt'},
 {name:'Giám đốc nhà máy',group:'Theo nhà máy',plant:'Prime Tiền Phong'},
 {name:'Kho',group:'Theo nhà máy',plant:'Prime Tiền Phong'},
 {name:'Kế hoạch sản xuất',group:'Theo nhà máy',plant:'Prime Tiền Phong'},
 {name:'Logistics/Xuất nhập khẩu',group:'Theo nhà máy',plant:'Prime Tiền Phong'},
 {name:'Xe nâng',group:'Theo nhà máy',plant:'Prime Tiền Phong'},
 {name:'Bảo vệ',group:'Theo nhà máy',plant:'Prime Tiền Phong'},
 {name:'Giám đốc Thương mại',group:'Toàn hệ thống',all:true},
 {name:'Phòng Mua hàng',group:'Toàn hệ thống',all:true},
 {name:'CFO',group:'Toàn hệ thống',all:true},
 {name:'CEO',group:'Toàn hệ thống',all:true}
];
export const normalizePlant=value=>({'Nhà máy A':'Prime Tiền Phong','Nhà máy B':'Prime Đại Việt'})[value]||value;
export const customerPlant=id=>({'NPP-001':'Prime Tiền Phong','NPP-002':'Prime Đại Việt','CH-003':'Prime Vĩnh Phúc','CH-004':'Prime Ngói Việt'})[id]||null;
export const productPlant=id=>({'PR-60120-01':'Prime Tiền Phong','PR-6060-02':'Prime Đại Việt','PR-8080-03':'Prime Vĩnh Phúc','PR-60120-04':'Prime Ngói Việt','PR-6060-05':'Prime Tiền Phong','PR-8080-06':'Prime Đại Việt'})[id]||null;
export function roleContext(name,filter='all'){
 const role=ROLES.find(x=>x.name===name)||ROLES[0];
 return {role:role.name,all:!!role.all,plant:role.all?(PLANTS.includes(filter)?filter:'all'):role.plant};
}
export function recordPlant(row,kind){
 if(row.plantId)return normalizePlant(row.plantId);
 if(row.plant)return normalizePlant(row.plant);
 // Commercial/financial/field records belong to the servicing plant of the customer.
 if(row.customer&&customerPlant(row.customer))return customerPlant(row.customer);
 if(kind==='exports')return row.id==='PI-2026-002'?'Prime Đại Việt':row.id==='PI-2026-003'?'Prime Vĩnh Phúc':'Prime Tiền Phong';
 if(kind==='documents')return row.shipment==='SHP-2026-002'?'Prime Đại Việt':null;
 if(kind==='receipts'&&row.id==='TH-003')return 'Prime Tiền Phong';
 return null;
}
export function canViewRecord(row,kind,context){return context.plant==='all'||recordPlant(row,kind)===context.plant;}
export function scopedRows(rows,kind,context){return rows.filter(row=>canViewRecord(row,kind,context));}
