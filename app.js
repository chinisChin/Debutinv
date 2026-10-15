'use strict';

/* ================================================================
   SMALL HELPERS
================================================================ */
const SVG_NS = 'http://www.w3.org/2000/svg';
let uid = 0;

function el(name, attrs, parent) {
  const n = document.createElementNS(SVG_NS, name);
  for (const k in attrs) n.setAttribute(k, attrs[k]);
  if (parent) parent.appendChild(n);
  return n;
}

// Seeded random so the flowers look the same on every visit
function rng(seed) {
  let s = seed >>> 0;
  return () => {
    s = (s + 0x6D2B79F5) >>> 0;
    let t = s;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
const pick = (arr, r) => arr[Math.floor(r() * arr.length)];

// Run fn now and again when the window WIDTH changes (ignores mobile URL-bar height changes)
function onWidthChange(fn) {
  let w = window.innerWidth;
  let timer;
  fn();
  window.addEventListener('resize', () => {
    clearTimeout(timer);
    timer = setTimeout(() => {
      if (window.innerWidth !== w) { w = window.innerWidth; fn(); }
    }, 200);
  });
}

function makeSvg(host, w, h, blur) {
  host.textContent = '';
  const svg = el('svg', { width: w, height: h, viewBox: `0 0 ${w} ${h}` }, host);
  const id = 'blur' + (uid++);
  const defs = el('defs', {}, svg);
  const f = el('filter', { id, x: '-5%', y: '-5%', width: '110%', height: '110%' }, defs);
  el('feGaussianBlur', { stdDeviation: blur }, f);
  const g = el('g', { filter: `url(#${id})` }, svg);
  return { svg, g };
}

/* ================================================================
   FLOWER SHAPES
================================================================ */
function leaf(parent, x, y, angle, size, fill, opacity) {
  el('path', {
    d: `M0 0 Q ${size * 0.5} ${-size * 0.38} ${size} 0 Q ${size * 0.5} ${size * 0.38} 0 0Z`,
    fill, opacity,
    transform: `translate(${x} ${y}) rotate(${angle})`
  }, parent);
}

function rose(parent, cx, cy, r, [c1, c2, c3]) {
  const g = el('g', { transform: `translate(${cx} ${cy})` }, parent);
  for (let i = 0; i < 7; i++) {
    el('ellipse', { cx: 0, cy: -r * 0.55, rx: r * 0.5, ry: r * 0.55, fill: c1, stroke: c3,
      'stroke-width': 0.6, 'stroke-opacity': 0.5, transform: `rotate(${i * 360 / 7})` }, g);
  }
  for (let i = 0; i < 5; i++) {
    el('ellipse', { cx: 0, cy: -r * 0.35, rx: r * 0.38, ry: r * 0.42, fill: c2, stroke: c3,
      'stroke-width': 0.5, 'stroke-opacity': 0.5, transform: `rotate(${i * 72 + 20})` }, g);
  }
  for (let i = 0; i < 3; i++) {
    el('ellipse', { cx: 0, cy: -r * 0.18, rx: r * 0.25, ry: r * 0.28, fill: c3,
      'fill-opacity': 0.85, transform: `rotate(${i * 120 + 40})` }, g);
  }
  el('circle', { r: r * 0.12, fill: c3 }, g);
}

function dahlia(parent, cx, cy, r) {
  const g = el('g', { transform: `translate(${cx} ${cy})` }, parent);
  const fills = ['#ffffff', '#efe6fb', '#d9c8f2'];
  for (let k = 0; k < 3; k++) {
    const n = 16 - k * 3;
    for (let i = 0; i < n; i++) {
      el('ellipse', { cx: 0, cy: -r * (0.62 - k * 0.15), rx: r * 0.16, ry: r * (0.4 - k * 0.06),
        fill: fills[k], stroke: '#c3a8e8', 'stroke-width': 0.5, 'stroke-opacity': 0.6,
        transform: `rotate(${i * 360 / n + k * 11})` }, g);
    }
  }
  el('circle', { r: r * 0.1, fill: '#cdb0ec' }, g);
}

/* ================================================================
   WISTERIA — hanging purple clusters (hero + traditions header)
================================================================ */
const WISTERIA = ['#a98be0', '#9a78d6', '#b9a0e8', '#8a64c8', '#cdb8f0', '#e3d6f8', '#7c58bd'];

function buildWisteria(host) {
  const w = host.clientWidth, h = host.clientHeight;
  if (!w || !h) return;
  const rand = rng(+host.dataset.seed || 7);
  const { g } = makeSvg(host, w, h, 0.5);

  // vine across the top
  el('path', { d: `M0 6 Q ${w * 0.25} 24 ${w * 0.5} 8 T ${w} 10`, fill: 'none', stroke: '#7da476',
    'stroke-width': 3, opacity: 0.85 }, g);

  const count = Math.max(6, Math.round(w / 62));
  for (let i = 0; i < count; i++) {
    const x = (i + 0.5) / count * w + (rand() - 0.5) * 30;
    const len = h * (0.45 + rand() * 0.5);
    const maxW = 16 + rand() * 12;
    const n = Math.round(len / 6.5);

    leaf(g, x, 8, 20 + rand() * 140, 22 + rand() * 12, pick(['#8fba88', '#7da476'], rand), 0.85);

    for (let j = 0; j < n; j++) {
      const t = j / n;
      const y = 6 + t * len + rand() * 6;
      const spread = maxW * (1 - t * 0.85);
      const bx = x + Math.sin(t * 3 + i) * 6 + (rand() - 0.5) * spread * 2;
      const r = 4.5 + (1 - t) * 3.2 + rand() * 1.5;
      const col = pick(WISTERIA, rand);
      el('ellipse', { cx: bx, cy: y, rx: r, ry: r * 0.8, fill: col, opacity: 0.92,
        transform: `rotate(${rand() * 180} ${bx} ${y})` }, g);
      el('ellipse', { cx: bx + r * 0.5, cy: y - r * 0.4, rx: r * 0.55, ry: r * 0.45,
        fill: pick(WISTERIA, rand), opacity: 0.85 }, g);
    }
  }

  // corner roses & dahlia (hero only)
  if (host.dataset.corners === 'yes') {
    const R = Math.max(34, Math.min(56, w * 0.1));
    [[16, 30, 150], [w - 16, 30, 30], [8, 120, 80], [w - 8, 120, 100]].forEach(([x, y, a]) =>
      leaf(g, x, y, a, R * 0.9, '#7da476', 0.85));
    rose(g, R * 0.55, R * 0.7, R, ['#d9c6ee', '#c2a2e0', '#9a6cc4']);
    rose(g, R * 1.5, R * 0.45, R * 0.72, ['#9b4ba3', '#7a2f86', '#5f1f6b']);
    rose(g, R * 0.35, R * 1.7, R * 0.6, ['#eadcf6', '#d7bdee', '#b48ad8']);
    dahlia(g, w - R * 0.7, R * 0.75, R * 1.05);
    rose(g, w - R * 0.4, R * 1.9, R * 0.8, ['#8a3a99', '#6e2a82', '#4d175f']);
    rose(g, w - R * 1.7, R * 0.4, R * 0.5, ['#efe4fa', '#d9c3f0', '#b697dc']);
  }
}

/* ================================================================
   LAVENDER FIELD (bottom of hero)
================================================================ */
function buildLavender(host) {
  const w = host.clientWidth, h = host.clientHeight;
  if (!w || !h) return;
  const rand = rng(3);
  const { g } = makeSvg(host, w, h, 0.6);
  const colors = ['#b18de6', '#9468d4', '#c9b0f0', '#ede2fb', '#ffffff', '#7e56c2'];
  const n = Math.min(1800, Math.round(w * h / 55));
  for (let i = 0; i < n; i++) {
    const x = rand() * w;
    const y = h - Math.pow(rand(), 1.7) * h;
    const r = 1.5 + (y / h) * 3.5 * (0.5 + rand());
    const green = rand() < 0.08;
    el('circle', { cx: x, cy: y, r, fill: green ? '#a7c79a' : pick(colors, rand), opacity: 0.85 }, g);
  }
}

/* ================================================================
   WATERCOLOR BLOOMS (background of the light sections)
================================================================ */
function buildBlooms(host) {
  const w = host.clientWidth, h = host.clientHeight;
  if (!w || !h) return;
  const soft = host.hasAttribute('data-soft');
  const rand = rng(+host.dataset.seed || 13);
  const { svg, g } = makeSvg(host, w, h, 1.4);
  svg.style.opacity = soft ? 0.55 : 0.9;

  const palette = ['#f5e6ef', '#ecd5ea', '#d9c3ec', '#c9b2e3', '#f8f0d8', '#f1dcdc', '#e5d0f0'];
  const count = Math.max(4, Math.round(w * h / (soft ? 70000 : 42000)));
  for (let i = 0; i < count; i++) {
    const cx = rand() * w, cy = rand() * h;
    const R = 34 + rand() * 46;
    const base = pick(palette, rand);
    for (let k = 0; k < 3; k++) {
      leaf(g, cx, cy, rand() * 360, R * (0.9 + rand() * 0.5), pick(['#a9c9a0', '#8fb88b'], rand), 0.55);
    }
    const n = 14 + Math.floor(rand() * 16);
    for (let k = 0; k < n; k++) {
      const a = rand() * Math.PI * 2;
      const d = R * Math.sqrt(rand());
      el('circle', { cx: cx + Math.cos(a) * d, cy: cy + Math.sin(a) * d, r: 6 + rand() * 6,
        fill: rand() < 0.7 ? base : pick(palette, rand), opacity: 0.5 + rand() * 0.25 }, g);
    }
  }
}

/* ================================================================
   LILIES (dress code)
================================================================ */
function buildLily(host) {
  const kind = host.dataset.lily;
  const purple = kind === 'purple';
  const id = 'lily' + (uid++);
  host.textContent = '';
  const svg = el('svg', { viewBox: '-110 -110 220 220', width: '100%', height: '100%', 'aria-hidden': 'true' }, host);
  const defs = el('defs', {}, svg);

  const grad = (gid, stops) => {
    const lg = el('linearGradient', { id: gid, x1: 0, y1: 1, x2: 0, y2: 0 }, defs);
    stops.forEach(([o, c]) => el('stop', { offset: o, 'stop-color': c }, lg));
  };
  grad(id + 'f', purple
    ? [[0, '#4a1458'], [0.35, '#8e2f94'], [1, '#c06ad0']]
    : [[0, '#e8e0a8'], [0.25, '#f6f1f9'], [1, '#ffffff']]);
  grad(id + 'b', purple
    ? [[0, '#3d0f4a'], [1, '#8a45a6']]
    : [[0, '#cdbfdc'], [1, '#ece6f4']]);

  const PETAL = 'M0 0 C 26 -26, 38 -62, 6 -100 Q 0 -108 -6 -100 C -38 -62, -26 -26, 0 0Z';
  const stroke = purple ? '#4a1458' : '#cdbfdc';
  const g = el('g', { transform: `rotate(${purple ? 10 : -12})` }, svg);

  [60, 180, 300].forEach(a =>
    el('path', { d: PETAL, fill: `url(#${id}b)`, stroke, 'stroke-width': 0.8, 'stroke-opacity': 0.5,
      transform: `rotate(${a}) scale(0.92)` }, g));
  [0, 120, 240].forEach(a => {
    const pg = el('g', { transform: `rotate(${a})` }, g);
    el('path', { d: PETAL, fill: `url(#${id}f)`, stroke, 'stroke-width': 0.8, 'stroke-opacity': 0.55 }, pg);
    el('path', { d: 'M0 0 L0 -75', stroke: purple ? '#2c0a36' : '#c9bcd8', 'stroke-width': 1.2, opacity: 0.35 }, pg);
  });

  // stamens
  for (let i = 0; i < 6; i++) {
    const a = (i * 60 + 15) * Math.PI / 180;
    const len = 46 + (i % 3) * 7;
    const x = Math.sin(a) * len * 0.8, y = -Math.cos(a) * len;
    el('line', { x1: 0, y1: 0, x2: x, y2: y, stroke: '#d9c98a', 'stroke-width': 1.4 }, g);
    el('ellipse', { cx: x, cy: y, rx: 3, ry: 6, fill: purple ? '#e0b04a' : '#d9a73a',
      transform: `rotate(${Math.atan2(x, -y) * 180 / Math.PI} ${x} ${y})` }, g);
  }
  if (purple) {
    const r = rng(4);
    for (let i = 0; i < 18; i++) {
      el('circle', { cx: (r() - 0.5) * 30, cy: -10 - r() * 40, r: 1.1, fill: '#2c0a36', opacity: 0.6 }, g);
    }
  }
}

/* ================================================================
   AMBIENT EXTRAS
================================================================ */
function initPetals() {
  const host = document.getElementById('petals');
  if (!host || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
  const r = rng(21);
  for (let i = 0; i < 16; i++) {
    const p = document.createElement('span');
    p.className = 'petal';
    p.style.cssText = `left:${r() * 100}%;--s:${8 + r() * 10}px;--d:${9 + r() * 9}s;--delay:${-r() * 14}s;--x:${(r() - 0.5) * 160}px`;
    host.appendChild(p);
  }
}

function initSparkles() {
  const host = document.getElementById('heroGlow');
  if (!host) return;
  const r = rng(33);
  for (let i = 0; i < 16; i++) {
    const s = document.createElement('span');
    s.className = 'sparkle';
    s.style.cssText = `left:${25 + r() * 50}%;top:${25 + r() * 55}%;--s:${3 + r() * 4}px;--d:${2.5 + r() * 3}s;--delay:${-r() * 4}s`;
    host.appendChild(s);
  }
}

function initReveal() {
  const items = document.querySelectorAll('.reveal');
  if (!('IntersectionObserver' in window)) {
    items.forEach(i => i.classList.add('is-visible'));
    return;
  }
  const io = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-visible'); io.unobserve(e.target); }
    });
  }, { threshold: 0.12 });
  items.forEach(i => io.observe(i));
}

/* ================================================================
   RSVP FORM WITH GOOGLE SHEETS INTEGRATION
================================================================ */
// Your SheetDB API URL (from sheetdb.io)
const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/amteekrxadb4e';

function initRsvpForm() {
  const form     = document.getElementById('rsvpForm');
  const success  = document.getElementById('rsvpSuccess');
  const errorBox = document.getElementById('rsvpError');
  if (!form) return;

  const attendanceEl = form.elements['attendance'];
  const nameEl       = form.elements['name'];

  const showError = (msg, focusEl) => {
    errorBox.textContent = msg;
    errorBox.hidden = false;
    if (focusEl) focusEl.focus();
  };
  const clearError = () => { errorBox.hidden = true; errorBox.textContent = ''; };

  attendanceEl.addEventListener('change', clearError);

  form.addEventListener('submit', (e) => {
    e.preventDefault();
    clearError();

    const name       = nameEl.value.trim();
    const attendance = attendanceEl.value;

    if (!name) return showError('Please enter your full name.', nameEl);
    if (!attendance) return showError('Please select whether you will attend.', attendanceEl);

    const btn = form.querySelector('.rsvp__btn');
    btn.disabled = true;
    btn.textContent = 'Sending…';

    fetch(SHEETDB_API_URL, {
      method: 'POST',
      headers: { 'Accept': 'application/json', 'Content-Type': 'application/json' },
      body: JSON.stringify({ data: [{ name, attendance }] })
    })
    .then(response => {
      if (!response.ok) throw new Error('Request failed with status ' + response.status);
      return response.json();
    })
    .then(() => {
      form.hidden = true;
      if (success) {
        success.hidden = false;
        success.scrollIntoView({ behavior: 'smooth', block: 'center' });
      }
    })
    .catch(error => {
      console.error('RSVP error:', error);
      showError('Something went wrong. Please try again in a moment.');
      btn.disabled = false;
      btn.textContent = 'Send RSVP ✨';
    });
  });
}

/* ================================================================
   START
================================================================ */
document.addEventListener('DOMContentLoaded', () => {
  try {
    document.querySelectorAll('[data-wisteria]').forEach(h => onWidthChange(() => buildWisteria(h)));
    document.querySelectorAll('[data-lavender]').forEach(h => onWidthChange(() => buildLavender(h)));
    document.querySelectorAll('[data-blooms]').forEach(h => onWidthChange(() => buildBlooms(h)));
    document.querySelectorAll('[data-lily]').forEach(buildLily);
    initPetals();
    initSparkles();
    initReveal();
  } catch (err) {
    console.error('Decoration error:', err);
    document.documentElement.classList.remove('js'); // make sure content stays visible
  }
  initRsvpForm();
});