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

    let i = 0;
    el.textContent = words[i];

    setInterval(() => {
      i = (i + 1) % words.length;
      el.classList.remove("enter");
      void el.offsetWidth;
      el.textContent = words[i];
      el.classList.add("enter");
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




