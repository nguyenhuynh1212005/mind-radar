# Project Control Center (PCC)

Bảng điều khiển cục bộ dành riêng cho lập trình viên để theo dõi tiến độ MVP của kho lưu trữ này và tạo các prompt bàn giao AI (AI handoff prompts).

## Chức năng chính

- Đọc cấu trúc kho lưu trữ.
- Đọc tệp project-map.json.
- Kiểm tra trạng thái Git (Git status).
- Tính toán tiến độ MVP thực tế.
- Tạo tệp docs/projectStatus.md.
- Tạo tệp docs/CHATBOT_HANDOFF.md.
- Tạo tệp .project/status.snapshot.json.
- Xuất dữ liệu ngữ cảnh AI (AI context bundles) để trợ lý ảo hoặc Codex xem xét.
- Cung cấp các nút sao chép nhanh các prompt AI phổ biến.

## Những gì công cụ KHÔNG làm

- Không tham gia xây dựng hoặc biên dịch ứng dụng đánh giá chính (assessment product app).
- Không tạo các ngân hàng câu hỏi dùng cho môi trường production.
- Không xác thực độ tin cậy khoa học/tâm lý học của bài kiểm tra.
- Không thay thế cho các bài kiểm tra tự động (unit tests).
- Không đọc các thông tin nhạy cảm hay bí mật (secrets, tệp .env).

## Các tệp tài liệu chính

- controlCenterSpec.md: Đặc tả sản phẩm cho công cụ này.
- projectMap.md: Giải thích chi tiết bằng ngôn ngữ tự nhiên về mô hình tính toán tiến độ.
- project-map.json: Danh sách checklist các giai đoạn ở định dạng máy có thể đọc được.
- CODEX_PROMPTS.md: Các câu lệnh mẫu dành cho Codex.

## Lưu ý khi triển khai

Project Control Center là một công cụ độc lập sử dụng Vite + TypeScript. Công cụ này tuyệt đối không được tự ý cấu trúc lại hoặc sửa đổi mã nguồn ứng dụng đánh giá chính nằm trong thư mục `src/` ở gốc dự án.

Việc tính toán tiến độ thời gian thực sử dụng `tools/project-control-center/project-map.json` làm nguồn dữ liệu duy nhất mà máy có thể đọc được. Tệp `projectMap.md` chỉ đóng vai trò là tài liệu hướng dẫn và không được phân tích bởi mã nguồn chạy thực tế.

## Hướng dẫn các lệnh chạy từ thư mục gốc của dự án

Để thuận tiện cho việc phát triển và tích hợp, bạn có thể thực thi tất cả các lệnh quản lý Project Control Center trực tiếp từ thư mục gốc của dự án mà không cần phải chuyển thư mục (cd).

### 1. Cài đặt các gói phụ thuộc
```bash
npm run pcc:install
```

### 2. Quét trạng thái tiến độ dự án
Lệnh này quét toàn bộ dự án và cập nhật các tệp trạng thái trong thư mục `docs/` và thư mục `.project/`.
```bash
npm run pcc:scan
```

### 3. Chạy máy chủ phát triển (Development Server)
Khởi chạy bảng điều khiển giao diện web cục bộ trên trình duyệt.
```bash
npm run pcc:dev
```
Giao diện Web sau đó sẽ khả dụng tại địa chỉ: `http://127.0.0.1:5174` hoặc địa chỉ được hiển thị trên terminal.

### 4. Chạy kiểm thử (Unit Tests) cho PCC
```bash
npm run pcc:test
```

### 5. Biên dịch công cụ
```bash
npm run pcc:build
```

### 6. Xuất ngữ cảnh AI
Tạo các tệp bundle ngữ cảnh an toàn cho chatbot tại `.ai/context-bundle.md` và `.ai/code-index.json`.
```bash
npm run pcc:export
```

---

## Hướng dẫn các lệnh chạy trực tiếp bên trong thư mục công cụ (Lựa chọn thay thế)

Nếu bạn muốn thao tác trực tiếp bên trong thư mục của Project Control Center, bạn có thể sử dụng các lệnh sau:

```bash
cd tools/project-control-center
npm install
npm run typecheck
npm run lint
npm test
npm run build
npm run dev
```

---

## Mô hình bảo mật an toàn dữ liệu

Công cụ này chặn hoàn toàn các hành động đọc và xuất đối với các tệp `.env`, `.env.*`, thư mục `node_modules`, `dist`, `build`, `.git`, cũng như các tệp nhị phân (binary files). Các hành động ghi tệp chỉ được giới hạn trong các phạm vi sau:

- `tools/project-control-center/`
- `docs/projectStatus.md`
- `docs/CHATBOT_HANDOFF.md`
- `.project/`
- `.ai/`

### Ảnh chụp trạng thái (Snapshots) và lịch sử

- `.project/status.snapshot.json` sẽ bị ghi đè bằng trạng thái đầy đủ mới nhất.
- `.project/git-history.snapshot.json` sẽ bị ghi đè bằng tóm tắt Git mới nhất.
- `.project/scan-history.ndjson` ghi thêm một dòng tóm tắt ngắn gọn sau mỗi lần quét.
- `.project/tool-errors.ndjson` ghi thêm một dòng thông tin lỗi đã được lọc bỏ các thông tin nhạy cảm.

### Xuất ngữ cảnh AI (AI context export)

Bảng điều khiển xuất ngữ cảnh AI thực hiện ghi dữ liệu vào `.ai/context-bundle.md` và `.ai/code-index.json` dựa trên cùng một quy tắc bảo mật đường dẫn an toàn nêu trên. Công cụ cung cấp các hành động sao chép nhanh cho: Chatbot Handoff (Bàn giao Chatbot), Git Diff Review (Xem xét thay đổi Git), Next Codex Prompt (Prompt tiếp theo cho Codex), Architecture Context (Ngữ cảnh kiến trúc), và Changed Files Context (Ngữ cảnh các tệp đã thay đổi).
