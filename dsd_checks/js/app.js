// Lingua corrente: impostata inline nella pagina prima di questo script
// window.LANG = 'it' | 'en' ; default 'it'
const LANG = (window.LANG === 'en') ? 'en' : 'it';

// L'ordine e le chiavi dei pasti restano in italiano perche' devono
// corrispondere esattamente alla colonna "Pasto" del foglio Excel.
const MEAL_ORDER = ["Colazione", "Pranzo", "Spuntino", "Cena"];

const MEAL_LABELS = {
  "Colazione": { it: "Colazione", en: "Breakfast" },
  "Pranzo":    { it: "Pranzo",    en: "Lunch" },
  "Spuntino":  { it: "Spuntino",  en: "Snack" },
  "Cena":      { it: "Cena",      en: "Dinner" }
};

// Chiavi normalizzate (senza accenti) -> etichetta per lingua
const DAY_LABELS = {
  "lunedi":    { it: "Lunedì",    en: "Monday" },
  "martedi":   { it: "Martedì",   en: "Tuesday" },
  "mercoledi": { it: "Mercoledì", en: "Wednesday" },
  "giovedi":   { it: "Giovedì",   en: "Thursday" },
  "venerdi":   { it: "Venerdì",   en: "Friday" },
  "sabato":    { it: "Sabato",    en: "Saturday" },
  "domenica":  { it: "Domenica",  en: "Sunday" }
};

const STRINGS = {
  it: {
    searching: "Ricerca di dati.xlsx in corso…",
    loadedFrom: (name) => `Dati caricati da ${name}.`,
    readError: (msg) => `Errore nella lettura del file: ${msg}`,
    notFound: "dati.xlsx non trovato in questa cartella — carica un file manualmente.",
    invalidRows: "Il file è stato letto ma non contiene righe valide.",
    emptyTitle: "Nessun dato caricato",
    emptyText: 'Carica il tuo file Excel per vedere il diario, oppure metti <code>dati.xlsx</code> nella stessa cartella di questa pagina.',
    avgBloodSugar: "media Zucchero Nel Sangue",
    bloodsugar: "Zucchero Nel Sangue",
    ketones: "Chetoni",
    notLogged: "Non ancora registrato",
    noPhoto: "Nessuna foto",
    photoUnavailable: "Immagine non disponibile",
    daily: "Giornaliera",
    preMeal: "Pre-pasto",
    unitInsulin: "UI",
    dateLocale: "it-IT",
    prevWeek: "Settimana precedente",
    nextWeek: "Settimana successiva",
    weekWord: "Settimana",
    ofWord: "di"
  },
  en: {
    searching: "Looking for dati.xlsx…",
    loadedFrom: (name) => `Data loaded from ${name}.`,
    readError: (msg) => `Error reading the file: ${msg}`,
    notFound: "dati.xlsx not found in this folder — upload a file manually.",
    invalidRows: "The file was read but contains no valid rows.",
    emptyTitle: "No data loaded",
    emptyText: 'Upload your Excel file to see the log, or place <code>dati.xlsx</code> in the same folder as this page.',
    avgBloodSugar: "avg Blood Sugar",
    bloodsugar: "Blood Sugar",
    ketones: "Ketones",
    notLogged: "Not logged yet",
    noPhoto: "No photo",
    photoUnavailable: "Image unavailable",
    daily: "Daily",
    preMeal: "Pre-meal",
    unitInsulin: "IU",
    dateLocale: "en-GB",
    prevWeek: "Previous week",
    nextWeek: "Next week",
    weekWord: "Week",
    ofWord: "of"
  }
};
const T = STRINGS[LANG];

const statusLine = document.getElementById('statusLine');
const main = document.getElementById('main');
const emptyState = document.getElementById('emptyState');
const weekStrip = document.getElementById('weekStrip');
const pagination = document.getElementById('pagination');

const PAGE_SIZE = 7; // giorni per pagina/settimana
let ALL_DAYS = [];
let currentPage = 0;

emptyState.querySelector('.empty-title').textContent = T.emptyTitle;
emptyState.querySelector('.empty-text').innerHTML = T.emptyText;
statusLine.textContent = T.searching;

function normalizeKey(str){
  return (str || "").toString().trim().toLowerCase()
    .normalize("NFD").replace(/[\u0300-\u036f]/g, ""); // rimuove accenti
}

function translateDay(giorno){
  const key = normalizeKey(giorno);
  return (DAY_LABELS[key] && DAY_LABELS[key][LANG]) || giorno;
}

function translateMeal(mealKey){
  return (MEAL_LABELS[mealKey] && MEAL_LABELS[mealKey][LANG]) || mealKey;
}

function parseItDate(val){
  if(val === null || val === undefined || val === "") return null;
  if(val instanceof Date) return new Date(val.getFullYear(), val.getMonth(), val.getDate());
  if(typeof val === "number"){
    // numero seriale Excel (giorni dal 30/12/1899)
    const ms = Math.round((val - 25569) * 86400 * 1000);
    const d = new Date(ms);
    return new Date(d.getUTCFullYear(), d.getUTCMonth(), d.getUTCDate());
  }
  const parts = String(val).split(/[\/\-]/);
  if(parts.length !== 3) return null;
  const [d,m,y] = parts.map(n => parseInt(n,10));
  if(!d || !m || !y) return null;
  return new Date(y, m-1, d);
}

function bloodsugarClass(v){
  if(v === null || v === undefined || v === "") return null;
  const n = Number(v);
  if(isNaN(n)) return null;
  if(n < 0.4) return "low";
  if(n <= 10) return "normal";
  if(n <= 12) return "watch";
  return "alert";
}

function fmtDate(dateObj){
  if(!dateObj) return "";
  return dateObj.toLocaleDateString(T.dateLocale,{day:'2-digit',month:'2-digit',year:'numeric'});
}

function buildFromRows(rows){
  const days = new Map(); // key: dateKey -> {dateObj, giorno, meals: {mealName: row}}

  rows.forEach(r => {
    const dateObj = parseItDate(r["Data"]);
    const giorno = (r["Giorno"] || "").toString().trim();
    const pasto = (r["Pasto"] || "").toString().trim();
    if(!dateObj || !pasto) return;
    const key = dateObj.toISOString().slice(0,10);
    if(!days.has(key)) days.set(key, {dateObj, giorno, meals:{}});
    days.get(key).meals[pasto] = r;
  });

  const sortedKeys = Array.from(days.keys()).sort();
  if(sortedKeys.length === 0){
    emptyState.style.display = "block";
    statusLine.textContent = T.invalidRows;
    ALL_DAYS = [];
    main.innerHTML = "";
    weekStrip.innerHTML = "";
    pagination.innerHTML = "";
    return;
  }
  emptyState.style.display = "none";
  ALL_DAYS = sortedKeys.map(key => ({ key, ...days.get(key) }));

  // pagina di default: quella che contiene oggi, altrimenti la piu' vicina
  const todayKey = new Date().toISOString().slice(0,10);
  let idx = ALL_DAYS.findIndex(d => d.key === todayKey);
  if(idx === -1){
    idx = (ALL_DAYS[ALL_DAYS.length - 1].key < todayKey) ? ALL_DAYS.length - 1 : 0;
  }
  renderPage(Math.floor(idx / PAGE_SIZE));
}

function renderPage(pageIndex){
  const totalPages = Math.max(1, Math.ceil(ALL_DAYS.length / PAGE_SIZE));
  currentPage = Math.max(0, Math.min(pageIndex, totalPages - 1));

  main.innerHTML = "";
  weekStrip.innerHTML = "";

  const start = currentPage * PAGE_SIZE;
  const slice = ALL_DAYS.slice(start, start + PAGE_SIZE);
  slice.forEach(day => {
    renderDaySection(day.key, day);
    renderDayTab(day.key, day);
  });

  renderPagination(totalPages);
}

function renderPagination(totalPages){
  const start = currentPage * PAGE_SIZE;
  const end = Math.min(start + PAGE_SIZE, ALL_DAYS.length) - 1;
  const first = ALL_DAYS[start];
  const last = ALL_DAYS[end];
  const range = (first && last) ? `${fmtDate(first.dateObj)} – ${fmtDate(last.dateObj)}` : '';

  pagination.innerHTML = `
    <button class="btn page-btn" id="prevWeekBtn" ${currentPage <= 0 ? 'disabled' : ''}>&larr; ${T.prevWeek}</button>
    <span class="page-label">
      ${T.weekWord}
      <input type="number" class="week-input" id="weekInput" min="1" max="${totalPages}" value="${currentPage + 1}" aria-label="${T.weekWord}">
      ${T.ofWord} ${totalPages}${range ? ' · ' + range : ''}
    </span>
    <button class="btn page-btn" id="nextWeekBtn" ${currentPage >= totalPages - 1 ? 'disabled' : ''}>${T.nextWeek} &rarr;</button>
  `;

  document.getElementById('prevWeekBtn').addEventListener('click', () => {
    renderPage(currentPage - 1);
    main.scrollIntoView({behavior:'smooth', block:'start'});
  });
  document.getElementById('nextWeekBtn').addEventListener('click', () => {
    renderPage(currentPage + 1);
    main.scrollIntoView({behavior:'smooth', block:'start'});
  });

  const weekInput = document.getElementById('weekInput');
  const jumpToInput = () => {
    let n = parseInt(weekInput.value, 10);
    if(isNaN(n)) n = currentPage + 1;
    n = Math.max(1, Math.min(n, totalPages));
    renderPage(n - 1);
    main.scrollIntoView({behavior:'smooth', block:'start'});
  };
  weekInput.addEventListener('change', jumpToInput);
  weekInput.addEventListener('keydown', (e) => {
    if(e.key === 'Enter'){ e.preventDefault(); jumpToInput(); }
  });
  weekInput.addEventListener('focus', () => weekInput.select());
}

function dayStatus(day){
  const glucValues = Object.values(day.meals)
    .map(r => Number(r["Zucchero Nel Sangue (mmol/L)"]))
    .filter(n => !isNaN(n));
  if(glucValues.length === 0) return "none";
  if(glucValues.some(v => v > 11)) return "alert";
  if(glucValues.some(v => v > 10 || v < 0.4)) return "watch";
  return "ok";
}

function renderDayTab(key, day){
  const btn = document.createElement('button');
  btn.className = 'day-tab';
  const dayLabel = translateDay(day.giorno);
  btn.innerHTML = `<span class="stamp ${dayStatus(day)}"></span> ${dayLabel.slice(0,3)} ${fmtDate(day.dateObj).slice(0,5)}`;
  btn.addEventListener('click', () => {
    document.getElementById('day-'+key).scrollIntoView({behavior:'smooth', block:'start'});
  });
  weekStrip.appendChild(btn);
}

function renderDaySection(key, day){
  const section = document.createElement('section');
  section.className = 'day-section';
  section.id = 'day-'+key;

  const glucValues = Object.values(day.meals)
    .map(r => Number(r["Zucchero Nel Sangue (mmol/L)"]))
    .filter(n => !isNaN(n));
  const avg = glucValues.length 
  ? Number((glucValues.reduce((a,b)=>a+b,0)/glucValues.length).toFixed(2)) : null;

  section.innerHTML = `
    <div class="day-head">
      <h2>${translateDay(day.giorno) || (LANG==='it'?'Giorno':'Day')}</h2>
      <span class="day-date">${fmtDate(day.dateObj)}</span>
      ${avg !== null ? `<span class="day-avg">${T.avgBloodSugar} <b>${avg}</b> mmol/L</span>` : ''}
    </div>
    <div class="meals-grid"></div>
  `;

  const grid = section.querySelector('.meals-grid');
  MEAL_ORDER.forEach(mealKey => {
    const row = day.meals[mealKey];
    grid.appendChild(renderMealCard(mealKey, row));
  });

  main.appendChild(section);
}

function renderMealCard(mealKey, row){
  const card = document.createElement('div');
  const hasData = row && (row["Zucchero Nel Sangue (mmol/L)"] || row["Descrizione Pasto"] || row["Foto Pasto (URL)"]);
  const mealLabel = translateMeal(mealKey);

  if(!hasData){
    card.className = 'meal-card empty';
    card.innerHTML = `
      <div class="meal-top"><span class="meal-name">${mealLabel}</span></div>
      <span class="no-photo">${T.notLogged}</span>
    `;
    return card;
  }

  card.className = 'meal-card';
  const gClass = bloodsugarClass(row["Zucchero Nel Sangue (mmol/L)"]) || 'normal';
  const gVal = row["Zucchero Nel Sangue (mmol/L)"] ?? '—';
  const kVal = row["Chetoni (mmol/L)"] ?? '—';
  const orario = row["Orario"] ?? '';
  const insDaily = row["Insulina Giornaliera (UI)"] ?? '—';
  const insPre = row["Insulina Pre-Pasto (UI)"] ?? '—';
  const foto = (row["Foto Pasto (URL)"] || '').toString().trim();
  const descr = (row["Descrizione Pasto"] || '').toString().trim();

  card.innerHTML = `
    <div class="meal-top">
      <span class="meal-name">${mealLabel}</span>
      <span class="meal-time">${orario}</span>
    </div>
    <div class="readings">
      <div class="reading">
        <span class="reading-label">${T.bloodsugar}</span>
        <span class="reading-value ${gClass}">${gVal}<span class="unit">mmol/L</span></span>
      </div>
      <div class="reading">
        <span class="reading-label">${T.ketones}</span>
        <span class="reading-value normal">${kVal}<span class="unit">mmol/L</span></span>
      </div>
    </div>
    ${foto ? `<img class="meal-photo" src="${foto}" alt="${mealLabel}" loading="lazy">` : `<span class="no-photo">${T.noPhoto}</span>`}
    ${descr ? `<p class="meal-desc">${descr}</p>` : ''}
    <div class="insulin-row">
      <span>${T.daily} <b>${insDaily}</b> ${T.unitInsulin}</span>
      <span>${T.preMeal} <b>${insPre}</b> ${T.unitInsulin}</span>
    </div>
  `;

  const img = card.querySelector('.meal-photo');
  if(img){
    img.addEventListener('click', () => openLightbox(foto));
    img.addEventListener('error', () => {
      const span = document.createElement('span');
      span.className = 'no-photo';
      span.textContent = T.photoUnavailable;
      img.replaceWith(span);
    });
  }

  return card;
}

function openLightbox(src){
  const lb = document.getElementById('lightbox');
  document.getElementById('lightboxImg').src = src;
  lb.classList.add('open');
}
document.getElementById('lightbox').addEventListener('click', function(){
  this.classList.remove('open');
});

function handleWorkbook(wb){
  const sheetName = wb.SheetNames.find(n => n.toLowerCase() === 'diario') || wb.SheetNames[0];
  const sheet = wb.Sheets[sheetName];
  const rows = XLSX.utils.sheet_to_json(sheet, {defval:""});
  buildFromRows(rows);
}

function loadFromArrayBuffer(buf, sourceLabel){
  try{
    const wb = XLSX.read(buf, {type:'array', cellDates:true});
    handleWorkbook(wb);
    statusLine.textContent = T.loadedFrom(sourceLabel);
  }catch(e){
    statusLine.textContent = T.readError(e.message);
  }
}

// tentativo automatico di caricare ../dati.xlsx (il file resta nella cartella radice del sito)
fetch('../dati.xlsx')
  .then(r => { if(!r.ok) throw new Error('not found'); return r.arrayBuffer(); })
  .then(buf => loadFromArrayBuffer(buf, 'dati.xlsx'))
  .catch(() => {
    statusLine.textContent = T.notFound;
  });

document.getElementById('uploadBtn').addEventListener('click', () => {
  document.getElementById('fileInput').click();
});
document.getElementById('fileInput').addEventListener('change', (e) => {
  const file = e.target.files[0];
  if(!file) return;
  const reader = new FileReader();
  reader.onload = (ev) => loadFromArrayBuffer(ev.target.result, file.name);
  reader.readAsArrayBuffer(file);
});
