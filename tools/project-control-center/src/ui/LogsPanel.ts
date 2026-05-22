import { list, panel } from "./layout";
import { t } from "./i18n";

export function renderLogsPanel(): HTMLElement {
  const section = panel("logs");
  section.append(list("snapshotFiles", [t("statusSnapshot"), t("gitSnapshot")]));
  section.append(list("appendOnlyHistory", [t("scanHistory"), t("toolErrors")]));
  return section;
}
