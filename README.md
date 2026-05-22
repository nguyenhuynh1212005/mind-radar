# Mind Radar ◼ Interactive Cognitive-Behavioral Profile Assessment

> Hệ thống đo lường và đánh giá đa chiều hiệu suất nhiệm vụ, phong cách tương tác, minh chứng hành vi, và mức độ hiệu chuẩn siêu nhận thức (Metacognitive Calibration).

[![Project - Mind Radar](https://img.shields.io/badge/Project-Mind%20Radar-0052ff?style=for-the-badge&labelColor=0a0b0d)](#)
[![Architecture - Agent--First](https://img.shields.io/badge/Architecture-Agent--First-0052ff?style=for-the-badge&labelColor=0a0b0d)](#)
[![Design - Clinical%20Focus](https://img.shields.io/badge/Design-Clinical%20Focus-0052ff?style=for-the-badge&labelColor=0a0b0d)](#)
[![Stack - Vite%20%2B%20TypeScript](https://img.shields.io/badge/Stack-Vite%20%2B%20TS-0052ff?style=for-the-badge&labelColor=0a0b0d)](#)
[![Status - Phase%200.5%20Setup](https://img.shields.io/badge/Status-Phase%200.5%20Setup-0052ff?style=for-the-badge&labelColor=0a0b0d)](#)

---

## ⬢ Table of Contents

- [Giới thiệu & Triết lý cốt lõi](#-giới-thiệu--triết-lý-cốt-lõi)
- [Kiến trúc Agent-First](#-kiến-trúc-agent-first-agentsmd--geminimd)
- [Design System & Zero Cognitive Load](#-design-system--zero-cognitive-load-designmd)
- [Bản đồ Hệ thống Modules Đánh giá](#-bản-đồ-hệ-thống-modules-đánh-giá)
- [Khởi chạy Dự án (Getting Started)](#-khởi-chạy-dự-án-getting-started)
- [Quy chuẩn Phát triển (Definition of Done)](#-quy-chuẩn-phát-triển-definition-of-done)

---

## ⬢ Giới thiệu & Triết lý cốt lõi

**Mind Radar** là một nền tảng web tương tác chuyên sâu, được thiết kế nhằm đo lường các khía cạnh nhận thức và hành vi của người sử dụng thông qua các tác vụ khoa học chuẩn hóa. Hệ thống tuân thủ nghiêm ngặt các nguyên lý y sinh và tâm lý học thực nghiệm:

- **Không dán nhãn đơn giản:** Tuyệt đối không quy đổi về một điểm số IQ/EQ duy nhất. Thay vào đó, kết quả được phân tích và biểu diễn đa chiều thông qua biểu đồ Radar.
- **Minh chứng hành vi rõ ràng:** Mọi nhận định trong báo cáo đều phải có cơ sở bằng dữ liệu hành vi thực tế (như thời gian phản ứng, thời gian do dự, số lần đổi đáp án).
- **Khách quan và thận trọng:** Ngôn ngữ báo cáo y khoa trung thực, không phóng đại hoặc suy diễn quá mức ý nghĩa tâm lý học ngoài phạm vi thực nghiệm.

---

## ⬢ Kiến trúc Agent-First (`AGENTS.md` & `GEMINI.md`)

Dự án được thiết kế theo mô hình **Agent-First**, được tối ưu hóa cho sự cộng tác giữa con người và các trợ lý AI (đặc biệt là **Antigravity**). Mọi thay đổi logic và cấu trúc đều phải tuân thủ nghiêm ngặt hai tài liệu chỉ dẫn cốt lõi:
1. **[AGENTS.md](AGENTS.md):** Định hình các quy tắc sản phẩm, mô hình luồng dữ liệu, schema sự kiện, và tiêu chí hoàn thành nhiệm vụ.
2. **[GEMINI.md](GEMINI.md):** Thiết lập ngữ cảnh hoạt động cho AI, quy trình duyệt kế hoạch triển khai (Implementation Plan) trước khi viết code, và cơ chế kiểm nghiệm bằng Browser Agent.

### Luồng Kỹ thuật Nghiêm ngặt (Strict Architecture)

Hệ thống được chia nhỏ thành các tầng độc lập để đảm bảo khả năng tái cấu trúc và kiểm thử tối đa:

```
Frontend Test App ◼ [Giao diện người dùng]
  │
  ├──► Event Tracker [Ghi nhận sự kiện thời gian thực]
  │      │
  │      └──► Local State Store [Lưu trữ trạng thái cục bộ chống mất dữ liệu]
  │
  └──► Test Orchestrator [Điều phối phiên đánh giá]
         │
         ├──► Module Runtime [Môi trường thực thi từng Module]
         │      │
         │      └──► Raw Session Logs [Nhật ký thô toàn bộ phiên]
         │
         └──► Scoring Engine & Adapters [Động cơ tính toán độc lập hoàn toàn khỏi UI]
                │
                ├──► Data Quality Checker [Kiểm định chất lượng & Gán cờ bất thường]
                │
                └──► Profile Aggregator [Tích hợp hồ sơ đa chiều]
                       │
                       └──► Report Generator [Tạo báo cáo khoa học & Xuất JSON/CSV]
```

> [!IMPORTANT]
> **Quy tắc cô lập:** Các Module đánh giá tuyệt đối không được phép giao tiếp trực tiếp với nhau. Mọi luồng dữ liệu phải đi qua `TestOrchestrator` và `ProfileAggregator` dựa trên các Contract kiểu dữ liệu tường minh tại [moduleContracts.md](docs/moduleContracts.md).
>
> **Đo lường thời gian:** Sử dụng `performance.now()` cho mọi phép đo thời gian phản ứng ở phía Client (Response Time, Hesitation Time) nhằm đạt độ chính xác mili-giây cao nhất. Tuyệt đối không sử dụng `Date.now()` cho mục đích này.

---

## ⬢ Design System & Zero Cognitive Load (`DESIGN.md`)

Giao diện của Mind Radar được thiết kế dựa trên triết lý **Zero Cognitive Load** (Tải nhận thức bằng Không). Mọi chi tiết thừa, hiệu ứng chuyển động phức tạp hoặc bóng đổ quá mức đều bị loại bỏ để tránh gây nhiễu và làm sai lệch thời gian phản xạ (ms) của người dùng.

Tham khảo tài liệu hệ thống thiết kế chi tiết tại **[DESIGN.md](DESIGN.md)**.

### Các Quy tắc Thiết kế Bắt buộc:
- **Bảng màu Clinical & High-Focus:** Chỉ sử dụng màu nền Canvas trắng (`#ffffff`) hoặc Surface xám nhạt (`#f7f7f7`) trong suốt quá trình làm bài test để giữ sự tập trung tối đa.
- **Font chữ Monospace cho Số liệu:** Toàn bộ các thông số thay đổi liên tục (mili-giây, điểm số, đồng hồ đếm ngược) bắt buộc phải sử dụng font chữ Monospace (`JetBrains Mono` hoặc `Geist Mono`) nhằm ngăn chặn hiện tượng UI bị giật (layout shift).
- **Hình học nghiêm túc:** Nút bấm và các thẻ sử dụng bo góc vừa phải (`rounded.md` - 8px), tuyệt đối không dùng thiết kế dạng kẹo dẻo hay viên thuốc (pill) để duy trì tính chuyên nghiệp, học thuật.

---

## ⬢ Bản đồ Hệ thống Modules Đánh giá

Dự án Mind Radar bao gồm 11 Module đánh giá thuộc 4 lõi năng lực cốt lõi và 1 Module tự đánh giá tích hợp:

| Ký hiệu | Tên Module (VI / EN) | Lõi Năng Lực | Nhiệm vụ chính | Trạng thái MVP |
| :--- | :--- | :--- | :--- | :---: |
| **M1** | Nhịp Suy Luận<br>*(Fluid Reasoning & Processing Speed)* | Nhận thức & Tốc độ | Tìm quy luật chuỗi số, ma trận hình học dưới 2 pha: chậm và giới hạn thời gian. | Tương lai |
| **M2** | Bộ Lọc Phản Xạ<br>*(Inhibitory Control)* | Nhận thức & Tốc độ | Chống lại phản xạ bản năng thông qua Stroop Task và Go/No-Go Task. | **MVP Core** |
| **M3** | Bộ Nhớ Thao Tác<br>*(Working Memory)* | Nhận thức & Tốc độ | Tái hiện chuỗi Corsi Block theo chiều thuận (Forward) và ngược (Backward). | **MVP Core** |
| **M4** | Không Gian Hình Khối<br>*(Spatial Reasoning)* | Không gian & Hệ thống | Nhận diện, xoay 3D và ghép mảnh vật thể còn thiếu. | Tương lai |
| **M5** | Bản Đồ Quy Trình<br>*(Procedural / Systems Reasoning)* | Không gian & Hệ thống | Sắp xếp các bước quy trình đóng/mở theo thứ tự tối ưu nhất. | **MVP Core** |
| **M6** | Chuyển Luật<br>*(Cognitive Flexibility)* | Không gian & Hệ thống | Phân loại thẻ bài và tự động thích ứng khi luật phân loại thay đổi ẩn. | Tương lai |
| **M7** | Phản Ứng Ưu Tiên<br>*(Fast Preference Response)* | Hành vi & Quyết định | Lựa chọn phản ứng nhanh (Swipe) đối với các nhóm từ khóa/hình ảnh. | Tương lai |
| **M8** | Chiến Lược Rủi Ro<br>*(Risk-taking Under Uncertainty)* | Hành vi & Quyết định | Bơm bóng bay tích điểm (BART Task) để đo lường hành vi chấp nhận rủi ro. | Tương lai |
| **M9** | Gương Hiệu Chuẩn<br>*(Metacognitive Calibration)* | Tự Đánh Giá Xuyên Suốt | Đo sai số giữa mức độ tự tin tự đánh giá và hiệu suất thực tế sau mỗi block. | **MVP Core** |
| **M10** | Phòng Thí Nghiệm Tư Duy<br>*(Open-ended Problem Solving)* | Tư Duy Bậc Cao | Giải quyết vấn đề mở qua 4 bước: Tách vấn đề, giả thuyết, chiến lược, tự phản biện. | Tương lai |
| **M11** | Suy Luận Ngôn Ngữ<br>*(Verbal Reasoning)* | Tư Duy Bậc Cao | Đọc hiểu logic, phát hiện mâu thuẫn lập luận và tìm quan hệ tương đồng từ vựng. | Tương lai |

---

## ⬢ Khởi chạy Dự án (Getting Started)

### Yêu cầu hệ thống
- **Node.js** >= 18.0.0
- **npm** >= 9.0.0

### Các bước thiết lập ban đầu

1. Cài đặt các gói phụ thuộc:
   ```bash
   npm install
   ```

2. Khởi chạy máy chủ phát triển (Development Server):
   ```bash
   npm run dev
   ```

3. Khởi chạy bộ kiểm thử tự động (Unit Tests):
   ```bash
   npm test
   ```

4. Kiểm tra kiểu dữ liệu TypeScript tĩnh:
   ```bash
   npm run typecheck
   ```

5. Kiểm tra và định dạng mã nguồn (Linter):
   ```bash
   npm run lint
   ```

6. Xây dựng mã nguồn cho môi trường Production:
   ```bash
   npm run build
   ```

---

## ⬢ Quy chuẩn Phát triển (Definition of Done)

Mỗi Module hoặc thành phần logic mới chỉ được coi là hoàn tất khi và chỉ khi đáp ứng đầy đủ các tiêu chuẩn khắt khe sau:

- **Interaction Spec:** Có văn bản mô tả chi tiết các tương tác người dùng.
- **Item Schema:** Định nghĩa rõ phiên bản schema của item ngân hàng câu hỏi.
- **Pure Scoring Adapter:** Hàm tính điểm thuần túy được tách biệt hoàn toàn khỏi mã nguồn UI và được kiểm thử 100%.
- **Behavioral Tracking:** Ghi nhận đầy đủ các trường thông tin quy định tại `AGENTS.md` (responseTimeMs, hesitationTimeMs, changedAnswerCount, v.v.).
- **Unit Tests:** Có các bài kiểm thử xác thực logic chính xác tuyệt đối.
- **Zero-Error Build:** Vượt qua toàn bộ quy trình `typecheck`, `lint`, `test`, và `build` mà không có bất kỳ cảnh báo (warning) hay lỗi (error) nào.
