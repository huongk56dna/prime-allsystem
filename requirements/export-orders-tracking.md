# Export Orders: Customer view and Sales view

Source: prototype images 7 to 14 in `Huong's project` (WhatsApp images, 2 Nov 2026), numbered in time order.

| # | File | Screen |
|---|------|--------|
| 7 | 14.24.07 | Customer · 4 Shipments |
| 8 | 14.24.08 | Customer · 5 Ready Stock |
| 9 | 14.24.09 | Customer · 3 Order Detail |
| 10 | 14.24.10 | Customer · 2 My Orders |
| 11 | 14.24.11 | Customer · 1 Overview |
| 12 | 14.26.12 | Sales · 3 Booking Decisions |
| 13 | 14.26.13 | Sales · 2 Pipeline by Customer |
| 14 | 14.26.14 | Sales · 1 Exception Board |

The prototypes show tab 6 in each view (Customer "Requests", Sales "Request Log", "Data Quality" and "Push Log") but no screen for them. This build adds a minimal version of each and marks it below as an assumption.

## 1. Goal

Customers today ask the same questions in chat: "Where is my order? When did the ship leave? Have the documents arrived?" The Customer view answers these from the same data Prime uses (no separate weekly files). The Sales view shows what customers do not see: who is holding the work, how long it has been stuck, decisions that stop a vessel from leaving, and the gap between the ETD promised to the customer and what actually happened.

## 2. Where it lives

| App | Route | Menu |
|-----|-------|------|
| Customer App | `#customer/export` | Đơn xuất khẩu / Export Orders |
| Sales App | `#sales/export` | Đơn xuất khẩu / Export Orders |
| Web (admin) | `#web/tracking` | Điều hành xuất khẩu / Export Control, next to the existing Export Orders module |

Both the Sales App and the Web use the same Sales view. The Web view follows the selected role and factory scope. Access to the Web page uses the `export` module permission. Recording a decision or replying to a request needs `export: update` on the Web, or `sales: update` in the Sales App.

All screens use the existing Prime theme (panels, tables, badges, colours) and the VN / EN / TH language switcher.

## 3. Shared data model

One dataset feeds both views (`docs/export-tracking-domain.js`).

- **Order (PI):** id, customer, plant, PO date, stage, lines (SKU, ordered, produced, ready in warehouse, shipped m²), stage dates, planned ETD, ATD, ETA, cut-off, containers, vessel, payment term, documents (PI, packing list, B/L, C/O), next step, waiting on, owner.
- **Stages, six steps:** Order confirmed, In production, Ready to ship, Booked, Shipped, Delivered.
- **Shipment (container):** container no., PI, vessel, ETD, ATD, ETA, B/L status (draft or issued), status (awaiting booking, booked, at sea).
- **Ready stock:** SKU, plant, available m², grade, earliest ETD.
- **Booking decision:** PI, customer, decision needed, options, waiting on, raised time, chosen option, decided by.
- **Customer request:** PI (optional), topic, text, sent time, status, reply, replied by.

## 4. Customer view (images 7 to 11)

The customer sees only their own PIs. They never see price or cost, remaining production capacity, other customers' orders, or the names of internal people holding the work.

### 4.1 Overview (image 11)
- Six KPI cards: Open orders (unclosed PIs), In production, Ready to ship (waiting for booking), Booked (vessel booked, waiting for loading), Shipped, Late vs ETD (against the ETD we gave).
- "Next 14 days" table: Date, Event, PI, Qty (m²), Status. Events: vessel departs (booked orders), production complete, cut-off with booking needed (ready orders), ETA at destination port (shipped orders).
- Footer: "Source: Order + Booking + Shipment, refreshed automatically".

### 4.2 My Orders (image 10)
- Filters: status, plant, PO month.
- Columns: PI, PO date, Plant, Ordered (m²), Produced (bar and %), Shipped %, Status, ETD plan, ETA.
- A late row is coloured and its status reads "Late — delivered N days after ETD".
- Clicking a PI opens Order Detail. A blank ETD means Prime has not confirmed booking yet. That is shown honestly and is not a commitment.

### 4.3 Order Detail (image 9)
- Header: PI, status, plant, total m², plus a PI picker.
- Six-step timeline with the actual date of each step. Finished steps are green and the current step is amber.
- Facts: Next step, Target ETD (or the cut-off date), Containers, Payment term.
- Line items: SKU, Size, Ordered, Produced, Ready in WH, Shipped.
- Documents: PI (signed), Packing list, Bill of Lading, C/O. A missing document is drawn dashed with "after shipped" or "not yet".

### 4.4 Shipments (image 7)
- Columns: Container, PI, Vessel, ETD, ATD, ETA, B/L (Issued or Draft), Status (At sea, Booked, Awaiting booking).
- A PI without containers yet shows "— (8 × 20')".
- Footer: "Data from the Logistics booking tracker".

### 4.5 Ready Stock (image 8)
- Columns: SKU, Size, Plant, Available (m²), Grade, Earliest ETD.
- Shows only SKUs this customer has bought or been approved for. This replaces the weekly stock file customers ask for in chat, and lets customers see grade and aging we want to clear.
- *Added:* an "Order more" button opens a pre-filled request (tab 6).

### 4.6 Requests (*assumption, no image*)
- Form: PI (optional), topic (ETD / vessel schedule, Documents, Order more ready stock, Order change, Other), text.
- List of my requests with status (Open or Answered) and Prime's reply. Reply target is 24 h.

## 5. Sales view (images 12 to 14), Sales App and Web

Focus on unusual items, not all items, and on the owner and how long things have been stuck. This addresses the bottlenecks seen with large customers: a single point of contact, pending decisions, and blank ETDs.

### 5.1 Exception Board (image 14)
- Six KPI cards: Late vs ETD, ETD blank (ready but no ETD), Ready > 14 days (ready but backlogged), Decisions > 24h (waiting beyond SLA), Docs missing (vessel left, B/L or C/O not issued), Requests open (with the number of overdue replies).
- Table: Exception, Customer, PI, Qty (m²), Age (d), Waiting on, Owner. Clicking a PI opens the detail with customer, waiting on, owner and plant added.
- Rules: every exception must have an owner, age is counted automatically, and SLA breaches go to the GD/SCM Director page (not built yet).

| Exception | Rule |
|-----------|------|
| Late vs ETD | ATD later than planned ETD, or planned ETD has passed with no ATD |
| ETD blank | Ready or booked, with no planned ETD |
| Ready > 14 d | Ready for more than 14 days |
| Decision > 24h | Open booking decision older than 24 h |
| Docs missing | Shipped or delivered, and B/L or C/O not issued |

### 5.2 Pipeline by Customer (image 13)
- m² per customer: Confirmed, In production, Ready, Booked, Shipped, Backlog total, > 90 days (by PO date), ETD fill, plus a Total row.
- ETD fill = % of not-yet-shipped backlog m² that has an ETD given to the customer. This is the key Phase 1 KPI. Below 50% is red, below 80% amber, otherwise green.
- Used to discuss allocation with planning / S&OP and to spot customers we cannot promise an ETD to.

### 5.3 Booking Decisions (image 12)
- Columns: PI, Customer, Decision needed, Options, Waiting on, Raised, Age (h), SLA (Within or Breached against 24 h).
- Users with update rights choose an option directly in the table. The choice, the person and the time are recorded, the item leaves the exception board, and a push-log entry is added.
- Decision rights (price, plant split, loading) are recorded in the system so they do not need escalation every time. The system shows who has to decide, not only the status.

### 5.4 Request Log (*assumption*)
- Customer requests from tab 4.6 with age and status (Open, Overdue after 24 h, Answered). Users with update rights can reply inline, and the customer sees the reply.

### 5.5 Data Quality (*assumption*)
- Lists fields that would make the customer view wrong: missing ETD, booked without vessel, ETD without ETA, ready but stock short, ETD passed without ATD, vessel left without B/L issued.

### 5.6 Push Log (*assumption*)
- Status changes shown to customers in the last 14 days (ready, booked, departed, delivered, decisions). This is simulated, and no email or SMS is sent.

## 6. Out of scope and open questions

1. **Real data.** Customers, PIs and numbers are fictional fixtures, as required by this POC repo. Prototype customer names were replaced by fictional ones (Lotus Export Trading, Siam Tile Distribution, Orchid Building Materials), and SKUs and plants use the repo catalogue (VP = Prime Vĩnh Phúc, ĐV = Prime Đại Việt, TP = Prime Tiền Phong). The tracking data is not yet linked to the existing Export Orders / Shipment modules. Linking them is the next step.
2. **"Shipped (MTD)"** in the prototype is shown as shipped in the last 30 days, so the card is not empty at the start of a month. Confirm which one you want.
3. The **"Customer view / Prime view / Side by side"** switch and the blue "What customers see" boxes in the prototype are treated as design notes, not product UI.
4. The **Director page** for SLA breaches is not built.
5. Decisions and requests are saved only in this browser (localStorage), like the rest of the POC.
