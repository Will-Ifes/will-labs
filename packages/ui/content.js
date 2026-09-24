import { element, Button } from "./index.js";
export function Avatar({ name, size = "medium", src = "" } = {}) {
  const initials = (name || "?")
    .trim()
    .split(/\s+/)
    .slice(0, 2)
    .map((x) => x[0]?.toLocaleUpperCase("pt-BR"))
    .join("");
  const avatar = element(
    "span",
    {
      class: `ui-avatar ui-avatar--${size}`,
      role: "img",
      "aria-label": name || "Pessoa sem nome",
    },
    initials,
  );
  if (src) {
    const image = element("img", { src, alt: "", loading: "lazy" });
    image.addEventListener("load", () => avatar.replaceChildren(image));
    image.addEventListener("error", () => image.remove());
  }
  return avatar;
}
export function ImageFigure({
  src = "",
  alt = "",
  caption = "",
  width = 640,
  height = 360,
} = {}) {
  const fallback = element(
    "span",
    { class: "ui-image-fallback" },
    "Imagem indisponível",
  );
  const image = element("img", { src, alt, width, height, loading: "lazy" });
  image.addEventListener("error", () => image.replaceWith(fallback));
  return element("figure", { class: "ui-image-figure" }, [
    image,
    caption ? element("figcaption", {}, caption) : null,
  ]);
}
export function Progress({ label, value = 0, max = 100 } = {}) {
  const progress = element(
    "progress",
    { value, max, "aria-label": label },
    `${value}%`,
  );
  const output = element("output", {}, `${value} de ${max}`);
  const root = element("div", { class: "ui-progress" }, [
    element("label", {}, label),
    progress,
    output,
  ]);
  root.setValue = (next) => {
    progress.value = Math.max(0, Math.min(max, next));
    output.textContent = `${progress.value} de ${max}`;
  };
  return root;
}
export function Breadcrumb({ items = [] } = {}) {
  return element(
    "nav",
    { class: "ui-breadcrumb", "aria-label": "Caminho" },
    element(
      "ol",
      {},
      items.map((item, index) =>
        element(
          "li",
          {},
          index === items.length - 1
            ? element("span", { "aria-current": "page" }, item.label)
            : element("a", { href: item.href }, item.label),
        ),
      ),
    ),
  );
}
export function TextLink({ label, href, external = false } = {}) {
  if (!href) throw new TypeError("TextLink requires href");
  return element(
    "a",
    {
      class: "ui-link",
      href,
      target: external ? "_blank" : null,
      rel: external ? "noopener noreferrer" : null,
    },
    [label, external ? element("span", { "aria-hidden": true }, " ↗") : null],
  );
}
