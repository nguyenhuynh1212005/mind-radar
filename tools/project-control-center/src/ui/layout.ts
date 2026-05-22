import { t, type LabelKey } from "./i18n";

export function el<K extends keyof HTMLElementTagNameMap>(
  tagName: K,
  className?: string,
  text?: string
): HTMLElementTagNameMap[K] {
  const element = document.createElement(tagName);
  if (className) {
    element.className = className;
  }
  if (text !== undefined) {
    element.textContent = text;
  }
  return element;
}

export function panel(titleKey: LabelKey): HTMLElement {
  const section = el("section", "panel");
  section.append(el("h2", undefined, t(titleKey)));
  return section;
}

export function metric(labelKey: LabelKey, value: string | number): HTMLElement {
  const item = el("div", "metric");
  item.append(el("span", "metric-label", t(labelKey)));
  item.append(el("strong", "metric-value", String(value)));
  return item;
}

export function list(labelKey: LabelKey, values: string[]): HTMLElement {
  const wrapper = el("div", "list-block");
  wrapper.append(el("h3", undefined, t(labelKey)));

  if (values.length === 0) {
    wrapper.append(el("p", "empty", t("noItems")));
    return wrapper;
  }

  const listElement = el("ul", "plain-list");
  for (const value of values) {
    listElement.append(el("li", undefined, value));
  }
  wrapper.append(listElement);
  return wrapper;
}
