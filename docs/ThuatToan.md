# Tài liệu Thuật toán Đánh giá & Kiến trúc Phần mềm (Evaluation Algorithms & Software Architecture)
*Dành cho Bài Đánh giá Nhận thức & Hành vi Tương tác (Interactive Cognitive-Behavioral Profile Assessment)*

---

## 0. Phạm vi Tài liệu (Document Scope)

Tài liệu này chuyển đổi các đặc tả lý thuyết trong **Tài liệu Thiết kế (TDD.md)** thành một kiến trúc phần mềm và hệ thống thuật toán có thể triển khai thực tế. Trọng tâm của tài liệu là thiết kế hệ thống đánh giá (Scoring System) đảm bảo:
* **Đo lường chính xác:** Mỗi module đo lường đúng loại hành vi cần đánh giá thông qua dữ liệu khách quan (Evidence-based).
* **Tracking toàn diện:** Hệ thống thu thập dữ liệu hành vi chi tiết (Behavioral Tracking) và có thể kiểm chứng (Auditable).
* **Tính điểm khoa học:** Công thức chấm điểm chuẩn hóa, nhất quán và không kết luận quá mức (No Overclaiming).
* **Độc lập và mô-đun hóa:** Các module giao tiếp với nhau qua một giao diện lập trình (Contract) thống nhất.
* **Khả thi trong phát triển:** Cấu trúc phân tầng rõ ràng, hỗ trợ phát triển theo từng giai đoạn (Vibe Coding).

Bài đánh giá này được định vị là **công cụ tương tác xây dựng hồ sơ nhận thức – hành vi đa trục**, tuyệt đối không dán nhãn IQ/EQ, chẩn đoán tâm lý bệnh học hoặc đưa ra dự đoán nghề nghiệp tuyệt đối.

---

## 1. Nguyên tắc Thiết kế Đánh giá (Assessment Design Principles)

### 1.1. Báo cáo Đa trục, Không dùng Điểm tổng (Multi-dimensional Profile, No Single Score)
Hệ thống không tính toán và không trả về một con số "IQ/EQ tổng" duy nhất nhằm tránh gây hiểu lầm cho người dùng. Kết quả được biểu diễn bằng **Biểu đồ Radar đa trục (Radar Chart)** gồm 11 khía cạnh năng lực:

1. **Nhịp Suy Luận** (Fluid Reasoning & Processing Speed)
2. **Bộ Lọc Phản Xạ** (Inhibitory Control)
3. **Bộ Nhớ Thao Tác** (Working Memory)
4. **Không Gian Hình Khối** (Spatial Reasoning)
5. **Bản Đồ Quy Trình** (Procedural / Systems Reasoning)
6. **Chuyển Luật** (Cognitive Flexibility)
7. **Phản Ứng Ưu Tiên** (Fast Preference Response)
8. **Chiến Lược Rủi Ro** (Risk-taking Under Uncertainty)
9. **Gương Hiệu Chuẩn** (Metacognitive Calibration)
10. **Phòng Thí Nghiệm Tư Duy** (Open-ended Problem Solving)
11. **Suy Luận Ngôn Ngữ** (Verbal Reasoning)

> **Ví dụ diễn giải phù hợp (Safe Interpretation):**
> *"Trong bài đánh giá này, bạn thể hiện khả năng xử lý thông tin không gian rất ổn định. Dưới áp lực thời gian cao, độ chính xác của bạn giảm nhẹ so với pha tự do."*
>
> **Ví dụ diễn giải cần tránh (Overclaiming):**
> *"Bạn là thiên tài hình học nhưng có phản xạ kém và không phù hợp với các công việc lập trình."*

### 1.2. Phân tách Năng lực, Phong cách & Độ tin cậy (Performance, Style & Reliability)
Mỗi module thu thập và phân tích dữ liệu theo 3 khía cạnh độc lập:
1. **Performance (Hiệu suất):** Độ chính xác (Accuracy), số câu đúng, mức độ hoàn thành nhiệm vụ.
2. **Style (Phong cách xử lý):** Tốc độ vs. Cẩn thận (Speed-Accuracy Trade-off), mức độ chấp nhận rủi ro, chiến lược thử - sai (Trial-and-Error), mức độ linh hoạt khi đổi luật.
3. **Reliability (Độ tin cậy dữ liệu):** Số lượng trial hợp lệ, các cảnh báo nhiễu (mất focus tab, spam click, phản ứng nhanh bất thường).

---

## 2. Kiến trúc Tổng thể Hệ thống (Overall System Architecture)

### 2.1. Sơ đồ Dòng chảy Kỹ thuật (Technical Flow Diagram)

```text
[Frontend Test App (UI)]
        |
        v (Gửi các sự kiện tương tác thô qua performance.now())
[Event Tracker] ---> [Local State Store (Hỗ trợ phục hồi khi mất kết nối/reload)]
        |
        v (Đóng gói thành Event Logs)
[Test Orchestrator] 
        |
        +---> Điều phối luồng 11 Module Runtime (M1..M11)
        +---> Nhúng câu hỏi tự đánh giá (Gương Hiệu Chuẩn - M9) sau mỗi block
        |
        v (Dữ liệu Session thô JSON/CSV)
[Scoring Engine (Backend/Serverless - Bảo mật logic tính điểm)]
        |
        +---> [Scoring Adapters (Tính điểm chi tiết từng module)]
        +---> [Normalization Engine (Chuẩn hóa điểm Z-Score/Percentile)]
        +---> [Data Quality & Bias Checker (Kiểm định nhiễu)]
        |
        v (Hồ sơ Nhận thức Chuẩn hóa)
[Profile Aggregator]
        |
        v
[Report Generator] ---> Radar Chart / PDF Report / CSV Export
```

### 2.2. Đặc tả các Thành phần Kiến trúc (Component Specs)

#### A. Test Orchestrator
Quản lý trạng thái và luồng bài test tổng thể: Khởi tạo session, phân phối item bank, điều phối thứ tự chạy của các module, nhúng câu hỏi Gương Hiệu Chuẩn (M9) sau mỗi block và đồng bộ hóa trạng thái ứng dụng về local storage.

#### B. Module Runtime Contracts
Tất cả các module runtime phải cài đặt một Interface chung để đảm bảo tính module hóa:

```typescript
interface SessionContext {
  sessionId: string;
  participantId: string;
  deviceType: 'mouse_keyboard' | 'touch' | 'mixed';
  locale: 'vi-VN' | 'en-US';
}

interface TrialSpec {
  trialId: string;
  itemId: string;
  difficulty: number;
  stimulusData: Record<string, any>;
  timeLimitMs?: number;
}

interface UserResponse {
  trialId: string;
  value: any;
  responseTimeMs: number;
  interactionEvents: ClientEvent[];
}

interface TrialResult {
  trialId: string;
  isCorrect: boolean;
  partialScore: number;
  metrics: Record<string, number>;
  invalidFlags: string[];
}

interface AssessmentModule {
  moduleId: string;
  version: string;
  init(context: SessionContext): void;
  getNextTrial(): TrialSpec | null;
  submitResponse(response: UserResponse): TrialResult;
  computeRawModuleMetrics(results: TrialResult[]): Record<string, any>;
}
```

#### C. Event Tracker
Đo lường thời gian tương tác ở mức mili-giây bằng cách sử dụng đồng hồ đơn điệu `performance.now()` trên client thay vì `Date.now()` để tránh lỗi lệch múi giờ hoặc thay đổi giờ hệ thống của người dùng.

---

## 3. Quy chuẩn Giao tiếp giữa các Module (Inter-Module Communication Rules)

Để tránh hiện tượng phụ thuộc chéo (Tight Coupling) làm hệ thống khó bảo trì, các module **tuyệt đối không giao tiếp trực tiếp với nhau**.

```text
SAI:  [Module 10 (Phòng Thí Nghiệm Tư Duy)] -- Đọc trực tiếp dữ liệu --> [Module 1 (Nhịp Suy Luận)]
ĐÚNG: [Module 1] -- Xuất Metrics --> [Orchestrator] -- Tổng hợp --> [Profile Aggregator]
                                                                        |
                                  [Module 10] <-- Lấy dữ liệu tóm tắt --+
```

### 3.1. Dữ liệu thích ứng độ khó (Adaptive Testing Flow)
Trong trường hợp chạy thích ứng (Adaptive), thông tin phản hồi của trial hiện tại được sử dụng để quyết định độ khó của trial tiếp theo **trong cùng một module** thông qua một bộ điều phối cục bộ (Local Adaptive Controller). Dữ liệu của module trước chỉ được tổng hợp tại `Profile Aggregator` để tạo đầu vào tóm tắt (Prior Profile Summary) cho các module bậc cao như Module 10.

```typescript
interface PriorProfileSummary {
  strengths: string[];          // Điểm mạnh nhận thức (ví dụ: ["high_spatial_accuracy"])
  frictionPoints: string[];     // Điểm nghẽn (ví dụ: ["time_pressure_decay"])
  notableBehaviors: string[];   // Phong cách hành vi nổi bật (ví dụ: ["cautious_risk_strategy"])
}
```

---

## 4. State Machine Chuẩn cho Module (Standard Module State Machine)

Mỗi module trong hệ thống bắt buộc phải tuần thủ vòng đời (Life-cycle) nghiêm ngặt dưới đây nhằm đảm bảo tính toàn vẹn dữ liệu ngay cả khi người dùng tải lại trang (Reload):

```text
[NOT_STARTED]
      | (Khởi tạo context)
      v
[INSTRUCTION] (Xem hướng dẫn)
      | (Bắt đầu thử nghiệm)
      v
[PRACTICE] (Làm thử không tính điểm)
      | (Bắt đầu lượt chính thức)
      v
[BLOCK_START] (Bắt đầu cụm câu hỏi)
      |
      v <--------------------------------------------+
[TRIAL_PREPARE] (Hiển thị màn hình chờ/điểm tập trung) |
      | (Kích thích xuất hiện)                       |
      v                                              |
[STIMULUS_SHOWN]                                     |
      | (Người dùng bắt đầu thao tác)                | (Lặp lại cho mỗi trial)
      v                                              |
[USER_INTERACTING]                                   |
      | (Nộp đáp án / Hết giờ)                       |
      v                                              |
[RESPONSE_SUBMITTED]                                 |
      | (Tự đánh giá độ tin tin M9 - nếu có)         |
      v                                              |
[CONFIDENCE_RATING] ---------------------------------+
      | (Hoàn thành block)
      v
[BLOCK_END]
      | (Hoàn thành module)
      v
[MODULE_END] ---> [SCORED] (Đã tính điểm cục bộ)
```

### 4.1. Sự kiện Tương tác Bắt buộc (Required Interaction Events)
Event Tracker ghi nhận các sự kiện sau dưới dạng luồng dữ liệu thời gian thực:

```typescript
type TrackingEventType =
  | 'module_started'
  | 'instruction_viewed'
  | 'practice_started'
  | 'block_started'
  | 'trial_started'
  | 'stimulus_shown'
  | 'first_interaction'       // Thời gian chạm/click chuột đầu tiên
  | 'hover_started'           // Ghi nhận rơ chuột (Hesitation tracking)
  | 'hover_ended'
  | 'drag_started'            // Kéo thả (Dùng trong M4, M5)
  | 'drag_dropped'
  | 'response_changed'        // Thay đổi lựa chọn trước khi submit
  | 'response_submitted'
  | 'trial_timeout'           // Bị hết giờ
  | 'focus_lost'              // Người dùng chuyển tab (Nhiễu dữ liệu)
  | 'focus_returned'
  | 'module_finished';
```

---

## 5. Định dạng Nhật ký Dữ liệu Tiêu chuẩn (Data Logging Schema)

### 5.1. Session Schema (Nhật ký Phiên)
```json
{
  "sessionId": "session_20260522_0001",
  "participantId": "user_cognition_99",
  "assessmentVersion": "1.0.0",
  "startedAt": "2026-05-22T08:00:00.000Z",
  "endedAt": "2026-05-22T08:45:30.000Z",
  "locale": "vi-VN",
  "device": {
    "screenWidth": 1440,
    "screenHeight": 900,
    "viewportWidth": 1440,
    "viewportHeight": 790,
    "inputType": "mouse_keyboard",
    "timezone": "Asia/Ho_Chi_Minh"
  },
  "moduleOrder": ["M1", "M2", "M3", "M4", "M5", "M6", "M7", "M8", "M10", "M11"],
  "dataQuality": {
    "overallReliabilityIndex": 0.95,
    "focusLossCount": 2,
    "suspiciousSpamFlags": []
  }
}
```

### 5.2. Trial Result Schema (Nhật ký từng Lượt chơi)
```json
{
  "trialId": "m2_stroop_trial_015",
  "itemId": "stroop_incongruent_red_green",
  "itemVersion": "1.0.0",
  "moduleId": "M2",
  "blockId": "block_01",
  "condition": "incongruent",
  "difficulty": 3,
  "stimulusHash": "sha256_8f2d5e...",
  "correctResponse": "green",
  "userResponse": "green",
  "isCorrect": true,
  "partialScore": 1.0,
  "responseTimeMs": 680,
  "firstInteractionTimeMs": 420,
  "hesitationTimeMs": 80,
  "changedAnswerCount": 0,
  "wrongClickCount": 0,
  "skipped": false,
  "timedOut": false,
  "focusLossCount": 0,
  "invalidFlags": []
}
```

---

## 6. Quy trình Chấm điểm & Xử lý Dữ liệu (Scoring & Processing Pipeline)

Hệ thống tính điểm xử lý dữ liệu thô qua các bước nghiêm ngặt sau:

```text
[Raw Interaction Events]
           |
           v
1. [Event Validation] -----------> Gắn cờ lọc nhiễu (Focus loss, Anticipatory response)
           |
           v
2. [Trial Reconstruction] -------> Khôi phục chuỗi tương tác (stimulus -> first click -> submit)
           |
           v
3. [Trial-level Scoring] --------> Tính điểm đúng/sai, điểm từng phần (Partial Score)
           |
           v
4. [Module-level Aggregation] ---> Tính điểm thô tổng hợp (Raw Metrics) của module
           |
           v
5. [Data Quality Assessment] ----> Tính toán Trọng số độ tin cậy (Reliability Penalty)
           |
           v
6. [Score Normalization] --------> Chuẩn hóa phân vị (Percentile) hoặc Z-Score theo Norm Group
           |
           v
7. [Profile Aggregation] --------> Tổng hợp 11 trục nhận thức của hệ thống
```

### 6.1. Phương pháp tính Điểm Lượt chơi (Trial-level Scoring Methods)

#### Kiểu A: Binary (Đúng / Sai)
Áp dụng cho các lựa chọn đóng tốc độ cao (Stroop, Go/No-Go, Analogy):
$$\text{Score} = \begin{cases} 1.0 & \text{nếu } \text{userResponse} == \text{correctResponse} \\ 0.0 & \text{nếu ngược lại} \end{cases}$$

#### Kiểu B: Partial / Distance-based (Điểm từng phần / Khoảng cách)
Áp dụng cho sắp xếp thứ tự hoặc tái hiện chuỗi (Corsi, Bản Đồ Quy Trình):
* **Corsi Sequence Accuracy:**
  $$\text{Score} = \frac{\text{Số vị trí chọn đúng phân đoạn}}{\text{Tổng độ dài chuỗi}}$$
* **Procedural Order (Kendall Tau Distance):**
  Chấm điểm mức độ tương đồng giữa hai danh sách thứ tự:
  $$\tau = 1 - \frac{2 \times (\text{Số cặp nghịch thế giữa thứ tự của user và đáp án chuẩn})}{N(N-1)}$$
  $$\text{Score} = \max\left(0, \tau\right)$$

#### Kiểu C: Rubric-based (Chấm theo tiêu chí)
Áp dụng cho các câu trả lời tự luận mở rộng ở Module 10 (Phòng Thí Nghiệm Tư Duy), đánh giá theo thang điểm tiêu chuẩn từ $0$ đến $4$ dựa trên các rubric định nghĩa rõ ràng.

---

## 7. Thuật toán Chuẩn hóa Điểm (Score Normalization Formulas)

### 7.1. Giai đoạn MVP (Khi chưa có Mẫu chuẩn Lớn)
Sử dụng phương pháp **Robust Z-Score** dựa trên Median và Độ lệch Tuyệt đối Trung vị (Median Absolute Deviation - MAD) từ nhóm thử nghiệm ban đầu (Pilot Group) nhằm loại bỏ sự ảnh hưởng của dữ liệu đột biến (Outliers):

$$\text{Robust Z} = \frac{X - \text{Median}(X)}{\text{MAD}(X)}$$
Trong đó:
$$\text{MAD}(X) = 1.4826 \times \text{Median}(|X_i - \text{Median}(X)|)$$

Điểm số chuẩn hóa thang 100 cục bộ (Normalized Score):
$$\text{Score}_{\text{norm}} = \text{clip}\left(0, 100, 50 + 10 \times \text{Robust Z}\right)$$

### 7.2. Giai đoạn Production (Khi có cơ sở dữ liệu lớn)
Sử dụng phân vị thực nghiệm (Empirical Percentile Score) dựa trên Norm Group đã được phân loại theo phiên bản bài đánh giá và loại thiết bị sử dụng:

$$\text{Percentile} = \frac{\text{Số mẫu trong Norm Group có điểm} \le X}{\text{Tổng số mẫu trong Norm Group}} \times 100$$

---

## 8. Thuật toán Đánh giá Chi tiết cho 11 Module (Detailed Module Algorithms)

---

### M1. Nhịp Suy Luận (Fluid Reasoning & Processing Speed)

* **Input:** Bài toán tìm quy luật chuỗi số, ma trận hình học (Raven's matrices). Gồm 2 pha: Pha tự do (Chậm) và Pha áp lực thời gian gắt gao.
* **Chỉ số đo lường:**
  * **Accuracy Logic ($ACC_{\text{slow}}$):** Tỷ lệ đúng ở pha không áp lực.
  * **Speeded Reasoning ($ACC_{\text{speeded}}$):** Tỷ lệ đúng ở pha giới hạn thời gian.
  * **Speed-Accuracy Style (Phong cách xử lý):** Phân loại dựa trên tương quan vị trí của cá nhân so với trung vị nhóm:

```typescript
function classifySpeedAccuracyStyle(accOverall: number, rtCorrectMedian: number, normGroup: NormData): string {
  const zAcc = (accOverall - normGroup.medianAcc) / normGroup.madAcc;
  const zRt = (Math.log(rtCorrectMedian) - Math.log(normGroup.medianRt)) / normGroup.madRtLog;

  if (zAcc >= 0 && zRt < 0) return 'fast_accurate'; // Nhanh và chuẩn
  if (zAcc >= 0 && zRt >= 0) return 'careful';      // Chậm mà chắc
  if (zAcc < 0 && zRt < 0) return 'impulsive';      // Nhanh nhưng dễ sai
  return 'struggling';                              // Chậm và khó khăn
}
```

---

### M2. Bộ Lọc Phản Xạ (Inhibitory Control)

* **Input:** Tổ hợp Stroop congruent (tương thích) / incongruent (nhiễu) & các lượt Go/No-Go.
* **Chỉ số đo lường:**
  * **Stroop Interference Cost ($IC$):** Độ trễ thời gian phản ứng do xung đột nhận thức gây ra.
    $$IC = \text{Median}(RT_{\text{incongruent, correct}}) - \text{Median}(RT_{\text{congruent, correct}})$$
  * **False Press Rate ($FPR$):** Tỷ lệ bấm nhầm ở các trial không được phép bấm (No-Go).
    $$FPR = \frac{\text{Số lần bấm nhầm No-Go}}{\text{Tổng số trial No-Go}}$$
  * **Recovery Time ($RT_{\text{recovery}}$):** Thời gian cần để phục hồi hiệu suất sau khi mắc sai lầm:
    $$RT_{\text{recovery}} = \text{Median}(RT_{\text{trial sau lỗi}}) - \text{Median}(RT_{\text{trial bình thường}})$$

---

### M3. Bộ Nhớ Thao Tác (Working Memory)

* **Input:** Trực quan chuỗi Corsi sáng lên trên lưới. Người dùng tái hiện theo 2 chế độ (Forward / Backward).
* **Quy tắc Thích ứng (Adaptive Rule):**
  * Đúng liên tiếp 2 chuỗi cùng độ dài $L$ $\rightarrow$ Tăng độ dài chuỗi lên $L + 1$.
  * Sai liên tiếp 2 chuỗi cùng độ dài $L$ $\rightarrow$ Dừng bài test hoặc giảm độ dài chuỗi.
* **Chỉ số đo lường:**
  * **Forward Span ($S_{\text{fwd}}$):** Độ dài chuỗi lớn nhất hoàn thành đúng ít nhất 2 lần ở chế độ xuôi.
  * **Backward Span ($S_{\text{bwd}}$):** Độ dài chuỗi lớn nhất hoàn thành đúng ít nhất 2 lần ở chế độ ngược.
  * **Manipulation Cost ($MC$):** Mức độ suy giảm dung lượng bộ nhớ khi phải thao tác biến đổi thông tin:
    $$MC = S_{\text{fwd}} - S_{\text{bwd}}$$

---

### M4. Không Gian Hình Khối (Spatial Reasoning)

* **Input:** Các nhiệm vụ xoay vật thể 3D, ghép mảnh khối hình học.
* **Chỉ số đo lường:**
  * **Mental Rotation Accuracy ($ACC_{\text{rot}}$):** Tỷ lệ giải đúng các bài toán xoay vật thể.
  * **Spatial Assembly ($ACC_{\text{assembly}}$):** Tỷ lệ đúng khi ghép các mảnh vào khuôn hình.
  * **Drag Efficiency ($\eta_{\text{drag}}$):** Hiệu suất thao tác kéo thả, phản ánh việc người dùng có tính toán trước hay dùng phương án thử sai mù quáng:
    $$\eta_{\text{drag}} = \frac{\text{Số lần kéo thả tối ưu (Optimal Moves)}}{\text{Tổng số lần kéo thả thực tế (Actual Moves)}}$$
    *(Nếu $\eta_{\text{drag}} \approx 1.0$: tư duy quy hoạch không gian tốt. Nếu $\eta_{\text{drag}} < 0.3$: chiến lược thử - sai liên tục).*

---

### M5. Bản Đồ Quy Trình (Procedural / Systems Reasoning)

* **Input:**
  * **Quy trình đóng:** Sắp xếp chuỗi công việc logic cố định.
  * **Quy trình mở:** Sắp xếp thứ tự ưu tiên giải quyết các tình huống khẩn cấp (Sống sót, quản lý tài nguyên).
* **Chỉ số đo lường:**
  * **Procedural Order Score ($S_{\text{order}}$):** Chấm bằng khoảng cách Kendall Tau giữa chuỗi người dùng và chuỗi chuẩn.
  * **Planning Latency ($T_{\text{plan}}$):** Độ trễ từ lúc stimulus hiện lên đến lượt kéo đầu tiên (Thời gian lập kế hoạch trước khi hành động).
  * **Revision Count ($N_{\text{revision}}$):** Số lần thay đổi vị trí của các thẻ quy trình sau khi đã đặt vào vị trí.

---

### M6. Chuyển Luật (Cognitive Flexibility)

* **Input:** Phân loại thẻ bài (Card Sorting). Luật phân loại ngầm thay đổi (ví dụ từ phân loại theo Màu sắc sang phân loại theo Hình dáng) sau mỗi chuỗi 8 câu đúng mà không báo trước.
* **Chỉ số đo lường:**
  * **Trials to Rule Discovery ($T_{\text{discover}}$):** Số lượt chơi cần thiết để người dùng nhận ra luật mới (Đạt mốc 4/5 câu đúng liên tiếp kể từ thời điểm đổi luật).
  * **Perseverative Errors ($E_{\text{persev}}$):** Số lần người dùng tiếp tục phân loại theo luật cũ mặc dù hệ thống đã liên tục phản hồi "Sai" sau khi đổi luật.
  * **Switch Cost ($SC$):** Độ suy giảm hiệu suất tức thì ngay sau thời điểm thay đổi luật:
    $$SC = ACC_{\text{truoc khi doi luat}} - ACC_{\text{sau khi doi luat (trong 5 luot dau)}}$$

---

### M7. Phản Ứng Ưu Tiên (Fast Preference Response)

* **Input:** Người dùng vuốt (Swipe) Thích / Không thích các từ khóa/hình ảnh biểu thị các khía cạnh (Xã hội, Công nghệ, Nghệ thuật, Rủi ro, Thiên nhiên, Trừu tượng) xuất hiện nhanh trong 1.5 giây.
* **Chỉ số đo lường:**
  * **Approach Rate ($AR_{c}$):** Tỷ lệ vuốt "Thích" cho từng nhóm chủ đề $c$.
  * **Response Latency ($RT_{c}$):** Thời gian phản ứng trung vị đối với nhóm chủ đề $c$.
  * **Hesitation Rate ($HR$):** Tỷ lệ lượt bị quá 1.5 giây hoặc gần hết giờ mới ra quyết định.
  * **Category Consistency ($CC_{c}$):** Độ nhất quán của quyết định trong cùng một nhóm chủ đề (Dựa trên entropy lựa chọn).

---

### M8. Chiến Lược Rủi Ro (Risk-taking Under Uncertainty)

* **Input:** Nhiệm vụ bơm bóng bay tích điểm (BART). Bơm càng to điểm càng cao, bóng nổ mất sạch điểm của vòng đó. Gồm hai môi trường:
  * *Known Risk (Xác suất rõ):* Hiển thị rõ tỷ lệ nổ của bóng (ví dụ: "Tỷ lệ nổ: 5% mỗi lần bơm").
  * *Ambiguous Risk (Xác suất mơ hồ):* Không hiển thị bất kỳ thông tin nào về quy luật nổ.
* **Chỉ số đo lường:**
  * **Average Adjusted Pumps ($P_{\text{adj}}$):** Số lần bơm trung bình trên các quả bóng không bị nổ.
  * **Explosion Rate ($ER$):** Tỷ lệ bóng bị nổ trong phiên chơi.
  * **Post-loss Adjustment ($\Delta P$):** Sự thay đổi hành vi cược ngay sau khi gặp một quả bóng bị nổ:
    $$\Delta P = P_{\text{adj, sau loss}} - P_{\text{adj, truoc loss}}$$
  * **Ambiguity Tolerance ($AT$):** Sự khác biệt về mức độ mạo hiểm giữa môi trường mơ hồ và môi trường biết rõ xác suất:
    $$AT = P_{\text{adj, ambiguous}} - P_{\text{adj, known risk}}$$
    *(Nếu $AT < 0$: người dùng có xu hướng e dè trước sự không chắc chắn. Nếu $AT > 0$: chấp nhận rủi ro mơ hồ tốt).*

---

### M9. Gương Hiệu Chuẩn (Metacognitive Calibration)

* **Input:** Hệ thống nhúng câu hỏi đánh giá mức độ tự tin (Confidence Slider 0 - 100%) và độ khó tự cảm nhận (Perceived Difficulty) sau mỗi block nhiệm vụ.
* **Chỉ số đo lường:**
  * **Calibration Bias ($B_{\text{cal}}$):** Chỉ số sai lệch hiệu chuẩn tự nhận thức. Cho biết người dùng đang tự tin thái quá hay tự ti:
    $$B_{\text{cal}} = \text{Confidence}_{\text{percent}} - \text{Performance}_{\text{percent}}$$
    * $B_{\text{cal}} > 15\%$: **Overconfidence** (Tự tin vượt quá năng lực thực tế).
    * $B_{\text{cal}} < -15\%$: **Underconfidence** (Đánh giá thấp năng lực của bản thân).
    * $-15\% \le B_{\text{cal}} \le 15\%$: **Well-calibrated** (Độ chính xác tự nhận thức cao).
  * **Calibration Error ($E_{\text{cal}}$):** Khoảng sai lệch tuyệt đối:
    $$E_{\text{cal}} = |B_{\text{cal}}|$$

---

### M10. Phòng Thí Nghiệm Tư Duy (Open-ended Problem Solving)

* **Input:** Các kịch bản vấn đề mở thực tế (ví dụ: *"Thiết kế app học tập tối ưu cho học sinh lớp 11"*, *"Lập kế hoạch tối ưu hóa hiệu năng một web app bị chậm"*).
* **Quy trình Thực hiện:** Người chơi bắt buộc phải hoàn thành 4 bước có cấu trúc:
  1. *Deconstruct (Tách vấn đề)*
  2. *Hypothesize (Đặt giả thuyết)*
  3. *Strategize (Chọn chiến lược)*
  4. *Critique (Tự phản biện / Tìm điểm yếu)*
* **Hệ thống Rubric Chấm điểm (Thang 0 - 4):**

| Điểm | Problem Decomposition (Tách vấn đề) | Causal Reasoning (Tư duy Nhân - Quả) | Constraint Awareness (Nhận thức Ràng buộc) | Trade-off Thinking (Tư duy Đánh đổi) | Self-correction (Tự điều chỉnh/Sửa lỗi) |
| :---: | :--- | :--- | :--- | :--- | :--- |
| **0** | Không tách vấn đề, viết lan man. | Không nêu nguyên nhân, chỉ nhắc lại triệu chứng. | Bỏ qua hoàn toàn các giới hạn nguồn lực. | Không nhận diện được tính hai mặt của giải pháp. | Không tìm ra bất kỳ lỗ hổng nào trong giải pháp của mình. |
| **1** | Chia nhỏ vấn đề nhưng các phần bị trùng lặp, lộn xộn. | Nêu nguyên nhân dựa trên cảm tính hoặc định kiến. | Nhắc đến ràng buộc một cách chung chung, mơ hồ. | Nêu ưu/nhược điểm rất sơ sài, thiếu chiều sâu. | Thừa nhận giải pháp có lỗi nhưng không giải thích được lý do. |
| **2** | Tách được các thành phần chính nhưng thiếu mối liên kết hệ thống. | Phân biệt được triệu chứng bề mặt và nguyên nhân một phần. | Có liệt kê thời gian/tài nguyên nhưng chưa tác động đến giải pháp. | Nhận diện được trade-off nhưng chưa dùng nó để đưa ra lựa chọn tối ưu. | Chỉ ra được một lỗ hổng cụ thể trong giải pháp. |
| **3** | Chia nhỏ vấn đề logic, xác định rõ trình tự xử lý các khối. | Đưa ra được giả thuyết nguyên nhân hợp lý và đề xuất cách kiểm chứng. | Thiết kế giải pháp bám sát các giới hạn thời gian/nguồn lực thực tế. | Đánh giá rõ ràng sự đánh đổi giữa các phương án khác nhau. | Chỉ ra được lỗ hổng kèm theo phương án khắc phục tương đối cụ thể. |
| **4** | Phân rã hệ thống hoàn chỉnh, thiết lập rõ ràng quan hệ phụ thuộc và tiêu chí nghiệm thu. | Đưa ra mạng lưới nguyên nhân đa tầng, có phương pháp loại trừ giả thuyết khoa học. | Tối ưu hóa giải pháp dựa trên sự phối hợp nhiều nguồn lực ràng buộc chặt chẽ. | Quyết định chọn giải pháp dựa trên lập luận toán học/logic về sự đánh đổi. | Tự phản biện sâu sắc, chỉ rõ rủi ro hệ thống, đề xuất kế hoạch dự phòng (Plan B). |

#### Đánh giá có sự hỗ trợ của AI (Safe LLM-assisted Scoring Engine)
Để chấm điểm tự luận khách quan, hệ thống sử dụng LLM Engine chạy ẩn ở backend dưới cấu trúc kiểm soát nghiêm ngặt:
1. **Prompt cố định dạng System Instruction:** Cung cấp định nghĩa rubric chi tiết và ví dụ chuẩn (Few-shot anchors).
2. **JSON Output Force:** Yêu cầu AI trả về định dạng JSON nghiêm ngặt chứa điểm số từng khía cạnh kèm bằng chứng trích xuất từ câu trả lời (Evidence).
3. **Consistency Verification:** Đối chiếu điểm số với các metric hành vi thô thu thập được (ví dụ: thời gian viết, số lượng từ, số lần quay lại sửa đổi giữa các bước).

```typescript
interface AIScoreOutput {
  criterionScores: {
    decomposition: 0 | 1 | 2 | 3 | 4;
    causalReasoning: 0 | 1 | 2 | 3 | 4;
    constraintAwareness: 0 | 1 | 2 | 3 | 4;
    tradeOff: 0 | 1 | 2 | 3 | 4;
    selfCorrection: 0 | 1 | 2 | 3 | 4;
    transfer: 0 | 1 | 2 | 3 | 4;
  };
  evidences: Record<string, string[]>;
  modelConfidence: 'low' | 'medium' | 'high';
}
```

---

### M11. Suy Luận Ngôn Ngữ (Verbal Reasoning)

* **Input:** Bài toán tìm mối quan hệ tương đồng (Analogy), đọc hiểu suy luận logic từ văn bản ngắn, phát hiện lập luận mâu thuẫn, phân định sự khác biệt giữa Giả định (Assumption) - Bằng chứng (Evidence) - Kết luận (Conclusion).
* **Chỉ số đo lường:**
  * **Verbal Abstraction ($ACC_{\text{analogy}}$):** Độ chính xác ở các bài toán tìm từ tương đồng.
  * **Reading Reasoning ($ACC_{\text{reading}}$):** Độ chính xác khi giải quyết logic của văn bản đọc hiểu.
  * **Argument Detection ($ACC_{\text{arg}}$):** Khả năng phân định cấu trúc lập luận thành công.
  * **Inference Accuracy ($ACC_{\text{inf}}$):** Tỷ lệ đưa ra kết luận hợp lý từ các mệnh đề cho sẵn.
  * **Time Under Reading Load ($T_{\text{reading}}$):** Thời gian phản ứng trung vị đối với các trial có khối lượng văn bản dài (Đo lường tốc độ xử lý ngôn ngữ dưới áp lực).

---

## 9. Bộ Tổng hợp Hồ sơ Nhận thức (Profile Aggregator)

Profile Aggregator chịu trách nhiệm nhận điểm số thô từ 11 Module Adapter, thực hiện chuẩn hóa và tính toán điểm tổng hợp cho từng **Lõi Năng lực cốt lõi** theo phân bổ trọng số cấu hình (Versioned Configuration Weights):

```typescript
interface CoreProfile {
  processingSpeedCore: number;      // Lõi 1: Nhận thức & Tốc độ (M1, M2, M3)
  spatialSystemsCore: number;       // Lõi 2: Không gian & Hệ thống (M4, M5, M6)
  behaviorDecisionCore: number;     // Lõi 3: Hành vi & Quyết định (M7, M8)
  higherOrderThinkingCore: number;  // Lõi 4: Tư Duy Bậc Cao (M10, M11)
  metacognitiveScore: number;       // Xuyên suốt: Khả năng tự hiệu chuẩn (M9)
}
```

### 9.1. Trọng số Lõi Nhận thức (Core Weights Configuration)
Hệ thống lưu cấu hình trọng số theo từng phiên bản của bài kiểm tra để đảm bảo tính nhất quán của dữ liệu lịch sử:

```json
{
  "assessmentVersion": "1.0.0",
  "weights": {
    "processingSpeedCore": {
      "M1_speededReasoning": 0.35,
      "M2_inhibitoryControl": 0.35,
      "M3_workingMemory": 0.30
    },
    "spatialSystemsCore": {
      "M4_spatialReasoning": 0.40,
      "M5_systemsReasoning": 0.35,
      "M6_cognitiveFlexibility": 0.25
    },
    "behaviorDecisionCore": {
      "M7_preferenceConsistency": 0.40,
      "M8_riskStrategy": 0.60
    },
    "higherOrderThinkingCore": {
      "M10_openProblemSolving": 0.60,
      "M11_verbalReasoning": 0.40
    }
  }
}
```

---

## 10. Thiết kế Báo cáo Kết quả (Report Design Specs)

### 10.1. Nhật ký Bằng chứng Hành vi (Behavioral Evidence Log)
Báo cáo kết quả không được phép hiển thị các nhận định chung chung, không có căn cứ. Mọi câu nhận xét trên giao diện của người dùng đều phải liên kết trực tiếp với ít nhất một bằng chứng hành vi cụ thể (Behavioral Evidence):

```typescript
interface BehavioralEvidence {
  evidenceId: string;
  sourceModule: string;
  observedMetric: string;
  actualValue: number | string;
  normComparison: 'above_average' | 'average' | 'below_average';
  linkedReportTemplateId: string; // Bản mẫu câu nhận xét đã được duyệt
}
```

### 10.2. Mẫu câu Nhận xét An toàn và Khoa học (Safe Language Guidelines)

* **CÂU NÊN DÙNG:**
  * *"Trong bài đánh giá này, phong cách làm việc của bạn có xu hướng ưu tiên sự chính xác hơn tốc độ..."*
  * *"Ở các lượt chơi đòi hỏi sự linh hoạt trong đổi luật, bạn cần trung bình $N$ lượt thử để phát hiện ra luật mới..."*
  * *"Mức độ tự tin tự đánh giá của bạn đang cao hơn hiệu suất làm bài thực tế khoảng $X\%$, điều này thường phản ánh..."*

* **CÂU TUYỆT ĐỐI TRÁNH:**
  * *"Năng lực logic của bạn rất tệ..."*
  * *"Não bộ của bạn được lập trình để trở thành nhà lãnh đạo..."*
  * *"Bạn có bệnh lý e ngại rủi ro..."*
  * *"Chỉ số IQ ngôn ngữ của bạn đạt 120 điểm..."*

---

## 11. Kiểm soát Chất lượng Dữ liệu & Sai lệch (Data Quality & Bias Control)

### 11.1. Cờ kiểm tra Chất lượng Dữ liệu (Data Quality Flags)
Hệ thống tự động phân tích hành vi tương tác để đánh dấu các phiên làm bài không đạt tiêu chuẩn độ tin cậy khoa học:

```typescript
interface DataQualityFlags {
  tooManyFocusLosses: boolean;       // Mất tập trung (Chuyển tab > 5 lần hoặc thời gian ngoài tab quá dài)
  suspiciouslyFastResponses: boolean; // Trả lời quá nhanh (Phản xạ < 150ms liên tục nhiều lần - Spam click)
  tooManySkippedTrials: boolean;      // Bỏ qua quá nhiều câu hỏi (> 30% tổng số trial)
  repeatedPatternResponses: boolean;  // Trả lời theo khuôn mẫu lặp lại (ví dụ chọn toàn đáp án A hoặc vuốt toàn bên phải)
  deviceNotRecommended: boolean;      // Thiết bị màn hình quá nhỏ hoặc cấu hình lag ảnh hưởng đến Response Time
}
```

### 11.2. Quy tắc Đóng băng Phiên bản (strict Versioning Rule)
Bất kỳ sự thay đổi nào đối với:
1. Nội dung câu hỏi (Item Bank).
2. Thời gian giới hạn (Time limit).
3. Thuật toán chấm điểm cục bộ (Module Scoring Adapter).

Đều bắt buộc phải nâng chỉ số **Version** của hệ thống (ví dụ từ `1.0.0` lên `1.1.0`). Dữ liệu thô của người dùng bắt buộc phải lưu kèm đầy đủ mã phiên bản này để tránh tính toán sai lệch khi so sánh với Norm Group lịch sử.

---

## 12. Kiểm tra Độ ổn định Nội bộ (Internal Reliability Check)

Để đảm bảo hệ thống đánh giá hoạt động khoa học, Scoring Engine định kỳ chạy các kiểm tra thống kê trên tập dữ liệu ẩn danh thu thập được:

* **Với Module Trắc nghiệm:** Tính hệ số **Cronbach's Alpha** ($\alpha$) để kiểm định tính nhất quán nội bộ:
  $$\alpha = \frac{K}{K-1} \left(1 - \frac{\sum_{i=1}^{K} \sigma^2_{Y_i}}{\sigma^2_X}\right)$$
  *(Yêu cầu $\alpha \ge 0.70$ để module hoạt động ổn định trong thực tế).*
* **Với Module Đo tốc độ:** Kiểm định tính tương quan thời gian phản ứng giữa nửa đầu và nửa sau của phiên làm bài (Split-half Reliability).
* **Với Module Tự luận Mở (M10):** Chạy kiểm định tỷ lệ nhất quán giữa các lần chấm điểm độc lập của AI (Inter-rater Reliability - Cohen's Kappa):
  $$\kappa = \frac{p_o - p_e}{1 - p_e}$$
  *(Yêu cầu hệ số nhất quán $\kappa \ge 0.80$).*

---

## 13. Quy chuẩn Xuất Dữ liệu (Data Export Formats)

### 13.1. Định dạng Xuất JSON Toàn phần (Full JSON Export Schema)
JSON lưu giữ toàn bộ thông tin chi tiết của phiên làm bài, tối ưu cho việc phân tích chuyên sâu bằng Python/R hoặc lưu trữ bảo mật:

```json
{
  "session": {
    "sessionId": "s_1002",
    "participantId": "p_5008",
    "startedAt": "2026-05-22T08:00:00Z",
    "endedAt": "2026-05-22T08:45:00Z"
  },
  "device": {
    "inputType": "mouse_keyboard",
    "viewportWidth": 1920,
    "viewportHeight": 1080
  },
  "cores": {
    "processingSpeedCore": 78.5,
    "spatialSystemsCore": 82.0,
    "behaviorDecisionCore": 65.0,
    "higherOrderThinkingCore": 72.4,
    "metacognitiveScore": 88.0
  },
  "rawEvents": [
    {
      "eventId": "evt_001",
      "eventType": "stimulus_shown",
      "moduleId": "M2",
      "trialId": "m2_stroop_001",
      "clientTimeMs": 120504.2
    }
  ]
}
```

### 13.2. Định dạng Xuất Flat CSV (CSV Export Fields)
CSV xuất thông tin dưới dạng bảng phẳng để import nhanh vào Excel hoặc Google Sheets. Mỗi dòng tương ứng với kết quả của **một trial cụ thể**:

```csv
session_id,participant_id,module_id,block_id,trial_id,item_id,condition,difficulty,is_correct,partial_score,response_time_ms,first_interaction_time_ms,changed_answer_count,skipped,timed_out,focus_loss_count,invalid_flags
s_1002,p_5008,M2,block_01,m2_stroop_001,stroop_incongruent_red,incongruent,3,true,1.0,742,420,0,false,false,0,[]
s_1002,p_5008,M3,block_01,m3_corsi_001,corsi_seq_4,forward,4,false,0.75,3402,1200,1,false,false,0,[]
```

---

## 14. Chiến lược Phát triển Phần mềm (Software Development Strategy)

### 14.1. Công nghệ Khuyến nghị (Recommended Tech Stack)
* **Frontend:** Next.js hoặc React (Vite) + TypeScript. Quản lý trạng thái bằng **Zustand** (Nhẹ, tối ưu lưu trữ offline).
* **UI/Visualization:** TailwindCSS (nếu cần thiết, hoặc Vanilla CSS cho hiệu năng tối đa), **Framer Motion** cho tương tác chuyển động mượt mà, **Recharts** vẽ Radar Chart.
* **Backend:** Next.js API Routes hoặc FastAPI (Python) để xử lý logic chấm điểm bảo mật và lưu trữ cơ sở dữ liệu.
* **Database:** PostgreSQL (Supabase) lưu Session, Metadata và Logs.

### 14.2. Thứ tự Xây dựng Hệ thống (Build Order)
1. **Giai đoạn 1 (Móng & Tracking):** Xây dựng `Event Tracker`, `Test Orchestrator`, thiết lập Schema dữ liệu và tạo 01 module demo đơn giản để chạy thử nghiệm hạ tầng lưu trữ.
2. **Giai đoạn 2 (Xây dựng 3 Module Trọng điểm):**
   * *M2 (Bộ Lọc Phản Xạ):* Kiểm chứng khả năng đo lường thời gian cực nhạy ($RT$ chính xác).
   * *M3 (Bộ Nhớ Thao Tác):* Kiểm chứng cơ chế thích ứng độ khó thực thời (Adaptive L).
   * *M5 (Bản Đồ Quy Trình):* Kiểm chứng kéo thả tương tác cao và thuật toán chấm điểm Kendall Tau.
3. **Giai đoạn 3 (Scoring Engine Backend):** Phát triển bộ chuyển đổi điểm (Scoring Adapters), hệ thống lọc nhiễu dữ liệu thô và xuất báo cáo PDF/Radar Chart.
4. **Giai đoạn 4 (Hoàn thiện các Module còn lại):** Triển khai M1, M4, M6, M7, M8, M9, M10, M11.
5. **Giai đoạn 5 (Pilot & Calibration):** Tiến hành kiểm tra nội bộ 20 người, pilot bên ngoài 50 người để hiệu chỉnh thang đo và tối ưu hóa hệ thống AI chấm điểm của Module 10.

---

## 15. Tiêu chuẩn Hoàn thành cho mỗi Module (Definition of Done - DoD for Modules)

Một module chỉ được coi là sẵn sàng đưa vào sử dụng chính thức khi vượt qua đầy đủ các bài kiểm duyệt:
- [ ] Xác định rõ mục tiêu đo lường và lý thuyết nhận thức nền tảng.
- [ ] Hoàn thiện tài liệu thiết kế giao diện tương tác (Interaction Spec).
- [ ] Gắn đầy đủ các sự kiện tracking thô (`performance.now()`) cho tất cả tương tác chuột/bàn phím.
- [ ] Độc lập hóa cấu trúc lưu trữ dữ liệu câu hỏi (Item Schema).
- [ ] Triển khai hàm tính điểm tự động không phụ thuộc vào UI (Independent Scoring Logic).
- [ ] Cài đặt hệ thống gắn cờ kiểm duyệt lỗi dữ liệu tương tác (Data Quality Flags).
- [ ] Xây dựng bộ từ điển nhận xét mẫu dựa trên các dải hiệu suất và phong cách cụ thể.
- [ ] Viết tối thiểu 03 bộ unit test bao trùm kịch bản: Người dùng làm đúng hoàn toàn, người dùng làm sai hoàn toàn, và người dùng gặp sự cố hệ thống (Edge cases).
- [ ] Khóa mã phiên bản lưu trữ dữ liệu (Versioning).
- [ ] Hỗ trợ xuất luồng dữ liệu thô ra cấu trúc JSON/CSV tiêu chuẩn.

---

## 16. Các Kịch bản Kiểm thử Thuật toán Mẫu (Technical Test Cases)

### 16.1. Kiểm thử Thuật toán Stroop Interference Cost (M2)

**Dữ liệu Đầu vào (User Trial Logs):**
```json
[
  { "condition": "congruent", "isCorrect": true, "responseTimeMs": 480 },
  { "condition": "congruent", "isCorrect": true, "responseTimeMs": 520 },
  { "condition": "incongruent", "isCorrect": true, "responseTimeMs": 780 },
  { "condition": "incongruent", "isCorrect": true, "responseTimeMs": 820 }
]
```
**Thuật toán Tính toán:**
$$\text{Median}(RT_{\text{congruent}}) = 500\text{ms}$$
$$\text{Median}(RT_{\text{incongruent}}) = 800\text{ms}$$
$$\text{Interference Cost} = 800 - 500 = 300\text{ms}$$
**Kết quả Mong đợi:** Interference Cost trả về chính xác $300\text{ms}$ (Đạt kiểm thử).

### 16.2. Kiểm thử Thuật toán Chấm điểm Kendall Tau (M5)

**Danh sách Đáp án Chuẩn (Correct Order):** `["A", "B", "C", "D"]`
**Danh sách Người dùng xếp (User Order):** `["A", "C", "B", "D"]`

**Thuật toán Phân tích Nghịch thế (Inversions):**
* Các cặp thứ tự chuẩn: $(A, B), (A, C), (A, D), (B, C), (B, D), (C, D)$ $\rightarrow$ Tổng số cặp $N(N-1)/2 = 6$ cặp.
* Cặp nghịch thế xuất hiện trong danh sách người dùng: Cặp $(C, B)$ bị đảo ngược thứ tự so với chuẩn $\rightarrow$ Có $1$ cặp nghịch thế.
* Điểm Kendall Tau ($\tau$):
  $$\tau = 1 - \frac{2 \times 1}{6} = 1 - 0.333 = 0.667$$

**Kết quả Mong đợi:** `proceduralOrderScore` trả về kết quả bằng $0.667$ (Đạt kiểm thử).

---

## 17. Bảng Quản trị Rủi ro Thiết kế (Design Risks & Mitigations)

| Rủi ro kỹ thuật (Technical Risk) | Hậu quả (Consequence) | Giải pháp giảm thiểu (Mitigation Strategy) |
| :--- | :--- | :--- |
| **Dữ liệu RT bị nhiễu do thiết bị giật/lag** | Đánh giá sai hiệu suất tốc độ xử lý thông tin. | Ghi nhận cấu hình phần cứng, đo FPS ngầm, lọc bỏ các trial có sự kiện lag hệ thống đột biến. |
| **Người dùng spam nhấp chuột vô tội vạ** | Làm sai lệch dữ liệu hành vi thực tế. | Sử dụng cờ cảnh báo `suspiciousSpamFlags`, bỏ qua các click liên tiếp dưới 100ms. |
| **Chênh lệch thời gian do chuyển tab/mất focus** | Thời gian phản ứng tăng vọt bất thường. | Dùng API `document.visibilityState` để tạm dừng đồng hồ tính giờ khi tab không hoạt động, gắn cờ `tooManyFocusLosses`. |
| **Chấm điểm tự luận của AI bị sai lệch** | Đánh giá thiếu công bằng, không ổn định. | Thiết lập khung Rubric nghiêm ngặt, đối chiếu chéo (Cross-validation) kết quả AI với dữ liệu hành vi thực tế. |
| **Mất dữ liệu giữa chừng khi reload trang** | Người dùng phải làm lại từ đầu gây ức chế. | Triển khai State Machine lưu dữ liệu tức thì xuống Zustand / LocalStorage để khôi phục trạng thái ngay khi tải lại trang. |

---

## 18. Tiêu chuẩn Đóng gói Phiên bản MVP (Definition of Done for MVP)

Hệ thống được coi là hoàn thiện và sẵn sàng thử nghiệm diện rộng khi đạt đầy đủ các cột mốc:
1. Có ít nhất **03 module** nhận thức vận hành hoàn chỉnh từ giao diện UI đến hệ thống chấm điểm backend (`M2`, `M3`, `M5`).
2. Mọi lượt chơi đều được Event Tracker ghi nhận và khôi phục (Reconstruct) chính xác chuỗi hành vi từ nhật ký.
3. Tách biệt hoàn toàn `Scoring Engine` khỏi mã nguồn Frontend để đảm bảo tính an toàn của thuật toán chấm điểm.
4. Báo cáo kết quả hiển thị sinh động qua **Radar Chart đa trục**, không tồn tại điểm số tổng kết luận tuyệt đối.
5. `Gương Hiệu Chuẩn (M9)` hoạt động trơn tru, ghi nhận đầy đủ sự thay đổi tự tin của người chơi sau các block.
6. Hệ thống hỗ trợ trích xuất dữ liệu ra cả hai định dạng **JSON toàn phần** và **CSV bảng phẳng**.
7. Các bộ lọc chất lượng dữ liệu (`Data Quality Flags`) hoạt động chính xác để phát hiện spam click hoặc chuyển tab.
8. Hoàn thành tối thiểu **01 vòng kiểm thử thực tế nội bộ** trên 10 người dùng để loại bỏ các lỗi tương tác cơ bản.

---

## 19. Kết luận Kiến trúc (Conclusion)

Hệ thống đánh giá nhận thức và hành vi này được thiết kế dựa trên triết lý **"Đo lường trước, nội dung sau"**:
$$\text{Schema} \rightarrow \text{Tracking} \rightarrow \text{Trial Reconstruction} \rightarrow \text{Scoring} \rightarrow \text{Report} \rightarrow \text{Item Content}$$

Bằng cách xây dựng một cơ sở hạ tầng thu thập và chuẩn hóa dữ liệu vững chắc ngay từ ban đầu, việc mở rộng và tích hợp thêm các module câu hỏi mới sẽ diễn ra vô cùng an toàn, nhất quán. Sự kết hợp giữa các chỉ số hiệu suất khách quan, phong cách tương tác đặc trưng và khả năng tự đánh giá hiệu chuẩn của người chơi sẽ tạo nên một hồ sơ nhận thức đa chiều, khoa học và mang lại giá trị thực tế cao cho người sử dụng.
