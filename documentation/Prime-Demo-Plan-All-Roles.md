# PRIME — KỊCH BẢN DEMO THEO VAI VÀ LUỒNG NGHIỆP VỤ

Ngày đối chiếu: 01/11/2026. Phạm vi: Prime local tại http://127.0.0.1:5184/. Không thay đổi X-Booster, không push hoặc deploy.

## 1. Cách sử dụng tài liệu

- **Demo trực tiếp:** thao tác có lưu trạng thái trong POC, có thể kiểm tra kết quả sau thao tác.
- **Giới thiệu UI:** màn hình hoặc bước nghiệp vụ đang thể hiện giao diện/số liệu tham chiếu; chưa phải luồng liên thông hoàn chỉnh.
- **Kiểm tra ngoại lệ:** chủ động nhập trường hợp không hợp lệ để chứng minh hệ thống chặn hoặc yêu cầu xử lý.

Dữ liệu lưu trên trình duyệt. Vai làm việc và tài khoản xem thử phục vụ trình diễn; không phải xác thực và phân quyền máy chủ. Không dùng giao dịch, ảnh hoặc chứng từ thật. Trang Prime hiện có Web, Customer App, Sales App và App Bảo vệ.

Không coi việc khách xác nhận thỏa thuận là đã nhận tiền. Không coi duyệt kế hoạch là tăng tồn. Không coi dự báo trên dashboard là dự báo AI sản xuất đã được nghiệm thu.

## 2. Chuẩn bị trước buổi demo — 10 phút

| Việc chuẩn bị | Cách thực hiện | Điều kiện sẵn sàng |
|---|---|---|
| Đăng nhập | Dùng tài khoản thử nghiệm đã cấp | Vào được Prime local |
| Nhà máy | Dùng Prime Tiền Phong làm tình huống xuyên suốt; dùng Đại Việt để kiểm tra phạm vi | Không lẫn lô, khách hoặc PI giữa nhà máy |
| Vai và user | CMC Test để chuyển vai; Kho Tiền Phong để kiểm tra tài khoản giới hạn; Kế toán xuất khẩu · Tiền Phong để xác minh TT/LC của PI Tiền Phong | Chọn đúng user và nhà máy trước mỗi bước |
| Ảnh | Chuẩn bị JPG/PNG/WebP nhỏ hơn 5 MB; ảnh biển số, tình trạng xe và hàng trên xe | Không dùng ảnh nhạy cảm |
| Chứng từ | Chuẩn bị PDF/ảnh căn cứ TT/LC, CEO, QC và B/L giả định | Có thể tải lên và xem lại |
| PI đủ tồn | Dùng PI-POC-001 hoặc tạo PI mới với lượng nhỏ | Có lô đạt chất lượng và đủ trọng lượng SKU |
| PI thiếu tồn | PI-POC-002 | Có thể trình bày yêu cầu sản xuất; dữ liệu có thể đã được xử lý từ buổi trước |
| PI ngoại lệ | PI-POC-003 — TT100% | Chưa đủ tiền để thể hiện bước CEO duyệt |
| Xe | Chọn đơn BV-DH chưa có xe trong bãi; dùng xe có sẵn ở cổng ra cho nhánh xuất cổng | Đơn đến ngày lấy và đủ điều kiện vào cổng |
| File xuất | Cho phép trình duyệt tải Excel; chuẩn bị chức năng In / Lưu PDF | Kiểm tra nội dung file, không chỉ toast |
| Dữ liệu đã chạy | Xem trạng thái hiện tại trước khi bắt đầu | Bước đã xong thì dùng mã mới, không reset toàn bộ dữ liệu |

Dữ liệu PI-0007/SHP-0001 đã có ví dụ hai SKU, xếp hàng, INV/PL/SI/VGM và B/L đối chiếu đạt. SX-0001 có ví dụ nguyên liệu thiếu, phản hồi mua và lịch đã duyệt. Dùng các mã này để giới thiệu nhanh; tạo mã mới nếu muốn thao tác lại từ đầu.

Lưu ý ngày: không ghi hoàn tất sản xuất/QC ở tương lai. Với demo live toàn chuỗi trong ngày, chuẩn bị PI và lịch hợp lệ có ngày hoàn thành không vượt ngày hiện tại; nếu lịch đang ở tương lai, dừng ở duyệt lịch và dùng tình huống QC khác đã đến hạn. Không sửa đồng hồ máy để vượt kiểm tra.

## 3. Danh sách vai và trách nhiệm

| Vai / đối tượng | Phạm vi mong muốn | Vai trò trong buổi demo | Kết quả cần thấy |
|---|---|---|---|
| Quản trị hệ thống — CMC Test | Toàn hệ thống | Tạo role/user, gán quyền và nhà máy; kiểm tra nhật ký/thông báo | User giới hạn chỉ thấy phạm vi được cấp |
| Sales Admin | Nhà máy được giao | Tạo đơn nội địa; tạo báo giá và PI; theo dõi khách/lịch giao | Đơn nhiều dòng; PI có mã và lịch sử |
| Nhân viên Sales — Sales App | Tuyến/khách được giao theo cấu hình POC | Lên lịch, check-in, khảo sát, ghi sell-out | Chuyến thăm, khảo sát và sell-out là các dữ liệu riêng |
| Khách hàng — Customer App | Dữ liệu đại lý trong trải nghiệm POC | Chọn mẫu, nhập viên, tạo đơn, xem trạng thái/thỏa thuận | Đơn vào danh sách chờ duyệt; không tự ghi nhận tiền |
| Giám đốc Thương mại | Tất cả nhà máy | Duyệt đơn/PI; chốt lịch đáp ứng xuất khẩu | Có dấu vết duyệt, không bỏ qua bước tài chính/xếp hàng |
| Kế toán trưởng | Nhà máy được giao | Đối chiếu khoản thu có sẵn; xác minh TT/LC xuất khẩu | Căn cứ, tham chiếu, số tiền và trạng thái tài chính đúng |
| Kho | Nhà máy được giao | Kiểm tra lô; giữ tồn; xác nhận nguyên liệu; QC; hàng thực xếp | Không lấy hàng khóa chất lượng, không phân bổ vượt tồn |
| Kế hoạch sản xuất | Nhà máy được giao | Đánh giá thiếu hàng, khai nguyên liệu, lập lịch theo đợt | Kế hoạch gắn PI, có năng lực và ngày sẵn sàng |
| Phòng Mua hàng | Tất cả nhà máy | Phản hồi nguyên liệu thiếu | Lượng mua, ngày về, rủi ro và căn cứ được lưu |
| Giám đốc nhà máy | Nhà máy được giao | Duyệt/trả lại lịch sản xuất | Chỉ duyệt lịch nhà máy mình, ghi quyết định |
| Logistics/Xuất nhập khẩu | Nhà máy được giao | Shipment, container, chứng từ, B/L, giao hàng, hồ sơ hải quan/C/O | Bộ chứng từ liên kết PI và lượng thực xếp |
| Bảo vệ | Nhà máy được giao; app hiện trình diễn Tiền Phong | Xe vào, STT, ảnh, xe ra và xử lý chênh lệch | Có STT, thông báo, lịch sử và giữ xe khi sai |
| Xe nâng | Nhà máy được giao | Giải thích công việc xếp hàng và phối hợp khi giữ xe | Giới thiệu trách nhiệm; chưa có màn chuyển trạm riêng đầy đủ trong Prime |
| CFO | Tất cả nhà máy | Xem thu tiền, tuổi nợ và các số liệu tổng hợp | Đọc được phạm vi toàn hệ thống; chốt tháng/clearing nâng cao chỉ giới thiệu |
| CEO | Tất cả nhà máy | Duyệt ngoại lệ TT100% chưa thanh toán | Ngoại lệ có lý do, căn cứ, hạn và giới hạn tiền |

Sales và Khách hàng là trải nghiệm ứng dụng; không phải hai role mới đã được bổ sung vào dropdown Web. Thủ kho là bước nghiệp vụ giữa Sales Admin và Xe nâng; Prime hiện chưa có dropdown Thủ kho riêng. Không trình bày việc đổi dropdown CMC Test như đăng nhập một tài khoản nghiệp vụ độc lập.

## 4. Thứ tự và thời lượng

| Chặng | Nội dung | Thời lượng |
|---|---|---|
| 1 | Phân quyền, nhà máy, tài khoản | 8 phút |
| 2 | Sales App và thị trường | 10 phút |
| 3 | Customer App, đơn nội địa, duyệt | 10 phút |
| 4 | Kho, thu tiền và App Bảo vệ | 12 phút |
| 5 | Xuất khẩu đủ tồn và chứng từ | 20 phút |
| 6 | Xuất khẩu thiếu tồn, sản xuất/QC | 20 phút |
| 7 | Ngoại lệ, báo cáo, nhật ký và tổng kết | 10 phút |

Buổi đầy đủ khoảng 90 phút. Nếu chỉ có 45 phút, demo chặng 2, 3, 5 và phần thiếu tồn đến duyệt lịch; giới thiệu các chặng còn lại từ bản ghi đã chuẩn bị.

## 5. Luồng A — Quản trị, phạm vi nhà máy và thông báo

| Bước | Vai | Thao tác | Kết quả / điều cần giải thích |
|---|---|---|---|
| A1 | Quản trị | Mở Role and Permission; tạo role thử, chọn phạm vi nhà máy | Role có quyền Xem trước khi cấp Tạo/Sửa/Duyệt/Import/Export |
| A2 | Quản trị | Tạo user bằng email hoặc số điện thoại; gán role và nhà máy | Kiểm tra tên, liên hệ hợp lệ, liên hệ trùng, role và nhà máy |
| A3 | User giới hạn | Chuyển sang user đó; mở Kho/PI/kế hoạch | Chỉ hiện module và bản ghi trong phạm vi đã cấp |
| A4 | Quản trị | Bỏ quyền Export hoặc Duyệt khỏi role thử rồi kiểm tra lại | Không xuất hoặc duyệt bằng quyền Xem đơn thuần |
| A5 | Vai toàn hệ thống | Chọn Giám đốc Thương mại/CFO; đổi nhà máy và Tất cả nhà máy | Dữ liệu thay đổi theo bộ lọc; vai nhà máy không tự chọn phạm vi toàn hệ thống |
| A6 | Người nhận | Mở chuông sau một bước chuyển xử lý xuất khẩu | Thông báo tới đúng vai/nhà máy; đánh dấu đã đọc |
| A7 | Quản trị | Mở Activity Log; tìm mã PI/SX/shipment vừa dùng | Có người, thời gian và thao tác tương ứng |

Đây là kiểm tra POC trên trình duyệt. Không tuyên bố đã có đăng nhập riêng, OTP hay RBAC máy chủ cho từng user email/điện thoại.

## 6. Luồng B — Sales App: chuyến thăm → khảo sát → sell-out

| Bước | Vai | Thao tác | Kết quả |
|---|---|---|---|
| B1 | Sales | Sales App → Chuyến thăm → Lên lịch thăm; chọn điểm bán, ngày, mục tiêu | Lịch xuất hiện trong danh sách |
| B2 | Sales | Chọn chuyến thăm và Check-in | Trạng thái chuyển Đã check-in |
| B3 | Sales | Mở khảo sát; tải/chụp ảnh; chọn SKU và khách; chọn Có/Không/Chưa xác định | Một khảo sát sản phẩm, mức quan tâm được khai rõ |
| B4 | Sales | Nhập tồn Prime, tồn đối thủ và ghi chú; Lưu khảo sát | Có bản ghi trong dữ liệu khảo sát; không gửi người kiểm tra |
| B5 | Sales | Nhập dở rồi Lưu nháp | Lưu phần nhập trên thiết bị; hiện tại ảnh cần chọn lại khi mở nháp |
| B6 | Sales | Ghi số bán ra: khách, SKU, kỳ, số m² | Có bản ghi sell-out riêng; không dùng lượt quan tâm làm lượng bán |
| B7 | Quản lý | Web → Thị trường & sell-out; lọc nhà máy/thông tin | Xem quan tâm, số bán ra và tồn điểm bán theo miền |

Ngoại lệ: số lượng âm không hợp lệ; kiểm tra ảnh sai loại/quá 5 MB. Số 0 khác chưa ghi nhận. Không cam kết dashboard hiện tự học AI hoặc cập nhật dự báo từ mọi khảo sát mới: chuỗi quan tâm và đường dự kiến hiện vẫn có dữ liệu trình diễn và hệ số cố định. Check-in hiện là thao tác trạng thái, chưa phải kiểm chứng GPS thực tế.

## 7. Luồng C — Customer App và đặt hàng nội địa

### C1. Khách tự đặt

1. Customer App → danh mục; xem mẫu, thông tin và lượng được hiển thị.
2. Thêm hai SKU vào giỏ; nhập số viên; xem m² và giá trị.
3. Chọn ngày giao dự kiến → Tạo đơn hàng.
4. Mở Đơn hàng: có mã DH-APP, các dòng và trạng thái Chờ duyệt.
5. Giám đốc Thương mại mở đúng mã trên Web → Duyệt đơn.
6. Quay lại Customer App để xem trạng thái mới.

**Kết quả:** chứng minh khách tạo đơn và người có quyền duyệt xử lý cùng mã. Customer App hiện dùng đại lý POC cố định; chưa nghiệm thu đăng nhập đa khách hoặc cách ly dữ liệu khách bằng máy chủ.

### C2. Sales Admin tạo hộ

| Bước | Thao tác | Kết quả |
|---|---|---|
| 1 | Web → Đơn hàng & DOA → Tạo đơn hàng | Form xuất hiện phía trên danh sách |
| 2 | Tìm/chọn khách | Địa chỉ, vùng, hợp đồng/kỳ hạn và hạn mức xuất hiện |
| 3 | Chọn SKU đầu tiên, nhập viên; thêm SKU thứ hai | Mã ban đầu để trống; tự quy đổi hộp, viên lẻ, m² và tổng tiền |
| 4 | Nếu cần tải ảnh tin nhắn | Ảnh dùng đối chiếu thủ công; không giới thiệu OCR đã chạy |
| 5 | Nhập ngày dự kiến → Gửi duyệt | Tạo đơn mới Chờ duyệt, có lịch sử |
| 6 | Giám đốc Thương mại → Chi tiết → Duyệt | Chuyển Đã duyệt |

Kiểm tra số viên nguyên dương, thiếu khách/mã, ngày và hai dòng cùng SKU. Vượt hạn mức không được tự hiểu là bị cấm tạo đơn; chính sách ngoại lệ/DOA nội địa nâng cao chưa được nghiệm thu đầy đủ. Không trình bày nút Duyệt như tự giữ lô hoặc tự cấp phép xe vào.

## 8. Luồng D — Kho thành phẩm và thu tiền nội địa

### Kho

1. Kho → Kho thành phẩm; tìm SKU, lọc nhà máy/lô/chất lượng.
2. Xem lô: location, ngày sản xuất, sắc độ, phẩm cấp và số lượng.
3. So sánh lô đạt với lô khóa chất lượng: lô khóa không được dùng để cam kết trong luồng xuất khẩu.
4. Import file: chọn file theo mẫu của màn Import → xem trước → kiểm lỗi → nhập các dòng hợp lệ theo quy trình hiện có.
5. Kiểm tra lại location và số liệu sau import; Activity Log có dấu vết.

Phiếu điều chuyển hiện mở form và thông báo; chưa thực hiện sổ dịch chuyển tồn hoàn chỉnh. Chỉ giới thiệu UI, không dùng để chứng minh tồn đã chuyển.

### Kế toán trưởng / CFO

| Bước | Vai | Thao tác | Kết quả |
|---|---|---|---|
| 1 | Kế toán trưởng | Mở Thu tiền & công nợ | Phân biệt thỏa thuận trả trước, khoản thu và công nợ |
| 2 | Kế toán trưởng | Chọn khoản sao kê có sẵn chưa ghép → Đối chiếu → chọn khách → Xác minh | Giao dịch có khách và trạng thái Đã xác minh |
| 3 | Kế toán trưởng | Xem phân bổ | Giải thích ứng trước, đối trừ và tiền chưa phân bổ; màn này đang dùng số minh họa |
| 4 | CFO | Chọn phạm vi toàn hệ thống; xem phải thu và tuổi nợ | Giải thích trong hạn/1–30 ngày/trên 30 ngày |

Nhập giao dịch mới hiện có form/toast nhưng chưa lưu giao dịch mới đầy đủ. Xác nhận thỏa thuận, bảng tuổi nợ, phân bổ FIFO nhiều hóa đơn, chốt lãi/clearing nội địa chưa phải toàn bộ luồng động. Giới thiệu nguyên tắc lãi đơn 8%/năm, 365 ngày, lãi nợ sau hạn; không dùng màn này chứng minh bút toán thực tế hoặc ngân hàng tự đồng bộ.

## 9. Luồng E — App Bảo vệ: xe vào / xe ra

### Xe vào — demo trực tiếp

1. Bảo vệ → App Bảo vệ → Xác nhận xe vào.
2. Chụp/tải ảnh biển số và ảnh tình trạng xe vào.
3. Nhập biển số, tài xế; chọn khách và đơn đủ điều kiện; khai thiết bị mang vào.
4. Kiểm tra lượng lấy của chuyến này theo từng SKU, không vượt lượng còn lại.
5. Xác nhận xe vào.
6. Mở Xe trong bãi: có STT XE-ngày-số thứ tự, biển số, đơn, khách, ảnh và lịch sử.
7. Mở thông báo của Sales/Sales Admin phù hợp để kiểm tra thông báo xe đến.

Kết quả: xe chuyển sang chờ Sales Admin; biển số/đơn đã có xe trong bãi không được tạo trùng. App Bảo vệ hiện dùng nhà máy Tiền Phong, chưa mở thành ứng dụng đa nhà máy hoàn chỉnh.

### Bàn giao giữa trạm — giới thiệu

**Cổng vào → Sales Admin → Thủ kho → Xe nâng → Cổng ra.** Sales Admin kiểm chứng từ và điều kiện; Thủ kho đối chiếu SKU/lô/lượng; Xe nâng xếp hàng và xác nhận thực xếp. Prime hiện chưa có các màn thao tác chuyển trạm nội địa đầy đủ cho Sales Admin/Thủ kho/Xe nâng; dùng xe đã chuẩn bị ở cổng ra để demo bước kế tiếp. Không nói xe mới vào tự chạy xuyên đủ năm trạm.

### Xe ra — demo trực tiếp với xe đã xếp hàng

1. Bảo vệ → Kiểm tra xe ra → chọn xe đủ điều kiện → Bắt đầu kiểm tra.
2. Chụp ảnh hàng trên xe, nhập số viên thực đếm từng dòng, thiết bị mang ra; tick đã kiểm tra.
3. Nhánh đúng: xác nhận → xe ra cổng; cập nhật lượng giao và yêu cầu lập hóa đơn theo xử lý POC, có thông báo/lịch sử.
4. Nhánh sai: nhập chênh lệch hàng/thiết bị → giữ xe, ghi lý do và thông báo Thủ kho/Xe nâng.
5. Sau xử lý: nhập lại số thực tế khớp và kết quả giải quyết → xác nhận ra cổng.
6. Lịch sử xe → tìm biển số/STT/đơn, xem ảnh và thời gian.

Không có hóa đơn ERP hay xuất cổng vật lý tự động.

## 10. Luồng F — Xuất khẩu đủ tồn, từ báo giá tới hoàn tất

| STT | Vai | Màn / thao tác | Kết quả bắt buộc |
|---|---|---|---|
| F1 | Sales Admin | Đơn xuất khẩu → Tạo báo giá; khách, thị trường, tiền tệ, Incoterm, TT/LC, hiệu lực; thêm hai SKU theo viên và giá/m² | Báo giá có mã, dòng hàng, hộp/m²/giá trị |
| F2 | Sales Admin | Chuyển thành PI; nhập nhà máy, hạn sẵn sàng, ETD và lịch giao | PI V1 liên kết báo giá, không nhập lại dòng hàng |
| F3 | Giám đốc Thương mại | Mở PI → duyệt thương mại | Có người/thời gian duyệt; đủ điều kiện bắt đầu giữ hàng |
| F4 | Kho | Kiểm tra tồn theo SKU/lô/sắc độ/phẩm cấp | Hiện lượng cần, khả dụng, đã phân bổ và thiếu; chưa tự giữ hàng |
| F5 | Kho | Chọn lô đạt và xác nhận phân bổ | Giữ đúng số viên; PI khác thấy khả dụng giảm |
| F6 | Kế toán trưởng đúng nhà máy | Xác minh TT hoặc LC; nhập tham chiếu, số tiền/giá trị, hiệu lực và căn cứ | TT đạt khoản đến hạn hoặc LC hợp lệ; không đồng nhất với khách xác nhận |
| F7 | Logistics | Cấu hình trọng lượng SKU nếu thiếu; tạo Shipment từ PI, lượng giao, container/seal, booking, cảng, ETD/ETA | Shipment chỉ lấy lượng phân bổ chưa dành cho shipment khác |
| F8 | Kho | Ghi thực xếp theo lô/container, căn cứ | Không vượt lượng; chặn nếu tài chính/stock/trọng lượng không hợp lệ |
| F9 | Logistics | Lập INV, PL, SI, VGM | Lấy hàng thực xếp, có phiên bản/người phụ trách; VGM gồm bì |
| F10 | Logistics | Nhập B/L nháp; đối chiếu khách, SKU, lượng, net, container/seal | Đối chiếu đạt; sai phải sửa trước khi đi tiếp |
| F11 | Logistics | Xác nhận xuất hàng, ghi ATD | Kiểm lại tài chính và tồn; trừ tồn vật lý một lần |
| F12 | Logistics | Ghi nhận giao tới khách | Ngày giao hợp lệ, shipment có trạng thái giao |
| F13 | Logistics | Cập nhật kết quả hồ sơ Hải quan, sau đó C/O; nhập số tham chiếu/căn cứ | Lưu kết quả thủ công theo đúng thứ tự |
| F14 | Logistics | Hoàn tất shipment khi đủ giao hàng và hồ sơ | Không hoàn tất khi còn thiếu bước |
| F15 | Các vai có quyền Export | Excel PI/tồn/phân bổ/shipment/đối chiếu; In/Lưu PDF báo giá, PI, INV/PL/SI/VGM | File đúng mã, phiên bản và phạm vi được xem |

F4–F5 và F6 có thể làm song song; kiểm tài chính là bắt buộc trước xếp/xuất hàng. Một PI có nhiều SKU và nhiều shipment; POC hiện một nhà máy trên mỗi PI. C/O/hải quan là quản lý hồ sơ, không phát hành hoặc nộp thật.

## 11. Luồng G — Thiếu tồn → nguyên liệu → kế hoạch nhà máy → QC

| STT | Vai | Thao tác | Kết quả |
|---|---|---|---|
| G1 | Sales Admin / Thương mại | Tạo và duyệt PI lượng lớn, ví dụ PI-POC-002 | PI được phép lập phương án đáp ứng |
| G2 | Kho | Kiểm tồn, giữ phần đủ điều kiện; tạo yêu cầu cho phần thiếu | Phiếu SX liên kết PI/dòng/phiên bản, không tạo trùng yêu cầu đang xử lý |
| G3 | Kế hoạch sản xuất | Mở Kế hoạch & sản xuất → yêu cầu; nhập lượng cần sản xuất, vật tư, đơn vị, lượng cần và căn cứ | Chuyển Chờ kiểm tra NVL |
| G4 | Kho / Kế hoạch | Nhập vật tư thực có, ngày đối chiếu và căn cứ | Tính phần thiếu, không biến đây thành kho NVL/BOM tự động |
| G5A | Kế hoạch | Nếu nguyên liệu đủ: ghi căn cứ không cần mua | Bỏ qua Mua hàng hợp lệ → lập lịch |
| G5B | Mua hàng | Nếu thiếu: khai từng vật tư mua được/không, lượng, ngày về, rủi ro và căn cứ | Chuyển về Kế hoạch, có lịch sử/thông báo |
| G6 | Kế hoạch | Lập các đợt: viên, bắt đầu/kết thúc, QC, đóng gói, ngày sẵn sàng, năng lực/ngày | Tổng đợt đúng phần cần SX; hiện cảnh báo nếu trễ hoặc vượt năng lực |
| G7 | Giám đốc nhà máy | Duyệt hoặc trả lại; ghi lý do và xử lý cảnh báo | Chỉ lịch thuộc nhà máy mình; chưa tăng tồn |
| G8 | Giám đốc Thương mại | Chốt hoặc trả lại phương án giao | Có cam kết lịch được ghi nhận; không tự dời ETD |
| G9 | Kho | Khi đến ngày: ghi hoàn tất từng đợt, QC đạt/không, lô mới, location, sắc độ/phẩm cấp và căn cứ | QC không đạt không tăng tồn; đạt ghi đúng lượng đợt một lần |
| G10 | Kho | Quay lại PI → kiểm tra và phân bổ lô mới | Tồn QC đạt mới được giữ cho PI |
| G11 | Logistics / Kho | Tạo shipment tiếp theo, xếp và chứng từ như F7–F14 | Giao được nhiều chuyến, theo dõi lượng còn lại |

Các nhánh phải giải thích: Không đáp ứng cần lý do; nguyên liệu về sau ngày cần phải cảnh báo; lịch trả lại giữ lịch sử; lịch mới phải duyệt lại; phiếu SX theo đơn tách khỏi kế hoạch cuốn chiếu 3 tháng.

## 12. Luồng H — Ngoại lệ tài chính, thay đổi PI và giao từng phần

| Tình huống | Cách demo | Kết quả mong đợi |
|---|---|---|
| TT100% chưa trả | PI-POC-003 đã duyệt, thử xếp hàng khi chưa trả | Bị chặn tài chính, dù được kiểm tồn/lập phương án |
| CEO duyệt ngoại lệ | CEO nhập lý do, căn cứ, hạn hiệu lực và số tiền tối đa được miễn | Chỉ PI/phiên bản/phạm vi được duyệt đi tiếp |
| Ngoại lệ hết hạn / thiếu số tiền | Thử với điều kiện không còn hợp lệ | Không cho xếp/xuất; không tự gia hạn |
| LC hết hạn / không đủ giá trị | Kế toán nhập kết quả kiểm tra tương ứng | Chưa đạt tài chính |
| TT trùng tham chiếu | Dùng lại tham chiếu giao dịch đã xác minh sai PI | Chặn ghi nhận trùng |
| B/L sai seal hoặc lượng | Nhập sai một trường → đối chiếu → sửa | Lưu kết quả sai; chỉ bản đạt mới cho xuất |
| Thiếu trọng lượng SKU | Tạo/xếp shipment thiếu cấu hình | Báo thiếu, không tự đoán VGM |
| Đổi PI trước xuất | Tăng/đổi SKU/lượng/lịch, lưu phiên bản | Duyệt và phân bổ cũ cần rà soát lại; shipment/chứng từ chưa xuất bị đánh dấu cập nhật |
| Đổi PI sau đã xuất | Thử sửa cam kết trên PI có giao vật lý | POC chặn; không sửa âm thầm chứng từ hàng đã xuất |
| Giao nhiều đợt | Shipment 1 lấy một phần phân bổ; shipment 2 lấy phần còn lại | Không đặt trùng lượng vào hai shipment |
| Hủy shipment chưa xuất | Hủy và lập lại | Giải phóng lượng đã dành chuyến; giữ lịch sử và tồn đã phân bổ cho PI |
| Tồn thay đổi sau kiểm tra | Tình huống chuẩn bị trước | Khi xếp/xuất kiểm lại, không dựa vào kết quả cũ |
| Hai người sửa / bấm lại | Dùng bản ghi cũ hoặc lặp lệnh trong kiểm thử | Kiểm phiên bản/chống lặp trong POC; không tuyên bố tương đương giao dịch máy chủ |

## 13. Luồng I — Kế hoạch cuốn chiếu và điều hành lãnh đạo

1. Kế hoạch/Giám đốc nhà máy mở Kế hoạch & sản xuất, phân biệt hàng đợi SX theo PI ở trên với kế hoạch ba tháng ở dưới.
2. Tạo phương án theo SKU, nhà máy, lượng từng tháng; lưu và xem bản ghi.
3. Vai có quyền duyệt đánh giá phương án và duyệt; xem trạng thái.
4. CFO/CEO/Thương mại đổi nhà máy, xem tổng quan đơn, tồn, sell-out và công nợ.
5. Giới thiệu so sánh nhu cầu–năng lực và ngoại lệ; chưa trình bày biểu đồ năng lực minh họa là lịch máy tự động hoặc tối ưu sản xuất thực tế.

## 14. Ma trận bao phủ để người dẫn demo không bỏ vai

| Vai | Mã luồng cần thao tác | Luồng cần giải thích |
|---|---|---|
| Quản trị | A1–A7 | Cơ chế đăng nhập/giới hạn POC |
| Sales | B1–B6 | B7, luồng chuyển nhu cầu sang kinh doanh |
| Khách hàng | C1 | D: xác nhận khác tiền thực nhận |
| Sales Admin | C2, F1–F2 | E bàn giao Sales Admin |
| Giám đốc Thương mại | C duyệt, F3, G8 | H đổi lịch/đổi PI/ngoại lệ |
| Kế toán trưởng | D đối chiếu, F6 | H TT/LC, lãi và clearing |
| Kho | D kho, F4–F5/F8, G2/G4/G9–G10 | E Thủ kho, giữ tồn dùng chung |
| Kế hoạch sản xuất | G3/G5A/G6, I | Trả lại lịch, nhiều đợt, Không đáp ứng |
| Mua hàng | G5B | Rủi ro nguyên liệu về trễ/không mua được |
| Giám đốc nhà máy | G7 | Năng lực, QC và đúng nhà máy |
| Logistics/XNK | F7/F9–F15, G11 | H thay PI, B/L sai, hủy/lập lại |
| Bảo vệ | E xe vào và xe ra | Giữ xe, lịch sử, giới hạn Tiền Phong |
| Xe nâng | Giới thiệu E | Chưa có UI chuyển trạm riêng đầy đủ |
| CFO | D tổng hợp, I | Chốt tháng/clearing là bước mở rộng |
| CEO | H ngoại lệ TT100% | I toàn hệ thống và giới hạn ngoại lệ |

## 15. Checklist kết thúc và bằng chứng

- Ghi lại mã đơn, báo giá, PI, SX, shipment, tham chiếu TT/LC và người thao tác.
- Chụp màn duyệt PI, phân bổ lô, nguyên liệu thiếu, lịch duyệt, QC, bộ chứng từ và B/L đạt.
- Mở lại bản ghi để chứng minh đã lưu; tải ít nhất một Excel và kiểm tra nội dung; xem mẫu in PDF.
- Kiểm tra notification và Activity Log theo vai/nhà máy.
- Nhắc lại: chỉ QC đạt tăng tồn; chỉ xuất hàng trừ tồn vật lý; thỏa thuận không phải khoản thu; quan tâm không phải sell-out.
- Ghi nhận riêng chức năng UI minh họa/chưa liên thông; không tính là nghiệm thu end-to-end.
- Không reset hoặc xóa dữ liệu đã demo nếu chưa có yêu cầu; không tự push/deploy sau buổi demo.

## 16. Tiêu chí đánh giá buổi POC

| Nhóm | Đạt khi |
|---|---|
| Vai/phạm vi | User thử chỉ thấy phạm vi được gán; vai toàn hệ thống lọc được nhà máy; không cấp quyền qua lời giải thích |
| Nội địa | Tạo nhiều dòng theo viên, quy đổi đúng, lưu và duyệt được; nêu rõ các đoạn chưa liên thông |
| Sales | Lịch/check-in/khảo sát/sell-out lưu riêng; không nhầm số quan tâm và lượng bán |
| Bảo vệ | Vào có ảnh/STT; ra khớp thì hoàn tất, chênh thì giữ và có lịch sử |
| Xuất khẩu đủ tồn | Một mã PI đi từ báo giá tới shipment/chứng từ; tài chính và tồn được kiểm tra |
| Xuất khẩu thiếu tồn | Có yêu cầu liên kết, nguyên liệu, mua bổ sung, lịch hai cấp duyệt, QC mới tăng tồn |
| Ngoại lệ | TT/LC/B/L/phiên bản/lượng giao sai bị xử lý đúng; không bỏ qua bằng chuyển trạng thái tay |
| Báo cáo | File xuất đúng phạm vi và dữ liệu; không gọi file chuẩn bị là chứng từ đã phát hành |

Các điểm chưa hoàn thiện cần ghi thành backlog sau demo: đăng nhập đa user và RBAC máy chủ; Customer App đa khách; chuyển trạm nội địa đầy đủ; AR/clearing động; sổ điều chuyển; dự báo dữ liệu thật và kết nối ngân hàng/ERP/hải quan. Đây là khoảng trống hiện tại, không phải chức năng đã bàn giao.
