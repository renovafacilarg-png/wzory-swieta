const COLLECTION_META = [
  {
    name: 'Boże Narodzenie',
    slug: 'boze-narodzenie',
    desc: 'Mikołaje, choinki, renifery, bałwanki i gwiazdy'
  },
  {
    name: 'Litery i monogramy',
    slug: 'litery-i-monogramy',
    desc: 'Alfabet z polskimi literami Ą Ć Ę Ł Ń Ó Ś Ź Ż, ramki i napisy'
  },
  {
    name: 'Wzory ludowe i kwiaty',
    slug: 'wzory-ludowe-i-kwiaty',
    desc: 'Motywy łowickie, kaszubskie i kwiatowe'
  },
  {
    name: 'Wyprawka dla maluszka',
    slug: 'wyprawka-dla-maluszka',
    desc: 'Śliniaczki, metryczki i pierwsze Święta'
  },
  {
    name: 'Ściereczki i kuchnia',
    slug: 'sciereczki-i-kuchnia',
    desc: 'Bordiury na ściereczki i dekoracje stołu'
  },
  {
    name: 'Motywy religijne',
    slug: 'motywy-religijne',
    desc: 'Szopka, aniołki i Święta Rodzina'
  }
];

const GIFTS = [
  {
    num: 1,
    title: 'Twój pierwszy haft krzyżykowy',
    badge: 'Dla początkujących',
    badgeClass: 'badge--green',
    desc: 'Jaka kanwa, ile nitek muliny i jak zacząć od środka krok po kroku.',
    panelId: 'panel-bonus-1'
  },
  {
    num: 2,
    title: '20 kartek i ozdób na Święta',
    badge: 'Na jeden wieczór',
    badgeClass: 'badge--green',
    desc: 'Małe projekty: kartki passe-partout, zawieszki z filcu i winietki na wigilijny stół.',
    filterGift2: true
  },
  {
    num: 3,
    title: 'Cennik haftu na zamówienie',
    badge: 'Kalkulator w aplikacji',
    badgeClass: 'badge--gold',
    desc: 'Policz uczciwą cenę: materiały, Twój czas i marża w złotówkach.',
    panelId: 'panel-bonus-3'
  },
  {
    num: 4,
    title: 'Plan do Wigilii',
    badge: 'Interaktywny plan',
    badgeClass: 'badge--green',
    desc: 'Co haftować tydzień po tygodniu do 24.12 z odhaczaną listą kroków.',
    panelId: 'panel-bonus-4'
  },
  {
    num: 5,
    title: 'Od haftu do prezentu',
    badge: 'TYLKO DO 30.11',
    badgeClass: 'badge--bf',
    bf: true,
    desc: '10 sposobów wykończenia (tamborek, ramka, bombka), pakowanie i etykiety do druku.'
  }
];

const PLAN_WEEKS = [
  {
    title: 'Dziś wieczorem · Przygotowanie',
    tasks: [
      { id: 'prep-1', text: 'Wypisz osoby, którym chcesz podarować haft.' },
      { id: 'prep-2', text: 'Wybierz wzory (zacznij od małych — filtr «Tylko na jeden wieczór»).' },
      { id: 'prep-3', text: 'Spisz kody muliny DMC i kup materiały za jednym razem.' }
    ]
  },
  {
    title: 'Tydzień 1 · 27 listopada – 3 grudnia',
    tasks: [
      { id: 'w1-1', text: 'Wyhaftuj 4–5 kartek świątecznych albo zawieszek z Prezentu 2.' },
      { id: 'w1-2', text: 'Jeśli to Twój pierwszy haft: zacznij od łatwej gwiazdki lub choinki.' }
    ]
  },
  {
    title: 'Tydzień 2 · 4–10 grudnia',
    tasks: [
      { id: 'w2-1', text: 'Wyhaftuj bombki z imionami wnuków i bliskich (lub użyj «Wyhaftuj imię»).' },
      { id: 'w2-2', text: 'Przygotuj winietki na wigilijny stół.' }
    ]
  },
  {
    title: 'Tydzień 3 · 11–17 grudnia',
    tasks: [
      { id: 'w3-1', text: 'Rozpocznij jeden większy haft (Mikołaj, szopka albo bordiura na ściereczkę).' },
      { id: 'w3-2', text: 'Haftuj po jednej dziesiątce kratek dziennie — do ok. 80% całości.' }
    ]
  },
  {
    title: 'Tydzień 4 · 18–23 grudnia',
    tasks: [
      { id: 'w4-1', text: 'Dokończ duży haft, upierz ręcznie i wyprasuj prace od spodu.' },
      { id: 'w4-2', text: 'Opraw hafty, zapakuj prezenty i przywiąż etykiety (Prezent 5).' }
    ]
  },
  {
    title: 'Lista zakupów',
    tasks: [
      { id: 'shop-1', text: 'Kanwa Aida 14 (biała lub kremowa)' },
      { id: 'shop-2', text: 'Mulina DMC według wybranych wzorów' },
      { id: 'shop-3', text: 'Igły do haftu nr 24 i tamborek 15–20 cm' },
      { id: 'shop-4', text: 'Ramki, bombki do wypełnienia, filc, wstążki lub kartki' }
    ]
  }
];

const PAGE_SIZE = 24;

const $ = selector => document.querySelector(selector);
const safe = value => String(value ?? '').replace(/[&<>"']/g, char =>
  ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[char]));

const formatCm = stitches => {
  const num = Number(stitches);
  if (!Number.isFinite(num) || num <= 0) return '—';
  return (num / 5.5).toFixed(1).replace('.', ',');
};

const formatCanvasCm = stitches => {
  const num = Number(stitches);
  if (!Number.isFinite(num) || num <= 0) return '—';
  return ((num / 5.5) + 10).toFixed(1).replace('.', ',');
};

const pluralWzor = count => {
  if (count === 1) return '1 wzór';
  const mod10 = count % 10;
  const mod100 = count % 100;
  if (mod10 >= 2 && mod10 <= 4 && (mod100 < 12 || mod100 > 14)) return `${count} wzory`;
  return `${count} wzorów`;
};

function parseDimensions(raw) {
  let ancho = Number(raw.ancho);
  let alto = Number(raw.alto);
  if ((!Number.isFinite(ancho) || !Number.isFinite(alto)) && typeof raw.tamaño === 'string') {
    const match = raw.tamaño.match(/(\d+)\D+(\d+)/);
    if (match) {
      ancho = Number(match[1]);
      alto = Number(match[2]);
    }
  }
  if ((!Number.isFinite(ancho) || !Number.isFinite(alto)) && typeof raw.tamano === 'string') {
    const match = raw.tamano.match(/(\d+)\D+(\d+)/);
    if (match) {
      ancho = Number(match[1]);
      alto = Number(match[2]);
    }
  }
  if (!Number.isFinite(ancho) && Array.isArray(raw.matriz) && raw.matriz[0]) ancho = raw.matriz[0].length;
  if (!Number.isFinite(alto) && Array.isArray(raw.matriz)) alto = raw.matriz.length;
  return {
    ancho: Number.isFinite(ancho) && ancho > 0 ? ancho : 0,
    alto: Number.isFinite(alto) && alto > 0 ? alto : 0
  };
}

function normalizePattern(raw, index) {
  if (!raw || typeof raw !== 'object') return null;
  const id = String(raw.id || `wzor-${index + 1}`);
  const { ancho, alto } = parseDimensions(raw);
  const rawLegend = Array.isArray(raw.colores) ? raw.colores : (Array.isArray(raw.legenda) ? raw.legenda : []);
  const colores = rawLegend.map(c => ({
    simbolo: c?.simbolo ?? '•',
    hex: c?.hex || '#cccccc',
    dmc: c?.dmc ?? '—',
    nombre: c?.nombre ?? '—',
    cantidad: Number.isFinite(Number(c?.cantidad)) ? Number(c.cantidad) : 0
  }));

  let total = Number(raw.total);
  if (!Number.isFinite(total) || total <= 0) {
    total = colores.reduce((sum, c) => sum + (c.cantidad || 0), 0);
  }
  if (!total && raw.conteo && typeof raw.conteo === 'object') {
    total = Object.values(raw.conteo).reduce((sum, v) => sum + (Number(v) || 0), 0);
  }

  const rutas = raw.rutas && typeof raw.rutas === 'object' ? raw.rutas : {};
  const gridSrc = rutas.grilla || raw.grilla || `img/${id}.jpg`;
  const hasPhoto = Boolean(raw.foto || rutas.foto);
  const thumbSrc = rutas.miniatura || rutas.thumb || raw.miniatura || (hasPhoto ? `img/${id}-foto.jpg` : gridSrc);
  const photoSrc = rutas.foto || (hasPhoto ? `img/${id}-foto.jpg` : '');
  const pdfSrc = rutas.pdf || raw.pdf || `pdf/${id}.pdf`;

  const nivelRaw = String(raw.nivel || '').trim().toLowerCase();
  const nivel = ['łatwy', 'średni', 'trudny'].includes(nivelRaw)
    ? nivelRaw
    : (total > 2500 ? 'trudny' : (total > 0 && total <= 1200 && colores.length <= 5 ? 'łatwy' : 'średni'));

  return {
    id,
    nombre: String(raw.nombre || id),
    coleccion: String(raw.coleccion || raw.colección || 'Boże Narodzenie'),
    nivel,
    ancho,
    alto,
    total,
    colores,
    contorno: Boolean(raw.contorno),
    gridSrc,
    thumbSrc,
    photoSrc,
    pdfSrc
  };
}

const PATTERNS = (typeof DATA !== 'undefined' && Array.isArray(DATA))
  ? DATA.map(normalizePattern).filter(Boolean)
  : [];

const DATA_COLLECTIONS = (typeof COLECCIONES !== 'undefined' && Array.isArray(COLECCIONES))
  ? COLECCIONES
  : [];

const DATA_BONOS = (typeof BONOS !== 'undefined' && BONOS && typeof BONOS === 'object')
  ? BONOS
  : {};

function isDone(id) {
  return localStorage.getItem('swk_done_' + id) === '1' || localStorage.getItem('done-' + id) === '1';
}

function setDone(id, value) {
  localStorage.setItem('swk_done_' + id, value ? '1' : '0');
  localStorage.setItem('done-' + id, value ? '1' : '0');
}

function isFav(id) {
  return localStorage.getItem('swk_fav_' + id) === '1';
}

function setFav(id, value) {
  localStorage.setItem('swk_fav_' + id, value ? '1' : '0');
}

let visibleLimit = PAGE_SIZE;

function setupPwaInstall() {
  if ('serviceWorker' in navigator && location.protocol.startsWith('http')) {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  }

  const installButton = $('#install-app');
  const installStatus = $('#install-status');
  if (!installButton || !installStatus) return;

  const supportsWebInstall = typeof Navigator !== 'undefined' && typeof Navigator.prototype.install === 'function';
  let deferredInstallPrompt;

  if (supportsWebInstall) {
    installButton.hidden = false;
  }

  window.addEventListener('beforeinstallprompt', event => {
    event.preventDefault();
    deferredInstallPrompt = event;
    if (!supportsWebInstall) {
      installButton.hidden = false;
    }
  });

  window.addEventListener('appinstalled', () => {
    deferredInstallPrompt = undefined;
    installButton.hidden = true;
    installStatus.textContent = 'Aplikacja została dodana do ekranu głównego.';
  });

  installButton.addEventListener('click', async () => {
    if (installButton.getAttribute('aria-disabled') === 'true') return;
    installButton.setAttribute('aria-disabled', 'true');

    try {
      if (supportsWebInstall) {
        await navigator.install();
        installStatus.textContent = 'Aplikacja została zainstalowana lub otwarta.';
        installButton.hidden = true;
      } else if (deferredInstallPrompt) {
        const promptEvent = deferredInstallPrompt;
        deferredInstallPrompt = undefined;
        await promptEvent.prompt();
        const { outcome } = await promptEvent.userChoice;
        installStatus.textContent = outcome === 'accepted'
          ? 'Aplikacja została zainstalowana.'
          : 'Instalacja została przerwana — możesz spróbować ponownie poniżej.';
        if (!deferredInstallPrompt) {
          installButton.hidden = true;
        }
      }
    } catch (error) {
      if (error && error.name === 'AbortError') {
        installStatus.textContent = 'Instalacja została przerwana — możesz spróbować ponownie.';
      } else {
        installStatus.textContent = 'Użyj instrukcji dla swojego telefonu poniżej.';
      }
    } finally {
      installButton.removeAttribute('aria-disabled');
    }
  });
}

function updateHeroStats() {
  const doneCount = PATTERNS.filter(p => isDone(p.id)).length;
  const favCount = PATTERNS.filter(p => isFav(p.id)).length;
  const parts = [`Dostępne teraz: ${pluralWzor(PATTERNS.length)}`];
  if (favCount) parts.push(`Ulubione: ${favCount}`);
  if (doneCount) parts.push(`Zrobione: ${doneCount}`);
  $('#hero-stats').textContent = parts.join(' · ');
}

function renderCollections() {
  const countsByName = new Map();
  PATTERNS.forEach(p => {
    countsByName.set(p.coleccion, (countsByName.get(p.coleccion) || 0) + 1);
  });

  const dataColByName = new Map(DATA_COLLECTIONS.map(c => [c.nombre, c]));

  const eyebrow = $('#collections-eyebrow');
  if (eyebrow) {
    eyebrow.textContent = `${COLLECTION_META.length} KOLEKCJI DO HAFTOWANIA`;
  }

  $('#collections').innerHTML = COLLECTION_META.map(col => {
    const dataCol = dataColByName.get(col.name);
    const realCount = dataCol ? Number(dataCol.cantidad) : (countsByName.get(col.name) || 0);
    const countLabel = realCount > 0 ? pluralWzor(realCount) : 'w przygotowaniu';
    const pdfHref = (dataCol && dataCol.pdf) ? dataCol.pdf : `pdf/kolekcja-${col.slug}.pdf`;
    return `<article class="collection">
      <div>
        <div class="collection-head">
          <h3>${safe(col.name)}</h3>
          <span class="collection-count">${safe(countLabel)}</span>
        </div>
        <p class="collection-desc">${safe(col.desc)}</p>
      </div>
      <div class="collection-actions">
        <button type="button" class="btn btn-creme btn-sm" data-filter-col="${safe(col.name)}">Przeglądaj wzory</button>
        <a class="btn btn-sm" href="${safe(pdfHref)}" download>Cała kolekcja (PDF)</a>
      </div>
    </article>`;
  }).join('');

  const select = $('#collection');
  COLLECTION_META.forEach(col => {
    const dataCol = dataColByName.get(col.name);
    const realCount = dataCol ? Number(dataCol.cantidad) : (countsByName.get(col.name) || 0);
    const option = document.createElement('option');
    option.value = col.name;
    option.textContent = realCount > 0 ? `${col.name} (${realCount})` : col.name;
    select.appendChild(option);
  });

  const bonus2Count = countsByName.get('Bonus 2') || 0;
  if (bonus2Count > 0) {
    const option = document.createElement('option');
    option.value = 'Bonus 2';
    option.textContent = `Prezent 2 · 20 kartek i ozdób (${bonus2Count})`;
    select.appendChild(option);
  }

  document.querySelectorAll('[data-filter-col]').forEach(btn => {
    btn.addEventListener('click', () => {
      resetAllFilters({ skipRender: true });
      $('#collection').value = btn.dataset.filterCol;
      visibleLimit = PAGE_SIZE;
      renderPatterns();
      $('#wzory').scrollIntoView({ behavior: 'smooth' });
    });
  });
}

function getFilteredPatterns() {
  const query = $('#search-name').value.trim().toLocaleLowerCase('pl-PL');
  const col = $('#collection').value;
  const level = $('#level').value;
  const oneEvening = $('#one-evening').checked;
  const onlyFav = $('#only-fav').checked;
  const onlyDone = $('#only-done').checked;

  return PATTERNS.filter(p => {
    if (col && p.coleccion !== col) return false;
    if (level && p.nivel !== level) return false;
    if (query && !p.nombre.toLocaleLowerCase('pl-PL').includes(query)) return false;
    if (oneEvening && (!p.total || p.total > 900)) return false;
    if (onlyFav && !isFav(p.id)) return false;
    if (onlyDone && !isDone(p.id)) return false;
    return true;
  });
}

function hasActiveFilters() {
  return Boolean(
    $('#search-name').value.trim() ||
    $('#collection').value ||
    $('#level').value ||
    $('#one-evening').checked ||
    $('#only-fav').checked ||
    $('#only-done').checked
  );
}

function resetAllFilters(opts = {}) {
  $('#search-name').value = '';
  $('#collection').value = '';
  $('#level').value = '';
  $('#one-evening').checked = false;
  $('#only-fav').checked = false;
  $('#only-done').checked = false;
  visibleLimit = PAGE_SIZE;
  if (!opts.skipRender) renderPatterns();
}

function renderPatterns() {
  const filtered = getFilteredPatterns();
  const visible = filtered.slice(0, visibleLimit);

  $('#reset-filters').hidden = !hasActiveFilters();
  $('#empty').hidden = filtered.length > 0;

  if (filtered.length === 0) {
    $('#results-count').textContent = 'Brak pasujących wzorów.';
  } else if (visible.length < filtered.length) {
    $('#results-count').textContent = `Pokazano ${visible.length} z ${filtered.length} wzorów`;
  } else {
    $('#results-count').textContent = `Znaleziono: ${pluralWzor(filtered.length)}`;
  }

  $('#cards').innerHTML = visible.map((p, idx) => {
    const fav = isFav(p.id);
    const done = isDone(p.id);
    const evening = p.total > 0 && p.total <= 900;
    const sizeText = p.ancho && p.alto
      ? `${p.ancho} × ${p.alto} krzyżyków · ${formatCm(p.ancho)} × ${formatCm(p.alto)} cm`
      : 'Wzór do druku A4';

    return `<article class="card">
      <div class="card-media">
        <img class="thumb" src="${safe(p.thumbSrc)}" alt="${safe(p.nombre)}" loading="${idx < 8 ? 'eager' : 'lazy'}" decoding="async" data-fallback="${safe(p.gridSrc)}">
        <button type="button" class="card-fav-btn" data-fav-id="${safe(p.id)}" aria-pressed="${fav}" aria-label="${fav ? 'Usuń z ulubionych' : 'Dodaj do ulubionych'}: ${safe(p.nombre)}">${fav ? '♥' : '♡'}</button>
        ${done ? '<span class="card-done-badge">Zrobione ✓</span>' : ''}
      </div>
      <div class="card-body">
        <h3>${safe(p.nombre)}</h3>
        <p class="card-meta">${safe(sizeText)}</p>
        <div class="card-tags">
          <span class="tag ${p.nivel === 'łatwy' ? 'tag--easy' : ''}">${safe(p.nivel)}</span>
          ${evening ? '<span class="tag tag--evening">1 wieczór</span>' : ''}
        </div>
        <button type="button" class="btn btn-sm card-open-btn" data-open-id="${safe(p.id)}">Otwórz wzór</button>
      </div>
    </article>`;
  }).join('');

  $('#cards').querySelectorAll('img.thumb').forEach(img => {
    img.addEventListener('error', () => {
      if (img.dataset.fallback && img.src !== img.dataset.fallback) {
        img.src = img.dataset.fallback;
      }
    }, { once: true });
  });

  $('#cards').querySelectorAll('[data-open-id]').forEach(btn => {
    btn.addEventListener('click', () => openPattern(btn.dataset.openId));
  });

  $('#cards').querySelectorAll('[data-fav-id]').forEach(btn => {
    btn.addEventListener('click', () => {
      const id = btn.dataset.favId;
      const next = !isFav(id);
      setFav(id, next);
      updateHeroStats();
      renderPatterns();
    });
  });

  const remaining = filtered.length - visible.length;
  $('#load-more-wrap').hidden = remaining <= 0;
  if (remaining > 0) {
    const nextBatch = Math.min(PAGE_SIZE, remaining);
    $('#load-more').textContent = `Pokaż kolejne ${nextBatch} wzorów (pozostało ${remaining})`;
  }
}

function openPattern(id) {
  const pattern = PATTERNS.find(p => p.id === id);
  if (!pattern) return;

  let done = isDone(id);
  let fav = isFav(id);

  $('#detail-title').textContent = pattern.nombre;
  $('#detail-meta').textContent = [
    pattern.coleccion === 'Bonus 2' ? 'Prezent 2 · 20 kartek i ozdób' : pattern.coleccion,
    `poziom: ${pattern.nivel}`,
    pattern.total ? `${pattern.total} krzyżyków` : ''
  ].filter(Boolean).join(' · ');

  const rows = pattern.colores.map(c =>
    `<tr>
      <td>${safe(c.simbolo)}</td>
      <td><i class="swatch" style="background:${safe(c.hex)}" aria-hidden="true"></i></td>
      <td>${safe(c.dmc)}</td>
      <td>${safe(c.nombre)}</td>
      <td>${c.cantidad || '—'}</td>
    </tr>`
  ).join('');

  const contourRow = pattern.contorno
    ? '<tr><td>—</td><td><i class="swatch" style="background:#1a1a1a" aria-hidden="true"></i></td><td>310</td><td>Ścieg za igłą (kontur)</td><td>—</td></tr>'
    : '';

  const sizeInfo = pattern.ancho && pattern.alto
    ? `<strong>Rozmiar haftu na kanwie Aida 14:</strong> ${formatCm(pattern.ancho)} × ${formatCm(pattern.alto)} cm (${pattern.ancho} × ${pattern.alto} krzyżyków).<br>Przytnij kawałek kanwy ok. <strong>${formatCanvasCm(pattern.ancho)} × ${formatCanvasCm(pattern.alto)} cm</strong> (z zapasem po 5 cm z każdej strony).`
    : 'Wzór gotowy do druku na zwykłej kartce A4.';

  const viewTabs = pattern.photoSrc
    ? `<div class="view-tabs" role="group" aria-label="Widok wzoru">
        <button type="button" class="btn btn-sm" id="tab-grid">Siatka wzoru</button>
        <button type="button" class="btn btn-creme btn-sm" id="tab-photo">Zdjęcie haftu</button>
      </div>`
    : '';

  const printLink = `<a class="btn" href="druk.html?id=${encodeURIComponent(id)}">Drukuj wzór (A4 lub większe kratki)</a>`;

  $('#detailBody').innerHTML = `
    <div class="dialog-actions-bar">
      <button type="button" id="modal-done" class="btn btn-creme btn-sm" aria-pressed="${done}">
        ${done ? 'Zrobione ✓' : 'Oznacz jako zrobione ✓'}
      </button>
      <button type="button" id="modal-fav" class="btn btn-creme btn-sm" aria-pressed="${fav}">
        ${fav ? 'W ulubionych ♥' : 'Dodaj do ulubionych ♥'}
      </button>
    </div>

    <div class="dialog-size-box">${sizeInfo}</div>

    <div class="dialog-actions-bar">${printLink}</div>

    ${viewTabs}

    <div class="zoom-controls">
      <button type="button" id="zoomOut" class="btn btn-creme btn-sm" aria-label="Pomniejsz siatkę">−</button>
      <span class="zoom-level" id="zoomLevel">100%</span>
      <button type="button" id="zoomIn" class="btn btn-creme btn-sm" aria-label="Powiększ siatkę">+</button>
      <button type="button" id="zoomReset" class="btn btn-creme btn-sm">Dopasuj</button>
      <span class="zoom-hint">Rozsuń dwa palce lub użyj przycisków + / −.</span>
    </div>

    <div class="zoom" id="zoomViewport">
      <img id="zoomImg" src="${safe(pattern.gridSrc)}" alt="Siatka wzoru ${safe(pattern.nombre)}" draggable="false">
    </div>

    <h2 id="legend-title">Legenda kolorów</h2>
    <div class="table-wrap" tabindex="0" role="region" aria-labelledby="legend-title">
      <table>
        <caption class="visually-hidden">Lista kolorów muliny DMC dla wzoru ${safe(pattern.nombre)}</caption>
        <thead>
          <tr>
            <th scope="col">Symbol</th>
            <th scope="col">Kolor</th>
            <th scope="col">DMC</th>
            <th scope="col">Nazwa</th>
            <th scope="col">Krzyżyki</th>
          </tr>
        </thead>
        <tbody>${rows || '<tr><td colspan="5">Brak danych legendy w podglądzie.</td></tr>'}${contourRow}</tbody>
      </table>
    </div>

    <div class="dialog-actions-bar">
      ${printLink}
      <a class="btn btn-creme" href="${safe(pattern.pdfSrc)}" download>Pobierz PDF do druku</a>
    </div>
  `;

  const viewport = $('#zoomViewport');
  const image = $('#zoomImg');
  let scale = 1;

  function setZoom(value) {
    scale = Math.max(1, Math.min(4, value));
    image.style.width = (scale * 100).toFixed(0) + '%';
    $('#zoomLevel').textContent = Math.round(scale * 100) + '%';
  }

  $('#zoomIn').onclick = () => setZoom(scale * 1.25);
  $('#zoomOut').onclick = () => setZoom(scale / 1.25);
  $('#zoomReset').onclick = () => {
    setZoom(1);
    viewport.scrollTo(0, 0);
  };

  if (pattern.photoSrc) {
    const tabGrid = $('#tab-grid');
    const tabPhoto = $('#tab-photo');
    tabGrid.onclick = () => {
      image.src = pattern.gridSrc;
      image.alt = `Siatka wzoru ${pattern.nombre}`;
      tabGrid.classList.remove('btn-creme');
      tabPhoto.classList.add('btn-creme');
      setZoom(1);
    };
    tabPhoto.onclick = () => {
      image.src = pattern.photoSrc;
      image.alt = `Gotowy haft ${pattern.nombre}`;
      tabPhoto.classList.remove('btn-creme');
      tabGrid.classList.add('btn-creme');
      setZoom(1);
    };
  }

  let startDistance = 0;
  let startScale = 1;
  viewport.addEventListener('touchstart', event => {
    if (event.touches.length === 2) {
      startDistance = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY
      );
      startScale = scale;
    }
  }, { passive: true });

  viewport.addEventListener('touchmove', event => {
    if (event.touches.length === 2 && startDistance) {
      event.preventDefault();
      const distance = Math.hypot(
        event.touches[0].clientX - event.touches[1].clientX,
        event.touches[0].clientY - event.touches[1].clientY
      );
      setZoom(startScale * distance / startDistance);
    }
  }, { passive: false });

  viewport.addEventListener('touchend', () => {
    startDistance = 0;
  });

  $('#modal-done').onclick = () => {
    done = !done;
    setDone(id, done);
    $('#modal-done').setAttribute('aria-pressed', String(done));
    $('#modal-done').textContent = done ? 'Zrobione ✓' : 'Oznacz jako zrobione ✓';
    updateHeroStats();
    renderPatterns();
  };

  $('#modal-fav').onclick = () => {
    fav = !fav;
    setFav(id, fav);
    $('#modal-fav').setAttribute('aria-pressed', String(fav));
    $('#modal-fav').textContent = fav ? 'W ulubionych ♥' : 'Dodaj do ulubionych ♥';
    updateHeroStats();
    renderPatterns();
  };

  $('#detail').showModal();
}

function setupDialog() {
  const dialog = $('#detail');
  $('#detail-close').addEventListener('click', () => dialog.close());
  dialog.addEventListener('close', () => {
    dialog.returnValue = '';
  });

  if (!('closedBy' in HTMLDialogElement.prototype)) {
    const outside = (e, dlg) => {
      const r = dlg.getBoundingClientRect();
      return e.clientX < r.left || e.clientX > r.right || e.clientY < r.top || e.clientY > r.bottom;
    };
    let pressedOutside = false;
    dialog.addEventListener('pointerdown', e => {
      pressedOutside = outside(e, dialog);
    });
    dialog.addEventListener('pointerup', e => {
      if (pressedOutside && outside(e, dialog)) dialog.close();
    });
  }
}

function renderGifts() {
  $('#gifts').innerHTML = GIFTS.map(g => {
    const bonusInfo = DATA_BONOS[String(g.num)] || {};
    const htmlHref = bonusInfo.html || `bonus-${g.num}.html`;
    const pdfHref = bonusInfo.pdf || `pdf/bonus-${g.num}.pdf`;

    const openLink = g.panelId
      ? `<a class="btn btn-creme btn-sm" href="#${g.panelId}">Otwórz tutaj</a>`
      : (g.filterGift2
        ? `<button type="button" class="btn btn-creme btn-sm" id="gift-2-evening">Pokaż małe wzory</button>`
        : `<a class="btn btn-creme btn-sm" href="${safe(htmlHref)}">Czytaj poradnik</a>`);

    return `<article class="gift ${g.bf ? 'gift--bf' : ''}">
      <div>
        <div class="gift-top">
          <span class="badge ${g.badgeClass}">Prezent ${g.num} · ${safe(g.badge)}</span>
        </div>
        <h3>${safe(g.title)}</h3>
        <p>${safe(g.desc)}</p>
      </div>
      <div class="gift-actions">
        ${openLink}
        <a class="btn btn-sm" href="${safe(pdfHref)}" download>Pobierz PDF</a>
      </div>
    </article>`;
  }).join('');

  const bonusHtml = (typeof BONUS_HTML !== 'undefined' && BONUS_HTML)
    ? BONUS_HTML
    : '<p>Pełny poradnik otworzysz przyciskiem «Otwórz stronę» lub pobierzesz w PDF.</p>';
  $('#bonus-content').innerHTML = bonusHtml;

  const gift2Btn = $('#gift-2-evening');
  if (gift2Btn) {
    gift2Btn.addEventListener('click', () => {
      resetAllFilters({ skipRender: true });
      const hasBonus2 = PATTERNS.some(p => p.coleccion === 'Bonus 2');
      if (hasBonus2) {
        $('#collection').value = 'Bonus 2';
      } else {
        $('#one-evening').checked = true;
      }
      renderPatterns();
      $('#wzory').scrollIntoView({ behavior: 'smooth' });
    });
  }

  document.querySelectorAll('[data-open-bonus="1"]').forEach(link => {
    link.addEventListener('click', () => {
      $('#bonus-1-details').open = true;
    });
  });
}

function setupCalculator() {
  const fields = {
    kanwa: $('#calc-kanwa'),
    motki: $('#calc-motki'),
    cenaMotka: $('#calc-cena-motka'),
    oprawa: $('#calc-oprawa'),
    godziny: $('#calc-godziny'),
    stawka: $('#calc-stawka'),
    marza: $('#calc-marza')
  };

  const formatZl = value => `${Math.round(value)} zł`;

  function updateCalc() {
    const val = el => Math.max(0, Number(el.value) || 0);
    const mat = val(fields.kanwa) + val(fields.motki) * val(fields.cenaMotka) + val(fields.oprawa);
    const czas = val(fields.godziny) * val(fields.stawka);
    const marzaPct = val(fields.marza);
    const marzaVal = (mat + czas) * (marzaPct / 100);
    const total = mat + czas + marzaVal;

    $('#res-mat').textContent = formatZl(mat);
    $('#res-czas').textContent = formatZl(czas);
    $('#res-marza').textContent = formatZl(marzaVal);
    $('#res-total').textContent = formatZl(total);
  }

  Object.values(fields).forEach(input => input.addEventListener('input', updateCalc));

  $('#calc-example').addEventListener('click', () => {
    fields.kanwa.value = 5;
    fields.motki.value = 5;
    fields.cenaMotka.value = 4;
    fields.oprawa.value = 12;
    fields.godziny.value = 9;
    fields.stawka.value = 15;
    fields.marza.value = 15;
    updateCalc();
  });

  $('#calc-zero').addEventListener('click', () => {
    Object.values(fields).forEach(el => {
      el.value = el === fields.cenaMotka ? 4 : 0;
    });
    updateCalc();
  });

  updateCalc();
}

function setupWeeklyPlan() {
  const STORAGE_KEY = 'swk_plan_v1';
  let saved = {};
  try {
    saved = JSON.parse(localStorage.getItem(STORAGE_KEY) || '{}') || {};
  } catch {
    saved = {};
  }

  const now = new Date();
  const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
  let wigilia = new Date(now.getFullYear(), 11, 24);
  if (today > wigilia) wigilia = new Date(now.getFullYear() + 1, 11, 24);
  const diffDays = Math.round((wigilia - today) / 86400000);
  $('#wigilia-countdown').textContent = diffDays === 0
    ? 'Dziś Wigilia! Wesołych Świąt!'
    : `Do Wigilii (24.12) zostało: ${diffDays} dni`;

  $('#plan-weeks').innerHTML = PLAN_WEEKS.map(week => `
    <div class="plan-week">
      <h4>${safe(week.title)}</h4>
      ${week.tasks.map(task => `
        <label class="plan-task">
          <input type="checkbox" data-plan-id="${safe(task.id)}" ${saved[task.id] ? 'checked' : ''}>
          <span>${safe(task.text)}</span>
        </label>
      `).join('')}
    </div>
  `).join('');

  const checkboxes = Array.from(document.querySelectorAll('[data-plan-id]'));

  function updateProgress() {
    const total = checkboxes.length;
    const done = checkboxes.filter(cb => cb.checked).length;
    const pct = total ? Math.round((done / total) * 100) : 0;
    $('#plan-progress').value = pct;
    $('#plan-progress-label').textContent = `Ukończono: ${done} z ${total}`;
  }

  checkboxes.forEach(cb => {
    cb.addEventListener('change', () => {
      saved[cb.dataset.planId] = cb.checked;
      localStorage.setItem(STORAGE_KEY, JSON.stringify(saved));
      updateProgress();
    });
  });

  $('#plan-reset').addEventListener('click', () => {
    saved = {};
    localStorage.setItem(STORAGE_KEY, '{}');
    checkboxes.forEach(cb => {
      cb.checked = false;
    });
    updateProgress();
  });

  updateProgress();
}

const G = {
  A: ['01110', '10001', '10001', '11111', '10001', '10001', '10001'],
  B: ['11110', '10001', '10001', '11110', '10001', '10001', '11110'],
  C: ['01111', '10000', '10000', '10000', '10000', '10000', '01111'],
  D: ['11110', '10001', '10001', '10001', '10001', '10001', '11110'],
  E: ['11111', '10000', '10000', '11110', '10000', '10000', '11111'],
  F: ['11111', '10000', '10000', '11110', '10000', '10000', '10000'],
  G: ['01111', '10000', '10000', '10111', '10001', '10001', '01111'],
  H: ['10001', '10001', '10001', '11111', '10001', '10001', '10001'],
  I: ['11111', '00100', '00100', '00100', '00100', '00100', '11111'],
  J: ['00111', '00010', '00010', '00010', '10010', '10010', '01100'],
  K: ['10001', '10010', '10100', '11000', '10100', '10010', '10001'],
  L: ['10000', '10000', '10000', '10000', '10000', '10000', '11111'],
  M: ['10001', '11011', '10101', '10101', '10001', '10001', '10001'],
  N: ['10001', '11001', '10101', '10011', '10001', '10001', '10001'],
  O: ['01110', '10001', '10001', '10001', '10001', '10001', '01110'],
  P: ['11110', '10001', '10001', '11110', '10000', '10000', '10000'],
  Q: ['01110', '10001', '10001', '10001', '10101', '10010', '01101'],
  R: ['11110', '10001', '10001', '11110', '10100', '10010', '10001'],
  S: ['01111', '10000', '10000', '01110', '00001', '00001', '11110'],
  T: ['11111', '00100', '00100', '00100', '00100', '00100', '00100'],
  U: ['10001', '10001', '10001', '10001', '10001', '10001', '01110'],
  V: ['10001', '10001', '10001', '10001', '10001', '01010', '00100'],
  W: ['10001', '10001', '10001', '10101', '10101', '10101', '01010'],
  X: ['10001', '10001', '01010', '00100', '01010', '10001', '10001'],
  Y: ['10001', '10001', '01010', '00100', '00100', '00100', '00100'],
  Z: ['11111', '00001', '00010', '00100', '01000', '10000', '11111']
};

function glyph(ch) {
  const accents = { 'Ć': 'C', 'Ń': 'N', 'Ó': 'O', 'Ś': 'S', 'Ź': 'Z', 'Ż': 'Z' };
  const base = accents[ch] || ({ 'Ą': 'A', 'Ę': 'E', 'Ł': 'L' }[ch]) || ch;
  if (!G[base]) return null;
  const a = ['0000000', ...G[base].map(r => '0' + r + '0'), '0000000'];
  if (accents[ch]) a[0] = ch === 'Ż' ? '0001000' : '0000100';
  if (ch === 'Ą' || ch === 'Ę') {
    a[7] = '0' + G[base][6] + '0';
    a[8] = '0000110';
  }
  if (ch === 'Ł') {
    a[3] = '0011000';
    a[4] = '0110000';
  }
  return a;
}

function drawNameGrid() {
  const text = $('#name').value.toLocaleUpperCase('pl-PL').normalize('NFC');
  const threadColor = $('#name-color').value || '#861d30';
  const bad = [...text].filter(c => c !== ' ' && !glyph(c));
  $('#err').textContent = bad.length
    ? 'Niedostępny znak: ' + [...new Set(bad)].join(', ')
    : 'Jedna kratka to jeden krzyżyk. Gruba linia co 10 kratek.';

  const cv = $('#canvas');
  const s = 18;
  const w = Math.max(10, text.length * 8 + 2);
  const h = 13;
  cv.width = w * s + 1;
  cv.height = h * s + 1;
  cv.style.width = text.length <= 8 ? '100%' : `${Math.round(cv.width * 0.65)}px`;

  const ctx = cv.getContext('2d');
  ctx.fillStyle = '#fff';
  ctx.fillRect(0, 0, cv.width, cv.height);

  [...text].forEach((ch, i) => {
    const g = glyph(ch);
    if (!g) return;
    g.forEach((row, y) => [...row].forEach((v, x) => {
      if (v === '1') {
        ctx.fillStyle = threadColor;
        ctx.fillRect((i * 8 + x + 1) * s, (y + 2) * s, s, s);
        ctx.strokeStyle = '#fff';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo((i * 8 + x + 1) * s + 4, (y + 2) * s + 4);
        ctx.lineTo((i * 8 + x + 2) * s - 4, (y + 3) * s - 4);
        ctx.moveTo((i * 8 + x + 2) * s - 4, (y + 2) * s + 4);
        ctx.lineTo((i * 8 + x + 1) * s + 4, (y + 3) * s - 4);
        ctx.stroke();
      }
    }));
  });

  for (let x = 0; x <= w; x++) {
    ctx.strokeStyle = x % 10 ? '#d6cbbd' : '#706151';
    ctx.lineWidth = x % 10 ? 1 : 2;
    ctx.beginPath();
    ctx.moveTo(x * s + 0.5, 0);
    ctx.lineTo(x * s + 0.5, h * s);
    ctx.stroke();
  }
  for (let y = 0; y <= h; y++) {
    ctx.strokeStyle = y % 10 ? '#d6cbbd' : '#706151';
    ctx.lineWidth = y % 10 ? 1 : 2;
    ctx.beginPath();
    ctx.moveTo(0, y * s + 0.5);
    ctx.lineTo(w * s, y * s + 0.5);
    ctx.stroke();
  }

  $('#name-size').textContent = `Rozmiar siatki: ${w} × ${h} krzyżyków (ok. ${formatCm(w)} × ${formatCm(h)} cm na kanwie Aida 14)`;
}

function setupNameTool() {
  $('#name').addEventListener('input', drawNameGrid);
  $('#name-color').addEventListener('change', drawNameGrid);
  document.querySelectorAll('[data-name]').forEach(btn => {
    btn.addEventListener('click', () => {
      $('#name').value = btn.dataset.name;
      drawNameGrid();
    });
  });
  $('#download').addEventListener('click', () => {
    const a = document.createElement('a');
    a.download = 'wzor-imie.png';
    a.href = $('#canvas').toDataURL('image/png');
    a.click();
  });
  drawNameGrid();
}

function init() {
  setupPwaInstall();
  updateHeroStats();
  renderCollections();
  renderPatterns();
  renderGifts();
  setupDialog();
  setupCalculator();
  setupWeeklyPlan();
  setupNameTool();

  $('#search-name').addEventListener('input', () => {
    visibleLimit = PAGE_SIZE;
    renderPatterns();
  });
  $('#collection').addEventListener('change', () => {
    visibleLimit = PAGE_SIZE;
    renderPatterns();
  });
  $('#level').addEventListener('change', () => {
    visibleLimit = PAGE_SIZE;
    renderPatterns();
  });
  ['#one-evening', '#only-fav', '#only-done'].forEach(sel => {
    $(sel).addEventListener('change', () => {
      visibleLimit = PAGE_SIZE;
      renderPatterns();
    });
  });

  $('#reset-filters').addEventListener('click', () => resetAllFilters());
  $('#empty-reset').addEventListener('click', () => resetAllFilters());
  $('#load-more').addEventListener('click', () => {
    visibleLimit += PAGE_SIZE;
    renderPatterns();
  });

  $('#btn-quick-easy').addEventListener('click', () => {
    resetAllFilters({ skipRender: true });
    $('#level').value = 'łatwy';
    $('#one-evening').checked = true;
    renderPatterns();
    $('#wzory').scrollIntoView({ behavior: 'smooth' });
  });

  $('#filters-form').addEventListener('submit', e => e.preventDefault());
}

init();
