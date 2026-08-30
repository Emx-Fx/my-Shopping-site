/* =========================================================
   SUPABASE CONFIG
   Fill these in from your Supabase project: Dashboard ->
   Project Settings -> API -> "Project URL" and "anon public" key.
   Until you fill these in, device requests are only saved to
   this browser's local storage (see SAFE STORAGE below) — safe
   to leave blank while you're still building.
   ========================================================= */
const SUPABASE_URL = 'https://lsikcdyhuldgwdlvtjfy.supabase.co';
const SUPABASE_ANON_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImxzaWtjZHlodWxkZ3dkbHZ0amZ5Iiwicm9sZSI6ImFub24iLCJpYXQiOjE3ODUwODY1OTksImV4cCI6MjEwMDY2MjU5OX0.vU0WU6gpMlWniv694-OfOWTPvpWPCnF0iefN7iP2M_o';
let supabaseClient = null;
if(SUPABASE_URL && SUPABASE_ANON_KEY && window.supabase){
  supabaseClient = window.supabase.createClient(SUPABASE_URL, SUPABASE_ANON_KEY);
}

/* =========================================================
   SAFE STORAGE
   Some browsers (Safari on file:// pages, sandboxed/private modes,
   strict cookie settings) block localStorage entirely and throw when
   it's touched. This wrapper never throws — it falls back to an
   in-memory store for the current page load so the site keeps working
   even when persistence isn't available.
   ========================================================= */
const memoryStore = {};
const safeStorage = {
  get(key){
    try{ return localStorage.getItem(key); }
    catch(e){ return (key in memoryStore) ? memoryStore[key] : null; }
  },
  set(key, value){
    try{ localStorage.setItem(key, value); }
    catch(e){ memoryStore[key] = String(value); }
  },
  remove(key){
    try{ localStorage.removeItem(key); }
    catch(e){ delete memoryStore[key]; }
  }
};

/* =========================================================
   DEVICE ICONS (blueprint schematic line-art per category)
   ========================================================= */
const ICONS = {
  laptop:`<path d="M4 8h16v9H4z"/><path d="M2 19h20l-1.5 2h-17z"/><path d="M9 4h6l1 4H8z"/>`,
  phone:`<rect x="7" y="2" width="10" height="20" rx="2"/><path d="M10 5h4M12 18v.01"/>`,
  headphones:`<path d="M4 14v-2a8 8 0 0 1 16 0v2"/><rect x="2" y="14" width="5" height="7" rx="1.5"/><rect x="17" y="14" width="5" height="7" rx="1.5"/>`,
  watch:`<rect x="7" y="6" width="10" height="12" rx="3"/><path d="M9 6V3h6v3M9 18v3h6v-3M11 10v3l2 1"/>`,
  tablet:`<rect x="5" y="2" width="14" height="20" rx="2"/><path d="M12 18v.01"/>`,
  camera:`<path d="M3 7h4l2-3h6l2 3h4v13H3z"/><circle cx="12" cy="13" r="4"/><path d="M6 7v-1"/>`,
  speaker:`<rect x="6" y="2" width="12" height="20" rx="2"/><circle cx="12" cy="8" r="2.2"/><circle cx="12" cy="15" r="3.4"/>`,
  earbuds:`<path d="M6 10v5a3 3 0 0 0 3 3"/><path d="M18 10v5a3 3 0 0 1-3 3"/><rect x="4" y="6" width="4" height="6" rx="2"/><rect x="16" y="6" width="4" height="6" rx="2"/><rect x="6" y="17" width="3" height="4" rx="1.4"/><rect x="15" y="17" width="3" height="4" rx="1.4"/>`
};
function iconSVG(cat, stroke){
  return `<svg viewBox="0 0 24 24" fill="none" stroke="${stroke||'currentColor'}" stroke-width="1.3" stroke-linecap="round" stroke-linejoin="round">${ICONS[cat]||ICONS.phone}</svg>`;
}
const TINTS = [
  ['#182238','#5b7cff'], ['#132a26','#00e6a3'], ['#2a1f38','#b98aff'],
  ['#301c1c','#ff8a6b'], ['#1c2a33','#4dd0e1'], ['#2a2418','#ffb84d']
];
function mediaBG(seed){
  const t = TINTS[seed % TINTS.length];
  return `background:radial-gradient(circle at 30% 20%, ${t[0]}, #0e131f 75%); color:${t[1]};`;
}

/* =========================================================
   PRODUCT DATA
   ========================================================= */
const PRODUCTS = [
 {id:1,cat:'laptop',brand:'Nova',name:'Nova Slate 14 Pro',price:1499,rating:4.7,reviews:812,colors:['#c9ccd1','#2b2f36','#8a6a4a'],specs:['14in OLED','32GB RAM','1TB SSD','M-series chip'],desc:"A featherweight aluminum-unibody laptop built for people who live in fifteen tabs at once. The 14-inch OLED panel hits true blacks and the fanless chip barely gets warm.",tag:'trending'},
 {id:2,cat:'laptop',brand:'Kadence',name:'Kadence Air 13',price:999,rating:4.4,reviews:530,colors:['#e8e8e8','#1c1c1e'],specs:['13in IPS','16GB RAM','512GB SSD','18h battery'],desc:"The everyday driver. Kadence Air trims the extras and keeps the essentials: all-day battery, a keyboard people actually praise, and a chassis thin enough to forget it's there.",tag:'recommended'},
 {id:3,cat:'laptop',brand:'Forge',name:'Forge Blade 16 RTX',price:2199,rating:4.6,reviews:298,colors:['#0f0f10','#4a1010'],specs:['16in 240Hz','64GB RAM','2TB SSD','RTX 4080'],desc:"A creator-and-gamer hybrid with a 240Hz display and enough GPU headroom to render while you still play at high frame rates. Runs hot under load — the cooling is loud but effective.",tag:'trending'},
 {id:4,cat:'laptop',brand:'Nova',name:'Nova Slate 12 Go',price:749,rating:4.2,reviews:410,colors:['#c9ccd1','#7ea6ff'],specs:['12in LCD','8GB RAM','256GB SSD','Fanless'],desc:"The budget Slate: same design language, a smaller footprint, and a chip tuned for browsing, docs, and video calls rather than heavy lifting.",tag:'recommended'},

 {id:5,cat:'phone',brand:'Orbis',name:'Orbis Halo 16 Pro',price:1199,oldPrice:1199,rating:4.8,reviews:2140,colors:['#1c1c1e','#e3d5c0','#2b3a55','#7a1f2b'],specs:['6.7in OLED 120Hz','256GB','5G','Triple camera'],desc:"The flagship. A titanium frame wraps a 120Hz OLED panel and a camera system that shoots usable low-light photos handheld. This is the phone the rest of the lineup is judged against.",tag:'trending'},
 {id:6,cat:'phone',brand:'Orbis',name:'Orbis Halo 16 Pro Max',price:1399,rating:4.8,reviews:1870,colors:['#1c1c1e','#7a1f2b'],specs:['6.9in OLED 120Hz','512GB','5G','Periscope zoom'],desc:"Halo 16 Pro's bigger sibling, with a periscope lens for real optical zoom and a battery that comfortably clears a full day of heavy use.",tag:'trending'},
 {id:7,cat:'phone',brand:'Vex',name:'Vex Ion 5G',price:649,rating:4.3,reviews:960,colors:['#2b3a55','#dcdde0','#4a2b6b'],specs:['6.4in OLED 90Hz','128GB','5G','Dual camera'],desc:"Vex Ion undercuts the flagships on price without gutting the display — a 90Hz OLED panel and a genuinely fast chip for the money.",tag:'recommended'},
 {id:8,cat:'phone',brand:'Fennix',name:'Fennix Pixel S',price:899,rating:4.5,reviews:1210,colors:['#e3d5c0','#3a3a3c','#5b8a72'],specs:['6.2in OLED','256GB','5G','Computational camera'],desc:"Fennix leans entirely on software: the camera processing turns a modest sensor into some of the most consistent daylight and night shots in this price range.",tag:'recommended'},

 {id:9,cat:'headphones',brand:'Reso',name:'Reso Aura ANC',price:349,rating:4.6,reviews:1540,colors:['#1c1c1e','#c9ccd1','#7a1f2b'],specs:['ANC -35dB','40h battery','Bluetooth 5.3','Multipoint'],desc:"Reso Aura's noise cancelling flattens engine drone on flights without the hollow-ear pressure feeling some ANC headphones give. Forty hours of playback, real world.",tag:'trending'},
 {id:10,cat:'headphones',brand:'Tonal',name:'Tonal Wave 2',price:229,rating:4.4,reviews:880,colors:['#2b3a55','#e8e8e8'],specs:['ANC -28dB','30h battery','Bluetooth 5.2','USB-C audio'],desc:"A comfortable, well-tuned all-rounder — not the deepest bass in the category, but the most balanced, and light enough to wear through a full workday.",tag:'recommended'},

 {id:11,cat:'earbuds',brand:'Reso',name:'Reso Pebble Pro',price:199,rating:4.5,reviews:2010,colors:['#e8e8e8','#1c1c1e'],specs:['ANC','8h + 24h case','Wireless charging','IPX4'],desc:"Reso's earbuds shrink the Aura's noise cancelling into a stem-style bud that seals well for most ear shapes and survives a light rain run.",tag:'trending'},
 {id:12,cat:'earbuds',brand:'Vex',name:'Vex Bud Air',price:99,rating:4.1,reviews:640,colors:['#dcdde0'],specs:['No ANC','6h + 20h case','Bluetooth 5.1','IPX4'],desc:"An honest budget bud: no active noise cancelling, but clear mids and a case that tops up fast when you're rushing out the door.",tag:'recommended'},

 {id:13,cat:'watch',brand:'Orbis',name:'Orbis Pulse Watch',price:399,rating:4.5,reviews:1330,colors:['#1c1c1e','#c9ccd1','#7a1f2b'],specs:['1.9in AMOLED','GPS + Cellular','18h battery','ECG sensor'],desc:"Tracks the essentials plus an on-wrist ECG, in a case thin enough to sleep in for the sleep-tracking to actually make sense.",tag:'trending'},
 {id:14,cat:'watch',brand:'Fennix',name:'Fennix Loop SE',price:229,rating:4.3,reviews:710,colors:['#5b8a72','#2b3a55'],specs:['1.6in OLED','GPS','5 day battery','Heart rate'],desc:"Fennix Loop trades cellular and ECG for battery life — five days between charges is the headline, and it delivers on it.",tag:'recommended'},

 {id:15,cat:'tablet',brand:'Kadence',name:'Kadence Canvas 11',price:799,rating:4.6,reviews:640,colors:['#e8e8e8','#1c1c1e'],specs:['11in Liquid Retina','256GB','Stylus support','10h battery'],desc:"A genuinely good note-taking and sketching tablet — low-latency stylus input and a matte-finish screen option that feels closer to paper.",tag:'trending'},
 {id:16,cat:'tablet',brand:'Vex',name:'Vex Slate Mini 8',price:349,rating:4.2,reviews:390,colors:['#2b3a55'],specs:['8.3in LCD','128GB','Compact','12h battery'],desc:"The one-handed tablet — small enough for reading on a commute, still capable enough for video calls and light browsing.",tag:'recommended'},

 {id:17,cat:'camera',brand:'Forge',name:'Forge Aperture X1',price:1899,rating:4.7,reviews:270,colors:['#0f0f10'],specs:['33MP full-frame','8K video','5-axis stabilization','Weather sealed'],desc:"A hybrid stills-and-video body that holds its own against dedicated cinema cameras for anything shot handheld, with stabilization that rescues shaky footage.",tag:'trending'},
 {id:18,cat:'camera',brand:'Nova',name:'Nova Frame Compact',price:649,rating:4.3,reviews:180,colors:['#c9ccd1','#0f0f10'],specs:['24MP APS-C','4K video','3x optical zoom','Pocketable'],desc:"A real camera that still fits in a jacket pocket — the sensor is a size up from a phone's, and it shows in low light.",tag:'recommended'},

 {id:19,cat:'speaker',brand:'Tonal',name:'Tonal Boom Mini',price:129,rating:4.2,reviews:920,colors:['#1c1c1e','#7a1f2b','#2b3a55'],specs:['360° sound','12h battery','IP67','Bluetooth 5.3'],desc:"A pool-and-patio speaker that survives being splashed and dunked, with enough low end that people ask what's playing it.",tag:'trending'},
 {id:20,cat:'speaker',brand:'Reso',name:'Reso Column Home',price:299,rating:4.4,reviews:410,colors:['#e8e8e8','#1c1c1e'],specs:['Room-filling','Wi-Fi + Bluetooth','Voice assistant','Multi-room'],desc:"Built for one room to sound as good as it can rather than portability — pairs with other Reso Column units for whole-home audio.",tag:'recommended'},
];
// mark flash sale items (40% off) — a subset across categories
const FLASH_IDS = [5,9,13,17,3,20];
PRODUCTS.forEach(p=>{
  if(FLASH_IDS.includes(p.id)){ p.oldPrice = p.price; p.price = Math.round(p.price*0.6); p.flash = true; }
});

const RECENT_SEARCH_PLACEHOLDERS = ["iPhone 16 Pro","noise cancelling headphones","gaming laptop","smartwatch with GPS","4K camera","wireless earbuds"];

/* =========================================================
   STATE
   ========================================================= */
let state = {
  country: 'United States',
  currency: 'USD',
  cart: JSON.parse(safeStorage.get('gt_cart')||'[]'),
  user: JSON.parse(safeStorage.get('gt_user')||'null'),
  currentProduct: null,
  selectedColorIdx: 0,
  activeThumb: 0,
  lastQuery: ''
};
try{
  state.country = safeStorage.get('gt_country') || guessCountry();
  state.currency = safeStorage.get('gt_currency') || 'USD';
}catch(e){}

function guessCountry(){
  try{
    const tz = Intl.DateTimeFormat().resolvedOptions().timeZone || '';
    const map = {
      'America/Toronto':'Canada','America/Vancouver':'Canada','America/Edmonton':'Canada',
      'America/New_York':'United States','America/Los_Angeles':'United States','America/Chicago':'United States','America/Denver':'United States',
      'Europe/London':'United Kingdom','Europe/Paris':'France','Europe/Berlin':'Germany','Europe/Madrid':'Spain','Europe/Rome':'Italy',
      'Africa/Dakar':'Senegal','Africa/Lagos':'Nigeria','Africa/Johannesburg':'South Africa','Africa/Cairo':'Egypt',
      'Asia/Tokyo':'Japan','Asia/Dubai':'United Arab Emirates','Asia/Kolkata':'India','Asia/Singapore':'Singapore',
      'Australia/Sydney':'Australia'
    };
    return map[tz] || 'United States';
  }catch(e){ return 'United States'; }
}

const COUNTRIES = ["United States","Canada","United Kingdom","France","Germany","Spain","Italy","Senegal","Nigeria","South Africa","Egypt","Japan","United Arab Emirates","India","Singapore","Australia","Mexico","Brazil"];
const CURRENCIES = [
  {code:'USD',symbol:'$',rate:1},
  {code:'CAD',symbol:'CA$',rate:1.36},
  {code:'EUR',symbol:'€',rate:0.92},
  {code:'GBP',symbol:'£',rate:0.79},
  {code:'JPY',symbol:'¥',rate:157},
  {code:'AUD',symbol:'A$',rate:1.51},
];

function fmtPrice(usd){
  const c = CURRENCIES.find(c=>c.code===state.currency) || CURRENCIES[0];
  const val = usd * c.rate;
  const decimals = c.code === 'JPY' ? 0 : 2;
  return c.symbol + val.toLocaleString(undefined,{minimumFractionDigits:decimals, maximumFractionDigits:decimals});
}
function stars(rating){
  const full = Math.round(rating);
  return '★'.repeat(full) + '☆'.repeat(5-full);
}

/* =========================================================
   NAV: country / currency dropdowns
   ========================================================= */
function buildCountryPanel(){
  const el = document.getElementById('countryPanel');
  el.innerHTML = COUNTRIES.map(c=>`<div class="dropdown-opt ${c===state.country?'selected':''}" onclick="setCountry('${c.replace(/'/g,"\\'")}')">${c}</div>`).join('');
}
function buildCurrencyPanel(){
  const el = document.getElementById('currencyPanel');
  el.innerHTML = CURRENCIES.map(c=>`<div class="dropdown-opt ${c.code===state.currency?'selected':''}" onclick="setCurrency('${c.code}')"><span>${c.code}</span><span class="code">${c.symbol}</span></div>`).join('');
}
function setCountry(c){
  state.country = c; safeStorage.set('gt_country', c);
  document.getElementById('countryLabel').textContent = c;
  closeAllOverlays(); buildCountryPanel();
  showToast(`Delivery set to ${c}`);
}
function setCurrency(code){
  state.currency = code; safeStorage.set('gt_currency', code);
  document.getElementById('currencyLabel').textContent = code;
  closeAllOverlays(); buildCurrencyPanel();
  renderAll();
  showToast(`Prices now shown in ${code}`);
}
function toggleDropdown(id){
  const panel = document.getElementById(id);
  const isHidden = panel.classList.contains('hide');
  document.querySelectorAll('.dropdown-panel').forEach(p=>p.classList.add('hide'));
  document.getElementById('suggestPanel').classList.add('hide');
  if(isHidden) panel.classList.remove('hide');
}
document.addEventListener('click', (e)=>{
  if(!e.target.closest('.dropdown')){ document.querySelectorAll('.dropdown-panel').forEach(p=>p.classList.add('hide')); }
  if(!e.target.closest('.search-wrap')){ document.getElementById('suggestPanel').classList.add('hide'); }
});

/* =========================================================
   SEARCH
   ========================================================= */
const searchInput = document.getElementById('searchInput');
let placeholderIdx = 0;
setInterval(()=>{
  if(document.activeElement !== searchInput && searchInput.value === ''){
    placeholderIdx = (placeholderIdx+1) % RECENT_SEARCH_PLACEHOLDERS.length;
    searchInput.placeholder = 'Recently searched: ' + RECENT_SEARCH_PLACEHOLDERS[placeholderIdx];
  }
}, 2600);
searchInput.placeholder = 'Recently searched: ' + RECENT_SEARCH_PLACEHOLDERS[0];

function tokenize(q){ return q.toLowerCase().trim().split(/\s+/).filter(Boolean); }
function productHaystack(p){ return (p.name+' '+p.brand+' '+p.cat+' '+p.specs.join(' ')).toLowerCase(); }
function matchProducts(query){
  const tokens = tokenize(query);
  if(!tokens.length) return [];
  return PRODUCTS.filter(p=>{
    const hay = productHaystack(p);
    return tokens.every(t=>hay.includes(t));
  });
}
searchInput.addEventListener('input', ()=>{
  const q = searchInput.value;
  const panel = document.getElementById('suggestPanel');
  if(!q.trim()){ panel.classList.add('hide'); return; }
  const matches = matchProducts(q).slice(0,6);
  if(!matches.length){ panel.classList.add('hide'); return; }
  panel.innerHTML = matches.map(p=>`
    <div class="suggest-item" onclick="selectSuggestion('${p.name.replace(/'/g,"\\'")}')">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/></svg>
      ${p.name} <span class="tag">${p.cat}</span>
    </div>`).join('');
  panel.classList.remove('hide');
});
searchInput.addEventListener('keydown', (e)=>{
  if(e.key === 'Enter'){ runSearch(searchInput.value); document.getElementById('suggestPanel').classList.add('hide'); }
});
function selectSuggestion(name){
  searchInput.value = name;
  document.getElementById('suggestPanel').classList.add('hide');
  runSearch(name);
}
function runSearch(query){
  if(query.toLowerCase().includes('flash sale')){
    showView('view-search');
    document.getElementById('resultsQueryLabel').textContent = 'Flash sale — 40% off';
    const items = PRODUCTS.filter(p=>p.flash);
    renderResultList(items, 'flash sale');
    document.getElementById('resultsCount').textContent = items.length + ' results';
    return;
  }
  searchInput.value = query;
  state.lastQuery = query;
  const results = matchProducts(query);
  showView('view-search');
  document.getElementById('resultsQueryLabel').textContent = `Results for "${query}"`;
  document.getElementById('resultsCount').textContent = results.length + (results.length===1?' result':' results');
  renderResultList(results, query);
}
function renderResultList(items, query){
  const el = document.getElementById('resultList');
  if(!items.length){
    el.innerHTML = noResultsHTML(query||'');
    return;
  }
  el.innerHTML = items.map(p=>resultRowHTML(p)).join('');
}
function escapeHtml(str){
  return String(str).replace(/[&<>"']/g, ch=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[ch]));
}
function noResultsHTML(query){
  const safeQuery = escapeHtml(query);
  return `
  <div class="no-results">
    <div class="no-results-icon"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.35-4.35"/><path d="M8 11h6"/></svg></div>
    <h3>Item is currently not available</h3>
    <p>Would you like to request for a device? Type it below.</p>
    <form class="request-form" onsubmit="submitDeviceRequest(event)">
      <input type="text" id="requestItemInput" placeholder="Request for your item" value="${safeQuery}" required>
      <input type="email" id="requestEmailInput" placeholder="Your email" required>
      <button type="submit" class="btn-primary">Submit request</button>
    </form>
    <div class="request-success hide" id="requestSuccess">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20 6L9 17l-5-5"/></svg>
      Thanks — we've got your request and will email you when it's in stock.
    </div>
  </div>`;
}
/* Device request submission.
   If SUPABASE_URL / SUPABASE_ANON_KEY are filled in above, this inserts
   the request directly into your Supabase `device_requests` table.
   It also always keeps a local copy in localStorage under
   'gt_device_requests' as a backup, in case Supabase isn't configured
   yet or the insert fails (e.g. offline). */
function submitDeviceRequest(e){
  e.preventDefault();
  const form = e.target;
  const item = form.querySelector('#requestItemInput').value.trim();
  const email = form.querySelector('#requestEmailInput').value.trim();
  if(!item || !email) return;

  const payload = { item, email, created_at: new Date().toISOString() };

  if(supabaseClient){
    supabaseClient.from('device_requests').insert([{ item, email }])
      .then(({error})=>{ if(error) console.error('Supabase insert failed:', error.message); });
  } else {
    console.warn('Supabase is not configured yet (SUPABASE_URL / SUPABASE_ANON_KEY are blank) — this request was only saved locally in this browser.');
  }

  // Local fallback store so requests aren't lost even if Supabase isn't set up yet.
  try{
    const stored = JSON.parse(safeStorage.get('gt_device_requests') || '[]');
    stored.push(payload);
    safeStorage.set('gt_device_requests', JSON.stringify(stored));
  }catch(err){}

  form.classList.add('hide');
  document.getElementById('requestSuccess').classList.remove('hide');
  showToast('Request submitted');
}
function resultRowHTML(p){
  return `
  <div class="result-row" onclick="openProduct(${p.id})">
    <div class="result-media" style="${mediaBG(p.id)}">${iconSVG(p.cat)}</div>
    <div class="result-info">
      <div class="card-brand">${p.brand}</div>
      <h3>${p.name}</h3>
      <div class="card-rating"><span class="stars">${stars(p.rating)}</span> ${p.rating} · ${p.reviews} reviews</div>
      <p class="result-details">${p.specs.join(' · ')}</p>
      <div class="card-colors">${p.colors.map(c=>`<span class="swatch" style="background:${c}"></span>`).join('')}</div>
    </div>
    <div class="result-side" onclick="event.stopPropagation()">
      <div>${p.oldPrice?`<span class="price-old">${fmtPrice(p.oldPrice)}</span>`:''}<span class="price">${fmtPrice(p.price)}</span></div>
      <button class="add-btn" style="width:auto;border-radius:8px;padding:9px 16px;display:flex;gap:6px;align-items:center;" onclick="addToCart(${p.id},null,1);">
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" style="width:14px;height:14px"><path d="M12 5v14M5 12h14"/></svg> Add
      </button>
    </div>
  </div>`;
}

/* =========================================================
   CARD RENDERING (grid / shelves)
   ========================================================= */
function cardHTML(p){
  return `
  <div class="card">
    <div class="card-media" style="${mediaBG(p.id)}" onclick="openProduct(${p.id})">
      ${p.flash?`<span class="sale-tag">-40%</span>`:''}
      <button class="wish-btn" onclick="event.stopPropagation(); showToast('Saved to wishlist')"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.6l-1-1a5.5 5.5 0 0 0-7.8 7.8l1 1L12 21l7.8-7.6 1-1a5.5 5.5 0 0 0 0-7.8z"/></svg></button>
      ${iconSVG(p.cat)}
      <span class="spec-tag">${p.specs[0]}</span>
    </div>
    <div class="card-body">
      <div class="card-brand">${p.brand}</div>
      <div class="card-name">${p.name}</div>
      <div class="card-rating"><span class="stars">${stars(p.rating)}</span> ${p.rating}</div>
      <div class="card-colors">${p.colors.map(c=>`<span class="swatch" style="background:${c}"></span>`).join('')}</div>
      <div class="card-foot">
        <div>${p.oldPrice?`<span class="price-old">${fmtPrice(p.oldPrice)}</span>`:''}<span class="price">${fmtPrice(p.price)}</span></div>
        <button class="add-btn" onclick="event.stopPropagation(); addToCart(${p.id},null,1);" aria-label="Add to cart">
          <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M12 5v14M5 12h14"/></svg>
        </button>
      </div>
      <button class="card-full-btn" onclick="openProduct(${p.id})">View details</button>
    </div>
  </div>`;
}
function seedShuffle(arr, seed){
  const a = arr.slice();
  for(let i=a.length-1;i>0;i--){
    seed = (seed*9301+49297)%233280;
    const j = Math.floor((seed/233280)*(i+1));
    [a[i],a[j]]=[a[j],a[i]];
  }
  return a;
}
function renderRandomGrid(){
  const shuffled = seedShuffle(PRODUCTS, Date.now()%1000+7).slice(0,8);
  document.getElementById('randomGrid').innerHTML = shuffled.map(cardHTML).join('');
}
function renderFlashGrid(){
  document.getElementById('flashGrid').innerHTML = PRODUCTS.filter(p=>p.flash).map(cardHTML).join('');
}
const CATEGORY_META = [
  {cat:'laptop', label:'Laptops', tag:'trending', tagLabel:'Trending purchases'},
  {cat:'phone', label:'Smartphones', tag:'recommended', tagLabel:'Recommended for you'},
  {cat:'headphones', label:'Headphones', tag:'trending', tagLabel:'Trending purchases'},
  {cat:'watch', label:'Smartwatches', tag:'recommended', tagLabel:'Recommended for you'},
  {cat:'tablet', label:'Tablets', tag:'trending', tagLabel:'Trending purchases'},
  {cat:'camera', label:'Cameras', tag:'recommended', tagLabel:'Recommended for you'},
];
function renderCategoryShelves(){
  const wrap = document.getElementById('categoryShelves');
  wrap.innerHTML = CATEGORY_META.map(meta=>{
    const items = PRODUCTS.filter(p=>p.cat===meta.cat);
    return `
    <div class="section-head">
      <div><div class="eyebrow">${meta.tagLabel}</div><h2>${meta.label}</h2></div>
      <div class="shelf-nav">
        <button onclick="scrollShelf('shelf-${meta.cat}',-1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M15 18l-6-6 6-6"/></svg></button>
        <button onclick="scrollShelf('shelf-${meta.cat}',1)"><svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 18l6-6-6-6"/></svg></button>
      </div>
    </div>
    <div class="shelf" id="shelf-${meta.cat}">${items.map(cardHTML).join('')}</div>
    `;
  }).join('');
}
function scrollShelf(id, dir){
  document.getElementById(id).scrollBy({left: dir*260, behavior:'smooth'});
}
function scrollToShelves(){ document.getElementById('shelves-anchor').scrollIntoView({behavior:'smooth'}); }

/* =========================================================
   PRODUCT DETAIL
   ========================================================= */
const ANGLES = ['Front','Angle','Side','Back','In package'];
function openProduct(id){
  const p = PRODUCTS.find(x=>x.id===id);
  if(!p) return;
  state.currentProduct = p;
  state.selectedColorIdx = 0;
  state.activeThumb = 0;
  renderDetail();
  showView('view-detail');
  window.scrollTo({top:0,behavior:'smooth'});
}
function renderDetail(){
  const p = state.currentProduct;
  document.getElementById('galleryMain').style.cssText = mediaBG(p.id) + 'aspect-ratio:1/0.9;border-radius:18px;display:flex;align-items:center;justify-content:center;position:relative;overflow:hidden;border:1px solid var(--line);';
  document.getElementById('galleryMain').innerHTML = iconSVG(p.cat) + `<span class="angle-label">${ANGLES[state.activeThumb]}</span>`;
  document.getElementById('thumbRow').innerHTML = ANGLES.map((a,i)=>`
    <div class="thumb ${i===state.activeThumb?'active':''}" style="${mediaBG(p.id+i)}" onclick="setThumb(${i})">${iconSVG(p.cat)}</div>
  `).join('');

  document.getElementById('detailInfo').innerHTML = `
    <div class="card-brand">${p.brand}</div>
    <h1>${p.name}</h1>
    <div class="detail-rating"><span class="stars">${stars(p.rating)}</span><span>${p.rating} · ${p.reviews} reviews</span></div>
    <p class="detail-desc">${p.desc}</p>
    <div class="spec-grid">${p.specs.map(s=>{
      const parts = s.split(' ');
      return `<div><span>Spec</span><b>${s}</b></div>`;
    }).join('')}</div>
    <div class="color-select">
      <div class="label">Color — <span id="colorName">selected</span></div>
      <div class="color-opts" id="colorOpts">${p.colors.map((c,i)=>`<div class="color-opt ${i===0?'selected':''}" data-i="${i}" style="background:${c}" onclick="selectColor(${i})"></div>`).join('')}</div>
    </div>
    <div class="detail-price-row"><span class="detail-price">${fmtPrice(p.price)}</span>${p.oldPrice?`<span class="price-old">${fmtPrice(p.oldPrice)}</span>`:''}</div>
    <button class="btn-add-cart" onclick="addToCart(${p.id}, state.selectedColorIdx, 1)">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21.5 7H6"/></svg>
      Add to cart — ${fmtPrice(p.price)}
    </button>
  `;

  document.getElementById('similarGrid').innerHTML = PRODUCTS.filter(x=>x.cat===p.cat && x.id!==p.id).slice(0,4).map(cardHTML).join('');
}
function setThumb(i){ state.activeThumb=i; renderDetail(); }
function selectColor(i){ state.selectedColorIdx=i; renderDetail(); }
function goBackFromDetail(){
  if(state.lastQuery){ showView('view-search'); } else { goHome(); }
}

/* =========================================================
   CART
   ========================================================= */
function persistCart(){ safeStorage.set('gt_cart', JSON.stringify(state.cart)); }
function addToCart(productId, colorIdx, qty){
  const p = PRODUCTS.find(x=>x.id===productId);
  if(!p) return;
  const cIdx = colorIdx===null ? 0 : colorIdx;
  const existing = state.cart.find(c=>c.id===productId && c.colorIdx===cIdx);
  if(existing){ existing.qty += qty; } else { state.cart.push({id:productId, colorIdx:cIdx, qty}); }
  persistCart();
  updateCartBadge();
  showToast(`${p.name} added to cart`);
}
function updateCartBadge(){
  const count = state.cart.reduce((s,c)=>s+c.qty,0);
  const badge = document.getElementById('cartBadge');
  if(count>0){ badge.textContent = count; badge.classList.remove('hide'); } else { badge.classList.add('hide'); }
}
function cartLineTotal(){
  return state.cart.reduce((sum,c)=>{
    const p = PRODUCTS.find(x=>x.id===c.id);
    return sum + (p ? p.price*c.qty : 0);
  },0);
}
function renderCart(){
  const body = document.getElementById('cartBody');
  const foot = document.getElementById('cartFoot');
  if(!state.cart.length){
    body.innerHTML = `<div class="empty-cart">
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5"><circle cx="9" cy="21" r="1"/><circle cx="19" cy="21" r="1"/><path d="M2.5 3h2l2.6 12.6a2 2 0 0 0 2 1.6h8.4a2 2 0 0 0 2-1.6L21.5 7H6"/></svg>
      <p>Nothing in your cart yet</p>
      <button class="btn-primary" onclick="closeCart(); goHome();">Start shopping</button>
    </div>`;
    foot.classList.add('hide');
    return;
  }
  body.innerHTML = state.cart.map((c,idx)=>{
    const p = PRODUCTS.find(x=>x.id===c.id);
    if(!p) return '';
    return `
    <div class="cart-item">
      <div class="cart-item-media" style="${mediaBG(p.id)}">${iconSVG(p.cat)}</div>
      <div class="cart-item-info">
        <h4>${p.name}</h4>
        <p>${p.brand} · <span style="display:inline-block;width:10px;height:10px;border-radius:50%;background:${p.colors[c.colorIdx]||p.colors[0]};vertical-align:-1px;"></span></p>
        <div class="qty-row">
          <button class="qty-btn" onclick="changeQty(${idx},-1)">−</button>
          <span>${c.qty}</span>
          <button class="qty-btn" onclick="changeQty(${idx},1)">+</button>
          <a class="remove-link" onclick="removeFromCart(${idx})">Remove</a>
        </div>
      </div>
      <div class="cart-item-price">${fmtPrice(p.price*c.qty)}</div>
    </div>`;
  }).join('');
  foot.classList.remove('hide');
  document.getElementById('cartSubtotal').textContent = fmtPrice(cartLineTotal());
}
function changeQty(idx, delta){
  state.cart[idx].qty += delta;
  if(state.cart[idx].qty<=0) state.cart.splice(idx,1);
  persistCart(); updateCartBadge(); renderCart();
}
function removeFromCart(idx){ state.cart.splice(idx,1); persistCart(); updateCartBadge(); renderCart(); }
function openCart(){ renderCart(); document.getElementById('cart-drawer').classList.add('show'); document.getElementById('overlay').classList.add('show'); }
function closeCart(){ document.getElementById('cart-drawer').classList.remove('show'); document.getElementById('overlay').classList.remove('show'); }
function closeAllOverlays(){
  closeCart();
  document.querySelectorAll('.dropdown-panel').forEach(p=>p.classList.add('hide'));
}

/* =========================================================
   CHECKOUT
   ========================================================= */
function goCheckout(){
  if(!state.cart.length){ showToast("Your cart is empty"); return; }
  closeCart();
  renderCheckout();
  showView('view-checkout');
  window.scrollTo({top:0,behavior:'smooth'});
}
let selectedPayment = 'card';
function selectPayment(m){ selectedPayment = m; renderCheckout(); }
function renderCheckout(){
  const subtotal = cartLineTotal();
  const shipping = subtotal > 500 ? 0 : 12.99;
  const tax = subtotal * 0.08;
  const total = subtotal + shipping + tax;
  document.getElementById('checkoutContent').innerHTML = `
  <div class="checkout-wrap">
    <div>
      <div class="checkout-card" style="margin-bottom:20px;">
        <h3>Shipping address</h3>
        <div class="form-grid">
          <div class="field full"><label>Full name</label><input type="text" placeholder="Ada Lovelace" required></div>
          <div class="field full"><label>Address</label><input type="text" placeholder="123 Circuit Street" required></div>
          <div class="field"><label>City</label><input type="text" placeholder="Dakar" required></div>
          <div class="field"><label>Postal code</label><input type="text" placeholder="10000" required></div>
          <div class="field full"><label>Country</label><input type="text" value="${state.country}"></div>
        </div>
      </div>
      <div class="checkout-card">
        <h3>Payment method</h3>
        <div class="pay-opts">
          <label class="pay-opt ${selectedPayment==='card'?'selected':''}" onclick="selectPayment('card')"><input type="radio" name="pay" ${selectedPayment==='card'?'checked':''}> Credit / Debit card</label>
          <label class="pay-opt ${selectedPayment==='paypal'?'selected':''}" onclick="selectPayment('paypal')"><input type="radio" name="pay" ${selectedPayment==='paypal'?'checked':''}> PayPal</label>
          <label class="pay-opt ${selectedPayment==='applepay'?'selected':''}" onclick="selectPayment('applepay')"><input type="radio" name="pay" ${selectedPayment==='applepay'?'checked':''}> Apple Pay</label>
        </div>
        ${selectedPayment==='card' ? `<div class="form-grid" style="margin-top:16px;">
          <div class="field full"><label>Card number</label><input type="text" placeholder="4242 4242 4242 4242"></div>
          <div class="field"><label>Expiry</label><input type="text" placeholder="MM/YY"></div>
          <div class="field"><label>CVC</label><input type="text" placeholder="123"></div>
        </div>` : `<p style="color:var(--muted);font-size:.85rem;margin-top:14px;">You'll confirm this payment after placing the order.</p>`}
      </div>
    </div>
    <div class="checkout-card">
      <h3>Order summary</h3>
      ${state.cart.map(c=>{
        const p = PRODUCTS.find(x=>x.id===c.id);
        return `<div class="mini-item"><div class="mm" style="${mediaBG(p.id)}">${iconSVG(p.cat)}</div>
          <div><span class="mn">${p.name} × ${c.qty}</span><span class="mp">${fmtPrice(p.price*c.qty)}</span></div></div>`;
      }).join('')}
      <div style="margin-top:14px;">
        <div class="summary-line"><span>Subtotal</span><span>${fmtPrice(subtotal)}</span></div>
        <div class="summary-line"><span>Shipping</span><span>${shipping===0?'Free':fmtPrice(shipping)}</span></div>
        <div class="summary-line"><span>Tax</span><span>${fmtPrice(tax)}</span></div>
        <div class="summary-line total"><span>Total</span><b>${fmtPrice(total)}</b></div>
      </div>
      <button class="btn-add-cart" style="margin-top:18px;" onclick="placeOrder()">Place order</button>
    </div>
  </div>`;
}
function placeOrder(){
  const orderId = 'GT-' + Math.floor(100000+Math.random()*900000);
  document.getElementById('orderIdLabel').textContent = orderId;
  state.cart = [];
  persistCart(); updateCartBadge();
  showView('view-confirm');
  window.scrollTo({top:0,behavior:'smooth'});
}

/* =========================================================
   AUTH — real Supabase email/password accounts, as full pages
   ========================================================= */
function renderAuthArea(){
  const el = document.getElementById('authArea');
  if(state.user){
    el.innerHTML = `<div class="account-chip"><div class="avatar">${state.user.name.slice(0,1).toUpperCase()}</div> ${state.user.name.split(' ')[0]} <button onclick="signOut()" style="margin-left:4px;color:var(--muted)" title="Sign out"><svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M9 21H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h4M16 17l5-5-5-5M21 12H9"/></svg></button></div>`;
  } else {
    el.innerHTML = `<button class="auth-btn" onclick="goLogin()">Sign in</button>`;
  }
  renderHeroAuthCta();
}
function renderHeroAuthCta(){
  const el = document.getElementById('heroAuthCta');
  if(!el) return;
  if(state.user){
    el.innerHTML = `<div class="hero-welcome">Welcome back, <b>${escapeHtml(state.user.name.split(' ')[0])}</b> — your cart and orders are saved to your account.</div>`;
  } else {
    el.innerHTML = `
    <div class="hero-auth-cta">
      <p>New here? <b>Create an account</b> to track orders and save your cart.</p>
      <div class="hero-auth-btns">
        <button class="btn-ghost" onclick="goLogin()">Log in</button>
        <button class="btn-primary" onclick="goSignup()">Sign up</button>
      </div>
    </div>`;
  }
}

function goLogin(){
  document.getElementById('loginEmail').value = '';
  document.getElementById('loginPassword').value = '';
  setAuthError('loginError', '');
  showView('view-login');
  window.scrollTo({top:0, behavior:'smooth'});
}
function goSignup(){
  document.getElementById('signupName').value = '';
  document.getElementById('signupEmail').value = '';
  document.getElementById('signupPassword').value = '';
  document.getElementById('signupConfirmPassword').value = '';
  setAuthError('signupError', '');
  showView('view-signup');
  window.scrollTo({top:0, behavior:'smooth'});
}
function setAuthError(elId, msg){
  const el = document.getElementById(elId);
  if(!el) return;
  if(msg){ el.textContent = msg; el.classList.remove('hide'); }
  else{ el.textContent = ''; el.classList.add('hide'); }
}

function submitLogin(e){
  e.preventDefault();
  setAuthError('loginError', '');
  const email = document.getElementById('loginEmail').value.trim();
  const password = document.getElementById('loginPassword').value;

  if(!supabaseClient){
    setAuthError('loginError', "Sign in isn't set up yet — contact the site owner.");
    return;
  }

  const btn = document.getElementById('loginSubmitBtn');
  btn.disabled = true; btn.textContent = 'Logging in…';

  supabaseClient.auth.signInWithPassword({ email, password })
    .then(({data, error})=>{
      btn.disabled = false; btn.textContent = 'Log in';
      if(error){
        // Wrong email, wrong password, or no account at all — same message either way,
        // so we don't reveal which part was wrong.
        setAuthError('loginError', 'Information not found. Please check your email and password.');
        return;
      }
      const u = data.user;
      state.user = { name: (u.user_metadata && u.user_metadata.name) || u.email.split('@')[0], email: u.email };
      safeStorage.set('gt_user', JSON.stringify(state.user));
      renderAuthArea();
      goHome();
      showToast(`Welcome back, ${state.user.name}`);
    });
}

function submitSignup(e){
  e.preventDefault();
  setAuthError('signupError', '');
  const name = document.getElementById('signupName').value.trim();
  const email = document.getElementById('signupEmail').value.trim();
  const password = document.getElementById('signupPassword').value;
  const confirmPassword = document.getElementById('signupConfirmPassword').value;

  if(password !== confirmPassword){
    setAuthError('signupError', "Passwords don't match. Please check and try again.");
    return; // blocked — nothing is sent to the database
  }
  if(password.length < 6){
    setAuthError('signupError', 'Password should be at least 6 characters.');
    return;
  }
  if(!supabaseClient){
    setAuthError('signupError', "Sign up isn't set up yet — contact the site owner.");
    return;
  }

  const btn = document.getElementById('signupSubmitBtn');
  btn.disabled = true; btn.textContent = 'Creating account…';

  supabaseClient.auth.signUp({ email, password, options: { data: { name } } })
    .then(({data, error})=>{
      btn.disabled = false; btn.textContent = 'Sign up';
      if(error){
        setAuthError('signupError', error.message || "Couldn't create that account. Please try again.");
        return;
      }
      if(data.session){
        // Email confirmation is off in this project — signed in immediately.
        state.user = { name, email };
        safeStorage.set('gt_user', JSON.stringify(state.user));
        renderAuthArea();
        goHome();
        showToast(`Welcome, ${name}!`);
      } else {
        // Email confirmation is required before this account can log in.
        showToast('Account created — check your email to confirm it');
        goLogin();
      }
    });
}

function signOut(){
  state.user = null;
  safeStorage.remove('gt_user');
  if(supabaseClient) supabaseClient.auth.signOut();
  renderAuthArea();
  showToast('Signed out');
}

/* =========================================================
   THEME (dark / light)
   ========================================================= */
const SUN_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round"><circle cx="12" cy="12" r="4.5"/><path d="M12 2.5v2.5M12 19v2.5M4.6 4.6l1.8 1.8M17.6 17.6l1.8 1.8M2.5 12H5M19 12h2.5M4.6 19.4l1.8-1.8M17.6 6.4l1.8-1.8"/></svg>`;
const MOON_ICON = `<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M20 14.5A8.5 8.5 0 1 1 9.5 4a6.5 6.5 0 0 0 10.5 10.5z"/></svg>`;
function applyTheme(theme){
  document.documentElement.setAttribute('data-theme', theme);
  safeStorage.set('gt_theme', theme);
  const btn = document.getElementById('themeToggle');
  if(btn){
    // icon shown = the mode you'll switch TO
    btn.innerHTML = theme === 'dark' ? SUN_ICON : MOON_ICON;
    btn.setAttribute('aria-label', theme === 'dark' ? 'Switch to light mode' : 'Switch to dark mode');
  }
}
function toggleTheme(){
  const current = document.documentElement.getAttribute('data-theme') || 'dark';
  const next = current === 'dark' ? 'light' : 'dark';
  applyTheme(next);
  showToast(next === 'light' ? 'Light mode on' : 'Dark mode on');
}
function initTheme(){
  const saved = safeStorage.get('gt_theme');
  const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;
  applyTheme(saved || (prefersLight ? 'light' : 'dark'));
}

/* =========================================================
   TOAST / VIEW SWITCHING / TIMER
   ========================================================= */
let toastTimer;
function showToast(msg){
  const t = document.getElementById('toast');
  document.getElementById('toastMsg').textContent = msg;
  t.classList.add('show');
  clearTimeout(toastTimer);
  toastTimer = setTimeout(()=>t.classList.remove('show'), 2200);
}
function showView(id){
  document.querySelectorAll('.view').forEach(v=>v.classList.remove('active'));
  document.getElementById(id).classList.add('active');
}
function goHome(){ showView('view-home'); searchInput.value=''; state.lastQuery=''; window.scrollTo({top:0,behavior:'smooth'}); }

let flashEnd = Date.now() + (1000*60*60*7 + 1000*60*24); // ~7h24m from load, resets look each load
function tickTimer(){
  const diff = Math.max(0, flashEnd - Date.now());
  const h = Math.floor(diff/3600000);
  const m = Math.floor((diff%3600000)/60000);
  const s = Math.floor((diff%60000)/1000);
  document.getElementById('tH').textContent = String(h).padStart(2,'0');
  document.getElementById('tM').textContent = String(m).padStart(2,'0');
  document.getElementById('tS').textContent = String(s).padStart(2,'0');
}
setInterval(tickTimer, 1000);

/* =========================================================
   INIT
   ========================================================= */
function renderAll(){
  renderRandomGrid();
  renderFlashGrid();
  renderCategoryShelves();
  if(document.getElementById('view-detail').classList.contains('active') && state.currentProduct) renderDetail();
  if(document.getElementById('view-search').classList.contains('active') && state.lastQuery) runSearch(state.lastQuery);
  renderCart();
}
function init(){
  initTheme();
  document.getElementById('countryLabel').textContent = state.country;
  document.getElementById('currencyLabel').textContent = state.currency;
  buildCountryPanel();
  buildCurrencyPanel();
  renderAuthArea();
  renderRandomGrid();
  renderFlashGrid();
  renderCategoryShelves();
  updateCartBadge();
  tickTimer();
  document.getElementById('statCount').textContent = PRODUCTS.length;
}
init();