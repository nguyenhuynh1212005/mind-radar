# Project Status Dashboard

Trạng thái và tiến độ chi tiết của dự án **Interactive Cognitive-Behavioral Profile Assessment**.

---

## Current Phase & Focus

> [!IMPORTANT]
> **Phase hiện tại:** `P0.5 - Project Control Center Setup`
>
> **Trọng tâm:** Xây dựng Dashboard quản lý tiến độ nội bộ (Project Control Center) để định hướng Vibe Coding hiệu quả trước khi scaffold mã nguồn chính.

---

## Current Progress Metrics

| Metric | Progress / Status | Notes |
| :--- | :---: | :--- |
| **Main App MVP Progress** | `10%` | Các tài liệu đặc tả & Skill Codex đã hoàn thành. |
| **Project Control Center** | `Setup in Progress` | Đang thiết lập cấu hình & Đặc tả cho tool quản lý. |
| **Codex Readiness** | `HIGH` | Môi trường Codex và các prompt mẫu đã sẵn sàng. |
| **Production Readiness** | `0%` | Chưa deploy và chưa scaffold core ứng dụng chính. |

---

## Completed (Đã hoàn thành)

- [x] **Root AGENTS.md** - Thiết lập quy chuẩn cốt lõi cho Agent AI.
- [x] **Codex Config** - Cấu hình Codex hoàn tất tại `.codex/config.toml`.
- [x] **Assessment Skills** - Khởi tạo các workflow đặc biệt cho Agent tại thư mục `.agents/skills`.
- [x] **Project Docs** - Hoàn thành bộ tài liệu thiết kế hệ thống nền tảng trong `docs/`.

---

## In Progress (Đang thực hiện)

- [/] **Control Center Spec** - Hoàn thiện các tài liệu đặc tả kỹ thuật và file map (`project-map.json`, `controlCenterSpec.md`).
- [/] **Workflow Design** - Thiết lập cơ chế xuất AI context 4 cấp độ.

---

## Not Started (Chưa bắt đầu)

- [ ] Scaffold cấu trúc ứng dụng chính (TypeScript).
- [ ] Triển khai Contracts cốt lõi (`src/core/contracts`).
- [ ] Xây dựng Event Tracker (`src/core/tracking`).
- [ ] Triển khai Test Orchestrator (`src/core/orchestrator`).
- [ ] Triển khai Scoring Engine & các scoring adapters (`src/core/scoring`).
- [ ] Phát triển các MVP modules (M2, M3, M5, M9) (`src/modules`).
- [ ] Xây dựng hệ thống xuất báo cáo (Radar Profile, JSON/CSV export) (`src/report`).

---

## Next Recommended Action

> [!TIP]
> Hãy yêu cầu Codex lập kế hoạch triển khai công cụ **Project Control Center** mà không scaffold mã nguồn chính.
> Copy đoạn Prompt dưới đây và gửi cho Codex:

```text
/plan

Use the project-control-center-builder skill.

Read:
- tools/project-control-center/AGENTS.md
- tools/project-control-center/controlCenterSpec.md
- tools/project-control-center/project-map.json
- tools/project-control-center/CODEX_PROMPTS.md

Goal:
Plan the implementation of the Project Control Center.

Constraints:
- Do not code yet.
- Do not scaffold the main app.
```