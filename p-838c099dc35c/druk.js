(() => {
  const byId = id => document.getElementById(id);
  const preview = byId('preview');
  const status = byId('status');
  const tilesMode = byId('mode-tiles');
  const cellSize = byId('cell-size');
  const includeLegend = byId('include-legend');
  const printButton = byId('print-button');
  const params = new URLSearchParams(location.search);
  const paperSizes = [
    { width: 210, height: 297, orientation: 'portrait' },
    { width: 297, height: 210, orientation: 'landscape' }
  ];
  const padding = 8;
  const headerHeight = 10;

  function element(tag, className, content) {
    const node = document.createElement(tag);
    if (className) node.className = className;
    if (content !== undefined) node.textContent = content;
    return node;
  }

  function addSheet(fragment, className) {
    const frame = element('div', 'sheet-frame');
    const sheet = element('div', `sheet ${className}`);
    frame.append(sheet);
    fragment.append(frame);
    return sheet;
  }

  function fitOnPaper(paper, image) {
    const scale = Math.min(
      (paper.width - 2 * padding) / image.naturalWidth,
      (paper.height - 2 * padding) / image.naturalHeight
    );
    return { paper, scale };
  }

  function tileLayout(paper, imageWidth, imageHeight, overlap) {
    const width = paper.width - 2 * padding;
    const height = paper.height - 2 * padding - headerHeight;
    const columns = Math.max(1, Math.ceil((imageWidth - overlap) / (width - overlap)));
    const rows = Math.max(1, Math.ceil((imageHeight - overlap) / (height - overlap)));
    return { paper, width, height, columns, rows, count: columns * rows };
  }

  function scaledImage(image, width, height) {
    const copy = image.cloneNode();
    copy.style.width = `${width}mm`;
    copy.style.height = `${height}mm`;
    return copy;
  }

  function tileHeader(name, layout, row, column) {
    const number = row * layout.columns + column + 1;
    const header = element('div', 'tile-header');
    header.append(element('span', '', `${name} · kartka ${number} z ${layout.count} (rząd ${row + 1}, kolumna ${column + 1})`));
    const map = element('div', 'tile-map');
    map.setAttribute('aria-hidden', 'true');
    const square = Math.min(2.2, (8 - (layout.rows - 1) * 0.25) / layout.rows);
    map.style.gridTemplateColumns = `repeat(${layout.columns}, ${square}mm)`;
    map.style.gridAutoRows = `${square}mm`;
    for (let i = 1; i <= layout.count; i += 1) {
      map.append(element('span', i === number ? 'current' : ''));
    }
    header.append(map);
    return header;
  }

  function addTiles(fragment, layout, image, imageWidth, imageHeight, overlap, name) {
    for (let row = 0; row < layout.rows; row += 1) {
      for (let column = 0; column < layout.columns; column += 1) {
        const x = column * (layout.width - overlap);
        const y = row * (layout.height - overlap);
        const sheet = addSheet(fragment, 'tile-sheet');
        const tile = element('div', 'tile');
        tile.style.width = `${Math.min(layout.width, imageWidth - x)}mm`;
        tile.style.height = `${Math.min(layout.height, imageHeight - y)}mm`;
        const copy = scaledImage(image, imageWidth, imageHeight);
        copy.alt = `Część wzoru — rząd ${row + 1}, kolumna ${column + 1}`;
        copy.style.left = `${-x}mm`;
        copy.style.top = `${-y}mm`;
        tile.append(copy);
        sheet.append(tileHeader(name, layout, row, column), tile);
      }
    }
  }

  function addLegend(fragment, pattern) {
    const sheet = addSheet(fragment, 'legend-sheet');
    const table = element('table');
    const headings = table.createTHead().insertRow();
    for (const label of ['Symbol', 'Kolor', 'DMC', 'Nazwa', 'Krzyżyki']) {
      const cell = element('th', '', label);
      cell.scope = 'col';
      headings.append(cell);
    }

    const body = table.createTBody();
    for (const color of pattern.colores) {
      const row = body.insertRow();
      row.insertCell().textContent = color.simbolo;
      const swatch = element('span', 'swatch');
      swatch.style.backgroundColor = color.hex;
      swatch.setAttribute('aria-label', color.nombre);
      swatch.setAttribute('role', 'img');
      row.insertCell().append(swatch);
      row.insertCell().textContent = color.dmc;
      row.insertCell().textContent = color.nombre;
      row.insertCell().textContent = color.cantidad;
    }
    if (pattern.contorno) {
      const cell = body.insertRow().insertCell();
      cell.colSpan = 5;
      cell.textContent = 'ścieg za igłą — DMC 310, jedna nitka';
    }

    const cm = new Intl.NumberFormat('pl-PL', { minimumFractionDigits: 1, maximumFractionDigits: 1 });
    const size = `${cm.format(pattern.ancho / 5.5)} × ${cm.format(pattern.alto / 5.5)} cm`;
    sheet.append(
      element('h2', '', 'Legenda kolorów'),
      element('h3', '', pattern.nombre),
      table,
      element('p', 'embroidery-size', `Rozmiar haftu na kanwie Aida 14: ${size} (${pattern.ancho} × ${pattern.alto} krzyżyków)`)
    );
  }

  function showError(message) {
    byId('pattern-name').textContent = message;
    document.title = message;
    status.hidden = true;
  }

  async function init() {
    const pattern = typeof DATA !== 'undefined' && DATA.find(item => item.id === params.get('id'));
    if (!pattern) {
      showError('Nie znaleziono wzoru');
      return;
    }

    byId('pattern-name').textContent = pattern.nombre;
    document.title = `Drukuj wzór · ${pattern.nombre}`;
    const image = new Image();
    image.alt = `Siatka wzoru ${pattern.nombre}`;
    image.src = pattern.rutas?.grilla || `img/${encodeURIComponent(pattern.id)}.jpg`;
    try {
      await image.decode();
    } catch {
      showError('Nie udało się wczytać wzoru');
      return;
    }

    tilesMode.checked = params.get('tryb') === 'duze';
    if (!tilesMode.checked) byId('mode-whole').checked = true;
    const requestedSize = params.get('mm');
    if ([...cellSize.options].some(option => option.value === requestedSize)) {
      cellSize.value = requestedSize;
    }
    includeLegend.checked = params.get('legenda') !== '0';

    let paper = paperSizes[0];
    function resizePreview() {
      const paperPixels = paper.width * 96 / 25.4;
      preview.style.setProperty('--preview-scale', Math.min(1, preview.clientWidth / paperPixels));
    }

    function render() {
      const fragment = document.createDocumentFragment();
      byId('tile-options').hidden = !tilesMode.checked;

      if (tilesMode.checked) {
        const overlap = Number(cellSize.value);
        const scale = overlap / pattern.celda_px;
        const width = image.naturalWidth * scale;
        const height = image.naturalHeight * scale;
        const layout = paperSizes
          .map(size => tileLayout(size, width, height, overlap))
          .reduce((best, next) => next.count < best.count ? next : best);

        paper = layout.paper;
        addTiles(fragment, layout, image, width, height, overlap, pattern.nombre);
        const total = layout.count + Number(includeLegend.checked);
        byId('sheet-count').value = `= ${total} kartek A4`;
      } else {
        const fit = paperSizes
          .map(size => fitOnPaper(size, image))
          .reduce((best, next) => next.scale > best.scale ? next : best);

        paper = fit.paper;
        const sheet = addSheet(fragment, 'whole-sheet');
        const copy = scaledImage(image, image.naturalWidth * fit.scale, image.naturalHeight * fit.scale);
        copy.className = 'whole-grid';
        sheet.append(copy);
      }

      if (includeLegend.checked) addLegend(fragment, pattern);
      document.documentElement.style.setProperty('--paper-width', `${paper.width}mm`);
      document.documentElement.style.setProperty('--paper-height', `${paper.height}mm`);
      byId('print-page').textContent = `@page { size: A4 ${paper.orientation}; margin: 0; }`;
      preview.replaceChildren(fragment);
      resizePreview();
    }

    status.hidden = true;
    byId('print-controls').hidden = false;
    byId('print-controls').addEventListener('change', render);
    printButton.addEventListener('click', () => window.print());
    new ResizeObserver(resizePreview).observe(preview);
    render();
    printButton.disabled = false;
  }

  init();
})();
