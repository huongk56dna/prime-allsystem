# Prime UI Review

Standalone review project for three experiences: Business Web, Customer App, Sales App.

- Every customer, product record, transaction and operational figure is fictional.
- No data, credentials, endpoint calls or storage bindings from X-Booster.
- Test login: username `cmc-test`, password supplied separately. No OpenAI sign-in. This browser-only gate is intentionally for synthetic UI testing; static files remain downloadable and session flags can be bypassed. Do not use real data. For production, use server-side authentication.
- Static frontend. Sample interactions and feedback persist only in this browser's localStorage.
- Uploaded images stay as in-memory blob URLs and are never uploaded. Drafts exclude images.
- Review feedback can be exported as JSON. No automatic sending or collaboration sync.
- Chart projections are illustrative scenarios, not AI forecasts or production recommendations.
- App / role switchers are UI demonstrations, not real RBAC. Access is enforced by the private Sites audience.
- No bank transfers, live AI, ERP, customs, actual order processing or notifications are connected.

Only publish this project's own manifest/project ID; never deploy it to X-Booster.

Preview: python3 -m http.server 5184 --directory dist

## GitHub Pages
Serve from the `docs/` folder on the default branch in repository Settings → Pages. All asset paths are relative, including the ES modules. No build or OpenAI API key is required.

The Sites audience setting does not transfer to GitHub Pages. Only the test UI gate applies there; it is not real access control.

## Factory scopes and module filters (local changes, not pushed)

Factory list: Prime Tiền Phong, Prime Đại Việt, Prime Vĩnh Phúc, Prime Ngói Việt.

The Web role switcher demonstrates these UI scopes:
- Sales Admin, Factory Director, Warehouse, Forklift, Security: Prime Tiền Phong.
- Chief Accountant: Prime Đại Việt.
- Commercial Director, Purchasing, CFO, CEO: all four factories; optionally narrow the view.

Assignments above are fixture profiles for review, not identity-backed production permissions. The static test login and app switcher remain a UI demonstration. No real RBAC, server database or factory permissions have been deployed.

Customer App represents NPP An Phú separately; Sales App represents Sales Minh An. The Web role switcher does not impersonate those identities.

Each list module has search and relevant filters (stock quality and dimensions, order/customer/status/dates, AR status/dates, sell-out period/ownership, plan SKU/period/status, export country/terms/status, document type/shipment/status). Scope filters are applied before module filters. Unknown factory ownership is hidden from factory-specific views.

Validation: `node --test tests/*.test.mjs`.

## Order creation flow

The local Prime order editor now follows the X-Booster creation experience: inline above the list, searchable customer selection, read-only address/region/contract/term/credit limit/debt, expected pickup/delivery date, initially empty SKU selection, multiple removable product lines, piece-based quantities, SKU packaging and area conversion, stock in boxes/pieces, prices per m², automatic totals, and direct submission to the Commercial Director queue without confirmation popups. Credit limit is displayed but does not prevent submission. Stock shortage is flagged and does not reserve stock.

Image upload/drop supports JPG/PNG up to 5 MB as a reference preview. It does not call X-Booster's AI endpoint or extract data automatically. New orders persist only in this review project's browser storage. Commercial Director approval remains a UI demonstration, not a production server authorization boundary.

### App Bảo vệ (local)
- Mở `/#guard/home`. Phạm vi hiện tại: Bảo vệ Prime Tiền Phong.
- Xe vào: chọn khách/đơn đã xác nhận, chụp hoặc tải hai ảnh riêng, nhập biển số/tài xế/thiết bị và lượng lấy; cấp STT theo ngày, thông báo nội bộ Sales/Sales Admin.
- Xe ra: chỉ sau bước Xe nâng; bắt đầu kiểm tra, ảnh mới, kiểm đếm và thiết bị. Chênh lệch giữ xe, báo Thủ kho/Xe nâng; sửa chênh lệch phải ghi căn cứ. Hoàn tất ghi thực giao và yêu cầu Kế toán xử lý.
- Có dữ liệu giả lập riêng mã BV-DH/BV-XE để thử xe chờ vào, chờ Sales, chờ ra và bị giữ. Xác nhận thỏa thuận trả trước không được coi là tiền đã nhận.
- Ảnh lưu Blob trong IndexedDB, hồ sơ xe và thông báo lưu localStorage. Dữ liệu/thông báo không đồng bộ giữa thiết bị; quyền hiện tại phục vụ duyệt UI, không thay thế kiểm tra quyền máy chủ. Không kết nối hoặc sửa X-Booster.
- Không tự động triển khai hoặc đẩy GitHub.

### Web: Import, Roles, Activity Log và thông báo
- Import kho đọc XLSX/XLS/CSV tại trình duyệt bằng SheetJS CE 0.20.3 (bundle local, https://sheetjs.com). Chọn sheet, ghép cột và xem trước; toàn bộ lỗi phải được sửa trước khi ghi. File tối đa 5 MB / 2.000 dòng; công thức cần chuyển thành giá trị. Dữ liệu khác hệ thống cần xuất ra một trong các định dạng này; chưa có kết nối API kho ngoài.
- Khóa cập nhật tồn: SKU + nhà máy + location + lô + sắc độ + phẩm cấp. Ghi số dư tuyệt đối, không cộng dồn; nhập lại cùng file cập nhật đúng lô. Danh mục SKU không tự tạo từ file. Tồn nhập được sử dụng trong kiểm tra tồn đơn hàng.
- Role and Permission: tạo/sửa role tự định nghĩa, quyền theo module, gán nhiều role cho user tạo bằng email hoặc điện thoại, phân công nhà máy, tạm khóa user. Quyền kết hợp theo role; thao tác cần quyền Xem trước. Role hệ thống và quản trị gốc chỉ đọc để tránh tự khóa.
- Dropdown tài khoản trên header là **xem thử quyền** sau cổng cmc-test, không phải đăng nhập thật bằng email/SĐT. Không gửi email, SMS hay tạo mật khẩu. Chỉ dùng dữ liệu hư cấu; cần backend xác thực và kiểm tra quyền máy chủ trước vận hành thật.
- Activity Log ghi thay đổi bản ghi, thao tác import/xuất, mở chức năng/chi tiết, đăng nhập/đăng xuất và đọc thông báo từ khi bật chức năng. Không truy dựng hoạt động quá khứ; không lưu nội dung ảnh, mật khẩu hoặc giá trị email/điện thoại vào nội dung thay đổi. Lưu local, không bảo đảm chống sửa/xóa bằng devtools và không tổng hợp giữa thiết bị.
- Chuông lọc theo người nhận hoặc role và nhà máy, số chưa đọc và đánh dấu đã đọc riêng từng user. Bao gồm thông báo cổng và kết quả import. Không push notification nền hoặc đồng bộ thiết bị.
- Không push/deploy trong đợt thay đổi này.

### Xuất khẩu — luồng liên kết local (chưa triển khai online)
- Báo giá nhiều SKU → chuyển PI → Giám đốc Thương mại duyệt → Kế toán trưởng xác minh TT/LC → Kho kiểm tồn/giữ lô → sản xuất phần thiếu nếu có → shipment/xếp hàng → INV/PL/SI/VGM → B/L → hồ sơ Hải quan/C/O thủ công → đóng shipment.
- Báo giá/PI quản lý một nhà máy cho mỗi PI trong bản POC này; mỗi PI nhiều SKU, nhiều đợt sản xuất và nhiều shipment. Đơn giá theo m², nhập theo viên, tiền tệ riêng từng PI. Không quy đổi ngoại tệ hoặc cộng tiền khác tiền tệ.
- Giữ nguyên mảng PI/plan cũ. PI cũ được đưa vào màn mới ở trạng thái Cần bổ sung, không tự duyệt, xác minh tiền hoặc giữ tồn. Số m² cũ không nguyên viên được đánh dấu để người dùng xác nhận lại trước khi dùng.
- Kho xác nhận phân bổ theo lô, location, sắc độ, phẩm cấp. Tồn khả dụng dùng chung phép tính với đơn nội địa và trừ phân bổ xuất khẩu. Xuất shipment mới ghi giảm lượng thực giao. Không tăng tồn ở bước duyệt kế hoạch; Kho nhập từng đợt chỉ sau hoàn tất/QC đạt. Không tự tạo đơn mua nguyên liệu hoặc BOM.
- Đổi PI chưa xuất hàng: lưu phiên bản cũ, giải phóng phân bổ, đánh dấu yêu cầu sản xuất và shipment/chứng từ cũ cần cập nhật; lập shipment thay thế từ phân bổ mới. PI đã có thực xuất được khóa sửa cam kết để bảo toàn lịch sử giao.
- Xác minh TT/LC độc lập với xác nhận thỏa thuận trả trước. Chặn xếp/xuất khi khoản đến hạn chưa đạt; TT100% có yêu cầu CEO với số tiền, thời hạn và bằng chứng. LC kiểm giá trị/hiệu lực/xác minh mới nhất. Không gửi thanh toán hoặc liên hệ ngân hàng.
- Role Kế hoạch sản xuất và Logistics/Xuất nhập khẩu theo nhà máy. Giám đốc nhà máy duyệt lịch, Giám đốc Thương mại chốt phương án, Mua hàng phản hồi thiếu nguyên liệu; ngày sẵn sàng muộn, nguyên liệu về trễ, vượt năng lực/đụng lịch được cảnh báo và yêu cầu người duyệt xem xét. Không tự đổi ETD.
- Shipment lấy hàng đã phân bổ; dữ liệu net kg/viên và bì kg/hộp do Logistics cấu hình, không đoán từ ảnh hoặc mặc định. VGM gồm net + bì đóng gói + vỏ container; chặn vượt tải khai báo. Phần sai lệch lượng thực xếp cần lập lại shipment thay thế, không âm thầm sửa số lượng kế hoạch.
- Chứng từ có snapshot, phiên bản, người lập và lịch sử. B/L nháp đối chiếu khách, SKU, viên, net, container, seal; sai phải ghi bản đối chiếu mới. Hải quan/C/O lưu tham chiếu và kết quả xử lý thủ công, không khai báo tự động/phát hành thật.
- Export Excel theo bộ lọc/phạm vi cho PI, nguyên liệu, Mua hàng, lịch sản xuất, phân bổ, shipment và bảng đối chiếu. Báo giá/PI/INV/PL/SI/VGM có màn xem mẫu in và nút In / Lưu PDF qua trình duyệt.
- Các thao tác mới ghi Activity Log, gửi thông báo nội bộ theo role/nhà máy, chống gửi lặp bằng command ID và kiểm tra revision. Web Locks tuần tự hóa các thao tác xuất khẩu giữa tab cùng trình duyệt. Đây vẫn là kiểm soát POC phía client, không phải giao dịch/RBAC máy chủ hoặc đồng bộ liên thiết bị.
- Ba cặp báo giá/PI `QT-POC-001`/`PI-POC-001` (đủ tồn), `002` (thiếu hàng), `003` (TT100%) là dữ liệu giả lập độc lập, bắt đầu ở bước chờ duyệt để người demo tự chạy đúng vai. Không có thanh toán/xác minh giả được gán vào các PI cũ.
- Có tệp căn cứ PDF/JPG/PNG/WebP tùy chọn (≤5 MB) khi xác minh TT/LC, yêu cầu/quyết định CEO, kiểm đếm, QC, đối chiếu B/L và cập nhật hồ sơ. Blob lưu IndexedDB, hồ sơ lưu ID/tham chiếu; xem/tải trong phạm vi module và nhà máy. Không đồng bộ file giữa thiết bị.
- Có thể hủy shipment trước thực xuất để lập lại chuyến với lượng thực xếp khác; giữ lịch sử và giải phóng phần booking, không hủy ngược lượng đã thực xuất.

## Ngôn ngữ VN / EN / TH

Bộ chọn nằm cạnh chuông thông báo và có trên màn đăng nhập. Lựa chọn lưu bằng `prime-language-v1`, dùng chung cho Web, Customer App, Sales App và App Bảo vệ. Catalog cục bộ dùng bản dịch cố định; không gọi dịch vụ dịch bên ngoài. Nhãn, trạng thái, cảnh báo, quyền, mẫu in và tiêu đề Excel/CSV theo ngôn ngữ đang chọn. Tên riêng, mã SKU/PI, giá trị option, tệp và nội dung tự nhập được giữ nguyên. Đổi ngôn ngữ không render lại form đang nhập. Các mẫu import chấp nhận nhãn và trạng thái chất lượng VN/EN/TH nhưng lưu giá trị nghiệp vụ chuẩn. Điều khiển lịch, hộp thoại chọn tệp hoặc in thuộc trình duyệt/hệ điều hành có thể theo ngôn ngữ thiết bị.
