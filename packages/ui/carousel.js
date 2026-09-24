import { element, Button, Surface } from "./index.js";
/** Scroll-snap rail with buttons, keyboard and pointer dragging. */
export function Carousel({ title = "Cards", items = [] } = {}) {
  if (!items.length) throw new TypeError("Carousel requires at least one item");
  const status = element("span", {
    class: "ui-carousel-status",
    role: "status",
  });
  const rail = element(
    "div",
    {
      class: "ui-carousel-rail",
      tabindex: 0,
      role: "region",
      "aria-label": title,
    },
    items.map((item) =>
      Surface({
        title: item.title,
        children: [element("p", {}, item.text), item.action || null],
      }),
    ),
  );
  const cards = [...rail.children];
  const current = () =>
    cards.reduce(
      (best, card, i) =>
        Math.abs(card.offsetLeft - rail.scrollLeft - cards[0].offsetLeft) <
        Math.abs(cards[best].offsetLeft - rail.scrollLeft - cards[0].offsetLeft)
          ? i
          : best,
      0,
    );
  const previous = Button({
    label: "←",
    variant: "outline",
    "aria-label": "Card anterior",
    onClick: () => move(-1),
  });
  const next = Button({
    label: "→",
    variant: "outline",
    "aria-label": "Próximo card",
    onClick: () => move(1),
  });
  function sync() {
    const n = current();
    previous.disabled = n === 0;
    next.disabled = n === cards.length - 1;
    status.textContent = `Card ${n + 1} de ${cards.length}`;
  }
  function move(delta) {
    const n = Math.max(0, Math.min(cards.length - 1, current() + delta));
    rail.scrollTo({
      left: cards[n].offsetLeft - cards[0].offsetLeft,
      behavior: matchMedia("(prefers-reduced-motion: reduce)").matches
        ? "instant"
        : "smooth",
    });
    setTimeout(sync, 350);
  }
  rail.addEventListener("scroll", () => requestAnimationFrame(sync), {
    passive: true,
  });
  rail.addEventListener("keydown", (e) => {
    if (["ArrowLeft", "ArrowRight"].includes(e.key)) {
      e.preventDefault();
      move(e.key === "ArrowRight" ? 1 : -1);
    }
  });
  let startX = 0,
    startScroll = 0,
    dragged = false;
  rail.addEventListener("pointerdown", (e) => {
    if (
      (e.pointerType === "mouse" && e.button !== 0) ||
      e.target.closest("a,button,input")
    )
      return;
    startX = e.clientX;
    startScroll = rail.scrollLeft;
    dragged = false;
    rail.setPointerCapture(e.pointerId);
    rail.classList.add("is-dragging");
  });
  rail.addEventListener("pointermove", (e) => {
    if (!rail.hasPointerCapture(e.pointerId)) return;
    const dx = e.clientX - startX;
    if (Math.abs(dx) > 4) dragged = true;
    rail.scrollLeft = startScroll - dx;
  });
  for (const name of ["pointerup", "pointercancel"])
    rail.addEventListener(name, (e) => {
      if (rail.hasPointerCapture(e.pointerId))
        rail.releasePointerCapture(e.pointerId);
      rail.classList.remove("is-dragging");
    });
  rail.addEventListener(
    "click",
    (e) => {
      if (dragged) {
        e.preventDefault();
        dragged = false;
      }
    },
    true,
  );
  queueMicrotask(sync);
  return element("section", { class: "ui-carousel" }, [
    element("div", { class: "ui-carousel-head" }, [
      element("h2", {}, title),
      previous,
      next,
    ]),
    rail,
    status,
  ]);
}
