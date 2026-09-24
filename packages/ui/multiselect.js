import { element, Button, Tag } from "./index.js";
import { ValidationMessage } from "./validation.js";
let serial = 0;
/** loadOptions({query,cursor,limit,signal}) => Promise<{items:[{id,label}],nextCursor:null|string}> */
export class WLAsyncMultiselect extends HTMLElement {
  #loader;
  #selected = new Map();
  #request = 0;
  #abort;
  #cursor = null;
  #busy = false;
  #done = false;
  set loadOptions(fn) {
    this.#loader = fn;
    if (this.isConnected && this.details?.open) this.reload();
  }
  get value() {
    return [...this.#selected.keys()];
  }
  set value(items) {
    this.#selected = new Map(items.map((x) => [String(x.id), x]));
    if (this.chips) this.renderChips();
    this.list?.querySelectorAll("input").forEach((input) => {
      input.checked = this.#selected.has(input.value);
    });
  }
  connectedCallback() {
    if (this.details) {
      if (this.details.open && !this.list.children.length) this.reload();
      return;
    }
    const id = `multi-${++serial}`;
    this.classList.add("wl-async-multi");
    this.chips = element("div", {
      class: "wl-async-selected",
      "aria-label": "Itens selecionados",
    });
    this.search = element("input", {
      id: id + "-search",
      type: "search",
      class: "ui-input",
      placeholder: "Buscar por nome",
      autocomplete: "off",
    });
    this.list = element("div", {
      class: "wl-async-results",
      role: "group",
      "aria-label": "Opções disponíveis",
      tabindex: 0,
    });
    this.status = element("span", { role: "status", "aria-live": "polite" });
    this.more = Button({
      label: "Carregar mais",
      variant: "outline",
      onClick: () => this.load(),
    });
    this.retry = Button({
      label: "Tentar novamente",
      variant: "outline",
      onClick: () => this.load(),
    });
    this.retry.hidden = true;
    this.summary = element(
      "summary",
      { "aria-controls": id + "-panel", "aria-expanded": "false" },
      "Selecionar participantes",
    );
    this.validation = ValidationMessage({
      control: this.summary,
      help: this.getAttribute("help") || "",
    });
    this.details = element("details", { class: "wl-async-disclosure" }, [
      this.summary,
      element("div", { class: "wl-async-panel", id: id + "-panel" }, [
        element("label", { for: this.search.id }, "Filtrar participantes"),
        this.search,
        this.list,
        element("div", { class: "wl-async-footer" }, [
          this.status,
          this.more,
          this.retry,
        ]),
      ]),
    ]);
    this.replaceChildren(
      element(
        "span",
        { class: "wl-async-label" },
        this.getAttribute("label") || "Participantes",
      ),
      this.chips,
      this.details,
      this.validation.element,
    );
    this.details.addEventListener("toggle", () => {
      this.summary.setAttribute("aria-expanded", String(this.details.open));
      if (this.details.open && !this.list.children.length && !this.#busy)
        this.reload();
    });
    this.search.addEventListener("input", () => this.reload());
    this.list.addEventListener(
      "scroll",
      () => {
        if (
          this.list.scrollTop + this.list.clientHeight >=
          this.list.scrollHeight - 24
        )
          this.load();
      },
      { passive: true },
    );
    this.addEventListener("keydown", (e) => {
      if (e.key === "Escape" && this.details.open) {
        e.preventDefault();
        e.stopPropagation();
        this.details.open = false;
        this.summary.focus();
      }
    });
    this.renderChips();
    this.more.hidden = true;
  }
  disconnectedCallback() {
    this.#request++;
    this.#abort?.abort();
    this.#busy = false;
    this.list?.removeAttribute("aria-busy");
  }
  reload() {
    this.#request++;
    this.#abort?.abort();
    this.#busy = false;
    this.#cursor = null;
    this.#done = false;
    this.list.replaceChildren();
    this.list.scrollTop = 0;
    this.load();
  }
  async load() {
    if (this.#busy || this.#done) return;
    this.#busy = true;
    const version = ++this.#request;
    this.#abort = new AbortController();
    this.list.setAttribute("aria-busy", "true");
    this.status.textContent = "Carregando participantes…";
    this.retry.hidden = true;
    this.more.hidden = true;
    try {
      if (!this.#loader) throw new Error("Fonte indisponível");
      const result = await this.#loader({
        query: this.search.value.trim(),
        cursor: this.#cursor,
        limit: Number(this.getAttribute("page-size")) || 8,
        signal: this.#abort.signal,
      });
      if (version !== this.#request) return;
      if (!Array.isArray(result.items)) throw new Error("Resposta inválida");
      for (const item of result.items) {
        const id = String(item.id);
        if (
          [...this.list.querySelectorAll("input")].some((x) => x.value === id)
        )
          continue;
        const check = element("input", { type: "checkbox", value: id });
        check.checked = this.#selected.has(id);
        check.addEventListener("change", () => {
          check.checked
            ? this.#selected.set(id, item)
            : this.#selected.delete(id);
          this.renderChips();
          this.emit();
        });
        this.list.append(
          element("label", { class: "wl-async-option" }, [
            check,
            element(
              "span",
              { class: "avatar", "aria-hidden": true },
              item.label
                .split(" ")
                .slice(0, 2)
                .map((x) => x[0])
                .join(""),
            ),
            element("span", {}, item.label),
          ]),
        );
      }
      this.#cursor = result.nextCursor ?? null;
      this.#done = this.#cursor === null;
      const n = this.list.children.length;
      this.status.textContent = n
        ? `${n} opções carregadas${this.#done ? " · fim da lista" : ""}`
        : "Nenhum participante encontrado";
      this.more.hidden = this.#done;
    } catch (error) {
      if (version !== this.#request || error.name === "AbortError") return;
      this.status.textContent =
        "Não foi possível carregar. Suas seleções foram mantidas.";
      this.retry.hidden = false;
    } finally {
      if (version === this.#request) {
        this.#busy = false;
        this.list.removeAttribute("aria-busy");
      }
    }
  }
  emit() {
    if (this.hasAttribute("required") && !this.#selected.size)
      this.validation?.setError("Escolha pelo menos uma opção.");
    else this.validation?.clear();
    this.dispatchEvent(
      new CustomEvent("wl-change", {
        bubbles: true,
        detail: { value: this.value, items: [...this.#selected.values()] },
      }),
    );
  }
  renderChips() {
    this.chips.replaceChildren();
    if (!this.#selected.size) {
      this.chips.append(
        element(
          "span",
          { class: "wl-async-empty" },
          "Nenhum participante selecionado",
        ),
      );
      return;
    }
    for (const [id, item] of this.#selected) {
      const avatar = this.hasAttribute("with-avatar")
        ? item.label
            .split(" ")
            .slice(0, 2)
            .map((x) => x[0])
            .join("")
        : null;
      this.chips.append(
        Tag({
          label: item.label,
          avatar,
          removable: true,
          onRemove: () => {
            this.#selected.delete(id);
            this.renderChips();
            this.list.querySelectorAll("input").forEach((x) => {
              if (x.value === id) x.checked = false;
            });
            this.emit();
            this.summary.focus();
          },
        }),
      );
    }
  }
}
if (!customElements.get("wl-async-multiselect"))
  customElements.define("wl-async-multiselect", WLAsyncMultiselect);
