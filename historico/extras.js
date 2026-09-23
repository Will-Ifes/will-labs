(() => {
  const toast = message => {
    const region = document.getElementById('wl-global-status');
    region.textContent = message;
    clearTimeout(toast.timer);
    toast.timer = setTimeout(() => { region.textContent = ''; }, 4500);
  };
  const region = document.createElement('div');
  region.id = 'wl-global-status';
  region.setAttribute('role', 'status');
  region.style.cssText = 'position:fixed;right:16px;bottom:16px;z-index:50;max-width:min(360px,calc(100vw - 32px));padding:12px 16px;border-radius:8px;background:var(--wl-color-text-primary);color:var(--wl-color-surface-primary);box-shadow:0 8px 30px #0003';
  region.hidden = true;
  document.body.append(region);
  new MutationObserver(() => { region.hidden = !region.textContent.trim(); }).observe(region, { childList: true, characterData: true, subtree: true });
  document.querySelectorAll('[data-toast]').forEach(button => button.addEventListener('click', () => toast(button.dataset.toast)));

  document.querySelectorAll('[data-dialog]').forEach(button => button.addEventListener('click', () => {
    document.getElementById(button.dataset.dialog).showModal();
  }));
  document.querySelectorAll('[data-save-dialog]').forEach(button => button.addEventListener('click', () => {
    const dialog = button.closest('dialog');
    const input = dialog.querySelector('[required]');
    if (!input.checkValidity()) { input.reportValidity(); return; }
    dialog.close('saved'); toast('Alterações salvas nesta demonstração.');
  }));
  document.querySelectorAll('dialog.wl-dialog').forEach(dialog => dialog.addEventListener('close', () => {
    if (dialog.returnValue === 'archive') toast('Fluxo arquivado nesta demonstração.');
  }));
  document.querySelectorAll('.wl-menu-list button').forEach(button => button.addEventListener('click', () => { button.closest('details').open = false; }));
  document.querySelectorAll('.wl-menu').forEach(menu => menu.addEventListener('keydown', event => {
    if (event.key === 'Escape') { menu.open = false; menu.querySelector('summary').focus(); }
  }));

  const upload = document.getElementById('wl-file');
  const drop = document.getElementById('wl-drop');
  const uploadStatus = document.getElementById('wl-file-status');
  const preview = document.getElementById('wl-file-preview');
  let objectUrl;
  function receive(file) {
    preview.replaceChildren();
    if (objectUrl) { URL.revokeObjectURL(objectUrl); objectUrl = undefined; }
    if (!file) { uploadStatus.textContent = 'Nenhum arquivo escolhido.'; return; }
    if (!['image/png', 'image/jpeg', 'image/webp'].includes(file.type)) { uploadStatus.dataset.error = 'true'; uploadStatus.textContent = 'Formato inválido. Use PNG, JPG ou WebP.'; return; }
    if (file.size > 2 * 1024 * 1024) { uploadStatus.dataset.error = 'true'; uploadStatus.textContent = 'Arquivo acima de 2 MB. Escolha uma imagem menor.'; return; }
    uploadStatus.dataset.error = 'false';
    uploadStatus.textContent = `${file.name} (${(file.size / 1024).toFixed(0)} KB) pronto para envio. Nenhum arquivo foi enviado.`;
    objectUrl = URL.createObjectURL(file);
    const image = document.createElement('img'); image.src = objectUrl; image.alt = `Prévia de ${file.name}`; preview.append(image);
  }
  upload.addEventListener('change', () => receive(upload.files[0]));
  drop.addEventListener('dragover', event => { event.preventDefault(); drop.classList.add('is-over'); });
  drop.addEventListener('dragleave', () => drop.classList.remove('is-over'));
  drop.addEventListener('drop', event => { event.preventDefault(); drop.classList.remove('is-over'); receive(event.dataTransfer.files[0]); });
  window.addEventListener('pagehide', () => { if (objectUrl) URL.revokeObjectURL(objectUrl); });

  const dateInput = document.getElementById('wl-calendar-date');
  const monthTitle = document.getElementById('wl-month-title');
  const grid = document.getElementById('wl-calendar-grid');
  const selected = document.getElementById('wl-date-selected');
  const month = new Date(2026, 8, 1);
  function renderCalendar() {
    grid.replaceChildren();
    monthTitle.textContent = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(month);
    ['D', 'S', 'T', 'Q', 'Q', 'S', 'S'].forEach(day => { const label = document.createElement('span'); label.textContent = day; grid.append(label); });
    const offset = new Date(month.getFullYear(), month.getMonth(), 1).getDay();
    for (let i = 0; i < offset; i++) grid.append(document.createElement('span'));
    const days = new Date(month.getFullYear(), month.getMonth() + 1, 0).getDate();
    for (let day = 1; day <= days; day++) {
      const button = document.createElement('button'); button.type = 'button'; button.textContent = String(day);
      const iso = `${month.getFullYear()}-${String(month.getMonth() + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
      button.setAttribute('aria-label', new Intl.DateTimeFormat('pt-BR', { dateStyle: 'full' }).format(new Date(month.getFullYear(), month.getMonth(), day)));
      button.setAttribute('aria-pressed', String(dateInput.value === iso));
      button.addEventListener('click', () => { dateInput.value = iso; dateInput.dispatchEvent(new Event('change')); button.focus(); }); grid.append(button);
    }
  }
  dateInput.addEventListener('change', () => { selected.textContent = dateInput.value ? `Data selecionada: ${dateInput.value.split('-').reverse().join('/')}.` : 'Nenhuma data selecionada.'; if (dateInput.value) { const [year, mon] = dateInput.value.split('-').map(Number); month.setFullYear(year, mon - 1, 1); } renderCalendar(); });
  document.getElementById('wl-month-prev').addEventListener('click', () => { month.setMonth(month.getMonth() - 1); renderCalendar(); });
  document.getElementById('wl-month-next').addEventListener('click', () => { month.setMonth(month.getMonth() + 1); renderCalendar(); });
  renderCalendar();

  const collapse = document.getElementById('wl-collapse-trigger');
  collapse.addEventListener('click', () => { const open = collapse.getAttribute('aria-expanded') !== 'true'; collapse.setAttribute('aria-expanded', String(open)); collapse.textContent = open ? 'Ocultar opções avançadas' : 'Mostrar opções avançadas'; document.getElementById('wl-advanced').hidden = !open; });
  const labTabs = [...document.querySelectorAll('.wl-lab-tabs [role=tab]')];
  function activate(tab) { labTabs.forEach(item => { const on = item === tab; item.setAttribute('aria-selected', String(on)); item.tabIndex = on ? 0 : -1; document.getElementById(item.getAttribute('aria-controls')).hidden = !on; }); tab.focus(); }
  labTabs.forEach((tab, i) => { tab.addEventListener('click', () => activate(tab)); tab.addEventListener('keydown', event => { const key = event.key; let index = key === 'ArrowRight' ? (i + 1) % labTabs.length : key === 'ArrowLeft' ? (i + labTabs.length - 1) % labTabs.length : key === 'Home' ? 0 : key === 'End' ? labTabs.length - 1 : null; if (index !== null) { event.preventDefault(); activate(labTabs[index]); } }); });
  document.querySelectorAll('.wl-multi-search').forEach(search => {
    const view = search.closest('.ds-view');
    const shell = view.querySelector('[data-multi]');
    const labels = [...shell.querySelectorAll('fieldset label')];
    const count = view.querySelector('.wl-multi-count');
    function refresh() {
      const query = search.value.trim().toLocaleLowerCase('pt-BR');
      labels.forEach(label => { label.hidden = !label.textContent.toLocaleLowerCase('pt-BR').includes(query); });
      const visible = labels.filter(label => !label.hidden).length;
      const chosen = shell.querySelectorAll('input:checked').length;
      count.textContent = `${chosen} ${chosen === 1 ? 'selecionado' : 'selecionados'}; ${visible} ${visible === 1 ? 'opção disponível' : 'opções disponíveis'} para a busca.`;
    }
    search.addEventListener('input', refresh); shell.addEventListener('change', refresh);
    shell.addEventListener('click', event => { if (event.target.closest('.selected-tag button')) queueMicrotask(refresh); });
    refresh();
  });
})();
