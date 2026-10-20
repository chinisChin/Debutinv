'use strict';

// If run directly in Node.js (e.g. via `node app.js` or Code Runner in VS Code),
// start the local web server instead of failing with "document is not defined".
if (typeof window === 'undefined' && typeof document === 'undefined') {
  require('./server.js');
} else {

  /* ================================================================
     CHARMAINE'S 18TH DEBUT — ROMANTIC GARDEN INTERACTIVE LOGIC
  ================================================================ */

  const SVG_NS = 'http://www.w3.org/2000/svg';
  let uid = 0;

  function el(name, attrs, parent) {
    const n = document.createElementNS(SVG_NS, name);
    for (const k in attrs) n.setAttribute(k, attrs[k]);
    if (parent) parent.appendChild(n);
    return n;
  }

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

  /* ================================================================
     1. REAL-TIME DEBUT COUNTDOWN TIMER
  ================================================================ */
  function initCountdown() {
    const clock = document.getElementById('countdownClock');
    if (!clock) return;

    const targetDateStr = clock.dataset.target || '2026-12-06T18:00:00+08:00';
    const targetTime = new Date(targetDateStr).getTime();

    const daysEl = document.getElementById('daysCount');
    const hoursEl = document.getElementById('hoursCount');
    const minsEl = document.getElementById('minutesCount');
    const secsEl = document.getElementById('secondsCount');

    function update() {
      const now = Date.now();
      let diff = targetTime - now;

      if (diff < 0) diff = 0;

      const days = Math.floor(diff / (1000 * 60 * 60 * 24));
      const hours = Math.floor((diff / (1000 * 60 * 60)) % 24);
      const mins = Math.floor((diff / (1000 * 60)) % 60);
      const secs = Math.floor((diff / 1000) % 60);

      if (daysEl) daysEl.textContent = String(days).padStart(3, '0');
      if (hoursEl) hoursEl.textContent = String(hours).padStart(2, '0');
      if (minsEl) minsEl.textContent = String(mins).padStart(2, '0');
      if (secsEl) secsEl.textContent = String(secs).padStart(2, '0');
    }

    update();
    setInterval(update, 1000);
  }

  /* ================================================================
     2. INTERACTIVE WAX SEAL & ENVELOPE OPENING
  ================================================================ */
  function initEnvelope() {
    const waxSeal = document.getElementById('waxSealBtn');
    const openBtn = document.getElementById('openInviteBtn');
    const heroSection = document.getElementById('hero');
    const envelopeSection = document.getElementById('envelopeSection');

    function openInvite() {
      if (envelopeSection) {
        envelopeSection.style.transition = 'transform 0.8s ease, opacity 0.8s ease';
        envelopeSection.style.transform = 'scale(0.96) translateY(-20px)';
        envelopeSection.style.opacity = '0.9';
      }

      if (heroSection) {
        heroSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    }

    if (waxSeal) waxSeal.addEventListener('click', openInvite);
    if (openBtn) openBtn.addEventListener('click', openInvite);
  }

  /* ================================================================
     3. TRADITIONS TAB SWITCHER
  ================================================================ */
  function initTraditionsTabs() {
    const tabBtns = document.querySelectorAll('.traditions-tabs .tab-btn');
    const panels = document.querySelectorAll('.tab-content-panel');

    if (!tabBtns.length || !panels.length) return;

    tabBtns.forEach(btn => {
      btn.addEventListener('click', () => {
        const targetId = btn.dataset.tab;

        tabBtns.forEach(b => {
          b.classList.remove('active');
          b.setAttribute('aria-selected', 'false');
        });
        btn.classList.add('active');
        btn.setAttribute('aria-selected', 'true');

        panels.forEach(panel => {
          if (panel.id === targetId) {
            panel.hidden = false;
            panel.classList.add('active');
          } else {
            panel.hidden = true;
            panel.classList.remove('active');
          }
        });
      });
    });
  }

  /* ================================================================
     4. FALLING PETALS AMBIENCE
  ================================================================ */
  function initFallingPetals() {
    const container = document.getElementById('petals');
    if (!container || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;

    const rand = rng(42);
    const total = 18; // 18 petals for 18th debut!

    for (let i = 0; i < total; i++) {
      const petal = document.createElement('span');
      petal.className = 'falling-petal';

      const size = 10 + rand() * 12;
      const duration = 8 + rand() * 10;
      const delay = -(rand() * 15);
      const left = rand() * 100;
      const drift = (rand() - 0.5) * 150;

      petal.style.setProperty('--s', `${size}px`);
      petal.style.setProperty('--d', `${duration}s`);
      petal.style.setProperty('--delay', `${delay}s`);
      petal.style.setProperty('--x', `${drift}px`);
      petal.style.left = `${left}%`;

      container.appendChild(petal);
    }
  }

  /* ================================================================
     5. WISTERIA CANOPY GENERATOR
  ================================================================ */
  const WISTERIA_COLORS = ['#906ec8', '#a484d8', '#7b53b8', '#cbb4ec', '#653c9e', '#eedffc'];

  function buildWisteriaCanopy(host) {
    const w = host.clientWidth || 500;
    const h = host.clientHeight || 160;
    host.textContent = '';

    const svg = el('svg', {
      width: '100%',
      height: '100%',
      viewBox: `0 0 ${w} ${h}`,
      preserveAspectRatio: 'none'
    }, host);

    const rand = rng(7);
    const g = el('g', {}, svg);

    // Top leafy vine line
    el('path', {
      d: `M0,8 Q ${w * 0.25},24 ${w * 0.5},10 T ${w},12`,
      fill: 'none',
      stroke: '#6a9163',
      'stroke-width': '4',
      opacity: '0.85'
    }, g);

    // Secondary vine
    el('path', {
      d: `M0,18 Q ${w * 0.35},6 ${w * 0.7},22 T ${w},8`,
      fill: 'none',
      stroke: '#84aa7e',
      'stroke-width': '3',
      opacity: '0.75'
    }, g);

    const clusterCount = Math.max(8, Math.round(w / 45));

    for (let i = 0; i < clusterCount; i++) {
      const cx = (i + 0.5) / clusterCount * w + (rand() - 0.5) * 25;
      const len = h * (0.5 + rand() * 0.45);
      const maxSpread = 14 + rand() * 10;
      const drops = Math.round(len / 7);

      // Leaves on top of cluster
      for (let l = 0; l < 3; l++) {
        const la = (rand() - 0.5) * 120;
        el('ellipse', {
          cx, cy: 12 + rand() * 10, rx: 7, ry: 4,
          fill: pick(['#7ba075', '#658d5f', '#8fb38a'], rand),
          transform: `rotate(${la} ${cx} 15)`
        }, g);
      }

      // Flower drops
      for (let j = 0; j < drops; j++) {
        const progress = j / drops;
        const y = 14 + progress * len + rand() * 4;
        const spread = maxSpread * (1 - progress * 0.85);
        const x = cx + Math.sin(progress * 4 + i) * 6 + (rand() - 0.5) * spread * 2;
        const r = 4.5 + (1 - progress) * 3 + rand() * 1.5;

        el('ellipse', {
          cx: x, cy: y, rx: r, ry: r * 0.8,
          fill: pick(WISTERIA_COLORS, rand),
          opacity: '0.92'
        }, g);
      }
    }
  }

  /* ================================================================
     6. ENCHANTED AMBIENT HARP / MUSIC SYNTHESIZER
  ================================================================ */
  function initAmbientMusic() {
    const btn = document.getElementById('musicBtn');
    const icon = document.getElementById('musicIcon');
    if (!btn) return;

    let audioCtx = null;
    let isPlaying = false;
    let timerId = null;

    // Romantic garden chord progression (Dmaj7 - F#m7 - Bm7 - Gmaj7)
    const notes = [
      // D Maj arpeggio
      293.66, 369.99, 440.00, 554.37, 587.33,
      // F# min arpeggio
      369.99, 440.00, 554.37, 739.99,
      // B min arpeggio
      246.94, 293.66, 369.99, 440.00, 493.88,
      // G Maj arpeggio
      392.00, 493.88, 587.33, 783.99, 880.00
    ];

    function playNote(freq, time, duration = 1.4) {
      if (!audioCtx) return;
      try {
        const osc = audioCtx.createOscillator();
        const gain = audioCtx.createGain();

        osc.type = 'triangle';
        osc.frequency.setValueAtTime(freq, time);

        // Delicate harp envelope
        gain.gain.setValueAtTime(0, time);
        gain.gain.linearRampToValueAtTime(0.08, time + 0.04);
        gain.gain.exponentialRampToValueAtTime(0.0001, time + duration);

        osc.connect(gain);
        gain.connect(audioCtx.destination);

        osc.start(time);
        osc.stop(time + duration);
      } catch (e) {
        console.error(e);
      }
    }

    let step = 0;
    function scheduleArpeggio() {
      if (!isPlaying || !audioCtx) return;
      const now = audioCtx.currentTime;

      const baseFreq = notes[step % notes.length];
      playNote(baseFreq, now, 1.6);

      // Occasional gentle octave sparkle
      if (step % 3 === 0) {
        playNote(baseFreq * 2, now + 0.15, 1.2);
      }

      step++;
      timerId = setTimeout(scheduleArpeggio, 480);
    }

    function toggle() {
      if (!isPlaying) {
        if (!audioCtx) {
          const AudioContextClass = window.AudioContext || window.webkitAudioContext;
          if (AudioContextClass) audioCtx = new AudioContextClass();
        }
        if (audioCtx && audioCtx.state === 'suspended') {
          audioCtx.resume();
        }
        isPlaying = true;
        btn.classList.add('playing');
        if (icon) icon.textContent = '🔊';
        scheduleArpeggio();
      } else {
        isPlaying = false;
        btn.classList.remove('playing');
        if (icon) icon.textContent = '🎵';
        if (timerId) clearTimeout(timerId);
      }
    }

    btn.addEventListener('click', toggle);
  }

  /* ================================================================
     7. SCROLL REVEAL ANIMATIONS
  ================================================================ */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    if (!('IntersectionObserver' in window)) {
      elements.forEach(el => el.classList.add('is-visible'));
      return;
    }

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('is-visible');
          observer.unobserve(entry.target);
        }
      });
    }, {
      threshold: 0.1,
      rootMargin: '0px 0px -40px 0px'
    });

    elements.forEach(el => observer.observe(el));
  }

  /* ================================================================
     8. RSVP FORM HANDLER WITH SHEETDB INTEGRATION
  ================================================================ */
  const SHEETDB_API_URL = 'https://sheetdb.io/api/v1/amteekrxadb4e';

  function initRsvp() {
    const form = document.getElementById('rsvpForm');
    const success = document.getElementById('rsvpSuccess');
    const errorBox = document.getElementById('rsvpError');
    if (!form) return;

    const nameInput = form.elements['name'];
    const attendanceSelect = form.elements['attendance'];

    function showError(msg, el) {
      if (errorBox) {
        errorBox.textContent = msg;
        errorBox.hidden = false;
      }
      if (el) el.focus();
    }

    function clearError() {
      if (errorBox) {
        errorBox.hidden = true;
        errorBox.textContent = '';
      }
    }

    if (attendanceSelect) attendanceSelect.addEventListener('change', clearError);
    if (nameInput) nameInput.addEventListener('input', clearError);

    form.addEventListener('submit', (e) => {
      e.preventDefault();
      clearError();

      const name = nameInput.value.trim();
      const attendance = attendanceSelect.value;

      if (!name) return showError('Please write your full name.', nameInput);
      if (!attendance) return showError('Please choose your attendance response.', attendanceSelect);

      const submitBtn = form.querySelector('.rsvp-submit-btn');
      if (submitBtn) {
        submitBtn.disabled = true;
        submitBtn.innerHTML = '<span>Recording...</span>';
      }

      fetch(SHEETDB_API_URL, {
        method: 'POST',
        headers: {
          'Accept': 'application/json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          data: [{ name, attendance, timestamp: new Date().toISOString() }]
        })
      })
        .then(res => {
          if (!res.ok) throw new Error('Network error: ' + res.status);
          return res.json();
        })
        .then(() => {
          form.hidden = true;
          if (success) {
            success.hidden = false;
            success.scrollIntoView({ behavior: 'smooth', block: 'center' });
          }
        })
        .catch(err => {
          console.error('RSVP submission error:', err);
          showError('Could not send RSVP. Please check your internet connection and try again.');
          if (submitBtn) {
            submitBtn.disabled = false;
            submitBtn.innerHTML = '<span>Confirm RSVP</span> <span class="btn-stars">✨</span>';
          }
        });
    });
  }

  /* ================================================================
     BOOTSTRAP
  ================================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initEnvelope();
    initTraditionsTabs();
    initFallingPetals();
    initAmbientMusic();
    initScrollReveal();
    initRsvp();

    // Draw wisteria canopies
    const canopies = document.querySelectorAll('[data-wisteria]');
    canopies.forEach(c => buildWisteriaCanopy(c));

    window.addEventListener('resize', () => {
      canopies.forEach(c => buildWisteriaCanopy(c));
    });
  });
}
