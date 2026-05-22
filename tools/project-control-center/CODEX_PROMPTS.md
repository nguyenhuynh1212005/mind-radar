# Codex Vibe Coding Prompts

Dưới đây là danh sách các prompt đã được tối ưu để sử dụng với hệ thống Agent của dự án Interactive Cognitive-Behavioral Profile Assessment.

## 1. Bắt đầu một Phase mới (Lập kế hoạch)
> **Sử dụng khi:** Chuẩn bị bước sang một Phase mới trong `project-map.json` nhưng chưa muốn code ngay.

```
/plan
Đọc file `tools/project-control-center/project-map.json` và `docs/projectStatus.md`.
Hãy cho tôi biết chúng ta đang ở Phase nào, còn thiếu những check nào.
Lập một kế hoạch ngắn gọn gọn (3-4 bước) để hoàn thành các file còn thiếu của Phase này.
TUYỆT ĐỐI CHƯA ĐƯỢC CODE. Chỉ lập kế hoạch.
```
## 2. Triển khai cấu trúc thư mục & Boilerplate
> **Sử dụng khi:** Cần tạo khung cho các file rỗng dựa trên kiến trúc đã định.

```
Sử dụng skill `assessment-architecture-guard`.
Dựa vào kế hoạch vừa chốt, hãy scaffold các file cần thiết.
Chỉ tạo bộ khung (interfaces, types, skeleton class), chưa cần triển khai logic chi tiết.
Sau khi tạo xong, chạy lệnh kiểm tra tiến độ của Project Control Center.
```

## 3. Viết Logic Chấm điểm
> **Sử dụng khi:** Xây dựng phần lõi tính điểm cho một Module cụ thể

```
Sử dụng skill `scoring-adapter-builder`.
Hãy viết Scoring Adapter cho Module [TÊN_MODULE].
Yêu cầu:
1. Đọc kỹ công thức chấm điểm trong `docs/ThuatToan.md`.
2. Đầu ra phải tuân thủ đúng Contract trong `docs/moduleContracts.md`.
3. Viết kèm Unit Test cho các trường hợp: Đúng hết, Sai hết, Bỏ qua, Quá thời gian.
4. Đảm bảo logic hoàn toàn độc lập, không dính líu đến React UI.
```

## 4. Xây dựng Giao diện Module (UI & Tương tác)
> **Sử dụng khi:** Bắt đầu code Frontend cho một Module.

```
Sử dụng skill `assessment-module-builder`.
Hãy xây dựng UI cho Module [TÊN_MODULE].
Yêu cầu:
1. Tuân thủ strict State Machine (Instruction -> Practice -> Block Start ->...).
2. Bắt buộc dùng `performance.now()` cho việc track thời gian phản hồi.
3. Export dữ liệu log theo đúng định dạng trong `docs/dataSchema.md`.
```

