// Export order tracking: one shared dataset read by the Customer App (own orders only)
// and by the Sales App / Web (all customers, exceptions, decisions). Entirely fictional.
export const STAGES = ['confirmed', 'production', 'ready', 'booked', 'shipped', 'delivered'];
export const STAGE_LABEL = {
  confirmed: 'Đã xác nhận đơn',
  production: 'Đang sản xuất',
  ready: 'Sẵn sàng giao',
  booked: 'Đã booking',
  shipped: 'Đã xuất tàu',
  delivered: 'Đã giao',
};
export const CUSTOMERS = [
  { id: 'XK-LOTUS', name: 'Lotus Export Trading', short: 'Lotus (PH)', port: 'Manila' },
  { id: 'XK-SIAM', name: 'Siam Tile Distribution', short: 'Siam Tile (TH)', port: 'Laem Chabang' },
  { id: 'XK-ORCHID', name: 'Orchid Building Materials', short: 'Orchid (MY)', port: 'Port Klang' },
];
// The Customer App signs in as this export account.
export const CUSTOMER_APP_ACCOUNT = 'XK-LOTUS';
export const SLA_HOURS = 24;
export const REQUEST_SLA_HOURS = 24;
const DAY = 86400000;

export const startOfDay = (d = new Date()) => { const x = new Date(d); x.setHours(0, 0, 0, 0); return x; };
export const addDays = (today, n) => { const d = new Date(startOfDay(today).getTime() + n * DAY); return toISO(d); };
export const toISO = d => `${d.getFullYear()}-${String(d.getMonth() + 1).padStart(2, '0')}-${String(d.getDate()).padStart(2, '0')}`;
export const daysBetween = (from, to) => Math.round((startOfDay(new Date(to)) - startOfDay(new Date(from))) / DAY);
export const hoursSince = (iso, now = new Date()) => Math.max(0, Math.floor((now - new Date(iso)) / 3600000));

const line = (product, ordered, produced = ordered, ready = produced, shipped = 0) => ({ product, ordered, produced, ready, shipped });

// Seed is generated relative to "today" so the 14-day outlook and ages stay meaningful.
export function seedTracking(today = new Date()) {
  const d = n => addDays(today, n);
  const at = (n, h) => { const x = new Date(startOfDay(today).getTime() + n * DAY); x.setHours(h); return x.toISOString(); };
  const orders = [
    { id: 'PI-26-0398', customer: 'XK-LOTUS', plantId: 'Prime Vĩnh Phúc', poDate: d(-70), stage: 'shipped',
      lines: [line('PR-6060-02', 8640, 8640, 8640, 8640), line('PR-8080-03', 8640, 8640, 8640, 8640)],
      dates: { confirmed: d(-68), production: d(-60), ready: d(-20), booked: d(-14), shipped: d(-4) },
      etdPlan: d(-4), atd: d(-4), eta: d(8), containers: "2 × 40'", term: 'LC',
      docs: { pi: true, packing: true, bl: 'issued', co: 'issued' }, nextStep: 'Khách nhận hàng tại cảng đích', owner: 'Logistics' },
    { id: 'PI-26-0412', customer: 'XK-LOTUS', plantId: 'Prime Vĩnh Phúc', poDate: d(-50), stage: 'booked',
      lines: [line('PR-6060-05', 5760), line('PR-8080-03', 5760)],
      dates: { confirmed: d(-48), production: d(-40), ready: d(-10), booked: d(-6) },
      etdPlan: d(1), eta: d(13), containers: "6 × 20'", vessel: 'MV Pacific Link 118W', term: 'TT đặt cọc',
      docs: { pi: true, packing: true, bl: 'draft', co: null }, nextStep: 'Đóng hàng và xuất tàu', owner: 'Logistics' },
    { id: 'PI-26-0427', customer: 'XK-LOTUS', plantId: 'Prime Vĩnh Phúc', poDate: d(-37), stage: 'ready',
      lines: [line('PR-6060-02', 5760), line('PR-6060-05', 4320), line('PR-8080-03', 4320)],
      dates: { confirmed: d(-37), production: d(-30), ready: d(-12) },
      etdPlan: null, cutoff: d(6), containers: "8 × 20'", term: 'Theo hợp đồng',
      docs: { pi: true, packing: true, bl: null, co: null }, nextStep: 'Prime xác nhận forwarder và tàu',
      waitingOn: 'Khách chọn forwarder', owner: 'Logistics' },
    { id: 'PI-26-0431', customer: 'XK-LOTUS', plantId: 'Prime Đại Việt', poDate: d(-32), stage: 'production',
      lines: [line('PR-8080-06', 8640, 5616, 0)],
      dates: { confirmed: d(-31), production: d(-20) }, productionEnd: d(3),
      etdPlan: d(14), eta: d(26), containers: "5 × 20'", term: 'TT đặt cọc',
      docs: { pi: true, packing: false, bl: null, co: null }, nextStep: 'Hoàn tất sản xuất', owner: 'Kế hoạch sản xuất' },
    { id: 'PI-26-0440', customer: 'XK-LOTUS', plantId: 'Prime Vĩnh Phúc', poDate: d(-21), stage: 'confirmed',
      lines: [line('PR-6060-02', 11520, 0, 0), line('PR-8080-03', 11520, 0, 0)],
      dates: { confirmed: d(-20) }, etdPlan: d(29), eta: d(41), containers: "13 × 20'", term: 'LC',
      docs: { pi: true, packing: false, bl: null, co: null }, nextStep: 'Phân bổ nhà máy sản xuất',
      waitingOn: 'Phân bổ VP / ĐV', owner: 'Kế hoạch sản xuất' },
    { id: 'PI-26-0385', customer: 'XK-LOTUS', plantId: 'Prime Vĩnh Phúc', poDate: d(-86), stage: 'delivered',
      lines: [line('PR-6060-05', 5760, 5760, 5760, 5760)],
      dates: { confirmed: d(-85), production: d(-75), ready: d(-40), booked: d(-30), shipped: d(-20), delivered: d(-8) },
      etdPlan: d(-32), atd: d(-20), eta: d(-8), containers: "3 × 20'", term: 'TT100%',
      docs: { pi: true, packing: true, bl: 'issued', co: 'issued' }, nextStep: 'Đóng hồ sơ kèm ghi chú trễ',
      waitingOn: 'Giao trễ, đóng kèm ghi chú', owner: 'Sales Export' },
    { id: 'PI-26-0419', customer: 'XK-SIAM', plantId: 'Prime Tiền Phong', poDate: d(-45), stage: 'ready',
      lines: [line('PR-6060-05', 9600)],
      dates: { confirmed: d(-44), production: d(-35), ready: d(-16) }, etdPlan: d(10), eta: d(16), containers: "5 × 20'", term: 'LC',
      docs: { pi: true, packing: true, bl: null, co: null }, nextStep: 'Chờ khách sửa PO',
      waitingOn: 'Khách sửa PO', owner: 'Sales Export' },
    { id: 'PI-26-0401', customer: 'XK-SIAM', plantId: 'Prime Tiền Phong', poDate: d(-60), stage: 'shipped',
      lines: [line('PR-6060-05', 12960, 12960, 12960, 12960)],
      dates: { confirmed: d(-59), production: d(-50), ready: d(-15), booked: d(-9), shipped: d(-3) },
      etdPlan: d(-3), atd: d(-3), eta: d(3), containers: "7 × 20'", vessel: 'MV Gulf Trader 22N', term: 'LC',
      docs: { pi: true, packing: true, bl: 'issued', co: null }, nextStep: 'Gửi C/O cho khách',
      waitingOn: 'C/O từ Phòng Thương mại', owner: 'Logistics' },
    { id: 'PI-26-0408', customer: 'XK-SIAM', plantId: 'Prime Tiền Phong', poDate: d(-95), stage: 'production',
      lines: [line('PR-6060-05', 9600, 4800, 0)], dates: { confirmed: d(-94), production: d(-25) }, productionEnd: d(9),
      etdPlan: d(20), eta: d(26), containers: "5 × 20'", term: 'LC',
      docs: { pi: true, packing: false, bl: null, co: null }, nextStep: 'Hoàn tất sản xuất', owner: 'Kế hoạch sản xuất' },
    { id: 'PI-26-0444', customer: 'XK-ORCHID', plantId: 'Prime Đại Việt', poDate: d(-18), stage: 'production',
      lines: [line('PR-6060-02', 8640, 2880, 0)], dates: { confirmed: d(-17), production: d(-6) }, productionEnd: d(12),
      etdPlan: d(22), eta: d(27), containers: "5 × 20'", term: 'TT đặt cọc',
      docs: { pi: true, packing: false, bl: null, co: null }, nextStep: 'Hoàn tất sản xuất', owner: 'Kế hoạch sản xuất' },
    { id: 'PI-26-0446', customer: 'XK-ORCHID', plantId: 'Prime Đại Việt', poDate: d(-12), stage: 'booked',
      lines: [line('PR-8080-06', 4320)], dates: { confirmed: d(-11), production: d(-10), ready: d(-5), booked: d(-2) },
      etdPlan: d(5), eta: d(10), containers: "3 × 20'", vessel: 'MV Straits Bridge 09S', term: 'TT100%',
      docs: { pi: true, packing: true, bl: 'draft', co: null }, nextStep: 'Đóng hàng và xuất tàu', owner: 'Logistics' },
  ];
  const shipments = [
    { id: 'C1', container: 'MSKU 812 3301', pi: 'PI-26-0398', vessel: 'MV Ocean Star 041E', etd: d(-4), atd: d(-4), eta: d(8), bl: 'issued', status: 'atSea' },
    { id: 'C2', container: 'MSKU 812 3302', pi: 'PI-26-0398', vessel: 'MV Ocean Star 041E', etd: d(-4), atd: d(-4), eta: d(8), bl: 'issued', status: 'atSea' },
    { id: 'C3', container: 'TCLU 455 9017', pi: 'PI-26-0412', vessel: 'MV Pacific Link 118W', etd: d(1), atd: null, eta: d(13), bl: 'draft', status: 'booked' },
    { id: 'C4', container: null, pi: 'PI-26-0427', containers: "8 × 20'", vessel: null, etd: null, atd: null, eta: null, bl: null, status: 'awaiting' },
    { id: 'C5', container: 'OOLU 220 1184', pi: 'PI-26-0401', vessel: 'MV Gulf Trader 22N', etd: d(-3), atd: d(-3), eta: d(3), bl: 'issued', status: 'atSea' },
    { id: 'C6', container: 'CMAU 301 7760', pi: 'PI-26-0446', vessel: 'MV Straits Bridge 09S', etd: d(5), atd: null, eta: d(10), bl: 'draft', status: 'booked' },
  ];
  const readyStock = [
    { product: 'PR-6060-02', plantId: 'Prime Vĩnh Phúc', available: 2880, grade: 'A', earliestEtd: d(6) },
    { product: 'PR-6060-05', plantId: 'Prime Tiền Phong', available: 1440, grade: 'A', earliestEtd: d(6) },
    { product: 'PR-8080-03', plantId: 'Prime Vĩnh Phúc', available: 4320, grade: 'A', earliestEtd: d(14) },
    { product: 'PR-8080-06', plantId: 'Prime Đại Việt', available: 2160, grade: 'B', earliestEtd: d(9) },
  ];
  const decisions = [
    { id: 'BD-1', pi: 'PI-26-0427', customer: 'XK-LOTUS', decision: 'Chọn forwarder', options: ['FWD-A $1,250', 'FWD-B $1,310'], waitingOn: 'Khách hàng', raised: at(-2, 9) },
    { id: 'BD-2', pi: 'PI-26-0440', customer: 'XK-LOTUS', decision: 'Phân bổ nhà máy', options: ['VP 100%', 'VP 60 + ĐV 40'], waitingOn: 'Kế hoạch VP', raised: at(-2, 15) },
    { id: 'BD-3', pi: 'PI-26-0419', customer: 'XK-SIAM', decision: 'Đồng ý giao từng phần?', options: ['Giao 9.600 ngay', 'Chờ đủ hàng'], waitingOn: 'Sales Export', raised: at(0, Math.max(0, new Date(today).getHours() - 3)) },
  ];
  const requests = [
    { id: 'RQ-1', customer: 'XK-LOTUS', pi: 'PI-26-0427', topic: 'etd', text: 'Khi nào có ETD cho PI-26-0427?', at: at(-2, 10), status: 'open' },
    { id: 'RQ-2', customer: 'XK-LOTUS', pi: 'PI-26-0398', topic: 'docs', text: 'Xin bản scan B/L gốc.', at: at(-5, 15), status: 'answered', reply: 'Đã tải B/L lên mục chứng từ.', repliedAt: at(-4, 9), repliedBy: 'Logistics' },
    { id: 'RQ-3', customer: 'XK-SIAM', pi: 'PI-26-0401', topic: 'docs', text: 'Cần C/O trước khi tàu cập cảng.', at: at(-1, 8), status: 'open' },
  ];
  return { orders, shipments, readyStock, decisions, requests };
}

// Merge persisted user actions (decisions recorded, requests, replies) onto the seed.
export function trackingData(saved = {}, today = new Date()) {
  const seed = seedTracking(today);
  const decisions = seed.decisions.map(d => ({ ...d, ...(saved.decisions?.[d.id] || {}) }));
  const replies = saved.replies || {};
  const requests = [...seed.requests, ...(saved.requests || [])].map(r => ({ ...r, ...(replies[r.id] || {}) }));
  return { ...seed, decisions, requests, pushLog: saved.pushLog || [] };
}

export const orderQty = o => o.lines.reduce((s, l) => s + l.ordered, 0);
export const producedPct = o => Math.round(100 * o.lines.reduce((s, l) => s + l.produced, 0) / orderQty(o));
export const shippedPct = o => Math.round(100 * o.lines.reduce((s, l) => s + l.shipped, 0) / orderQty(o));
export const isOpen = o => o.stage !== 'delivered';
export const lateDays = o => {
  if (!o.etdPlan) return 0;
  const actual = o.atd || null;
  if (actual) return Math.max(0, daysBetween(o.etdPlan, actual));
  return 0;
};
export const isLate = (o, today = new Date()) => lateDays(o) > 0 || (!!o.etdPlan && !o.atd && daysBetween(o.etdPlan, today) > 0);
export const forCustomer = (data, customer) => ({
  ...data,
  orders: data.orders.filter(o => o.customer === customer),
  shipments: data.shipments.filter(s => data.orders.some(o => o.id === s.pi && o.customer === customer)),
  requests: data.requests.filter(r => r.customer === customer),
  decisions: [],
  readyStock: data.readyStock.filter(r => data.orders.some(o => o.customer === customer && o.lines.some(l => l.product === r.product))),
});
export const forPlant = (data, plant) => plant === 'all' ? data : ({
  ...data,
  orders: data.orders.filter(o => o.plantId === plant),
  shipments: data.shipments.filter(s => data.orders.some(o => o.id === s.pi && o.plantId === plant)),
  decisions: data.decisions.filter(d => data.orders.some(o => o.id === d.pi && o.plantId === plant)),
  requests: data.requests.filter(r => !r.pi || data.orders.some(o => o.id === r.pi && o.plantId === plant)),
  readyStock: data.readyStock.filter(r => r.plantId === plant),
});

export function customerOverview(data, today = new Date()) {
  const open = data.orders.filter(isOpen), since = addDays(today, -30);
  return {
    open: open.length,
    production: open.filter(o => o.stage === 'production').length,
    ready: open.filter(o => o.stage === 'ready').length,
    booked: open.filter(o => o.stage === 'booked').length,
    shipped30: data.orders.filter(o => o.atd && o.atd >= since).length,
    late: data.orders.filter(o => isLate(o, today)).length,
  };
}

export function upcomingEvents(data, today = new Date(), days = 14, ports = {}) {
  const from = toISO(startOfDay(today)), to = addDays(today, days), events = [];
  const inRange = d => d && d >= from && d <= to;
  for (const o of data.orders) {
    const qty = orderQty(o);
    if (o.stage === 'booked' && inRange(o.etdPlan)) events.push({ date: o.etdPlan, kind: 'depart', pi: o.id, qty, stage: o.stage });
    if (o.stage === 'production' && inRange(o.productionEnd)) events.push({ date: o.productionEnd, kind: 'produced', pi: o.id, qty, stage: o.stage });
    if (o.stage === 'ready' && inRange(o.cutoff)) events.push({ date: o.cutoff, kind: 'cutoff', pi: o.id, qty, stage: o.stage });
    if (o.stage === 'shipped' && inRange(o.eta)) events.push({ date: o.eta, kind: 'eta', pi: o.id, qty, stage: o.stage, port: ports[o.customer] });
  }
  return events.sort((a, b) => a.date.localeCompare(b.date));
}

export const EXCEPTION_TYPES = ['late', 'etdBlank', 'readyAged', 'decision', 'docs'];
export function exceptions(data, today = new Date(), now = new Date()) {
  const rows = [];
  const push = (type, o, age, waitingOn, owner) => rows.push({ type, pi: o.id, customer: o.customer, qty: orderQty(o), age, waitingOn, owner });
  for (const o of data.orders) {
    if (isLate(o, today)) push('late', o, lateDays(o) || daysBetween(o.etdPlan, today), o.waitingOn || 'Cập nhật ETD mới cho khách', o.owner);
    if (isOpen(o) && ['ready', 'booked'].includes(o.stage) && !o.etdPlan) push('etdBlank', o, daysBetween(o.dates.ready, today), o.waitingOn || 'Xác nhận booking', 'Logistics');
    if (o.stage === 'ready' && daysBetween(o.dates.ready, today) > 14) push('readyAged', o, daysBetween(o.dates.ready, today), o.waitingOn || 'Xác nhận lịch giao', o.owner);
    if (['shipped', 'delivered'].includes(o.stage) && (o.docs.bl !== 'issued' || o.docs.co !== 'issued')) push('docs', o, daysBetween(o.atd || o.dates.shipped, today), o.waitingOn || 'Phát hành chứng từ', 'Logistics');
  }
  for (const d of data.decisions.filter(d => !d.choice)) {
    const o = data.orders.find(x => x.id === d.pi), h = hoursSince(d.raised, now);
    if (o && h > SLA_HOURS) push('decision', o, Math.floor(h / 24), d.decision + ' · ' + d.waitingOn, d.waitingOn === 'Khách hàng' ? 'Sales Export' : 'Kế hoạch sản xuất');
  }
  return rows;
}
export function exceptionCounts(data, today = new Date(), now = new Date()) {
  const rows = exceptions(data, today, now), open = data.requests.filter(r => r.status === 'open');
  return {
    ...Object.fromEntries(EXCEPTION_TYPES.map(t => [t, rows.filter(r => r.type === t).length])),
    requests: open.length,
    requestsOverdue: open.filter(r => hoursSince(r.at, now) > REQUEST_SLA_HOURS).length,
  };
}

export function pipeline(data, today = new Date()) {
  const by = new Map();
  for (const o of data.orders.filter(isOpen)) {
    const row = by.get(o.customer) || { customer: o.customer, confirmed: 0, production: 0, ready: 0, booked: 0, shipped: 0, total: 0, aged: 0, withEtd: 0, needEtd: 0 };
    const q = orderQty(o);
    row[o.stage] += q; row.total += q;
    if (daysBetween(o.poDate, today) > 90) row.aged += q;
    if (o.stage !== 'shipped') { row.needEtd += q; if (o.etdPlan) row.withEtd += q; }
    by.set(o.customer, row);
  }
  const rows = [...by.values()].map(r => ({ ...r, etdFill: r.needEtd ? Math.round(100 * r.withEtd / r.needEtd) : 100 }));
  const total = rows.reduce((t, r) => { for (const k of ['confirmed', 'production', 'ready', 'booked', 'shipped', 'total', 'aged', 'withEtd', 'needEtd']) t[k] += r[k]; return t; },
    { customer: 'total', confirmed: 0, production: 0, ready: 0, booked: 0, shipped: 0, total: 0, aged: 0, withEtd: 0, needEtd: 0 });
  total.etdFill = total.needEtd ? Math.round(100 * total.withEtd / total.needEtd) : 100;
  return { rows, total };
}

export function dataQuality(data, today = new Date()) {
  const issues = [];
  for (const o of data.orders.filter(isOpen)) {
    if (!o.etdPlan && o.stage !== 'confirmed') issues.push({ pi: o.id, field: 'ETD', problem: 'Thiếu ETD', owner: 'Logistics' });
    if (o.stage === 'booked' && !o.vessel) issues.push({ pi: o.id, field: 'Tàu', problem: 'Đã booking nhưng thiếu tên tàu', owner: 'Logistics' });
    if (o.etdPlan && !o.eta) issues.push({ pi: o.id, field: 'ETA', problem: 'Có ETD nhưng thiếu ETA', owner: 'Logistics' });
    if (o.stage === 'ready' && o.lines.some(l => l.ready < l.ordered)) issues.push({ pi: o.id, field: 'Tồn sẵn sàng', problem: 'Trạng thái sẵn sàng nhưng tồn chưa đủ', owner: 'Kho' });
    if (o.etdPlan && !o.atd && daysBetween(o.etdPlan, today) > 0) issues.push({ pi: o.id, field: 'ATD', problem: 'ETD đã qua nhưng chưa ghi ATD', owner: 'Logistics' });
  }
  for (const s of data.shipments) if (s.atd && s.bl !== 'issued') issues.push({ pi: s.pi, field: 'B/L', problem: 'Tàu đã chạy nhưng B/L chưa phát hành', owner: 'Logistics' });
  return issues;
}

export function pushLog(data, today = new Date()) {
  const from = addDays(today, -14), rows = [];
  for (const o of data.orders) {
    if (o.atd && o.atd >= from) rows.push({ at: o.atd, pi: o.id, customer: o.customer, message: 'Tàu đã rời cảng' });
    if (o.dates.booked && o.dates.booked >= from) rows.push({ at: o.dates.booked, pi: o.id, customer: o.customer, message: 'Đã xác nhận booking' });
    if (o.dates.ready && o.dates.ready >= from) rows.push({ at: o.dates.ready, pi: o.id, customer: o.customer, message: 'Hàng sẵn sàng giao' });
    if (o.stage === 'delivered' && o.dates.delivered >= from) rows.push({ at: o.dates.delivered, pi: o.id, customer: o.customer, message: 'Đã giao hàng' });
  }
  for (const p of data.pushLog || []) rows.push(p);
  return rows.sort((a, b) => b.at.localeCompare(a.at));
}
