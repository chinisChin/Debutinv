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
     2. INTERACTIVE WAX SEAL & ENVELOPE OPENING (POWERED BY GSAP)
  ================================================================ */
  function initEnvelope() {
    const waxSeal = document.getElementById('waxSealBtn');
    const openBtn = document.getElementById('openInviteBtn');
    const envelopeSection = document.getElementById('envelopeSection');
    const card = document.getElementById('envelopeCard');
    const htmlEl = document.documentElement;
    const bodyEl = document.body;

    let isUnlocked = false;

    // Reset scroll to top on load
    if ('scrollRestoration' in history) {
      history.scrollRestoration = 'manual';
    }
    window.scrollTo(0, 0);

    // Strict scroll blockers while envelope is closed
    function blockScroll(e) {
      if (!isUnlocked) {
        e.preventDefault();
      }
    }

    function blockKeyScroll(e) {
      if (!isUnlocked && ['ArrowDown', 'ArrowUp', 'Space', 'PageDown', 'PageUp', 'Home', 'End'].includes(e.code)) {
        e.preventDefault();
      }
    }

    window.addEventListener('wheel', blockScroll, { passive: false });
    window.addEventListener('touchmove', blockScroll, { passive: false });
    window.addEventListener('keydown', blockKeyScroll, { passive: false });

    // Ambient floating on envelope flap and button
    if (window.gsap) {
      const flapArea = document.querySelector('.envelope-flap-area');
      if (flapArea) {
        gsap.to(flapArea, {
          y: -3,
          duration: 2,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
      if (openBtn) {
        gsap.to(openBtn, {
          scale: 1.03,
          duration: 1.6,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }

      // Smooth wax seal hover & click growth
      if (waxSeal) {
        waxSeal.addEventListener('mouseenter', () => {
          if (isUnlocked) return;
          gsap.to(waxSeal, {
            scale: 1.14,
            rotation: 3,
            duration: 0.35,
            ease: 'back.out(2)',
            boxShadow: '0 16px 36px rgba(45, 18, 5, 0.65), 0 0 26px rgba(255, 225, 140, 0.85)'
          });
        });

        waxSeal.addEventListener('mouseleave', () => {
          if (isUnlocked) return;
          gsap.to(waxSeal, {
            scale: 1,
            rotation: 0,
            duration: 0.35,
            ease: 'power2.out',
            boxShadow: '0 10px 24px rgba(45, 18, 5, 0.5)'
          });
        });

        waxSeal.addEventListener('mousedown', () => {
          if (isUnlocked) return;
          gsap.to(waxSeal, {
            scale: 1.22,
            rotation: 6,
            duration: 0.2,
            ease: 'back.out(2)',
            boxShadow: '0 20px 42px rgba(45, 18, 5, 0.75), 0 0 35px rgba(255, 230, 150, 0.95)'
          });
        });

        waxSeal.addEventListener('touchstart', () => {
          if (isUnlocked) return;
          gsap.to(waxSeal, {
            scale: 1.18,
            rotation: 5,
            duration: 0.2,
            ease: 'back.out(1.8)'
          });
        }, { passive: true });
      }
    }

    function openInvite() {
      if (isUnlocked) return;
      isUnlocked = true;

      // Remove scroll blockers
      window.removeEventListener('wheel', blockScroll);
      window.removeEventListener('touchmove', blockScroll);
      window.removeEventListener('keydown', blockKeyScroll);

      // Unlock page scrolling
      htmlEl.classList.remove('invitation-locked');
      bodyEl.classList.remove('invitation-locked');

      // Automatically start "Sabihin Mo Na" background music
      try {
        window.dispatchEvent(new CustomEvent('debut:open-invite'));
      } catch (e) {}

      // Scroll to the top of invitation content
      window.scrollTo({ top: 0, behavior: 'smooth' });

      // Reveal the invitation page with a gentle rise from below.
      const revealInvitation = () => {
        document.documentElement.classList.add('invitation-revealed');
        if (envelopeSection) envelopeSection.style.pointerEvents = 'none';
        // The rise runs for 1.1s; recalculate triggers once it has settled.
        if (window.ScrollTrigger) {
          setTimeout(() => ScrollTrigger.refresh(), 1200);
        }
      };

      // GSAP Opening Cinematic Timeline
      if (window.gsap) {
        // Let GSAP drive the envelope fade; its CSS transition is for the fallback.
        if (envelopeSection) envelopeSection.style.transition = 'none';

        const tl = gsap.timeline({
          onComplete: () => {
            if (envelopeSection) envelopeSection.style.display = 'none';
          }
        });

        if (waxSeal) {
          waxSeal.classList.add('wax-seal--cracked');
          tl.to(waxSeal, {
            scale: 1.28,
            rotation: 12,
            duration: 0.28,
            ease: 'back.out(2)'
          });
        }

        if (card) {
          tl.to(card, {
            y: -55,
            scale: 0.9,
            opacity: 0,
            duration: 0.65,
            ease: 'power2.inOut'
          }, '-=0.1');
        }

        if (envelopeSection) {
          tl.to(envelopeSection, {
            opacity: 0,
            duration: 0.55,
            ease: 'power1.out'
          }, '-=0.35');
        }

        // Cross-fade into the invitation while the envelope's last sliver fades away.
        tl.call(revealInvitation, null, '-=0.18');
      } else {
        // Fallback without GSAP
        if (waxSeal) waxSeal.classList.add('wax-seal--cracked');
        if (envelopeSection) {
          envelopeSection.classList.add('is-opened');
          setTimeout(() => {
            envelopeSection.style.display = 'none';
            revealInvitation();
          }, 850);
        }
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
     6. BACKGROUND MUSIC CONTROLLER (Yeng Constantino - Sabihin Mo Na)
  ================================================================ */
  function initAmbientMusic() {
    const btn = document.getElementById('musicBtn');
    const icon = document.getElementById('musicIcon');
    let audio = document.getElementById('bgMusic');

    if (!audio) {
      audio = new Audio('sabihin-mo-na.mp3');
      audio.id = 'bgMusic';
      audio.loop = true;
      document.body.appendChild(audio);
    }

    audio.volume = 0.75;

    let isPlaying = false;
    let userHasInteracted = false;

    function updateUi(playing) {
      isPlaying = playing;
      if (btn) {
        if (playing) {
          btn.classList.add('playing');
          btn.setAttribute('title', 'Pause: Yeng Constantino - Sabihin Mo Na');
          btn.setAttribute('aria-label', 'Pause background music');
          if (icon) icon.textContent = '🔊';
        } else {
          btn.classList.remove('playing');
          btn.setAttribute('title', 'Play: Yeng Constantino - Sabihin Mo Na');
          btn.setAttribute('aria-label', 'Play background music');
          if (icon) icon.textContent = '🎵';
        }
      }
    }

    function playAudio() {
      if (!audio) return;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise
          .then(() => {
            updateUi(true);
          })
          .catch((err) => {
            // Autoplay blocked by browser policy until user interacts
            console.log('Audio autoplay prevented until user interaction:', err);
            updateUi(false);
          });
      }
    }

    function pauseAudio() {
      if (!audio) return;
      audio.pause();
      updateUi(false);
    }

    function toggleAudio() {
      userHasInteracted = true;
      if (audio.paused) {
        playAudio();
      } else {
        pauseAudio();
      }
    }

    if (btn) {
      btn.addEventListener('click', (e) => {
        e.stopPropagation();
        toggleAudio();
      });
    }

    // Audio native events keep UI strictly in sync
    audio.addEventListener('play', () => updateUi(true));
    audio.addEventListener('pause', () => updateUi(false));
    audio.addEventListener('ended', () => updateUi(false));

    // When the invitation envelope / wax seal is opened, start the song automatically
    window.addEventListener('debut:open-invite', () => {
      userHasInteracted = true;
      if (audio.paused) {
        playAudio();
      }
    });

    // Also auto-start on first click/touch on the page if user hasn't explicitly paused
    function onFirstInteraction() {
      if (!userHasInteracted && audio.paused) {
        userHasInteracted = true;
        playAudio();
      }
      document.removeEventListener('click', onFirstInteraction);
      document.removeEventListener('touchstart', onFirstInteraction);
    }

    document.addEventListener('click', onFirstInteraction, { once: true, passive: true });
    document.addEventListener('touchstart', onFirstInteraction, { once: true, passive: true });
  }

    /* ================================================================
     7. SCROLL REVEAL ANIMATIONS (POWERED BY GSAP SCROLLTRIGGER)
  ================================================================ */
  function initScrollReveal() {
    const elements = document.querySelectorAll('.reveal');
    if (!elements.length) return;

    // Enhanced with GSAP ScrollTrigger if available
    if (window.gsap && window.ScrollTrigger) {
      gsap.registerPlugin(ScrollTrigger);

      elements.forEach((el) => {
        gsap.fromTo(
          el,
          { opacity: 0, y: 35 },
          {
            opacity: 1,
            y: 0,
            duration: 0.85,
            ease: 'power2.out',
            scrollTrigger: {
              trigger: el,
              start: 'top 88%',
              toggleActions: 'play none none none',
              once: true
            }
          }
        );
      });

      // Ambient subtle float on hero mirror portrait
      const mirror = document.querySelector('.hero-portrait-frame');
      if (mirror) {
        gsap.to(mirror, {
          y: -8,
          duration: 3.5,
          repeat: -1,
          yoyo: true,
          ease: 'sine.inOut'
        });
      }
      return;
    }

    // Native fallback with IntersectionObserver
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
     GOLDEN THREAD GARDEN — one metallic-gold thread drifts in from a
     screen edge, slowly writes a single flower outline, lets it glow
     for five seconds, then dissolves as the next thread begins.
     Only one or two threads are ever active, so the screen stays calm.
  ================================================================ */
  function initGoldGardenCanvas() {
    const canvas = document.getElementById('goldWaveCanvas');
    if (!canvas) return;
    const ctx = canvas.getContext('2d', { alpha: true });
    if (!ctx) return;

    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    const rand = rng(1806);
    const TAU = Math.PI * 2;
    const clamp01 = (v) => (v < 0 ? 0 : v > 1 ? 1 : v);
    const easeInOut = (t) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

    const STEP = 4;          // spacing between sampled path points (px)
    const HOLD_DUR = 5;      // the flower rests, glowing, for five seconds
    const GOLD_LIGHT = '#fff3c4';
    const GOLD_CORE = '#fff8dc';

    let W = 0;
    let H = 0;
    let goldGradient = null;
    let flowers = [];
    let lastBorder = null;
    let time = 0;
    let last = 0;
    let rafId = 0;

    function resize() {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      W = canvas.clientWidth || window.innerWidth;
      H = canvas.clientHeight || window.innerHeight;
      canvas.width = Math.max(1, Math.floor(W * dpr));
      canvas.height = Math.max(1, Math.floor(H * dpr));
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

      // subtle metallic variation across the canvas
      goldGradient = ctx.createLinearGradient(0, 0, W, 0);
      goldGradient.addColorStop(0.0, '#c9943a');
      goldGradient.addColorStop(0.14, '#f2cf7a');
      goldGradient.addColorStop(0.3, '#d9a441');
      goldGradient.addColorStop(0.5, '#ffdf92');
      goldGradient.addColorStop(0.68, '#c9943a');
      goldGradient.addColorStop(0.85, '#f2cf7a');
      goldGradient.addColorStop(1.0, '#d9a441');

      // paths are in viewport pixels, so rebuild on a size change
      flowers = [];
    }

    /* ---------- path helpers ------------------------------------- */

    function resample(raw, step) {
      if (!raw.length) return [];
      const out = [{ x: raw[0].x, y: raw[0].y }];
      let prev = raw[0];
      let carry = 0;

      for (let i = 1; i < raw.length; i++) {
        const cur = raw[i];
        let dx = cur.x - prev.x;
        let dy = cur.y - prev.y;
        let seg = Math.hypot(dx, dy);

        while (carry + seg >= step && seg > 1e-6) {
          const t = (step - carry) / seg;
          const nx = prev.x + dx * t;
          const ny = prev.y + dy * t;
          out.push({ x: nx, y: ny });
          prev = { x: nx, y: ny };
          dx = cur.x - prev.x;
          dy = cur.y - prev.y;
          seg = Math.hypot(dx, dy);
          carry = 0;
        }
        carry += seg;
        prev = cur;
      }

      const end = raw[raw.length - 1];
      const lastPt = out[out.length - 1];
      if (Math.hypot(end.x - lastPt.x, end.y - lastPt.y) > step * 0.25) {
        out.push({ x: end.x, y: end.y });
      }
      return out;
    }

    function buildApproach(entry, center) {
      const dx = center.x - entry.x;
      const dy = center.y - entry.y;
      const dist = Math.hypot(dx, dy) || 1;
      const nx = -dy / dist;
      const ny = dx / dist;
      const amp = Math.min(88, Math.max(26, dist * 0.16));
      const phase = rand() * TAU;
      const bends = 2.1 + rand() * 1.2;
      const steps = Math.max(64, Math.ceil(dist / 7));
      const raw = [];

      for (let i = 0; i <= steps; i++) {
        const t = i / steps;
        const taper = Math.pow(Math.sin(Math.PI * t), 1.15);
        const wave =
          (Math.sin(t * Math.PI * bends + phase) * amp +
            Math.sin(t * Math.PI * bends * 1.9 + phase * 1.7) * amp * 0.26) *
          taper;
        raw.push({
          x: entry.x + dx * t + nx * wave,
          y: entry.y + dy * t + ny * wave
        });
      }
      raw[raw.length - 1] = { x: center.x, y: center.y };
      return raw;
    }

    function buildFlowerRaw(f) {
      const raw = [{ x: f.cx, y: f.cy }];
      let currentAngle = f.petals[0].angle;
      let first = true;

      f.petals.forEach((petal) => {
        const baseR = petal.base;

        if (first) {
          raw.push({
            x: f.cx + Math.cos(petal.angle) * baseR,
            y: f.cy + Math.sin(petal.angle) * baseR
          });
          first = false;
        } else {
          // ease inward from the last petal's heart to this one's base
          const last = raw[raw.length - 1];
          const bx = f.cx + Math.cos(petal.angle) * baseR;
          const by = f.cy + Math.sin(petal.angle) * baseR;
          const mx = (last.x + bx) * 0.5;
          const my = (last.y + by) * 0.5;
          const qx = mx + (f.cx - mx) * 0.35;
          const qy = my + (f.cy - my) * 0.35;
          for (let s = 1; s <= 5; s++) {
            const t = s / 5;
            const it = 1 - t;
            raw.push({
              x: it * it * last.x + 2 * it * t * qx + t * t * bx,
              y: it * it * last.y + 2 * it * t * qy + t * t * by
            });
          }
        }

        // the petal itself, one continuous loop out to the tip and back
        const petalSteps = Math.max(26, Math.ceil(petal.length / 2.6));
        for (let s = 0; s <= petalSteps; s++) {
          const t = (s / petalSteps) * TAU;
          const u = baseR + petal.length * (0.5 - 0.5 * Math.cos(t));
          const v =
            petal.width *
            Math.sin(t) *
            (0.32 + 0.68 * (0.5 + 0.5 * Math.cos(t)));
          const ca = Math.cos(petal.angle);
          const sa = Math.sin(petal.angle);
          raw.push({
            x: f.cx + u * ca - v * sa,
            y: f.cy + u * sa + v * ca
          });
        }
        currentAngle = petal.angle;
      });

      // finish with a small spiral at the heart of the bloom
      const turns = f.type === 'rose' ? 2.1 : 1.35;
      const spiralSteps = 84;
      const startR = f.size * 0.085;
      for (let s = 1; s <= spiralSteps; s++) {
        const t = s / spiralSteps;
        const a = currentAngle + t * TAU * turns;
        const r = Math.max(1.4, startR * (1 - t));
        raw.push({ x: f.cx + Math.cos(a) * r, y: f.cy + Math.sin(a) * r });
      }
      return raw;
    }

    function layersFor(type) {
      if (type === 'lotus') {
        return [
          { count: 7, len: 1.0, wid: 0.34, off: 0.0 },
          { count: 5, len: 0.72, wid: 0.25, off: 0.5 },
          { count: 4, len: 0.46, wid: 0.17, off: 0.25 }
        ];
      }
      if (type === 'peony') {
        return [
          { count: 6, len: 0.96, wid: 0.35, off: 0.0 },
          { count: 5, len: 0.7, wid: 0.26, off: 0.5 },
          { count: 4, len: 0.45, wid: 0.18, off: 0.25 }
        ];
      }
      return [
        { count: 5, len: 0.98, wid: 0.4, off: 0.0 },
        { count: 4, len: 0.72, wid: 0.31, off: 0.5 },
        { count: 3, len: 0.47, wid: 0.22, off: 0.25 }
      ];
    }

    function choosePosition(size) {
      const padX = size * 0.92;
      const padY = size * 1.02;
      let best = null;
      let bestDist = -1;

      // On wide screens, let the next bloom drift to the quieter side.
      let preferLeft = null;
      if (W > 760 && flowers.length) {
        const anchor = flowers[flowers.length - 1];
        preferLeft = anchor.cx > W / 2;
      }

      for (let attempt = 0; attempt < 18; attempt++) {
        let cx;
        if (W > 760) {
          // stay near the side gutters so the centered card never hides it
          const contentHalf = Math.min(310, W * 0.33);
          const sideRoom = Math.max(20, W / 2 - contentHalf);
          let left;
          if (preferLeft === null) {
            left = rand() < 0.5;
          } else {
            left = rand() < 0.82 ? preferLeft : !preferLeft;
          }
          const edge = Math.min(
            sideRoom,
            padX + rand() * Math.max(1, sideRoom - padX)
          );
          cx = left ? edge : W - edge;
        } else {
          cx = padX + rand() * Math.max(1, W - padX * 2);
        }
        const cy = padY + rand() * Math.max(1, H - padY * 2);

        let minDist = Infinity;
        for (let i = 0; i < flowers.length; i++) {
          minDist = Math.min(
            minDist,
            Math.hypot(cx - flowers[i].cx, cy - flowers[i].cy)
          );
        }

        if (minDist > bestDist) {
          bestDist = minDist;
          best = { cx, cy };
        }
        if (minDist > (size + (flowers[0] ? flowers[0].size : 0)) * 0.95) {
          break;
        }
      }
      return best || { cx: W * 0.5, cy: H * 0.5 };
    }

    function entryPoint(border) {
      const m = 34;
      if (border === 'top') return { x: rand() * W, y: -m };
      if (border === 'bottom') return { x: rand() * W, y: H + m };
      if (border === 'left') return { x: -m, y: rand() * H };
      return { x: W + m, y: rand() * H };
    }

    function makeFlower() {
      const type = pick(['rose', 'peony', 'lotus'], rand);
      const size = Math.min(
        Math.max(110, Math.min(W, H) * (0.13 + rand() * 0.17)),
        300
      );
      const pos = choosePosition(size);

      const pool = ['top', 'bottom', 'left', 'right'].filter(
        (b) => b !== lastBorder
      );
      const border = pick(
        pool.length ? pool : ['top', 'bottom', 'left', 'right'],
        rand
      );
      lastBorder = border;
      const entry = entryPoint(border);

      const layers = layersFor(type);
      const rotation = (rand() - 0.5) * 0.5;
      const petals = [];
      layers.forEach((layer, li) => {
        for (let j = 0; j < layer.count; j++) {
          const angle =
            rotation +
            (j / layer.count) * TAU +
            layer.off * (TAU / layer.count) +
            li * 0.16;
          petals.push({
            angle,
            base: size * (0.085 + li * 0.032),
            length: size * layer.len * (0.9 + rand() * 0.16),
            width: size * layer.wid * (0.87 + rand() * 0.22)
          });
        }
      });

      const flower = {
        cx: pos.cx,
        cy: pos.cy,
        size,
        type,
        petals,
        rotation,
        border,
        entry
      };

      const approachPts = resample(
        buildApproach(entry, { x: flower.cx, y: flower.cy }),
        STEP
      );
      const flowerPts = resample(buildFlowerRaw(flower), STEP);
      const points = approachPts.concat(flowerPts.slice(1));

      const approachCount = approachPts.length - 1;
      const approachLength = Math.max(STEP, approachCount * STEP);
      const flowerLength = Math.max(STEP, (flowerPts.length - 1) * STEP);
      const totalLength = approachLength + flowerLength;

      // the outline takes roughly six to eight seconds to write
      const flowerDuration = 5.5 + (size / 290) * 2.0 + rand() * 0.8;
      const approachDuration = 1.5 + rand() * 0.8;

      return {
        ...flower,
        points,
        approachCount,
        approachLength,
        flowerLength,
        totalLength,
        progress: 0,
        approachSpeed: approachLength / approachDuration,
        flowerSpeed: flowerLength / flowerDuration,
        state: 'draw',
        drawStart: time,
        holdStart: 0,
        dissolveStart: 0,
        holdDur: HOLD_DUR,
        dissolveDur: 2.6 + rand() * 0.8,
        alpha: 1,
        seed: rand() * 1000
      };
    }

    /* ---------- animation --------------------------------------- */

    function update(dt) {
      const drawing = flowers.some((f) => f.state === 'draw');
      const holding = flowers.some((f) => f.state === 'hold');
      const dissolving = flowers.some((f) => f.state === 'dissolve');

      if (!drawing && !dissolving) {
        if (holding) {
          // the resting flower is still glowing: begin the next thread
          flowers.push(makeFlower());
        } else if (flowers.length === 0 && time > 0.7) {
          flowers.push(makeFlower());
        }
      }

      for (let i = flowers.length - 1; i >= 0; i--) {
        const f = flowers[i];

        if (f.state === 'draw') {
          const ramp = clamp01((time - f.drawStart) / 0.7);
          const ease = ramp * ramp * (3 - 2 * ramp);

          let speed;
          if (f.progress < f.approachLength) {
            speed = f.approachSpeed;
          } else {
            const t = clamp01(
              (f.progress - f.approachLength) /
                Math.max(1, f.flowerLength * 0.12)
            );
            speed = f.approachSpeed * (1 - t) + f.flowerSpeed * t;
          }

          const remaining = f.totalLength - f.progress;
          const finish = remaining < 180 ? 0.4 + 0.6 * (remaining / 180) : 1;

          f.progress = Math.min(
            f.totalLength,
            f.progress + speed * ease * finish * dt
          );

          if (f.progress >= f.totalLength - 0.01) {
            f.progress = f.totalLength;
            f.state = 'hold';
            f.holdStart = time;
          }
        } else if (f.state === 'hold') {
          if (time - f.holdStart >= f.holdDur) {
            f.state = 'dissolve';
            f.dissolveStart = time;
          }
        } else {
          const t = clamp01((time - f.dissolveStart) / f.dissolveDur);
          f.alpha = 1 - easeInOut(t);
          if (t >= 1) flowers.splice(i, 1);
        }
      }
    }

    /* ---------- drawing ----------------------------------------- */

    function traceRange(points, start, end, head) {
      const n = points.length;
      if (!n) return false;
      start = Math.max(0, Math.min(n - 1, start));
      end = Math.max(start, Math.min(n - 1, end));
      ctx.beginPath();
      ctx.moveTo(points[start].x, points[start].y);
      for (let i = start + 1; i <= end; i++) {
        ctx.lineTo(points[i].x, points[i].y);
      }
      if (head && end < n - 1) ctx.lineTo(head.x, head.y);
      return true;
    }

    function paintTrail(f, start, end, head, strength) {
      if (f.alpha <= 0.001) return;
      const n = f.points.length;
      start = Math.max(0, Math.min(n - 1, start));
      end = Math.max(0, Math.min(n - 1, end));
      if (end < start) return;
      if (end === start && !head) return;

      traceRange(f.points, start, end, head);
      const a = strength * f.alpha;

      ctx.strokeStyle = goldGradient;
      ctx.globalAlpha = a * 0.1;
      ctx.lineWidth = 3.2;
      ctx.stroke();

      ctx.globalAlpha = a;
      ctx.lineWidth = 1.0;
      ctx.stroke();

      ctx.globalAlpha = a * 0.5;
      ctx.strokeStyle = GOLD_LIGHT;
      ctx.lineWidth = 0.45;
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.strokeStyle = goldGradient;
    }

    function paintShimmer(f, drawnIdx) {
      if (f.alpha <= 0.01 || drawnIdx < 2) return;
      const drawnDist = drawnIdx * STEP;
      const travel = (time * 150 + f.seed) % Math.max(1, drawnDist);
      const center = Math.floor(travel / STEP);
      const half = 15;
      const start = Math.max(0, center - half);
      const end = Math.min(drawnIdx, center + half);
      if (end - start < 2) return;

      traceRange(f.points, start, end, null);
      const pulse = 0.72 + 0.28 * Math.sin(time * 1.15 + f.seed);

      ctx.strokeStyle = GOLD_LIGHT;
      ctx.globalAlpha = 0.12 * f.alpha * pulse;
      ctx.lineWidth = 3.0;
      ctx.stroke();

      ctx.globalAlpha = 0.4 * f.alpha * pulse;
      ctx.lineWidth = 0.7;
      ctx.stroke();

      ctx.globalAlpha = 1;
      ctx.strokeStyle = goldGradient;
    }

    function paintHalo(f) {
      if (f.alpha <= 0.01) return;
      let a = 0.03 * f.alpha;
      if (f.state === 'draw') {
        a *= clamp01(
          (f.progress - f.approachLength) / Math.max(1, f.flowerLength)
        );
      }
      if (a <= 0.001) return;

      const r = f.size * 1.0;
      const g = ctx.createRadialGradient(f.cx, f.cy, 0, f.cx, f.cy, r);
      g.addColorStop(0, 'rgba(255, 240, 184, ' + a.toFixed(4) + ')');
      g.addColorStop(0.55, 'rgba(214, 175, 88, ' + (a * 0.45).toFixed(4) + ')');
      g.addColorStop(1, 'rgba(214, 175, 88, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(f.cx - r, f.cy - r, r * 2, r * 2);
    }

    function paintHead(f, head) {
      if (f.state !== 'draw' || f.alpha <= 0.01) return;
      const remaining = f.totalLength - f.progress;
      const fade = clamp01(remaining / Math.max(40, f.flowerSpeed * 0.3));
      if (fade <= 0.01) return;

      const r = 12;
      const g = ctx.createRadialGradient(head.x, head.y, 0, head.x, head.y, r);
      g.addColorStop(0, 'rgba(255, 247, 214, ' + (0.26 * fade).toFixed(4) + ')');
      g.addColorStop(0.34, 'rgba(255, 230, 163, ' + (0.11 * fade).toFixed(4) + ')');
      g.addColorStop(1, 'rgba(255, 230, 163, 0)');
      ctx.fillStyle = g;
      ctx.fillRect(head.x - r, head.y - r, r * 2, r * 2);

      ctx.globalAlpha = 0.9 * fade;
      ctx.fillStyle = GOLD_CORE;
      ctx.beginPath();
      ctx.arc(head.x, head.y, 1.5, 0, TAU);
      ctx.fill();
      ctx.globalAlpha = 1;
    }

    function render() {
      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = 'lighter';
      ctx.lineCap = 'round';
      ctx.lineJoin = 'round';

      flowers.forEach((f) => {
        if (f.alpha <= 0.001) return;

        ctx.save();

        // after the five-second rest, drift and dissolve the whole thread
        if (f.state === 'dissolve') {
          const t = clamp01((time - f.dissolveStart) / f.dissolveDur);
          const e = easeInOut(t);
          ctx.translate(f.cx, f.cy - 16 * e);
          ctx.rotate(0.05 * e);
          ctx.scale(1 + 0.06 * e, 1 + 0.06 * e);
          ctx.translate(-f.cx, -f.cy);
        }

        paintHalo(f);

        const drawnDist = f.state === 'draw' ? f.progress : f.totalLength;
        const n = f.points.length;
        const drawnIdx = Math.min(n - 1, Math.floor(drawnDist / STEP));
        const hi = Math.min(n - 2, Math.max(0, drawnIdx));
        const frac = clamp01(drawnDist / STEP - hi);
        const p0 = f.points[hi];
        const p1 = f.points[hi + 1] || p0;
        const head = {
          x: p0.x + (p1.x - p0.x) * frac,
          y: p0.y + (p1.y - p0.y) * frac
        };
        const useHead = f.state === 'draw' && drawnIdx < n - 1 ? head : null;

        const pulse =
          f.state === 'hold'
            ? 0.9 + 0.1 * Math.sin(time * 0.85 + f.seed)
            : 1;
        const approachIdx = f.approachCount;

        if (drawnIdx <= approachIdx) {
          paintTrail(f, 0, drawnIdx, head, 0.34 * pulse);
        } else {
          paintTrail(f, 0, approachIdx, null, 0.34 * pulse);
          paintTrail(f, approachIdx, drawnIdx, useHead, 0.78 * pulse);
        }

        paintShimmer(f, drawnIdx);
        paintHead(f, head);

        ctx.restore();
      });

      ctx.globalCompositeOperation = 'source-over';
    }

    function frame(now) {
      rafId = requestAnimationFrame(frame);
      if (!last) last = now;
      const dt = Math.min((now - last) / 1000, 0.05);
      last = now;
      time += dt;
      update(dt);
      render();
    }

    function buildStatic() {
      flowers = [];
      const f = makeFlower();
      f.state = 'hold';
      f.progress = f.totalLength;
      f.alpha = 0.65;
      f.holdStart = 0;
      f.dissolveStart = 0;
      flowers = [f];
    }

    function start() {
      resize();
      if (reduced) {
        buildStatic();
        render();
        return;
      }
      render();
      if (!rafId) rafId = requestAnimationFrame(frame);
    }

    if (reduced) {
      window.addEventListener('resize', () => {
        resize();
        buildStatic();
        render();
      });
    } else {
      let resizeTimer = 0;
      window.addEventListener('resize', () => {
        clearTimeout(resizeTimer);
        resizeTimer = setTimeout(() => {
          resize();
          last = 0;
          render();
        }, 160);
      });
      document.addEventListener('visibilitychange', () => {
        if (document.hidden) {
          if (rafId) cancelAnimationFrame(rafId);
          rafId = 0;
        } else if (!rafId) {
          last = 0;
          rafId = requestAnimationFrame(frame);
        }
      });
    }

    start();
  }

  /* ================================================================
     BOOTSTRAP
  ================================================================ */
  document.addEventListener('DOMContentLoaded', () => {
    initCountdown();
    initEnvelope();
    initTraditionsTabs();
    initFallingPetals();
    initGoldGardenCanvas();
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
