/* assets/app.js
   FULL DROP-IN REPLACEMENT
   - Portrait fallback
   - Hero swap text
   - DotBanner: BITMAP LED single-stroke pixels + writing animation
   - Draggable emoji bubbles
*/

(function () {
  "use strict";

  // ----------------------------
  // portrait fallback
  // ----------------------------
  const img = document.querySelector(".portrait-img");
  const fb = document.querySelector(".portrait-fallback");

  if (img && fb) {
    img.addEventListener("load", () => {
      fb.style.display = "none";
      img.classList.remove("broken");
    });

    img.addEventListener("error", () => {
      fb.style.display = "block";
      img.classList.add("broken");
    });
  }

  // ----------------------------
  // cycleText helper (for hero swap only)
  // ----------------------------
  function cycleText(el, interval) {
    const words = (el.getAttribute("data-words") || "")
      .split(",")
      .map((s) => s.trim())
      .filter(Boolean);

    if (!words.length) return;

    // keep width stable (your old behavior)
    if (el.classList.contains("swap")) {
      const longest = words.reduce(
        (a, b) => (a.length > b.length ? a : b),
        words[0]
      );
      el.style.minWidth = Math.max(190, longest.length * 11) + "px";
    }

    const GLYPHS = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789#@!&';
    function scrambleTo(target) {
      const len = target.length;
      let f = 0;
      const frames = 18;
      (function tick() {
        f++;
        const settled = Math.floor((f / frames) * len);
        let out = '';
        for (let c = 0; c < len; c++) {
          out += c < settled
            ? target[c]
            : (target[c] === ' ' ? ' ' : GLYPHS[Math.floor(Math.random() * GLYPHS.length)]);
        }
        el.textContent = out;
        if (f < frames) requestAnimationFrame(tick);
        else el.textContent = target;
      })();
    }

    let i = 0;
    el.textContent = words[i];

    setInterval(() => {
      i = (i + 1) % words.length;
      el.classList.remove("enter");
      void el.offsetWidth;
      el.classList.add("enter");
      scrambleTo(words[i]);
    }, interval);
  }

  // hero swap
  const heroSwap = document.querySelector(".swap");
  if (heroSwap) cycleText(heroSwap, 1600);
})();

// =========================
// Dot-grid banner (BITMAP / LED)
// Single-stroke pixels + "writing" reveal
// NO fonts, NO sampling, NO thinning
// =========================
// =========================
// Dot-grid banner (BITMAP / LED)
// Full grid fill + stroke-like writing animation
// =========================
(function () {
  "use strict";

  const banner = document.getElementById("dotBanner");
  if (!banner) return;

  const canvas = banner.querySelector(".dotcanvas");
  if (!canvas) return;

  const ctx = canvas.getContext("2d", { alpha: true });

  const words = (banner.getAttribute("data-words") || "")
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean);

  // -------------------------
  // 5x7 bitmap font (single-stroke looking)
  // -------------------------
  const FONT = {
    " ": ["00000","00000","00000","00000","00000","00000","00000"],
    "&": ["01100","10010","10100","01000","10101","10010","01101"],

    "A": ["01110","10001","10001","11111","10001","10001","10001"],
    "B": ["11110","10001","10001","11110","10001","10001","11110"],
    "C": ["01111","10000","10000","10000","10000","10000","01111"],
    "D": ["11110","10001","10001","10001","10001","10001","11110"],
    "E": ["11111","10000","10000","11110","10000","10000","11111"],
    "F": ["11111","10000","10000","11110","10000","10000","10000"],
    "G": ["01111","10000","10000","10011","10001","10001","01111"],
    "H": ["10001","10001","10001","11111","10001","10001","10001"],
    "I": ["01110","00100","00100","00100","00100","00100","01110"],
    "J": ["00011","00001","00001","00001","10001","10001","01110"],
    "K": ["10001","10010","10100","11000","10100","10010","10001"],
    "L": ["10000","10000","10000","10000","10000","10000","11111"],
    "M": ["10001","11011","10101","10101","10001","10001","10001"],
    "N": ["10001","11001","10101","10011","10001","10001","10001"],
    "O": ["01110","10001","10001","10001","10001","10001","01110"],
    "P": ["11110","10001","10001","11110","10000","10000","10000"],
    "Q": ["01110","10001","10001","10001","10101","10010","01101"],
    "R": ["11110","10001","10001","11110","10100","10010","10001"],
    "S": ["01111","10000","10000","01110","00001","00001","11110"],
    "T": ["11111","00100","00100","00100","00100","00100","00100"],
    "U": ["10001","10001","10001","10001","10001","10001","01110"],
    "V": ["10001","10001","10001","10001","10001","01010","00100"],
    "W": ["10001","10001","10001","10101","10101","11011","10001"],
    "X": ["10001","10001","01010","00100","01010","10001","10001"],
    "Y": ["10001","10001","01010","00100","00100","00100","00100"],
    "Z": ["11111","00001","00010","00100","01000","10000","11111"],

    "0": ["01110","10001","10011","10101","11001","10001","01110"],
    "1": ["00100","01100","00100","00100","00100","00100","01110"],
    "2": ["01110","10001","00001","00010","00100","01000","11111"],
    "3": ["11110","00001","00001","01110","00001","00001","11110"],
    "4": ["00010","00110","01010","10010","11111","00010","00010"],
    "5": ["11111","10000","10000","11110","00001","00001","11110"],
    "6": ["01110","10000","10000","11110","10001","10001","01110"],
    "7": ["11111","00001","00010","00100","01000","01000","01000"],
    "8": ["01110","10001","10001","01110","10001","10001","01110"],
    "9": ["01110","10001","10001","01111","00001","00001","01110"],
  };

  const ROWS = 7;
  const GLYPH_W = 5;
  const GAP_COLS = 1;

  // -------------------------
  // Tuning (what you asked for)
  // -------------------------
  const DIM_ALPHA = 0.10;
  const BRIGHT_ALPHA = 0.95;

  const TILE_PX = 14;        // overall grid size (bigger = fewer squares)
  const GAP_PX  = 2;         // visible gap between squares
  const RADIUS_FRAC = 0.18;  // rounded corners

  const WRITE_SPEED = 30;   // faster (cells per second)
  const HOLD_MS = 550;

  // -------------------------
  // state
  // -------------------------
  let wordIndex = 0;
  let cols = 0, rows = 0;
  let tile = 0, dot = 0;
  let startX = 0, startY = 0;

  let lit = null;            // Uint8Array rows*cols (final lit cells)
  let order = [];            // array of indices to light in "stroke" order
  let k = 0;                 // animation pointer
  let rafId = null;
  let lastTs = 0;
  let holdTimer = null;

  function resizeCanvas() {
    const dpr = Math.max(1, Math.min(2, window.devicePixelRatio || 1));
    const rect = banner.getBoundingClientRect();

    canvas.width = Math.max(1, Math.round(rect.width * dpr));
    canvas.height = Math.max(1, Math.round(rect.height * dpr));
    canvas.dataset.dpr = String(dpr);

    // FULL-PANEL GRID:
    tile = Math.max(8, Math.round(TILE_PX * dpr));
    dot = Math.max(2, tile - Math.round(GAP_PX * dpr)); // squares slightly apart

    cols = Math.max(1, Math.floor(canvas.width / tile));
    rows = Math.max(1, Math.floor(canvas.height / tile));

    // center grid inside banner
    startX = Math.floor((canvas.width - cols * tile) / 2);
    startY = Math.floor((canvas.height - rows * tile) / 2);
  }

  function roundRect(c, x, y, s, r) {
    if (r <= 0) {
      c.fillRect(x, y, s, s);
      return;
    }
    const rr = Math.min(r, s / 2);
    c.beginPath();
    c.moveTo(x + rr, y);
    c.arcTo(x + s, y, x + s, y + s, rr);
    c.arcTo(x + s, y + s, x, y + s, rr);
    c.arcTo(x, y + s, x, y, rr);
    c.arcTo(x, y, x + s, y, rr);
    c.closePath();
    c.fill();
  }

  function drawDimGrid() {
    const rad = Math.floor(dot * RADIUS_FRAC);
    ctx.fillStyle = `rgba(255,255,255,${DIM_ALPHA})`;

    for (let r = 0; r < rows; r++) {
      for (let c = 0; c < cols; c++) {
        const x = startX + c * tile + Math.floor((tile - dot) / 2);
        const y = startY + r * tile + Math.floor((tile - dot) / 2);
        roundRect(ctx, x, y, dot, rad);
      }
    }
  }

  function drawLit(upto) {
    const rad = Math.floor(dot * RADIUS_FRAC);
    ctx.fillStyle = `rgba(255,255,255,${BRIGHT_ALPHA})`;

    const count = Math.min(upto, order.length);
    for (let i = 0; i < count; i++) {
      const idx = order[i];
      const r = Math.floor(idx / cols);
      const c = idx - r * cols;
      const x = startX + c * tile + Math.floor((tile - dot) / 2);
      const y = startY + r * tile + Math.floor((tile - dot) / 2);
      roundRect(ctx, x, y, dot, rad);
    }
  }

  // build lit[] and order[] for a word, centered in the FULL grid
  function buildWord(wordRaw) {
    const text = (wordRaw || "").toUpperCase();

    // clear final lit mask
    lit = new Uint8Array(rows * cols);

    // scale font into grid rows: keep it big but not spilling
    const scale = Math.max(1, Math.floor((rows - 2) / ROWS)); // 1..N
    const glyphW = GLYPH_W * scale;
    const glyphH = ROWS * scale;
    const gapW = GAP_COLS * scale;

    const textW = text.length * glyphW + Math.max(0, text.length - 1) * gapW;

    // center text in grid
    const baseX = Math.max(0, Math.floor((cols - textW) / 2));
    const baseY = Math.max(0, Math.floor((rows - glyphH) / 2));

    // helper: set a scaled block in lit[]
    function setBlock(x, y) {
      for (let yy = 0; yy < scale; yy++) {
        for (let xx = 0; xx < scale; xx++) {
          const gx = x + xx;
          const gy = y + yy;
          if (gx < 0 || gx >= cols || gy < 0 || gy >= rows) continue;
          lit[gy * cols + gx] = 1;
        }
      }
    }

    // build per-glyph stroke order using a "nearest neighbor walk"
    // so it looks like you’re writing one stroke, then the next
    order = [];
    let penX = 0;

    for (let i = 0; i < text.length; i++) {
      const ch = text[i];
      const glyph = FONT[ch] || FONT[" "];

      // collect ON pixels (base resolution, not scaled)
      const pts = [];
      for (let r = 0; r < ROWS; r++) {
        const rowStr = glyph[r] || "00000";
        for (let c = 0; c < GLYPH_W; c++) {
          if (rowStr[c] === "1") {
            pts.push({ x: c, y: r });
          }
        }
      }

      // map to grid coords (scaled)
      const mapped = pts.map(p => ({
        x: baseX + penX + p.x * scale,
        y: baseY + p.y * scale
      }));

      // write into final lit mask (scaled blocks)
      for (const p of pts) {
        setBlock(baseX + penX + p.x * scale, baseY + p.y * scale);
      }

      // stroke-like ordering: start left-most then walk to nearest neighbor
      const used = new Array(mapped.length).fill(false);

      function dist(a, b) {
        const dx = a.x - b.x;
        const dy = a.y - b.y;
        return Math.abs(dx) + Math.abs(dy);
      }

      // pick start: left-most, then top-most
      let cur = -1;
      for (let j = 0; j < mapped.length; j++) {
        if (cur === -1) cur = j;
        else {
          const A = mapped[j], B = mapped[cur];
          if (A.x < B.x || (A.x === B.x && A.y < B.y)) cur = j;
        }
      }

      // walk
      for (let step = 0; step < mapped.length; step++) {
        if (cur === -1) break;
        used[cur] = true;

        // add ALL cells of the scaled block in a mini-sweep (still “single stroke”)
        // but we only push one index per block-corner to keep speed consistent
        const gx = mapped[cur].x;
        const gy = mapped[cur].y;
        // push the top-left cell of the block (scaled painting is done in drawLit)
        if (gx >= 0 && gx < cols && gy >= 0 && gy < rows) {
          order.push(gy * cols + gx);
        }

        // choose next: nearest unused
        let next = -1;
        let best = 1e9;
        for (let j = 0; j < mapped.length; j++) {
          if (used[j]) continue;
          const d = dist(mapped[cur], mapped[j]);
          if (d < best) {
            best = d;
            next = j;
          }
        }
        cur = next;
      }

      penX += glyphW + (i === text.length - 1 ? 0 : gapW);
    }

    // IMPORTANT: because we pushed 1 index per base pixel,
    // we need drawLit() to draw scaled blocks — we do that by duplicating indices:
    // Expand order by painting each base index as a scale x scale block at render time.
    // Easiest approach: build an expanded order of all block cells (still stroke-y).
    const expanded = [];
    for (const idx of order) {
      const r0 = Math.floor(idx / cols);
      const c0 = idx - r0 * cols;
      // push block cells in a mini “pen sweep” order
      for (let yy = 0; yy < scale; yy++) {
        for (let xx = 0; xx < scale; xx++) {
          const r = r0 + yy;
          const c = c0 + xx;
          if (r < 0 || r >= rows || c < 0 || c >= cols) continue;
          if (lit[r * cols + c]) expanded.push(r * cols + c);
        }
      }
    }

    // de-dup while preserving order
    const seen = new Uint8Array(rows * cols);
    const finalOrder = [];
    for (const id of expanded) {
      if (!seen[id]) {
        seen[id] = 1;
        finalOrder.push(id);
      }
    }
    order = finalOrder;
  }

  function stop() {
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
    lastTs = 0;
    if (holdTimer) clearTimeout(holdTimer);
    holdTimer = null;
  }

  function renderFrame(upto) {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawDimGrid();       // FULL PANEL always filled
    drawLit(upto);       // animated lit pixels
  }

  function startWord(word) {
    buildWord(word);
    k = 0;
    renderFrame(0);
    rafId = requestAnimationFrame(tick);
  }

  function nextWord() {
    if (!words.length) return;
    wordIndex = (wordIndex + 1) % words.length;
    startWord(words[wordIndex]);
  }

  function tick(ts) {
    if (!lastTs) lastTs = ts;
    const dt = ts - lastTs;
    lastTs = ts;

    k += (dt / 1000) * WRITE_SPEED;
    renderFrame(Math.floor(k));

    if (k < order.length + 1) {
      rafId = requestAnimationFrame(tick);
      return;
    }

    holdTimer = setTimeout(() => nextWord(), HOLD_MS);
  }

  // init
  resizeCanvas();
  startWord(words[wordIndex] || "AWS & DOCKER");

  window.addEventListener("resize", () => {
    stop();
    resizeCanvas();
    startWord(words[wordIndex] || "AWS & DOCKER");
  });
})();


// ----------------------------
// draggable emoji bubbles
// ----------------------------
// ----------------------------
// draggable emoji bubbles + auto layout (no overlap)
// ----------------------------
(function () {
  "use strict";

  const stage = document.querySelector(".emoji-stage");
  if (!stage) return;

  const bubbles = Array.from(stage.querySelectorAll(".ebubble"));
  if (!bubbles.length) return;

  const clamp = (v, min, max) => Math.max(min, Math.min(max, v));

  function layoutBubbles() {
    const rStage = stage.getBoundingClientRect();

    // clear transforms so we measure correctly
    bubbles.forEach((b) => {
      b.dataset.x = "0";
      b.dataset.y = "0";
      b.style.setProperty("--dx", "0px");
      b.style.setProperty("--dy", "0px");
    });

    // pack with simple rejection sampling
    const placed = []; // {x,y,w,h}
    const triesPerBubble = 400;

    bubbles.forEach((b) => {
      const rEl = b.getBoundingClientRect();
      const w = rEl.width;
      const h = rEl.height;

      const maxX = Math.max(0, rStage.width - w);
      const maxY = Math.max(0, rStage.height - h);

      let best = { x: 0, y: 0, score: -1 };

      // try random spots, pick the one with max min-distance
      for (let t = 0; t < triesPerBubble; t++) {
        const x = Math.random() * maxX;
        const y = Math.random() * maxY;

        // compute min distance to existing placed boxes
        let minDist = Infinity;
        for (const p of placed) {
          const cx = x + w / 2, cy = y + h / 2;
          const pcx = p.x + p.w / 2, pcy = p.y + p.h / 2;
          const dx = cx - pcx, dy = cy - pcy;
          const d = Math.sqrt(dx * dx + dy * dy);
          minDist = Math.min(minDist, d);
        }

        if (minDist === Infinity) minDist = 999999; // first bubble
        if (minDist > best.score) best = { x, y, score: minDist };
      }

      placed.push({ x: best.x, y: best.y, w, h });

      // Set the ABSOLUTE position as baseline (top/left), keep dx/dy at 0
      b.style.left = best.x + "px";
      b.style.top  = best.y + "px";
    });
  }

  // Initial layout
  layoutBubbles();

  // Re-pack on resize (debounced)
  let resizeT = null;
  window.addEventListener("resize", () => {
    clearTimeout(resizeT);
    resizeT = setTimeout(layoutBubbles, 120);
  });

  const bounds = () => stage.getBoundingClientRect();
  bubbles.forEach((b) => {
    b.dataset.x = b.dataset.x || "0";
    b.dataset.y = b.dataset.y || "0";

    const onDown = (e) => {
      e.preventDefault();
      const id = e.pointerId ?? 1;
      if (b.setPointerCapture) b.setPointerCapture(id);

      const startX = e.clientX;
      const startY = e.clientY;

      const bx = parseFloat(b.dataset.x || "0");
      const by = parseFloat(b.dataset.y || "0");

      b.classList.add("dragging");

      const rStage = bounds();
      const rEl = b.getBoundingClientRect();

      const maxX = rStage.width - rEl.width;
      const maxY = rStage.height - rEl.height;

      const baseLeft = rEl.left - rStage.left - bx;
      const baseTop  = rEl.top  - rStage.top  - by;

      const onMove = (ev) => {
        const dx = ev.clientX - startX;
        const dy = ev.clientY - startY;

        const nx = clamp(bx + dx, -baseLeft, maxX - baseLeft);
        const ny = clamp(by + dy, -baseTop,  maxY - baseTop);

        b.dataset.x = String(Math.round(nx * 100) / 100);
        b.dataset.y = String(Math.round(ny * 100) / 100);
      };

      const onUp = () => {
        b.classList.remove("dragging");
        window.removeEventListener("pointermove", onMove);
        window.removeEventListener("pointerup", onUp);
        window.removeEventListener("pointercancel", onUp);
      };

      window.addEventListener("pointermove", onMove, { passive: false });
      window.addEventListener("pointerup", onUp, { passive: true });
      window.addEventListener("pointercancel", onUp, { passive: true });
    };

    b.addEventListener("pointerdown", onDown, { passive: false });
  });

  function tick() {
    for (const b of bubbles) {
      const x = parseFloat(b.dataset.x || "0");
      const y = parseFloat(b.dataset.y || "0");
      b.style.setProperty("--dx", x + "px");
      b.style.setProperty("--dy", y + "px");
    }
    requestAnimationFrame(tick);
  }
  requestAnimationFrame(tick);
})();



   (() => {
    const track = document.querySelector(".projects-track");
    if (!track) return;
  
    const slides = Array.from(track.children);
    const prev = document.querySelector(".proj-nav.prev");
    const next = document.querySelector(".proj-nav.next");
  
    let index = 0;
  
    function update(){
      track.style.transform = `translateX(-${index * 100}%)`;
    }
  
    prev.addEventListener("click", () => {
      index = (index - 1 + slides.length) % slides.length;
      update();
    });
  
    next.addEventListener("click", () => {
      index = (index + 1) % slides.length;
      update();
    });
  })();
(() => {
  const stack = document.getElementById("certStack");
  if (!stack) return;

  const cards = Array.from(stack.querySelectorAll(".cert-card"));
  if (!cards.length) return;

  const lastCard = cards[cards.length - 1];

  function setActive(card, smooth = true) {
    cards.forEach(c => c.classList.remove("active"));
    card.classList.add("active");

    card.scrollIntoView({
      behavior: smooth ? "smooth" : "auto",
      inline: "center",
      block: "nearest",
    });
  }

  setActive(lastCard, false);

  cards.forEach(card => {
    card.addEventListener("mouseenter", () => setActive(card, true));
  });

  stack.addEventListener("mouseleave", () => setActive(lastCard, true));

  stack.addEventListener("click", (e) => {
    const card = e.target.closest(".cert-card");
    if (card) setActive(card, true);
  });
})();
// Scroll reveal (IntersectionObserver): enables .reveal and .stagger
(() => {
  const els = document.querySelectorAll(".reveal, .stagger");
  if (!els.length) return;

  const io = new IntersectionObserver(
    (entries) => {
      for (const e of entries) {
        if (e.isIntersecting) e.target.classList.add("in");
      }
    },
    { threshold: 0.18, rootMargin: "0px 0px -8% 0px" }
  );

  els.forEach((el) => io.observe(el));
})();


// ============================================================
//  WORLD-CLASS ANIMATION PACK v2
//  1. Staggered bubble float
//  2. Custom cursor — bubble-shaped, pixel-perfect, no lag
//  3. Sparkle particle trail
//  4. 3D perspective card tilt
//  5. Magnetic buttons
//  6. Hero mouse parallax
//  7. Kinetic counters
//  8. Hero tag char-by-char entrance
// ============================================================

// 1 — Staggered bubble float: each bubble unique delay + duration
(function () {
  document.querySelectorAll('.ebubble').forEach(function (b, i) {
    b.style.setProperty('--float-delay', '-' + ((i * 0.41) % 5.8).toFixed(2) + 's');
    b.style.setProperty('--float-dur',         (3.6 + (i % 7) * 0.38).toFixed(2) + 's');
  });
})();

// 2 — Custom cursor: bubble-shaped circle follows mouse EXACTLY
//     A soft ring trails behind with spring interpolation
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  // bubble-style dot — this IS the cursor, sits at exact mouse position
  var cur  = document.createElement('div'); cur.id  = 'cur';
  // soft trailing ring — slightly lagged for depth
  var ring = document.createElement('div'); ring.id = 'cur-ring';
  document.body.appendChild(ring);   // ring behind
  document.body.appendChild(cur);    // dot on top
  document.body.classList.add('has-cursor');

  var mx = -200, my = -200;
  var rx = -200, ry = -200;
  var visible = false;

  function place(x, y) {
    // translate-based positioning — GPU composited, never out of sync
    var hw = cur.offsetWidth  / 2;
    var hh = cur.offsetHeight / 2;
    cur.style.transform  = 'translate(' + (x - hw) + 'px,' + (y - hh) + 'px)';
  }

  document.addEventListener('mousemove', function (e) {
    mx = e.clientX; my = e.clientY;
    if (!visible) { rx = mx; ry = my; visible = true; }
    place(mx, my);
  });

  document.addEventListener('mouseleave', function () {
    cur.style.opacity  = '0';
    ring.style.opacity = '0';
  });
  document.addEventListener('mouseenter', function () {
    cur.style.opacity  = '';
    ring.style.opacity = '';
  });

  // ring follows with gentle spring (fast enough to feel connected, slow enough to feel alive)
  (function loop() {
    rx += (mx - rx) * 0.14;
    ry += (my - ry) * 0.14;
    var rw = ring.offsetWidth  / 2;
    var rh = ring.offsetHeight / 2;
    ring.style.transform = 'translate(' + (rx - rw) + 'px,' + (ry - rh) + 'px)';
    requestAnimationFrame(loop);
  })();

  // hover state — ring expands + goes green, dot shrinks to a pin
  var hovSel = 'a, button, .ebubble, .chip, .pill, .contact-cta, .proj-nav, .cert-card, .nav2-logo, .nav2-right';
  document.querySelectorAll(hovSel).forEach(function (el) {
    el.addEventListener('mouseenter', function () { document.body.classList.add('cur-hover'); });
    el.addEventListener('mouseleave', function () { document.body.classList.remove('cur-hover'); });
  });

  // drag state
  document.querySelectorAll('.ebubble').forEach(function (b) {
    b.addEventListener('pointerdown', function () { document.body.classList.add('cur-drag'); });
  });
  window.addEventListener('pointerup', function () { document.body.classList.remove('cur-drag'); });
})();

// 3 — Sparkle particle trail: tiny dots spawn on movement, fade + rise
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  var pool = [];
  var COLORS = ['#b8ff5a','#6a63ff','#ff6a3d','#ffffff'];
  var lastX = 0, lastY = 0, lastT = 0;

  function spawn(x, y) {
    var s = pool.pop() || document.createElement('div');
    s.className = 'spark';
    var c = COLORS[Math.floor(Math.random() * COLORS.length)];
    var sz = 4 + Math.random() * 5;
    s.style.cssText = [
      'left:' + x + 'px',
      'top:' + y + 'px',
      'width:' + sz + 'px',
      'height:' + sz + 'px',
      'background:' + c,
      '--tx:' + ((Math.random() - 0.5) * 38).toFixed(1) + 'px',
      '--ty:' + (-(16 + Math.random() * 24)).toFixed(1) + 'px',
      'opacity:1'
    ].join(';');
    document.body.appendChild(s);
    // trigger reflow then animate
    void s.offsetWidth;
    s.style.animation = 'sparkFly .65s cubic-bezier(.2,.8,.2,1) forwards';
    s.addEventListener('animationend', function () {
      s.style.animation = '';
      if (s.parentNode) s.parentNode.removeChild(s);
      pool.push(s);
    }, { once: true });
  }

  document.addEventListener('mousemove', function (e) {
    var now = Date.now();
    var dx = e.clientX - lastX, dy = e.clientY - lastY;
    var dist = Math.sqrt(dx*dx + dy*dy);
    if (dist > 14 && now - lastT > 40) {
      spawn(e.clientX, e.clientY);
      lastX = e.clientX; lastY = e.clientY; lastT = now;
    }
  });
})();

// 4 — 3D perspective card tilt: cards tilt toward the mouse
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  var sel = '.item2, .what-row, .project-feature, .about-card, .contact-card';
  document.querySelectorAll(sel).forEach(function (card) {
    var req = null;
    var tx = 0, ty = 0, cx = 0, cy = 0;

    card.addEventListener('mousemove', function (e) {
      var r = card.getBoundingClientRect();
      cx = ((e.clientX - r.left) / r.width  - 0.5) * 9;   // -4.5..4.5 deg
      cy = ((e.clientY - r.top)  / r.height - 0.5) * -9;
    });

    card.addEventListener('mouseenter', function () {
      (function loop() {
        tx += (cx - tx) * 0.12;
        ty += (cy - ty) * 0.12;
        card.style.transform = 'perspective(700px) rotateY(' + tx + 'deg) rotateX(' + ty + 'deg) translateZ(6px)';
        req = requestAnimationFrame(loop);
      })();
    });

    card.addEventListener('mouseleave', function () {
      cx = 0; cy = 0;
      cancelAnimationFrame(req);
      (function reset() {
        tx += (0 - tx) * 0.16;
        ty += (0 - ty) * 0.16;
        card.style.transform = 'perspective(700px) rotateY(' + tx + 'deg) rotateX(' + ty + 'deg)';
        if (Math.abs(tx) > 0.05 || Math.abs(ty) > 0.05) requestAnimationFrame(reset);
        else card.style.transform = '';
      })();
    });
  });
})();

// 5 — Magnetic buttons: pill / CTA drift toward cursor
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;

  document.querySelectorAll('.pill, .contact-cta, .project-btn, .proj-nav').forEach(function (el) {
    el.addEventListener('mousemove', function (e) {
      var r  = el.getBoundingClientRect();
      var dx = (e.clientX - (r.left + r.width  / 2)) * 0.28;
      var dy = (e.clientY - (r.top  + r.height / 2)) * 0.28;
      el.style.transform = 'translate(' + dx + 'px,' + dy + 'px) scale(1.04)';
    });
    el.addEventListener('mouseleave', function () {
      el.style.transition = 'transform .4s cubic-bezier(.2,.8,.2,1)';
      el.style.transform  = '';
      setTimeout(function () { el.style.transition = ''; }, 400);
    });
  });
})();

// 6 — Hero mouse parallax: portrait and text move at different depths
(function () {
  if (window.matchMedia('(pointer: coarse)').matches) return;
  var hero = document.querySelector('.hero');
  if (!hero) return;

  var left  = hero.querySelector('.hero-left');
  var right = hero.querySelector('.hero-right');
  var tag   = hero.querySelector('.tag');

  var tx1=0,ty1=0, tx2=0,ty2=0, tx3=0,ty3=0;
  var tdx1=0,tdy1=0, tdx2=0,tdy2=0, tdx3=0,tdy3=0;
  var rafP = null;

  hero.addEventListener('mousemove', function (e) {
    var r  = hero.getBoundingClientRect();
    var dx = (e.clientX - r.left - r.width  / 2) / r.width;
    var dy = (e.clientY - r.top  - r.height / 2) / r.height;
    tdx1 = dx * -24; tdy1 = dy * -14;
    tdx2 = dx *  14; tdy2 = dy *   9;
    tdx3 = dx *  20; tdy3 = dy *  12;
    if (!rafP) (function loop() {
      tx1+=(tdx1-tx1)*.10; ty1+=(tdy1-ty1)*.10;
      tx2+=(tdx2-tx2)*.10; ty2+=(tdy2-ty2)*.10;
      tx3+=(tdx3-tx3)*.10; ty3+=(tdy3-ty3)*.10;
      if(left)  left.style.transform  = 'translate('+tx1.toFixed(2)+'px,'+ty1.toFixed(2)+'px)';
      if(right) right.style.transform = 'translate('+tx2.toFixed(2)+'px,'+ty2.toFixed(2)+'px)';
      if(tag)   tag.style.transform   = 'translate('+tx3.toFixed(2)+'px,'+ty3.toFixed(2)+'px) rotate('+(tx3*0.08).toFixed(2)+'deg)';
      rafP = requestAnimationFrame(loop);
    })();
  });

  hero.addEventListener('mouseleave', function () {
    tdx1=tdy1=tdx2=tdy2=tdx3=tdy3=0;
  });
})();

// 7 — Kinetic counters: numbers count up from 0 on scroll into view
(function () {
  var strongs = document.querySelectorAll('.item2 strong, .desc strong');
  if (!strongs.length) return;

  var io = new IntersectionObserver(function (entries) {
    entries.forEach(function (e) {
      if (!e.isIntersecting) return;
      io.unobserve(e.target);
      var orig = e.target.textContent.trim();
      var m = orig.match(/^(\d+)(%|\+)?$/);
      if (!m) return;
      var target = parseInt(m[1], 10);
      var suffix = m[2] || '';
      if (target < 2 || target > 9999) return;
      var dur = Math.min(1400, 500 + target * 3);
      var start = performance.now();
      var el = e.target;
      (function tick(now) {
        var p = Math.min((now - start) / dur, 1);
        var v = 1 - Math.pow(1 - p, 3);
        el.textContent = Math.round(v * target) + suffix;
        if (p < 1) requestAnimationFrame(tick);
        else { el.textContent = orig; el.classList.add('count-pop'); }
      })(start);
    });
  }, { threshold: 0.6 });

  strongs.forEach(function (s) { io.observe(s); });
})();

// 8 — Hero tag char-by-char entrance on page load
(function () {
  var tag = document.querySelector('.tag');
  if (!tag) return;
  var text = tag.textContent;
  tag.textContent = '';
  tag.style.visibility = 'visible';
  var i = 0;
  (function next() {
    if (i >= text.length) return;
    var span = document.createElement('span');
    span.textContent = text[i++];
    span.className = 'char-in';
    tag.appendChild(span);
    setTimeout(next, 55);
  })();
})();




