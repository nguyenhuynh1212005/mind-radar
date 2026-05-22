---
trigger: always_on
---

# Strict Architecture Rule

## Coding Constraints
- Sử dụng TypeScript strict mode. Bất kỳ chỗ nào dùng `any` đều phải giải thích rõ lý do.
- Tuyệt đối KHÔNG ĐƯỢC cho các Module giao tiếp chéo với nhau. Mọi luồng dữ liệu phải đi qua `TestOrchestrator` và `ProfileAggregator`.
- Sử dụng `performance.now()` cho mọi phép đo thời gian phản ứng (Response Time, Hesitation Time) ở phía Client. TUYỆT ĐỐI không dùng `Date.now()`.
- Scoring logic (tính điểm) phải là các hàm thuần túy (pure functions), hoàn toàn tách biệt khỏi React UI components.