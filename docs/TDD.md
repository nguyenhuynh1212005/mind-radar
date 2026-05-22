# Tài liệu Thiết kế (TDD) - Bài Đánh Giá Nhận Thức & Hành Vi
*(Interactive Cognitive-Behavioral Profile Assessment)*

## 1. Mục Tiêu & Yêu Cầu Cơ Bản

* **Định vị:** Đây là **bài đánh giá tương tác về hồ sơ nhận thức – hành vi** dưới nhiều dạng nhiệm vụ (không đo lường IQ/EQ tuyệt đối, không dán nhãn "thiên tài" hay "bản chất tiềm thức").
* **Mục tiêu đo lường:** Đánh giá hiệu suất và phong cách xử lý thông tin của người dùng.
* **Hình thức:** Ứng dụng Web tương tác (Interactive Gamification).
* **Độ tin cậy nội bộ (Internal Reliability):** Cần đảm bảo đủ số lượng câu hỏi (items/trials) trong mỗi module để kết quả đo lường mang tính ổn định và khoa học.
* **Hệ thống thu thập dữ liệu (Behavioral Tracking):** Không chỉ chấm điểm đúng/sai, hệ thống phải ngầm ghi nhận chi tiết:
  * Thời gian phản ứng (Response time - ms).
  * Thời gian do dự / Khựng lại (Hover/Hesitation time - ms).
  * Số lần thử lại / Số lần nhấp chuột sai.
  * Số lần thay đổi đáp án.
  * Tỷ lệ bỏ qua.
* **Chuẩn hóa & Báo cáo kết quả:**
  * Không dùng một điểm tổng duy nhất.
  * Hiển thị kết quả bằng **Biểu đồ Radar đa trục (Radar Chart)** dựa trên điểm phân vị (percentile) hoặc điểm chuẩn hóa nội bộ (normalized score).
  * Lời giải thích kết quả phải dựa trên hành vi cụ thể (VD: "Bạn xử lý tốt hơn ở nhóm nhiệm vụ không gian so với phản ứng tốc độ"), tránh kết luận quá mức (overclaim).
* **Xuất dữ liệu:** Toàn bộ lịch sử hành vi (logs) phải được xuất ra định dạng `.json` hoặc `.csv` rõ ràng theo từng trial.

---

## 2. Cấu Trúc Đánh Giá (11 Module)

Bài test chia thành 4 lõi năng lực cốt lõi, cùng một module tự đánh giá lồng ghép xuyên suốt quá trình.

* **Lõi 1: Nhận thức & Tốc độ (Xử lý thông tin thô)**
  * Module 1: Nhịp Suy Luận (Fluid Reasoning & Processing Speed)
  * Module 2: Bộ Lọc Phản Xạ (Inhibitory Control)
  * Module 3: Bộ Nhớ Thao Tác (Working Memory)

* **Lõi 2: Không gian & Hệ thống (Tổ chức thông tin)**
  * Module 4: Không Gian Hình Khối (Spatial Reasoning)
  * Module 5: Bản Đồ Quy Trình (Procedural / Systems Reasoning)
  * Module 6: Chuyển Luật (Cognitive Flexibility)

* **Lõi 3: Hành vi & Quyết định (Phản ứng với môi trường)**
  * Module 7: Phản Ứng Ưu Tiên (Fast Preference Response)
  * Module 8: Chiến Lược Rủi Ro (Risk-taking Under Uncertainty)

* **Lõi 4: Tư Duy Bậc Cao (Ngôn ngữ & Giải quyết vấn đề)**
  * Module 10: Phòng Thí Nghiệm Tư Duy (Open-ended Problem Solving)
  * Module 11: Suy Luận Ngôn Ngữ (Verbal Reasoning)

* **Xuyên suốt (Lồng ghép vào từng block/task nhỏ):**
  * Module 9: Gương Hiệu Chuẩn (Metacognitive Calibration)

---

## 3. Chi Tiết Các Module & Chỉ Số Đo Lường

### Lõi 1: Nhận thức & Tốc độ

**1. Module 1: Nhịp Suy Luận (Fluid Reasoning & Processing Speed)**
* **Nhiệm vụ:** Tìm quy luật chuỗi số, ma trận hình học (tương tự Raven's matrices, tự thiết kế).
* **Tương tác:** Click chọn đáp án. Có 2 pha: Pha chậm (không áp lực thời gian) và Pha áp lực (giới hạn thời gian gắt gao).
* **Khuyến nghị số lượng:** 16 – 24 câu.
* **Chỉ số cần tính:**
  * *Accuracy Logic:* Tỷ lệ đúng ở pha chậm.
  * *Speeded Reasoning:* Tỷ lệ đúng ở pha áp lực.
  * *Speed–Accuracy Style:* Đánh giá phong cách (nhanh mà sai / chậm mà chắc / nhanh và chuẩn).

**2. Module 2: Bộ Lọc Phản Xạ (Inhibitory Control)**
* **Nhiệm vụ:** Chống lại phản xạ bản năng (ví dụ Stroop Task: Chữ "ĐỎ" tô mực xanh lá -> Phải chọn màu "xanh lá"). Bổ sung thêm Go/No-Go task (Thấy xanh -> bấm, đỏ -> không bấm).
* **Tương tác:** Bấm phím tắt hoặc click tốc độ cao.
* **Khuyến nghị số lượng:** 60 – 120 trials ngắn.
* **Chỉ số cần tính:**
  * *Interference Cost:* Thời gian chậm đi ở những trial có yếu tố gây nhiễu so với trial thường.
  * *False Press Rate:* Tỷ lệ bấm nhầm (không kìm được phản xạ).
  * *Recovery Time:* Thời gian lấy lại sự ổn định sau khi chọn sai.

**3. Module 3: Bộ Nhớ Thao Tác (Working Memory)**
* **Nhiệm vụ:** Ghi nhớ và tái hiện chuỗi thông tin (Corsi block). Hệ thống hiển thị thứ tự các ô sáng lên.
* **Tương tác:** Nhấp chuột theo trình tự.
* **Chế độ (Modes):**
  * *Forward Corsi:* Bấm lại đúng thứ tự (Đo Spatial short-term memory).
  * *Backward Corsi:* Bấm ngược thứ tự (Đo Working memory manipulation).
* **Khuyến nghị số lượng:** 8 – 12 chuỗi với độ khó tăng dần.

### Lõi 2: Không gian & Hệ thống

**4. Module 4: Không Gian Hình Khối (Spatial Reasoning)**
* **Nhiệm vụ:** Nhận diện, xoay 2D/3D và ghép các mảnh vật thể còn thiếu.
* **Tương tác:** Kéo thả (Drag & Drop), xoay đối tượng.
* **Khuyến nghị số lượng:** 12 – 20 items.
* **Chỉ số cần tính:**
  * Điểm thành phần: *Mental Rotation* (xoay hình), *Spatial Assembly* (ghép hình), *Visual Completion* (tìm mảnh khuyết).
  * *Drag Efficiency:* Số lần thử và sai trong thao tác kéo thả (tìm đúng nhưng thử 20 lần vs. xếp đúng ngay từ đầu).

**5. Module 5: Bản Đồ Quy Trình (Procedural / Systems Reasoning)**
* **Nhiệm vụ:** Sắp xếp các bước lộn xộn của một kế hoạch thành trình tự hợp lý.
* **Phân loại:**
  * *Quy trình đóng:* Có trình tự kỹ thuật đúng/sai rõ ràng.
  * *Quy trình mở:* Xử lý tình huống linh hoạt (ví dụ: sinh tồn). Chấm theo rubric ưu tiên (an toàn, tài nguyên...).
* **Tương tác:** Kéo thả để sắp xếp danh sách (Sortable list).
* **Khuyến nghị số lượng:** 8 – 12 bài.
* **Chỉ số cần tính:** Số lần đảo vị trí, thời gian tư duy trước lần kéo đầu tiên, độ logic từ trên xuống dưới.

**6. Module 6: Chuyển Luật (Cognitive Flexibility)**
* **Nhiệm vụ:** Phân loại thẻ bài. Ban đầu phân loại theo "Màu sắc", hệ thống ngầm đổi luật thành "Hình dáng" mà không báo trước. Người chơi tự nhận ra luật mới qua phản hồi Đúng/Sai.
* **Tương tác:** Click phân loại.
* **Khuyến nghị số lượng:** 40 – 80 lượt phân loại.
* **Chỉ số cần tính:**
  * *Trials to Rule Discovery:* Số lượt để nhận ra luật mới.
  * *Perseverative Errors:* Lỗi bám luật cũ khi luật đã đổi.
  * *Switch Cost:* Mức độ giảm hiệu suất ngay sau khi đổi luật.
  * *Feedback Learning:* Khả năng tự điều chỉnh sau khi nhận phản hồi sai.

### Lõi 3: Hành vi & Quyết định

**7. Module 7: Phản Ứng Ưu Tiên (Fast Preference Response)**
* **Nhiệm vụ:** Lựa chọn thích/không thích trước hàng loạt từ khóa/hình ảnh (công nghệ, xã hội, nghệ thuật, tự nhiên, rủi ro) dưới sức ép thời gian. Đo phản ứng nhanh, không kết luận khuynh hướng nghề nghiệp tuyệt đối.
* **Tương tác:** Vuốt thẻ trái/phải (Swipe) giới hạn trong khoảng 1.5s/thẻ.
* **Khuyến nghị số lượng:** 80 – 150 thẻ (khoảng 20 thẻ mỗi nhóm).
* **Chỉ số cần tính:**
  * *Approach/Avoidance Rate:* Tỷ lệ vuốt thích/bỏ qua.
  * *Response Latency:* Độ trễ phản ứng.
  * *Hesitation Rate:* Tỷ lệ lưỡng lự (quá thời gian quy định).
  * *Category Consistency:* Sự nhất quán trong các lựa chọn cùng nhóm.

**8. Module 8: Chiến Lược Rủi Ro (Risk-taking under uncertainty)**
* **Nhiệm vụ:** Bơm bóng bay ảo để kiếm điểm (tương tự bài test BART). Bơm càng to điểm càng cao, nhưng bóng nổ sẽ mất điểm. Phân chia rõ các điều kiện: Xác suất rõ ràng (70% an toàn) vs. Mơ hồ (Không báo trước tỷ lệ).
* **Tương tác:** Nhập số hoặc bấm giữ nút "Bơm".
* **Khuyến nghị số lượng:** 20 – 40 rounds (lượt bóng).
* **Chỉ số cần tính:**
  * *Average Adjusted Pumps:* Mức bơm trung bình ở những bóng không nổ.
  * *Explosion Rate:* Tỷ lệ làm nổ bóng.
  * *Post-loss Adjustment:* Độ điều chỉnh mức cược (sợ hãi/cẩn trọng) sau khi bóng nổ.
  * *Ambiguity Tolerance:* Hành vi đánh cược trong điều kiện thông tin mơ hồ.

### Lõi 4: Tư Duy Bậc Cao

**10. Module 10: Phòng Thí Nghiệm Tư Duy (Open-ended Problem Solving)**
* **Nhiệm vụ:** Giải quyết một vấn đề mở (ví dụ: "Thiết kế app giúp học sinh học tốt hơn", "Tối ưu lịch học 7 ngày trước kỳ thi", "Tìm nguyên nhân vì sao một web app bị chậm", "Lập kế hoạch kiếm 1 triệu đầu tiên bằng kỹ năng số", "Thiết kế bài test nhận thức này sao cho ít sai lệch hơn"). Yêu cầu thực hiện tuần tự 4 bước: Tách vấn đề, Đặt giả thuyết, Chọn chiến lược, và Tự đánh giá điểm yếu.
* **Tương tác:** Nhập liệu văn bản (Text input), chọn lựa chiến lược, tự phản biện.
* **Chỉ số cần tính:**
  * *Problem Decomposition:* Khả năng chia vấn đề lớn thành các phần nhỏ dễ xử lý.
  * *Causal Reasoning:* Khả năng phân biệt nguyên nhân gốc rễ và triệu chứng bề mặt.
  * *Constraint Awareness:* Nhận diện rõ các giới hạn về thời gian, dữ liệu, nguồn lực.
  * *Trade-off Thinking:* Nhận thức được tính đánh đổi (được cái này, mất cái kia) trong các giải pháp.
  * *Self-correction:* Tự phát hiện và chỉ ra lỗ hổng trong phương án vừa lập.
  * *Transfer:* Khả năng tận dụng kiến thức/quy luật từ các module trước áp dụng vào vấn đề mới.

**11. Module 11: Suy Luận Ngôn Ngữ (Verbal Reasoning)**
* **Nhiệm vụ:** Tìm quan hệ tương đồng (VD: "Bác sĩ : bệnh nhân = giáo viên : ?"), suy luận logic từ đoạn văn ngắn, phát hiện mâu thuẫn trong lập luận, phân biệt giữa nguyên nhân, bằng chứng và giả định, chọn kết luận hợp lý nhất.
* **Tương tác:** Đọc hiểu và chọn đáp án (Trắc nghiệm).
* **Chỉ số cần tính:**
  * *Verbal abstraction:* Mức độ trừu tượng ngôn ngữ.
  * *Reading reasoning:* Năng lực tư duy logic trong quá trình đọc hiểu.
  * *Argument detection:* Khả năng phát hiện cấu trúc lập luận.
  * *Inference accuracy:* Độ chính xác của các suy luận rút ra từ văn bản.
  * *Time under reading load:* Thời gian xử lý và hoàn thành dưới sức ép của lượng lớn thông tin dạng chữ.

### Tự Đánh Giá Xuyên Suốt

**9. Module 9: Gương Hiệu Chuẩn (Metacognitive Calibration)**
* **Nhiệm vụ:** Đánh giá mức độ tự tin ngay sau mỗi block nhỏ hoặc từng câu quan trọng (VD: "Bạn tự tin mình làm đúng bao nhiêu %?"). Đo lường việc người chơi có thực sự nhận thức được hiệu suất của mình hay không.
* **Tương tác:** Kéo thanh trượt (Slider) 0% - 100%.
* **Chỉ số cần tính:**
  * *Calibration Error:* Khoảng cách giữa sự tự tin (Confidence) và kết quả thực tế (Actual Performance). Cho thấy xu hướng Overconfidence (quá tự tin) hay Underconfidence (thiếu tự tin).

---

## 4. Cấu Trúc Log Dữ Liệu Tiêu Chuẩn

Hệ thống cần lưu lại trạng thái chi tiết cho mỗi trial thành định dạng `JSON` hoặc `CSV`. Dưới đây là cấu trúc JSON tham khảo:

```json
{
  "participant_id": "anonymous_001",
  "session_start": "2026-05-21T20:00:00+07:00",
  "device": {
    "screen_width": 1920,
    "screen_height": 1080,
    "input_type": "mouse_keyboard"
  },
  "modules": [
    {
      "module_id": "M2_inhibitory_control",
      "trials": [
        {
          "trial_id": "stroop_001",
          "stimulus": {
            "word": "ĐỎ",
            "ink_color": "green",
            "condition": "incongruent"
          },
          "correct_response": "green",
          "user_response": "green",
          "is_correct": true,
          "response_time_ms": 742,
          "hover_time_ms": 210,
          "changed_answer": false,
          "timestamp": "2026-05-21T20:04:12+07:00"
        }
      ],
      "self_rating": {
        "confidence_percent": 72,
        "perceived_difficulty_percent": 64
      }
    }
  ]
}
```