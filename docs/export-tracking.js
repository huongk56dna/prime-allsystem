import { number, locale, protectText, freeTextHTML } from './i18n.js?v=26';
import {
  STAGES, STAGE_LABEL, CUSTOMERS, CUSTOMER_APP_ACCOUNT, SLA_HOURS, REQUEST_SLA_HOURS, trackingData, forCustomer, forPlant,
  orderQty, producedPct, shippedPct, isLate, lateDays, customerOverview, upcomingEvents, exceptions, exceptionCounts,
  pipeline, dataQuality, pushLog, hoursSince,
} from './export-tracking-domain.js?v=26';

// Customer App (#customer/export) and Sales App / Web (#sales/export, #web/tracking) views of export orders.
let C;
const ui = { customer: 'overview', internal: 'exceptions', pi: { customer: null, internal: null }, filter: { status: 'all', plant: 'all', month: 'all' } };
const esc = v => String(v ?? '').replace(/[&<>"']/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
const n = v => number(v, { maximumFractionDigits: 0 });
const day = d => d ? new Date(d + 'T00:00:00').toLocaleDateString(locale(), { day: '2-digit', month: 'short' }) : '—';
const stamp = iso => new Date(iso).toLocaleString(locale(), { day: '2-digit', month: 'short', hour: '2-digit', minute: '2-digit' });
const cust = id => CUSTOMERS.find(c => c.id === id);
const product = id => C.products.find(p => p.id === id);
const plantCode = p => ({ 'Prime Tiền Phong': 'TP', 'Prime Đại Việt': 'ĐV', 'Prime Vĩnh Phúc': 'VP', 'Prime Ngói Việt': 'NV' }[p] || p);
const STATUS_TONE = { confirmed: 'gray', production: 'gray', ready: 'amber', booked: 'green', shipped: 'dark', delivered: 'dark' };
const dot = (text, tone = '') => `<span class="xt-dot ${tone}">${esc(text)}</span>`;
const stageBadge = (o, today) => {
  if (o.stage === 'delivered' && lateDays(o)) return dot(`Trễ — giao sau ETD ${lateDays(o)} ngày`, 'red');
  if (isLate(o, today) && !o.atd) return dot('Trễ so với ETD', 'red');
  return dot(STAGE_LABEL[o.stage], STATUS_TONE[o.stage]);
};
const BL = { issued: ['Đã phát hành', 'green'], draft: ['Nháp', 'gray'] };
const SHIP = { atSea: ['Đang trên biển', 'dark'], booked: ['Đã booking', 'green'], awaiting: ['Chờ booking', 'amber'] };
const EX = { late: ['Trễ so với ETD', 'red'], etdBlank: ['Thiếu ETD', 'amber'], readyAged: ['Sẵn sàng > 14 ngày', 'amber'], decision: ['Quyết định > 24h', 'red'], docs: ['Thiếu chứng từ', 'amber'] };
const TOPICS = { etd: 'Hỏi ETD / lịch tàu', docs: 'Chứng từ', stock: 'Đặt thêm hàng sẵn kho', change: 'Thay đổi đơn', other: 'Khác' };
const table = (headers, rows, cls = '') => `<div class="table-wrap"><table class="xt-table ${cls}"><thead><tr>${headers.map(h => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.length ? rows.map(r => `<tr${r.cls ? ` class="${r.cls}"` : ''}>${(r.cells || r).map(c => `<td>${c}</td>`).join('')}</tr>`).join('') : `<tr><td colspan="${headers.length}" class="empty">Không có dữ liệu phù hợp.</td></tr>`}</tbody></table></div>`;
const panel = (title, sub, body, foot = '') => `<section class="panel xt-panel"><div class="xt-head"><h2>${title}</h2>${sub ? `<small>${sub}</small>` : ''}</div>${body}${foot ? `<p class="xt-foot">${foot}</p>` : ''}</section>`;
const kpis = items => `<div class="xt-kpis">${items.map(([title, value, sub, tone]) => `<div class="xt-kpi ${tone}"><span>${title}</span><strong>${n(value)}</strong><small>${sub}</small></div>`).join('')}</div>`;
const tabs = (mode, list) => `<nav class="xt-tabs" aria-label="Đơn xuất khẩu">${list.map(([id, t], i) => `<button type="button" class="${ui[mode] === id ? 'on' : ''}" data-xt="tab:${mode}:${id}">${i + 1} ${t}</button>`).join('')}</nav>`;
const piLink = (mode, id) => `<button type="button" class="xt-link" data-xt="pi:${mode}:${id}">${esc(id)}</button>`;
const bar = pct => `<span class="xt-bar"><i style="width:${Math.min(100, pct)}%"></i></span> ${pct}%`;

export function configureTracking(config) { C = config; }

function data(mode) {
  const s = C.state(), today = new Date();
  const all = trackingData(s.exportTracking || {}, today);
  return mode === 'customer' ? forCustomer(all, CUSTOMER_APP_ACCOUNT) : forPlant(all, C.plant());
}

export function trackingView(mode) {
  protectText(CUSTOMERS.flatMap(c => [c.name, c.short, c.port]));
  return mode === 'customer' ? customerView() : internalView(mode);
}

// ---------- Customer App ----------
const CUSTOMER_TABS = [['overview', 'Tổng quan'], ['orders', 'Đơn của tôi'], ['detail', 'Chi tiết đơn'], ['shipments', 'Lô hàng'], ['stock', 'Hàng sẵn kho'], ['requests', 'Yêu cầu']];
function customerView() {
  const d = data('customer'), today = new Date(), account = cust(CUSTOMER_APP_ACCOUNT);
  const body = { overview: cOverview, orders: cOrders, detail: () => orderDetail(d, 'customer', today), shipments: cShipments, stock: cStock, requests: cRequests }[ui.customer](d, today);
  return `<div class="heading"><div><p class="eyebrow">Prime · Customer App</p><h1>Đơn xuất khẩu</h1><p>${esc(account.name)} · Mọi số liệu lấy từ cùng dữ liệu Prime đang dùng, không cần hỏi qua chat.</p></div></div>${tabs('customer', CUSTOMER_TABS)}${body}`;
}
function cOverview(d, today) {
  const k = customerOverview(d, today);
  const label = { depart: 'Tàu rời Hải Phòng', produced: 'Hoàn tất sản xuất', cutoff: 'Cut-off — cần booking', eta: 'ETA ' };
  const events = upcomingEvents(d, today, 14, Object.fromEntries(CUSTOMERS.map(c => [c.id, c.port])));
  return kpis([
    ['Đơn đang mở', k.open, 'PI chưa đóng', 'ink'], ['Đang sản xuất', k.production, 'Trong kế hoạch sản xuất', 'gray'],
    ['Sẵn sàng giao', k.ready, 'Sẵn sàng, chờ booking', 'green'], ['Đã booking', k.booked, 'Đã đặt tàu, chờ đóng hàng', 'amber'],
    ['Đã xuất tàu (30 ngày)', k.shipped30, 'Tàu đã chạy trong 30 ngày qua', 'gray'], ['Trễ so với ETD', k.late, 'So với ETD đã thông báo', 'red'],
  ]) + panel('14 ngày tới', 'Những gì sẽ xảy ra với đơn của bạn', table(['Ngày', 'Sự kiện', 'PI', 'SL (m²)', 'Trạng thái'], events.map(e => {
    const o = d.orders.find(x => x.id === e.pi);
    return [day(e.date), esc(label[e.kind] + (e.kind === 'eta' ? e.port || '' : '')), piLink('customer', e.pi), n(e.qty), stageBadge(o, today)];
  })), 'Nguồn: Đơn hàng + Booking + Shipment · tự cập nhật');
}
function cOrders(d, today) {
  const f = ui.filter, months = [...new Set(d.orders.map(o => o.poDate.slice(0, 7)))].sort().reverse();
  const rows = d.orders.filter(o => (f.status === 'all' || o.stage === f.status) && (f.plant === 'all' || o.plantId === f.plant) && (f.month === 'all' || o.poDate.startsWith(f.month)))
    .sort((a, b) => b.poDate.localeCompare(a.poDate));
  const sel = (name, all, opts) => `<label>${all}<select data-xt-filter="${name}"><option value="all">Tất cả</option>${opts.map(([v, t]) => `<option value="${esc(v)}" ${f[name] === v ? 'selected' : ''}>${esc(t)}</option>`).join('')}</select></label>`;
  const filters = `<div class="xt-filters">${sel('status', 'Trạng thái', STAGES.map(s => [s, STAGE_LABEL[s]]))}${sel('plant', 'Nhà máy', [...new Set(d.orders.map(o => o.plantId))].map(p => [p, p]))}${sel('month', 'Tháng PO', months.map(m => [m, m.slice(5) + '/' + m.slice(0, 4)]))}</div>`;
  return panel('Đơn của tôi', 'lọc: trạng thái · nhà máy · tháng', filters + table(['PI', 'Ngày PO', 'Nhà máy', 'Đặt (m²)', 'Đã sản xuất', 'Đã xuất', 'Trạng thái', 'ETD kế hoạch', 'ETA'],
    rows.map(o => ({ cls: isLate(o, today) ? 'xt-late' : '', cells: [piLink('customer', o.id), day(o.poDate), plantCode(o.plantId), n(orderQty(o)), bar(producedPct(o)), shippedPct(o) + '%', stageBadge(o, today), day(o.etdPlan), day(o.eta)] }))),
  'Bấm PI để mở trang Chi tiết đơn · ETD trống = Prime chưa xác nhận booking (chưa có lịch tàu, không phải cam kết)');
}
function orderDetail(d, mode, today) {
  const id = ui.pi[mode] || d.orders.find(o => o.stage === 'ready')?.id || d.orders[0]?.id, o = d.orders.find(x => x.id === id);
  if (!o) return panel('Chi tiết đơn', '', '<p class="empty">Chưa có đơn xuất khẩu.</p>');
  const at = STAGES.indexOf(o.stage);
  const step = (s, i) => {
    const date = s === 'production' && o.dates.production ? day(o.dates.production) + (o.dates.ready ? ' – ' + day(o.dates.ready) : '') : day(o.dates[s]);
    return `<div class="${i < at || (i === at && o.stage === 'delivered') ? 'done' : i === at ? 'now' : ''}"><b>${STAGE_LABEL[s]}</b><small>${date}</small></div>`;
  };
  const picker = `<label class="xt-pick">PI<select data-xt-pick="${mode}">${d.orders.map(x => `<option ${x.id === o.id ? 'selected' : ''}>${esc(x.id)}</option>`).join('')}</select></label>`;
  const doc = (ok, label, after) => ok ? `<span class="xt-doc">${label}</span>` : `<span class="xt-doc missing">${label}${after ? ' — sau khi xuất tàu' : ' — chưa có'}</span>`;
  const shippedYet = ['shipped', 'delivered'].includes(o.stage);
  const internal = mode !== 'customer' ? `<div class="xt-facts"><div><small>Khách hàng</small><b>${esc(cust(o.customer)?.name)}</b></div><div><small>Đang chờ</small><b>${esc(o.waitingOn || '—')}</b></div><div><small>Phụ trách</small><b>${esc(o.owner || '—')}</b></div><div><small>Nhà máy</small><b>${esc(o.plantId)}</b></div></div>` : '';
  return `<section class="panel xt-panel">${mode !== 'customer' ? `<button type="button" class="xt-back" data-xt="back">← Quay lại</button>` : ''}<div class="xt-head xt-spread"><div><h2>${esc(o.id)}</h2><small>${STAGE_LABEL[o.stage]} · ${plantCode(o.plantId)} · ${n(orderQty(o))} m²</small></div>${mode === 'customer' ? picker : ''}</div>
<div class="xt-track">${STAGES.map(step).join('')}</div>
<div class="xt-facts"><div><small>Bước tiếp theo</small><b>${esc(o.nextStep)}</b></div><div><small>ETD mục tiêu</small><b>${o.etdPlan ? day(o.etdPlan) : o.cutoff ? 'Cut-off ' + day(o.cutoff) : '—'}</b></div><div><small>Container</small><b>${esc(o.containers)}</b></div><div><small>Điều kiện thanh toán</small><b>${esc(o.term)}</b></div></div>${internal}
<h3 class="xt-sub">Dòng hàng</h3>${table(['SKU', 'Kích thước', 'Đặt (m²)', 'Đã sản xuất', 'Sẵn sàng tại kho', 'Đã xuất'], o.lines.map(l => [esc(l.product), esc(product(l.product)?.size || ''), n(l.ordered), n(l.produced), n(l.ready), n(l.shipped)]))}
<h3 class="xt-sub">Chứng từ</h3><div class="xt-docs">${doc(o.docs.pi, 'PI (đã ký)')}${doc(o.docs.packing, 'Packing list')}${doc(o.docs.bl === 'issued', 'Vận đơn (B/L)', !shippedYet)}${doc(o.docs.co === 'issued', 'C/O', !shippedYet)}</div>
<p class="xt-foot">Chứng từ tải trực tiếp từ trang này. Một nơi trả lời "đơn đang ở đâu / ai đang cần làm gì".</p></section>`;
}
function cShipments(d) {
  return panel('Lô hàng', 'Container và tàu của bạn', table(['Container', 'PI', 'Tàu', 'ETD', 'ATD', 'ETA', 'B/L', 'Trạng thái'], d.shipments.map(s => [
    s.container ? esc(s.container) : `— (${esc(s.containers)})`, piLink('customer', s.pi), esc(s.vessel || '—'), day(s.etd), day(s.atd), day(s.eta),
    s.bl ? dot(...BL[s.bl]) : '—', dot(...SHIP[s.status]),
  ])), 'Dữ liệu từ bảng theo dõi booking của Logistics');
}
function cStock(d) {
  return panel('Hàng sẵn kho', 'thành phẩm chưa phân bổ — có thể đặt thêm ngay', table(['SKU', 'Kích thước', 'Nhà máy', 'Có sẵn (m²)', 'Phẩm cấp', 'ETD sớm nhất', ''], d.readyStock.map(r => [
    esc(r.product), esc(product(r.product)?.size || ''), plantCode(r.plantId), n(r.available), esc(r.grade), day(r.earliestEtd),
    `<button type="button" data-xt="more:${esc(r.product)}">Đặt thêm</button>`,
  ])), 'Chỉ hiển thị SKU bạn đã mua / đã được duyệt.');
}
function cRequests(d) {
  const preset = ui.preset || {};
  const form = `<form id="xt-request-form" class="xt-form"><label>PI<select name="pi"><option value="">— Không gắn PI —</option>${d.orders.map(o => `<option ${preset.pi === o.id ? 'selected' : ''}>${esc(o.id)}</option>`).join('')}</select></label><label>Chủ đề<select name="topic">${Object.entries(TOPICS).map(([v, t]) => `<option value="${v}" ${preset.topic === v ? 'selected' : ''}>${t}</option>`).join('')}</select></label><label class="full">Nội dung<textarea name="text" required maxlength="500">${esc(preset.text || '')}</textarea></label><div class="form-actions"><button class="primary">Gửi yêu cầu</button></div></form>`;
  ui.preset = null;
  return panel('Gửi yêu cầu cho Prime', `Prime phản hồi trong ${REQUEST_SLA_HOURS}h`, form) +
    panel('Yêu cầu của tôi', '', table(['Gửi lúc', 'PI', 'Chủ đề', 'Nội dung', 'Trạng thái', 'Phản hồi'], d.requests.slice().sort((a, b) => b.at.localeCompare(a.at)).map(r => [
      stamp(r.at), esc(r.pi || '—'), TOPICS[r.topic], freeTextHTML(r.text), r.status === 'open' ? dot('Đang mở', 'amber') : dot('Đã phản hồi', 'green'), r.reply ? freeTextHTML(r.reply) : '—',
    ])));
}

// ---------- Sales App and Web ----------
const INTERNAL_TABS = [['exceptions', 'Bảng ngoại lệ'], ['pipeline', 'Pipeline theo khách'], ['decisions', 'Quyết định booking'], ['requests', 'Nhật ký yêu cầu'], ['quality', 'Chất lượng dữ liệu'], ['push', 'Nhật ký thông báo']];
function internalView(mode) {
  const d = data(mode), today = new Date(), scope = C.plant() === 'all' ? 'Tất cả nhà máy' : C.plant();
  const body = ui.pi.internal ? orderDetail(d, 'internal', today) : { exceptions: iExceptions, pipeline: iPipeline, decisions: iDecisions, requests: iRequests, quality: iQuality, push: iPush }[ui.internal](d, today);
  return `<div class="heading"><div><p class="eyebrow">${mode === 'web' ? 'Prime Business Workspace' : 'Prime · Sales App'}</p><h1>Điều hành đơn xuất khẩu</h1><p>Tập trung vào việc bất thường, người đang giữ việc và thời gian tồn đọng · ${esc(scope)}</p></div></div>${tabs('internal', INTERNAL_TABS)}${body}`;
}
function iExceptions(d, today) {
  const k = exceptionCounts(d, today), rows = exceptions(d, today);
  return kpis([
    ['Trễ so với ETD', k.late, 'PI trễ ETD đã báo khách', 'red'], ['Thiếu ETD', k.etdBlank, 'Sẵn sàng nhưng chưa có ETD', 'amber'],
    ['Sẵn sàng > 14 ngày', k.readyAged, 'Sẵn sàng nhưng tồn đọng', 'amber'], ['Quyết định > 24h', k.decision, 'Chờ quyết định quá SLA', 'red'],
    ['Thiếu chứng từ', k.docs, 'Tàu đã chạy, B/L hoặc C/O chưa có', 'amber'], ['Yêu cầu đang mở', k.requests, `${k.requestsOverdue} quá hạn phản hồi`, 'ink'],
  ]) + panel('Bấm PI để mở chi tiết', '', table(['Ngoại lệ', 'Khách hàng', 'PI', 'SL (m²)', 'Tuổi (ngày)', 'Đang chờ', 'Phụ trách'], rows.map(r => [
    dot(...EX[r.type]), esc(cust(r.customer)?.short), piLink('internal', r.pi), n(r.qty), n(r.age), esc(r.waitingOn), esc(r.owner),
  ])), 'Quy tắc: mọi ngoại lệ phải có người phụ trách · tuổi tự tính · quá SLA hiển thị trên trang Giám đốc');
}
function iPipeline(d, today) {
  const { rows, total } = pipeline(d, today), tone = p => p < 50 ? 'red' : p < 80 ? 'amber' : 'green';
  const cells = r => [r.customer === 'total' ? '<b>Tổng</b>' : esc(cust(r.customer)?.short), ...['confirmed', 'production', 'ready', 'booked', 'shipped', 'total', 'aged'].map(k => r.customer === 'total' ? `<b>${n(r[k])}</b>` : n(r[k])), r.customer === 'total' ? `<b>${r.etdFill}%</b>` : dot(r.etdFill + '%', tone(r.etdFill))];
  return panel('Pipeline đơn theo khách', 'm²', table(['Khách hàng', 'Đã xác nhận', 'Đang sản xuất', 'Sẵn sàng', 'Đã booking', 'Đã xuất tàu', 'Tổng tồn đơn', '> 90 ngày', 'Tỷ lệ có ETD'], [...rows.map(cells), cells(total)]),
    'Tỷ lệ có ETD = % m² tồn đơn (chưa xuất tàu) đã có ETD báo khách — KPI chính giai đoạn 1');
}
function iDecisions(d) {
  const now = new Date();
  return panel('Theo dõi quyết định booking', 'Mọi quyết định đang làm tàu không thể chạy', table(['PI', 'Khách hàng', 'Cần quyết định', 'Phương án', 'Đang chờ', 'Tạo lúc', 'Tuổi (giờ)', 'SLA'], d.decisions.map(x => {
    const h = hoursSince(x.raised, now);
    const options = x.choice ? `<b>${esc(x.choice)}</b><small> · ${esc(x.by)}</small>` : C.canEdit() ? `<div class="xt-options">${x.options.map((o, i) => `<button type="button" data-xt="decide:${x.id}:${i}">${esc(o)}</button>`).join('')}</div>` : esc(x.options.join(' / '));
    return [piLink('internal', x.pi), esc(cust(x.customer)?.short), esc(x.decision), options, esc(x.waitingOn), stamp(x.raised), x.choice ? '—' : n(h),
      x.choice ? dot('Đã quyết định', 'green') : h > SLA_HOURS ? dot('Quá SLA', 'red') : dot('Trong SLA', 'green')];
  })), 'Quyền quyết định ghi trong hệ thống (giá / tỷ lệ nhà máy / đóng hàng) — không cần chuyển cấp mỗi lần');
}
function iRequests(d) {
  const now = new Date();
  return panel('Nhật ký yêu cầu', `Yêu cầu từ Customer App · SLA phản hồi ${REQUEST_SLA_HOURS}h`, table(['Gửi lúc', 'Khách hàng', 'PI', 'Chủ đề', 'Nội dung', 'Tuổi (giờ)', 'Trạng thái', 'Phản hồi'], d.requests.slice().sort((a, b) => b.at.localeCompare(a.at)).map(r => {
    const h = hoursSince(r.at, now), open = r.status === 'open';
    const reply = open ? (C.canEdit() ? `<form class="xt-reply" data-id="${esc(r.id)}"><input name="reply" required maxlength="500" placeholder="Nội dung phản hồi"><button class="primary">Gửi</button></form>` : '—') : `${freeTextHTML(r.reply)}<small> · ${esc(r.repliedBy || '')}</small>`;
    return [stamp(r.at), esc(cust(r.customer)?.short), r.pi ? piLink('internal', r.pi) : '—', TOPICS[r.topic], freeTextHTML(r.text), open ? n(h) : '—',
      open ? (h > REQUEST_SLA_HOURS ? dot('Quá hạn', 'red') : dot('Đang mở', 'amber')) : dot('Đã phản hồi', 'green'), reply];
  })));
}
function iQuality(d, today) {
  const rows = dataQuality(d, today);
  return panel('Chất lượng dữ liệu', `${rows.length} trường cần bổ sung`, table(['PI', 'Trường', 'Vấn đề', 'Phụ trách'], rows.map(r => [piLink('internal', r.pi), esc(r.field), esc(r.problem), esc(r.owner)])),
    'Số liệu khách thấy chỉ đúng khi các trường này đầy đủ.');
}
function iPush(d, today) {
  return panel('Nhật ký thông báo', '14 ngày gần nhất', table(['Thời điểm', 'Khách hàng', 'PI', 'Nội dung', 'Kênh'], pushLog(d, today).map(r => [r.at.length > 10 ? stamp(r.at) : day(r.at), esc(cust(r.customer)?.short), piLink('internal', r.pi), esc(r.message), 'Customer App'])),
    'Mô phỏng: thông báo hiển thị trong Customer App, không gửi email / SMS thật.');
}

// ---------- Actions ----------
function save(mutate, message, activity) {
  const next = structuredClone(C.state().exportTracking || {});
  mutate(next);
  if (!C.commit({ exportTracking: next })) return;
  if (activity) C.log(...activity);
  C.render();
  if (message) C.toast(message);
}
let bound = false;
export function bindTracking() {
  if (bound) return; bound = true;
  document.addEventListener('click', e => {
    const b = e.target.closest('[data-xt]'); if (!b || !C) return;
    const [kind, a, c] = b.dataset.xt.split(':');
    if (kind === 'tab') { ui[a] = c; if (a === 'internal') ui.pi.internal = null; else ui.pi.customer = null; C.render(); }
    else if (kind === 'pi') { if (a === 'customer') { ui.customer = 'detail'; ui.pi.customer = c; } else ui.pi.internal = c; C.render(); }
    else if (kind === 'back') { ui.pi.internal = null; C.render(); }
    else if (kind === 'more') { ui.customer = 'requests'; ui.preset = { topic: 'stock', text: `Đặt thêm ${a} từ hàng sẵn kho: … m²`, pi: '' }; C.render(); }
    else if (kind === 'decide') {
      if (!C.canEdit()) return C.toast('Bạn không có quyền ghi quyết định.');
      const d = data('internal').decisions.find(x => x.id === a); if (!d || d.choice) return;
      const choice = d.options[Number(c)];
      save(s => { s.decisions = { ...(s.decisions || {}), [a]: { choice, by: C.actor(), decidedAt: new Date().toISOString() } }; s.pushLog = [...(s.pushLog || []), { at: new Date().toISOString(), pi: d.pi, customer: d.customer, message: `${d.decision}: ${choice}` }]; },
        'Đã ghi quyết định.', ['Cập nhật', 'export', d.pi, `${d.decision}: ${choice}`]);
    }
  });
  document.addEventListener('change', e => {
    const f = e.target.closest('[data-xt-filter]'); if (f) { ui.filter[f.dataset.xtFilter] = f.value; C.render(); return; }
    const p = e.target.closest('[data-xt-pick]'); if (p) { ui.pi.customer = p.value; C.render(); }
  });
  document.addEventListener('submit', e => {
    const form = e.target;
    if (form.id === 'xt-request-form') {
      const f = Object.fromEntries(new FormData(form)), text = String(f.text || '').trim();
      if (!text) return;
      const row = { id: 'RQ-' + crypto.randomUUID().slice(0, 8), customer: CUSTOMER_APP_ACCOUNT, pi: f.pi || null, topic: TOPICS[f.topic] ? f.topic : 'other', text, at: new Date().toISOString(), status: 'open' };
      save(s => { s.requests = [...(s.requests || []), row]; }, 'Đã gửi yêu cầu cho Prime.', ['Tạo', 'export', row.pi || row.id, 'Yêu cầu khách hàng']);
    } else if (form.classList.contains('xt-reply')) {
      if (!C.canEdit()) return C.toast('Bạn không có quyền phản hồi.');
      const reply = String(new FormData(form).get('reply') || '').trim(), id = form.dataset.id; if (!reply) return;
      save(s => { s.replies = { ...(s.replies || {}), [id]: { status: 'answered', reply, repliedAt: new Date().toISOString(), repliedBy: C.actor() } }; }, 'Đã phản hồi khách hàng.', ['Cập nhật', 'export', id, 'Phản hồi yêu cầu khách hàng']);
    }
  });
}
