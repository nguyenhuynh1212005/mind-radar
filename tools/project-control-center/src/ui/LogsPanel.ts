import { el, list, panel } from "./layout";
import { t } from "./i18n";

export async function renderLogsPanel(): Promise<HTMLElement> {
  const section = panel("logs");
  
  try {
    const response = await fetch("/api/logs");
    if (!response.ok) throw new Error("API failed");
    
    const data = await response.json() as {
      scanHistory: any[];
      toolErrors: any[];
    };
    
    const scanItems = data.scanHistory.map((item) => `[${item.scannedAt}] Files: ${item.fileCount}, Changed: ${item.changedFileCount}`);
    const errorItems = data.toolErrors.map((err) => `[${err.timestamp}] ${err.operation} - ${err.message}`);
    
    if (scanItems.length === 0 && errorItems.length === 0) {
      section.append(el("p", "empty", t("emptyLogs")));
    } else {
      section.append(list("scanHistory", scanItems));
      section.append(list("toolErrors", errorItems));
    }
  } catch (err) {
    section.append(el("p", "empty", t("emptyLogs")));
  }
  
  return section;
}
