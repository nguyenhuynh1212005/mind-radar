export type Locale = 'vi';

export interface Messages {
  readonly title: string;
  readonly subtitle: string;
  readonly scanCta: string;
  readonly loading: string;
  readonly unavailable: string;
  readonly progress: string;
  readonly git: string;
  readonly changedFiles: string;
  readonly fileAreas: string;
  readonly repoTree: string;
  readonly logs: string;
  readonly aiContextExport: string;
  readonly copyPrompt: string;
  readonly copySuccess: string;
  readonly copyFailed: string;
  readonly emptyLogs: string;
  readonly existingChecks: string;
  readonly missingChecks: string;
  readonly cleanGit: string;
  readonly dirtyGit: string;
  readonly aiArtifacts: string;
  readonly copyChatbotHandoff: string;
  readonly copyGitDiffReview: string;
  readonly copyNextCodexPrompt: string;
  readonly copyArchitectureContext: string;
  readonly copyChangedFilesContext: string;
  readonly copied: string;
  readonly clean: string;
  readonly dirtyState: string;
  readonly currentBranch: string;
  readonly cleanState: string;
  readonly stagedFiles: string;
  readonly unstagedFiles: string;
  readonly untrackedFiles: string;
  readonly lastCommits: string;
  readonly diffSummary: string;
  readonly files: string;
  readonly directories: string;
  readonly gitShort: string;
  readonly noItems: string;
  readonly totalChecklistProgress: string;
  readonly mainAppMvpProgress: string;
  readonly projectControlCenterProgress: string;
  readonly codexReadiness: string;
  readonly productionReadiness: string;
  readonly errorTitle: string;
  readonly appTitle: string;
  readonly refresh: string;
  readonly gitHistory: string;
  readonly scanHistory: string;
  readonly toolErrors: string;
}

const VI_MESSAGES: Messages = {
  title: 'Trung tâm Điều khiển Dự án (Project Control Center)',
  subtitle: 'Theo dõi tiến độ, trạng thái kho lưu trữ và dữ liệu ngữ cảnh cho AI (Local status & AI context).',
  scanCta: 'Tải lại Snapshot (Load Snapshot)',
  loading: 'Đang tải dữ liệu...',
  unavailable: 'Không thể kết nối API. Vui lòng đảm bảo server đang chạy.',
  progress: 'Tiến độ (Progress)',
  git: 'Lịch sử Git (Git History)',
  changedFiles: 'Tệp đã thay đổi (Changed Files)',
  fileAreas: 'Khu vực Tệp (File Areas)',
  repoTree: 'Cấu trúc thư mục (Repo Tree)',
  logs: 'Nhật ký hệ thống (Logs)',
  aiContextExport: 'Xuất ngữ cảnh AI (AI Context Export)',
  copyPrompt: 'Sao chép',
  copySuccess: 'Đã sao chép!',
  copyFailed: 'Lỗi sao chép',
  emptyLogs: 'Không có nhật ký nào gần đây.',
  existingChecks: 'Tiêu chí đã đạt (Existing Checks)',
  missingChecks: 'Tiêu chí còn thiếu (Missing Checks)',
  cleanGit: 'Sạch (Clean)',
  dirtyGit: 'Có thay đổi (Dirty)',
  aiArtifacts: 'Các ngữ cảnh sẵn sàng để sao chép cho AI:',
  copyChatbotHandoff: 'Chatbot Handoff Prompt',
  copyGitDiffReview: 'Git Diff Review Prompt',
  copyNextCodexPrompt: 'Next Codex Prompt',
  copyArchitectureContext: 'Architecture Context',
  copyChangedFilesContext: 'Changed Files Context',
  copied: 'Đã sao chép vào clipboard!',
  clean: 'Sạch (Không có tệp chưa commit)',
  dirtyState: 'Có thay đổi chưa được commit',
  currentBranch: 'Nhánh hiện tại (Branch)',
  cleanState: 'Trạng thái Git (Git State)',
  stagedFiles: 'Tệp đang chờ commit (Staged)',
  unstagedFiles: 'Tệp chưa chờ commit (Unstaged)',
  untrackedFiles: 'Tệp chưa theo dõi (Untracked)',
  lastCommits: 'Các commit gần đây (Last Commits)',
  diffSummary: 'Tóm tắt thay đổi (Diff Summary)',
  files: 'Số lượng tệp (Files)',
  directories: 'Số lượng thư mục (Directories)',
  gitShort: 'Git (Đã sửa)',
  noItems: 'Trống (Không có mục nào).',
  totalChecklistProgress: 'Tiến độ tổng thể (Total Progress)',
  mainAppMvpProgress: 'Tiến độ MVP (Main App)',
  projectControlCenterProgress: 'Tiến độ PCC',
  codexReadiness: 'Độ sẵn sàng Codex (Codex Readiness)',
  productionReadiness: 'Độ sẵn sàng Production',
  errorTitle: 'Lỗi',
  appTitle: 'Project Control Center',
  refresh: 'Làm mới',
  gitHistory: 'Lịch sử Git',
  scanHistory: 'Nhật ký quét',
  toolErrors: 'Lỗi hệ thống'
};

export function getMessages(locale: Locale = 'vi'): Messages {
  switch (locale) {
    case 'vi':
      return VI_MESSAGES;
    default:
      return VI_MESSAGES;
  }
}

export type LabelKey = keyof Messages;

export function t(key: LabelKey): string {
  return VI_MESSAGES[key] || key;
}
