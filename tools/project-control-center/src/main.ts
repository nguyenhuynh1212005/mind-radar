import "./styles.css";
import { start } from "./app";
import { t } from "./ui/i18n";

const root = document.querySelector<HTMLElement>("#app");

document.title = t("appTitle");

if (root) {
  void start(root);
}
