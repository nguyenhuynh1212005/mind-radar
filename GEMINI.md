# GEMINI.md - Antigravity Agent Context

## Project Overview
Interactive Cognitive-Behavioral Profile Assessment.
Tuyệt đối tuân thủ triệt để tài liệu trong thư mục `docs/`. Không tự ý sáng tạo hay overclaim các kết quả tâm lý học.

## Antigravity Specific Rules
- **Planning First:** Trước khi sửa bất kỳ file logic hay UI nào, bắt buộc phải tạo `Implementation Plan` artifact và chờ tôi duyệt (Approve).
- **Subagents:** Khuyến khích sử dụng Subagent nếu cần phân tích lỗi phức tạp hoặc đọc các file tài liệu dài để không làm loãng ngữ cảnh chính.
- **Browser Verification:** Khi hoàn thành code UI cho một Module, hãy chủ động đề xuất sử dụng `Browser Agent` để chạy thử nghiệm kéo-thả, click, và kiểm tra Response Time (ms).
- **Project Control Center:** Trước khi kết thúc bất kỳ task nào, bắt buộc phải chạy `npm run pcc:scan` từ thư mục gốc để cập nhật trạng thái tiến độ dự án (`docs/projectStatus.md` và `docs/CHATBOT_HANDOFF.md`). Khi bàn giao sang session mới hoặc Codex, hãy chạy `npm run pcc:export` để tạo bundle context cập nhật.
- **Walkthrough:** Kết thúc mỗi task, luôn tạo một `Walkthrough` artifact tóm tắt các file đã sửa và các bài Unit Test đã vượt qua.

## Design System
- Trước khi tạo mới hay sửa đổi bất kỳ file UI nào, hãy đọc `./DESIGN.md`.
- Nếu có yêu cầu nào của tôi mâu thuẫn với `DESIGN.md`, hãy ưu tiên `DESIGN.md` và giải thích lại cho tôi.
- Sau khi code xong UI, luôn đề xuất mở Browser Agent để kiểm tra xem màu sắc và spacing có khớp với DESIGN.md không.