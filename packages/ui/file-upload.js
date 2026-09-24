import { element, Button } from "./index.js";
import { ValidationMessage } from "./validation.js";
let serial = 0;
/** Local file selection and validation. Consumers own the upload request. */
export function FileUpload({
  label = "Imagem",
  accept = ["image/png", "image/jpeg", "image/webp"],
  maxBytes = 2 * 1024 * 1024,
  onChange = () => {},
} = {}) {
  const id = `ui-file-${++serial}`;
  const formatNames = accept
    .map(
      (type) =>
        ({ jpeg: "JPG", png: "PNG", webp: "WebP" })[type.split("/")[1]] ||
        type.split("/")[1]?.toUpperCase() ||
        type,
    )
    .join(", ");
  const input = element("input", {
    id,
    type: "file",
    accept: accept.join(","),
    tabindex: "-1",
  });
  const status = element(
    "p",
    { class: "ui-upload-status", role: "status" },
    "Nenhum arquivo escolhido.",
  );
  const preview = element("div", { class: "ui-upload-preview" });
  const validation = ValidationMessage({
    control: input,
    help: `${formatNames}, até ${Math.round(maxBytes / 1048576)} MB.`,
  });
  let objectUrl;
  const clearPreview = () => {
    preview.replaceChildren();
    if (objectUrl) URL.revokeObjectURL(objectUrl);
    objectUrl = undefined;
  };
  const receive = (file) => {
    clearPreview();
    if (!file) {
      status.textContent = "Nenhum arquivo escolhido.";
      validation.resolve();
      onChange(null);
      return;
    }
    if (!accept.includes(file.type)) {
      validation.setError(`Formato não aceito. Use ${formatNames}.`);
      status.textContent = "Arquivo recusado.";
      onChange(null);
      return;
    }
    if (file.size > maxBytes) {
      validation.setError(
        `Arquivo acima de ${Math.round(maxBytes / 1048576)} MB.`,
      );
      status.textContent = "Arquivo recusado.";
      onChange(null);
      return;
    }
    validation.resolve();
    status.textContent = `${file.name} · ${Math.round(file.size / 1024)} KB · pronto para envio.`;
    objectUrl = URL.createObjectURL(file);
    preview.append(
      element("img", { src: objectUrl, alt: `Prévia de ${file.name}` }),
    );
    onChange(file);
  };
  input.addEventListener("change", () => receive(input.files?.[0]));
  const trigger = Button({
    label: "Escolher arquivo",
    variant: "outline",
    onClick: () => input.click(),
  });
  const drop = element("div", { class: "ui-upload-drop" }, [
    element("span", { class: "ui-upload-symbol", "aria-hidden": true }, "↑"),
    element("strong", {}, "Arraste uma imagem para cá"),
    element("span", {}, "ou selecione no dispositivo"),
    trigger,
    input,
  ]);
  drop.addEventListener("dragover", (e) => {
    e.preventDefault();
    drop.dataset.dragging = "true";
  });
  drop.addEventListener("dragleave", () => delete drop.dataset.dragging);
  drop.addEventListener("drop", (e) => {
    e.preventDefault();
    delete drop.dataset.dragging;
    receive(e.dataTransfer.files?.[0]);
  });
  const root = element("div", { class: "ui-upload" }, [
    element("label", { for: id }, label),
    drop,
    validation.element,
    status,
    preview,
  ]);
  root.control = input;
  root.dispose = clearPreview;
  return root;
}
