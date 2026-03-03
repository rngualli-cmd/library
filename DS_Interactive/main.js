'use strict';
/* ============================================================
   STATISTICS INTERACTIVE VISUALIZER — main.js
   ============================================================ */

// ============================================================
// MATPLOTLIB PALETTE & STYLE CONSTANTS
// ============================================================
const MPL = {
  // tab10 color cycle (identical to matplotlib's default)
  C0: '#1f77b4',  // blue
  C1: '#ff7f0e',  // orange
  C2: '#2ca02c',  // green
  C3: '#d62728',  // red
  C4: '#9467bd',  // purple
  C5: '#8c564b',  // brown
  C6: '#e377c2',  // pink
  C7: '#7f7f7f',  // gray

  // Chart surfaces
  figBg:   '#f0f0f0',   // outer figure background (light gray)
  axBg:    '#ffffff',   // axes / plot area background (white)
  grid:    '#cccccc',   // grid line color
  spine:   '#444444',   // axis spines & tick marks
  tick:    '#333333',   // tick label text
  font:    '"DejaVu Sans", "Helvetica Neue", Arial, sans-serif',
};

// ============================================================
// MATH UTILITIES
// ============================================================
const U = {
  mean(arr) {
    return arr.reduce((a, b) => a + b, 0) / arr.length;
  },
  sorted(arr) {
    return [...arr].sort((a, b) => a - b);
  },
  median(arr) {
    const s = U.sorted(arr);
    const n = s.length;
    return n % 2 ? s[(n - 1) / 2] : (s[n / 2 - 1] + s[n / 2]) / 2;
  },
  percentile(arr, p) {
    const s = U.sorted(arr);
    const n = s.length;
    const idx = p * (n - 1) / 100;
    const lo = Math.floor(idx);
    const d = idx - lo;
    if (lo >= n - 1) return s[n - 1];
    return s[lo] + d * (s[lo + 1] - s[lo]);
  },
  percentileInfo(arr, p) {
    const s = U.sorted(arr);
    const n = s.length;
    const idx = p * (n - 1) / 100;
    const lo = Math.floor(idx);
    const d = idx - lo;
    const val = lo >= n - 1 ? s[n - 1] : s[lo] + d * (s[lo + 1] - s[lo]);
    return { val, lo, hi: Math.min(lo + 1, n - 1), d, idx };
  },
  trimmedMean(arr, pct) {
    const s = U.sorted(arr);
    const n = s.length;
    const g = Math.floor((pct / 100) * n);
    const inner = s.slice(g, n - g);
    return inner.length ? U.mean(inner) : U.mean(s);
  },
  trimmedG(arr, pct) {
    return Math.floor((pct / 100) * arr.length);
  },
  mad(arr) {
    const m = U.mean(arr);
    return U.mean(arr.map(x => Math.abs(x - m)));
  },
  medianMad(arr) {
    const med = U.median(arr);
    return U.median(arr.map(x => Math.abs(x - med)));
  },
  variance(arr, sample = false) {
    const m = U.mean(arr);
    const denom = sample ? Math.max(arr.length - 1, 1) : arr.length;
    return arr.reduce((sum, x) => sum + (x - m) ** 2, 0) / denom;
  },
  sd(arr, sample = false) {
    return Math.sqrt(U.variance(arr, sample));
  },
  quartiles(arr) {
    const s = U.sorted(arr);
    const n = s.length;
    const q2 = U.median(s);
    const lo = s.slice(0, Math.floor(n / 2));
    const hi = n % 2 ? s.slice(Math.ceil(n / 2)) : s.slice(n / 2);
    return { q1: U.median(lo), q2, q3: U.median(hi) };
  },
  erf(x) {
    const a = [0.254829592, -0.284496736, 1.421413741, -1.453152027, 1.061405429];
    const p = 0.3275911;
    const sign = x < 0 ? -1 : 1;
    x = Math.abs(x);
    const t = 1 / (1 + p * x);
    const y = 1 - ((((a[4] * t + a[3]) * t + a[2]) * t + a[1]) * t + a[0]) * t * Math.exp(-x * x);
    return sign * y;
  },
  phi(z) {
    return 0.5 * (1 + U.erf(z / Math.sqrt(2)));
  },
  normalPDF(x) {
    return Math.exp(-0.5 * x * x) / Math.sqrt(2 * Math.PI);
  },
  correlation(xs, ys) {
    const mx = U.mean(xs), my = U.mean(ys);
    const num = xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0);
    const den = Math.sqrt(
      xs.reduce((s, x) => s + (x - mx) ** 2, 0) *
      ys.reduce((s, y) => s + (y - my) ** 2, 0)
    );
    return den < 1e-12 ? 0 : num / den;
  },
  covariance(xs, ys) {
    const mx = U.mean(xs), my = U.mean(ys);
    return xs.reduce((s, x, i) => s + (x - mx) * (ys[i] - my), 0) / xs.length;
  },
  clamp(v, lo, hi) { return Math.max(lo, Math.min(hi, v)); },
  fmt(n, d = 2) { return Number(n).toFixed(d); }
};

// Registry: each section IIFE registers a getter so the step-by-step
// panel can pre-populate its fields from the live chart state on open.
const SBS_SYNC = {};

// ============================================================
// SVG HELPERS
// ============================================================
function svgEl(tag, attrs = {}) {
  const el = document.createElementNS('http://www.w3.org/2000/svg', tag);
  for (const [k, v] of Object.entries(attrs)) el.setAttribute(k, v);
  return el;
}

function clearSVG(svg) {
  while (svg.firstChild) svg.removeChild(svg.firstChild);
}

function toX(val, dMin, dMax, xMin, xMax) {
  return xMin + (val - dMin) / (dMax - dMin) * (xMax - xMin);
}
function fromX(svgX, dMin, dMax, xMin, xMax) {
  return dMin + (svgX - xMin) / (xMax - xMin) * (dMax - dMin);
}
function toY(val, dMin, dMax, yMax, yMin) {
  return yMax + (val - dMin) / (dMax - dMin) * (yMin - yMax);
}
function fromY(svgY, dMin, dMax, yMax, yMin) {
  return dMin + (svgY - yMax) / (yMin - yMax) * (dMax - dMin);
}

function svgText(x, y, txt, attrs = {}) {
  const el = svgEl('text', { x, y, 'font-family': MPL.font, ...attrs });
  el.textContent = txt;
  return el;
}

// ============================================================
// MATPLOTLIB-STYLE CHART BACKGROUND HELPERS
// ============================================================

/**
 * Draw the matplotlib figure+axes background for a 1D chart.
 *   - Light-gray figure background covering entire SVG
 *   - White axes area rect
 *   - Vertical grid lines at every x-tick
 *   - Bottom x-axis + tick marks + tick labels
 * Call this FIRST in render(). Then draw data. Then call drawSpine().
 */
function drawAxisMpl(svg, xMin, xMax, yTop, yAx, dMin, dMax, step) {
  const vb = svg.viewBox.baseVal;

  // Figure background
  svg.appendChild(svgEl('rect', {
    x: 0, y: 0, width: vb.width, height: vb.height, fill: MPL.figBg
  }));

  // White axes area
  svg.appendChild(svgEl('rect', {
    x: xMin, y: yTop, width: xMax - xMin, height: yAx - yTop, fill: MPL.axBg
  }));

  // Vertical grid lines
  for (let v = dMin; v <= dMax + 1e-6; v += step) {
    const x = toX(v, dMin, dMax, xMin, xMax);
    svg.appendChild(svgEl('line', {
      x1: x, y1: yTop, x2: x, y2: yAx,
      stroke: MPL.grid, 'stroke-width': 0.8
    }));
  }

  // Bottom spine
  svg.appendChild(svgEl('line', {
    x1: xMin, y1: yAx, x2: xMax, y2: yAx,
    stroke: MPL.spine, 'stroke-width': 1.5
  }));

  // Tick marks + labels
  for (let v = dMin; v <= dMax + 1e-6; v += step) {
    const x = toX(v, dMin, dMax, xMin, xMax);
    svg.appendChild(svgEl('line', {
      x1: x, y1: yAx, x2: x, y2: yAx + 5,
      stroke: MPL.spine, 'stroke-width': 1.5
    }));
    svg.appendChild(svgText(x, yAx + 17, v % 1 === 0 ? v : U.fmt(v, 1), {
      'text-anchor': 'middle', fill: MPL.tick, 'font-size': '11'
    }));
  }
}

/**
 * Draw the 4-sided spine border AFTER data is rendered.
 * This ensures the border sits on top of data.
 */
function drawSpine(svg, xMin, yTop, xMax, yAx) {
  svg.appendChild(svgEl('rect', {
    x: xMin, y: yTop, width: xMax - xMin, height: yAx - yTop,
    fill: 'none', stroke: MPL.spine, 'stroke-width': 1.5
  }));
}

/**
 * matplotlib-style axes for 2D scatter (x AND y grid).
 */
function draw2DAxesMpl(svg, xMin, yTop, xMax, yBot, dMinX, dMaxX, stepX, dMinY, dMaxY, stepY) {
  const vb = svg.viewBox.baseVal;

  svg.appendChild(svgEl('rect', {
    x: 0, y: 0, width: vb.width, height: vb.height, fill: MPL.figBg
  }));
  svg.appendChild(svgEl('rect', {
    x: xMin, y: yTop, width: xMax - xMin, height: yBot - yTop, fill: MPL.axBg
  }));

  // Vertical (x) grid
  for (let v = dMinX; v <= dMaxX + 1e-6; v += stepX) {
    const x = toX(v, dMinX, dMaxX, xMin, xMax);
    svg.appendChild(svgEl('line', { x1: x, y1: yTop, x2: x, y2: yBot, stroke: MPL.grid, 'stroke-width': 0.8 }));
  }
  // Horizontal (y) grid
  for (let v = dMinY; v <= dMaxY + 1e-6; v += stepY) {
    const y = toY(v, dMinY, dMaxY, yBot, yTop);
    svg.appendChild(svgEl('line', { x1: xMin, y1: y, x2: xMax, y2: y, stroke: MPL.grid, 'stroke-width': 0.8 }));
  }

  // X axis (bottom spine)
  svg.appendChild(svgEl('line', { x1: xMin, y1: yBot, x2: xMax, y2: yBot, stroke: MPL.spine, 'stroke-width': 1.5 }));
  // Y axis (left spine)
  svg.appendChild(svgEl('line', { x1: xMin, y1: yTop, x2: xMin, y2: yBot, stroke: MPL.spine, 'stroke-width': 1.5 }));

  // X ticks
  for (let v = dMinX; v <= dMaxX + 1e-6; v += stepX) {
    const x = toX(v, dMinX, dMaxX, xMin, xMax);
    svg.appendChild(svgEl('line', { x1: x, y1: yBot, x2: x, y2: yBot + 5, stroke: MPL.spine, 'stroke-width': 1.5 }));
    svg.appendChild(svgText(x, yBot + 17, v, { 'text-anchor': 'middle', fill: MPL.tick, 'font-size': '11' }));
  }
  // Y ticks
  for (let v = dMinY; v <= dMaxY + 1e-6; v += stepY) {
    const y = toY(v, dMinY, dMaxY, yBot, yTop);
    svg.appendChild(svgEl('line', { x1: xMin - 5, y1: y, x2: xMin, y2: y, stroke: MPL.spine, 'stroke-width': 1.5 }));
    svg.appendChild(svgText(xMin - 8, y + 4, v, { 'text-anchor': 'end', fill: MPL.tick, 'font-size': '11' }));
  }
}

// ============================================================
// GLOBAL DRAG HANDLER
// ============================================================
let activeDrag = null;

function makeDraggable(svg, el, onDrag) {
  const svgPos = (e) => {
    const rect = svg.getBoundingClientRect();
    const vb = svg.viewBox.baseVal;
    const cx = e.touches ? e.touches[0].clientX : e.clientX;
    const cy = e.touches ? e.touches[0].clientY : e.clientY;
    return {
      x: (cx - rect.left) / rect.width  * vb.width,
      y: (cy - rect.top)  / rect.height * vb.height
    };
  };
  el.addEventListener('mousedown', (e) => {
    activeDrag = { svg, el, cb: onDrag, pos: svgPos };
    e.preventDefault();
  });
  el.addEventListener('touchstart', (e) => {
    activeDrag = { svg, el, cb: onDrag, pos: svgPos };
    e.preventDefault();
  }, { passive: false });
}

window.addEventListener('mousemove', (e) => {
  if (!activeDrag) return;
  const p = activeDrag.pos(e);
  activeDrag.cb(p.x, p.y);
});
window.addEventListener('touchmove', (e) => {
  if (!activeDrag) return;
  const p = activeDrag.pos(e);
  activeDrag.cb(p.x, p.y);
  e.preventDefault();
}, { passive: false });
window.addEventListener('mouseup',  () => { activeDrag = null; });
window.addEventListener('touchend', () => { activeDrag = null; });

// ============================================================
// FORMULA RENDERER (KaTeX)
// ============================================================
function renderFormula(id, latex) {
  const el = document.getElementById(id);
  if (!el) return;
  katex.render(latex, el, { throwOnError: false, displayMode: true });
}

// ============================================================
// SYMBOL LEGEND BUILDER
// ============================================================
function buildLegend(id, symbols) {
  const container = document.getElementById(id);
  if (!container) return;
  container.innerHTML = '';
  symbols.forEach(s => {
    const card = document.createElement('div');
    card.className = 'symbol-card' + (s.exotic ? ' exotic' : '');

    const glyph = document.createElement('div');
    glyph.className = 'sym-glyph';
    try { katex.render(s.latex, glyph, { throwOnError: false }); }
    catch (_) { glyph.textContent = s.latex; }

    const info = document.createElement('div');
    info.className = 'sym-info';
    const nm = document.createElement('div'); nm.className = 'sym-name'; nm.textContent = s.name;
    const ds = document.createElement('div'); ds.className = 'sym-desc'; ds.textContent = s.desc;
    info.append(nm, ds);
    if (s.example) {
      const ex = document.createElement('div'); ex.className = 'sym-example'; ex.textContent = s.example;
      info.appendChild(ex);
    }
    card.append(glyph, info);
    container.appendChild(card);
  });
}

// ============================================================
// STAT READOUT BUILDER
// ============================================================
function setReadout(id, stats) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = stats.map(([label, value, color]) =>
    `<div class="stat-badge">
       <div class="badge-label">${label}</div>
       <div class="badge-value" style="color:${color || MPL.C0}">${value}</div>
     </div>`
  ).join('');
}

// ============================================================
// INPUT ROW BUILDER
// ============================================================
function buildInputRow(containerId, points, minV, maxV, onChange) {
  const c = document.getElementById(containerId);
  if (!c) return;
  c.querySelectorAll('.point-input').forEach(el => el.remove());
  const frag = document.createDocumentFragment();
  points.forEach((v, i) => {
    const inp = document.createElement('input');
    inp.type = 'number'; inp.className = 'point-input';
    inp.value = U.fmt(v, 1); inp.min = minV; inp.max = maxV; inp.step = 0.5;
    inp.addEventListener('change', () => {
      let val = parseFloat(inp.value);
      if (isNaN(val)) val = v;
      val = U.clamp(val, minV, maxV);
      inp.value = U.fmt(val, 1);
      onChange(i, val);
    });
    frag.appendChild(inp);
  });
  c.prepend(frag);
}

function syncInputs(containerId, points) {
  const inputs = document.getElementById(containerId)?.querySelectorAll('.point-input');
  if (!inputs) return;
  points.forEach((v, i) => { if (inputs[i]) inputs[i].value = U.fmt(v, 1); });
}

// ============================================================
// EXPLANATION BOX
// ============================================================
function showExplanation(id, html) {
  const el = document.getElementById(id);
  if (!el) return;
  el.innerHTML = html;
  el.classList.add('visible');
}

// ============================================================
// SHARED DRAWING PRIMITIVES
// ============================================================
function drawVLine(svg, x, y1, y2, color, dash = '5 3') {
  svg.appendChild(svgEl('line', {
    x1: x, y1, x2: x, y2,
    stroke: color, 'stroke-width': 2, 'stroke-dasharray': dash
  }));
}

function drawLabel(svg, x, y, text, color, size = 11, anchor = 'middle') {
  const el = svgText(x, y, text, {
    'text-anchor': anchor, fill: color, 'font-size': size, 'font-weight': 'bold'
  });
  svg.appendChild(el);
  return el;
}

function drawDot1D(svg, val, cx, cy, color, dragCb, r = 8) {
  const circle = svgEl('circle', {
    cx, cy, r, fill: color,
    stroke: '#ffffff', 'stroke-width': 1.5,
    style: 'cursor:grab'
  });
  if (dragCb) makeDraggable(svg, circle, dragCb);
  svg.appendChild(circle);
  return circle;
}

// ============================================================
// SECTION 1 — RANGE
// ============================================================
(function initRange() {
  const ID = 'range';
  const state = { points: [10, 25, 45, 68, 82, 93] };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 110, YD = 68;

  renderFormula(`${ID}-formula`, '\\text{Range} = \\max(X) - \\min(X)');

  buildLegend(`${ID}-legend`, [
    { latex: '\\max(X)', name: 'Maximum', desc: 'The single largest value in the dataset.' },
    { latex: '\\min(X)', name: 'Minimum', desc: 'The single smallest value in the dataset.' },
    { latex: 'X',        name: 'Dataset', desc: 'The full collection of data values being studied.' },
    { latex: '\\text{Range}', name: 'Range', desc: 'Total spread. Sensitive to outliers — one extreme shifts it instantly.' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const s = U.sorted(state.points);
    const mn = s[0], mx = s[s.length - 1];

    // Range bracket
    const bx1 = toX(mn, DM, DX, XM, XX), bx2 = toX(mx, DM, DX, XM, XX);
    const bY = YD - 24;
    svg.appendChild(svgEl('line', { x1: bx1, y1: bY, x2: bx2, y2: bY, stroke: MPL.C0, 'stroke-width': 2 }));
    svg.appendChild(svgEl('line', { x1: bx1, y1: bY - 5, x2: bx1, y2: bY + 5, stroke: MPL.C0, 'stroke-width': 2 }));
    svg.appendChild(svgEl('line', { x1: bx2, y1: bY - 5, x2: bx2, y2: bY + 5, stroke: MPL.C0, 'stroke-width': 2 }));
    drawLabel(svg, (bx1 + bx2) / 2, bY - 7, `Range = ${U.fmt(mx - mn, 1)}`, MPL.C0, 11);

    // Dots
    state.points.forEach((v, i) => {
      const x = toX(v, DM, DX, XM, XX);
      const isMn = v === mn, isMx = v === mx;
      const col = isMn ? MPL.C3 : isMx ? MPL.C2 : MPL.C7;
      drawDot1D(svg, v, x, YD, col, (sx) => {
        state.points[i] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        render(); syncInputs(`${ID}-inputs`, state.points);
      });
      svg.appendChild(svgText(x, YD + 18, U.fmt(v, 0),
        { 'text-anchor': 'middle', fill: '#555555', 'font-size': '10' }));
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    setReadout(`${ID}-stats`, [
      ['Min', U.fmt(mn, 1), MPL.C3],
      ['Max', U.fmt(mx, 1), MPL.C2],
      ['Range', U.fmt(mx - mn, 1), MPL.C0],
      ['n', state.points.length, MPL.C7],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const s = U.sorted(state.points);
    const mn = s[0], mx = s[s.length - 1], r = mx - mn;
    const mid = (mn + mx) / 2, m = U.mean(state.points);
    showExplanation(`${ID}-explanation`,
      `Your <span class="hl">${state.points.length}</span> data points span from <span class="hl">${U.fmt(mn, 1)}</span> to <span class="hl">${U.fmt(mx, 1)}</span>,
       giving a range of <span class="hl">${U.fmt(r, 1)}</span>.
       The range only looks at the two extremes — the ${state.points.length - 2} middle points have <em>zero effect</em> on it.
       The midpoint of the range is ${U.fmt(mid, 1)}, while the actual mean is ${U.fmt(m, 2)} — a difference of ${U.fmt(Math.abs(m - mid), 2)}.
       Try dragging the red (min) or green (max) dot and watch the bracket update instantly.`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', ') });
  render();
})();

// ============================================================
// SECTION 2 — MEAN
// ============================================================
(function initMean() {
  const ID = 'mean';
  const state = { points: [18, 32, 47, 61, 74, 88] };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 138, YD = 88;

  renderFormula(`${ID}-formula`,
    '\\bar{x} = \\dfrac{1}{n}\\sum_{i=1}^{n} x_i');

  buildLegend(`${ID}-legend`, [
    { latex: '\\bar{x}', name: 'x-bar (sample mean)',  desc: 'The arithmetic average — sum all values, divide by count.' },
    { latex: 'n',        name: 'n (sample size)',       desc: 'How many data points you have.' },
    { latex: '\\sum',    name: 'Sigma (summation)',     desc: 'Add up all the following terms.', exotic: true,
      example: 'If x = [2, 5, 9], Σxᵢ = 2+5+9 = 16' },
    { latex: 'x_i',     name: 'x-sub-i',               desc: 'Each individual data value (i from 1 to n).' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const m = U.mean(state.points);
    const mx = toX(m, DM, DX, XM, XX);

    // Mean line (orange — matplotlib's C1)
    drawVLine(svg, mx, Y_TOP, YA, MPL.C1, 'none');
    drawLabel(svg, mx, Y_TOP - 5, `x̄ = ${U.fmt(m, 2)}`, MPL.C1, 11);

    // Dots
    state.points.forEach((v, i) => {
      const x = toX(v, DM, DX, XM, XX);
      drawDot1D(svg, v, x, YD, MPL.C0, (sx) => {
        state.points[i] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        render(); syncInputs(`${ID}-inputs`, state.points);
      });
      svg.appendChild(svgText(x, YD + 18, U.fmt(v, 0),
        { 'text-anchor': 'middle', fill: '#555555', 'font-size': '10' }));
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    setReadout(`${ID}-stats`, [
      ['Mean (x̄)', U.fmt(m, 3), MPL.C1],
      ['Sum (Σ)', U.fmt(state.points.reduce((a, b) => a + b, 0), 1), MPL.C0],
      ['n', state.points.length, MPL.C7],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const m = U.mean(state.points);
    const s = U.sorted(state.points);
    const lo = s[0], hi = s[s.length - 1];
    const pull = m > (lo + hi) / 2 ? 'pulled upward' : m < (lo + hi) / 2 ? 'pulled downward' : 'centred';
    showExplanation(`${ID}-explanation`,
      `The mean of your <span class="hl">${state.points.length}</span> values is <span class="hl">${U.fmt(m, 3)}</span>.
       It is ${pull} by the ${m > (lo + hi) / 2 ? 'high' : 'low'} extreme value of <span class="hl">${m > (lo + hi) / 2 ? hi : lo}</span>.
       Every single point contributes equally: each data value ÷ n pulls the mean toward itself.
       Try dragging any dot far to the right and watch the mean line (orange) chase it.
       The mean's sensitivity to outliers is why we sometimes prefer the median.`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', ') });
  render();
})();

// ============================================================
// SECTION 3 — MEDIAN
// ============================================================
(function initMedian() {
  const ID = 'median';
  const state = { points: [12, 35, 50, 68, 84] };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 138, YD = 88;

  renderFormula(`${ID}-formula`,
    '\\tilde{x} = \\begin{cases} x_{(m+1)} & n = 2m+1\\text{ (odd)} \\\\ \\dfrac{x_{(m)} + x_{(m+1)}}{2} & n = 2m\\text{ (even)} \\end{cases}');

  buildLegend(`${ID}-legend`, [
    { latex: '\\tilde{x}', name: 'x-tilde (median)', desc: 'The middle value when sorted. Half lies above, half below.' },
    { latex: 'x_{(i)}',   name: 'Order statistic',  desc: 'The i-th smallest value after sorting.' },
    { latex: 'n',          name: 'n',                desc: 'Total number of data points.' },
    { latex: 'm',          name: 'm (middle index)', desc: 'Odd n: median at position m+1. Even n: average the two middle values.' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const s = U.sorted(state.points);
    const med = U.median(state.points);
    const n = state.points.length;
    const isEven = n % 2 === 0;

    // Even-n highlight
    if (isEven) {
      const m1 = toX(s[n / 2 - 1], DM, DX, XM, XX);
      const m2 = toX(s[n / 2], DM, DX, XM, XX);
      svg.appendChild(svgEl('rect', { x: m1, y: YD - 10, width: m2 - m1, height: 20,
        fill: `${MPL.C2}28`, rx: 3 }));
    }

    // Median line (green)
    const medX = toX(med, DM, DX, XM, XX);
    drawVLine(svg, medX, Y_TOP, YA, MPL.C2, 'none');
    drawLabel(svg, medX, Y_TOP - 5, `Median = ${U.fmt(med, 1)}`, MPL.C2, 11);

    // Sorted dots
    s.forEach((v, si) => {
      const origIdx = state.points.indexOf(v);
      const x = toX(v, DM, DX, XM, XX);
      const isMiddle = isEven ? (si === n / 2 - 1 || si === n / 2) : si === Math.floor(n / 2);
      const col = isMiddle ? MPL.C2 : MPL.C0;
      drawDot1D(svg, v, x, YD, col, (sx) => {
        state.points[origIdx] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        render(); syncInputs(`${ID}-inputs`, state.points);
      });
      svg.appendChild(svgText(x, YD + 18, U.fmt(v, 0),
        { 'text-anchor': 'middle', fill: '#555555', 'font-size': '10' }));
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    setReadout(`${ID}-stats`, [
      ['Median', U.fmt(med, 2), MPL.C2],
      ['Mean',   U.fmt(U.mean(state.points), 2), MPL.C1],
      ['n', n, MPL.C7],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById('median-add-btn').addEventListener('click', () => {
    if (state.points.length >= 12) return;
    state.points.push(Math.round(U.mean(state.points)));
    buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });
    render();
  });
  document.getElementById('median-remove-btn').addEventListener('click', () => {
    if (state.points.length <= 2) return;
    state.points.pop();
    buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });
    render();
  });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const n = state.points.length;
    const med = U.median(state.points);
    const m = U.mean(state.points);
    const diff = Math.abs(m - med);
    showExplanation(`${ID}-explanation`,
      `With <span class="hl">${n}</span> points (${n % 2 ? 'odd → single middle value' : 'even → average of two middle values'}),
       the median is <span class="hl">${U.fmt(med, 2)}</span>.
       The mean is <span class="hl">${U.fmt(m, 2)}</span> — a difference of ${U.fmt(diff, 2)}.
       ${diff > 5 ? `That gap of ${U.fmt(diff, 1)} units suggests skew: outliers pull the mean ${m > med ? 'above' : 'below'} the median.` : 'Mean and median are close, suggesting a fairly symmetric distribution.'}
       Unlike the mean, the median ignores <em>how far</em> extreme values are — it only cares about <em>rank</em>.
       Use + / − buttons to add or remove points.`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', ') });
  render();
})();

// ============================================================
// SECTION 4 — PERCENTILE
// ============================================================
(function initPercentile() {
  const ID = 'percentile';
  const state = { points: [5, 18, 32, 47, 60, 74, 85, 93], k: 50 };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 138, YD = 88;

  renderFormula(`${ID}-formula`,
    'P_k = x_{(L)} + d\\,(x_{(L+1)} - x_{(L)}),\\quad L = \\left\\lfloor\\dfrac{k(n-1)}{100}\\right\\rfloor,\\quad d = \\dfrac{k(n-1)}{100} - L');

  buildLegend(`${ID}-legend`, [
    { latex: 'P_k',          name: 'P-sub-k',        desc: 'The value below which k% of the data falls.' },
    { latex: 'k',            name: 'k (rank %)',      desc: 'The desired percentile, from 0 to 100.' },
    { latex: 'L',            name: 'L (lower index)', desc: 'Integer index into the sorted array just below target.', exotic: true,
      example: 'k=30, n=8 → L = ⌊30×7/100⌋ = ⌊2.1⌋ = 2' },
    { latex: 'd',            name: 'd (fraction)',    desc: 'How far to interpolate between two adjacent values.', exotic: true,
      example: 'd = 2.1 − 2 = 0.1 → 10% of the gap from x(2) to x(3)' },
    { latex: '\\lfloor\\cdot\\rfloor', name: 'Floor', desc: 'Round down to the nearest integer.', exotic: true,
      example: '⌊3.9⌋ = 3, ⌊2.0⌋ = 2' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const { val, lo, hi, d } = U.percentileInfo(state.points, state.k);
    const s = U.sorted(state.points);

    // Interpolation zone
    if (lo < hi) {
      const xa = toX(s[lo], DM, DX, XM, XX), xb = toX(s[hi], DM, DX, XM, XX);
      svg.appendChild(svgEl('rect', { x: xa, y: YD - 14, width: xb - xa, height: 28,
        fill: `${MPL.C1}28`, stroke: `${MPL.C1}60`, 'stroke-width': 1, rx: 3 }));
    }

    // Percentile marker
    const px = toX(val, DM, DX, XM, XX);
    drawVLine(svg, px, Y_TOP, YA, MPL.C1, 'none');
    drawLabel(svg, px, Y_TOP - 5, `P${state.k} = ${U.fmt(val, 2)}`, MPL.C1, 11);

    // Sorted dots
    s.forEach((v, si) => {
      const origIdx = state.points.indexOf(v);
      const x = toX(v, DM, DX, XM, XX);
      const isLo = si === lo, isHi = si === hi && lo !== hi;
      const col = isLo ? MPL.C1 : isHi ? MPL.C5 : MPL.C7;
      drawDot1D(svg, v, x, YD, col, (sx) => {
        state.points[origIdx] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        render(); syncInputs(`${ID}-inputs`, state.points);
      });
      svg.appendChild(svgText(x, YD + 18, U.fmt(v, 0),
        { 'text-anchor': 'middle', fill: '#555555', 'font-size': '10' }));
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    setReadout(`${ID}-stats`, [
      [`P${state.k}`, U.fmt(val, 3), MPL.C1],
      ['L (index)', lo, MPL.C5],
      ['d (frac.)', U.fmt(d, 3), MPL.C7],
      ['n', state.points.length, MPL.C7],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById('percentile-slider').addEventListener('input', (e) => {
    state.k = +e.target.value;
    document.getElementById('percentile-k-val').textContent = state.k;
    render();
  });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const { val, lo, hi, d } = U.percentileInfo(state.points, state.k);
    const s = U.sorted(state.points);
    const interp = lo < hi;
    showExplanation(`${ID}-explanation`,
      `The <span class="hl">${state.k}th percentile</span> of your ${state.points.length} sorted values is <span class="hl">${U.fmt(val, 3)}</span>.
       ${interp
         ? `This falls <em>between</em> x(${lo}) = ${U.fmt(s[lo], 1)} and x(${hi}) = ${U.fmt(s[hi], 1)} — interpolated ${U.fmt(d * 100, 1)}% of the way (d = ${U.fmt(d, 3)}).`
         : `This lands exactly on x(${lo}) = ${U.fmt(s[lo], 1)} — no interpolation needed.`}
       Linear interpolation assumes values are <em>uniformly distributed</em> between adjacent data points.
       Move the slider to different k values — notice P0 = minimum and P100 = maximum.`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', '), k: String(state.k) });
  render();
})();

// ============================================================
// SECTION 5 — TRIMMED MEAN
// ============================================================
(function initTrimmedMean() {
  const ID = 'trimmed-mean';
  const state = { points: [4, 14, 28, 42, 55, 67, 80, 93], alpha: 10 };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 138, YD = 88;

  renderFormula(`${ID}-formula`,
    '\\bar{x}_{\\alpha} = \\dfrac{1}{n - 2g}\\sum_{i=g+1}^{n-g} x_{(i)}, \\quad g = \\lfloor\\alpha n\\rfloor');

  buildLegend(`${ID}-legend`, [
    { latex: '\\alpha',  name: 'Alpha (trim fraction)', desc: 'Proportion trimmed from each end (0 to 0.5).', exotic: true,
      example: 'α=0.1, n=10 → remove 1 from each end, keeping 8' },
    { latex: 'g',        name: 'g (trim count)',        desc: 'Number of values removed from each end: g = ⌊αn⌋.' },
    { latex: 'x_{(i)}', name: 'Order statistic',       desc: 'The i-th value after ascending sort.' },
    { latex: '\\lfloor\\cdot\\rfloor', name: 'Floor',  desc: 'Round down to the nearest whole number.' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const s = U.sorted(state.points);
    const n = s.length;
    const g = U.trimmedG(state.points, state.alpha);
    const tm = U.trimmedMean(state.points, state.alpha);
    const fullMean = U.mean(state.points);

    // Full mean reference (dimmed)
    const fmx = toX(fullMean, DM, DX, XM, XX);
    svg.appendChild(svgEl('line', { x1: fmx, y1: Y_TOP, x2: fmx, y2: YA,
      stroke: MPL.C7, 'stroke-width': 1.5, 'stroke-dasharray': '4 3', opacity: 0.6 }));
    drawLabel(svg, fmx, Y_TOP + 14, `x̄=${U.fmt(fullMean, 1)}`, MPL.C7, 9);

    // Trimmed mean line
    const tmx = toX(tm, DM, DX, XM, XX);
    drawVLine(svg, tmx, Y_TOP, YA, MPL.C2, 'none');
    drawLabel(svg, tmx, Y_TOP - 5, `Trimmed = ${U.fmt(tm, 2)}`, MPL.C2, 11);

    // Dots
    s.forEach((v, si) => {
      const origIdx = state.points.indexOf(v);
      const x = toX(v, DM, DX, XM, XX);
      const trimmed = si < g || si >= n - g;
      if (trimmed) {
        // Dimmed excluded dot
        svg.appendChild(svgEl('circle', { cx: x, cy: YD, r: 8,
          fill: `${MPL.C3}50`, stroke: `${MPL.C3}90`, 'stroke-width': 1.5,
          'stroke-dasharray': '3 2', opacity: 0.55 }));
        svg.appendChild(svgText(x, YD + 1, '×',
          { 'text-anchor': 'middle', 'dominant-baseline': 'middle',
            fill: MPL.C3, 'font-size': '13', 'font-weight': 'bold' }));
      } else {
        drawDot1D(svg, v, x, YD, MPL.C0, (sx) => {
          state.points[origIdx] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
          render(); syncInputs(`${ID}-inputs`, state.points);
        });
      }
      svg.appendChild(svgText(x, YD + 18, U.fmt(v, 0),
        { 'text-anchor': 'middle', fill: trimmed ? '#aaaaaa' : '#555555', 'font-size': '10' }));
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    setReadout(`${ID}-stats`, [
      ['Trimmed Mean', U.fmt(tm, 3), MPL.C2],
      ['Full Mean', U.fmt(fullMean, 3), MPL.C1],
      ['g (each end)', g, MPL.C3],
      ['Kept', n - 2 * g, MPL.C0],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById('trim-slider').addEventListener('input', (e) => {
    state.alpha = +e.target.value;
    document.getElementById('trim-pct-val').textContent = state.alpha;
    render();
  });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const g = U.trimmedG(state.points, state.alpha);
    const tm = U.trimmedMean(state.points, state.alpha);
    const n = state.points.length;
    showExplanation(`${ID}-explanation`,
      `With α = <span class="hl">${state.alpha}%</span>, we trim <span class="hl">g = ${g}</span> value(s) from each end,
       keeping ${n - 2 * g} of the original ${n} points.
       The trimmed mean is <span class="hl">${U.fmt(tm, 3)}</span> vs. the full mean of ${U.fmt(U.mean(state.points), 2)}.
       The ✕-marked red dots are excluded entirely — they can't pull the result.
       Increase α% to trim more aggressively; at 50% you'd converge to the median.
       This is why trimmed means are used in figure skating and diving scoring!`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', '), alpha: String(state.alpha) });
  render();
})();

// ============================================================
// SECTION 6 — MAD (Mean Absolute Deviation)
// ============================================================
(function initMAD() {
  const ID = 'mad';
  const state = { points: [15, 32, 50, 68, 85] };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 180, YD = 72, B_Y = 138;

  renderFormula(`${ID}-formula`,
    '\\text{MAD} = \\dfrac{1}{n}\\sum_{i=1}^{n}\\bigl|x_i - \\bar{x}\\bigr|');

  buildLegend(`${ID}-legend`, [
    { latex: '|x_i - \\bar{x}|', name: 'Absolute deviation', desc: 'Distance from each point to the mean — always ≥ 0.' },
    { latex: '\\bar{x}',         name: 'Mean',               desc: 'The arithmetic average.' },
    { latex: '\\sum',            name: 'Summation',          desc: 'Add up all n absolute deviations.', exotic: true,
      example: '[2,6,10], mean=6: |2−6|+|6−6|+|10−6| = 4+0+4 = 8, MAD=8/3≈2.67' },
    { latex: 'n',                name: 'n',                  desc: 'Number of data points.' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const m = U.mean(state.points);
    const madVal = U.mad(state.points);
    const mx = toX(m, DM, DX, XM, XX);

    // Mean line (orange)
    drawVLine(svg, mx, Y_TOP, YA, MPL.C1, 'none');
    drawLabel(svg, mx, Y_TOP - 5, `x̄ = ${U.fmt(m, 2)}`, MPL.C1, 11);

    // Deviation brackets at B_Y
    state.points.forEach((v) => {
      const x = toX(v, DM, DX, XM, XX);
      const dev = Math.abs(v - m);
      const col = v >= m ? MPL.C2 : MPL.C3;
      if (dev > 0.5) {
        svg.appendChild(svgEl('line', { x1: x, y1: B_Y, x2: mx, y2: B_Y, stroke: col, 'stroke-width': 2.5 }));
        svg.appendChild(svgEl('line', { x1: x, y1: B_Y - 5, x2: x, y2: B_Y + 5, stroke: col, 'stroke-width': 2 }));
        svg.appendChild(svgEl('line', { x1: mx, y1: B_Y - 5, x2: mx, y2: B_Y + 5, stroke: col, 'stroke-width': 2 }));
        svg.appendChild(svgText((x + mx) / 2, B_Y - 7, U.fmt(dev, 1),
          { 'text-anchor': 'middle', fill: col, 'font-size': '10', 'font-weight': 'bold' }));
      }
    });

    // Dots
    state.points.forEach((v, i) => {
      const x = toX(v, DM, DX, XM, XX);
      drawDot1D(svg, v, x, YD, MPL.C0, (sx) => {
        state.points[i] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        render(); syncInputs(`${ID}-inputs`, state.points);
      });
      svg.appendChild(svgText(x, YD + 16, U.fmt(v, 0),
        { 'text-anchor': 'middle', fill: '#555555', 'font-size': '10' }));
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    setReadout(`${ID}-stats`, [
      ['Mean (x̄)', U.fmt(m, 3), MPL.C1],
      ['MAD', U.fmt(madVal, 3), MPL.C0],
      ['n', state.points.length, MPL.C7],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const m = U.mean(state.points);
    const madVal = U.mad(state.points);
    const devs = state.points.map(x => Math.abs(x - m));
    showExplanation(`${ID}-explanation`,
      `The mean is <span class="hl">${U.fmt(m, 2)}</span>. Each point's distance from it: <span class="hl">${devs.map(d => U.fmt(d, 1)).join(', ')}</span>.
       Averaging those gives MAD = <span class="hl">${U.fmt(madVal, 3)}</span>.
       Green brackets = points above the mean, red = below. Their lengths are the absolute deviations.
       MAD uses absolute values so positives and negatives don't cancel.
       Drag a dot far from the mean and watch its bracket grow — that one point pulls the MAD up.`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', ') });
  render();
})();

// ============================================================
// SECTION 7 — MEDIAN ABSOLUTE DEVIATION
// ============================================================
(function initMedianMAD() {
  const ID = 'median-mad';
  const state = { points: [10, 30, 52, 65, 88] };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 180, YD = 72, B_Y = 138;

  renderFormula(`${ID}-formula`,
    '\\text{MAD}_m = \\operatorname{median}\\!\\bigl(|x_i - \\tilde{x}|\\bigr)');

  buildLegend(`${ID}-legend`, [
    { latex: '\\tilde{x}',         name: 'Median',            desc: 'The middle value of sorted data.' },
    { latex: '|x_i - \\tilde{x}|', name: 'Abs. dev. from median', desc: 'Distance from each point to the median.' },
    { latex: '\\text{MAD}_m',      name: 'Median MAD',        desc: 'Median of all those absolute deviations — doubly robust.', exotic: true,
      example: '[2,6,10,100]: median=8, devs=[6,2,2,92], MAD_m=median([2,2,6,92])=4' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const med = U.median(state.points);
    const mMad = U.medianMad(state.points);
    const medX = toX(med, DM, DX, XM, XX);

    // Median line (green)
    drawVLine(svg, medX, Y_TOP, YA, MPL.C2, 'none');
    drawLabel(svg, medX, Y_TOP - 5, `x̃ = ${U.fmt(med, 2)}`, MPL.C2, 11);

    // Deviation brackets
    state.points.forEach((v) => {
      const x = toX(v, DM, DX, XM, XX);
      const dev = Math.abs(v - med);
      const col = v >= med ? MPL.C2 : MPL.C3;
      if (dev > 0.5) {
        svg.appendChild(svgEl('line', { x1: x, y1: B_Y, x2: medX, y2: B_Y, stroke: col, 'stroke-width': 2.5 }));
        svg.appendChild(svgEl('line', { x1: x, y1: B_Y - 5, x2: x, y2: B_Y + 5, stroke: col, 'stroke-width': 2 }));
        svg.appendChild(svgEl('line', { x1: medX, y1: B_Y - 5, x2: medX, y2: B_Y + 5, stroke: col, 'stroke-width': 2 }));
        svg.appendChild(svgText((x + medX) / 2, B_Y - 7, U.fmt(dev, 1),
          { 'text-anchor': 'middle', fill: col, 'font-size': '10', 'font-weight': 'bold' }));
      }
    });

    // Dots
    state.points.forEach((v, i) => {
      const x = toX(v, DM, DX, XM, XX);
      drawDot1D(svg, v, x, YD, MPL.C0, (sx) => {
        state.points[i] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        render(); syncInputs(`${ID}-inputs`, state.points);
      });
      svg.appendChild(svgText(x, YD + 16, U.fmt(v, 0),
        { 'text-anchor': 'middle', fill: '#555555', 'font-size': '10' }));
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    setReadout(`${ID}-stats`, [
      ['Median', U.fmt(med, 2), MPL.C2],
      ['Median MAD', U.fmt(mMad, 3), MPL.C0],
      ['Mean MAD', U.fmt(U.mad(state.points), 3), MPL.C7],
      ['n', state.points.length, MPL.C7],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const med = U.median(state.points);
    const mMad = U.medianMad(state.points);
    const meanMad = U.mad(state.points);
    showExplanation(`${ID}-explanation`,
      `The median is <span class="hl">${U.fmt(med, 2)}</span>. Each point's distance from the median is shown in the chart.
       Median MAD = <span class="hl">${U.fmt(mMad, 3)}</span> vs. Mean MAD = ${U.fmt(meanMad, 3)}.
       Median MAD is <em>doubly robust</em>: uses the median as centre AND takes the median of the deviations.
       Try dragging one dot to an extreme value — notice how Median MAD barely moves compared to Mean MAD.
       This is why Median MAD is preferred for outlier detection in noisy real-world data.`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', ') });
  render();
})();

// ============================================================
// SECTION 8 — VARIANCE & STANDARD DEVIATION
// ============================================================
(function initVarianceSD() {
  const ID = 'variance-sd';
  const state = { points: [20, 40, 55, 68, 82] };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 112, YD = 68, SQ_TOP = 118, SQ_MAX = 218;

  renderFormula(`${ID}-formula`,
    '\\sigma^2 = \\dfrac{1}{N}\\sum_{i=1}^{N}(x_i - \\mu)^2, \\qquad \\sigma = \\sqrt{\\sigma^2}');

  buildLegend(`${ID}-legend`, [
    { latex: '\\sigma^2', name: 'Sigma-squared (variance)', desc: 'Average squared distance from the mean. In squared units.', exotic: true,
      example: '[2,4,6]: mean=4, squares=[4,0,4], σ²=8/3≈2.67' },
    { latex: '\\sigma',   name: 'Sigma (SD)',               desc: '√variance — back in the original units of the data.', exotic: true,
      example: 'σ = √2.67 ≈ 1.63 (same unit as the data)' },
    { latex: '\\mu',      name: 'Mu (population mean)',     desc: 'True mean of the entire population.', exotic: true },
    { latex: '(x_i-\\mu)^2', name: 'Squared deviation',    desc: 'Squaring keeps positivity and heavily penalises large deviations.' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    // Figure bg
    const vb = svg.viewBox.baseVal;
    svg.appendChild(svgEl('rect', { x: 0, y: 0, width: vb.width, height: vb.height, fill: MPL.figBg }));

    // Axes bg (dots area)
    svg.appendChild(svgEl('rect', { x: XM, y: Y_TOP, width: XX - XM, height: YA - Y_TOP, fill: MPL.axBg }));

    // Squares area (light yellow-white)
    svg.appendChild(svgEl('rect', { x: XM, y: SQ_TOP, width: XX - XM, height: SQ_MAX - SQ_TOP, fill: '#fffdf5' }));

    // Grid
    for (let v = DM; v <= DX + 1e-6; v += 10) {
      const x = toX(v, DM, DX, XM, XX);
      svg.appendChild(svgEl('line', { x1: x, y1: Y_TOP, x2: x, y2: SQ_MAX, stroke: MPL.grid, 'stroke-width': 0.8 }));
    }

    // Axis line + ticks
    svg.appendChild(svgEl('line', { x1: XM, y1: YA, x2: XX, y2: YA, stroke: MPL.spine, 'stroke-width': 1.5 }));
    for (let v = DM; v <= DX + 1e-6; v += 10) {
      const x = toX(v, DM, DX, XM, XX);
      svg.appendChild(svgEl('line', { x1: x, y1: YA, x2: x, y2: YA + 5, stroke: MPL.spine, 'stroke-width': 1.5 }));
      svg.appendChild(svgText(x, YA + 17, v, { 'text-anchor': 'middle', fill: MPL.tick, 'font-size': '11' }));
    }

    const m = U.mean(state.points);
    const v = U.variance(state.points);
    const s = Math.sqrt(v);
    const scale = (XX - XM) / (DX - DM);
    const mx = toX(m, DM, DX, XM, XX);

    // Squared area rects
    state.points.forEach((val) => {
      const x = toX(val, DM, DX, XM, XX);
      const dev = val - m;
      const side = Math.abs(dev) * scale;
      const left = dev >= 0 ? mx : mx - side;
      if (side > 1.5) {
        const sqH = Math.min(side, SQ_MAX - SQ_TOP - 4);
        const col = dev >= 0 ? MPL.C2 : MPL.C3;
        svg.appendChild(svgEl('rect', {
          x: left, y: SQ_TOP + 2, width: side, height: sqH,
          fill: `${col}22`, stroke: `${col}88`, 'stroke-width': 1
        }));
        if (side > 22) {
          svg.appendChild(svgText(left + side / 2, SQ_TOP + sqH / 2 + 5,
            `${U.fmt(dev ** 2, 1)}`,
            { 'text-anchor': 'middle', fill: col, 'font-size': '9', 'font-weight': 'bold' }));
        }
      }
    });

    // Mean line (orange)
    drawVLine(svg, mx, Y_TOP, SQ_MAX, MPL.C1, 'none');
    drawLabel(svg, mx, Y_TOP - 5, `μ = ${U.fmt(m, 2)}`, MPL.C1, 11);

    // ±σ band inside dot area
    const s1x1 = toX(m - s, DM, DX, XM, XX), s1x2 = toX(m + s, DM, DX, XM, XX);
    svg.appendChild(svgEl('rect', { x: s1x1, y: YD - 5, width: s1x2 - s1x1, height: 10,
      fill: `${MPL.C0}28`, rx: 2 }));

    // Dots
    state.points.forEach((val, i) => {
      const x = toX(val, DM, DX, XM, XX);
      drawDot1D(svg, val, x, YD, MPL.C0, (sx) => {
        state.points[i] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        render(); syncInputs(`${ID}-inputs`, state.points);
      });
      svg.appendChild(svgText(x, YD + 16, U.fmt(val, 0),
        { 'text-anchor': 'middle', fill: '#555555', 'font-size': '10' }));
    });

    // Borders
    svg.appendChild(svgEl('rect', { x: XM, y: Y_TOP, width: XX - XM, height: YA - Y_TOP,
      fill: 'none', stroke: MPL.spine, 'stroke-width': 1.5 }));
    svg.appendChild(svgEl('rect', { x: XM, y: SQ_TOP, width: XX - XM, height: SQ_MAX - SQ_TOP,
      fill: 'none', stroke: '#aaaaaa', 'stroke-width': 1, 'stroke-dasharray': '4 3' }));

    // Square-area label
    svg.appendChild(svgText(XM + 5, SQ_TOP + 14, '(xᵢ − μ)² areas',
      { fill: '#888888', 'font-size': '10', 'font-style': 'italic' }));

    setReadout(`${ID}-stats`, [
      ['μ (mean)', U.fmt(m, 3), MPL.C1],
      ['σ² (variance)', U.fmt(v, 3), MPL.C4],
      ['σ (SD)', U.fmt(s, 3), MPL.C0],
      ['n', state.points.length, MPL.C7],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const m = U.mean(state.points);
    const v = U.variance(state.points);
    const s = Math.sqrt(v);
    showExplanation(`${ID}-explanation`,
      `Mean μ = <span class="hl">${U.fmt(m, 2)}</span>. The coloured squares below the axis show each (xᵢ − μ)² — their areas are proportional to squared deviation.
       Variance = <span class="hl">${U.fmt(v, 2)}</span> (average square area). SD = <span class="hl">${U.fmt(s, 3)}</span> (√variance, back in original units).
       The blue band shows μ ± σ — in a normal distribution ~68% of data falls here.
       Squaring penalises outliers <em>quadratically</em> — a point twice as far contributes 4× as much to variance.
       Drag a dot far away and see how rapidly the squares grow.`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', ') });
  render();
})();

// ============================================================
// SECTION 9 — POPULATION VARIANCE σ²
// ============================================================
(function initPopVariance() {
  const ID = 'pop-variance';
  const state = { points: [12, 28, 44, 55, 68, 82, 94] };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 175, YD = 88;

  renderFormula(`${ID}-formula`,
    '\\sigma^2 = \\dfrac{\\displaystyle\\sum_{i=1}^{N}(x_i - \\mu)^2}{N}');

  buildLegend(`${ID}-legend`, [
    { latex: 'N',          name: 'N (population size)',  desc: 'We have every member of the population — nothing is estimated.' },
    { latex: '\\mu',       name: 'Mu (population mean)', desc: 'Exact true mean — computed from all N values.', exotic: true,
      example: 'Measuring every student in a school → that\'s the population.' },
    { latex: '\\sigma^2',  name: 'Population variance',  desc: 'Divides by N (not N−1) because μ is known exactly.' },
    { latex: '\\sigma',    name: 'Population SD',        desc: '√σ² — spread in original units.' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const m = U.mean(state.points);
    const v = U.variance(state.points, false);
    const s = Math.sqrt(v);
    const mx = toX(m, DM, DX, XM, XX);

    // Deviation lines
    state.points.forEach((val) => {
      const x = toX(val, DM, DX, XM, XX);
      const col = val >= m ? MPL.C2 : MPL.C1;
      svg.appendChild(svgEl('line', { x1: x, y1: YD + 14, x2: mx, y2: YD + 14,
        stroke: col, 'stroke-width': 2.5, opacity: 0.7 }));
    });

    // μ line (orange)
    drawVLine(svg, mx, Y_TOP, YA, MPL.C1, 'none');
    drawLabel(svg, mx, Y_TOP - 5, `μ = ${U.fmt(m, 2)}`, MPL.C1, 11);

    // ±σ dashed markers
    [[toX(m - s, DM, DX, XM, XX), '−σ'], [toX(m + s, DM, DX, XM, XX), '+σ']].forEach(([x, lbl]) => {
      drawVLine(svg, x, Y_TOP, YA, MPL.C2, '5 4');
      drawLabel(svg, x, Y_TOP + 12, lbl, MPL.C2, 10);
    });

    // Dots
    state.points.forEach((val, i) => {
      const x = toX(val, DM, DX, XM, XX);
      drawDot1D(svg, val, x, YD, MPL.C0, (sx) => {
        state.points[i] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        render(); syncInputs(`${ID}-inputs`, state.points);
      });
      svg.appendChild(svgText(x, YD + 30, U.fmt(val, 0),
        { 'text-anchor': 'middle', fill: '#555555', 'font-size': '10' }));
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    setReadout(`${ID}-stats`, [
      ['μ', U.fmt(m, 3), MPL.C1],
      ['σ²', U.fmt(v, 3), MPL.C4],
      ['σ', U.fmt(s, 3), MPL.C0],
      ['N', state.points.length, MPL.C7],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const m = U.mean(state.points);
    const v = U.variance(state.points, false);
    const s = Math.sqrt(v);
    showExplanation(`${ID}-explanation`,
      `This is a <span class="hl">population</span> of N = <span class="hl">${state.points.length}</span> — we have every data point, nothing estimated.
       Population mean μ = <span class="hl">${U.fmt(m, 3)}</span>, so we know the true centre exactly.
       Population variance σ² = <span class="hl">${U.fmt(v, 3)}</span>, dividing by N (not N−1).
       Population SD σ = <span class="hl">${U.fmt(s, 3)}</span> — the dashed green lines mark ±σ.
       When you can measure the whole population (e.g. every employee at one company), these are the correct formulas.`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', ') });
  render();
})();

// ============================================================
// SECTION 10 — SAMPLE VARIANCE s² (Bessel's Correction)
// ============================================================
(function initSampleVariance() {
  const ID = 'sample-variance';
  const state = { points: [18, 34, 52, 68, 81] };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 175, YD = 88;

  renderFormula(`${ID}-formula`,
    's^2 = \\dfrac{\\displaystyle\\sum_{i=1}^{n}(x_i - \\bar{x})^2}{n-1}');

  buildLegend(`${ID}-legend`, [
    { latex: 's^2',      name: 'Sample variance',     desc: 'Best estimate of population variance from a sample.' },
    { latex: 'n-1',      name: 'Bessel\'s correction', desc: 'Dividing by n−1 corrects the underestimation bias.', exotic: true,
      example: 'n=5 points → divide by 4 not 5, making s² ~25% larger than biased version' },
    { latex: '\\bar{x}', name: 'Sample mean',          desc: 'One degree of freedom is "used up" estimating this.' },
    { latex: 's',        name: 'Sample SD',             desc: '√s² — estimate of the population standard deviation.' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const m = U.mean(state.points);
    const popV = U.variance(state.points, false);
    const samV = U.variance(state.points, true);
    const samS = Math.sqrt(samV);
    const mx = toX(m, DM, DX, XM, XX);

    // Deviation lines
    state.points.forEach((val) => {
      const x = toX(val, DM, DX, XM, XX);
      const col = val >= m ? MPL.C2 : MPL.C1;
      svg.appendChild(svgEl('line', { x1: x, y1: YD + 14, x2: mx, y2: YD + 14,
        stroke: col, 'stroke-width': 2.5, opacity: 0.7 }));
    });

    // x̄ line
    drawVLine(svg, mx, Y_TOP, YA, MPL.C1, 'none');
    drawLabel(svg, mx, Y_TOP - 5, `x̄ = ${U.fmt(m, 2)}`, MPL.C1, 11);

    // ±s markers
    [[toX(m - samS, DM, DX, XM, XX), '−s'], [toX(m + samS, DM, DX, XM, XX), '+s']].forEach(([x, lbl]) => {
      drawVLine(svg, x, Y_TOP, YA, MPL.C4, '5 4');
      drawLabel(svg, x, Y_TOP + 12, lbl, MPL.C4, 10);
    });

    // n-1 annotation
    const denom = state.points.length - 1;
    svg.appendChild(svgText((XM + XX) / 2, YA - 12,
      `Dividing by n−1 = ${denom}  (not n = ${state.points.length})`,
      { 'text-anchor': 'middle', fill: MPL.C4, 'font-size': '11', 'font-weight': 'bold' }));

    // Dots
    state.points.forEach((val, i) => {
      const x = toX(val, DM, DX, XM, XX);
      drawDot1D(svg, val, x, YD, MPL.C1, (sx) => {
        state.points[i] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        render(); syncInputs(`${ID}-inputs`, state.points);
      });
      svg.appendChild(svgText(x, YD + 30, U.fmt(val, 0),
        { 'text-anchor': 'middle', fill: '#555555', 'font-size': '10' }));
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    setReadout(`${ID}-stats`, [
      ['x̄', U.fmt(m, 3), MPL.C1],
      ['s²', U.fmt(samV, 3), MPL.C4],
      ['s', U.fmt(samS, 3), MPL.C0],
      ['σ² (÷n)', U.fmt(popV, 3), MPL.C7],
      ['n', state.points.length, MPL.C7],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const n = state.points.length;
    const popV = U.variance(state.points, false);
    const samV = U.variance(state.points, true);
    const ratio = samV / popV;
    showExplanation(`${ID}-explanation`,
      `With n = <span class="hl">${n}</span> sample points, Bessel's correction divides by <span class="hl">n−1 = ${n - 1}</span> instead of n.
       Sample variance s² = <span class="hl">${U.fmt(samV, 3)}</span> vs. biased (÷n) = <span class="hl">${U.fmt(popV, 3)}</span> — a ratio of ${U.fmt(ratio, 3)}×.
       Why? Our sample mean x̄ is slightly pulled toward the sample points, so raw deviations are <em>too small</em>.
       Dividing by n−1 corrects this: s² is an unbiased estimator of true population variance σ².
       As n grows large, n−1 ≈ n and the correction vanishes. With only ${n} points it matters.`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', ') });
  render();
})();

// ============================================================
// SECTION 11 — IQR (Box Plot)
// ============================================================
(function initIQR() {
  const ID = 'iqr';
  const state = { points: [8, 18, 28, 38, 50, 62, 72, 82, 92] };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 170, YD = 48, BOX_Y = 62, BOX_H = 54;

  renderFormula(`${ID}-formula`,
    '\\text{IQR} = Q_3 - Q_1');

  buildLegend(`${ID}-legend`, [
    { latex: 'Q_1', name: 'First quartile (Q1)',  desc: '25th percentile — 25% of data falls below.' },
    { latex: 'Q_2', name: 'Second quartile (Q2)', desc: '50th percentile — the median.' },
    { latex: 'Q_3', name: 'Third quartile (Q3)',  desc: '75th percentile — 75% of data falls below.' },
    { latex: '\\text{IQR}', name: 'Interquartile Range', desc: 'Spread of the middle 50%. Robust to outliers.', exotic: true,
      example: 'Outlier fences: Q1 − 1.5·IQR  and  Q3 + 1.5·IQR' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const { q1, q2, q3 } = U.quartiles(state.points);
    const iqrVal = q3 - q1;
    const s = U.sorted(state.points);
    const fl = q1 - 1.5 * iqrVal, fh = q3 + 1.5 * iqrVal;
    const wlo = s.find(v => v >= fl) ?? s[0];
    const whi = [...s].reverse().find(v => v <= fh) ?? s[s.length - 1];

    const q1x = toX(q1, DM, DX, XM, XX), q3x = toX(q3, DM, DX, XM, XX);
    const q2x = toX(q2, DM, DX, XM, XX);
    const wlx = toX(wlo, DM, DX, XM, XX), whx = toX(whi, DM, DX, XM, XX);
    const midY = BOX_Y + BOX_H / 2;

    // Whisker lines
    svg.appendChild(svgEl('line', { x1: wlx, y1: midY, x2: q1x, y2: midY, stroke: '#333333', 'stroke-width': 1.5 }));
    svg.appendChild(svgEl('line', { x1: q3x, y1: midY, x2: whx, y2: midY, stroke: '#333333', 'stroke-width': 1.5 }));
    // Whisker caps
    svg.appendChild(svgEl('line', { x1: wlx, y1: BOX_Y + 12, x2: wlx, y2: BOX_Y + BOX_H - 12, stroke: '#333333', 'stroke-width': 1.5 }));
    svg.appendChild(svgEl('line', { x1: whx, y1: BOX_Y + 12, x2: whx, y2: BOX_Y + BOX_H - 12, stroke: '#333333', 'stroke-width': 1.5 }));

    // Box body
    svg.appendChild(svgEl('rect', { x: q1x, y: BOX_Y, width: q3x - q1x, height: BOX_H,
      fill: `${MPL.C0}30`, stroke: MPL.C0, 'stroke-width': 2, rx: 1 }));

    // Median line (orange — matplotlib default)
    svg.appendChild(svgEl('line', { x1: q2x, y1: BOX_Y, x2: q2x, y2: BOX_Y + BOX_H,
      stroke: MPL.C1, 'stroke-width': 3 }));

    // Q labels
    [['Q1', q1x, q1, MPL.C0], ['Q2', q2x, q2, MPL.C1], ['Q3', q3x, q3, MPL.C0]].forEach(([lbl, x, v, col]) => {
      drawLabel(svg, x, BOX_Y - 7, `${lbl}=${U.fmt(v, 1)}`, col, 10);
    });

    // IQR bracket below box
    const bY = BOX_Y + BOX_H + 14;
    svg.appendChild(svgEl('line', { x1: q1x, y1: bY, x2: q3x, y2: bY, stroke: MPL.C3, 'stroke-width': 2 }));
    svg.appendChild(svgEl('line', { x1: q1x, y1: bY - 4, x2: q1x, y2: bY + 4, stroke: MPL.C3, 'stroke-width': 2 }));
    svg.appendChild(svgEl('line', { x1: q3x, y1: bY - 4, x2: q3x, y2: bY + 4, stroke: MPL.C3, 'stroke-width': 2 }));
    drawLabel(svg, (q1x + q3x) / 2, bY + 14, `IQR = ${U.fmt(iqrVal, 1)}`, MPL.C3, 10);

    // Individual data dots (above box, matplotlib-style fliers as hollow circles)
    s.forEach((v) => {
      const x = toX(v, DM, DX, XM, XX);
      const isOutlier = v < fl || v > fh;
      const origIdx = state.points.indexOf(v);
      if (isOutlier) {
        svg.appendChild(svgEl('circle', { cx: x, cy: YD, r: 7,
          fill: 'white', stroke: MPL.C3, 'stroke-width': 2, style: 'cursor:grab' }));
        makeDraggable(document.getElementById(`${ID}-svg`), document.getElementById(`${ID}-svg`).lastChild, (sx) => {
          state.points[origIdx] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
          render(); syncInputs(`${ID}-inputs`, state.points);
        });
      } else {
        drawDot1D(svg, v, x, YD, MPL.C7, (sx) => {
          state.points[origIdx] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
          render(); syncInputs(`${ID}-inputs`, state.points);
        }, 5);
      }
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    setReadout(`${ID}-stats`, [
      ['Q1', U.fmt(q1, 2), MPL.C0],
      ['Median (Q2)', U.fmt(q2, 2), MPL.C1],
      ['Q3', U.fmt(q3, 2), MPL.C0],
      ['IQR', U.fmt(iqrVal, 2), MPL.C3],
      ['Outliers', s.filter(v => v < fl || v > fh).length, MPL.C3],
    ]);
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const { q1, q2, q3 } = U.quartiles(state.points);
    const iqrVal = q3 - q1;
    const fl = q1 - 1.5 * iqrVal, fh = q3 + 1.5 * iqrVal;
    const outliers = state.points.filter(v => v < fl || v > fh);
    showExplanation(`${ID}-explanation`,
      `Q1 = <span class="hl">${U.fmt(q1, 1)}</span>, Q2 (median) = <span class="hl">${U.fmt(q2, 1)}</span>, Q3 = <span class="hl">${U.fmt(q3, 1)}</span>.
       IQR = <span class="hl">${U.fmt(iqrVal, 1)}</span> — the blue box shows the middle 50% of your data.
       Outlier fences: Q1 − 1.5·IQR = ${U.fmt(fl, 1)}, Q3 + 1.5·IQR = ${U.fmt(fh, 1)}.
       ${outliers.length > 0 ? `<span class="hl3">${outliers.length} outlier(s)</span> (hollow red circles) detected.` : 'No outliers detected with the 1.5·IQR rule.'}
       The IQR ignores the top and bottom 25% entirely — far more robust than the range.`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', ') });
  render();
})();

// ============================================================
// SECTION 12 — POPULATION VS SAMPLE TOGGLE
// ============================================================
(function initPopVsSample() {
  const ID = 'pop-vs-sample';
  const state = { points: [15, 32, 50, 66, 80], mode: 'population' };
  const DM = 0, DX = 100, XM = 55, XX = 555;
  const Y_TOP = 18, YA = 138, YD = 88;

  function updateFormula() {
    const latex = state.mode === 'population'
      ? '\\sigma^2 = \\dfrac{\\sum(x_i - \\mu)^2}{N} \\qquad \\mu = \\dfrac{\\sum x_i}{N}'
      : 's^2 = \\dfrac{\\sum(x_i - \\bar{x})^2}{n-1} \\qquad \\bar{x} = \\dfrac{\\sum x_i}{n}';
    renderFormula(`${ID}-formula`, latex);
  }

  buildLegend(`${ID}-legend`, [
    { latex: 'N \\text{ vs } n', name: 'Pop. N vs Sample n', desc: 'N = entire group. n = a subset drawn from it.' },
    { latex: '\\mu \\text{ vs } \\bar{x}', name: 'μ vs x̄', desc: 'μ is the true population mean. x̄ is the estimated sample mean.', exotic: true },
    { latex: '\\sigma^2 \\text{ vs } s^2',  name: 'σ² vs s²', desc: 'Pop. variance ÷N. Sample variance ÷(n−1) for unbiasedness.', exotic: true,
      example: 'Same 5 values: σ²=272 (÷5), s²=340 (÷4) — s² is ~25% larger' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    drawAxisMpl(svg, XM, XX, Y_TOP, YA, DM, DX, 10);

    const isPop = state.mode === 'population';
    const m = U.mean(state.points);
    const v = U.variance(state.points, !isPop);
    const s = Math.sqrt(v);
    const mx = toX(m, DM, DX, XM, XX);
    const col = isPop ? MPL.C0 : MPL.C1;

    // ±σ/s band
    const sx1 = toX(m - s, DM, DX, XM, XX), sx2 = toX(m + s, DM, DX, XM, XX);
    svg.appendChild(svgEl('rect', { x: sx1, y: YD - 8, width: sx2 - sx1, height: 16,
      fill: `${MPL.C4}28`, rx: 2 }));
    drawLabel(svg, sx1, YD - 14, `−${isPop ? 'σ' : 's'}`, MPL.C4, 9);
    drawLabel(svg, sx2, YD - 14, `+${isPop ? 'σ' : 's'}`, MPL.C4, 9);

    // Mean/μ line
    drawVLine(svg, mx, Y_TOP, YA, MPL.C1, 'none');
    drawLabel(svg, mx, Y_TOP - 5, `${isPop ? 'μ' : 'x̄'} = ${U.fmt(m, 2)}`, MPL.C1, 11);

    // Mode label inside chart
    svg.appendChild(svgText((XM + XX) / 2, Y_TOP + 16,
      isPop ? 'POPULATION  ÷ N' : 'SAMPLE  ÷ (n−1)',
      { 'text-anchor': 'middle', fill: col, 'font-size': '13', 'font-weight': 'bold' }));

    // Dots
    state.points.forEach((val, i) => {
      const x = toX(val, DM, DX, XM, XX);
      drawDot1D(svg, val, x, YD, col, (sx) => {
        state.points[i] = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        render(); syncInputs(`${ID}-inputs`, state.points);
      });
      svg.appendChild(svgText(x, YD + 18, U.fmt(val, 0),
        { 'text-anchor': 'middle', fill: '#555555', 'font-size': '10' }));
    });

    drawSpine(svg, XM, Y_TOP, XX, YA);

    const denom = isPop ? state.points.length : state.points.length - 1;
    setReadout(`${ID}-stats`, [
      [isPop ? 'μ' : 'x̄', U.fmt(m, 3), MPL.C1],
      [isPop ? 'σ²' : 's²', U.fmt(v, 3), MPL.C4],
      [isPop ? 'σ' : 's', U.fmt(s, 3), MPL.C0],
      ['÷', denom, col],
      [isPop ? 'N' : 'n', state.points.length, MPL.C7],
    ]);
    updateFormula();
  }

  buildInputRow(`${ID}-inputs`, state.points, DM, DX, (i, v) => { state.points[i] = v; render(); });

  const toggleBtn = document.getElementById(`${ID}-toggle`);
  toggleBtn.addEventListener('click', () => {
    state.mode = state.mode === 'population' ? 'sample' : 'population';
    toggleBtn.textContent = state.mode === 'population'
      ? 'Viewing: Population — Switch to Sample'
      : 'Viewing: Sample — Switch to Population';
    render();
  });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const isPop = state.mode === 'population';
    const popV = U.variance(state.points, false);
    const samV = U.variance(state.points, true);
    showExplanation(`${ID}-explanation`,
      `Viewing <span class="hl">${isPop ? 'Population' : 'Sample'}</span> statistics.
       With these ${state.points.length} values: σ² = ${U.fmt(popV, 3)} (÷${state.points.length}), s² = ${U.fmt(samV, 3)} (÷${state.points.length - 1}).
       Difference = ${U.fmt(samV - popV, 3)} — Bessel's inflates s² by ${U.fmt(samV / popV, 4)}×.
       Toggle to switch and watch the ±spread band change.
       Rule: if your data IS the whole group → use σ². If it's a subset → use s².`
    );
  });

  SBS_SYNC[ID] = () => ({ data: state.points.join(', ') });
  render();
})();

// ============================================================
// SECTION 13 — Z-SCORE / Φ / ERF
// ============================================================
(function initZScore() {
  const ID = 'zscore';
  const state = { z: 1.0 };
  const Z_MIN = -4, Z_MAX = 4;
  const XM = 55, XX = 555, Y_TOP = 15, Y_BOT = 215, Y_AX = 215;
  const N = 250;

  renderFormula(`${ID}-formula`,
    'z = \\dfrac{x - \\mu}{\\sigma}, \\qquad \\Phi(z) = \\dfrac{1}{2}\\!\\left[1 + \\operatorname{erf}\\!\\!\\left(\\dfrac{z}{\\sqrt{2}}\\right)\\right]');

  buildLegend(`${ID}-legend`, [
    { latex: 'z',                      name: 'z-score',               desc: 'How many standard deviations x is from the mean.' },
    { latex: '\\mu, \\sigma',          name: 'Mean and SD',            desc: 'Parameters of the normal distribution.' },
    { latex: '\\Phi(z)',               name: 'Phi — CDF',             desc: 'Probability that a standard normal variable is ≤ z.', exotic: true,
      example: 'Φ(0) = 0.5, Φ(1.96) ≈ 0.975, Φ(−∞) = 0' },
    { latex: '\\operatorname{erf}(x)', name: 'Error function',        desc: 'Integral of e^(−t²) scaled so erf(∞) = 1. Φ is expressed in terms of erf.', exotic: true,
      example: 'erf(1) ≈ 0.8427 → Φ(√2) = (1+0.8427)/2 ≈ 0.921' },
  ]);

  function zToX(z) { return toX(z, Z_MIN, Z_MAX, XM, XX); }
  function pdfToY(p) { return Y_BOT - (p / 0.42) * (Y_BOT - Y_TOP - 8); }

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    // Full 2D axes with matplotlib style
    const vb = svg.viewBox.baseVal;
    svg.appendChild(svgEl('rect', { x: 0, y: 0, width: vb.width, height: vb.height, fill: MPL.figBg }));
    svg.appendChild(svgEl('rect', { x: XM, y: Y_TOP, width: XX - XM, height: Y_BOT - Y_TOP, fill: MPL.axBg }));

    // Vertical grid at integer z values
    for (let zv = Z_MIN; zv <= Z_MAX; zv++) {
      const x = zToX(zv);
      svg.appendChild(svgEl('line', { x1: x, y1: Y_TOP, x2: x, y2: Y_BOT, stroke: MPL.grid, 'stroke-width': 0.8 }));
    }

    // Horizontal grid at pdf y levels
    [0.1, 0.2, 0.3].forEach((p) => {
      const y = pdfToY(p);
      svg.appendChild(svgEl('line', { x1: XM, y1: y, x2: XX, y2: y, stroke: MPL.grid, 'stroke-width': 0.8 }));
      svg.appendChild(svgText(XM - 6, y + 4, U.fmt(p, 1),
        { 'text-anchor': 'end', fill: MPL.tick, 'font-size': '10' }));
      svg.appendChild(svgEl('line', { x1: XM - 4, y1: y, x2: XM, y2: y, stroke: MPL.spine, 'stroke-width': 1.5 }));
    });

    // Shaded CDF area
    const z = state.z;
    const zx = zToX(z);
    let shadePath = `M ${XM} ${Y_BOT}`;
    for (let i = 0; i <= N; i++) {
      const zv = Z_MIN + (Z_MAX - Z_MIN) * i / N;
      if (zv > z) break;
      shadePath += ` L ${zToX(zv)} ${pdfToY(U.normalPDF(zv))}`;
    }
    shadePath += ` L ${zx} ${Y_BOT} Z`;
    svg.appendChild(svgEl('path', { d: shadePath, fill: `${MPL.C0}40`, stroke: 'none' }));

    // Bell curve
    const pts = Array.from({ length: N + 1 }, (_, i) => {
      const zv = Z_MIN + (Z_MAX - Z_MIN) * i / N;
      return { x: zToX(zv), y: pdfToY(U.normalPDF(zv)) };
    });
    const curvePath = `M ${pts[0].x} ${pts[0].y} ` + pts.slice(1).map(p => `L ${p.x} ${p.y}`).join(' ');
    svg.appendChild(svgEl('path', { d: curvePath, fill: 'none', stroke: MPL.C0, 'stroke-width': 2.5 }));

    // z vertical line (red)
    const phi = U.phi(z);
    svg.appendChild(svgEl('line', { x1: zx, y1: pdfToY(U.normalPDF(z)), x2: zx, y2: Y_BOT,
      stroke: MPL.C3, 'stroke-width': 2.5 }));
    svg.appendChild(svgEl('circle', { cx: zx, cy: pdfToY(U.normalPDF(z)), r: 5,
      fill: MPL.C3, stroke: 'white', 'stroke-width': 1.5 }));
    drawLabel(svg, zx + (z < 3 ? 34 : -34), pdfToY(U.normalPDF(z)) - 8,
      `z = ${U.fmt(z, 2)}`, MPL.C3, 11);

    // CDF annotation
    drawLabel(svg, Math.max(XM + 60, Math.min((XM + zx) / 2, XX - 60)),
      Y_BOT - 16, `Φ(${U.fmt(z, 2)}) = ${U.fmt(phi, 4)}`, MPL.C0, 11);

    // X axis + ticks + σ labels
    svg.appendChild(svgEl('line', { x1: XM, y1: Y_BOT, x2: XX, y2: Y_BOT, stroke: MPL.spine, 'stroke-width': 1.5 }));
    for (let zv = Z_MIN; zv <= Z_MAX; zv++) {
      const x = zToX(zv);
      svg.appendChild(svgEl('line', { x1: x, y1: Y_BOT, x2: x, y2: Y_BOT + 5, stroke: MPL.spine, 'stroke-width': 1.5 }));
      const lbl = zv === 0 ? '0  (μ)' : `${zv}σ`;
      svg.appendChild(svgText(x, Y_BOT + 17, lbl,
        { 'text-anchor': 'middle', fill: MPL.tick, 'font-size': '10' }));
    }
    // Y-axis label
    svg.appendChild(svgText(XM - 5, Y_TOP - 5, 'PDF',
      { 'text-anchor': 'end', fill: '#666666', 'font-size': '10', 'font-style': 'italic' }));

    drawSpine(svg, XM, Y_TOP, XX, Y_BOT);

    setReadout(`${ID}-stats`, [
      ['z', U.fmt(z, 3), MPL.C3],
      ['Φ(z) = P(Z≤z)', U.fmt(phi, 5), MPL.C0],
      ['erf(z/√2)', U.fmt(U.erf(z / Math.sqrt(2)), 5), MPL.C4],
      ['PDF(z)', U.fmt(U.normalPDF(z), 5), MPL.C2],
    ]);
  }

  document.getElementById('zscore-slider').addEventListener('input', (e) => {
    state.z = +e.target.value;
    document.getElementById('zscore-z-val').textContent = U.fmt(state.z, 2);
    render();
  });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const z = state.z;
    const phi = U.phi(z);
    const pct = (phi * 100).toFixed(1);
    showExplanation(`${ID}-explanation`,
      `At z = <span class="hl">${U.fmt(z, 2)}</span>, the shaded area under the bell curve equals Φ(z) = <span class="hl">${U.fmt(phi, 4)}</span> (<span class="hl">${pct}%</span> of the distribution lies to the left of the red line).
       Computed via error function: erf(${U.fmt(z, 2)}/√2) = erf(${U.fmt(z / Math.sqrt(2), 3)}) ≈ <span class="hl">${U.fmt(U.erf(z / Math.sqrt(2)), 4)}</span>.
       ${Math.abs(z) <= 1 ? 'Z-scores within ±1σ cover ~68.3% of a normal distribution.' : Math.abs(z) <= 2 ? '±2σ covers ~95.4% of a normal distribution.' : '±3σ covers ~99.7% — the famous "three-sigma rule."'}
       A z-score normalises any N(μ,σ) into standard N(0,1), letting you use one table for all distributions.
       Drag the slider to update the shaded CDF area continuously.`
    );
  });

  SBS_SYNC[ID] = () => ({ x: U.fmt(state.z, 2), mu: '0', sig: '1' });
  render();
})();

// ============================================================
// SECTION 14 — COVARIANCE & PEARSON CORRELATION
// ============================================================
(function initCorrelation() {
  const ID = 'correlation';
  const state = {
    points: [
      { x: 15, y: 20 }, { x: 28, y: 38 }, { x: 42, y: 50 },
      { x: 58, y: 62 }, { x: 72, y: 70 }, { x: 85, y: 83 }
    ]
  };
  const DM = 0, DX = 100, XM = 55, XX = 560, Y_TOP = 15, Y_BOT = 265, DOT_R = 8;

  renderFormula(`${ID}-formula`,
    'r = \\dfrac{\\sum(x_i - \\bar{x})(y_i - \\bar{y})}{\\sqrt{\\sum(x_i-\\bar{x})^2 \\cdot \\sum(y_i-\\bar{y})^2}}');

  buildLegend(`${ID}-legend`, [
    { latex: 'r', name: 'Pearson r', desc: 'Correlation coefficient, −1 to +1.', exotic: true,
      example: 'r=+1 perfect positive, r=0 none, r=−1 perfect negative' },
    { latex: '\\text{Cov}(X,Y)', name: 'Covariance', desc: 'How X and Y vary together. Positive → both rise together.', exotic: true,
      example: 'Cov = Σ(xᵢ−x̄)(yᵢ−ȳ) / n' },
    { latex: '\\sigma_X, \\sigma_Y', name: 'Std. deviations', desc: 'Denominators that normalise covariance into −1 to +1.' },
    { latex: '\\bar{x}, \\bar{y}', name: 'Sample means', desc: 'Centre of each variable\'s distribution.' },
  ]);

  function render() {
    const svg = document.getElementById(`${ID}-svg`);
    clearSVG(svg);

    draw2DAxesMpl(svg, XM, Y_TOP, XX, Y_BOT, DM, DX, 20, DM, DX, 20);

    const xs = state.points.map(p => p.x);
    const ys = state.points.map(p => p.y);
    const r = U.correlation(xs, ys);
    const cov = U.covariance(xs, ys);

    // Mean crosshairs (dashed)
    const mmx = toX(U.mean(xs), DM, DX, XM, XX);
    const mmy = toY(U.mean(ys), DM, DX, Y_BOT, Y_TOP);
    svg.appendChild(svgEl('line', { x1: mmx, y1: Y_TOP, x2: mmx, y2: Y_BOT,
      stroke: MPL.C1, 'stroke-width': 1, 'stroke-dasharray': '5 3', opacity: 0.7 }));
    svg.appendChild(svgEl('line', { x1: XM, y1: mmy, x2: XX, y2: mmy,
      stroke: MPL.C1, 'stroke-width': 1, 'stroke-dasharray': '5 3', opacity: 0.7 }));

    // Regression line
    if (Math.abs(r) > 0.01) {
      const sx = U.sd(xs), sy = U.sd(ys);
      const b = r * (sy / sx), a = U.mean(ys) - b * U.mean(xs);
      const ly1 = toY(a + b * fromX(XM, DM, DX, XM, XX), DM, DX, Y_BOT, Y_TOP);
      const ly2 = toY(a + b * fromX(XX, DM, DX, XM, XX), DM, DX, Y_BOT, Y_TOP);
      svg.appendChild(svgEl('line', {
        x1: XM, y1: U.clamp(ly1, Y_TOP, Y_BOT),
        x2: XX, y2: U.clamp(ly2, Y_TOP, Y_BOT),
        stroke: MPL.C3, 'stroke-width': 2, 'stroke-dasharray': '6 3'
      }));
    }

    // r label (color by strength)
    const rCol = Math.abs(r) > 0.7 ? MPL.C2 : Math.abs(r) > 0.3 ? MPL.C1 : MPL.C7;
    drawLabel(svg, (XM + XX) / 2, Y_TOP + 18, `r = ${U.fmt(r, 4)}`, rCol, 14);

    // Dots (draggable in 2D)
    state.points.forEach((pt, i) => {
      const cx = toX(pt.x, DM, DX, XM, XX);
      const cy = toY(pt.y, DM, DX, Y_BOT, Y_TOP);
      const circle = svgEl('circle', { cx, cy, r: DOT_R,
        fill: MPL.C4, stroke: 'white', 'stroke-width': 1.5,
        opacity: 0.9, style: 'cursor:grab' });
      makeDraggable(svg, circle, (sx, sy) => {
        state.points[i].x = U.clamp(Math.round(fromX(sx, DM, DX, XM, XX)), DM, DX);
        state.points[i].y = U.clamp(Math.round(fromY(sy, DM, DX, Y_BOT, Y_TOP)), DM, DX);
        render();
      });
      svg.appendChild(circle);
    });

    // Axis labels
    svg.appendChild(svgText((XM + XX) / 2, Y_BOT + 30, 'X',
      { 'text-anchor': 'middle', fill: '#555555', 'font-size': '13', 'font-style': 'italic', 'font-weight': 'bold' }));
    svg.appendChild(svgText(18, (Y_TOP + Y_BOT) / 2, 'Y',
      { 'text-anchor': 'middle', fill: '#555555', 'font-size': '13', 'font-style': 'italic', 'font-weight': 'bold' }));

    drawSpine(svg, XM, Y_TOP, XX, Y_BOT);

    setReadout(`${ID}-stats`, [
      ['r (Pearson)', U.fmt(r, 4), rCol],
      ['Cov(X,Y)', U.fmt(cov, 2), MPL.C1],
      ['r²', U.fmt(r * r, 4), MPL.C4],
      ['n', state.points.length, MPL.C7],
    ]);
  }

  document.getElementById('correlation-add-btn').addEventListener('click', () => {
    if (state.points.length >= 12) return;
    const xs = state.points.map(p => p.x), ys = state.points.map(p => p.y);
    state.points.push({
      x: U.clamp(Math.round(U.mean(xs) + (Math.random() - 0.5) * 30), 5, 95),
      y: U.clamp(Math.round(U.mean(ys) + (Math.random() - 0.5) * 30), 5, 95)
    });
    render();
  });

  document.getElementById('correlation-remove-btn').addEventListener('click', () => {
    if (state.points.length <= 2) return;
    state.points.pop();
    render();
  });

  document.getElementById(`${ID}-explain-btn`).addEventListener('click', () => {
    const xs = state.points.map(p => p.x);
    const ys = state.points.map(p => p.y);
    const r = U.correlation(xs, ys);
    const cov = U.covariance(xs, ys);
    const strength = Math.abs(r) > 0.8 ? 'strong' : Math.abs(r) > 0.5 ? 'moderate' : Math.abs(r) > 0.2 ? 'weak' : 'negligible';
    const direction = r > 0 ? 'positive' : 'negative';
    showExplanation(`${ID}-explanation`,
      `r = <span class="hl">${U.fmt(r, 4)}</span> — a <span class="hl">${strength} ${direction}</span> linear relationship.
       Covariance = <span class="hl">${U.fmt(cov, 2)}</span>: ${cov > 0 ? 'positive → X and Y tend to rise together.' : 'negative → when X rises, Y tends to fall.'}
       r² = ${U.fmt(r * r, 4)} — X explains ${U.fmt(r * r * 100, 1)}% of variance in Y.
       The red dashed line is the linear regression. The dashed orange crosshairs mark (x̄, ȳ).
       Try arranging dots into a perfect line, L-shape, or circle. Remember: r measures <em>linear</em> correlation only.`
    );
  });

  SBS_SYNC[ID] = () => ({
    x: state.points.map(p => p.x).join(', '),
    y: state.points.map(p => p.y).join(', ')
  });
  render();
})();

// ============================================================
// STEP-BY-STEP VISUAL FORMULA FEATURE
// ============================================================
(function initStepByStep() {

  // ── Parse helpers ─────────────────────────────────────────
  function parseArr(str, name) {
    if (!str || !str.trim())
      throw new Error(`${name}: enter at least 2 numbers, comma-separated.`);
    const parts = str.split(',').map(s => s.trim()).filter(Boolean);
    if (parts.length < 2)
      throw new Error(`${name}: enter at least 2 numbers.`);
    return parts.map((s, i) => {
      const n = parseFloat(s);
      if (isNaN(n))
        throw new Error(`${name}: "${s}" is not a valid number (item ${i + 1}).`);
      return n;
    });
  }

  function parseNum(str, name) {
    if (!str || !str.trim())
      throw new Error(`${name}: enter a number.`);
    const n = parseFloat(str.trim());
    if (isNaN(n))
      throw new Error(`${name}: "${str}" is not a valid number.`);
    return n;
  }

  // ── LaTeX formatting helpers ──────────────────────────────
  function f(n, d = 2) { return Number(n).toFixed(d); }

  function lArr(arr, d = 2, max = 8) {
    const show = arr.length > max
      ? [...arr.slice(0, max).map(x => f(x, d)), '\\cdots']
      : arr.map(x => f(x, d));
    return '\\{' + show.join(',\\;') + '\\}';
  }

  function lSum(arr, d = 2, max = 6) {
    if (arr.length <= max) return arr.map(x => f(x, d)).join(' + ');
    return arr.slice(0, max).map(x => f(x, d)).join(' + ') + ' + \\cdots';
  }

  // ── UI builder ────────────────────────────────────────────
  function buildFields(containerId, fields) {
    const c = document.getElementById(containerId);
    if (!c) return;
    c.innerHTML = '';
    fields.forEach(fd => {
      if (fd.hidden) {
        const inp = document.createElement('input');
        inp.type = 'hidden';
        inp.id = fd.id;
        inp.value = fd.val || '';
        c.appendChild(inp);
        return;
      }
      const wrap = document.createElement('div');
      wrap.className = 'sbs-field';
      const lbl = document.createElement('label');
      lbl.className = 'sbs-label';
      lbl.textContent = fd.label;
      lbl.setAttribute('for', fd.id);
      const inp = document.createElement('input');
      inp.type = 'text';
      inp.id = fd.id;
      inp.className = 'sbs-input' + (fd.wide ? ' wide' : '');
      inp.placeholder = fd.ph || '';
      inp.value = fd.val || '';
      wrap.appendChild(lbl);
      wrap.appendChild(inp);
      c.appendChild(wrap);
    });
  }

  function renderSteps(outputId, steps) {
    const out = document.getElementById(outputId);
    if (!out) return;
    out.innerHTML = '';
    steps.forEach((s, i) => {
      const card = document.createElement('div');
      card.className = 'step-card';
      const num = document.createElement('div');
      num.className = 'step-num';
      num.textContent = `Step ${i + 1}`;
      const desc = document.createElement('div');
      desc.className = 'step-desc';
      desc.textContent = s.desc;
      const fmla = document.createElement('div');
      fmla.className = 'step-formula';
      katex.render(s.latex, fmla, { displayMode: true, throwOnError: false });
      card.appendChild(num);
      card.appendChild(desc);
      card.appendChild(fmla);
      out.appendChild(card);
    });
    out.classList.add('visible');
  }

  function initSection(ID, fields, generator) {
    const btn    = document.getElementById(`${ID}-stepbystep-btn`);
    const panel  = document.getElementById(`${ID}-stepbystep-panel`);
    const calc   = document.getElementById(`${ID}-generate-calc`);
    const errEl  = document.getElementById(`${ID}-sbs-error`);
    const out    = document.getElementById(`${ID}-stepbystep-output`);
    if (!btn || !panel || !calc) return;

    buildFields(`${ID}-stepbystep-fields`, fields);

    // Hide the recalculate button when all data comes directly from the chart
    const allHidden = fields.every(fd => fd.hidden);
    if (allHidden && calc) calc.style.display = 'none';

    btn.addEventListener('click', () => {
      const isOpening = !panel.classList.contains('visible');
      panel.classList.toggle('visible');
      if (isOpening) {
        const getter = SBS_SYNC[ID];
        if (getter) {
          const live = getter();
          fields.forEach(fd => {
            const inp = document.getElementById(fd.id);
            if (inp && live[fd.key] !== undefined) inp.value = live[fd.key];
          });
        }
        calc.click();
      }
    });

    calc.addEventListener('click', () => {
      if (errEl) { errEl.textContent = ''; errEl.classList.remove('visible'); }
      if (out)   { out.classList.remove('visible'); }
      const vals = {};
      fields.forEach(fd => {
        const inp = document.getElementById(fd.id);
        if (inp) { inp.classList.remove('error-field'); vals[fd.key] = inp.value.trim(); }
      });
      try {
        renderSteps(`${ID}-stepbystep-output`, generator(vals));
      } catch (e) {
        if (errEl) { errEl.textContent = e.message; errEl.classList.add('visible'); }
      }
    });
  }

  // ── 1. Range ──────────────────────────────────────────────
  initSection('range',
    [{ id: 'sbs-range-data', key: 'data', label: 'Data values', ph: 'e.g. 3, 7, 1, 9, 5', val: '3, 7, 1, 9, 5', wide: true, hidden: true }],
    (v) => {
      const data = parseArr(v.data, 'Data values');
      const s = U.sorted(data);
      const mn = s[0], mx = s[s.length - 1];
      const r = mx - mn;
      return [
        { desc: `Given data set (n = ${data.length})`,
          latex: `\\text{Data} = ${lArr(data)}` },
        { desc: 'Sort values in ascending order',
          latex: `\\text{Sorted} = ${lArr(s)}` },
        { desc: 'Identify the minimum and maximum',
          latex: `\\min = ${f(mn)}, \\quad \\max = ${f(mx)}` },
        { desc: 'Apply the range formula: R = max − min',
          latex: `R = ${f(mx)} - ${f(mn)} = \\boxed{${f(r)}}` }
      ];
    }
  );

  // ── 2. Mean ───────────────────────────────────────────────
  initSection('mean',
    [{ id: 'sbs-mean-data', key: 'data', label: 'Data values', ph: 'e.g. 4, 8, 15, 16, 23', val: '4, 8, 15, 16, 23', wide: true, hidden: true }],
    (v) => {
      const data = parseArr(v.data, 'Data values');
      const n = data.length;
      const sum = data.reduce((a, b) => a + b, 0);
      const mean = sum / n;
      return [
        { desc: `Given data (n = ${n})`,
          latex: `\\text{Data} = ${lArr(data)}, \\quad n = ${n}` },
        { desc: 'Sum all values',
          latex: `\\sum_{i=1}^{n} x_i = ${lSum(data)} = ${f(sum)}` },
        { desc: 'Divide the sum by n',
          latex: `\\bar{x} = \\frac{\\displaystyle\\sum x_i}{n} = \\frac{${f(sum)}}{${n}} = \\boxed{${f(mean)}}` }
      ];
    }
  );

  // ── 3. Median ─────────────────────────────────────────────
  initSection('median',
    [{ id: 'sbs-median-data', key: 'data', label: 'Data values', ph: 'e.g. 3, 1, 7, 5, 9', val: '3, 1, 7, 5, 9', wide: true, hidden: true }],
    (v) => {
      const data = parseArr(v.data, 'Data values');
      const n = data.length;
      const s = U.sorted(data);
      const steps = [
        { desc: `Given data (n = ${n})`,
          latex: `\\text{Data} = ${lArr(data)}, \\quad n = ${n}` },
        { desc: 'Sort values in ascending order',
          latex: `\\text{Sorted} = ${lArr(s)}` }
      ];
      if (n % 2 === 1) {
        const mid = (n - 1) / 2;
        steps.push({
          desc: `n = ${n} is odd → take the middle element at position ${mid + 1}`,
          latex: `\\text{Median} = x_{\\left(\\frac{n+1}{2}\\right)} = x_{(${mid + 1})} = \\boxed{${f(s[mid])}}`
        });
      } else {
        const lo = n / 2 - 1, hi = n / 2;
        steps.push({
          desc: `n = ${n} is even → average the two middle elements at positions ${lo + 1} and ${hi + 1}`,
          latex: `\\text{Median} = \\frac{x_{(${lo + 1})} + x_{(${hi + 1})}}{2} = \\frac{${f(s[lo])} + ${f(s[hi])}}{2} = \\boxed{${f((s[lo] + s[hi]) / 2)}}`
        });
      }
      return steps;
    }
  );

  // ── 4. Percentile ─────────────────────────────────────────
  initSection('percentile',
    [
      { id: 'sbs-pct-data', key: 'data', label: 'Data values', ph: 'e.g. 2, 5, 8, 10, 14, 20', val: '2, 5, 8, 10, 14, 20', wide: true, hidden: true },
      { id: 'sbs-pct-k',    key: 'k',    label: 'Percentile k (0–100)', ph: '50', val: '50' }
    ],
    (v) => {
      const data = parseArr(v.data, 'Data values');
      const k = parseNum(v.k, 'Percentile k');
      if (k < 0 || k > 100) throw new Error('Percentile k must be between 0 and 100.');
      const s = U.sorted(data);
      const n = s.length;
      const idx = k * (n - 1) / 100;
      const lo = Math.floor(idx);
      const fr = idx - lo;
      const hi = Math.min(lo + 1, n - 1);
      const val = s[lo] + fr * (s[hi] - s[lo]);
      return [
        { desc: `Given data (n = ${n}), k = ${f(k, 0)}th percentile`,
          latex: `\\text{Sorted} = ${lArr(s)}, \\quad n = ${n}, \\quad k = ${f(k, 0)}` },
        { desc: 'Compute the fractional index L = k/100 · (n−1)',
          latex: `L = \\frac{k}{100}(n-1) = \\frac{${f(k, 0)}}{100} \\cdot ${n - 1} = ${f(idx, 4)}` },
        { desc: 'Split into integer part i and fractional part d',
          latex: `i = \\lfloor ${f(idx, 4)} \\rfloor = ${lo}, \\quad d = ${f(idx, 4)} - ${lo} = ${f(fr, 4)}` },
        { desc: `Adjacent sorted values: x[${lo + 1}] and x[${hi + 1}]`,
          latex: `x_{(${lo + 1})} = ${f(s[lo])}, \\quad x_{(${hi + 1})} = ${f(s[hi])}` },
        { desc: 'Linear interpolation',
          latex: `P_{${f(k, 0)}} = x_{(i)} + d\\cdot(x_{(i+1)} - x_{(i)}) = ${f(s[lo])} + ${f(fr, 4)}\\cdot(${f(s[hi])} - ${f(s[lo])}) = \\boxed{${f(val)}}` }
      ];
    }
  );

  // ── 5. Trimmed Mean ───────────────────────────────────────
  initSection('trimmed-mean',
    [
      { id: 'sbs-tm-data',  key: 'data',  label: 'Data values', ph: 'e.g. 2, 4, 4, 5, 6, 7, 8, 9, 50', val: '2, 4, 4, 5, 6, 7, 8, 9, 50', wide: true, hidden: true },
      { id: 'sbs-tm-alpha', key: 'alpha', label: 'Trim α (%)', ph: '10', val: '10' }
    ],
    (v) => {
      const data = parseArr(v.data, 'Data values');
      const alpha = parseNum(v.alpha, 'Trim α');
      if (alpha < 0 || alpha >= 50) throw new Error('Trim α must be between 0 and 49.');
      const n = data.length;
      const s = U.sorted(data);
      const g = Math.floor((alpha / 100) * n);
      const inner = g > 0 ? s.slice(g, n - g) : [...s];
      if (inner.length === 0) throw new Error('Too aggressive trim — no values remain.');
      const innerSum = inner.reduce((a, b) => a + b, 0);
      const tm = innerSum / inner.length;
      return [
        { desc: `Given data (n = ${n}), α = ${f(alpha, 0)}%`,
          latex: `\\text{Sorted} = ${lArr(s)}, \\quad n = ${n}, \\quad \\alpha = ${f(alpha, 0)}\\%` },
        { desc: 'Compute how many values to remove from each end',
          latex: `g = \\left\\lfloor \\frac{\\alpha}{100} \\cdot n \\right\\rfloor = \\left\\lfloor \\frac{${f(alpha, 0)}}{100} \\cdot ${n} \\right\\rfloor = ${g}` },
        { desc: `Remove ${g} value(s) from each end → ${inner.length} values remain`,
          latex: `\\text{Inner} = ${lArr(inner)}` },
        { desc: 'Sum the remaining values and divide by their count',
          latex: `\\bar{x}_{\\alpha} = \\frac{${lSum(inner)}}{${inner.length}} = \\frac{${f(innerSum)}}{${inner.length}} = \\boxed{${f(tm)}}` }
      ];
    }
  );

  // ── 6. Mean Absolute Deviation (MAD) ──────────────────────
  initSection('mad',
    [{ id: 'sbs-mad-data', key: 'data', label: 'Data values', ph: 'e.g. 2, 4, 4, 4, 5, 5, 7, 9', val: '2, 4, 4, 4, 5, 5, 7, 9', wide: true, hidden: true }],
    (v) => {
      const data = parseArr(v.data, 'Data values');
      const n = data.length;
      const mean = U.mean(data);
      const absDevs = data.map(x => Math.abs(x - mean));
      const sumDev = absDevs.reduce((a, b) => a + b, 0);
      const mad = sumDev / n;
      const SHOW = Math.min(n, 5);
      const devLatex = data.slice(0, SHOW).map(x => `|${f(x)} - ${f(mean)}|`).join(' + ') + (n > SHOW ? ' + \\cdots' : '');
      const absLatex = absDevs.slice(0, SHOW).map(x => f(x)).join(' + ') + (n > SHOW ? ' + \\cdots' : '');
      return [
        { desc: `Given data (n = ${n})`,
          latex: `\\text{Data} = ${lArr(data)}, \\quad n = ${n}` },
        { desc: 'Compute the mean',
          latex: `\\bar{x} = \\frac{${lSum(data)}}{${n}} = ${f(mean)}` },
        { desc: 'Write out absolute deviations |xi − x̄|',
          latex: `|x_i - \\bar{x}|:\\; ${devLatex}` },
        { desc: 'Evaluate each absolute deviation',
          latex: `= ${absLatex} \\quad \\Rightarrow \\text{sum} = ${f(sumDev)}` },
        { desc: 'Divide the total by n',
          latex: `\\text{MAD} = \\frac{\\sum|x_i - \\bar{x}|}{n} = \\frac{${f(sumDev)}}{${n}} = \\boxed{${f(mad)}}` }
      ];
    }
  );

  // ── 7. Median Absolute Deviation ──────────────────────────
  initSection('median-mad',
    [{ id: 'sbs-mmad-data', key: 'data', label: 'Data values', ph: 'e.g. 1, 1, 2, 2, 4, 6, 9', val: '1, 1, 2, 2, 4, 6, 9', wide: true, hidden: true }],
    (v) => {
      const data = parseArr(v.data, 'Data values');
      const n = data.length;
      const med = U.median(data);
      const rawDevs = data.map(x => Math.abs(x - med));
      const sortedDevs = U.sorted(rawDevs);
      const medAD = U.median(sortedDevs);
      const SHOW = Math.min(n, 6);
      const devLatex = data.slice(0, SHOW).map(x => `|${f(x)}-${f(med)}|`).join(',\\;') + (n > SHOW ? ',\\;\\cdots' : '');
      return [
        { desc: `Given data (n = ${n})`,
          latex: `\\text{Data} = ${lArr(data)}, \\quad n = ${n}` },
        { desc: 'Compute the median of the data',
          latex: `\\tilde{x} = \\operatorname{median}(\\text{Data}) = ${f(med)}` },
        { desc: 'Compute absolute deviations from the median',
          latex: `|x_i - \\tilde{x}|:\\; ${devLatex}` },
        { desc: 'Sort those absolute deviations',
          latex: `\\text{Sorted deviations} = ${lArr(sortedDevs)}` },
        { desc: 'Take the median of the sorted deviations',
          latex: `\\operatorname{MedAD} = \\operatorname{median}\\!\\left(|x_i - \\tilde{x}|\\right) = \\boxed{${f(medAD)}}` }
      ];
    }
  );

  // ── 8. Variance & SD (population) ────────────────────────
  initSection('variance-sd',
    [{ id: 'sbs-vsd-data', key: 'data', label: 'Data values', ph: 'e.g. 2, 4, 4, 4, 5, 5, 7, 9', val: '2, 4, 4, 4, 5, 5, 7, 9', wide: true, hidden: true }],
    (v) => {
      const data = parseArr(v.data, 'Data values');
      const n = data.length;
      const mean = U.mean(data);
      const sqDevs = data.map(x => (x - mean) ** 2);
      const sumSq = sqDevs.reduce((a, b) => a + b, 0);
      const variance = sumSq / n;
      const sd = Math.sqrt(variance);
      const SHOW = Math.min(n, 5);
      const sqLatex = data.slice(0, SHOW).map(x => `(${f(x)}-${f(mean)})^2`).join('+') + (n > SHOW ? '+\\cdots' : '');
      const sqVals  = sqDevs.slice(0, SHOW).map(x => f(x)).join('+') + (n > SHOW ? '+\\cdots' : '');
      return [
        { desc: `Given data (n = ${n})`,
          latex: `\\text{Data} = ${lArr(data)}, \\quad N = ${n}` },
        { desc: 'Compute the population mean μ',
          latex: `\\mu = \\frac{${lSum(data)}}{${n}} = ${f(mean)}` },
        { desc: 'Compute squared deviations (xi − μ)²',
          latex: sqLatex },
        { desc: 'Evaluate the squared deviations',
          latex: `= ${sqVals} \\quad \\Rightarrow \\sum = ${f(sumSq)}` },
        { desc: 'Divide by N (population — no correction)',
          latex: `\\sigma^2 = \\frac{\\sum(x_i - \\mu)^2}{N} = \\frac{${f(sumSq)}}{${n}} = ${f(variance)}` },
        { desc: 'Square root gives population standard deviation',
          latex: `\\sigma = \\sqrt{\\sigma^2} = \\sqrt{${f(variance)}} = \\boxed{${f(sd)}}` }
      ];
    }
  );

  // ── 9. Population Variance ────────────────────────────────
  initSection('pop-variance',
    [{ id: 'sbs-pv-data', key: 'data', label: 'Population values', ph: 'e.g. 2, 4, 4, 4, 5, 5, 7, 9', val: '2, 4, 4, 4, 5, 5, 7, 9', wide: true, hidden: true }],
    (v) => {
      const data = parseArr(v.data, 'Population values');
      const n = data.length;
      const mean = U.mean(data);
      const sqDevs = data.map(x => (x - mean) ** 2);
      const sumSq = sqDevs.reduce((a, b) => a + b, 0);
      const variance = sumSq / n;
      const SHOW = Math.min(n, 5);
      const sqLatex = data.slice(0, SHOW).map(x => `(${f(x)}-${f(mean)})^2`).join('+') + (n > SHOW ? '+\\cdots' : '');
      return [
        { desc: `Given the entire population (N = ${n})`,
          latex: `\\text{Population} = ${lArr(data)}, \\quad N = ${n}` },
        { desc: 'Compute the population mean μ',
          latex: `\\mu = \\frac{${lSum(data)}}{${n}} = ${f(mean)}` },
        { desc: 'Compute each squared deviation (xi − μ)²',
          latex: sqLatex },
        { desc: 'Sum the squared deviations',
          latex: `\\sum(x_i - \\mu)^2 = ${sqDevs.slice(0,SHOW).map(x=>f(x)).join('+')}${n>SHOW?'+\\cdots':''} = ${f(sumSq)}` },
        { desc: 'Divide by N (the full population size)',
          latex: `\\sigma^2 = \\frac{\\sum(x_i-\\mu)^2}{N} = \\frac{${f(sumSq)}}{${n}} = \\boxed{${f(variance)}}` }
      ];
    }
  );

  // ── 10. Sample Variance ───────────────────────────────────
  initSection('sample-variance',
    [{ id: 'sbs-sv-data', key: 'data', label: 'Sample values', ph: 'e.g. 2, 4, 4, 4, 5, 5, 7, 9', val: '2, 4, 4, 4, 5, 5, 7, 9', wide: true, hidden: true }],
    (v) => {
      const data = parseArr(v.data, 'Sample values');
      const n = data.length;
      if (n < 2) throw new Error('Sample variance requires at least 2 values.');
      const mean = U.mean(data);
      const sqDevs = data.map(x => (x - mean) ** 2);
      const sumSq = sqDevs.reduce((a, b) => a + b, 0);
      const sVar = sumSq / (n - 1);
      const sd = Math.sqrt(sVar);
      const SHOW = Math.min(n, 5);
      const sqLatex = data.slice(0, SHOW).map(x => `(${f(x)}-${f(mean)})^2`).join('+') + (n > SHOW ? '+\\cdots' : '');
      return [
        { desc: `Given sample (n = ${n})`,
          latex: `\\text{Sample} = ${lArr(data)}, \\quad n = ${n}` },
        { desc: 'Compute the sample mean x̄',
          latex: `\\bar{x} = \\frac{${lSum(data)}}{${n}} = ${f(mean)}` },
        { desc: 'Compute squared deviations (xi − x̄)²',
          latex: sqLatex },
        { desc: 'Sum the squared deviations',
          latex: `\\sum(x_i - \\bar{x})^2 = ${sqDevs.slice(0,SHOW).map(x=>f(x)).join('+')}${n>SHOW?'+\\cdots':''} = ${f(sumSq)}` },
        { desc: `Bessel's correction: divide by n−1 = ${n - 1} instead of n`,
          latex: `s^2 = \\frac{\\sum(x_i-\\bar{x})^2}{n-1} = \\frac{${f(sumSq)}}{${n - 1}} = ${f(sVar)}` },
        { desc: 'Square root gives the sample standard deviation',
          latex: `s = \\sqrt{s^2} = \\sqrt{${f(sVar)}} = \\boxed{${f(sd)}}` }
      ];
    }
  );

  // ── 11. IQR ───────────────────────────────────────────────
  initSection('iqr',
    [{ id: 'sbs-iqr-data', key: 'data', label: 'Data values', ph: 'e.g. 3, 7, 8, 5, 12, 14, 21, 13', val: '3, 7, 8, 5, 12, 14, 21, 13', wide: true, hidden: true }],
    (v) => {
      const data = parseArr(v.data, 'Data values');
      const n = data.length;
      const s = U.sorted(data);
      const q = U.quartiles(s);
      const iqr = q.q3 - q.q1;
      const loHalf = s.slice(0, Math.floor(n / 2));
      const hiHalf = n % 2 ? s.slice(Math.ceil(n / 2)) : s.slice(n / 2);
      return [
        { desc: `Given data (n = ${n})`,
          latex: `\\text{Data} = ${lArr(data)}, \\quad n = ${n}` },
        { desc: 'Sort values in ascending order',
          latex: `\\text{Sorted} = ${lArr(s)}` },
        { desc: 'Split into lower and upper halves',
          latex: `\\text{Lower half} = ${lArr(loHalf)}, \\quad \\text{Upper half} = ${lArr(hiHalf)}` },
        { desc: 'Q1 = median of lower half, Q2 = overall median, Q3 = median of upper half',
          latex: `Q_1 = ${f(q.q1)}, \\quad Q_2 = ${f(q.q2)}, \\quad Q_3 = ${f(q.q3)}` },
        { desc: 'IQR = Q3 − Q1',
          latex: `\\text{IQR} = Q_3 - Q_1 = ${f(q.q3)} - ${f(q.q1)} = \\boxed{${f(iqr)}}` }
      ];
    }
  );

  // ── 12. Population vs Sample ──────────────────────────────
  initSection('pop-vs-sample',
    [{ id: 'sbs-pvs-data', key: 'data', label: 'Data values', ph: 'e.g. 4, 8, 15, 16, 23', val: '4, 8, 15, 16, 23', wide: true, hidden: true }],
    (v) => {
      const data = parseArr(v.data, 'Data values');
      const n = data.length;
      if (n < 2) throw new Error('Need at least 2 values to compare population vs sample.');
      const mean = U.mean(data);
      const sumSq = data.reduce((acc, x) => acc + (x - mean) ** 2, 0);
      const popVar = sumSq / n;
      const samVar = sumSq / (n - 1);
      return [
        { desc: `Given n = ${n} values (same data, two interpretations)`,
          latex: `\\text{Data} = ${lArr(data)}, \\quad n = ${n}` },
        { desc: 'Compute the mean — identical for both',
          latex: `\\bar{x} = \\mu = \\frac{${lSum(data)}}{${n}} = ${f(mean)}` },
        { desc: 'Compute the sum of squared deviations — also identical',
          latex: `\\sum(x_i - \\bar{x})^2 = ${f(sumSq)}` },
        { desc: 'Population variance: divide by N (you measured the whole group)',
          latex: `\\sigma^2 = \\frac{${f(sumSq)}}{${n}} = ${f(popVar)}, \\quad \\sigma = ${f(Math.sqrt(popVar))}` },
        { desc: `Sample variance: divide by n−1 = ${n - 1} (Bessel's correction for a sample)`,
          latex: `s^2 = \\frac{${f(sumSq)}}{${n - 1}} = ${f(samVar)}, \\quad s = ${f(Math.sqrt(samVar))}` },
        { desc: 'The correction inflates variance slightly to account for underestimation in samples',
          latex: `s^2 - \\sigma^2 = ${f(samVar)} - ${f(popVar)} = ${f(samVar - popVar)}` }
      ];
    }
  );

  // ── 13. Z-score / Φ / Erf ────────────────────────────────
  initSection('zscore',
    [
      { id: 'sbs-z-x',   key: 'x',   label: 'Observation x', ph: '75', val: '75' },
      { id: 'sbs-z-mu',  key: 'mu',  label: 'Mean μ',         ph: '70', val: '70' },
      { id: 'sbs-z-sig', key: 'sig', label: 'Std Dev σ (> 0)', ph: '5', val: '5'  }
    ],
    (v) => {
      const x   = parseNum(v.x,   'Observation x');
      const mu  = parseNum(v.mu,  'Mean μ');
      const sig = parseNum(v.sig, 'Std Dev σ');
      if (sig <= 0) throw new Error('Standard deviation σ must be greater than 0.');
      const z    = (x - mu) / sig;
      const phi  = U.phi(z);
      const above = 1 - phi;
      return [
        { desc: 'Given values',
          latex: `x = ${f(x)}, \\quad \\mu = ${f(mu)}, \\quad \\sigma = ${f(sig)}` },
        { desc: 'Subtract the mean',
          latex: `x - \\mu = ${f(x)} - ${f(mu)} = ${f(x - mu)}` },
        { desc: 'Divide by σ to obtain the z-score',
          latex: `z = \\frac{x - \\mu}{\\sigma} = \\frac{${f(x - mu)}}{${f(sig)}} = \\boxed{${f(z, 4)}}` },
        { desc: 'Φ(z) = P(Z ≤ z) — cumulative probability to the LEFT of z',
          latex: `\\Phi(${f(z, 4)}) = ${f(phi, 4)} \\approx ${f(phi * 100, 2)}\\%` },
        { desc: 'P(Z > z) — probability to the RIGHT of z',
          latex: `P(Z > ${f(z, 4)}) = 1 - \\Phi(${f(z, 4)}) = 1 - ${f(phi, 4)} = ${f(above, 4)}` },
        { desc: 'Φ expressed via the error function erf',
          latex: `\\Phi(z) = \\frac{1}{2}\\!\\left[1 + \\operatorname{erf}\\!\\left(\\frac{z}{\\sqrt{2}}\\right)\\right] = \\frac{1}{2}\\!\\left[1 + \\operatorname{erf}(${f(z / Math.sqrt(2), 4)})\\right]` }
      ];
    }
  );

  // ── 14. Covariance & Pearson Correlation ──────────────────
  initSection('correlation',
    [
      { id: 'sbs-cor-x', key: 'x', label: 'X values', ph: 'e.g. 1, 2, 3, 4, 5', val: '1, 2, 3, 4, 5', wide: true, hidden: true },
      { id: 'sbs-cor-y', key: 'y', label: 'Y values', ph: 'e.g. 2, 4, 5, 4, 5', val: '2, 4, 5, 4, 5', wide: true, hidden: true }
    ],
    (v) => {
      const xs = parseArr(v.x, 'X values');
      const ys = parseArr(v.y, 'Y values');
      if (xs.length !== ys.length)
        throw new Error(`X and Y must have the same number of values (got ${xs.length} and ${ys.length}).`);
      const n = xs.length;
      if (n < 2) throw new Error('Need at least 2 data points.');
      const mx = U.mean(xs), my = U.mean(ys);
      const prods = xs.map((x, i) => (x - mx) * (ys[i] - my));
      const sumProd = prods.reduce((a, b) => a + b, 0);
      const cov = sumProd / (n - 1);
      const sx = U.sd(xs, true), sy = U.sd(ys, true);
      const r = (sx * sy) > 1e-12 ? cov / (sx * sy) : 0;
      const SHOW = Math.min(n, 4);
      const prodsLatex = prods.slice(0, SHOW).map(p => f(p)).join(' + ') + (n > SHOW ? ' + \\cdots' : '');
      return [
        { desc: `Given ${n} (x, y) pairs`,
          latex: `X = ${lArr(xs)}, \\quad Y = ${lArr(ys)}` },
        { desc: 'Compute the means',
          latex: `\\bar{x} = ${f(mx)}, \\quad \\bar{y} = ${f(my)}` },
        { desc: 'Compute each cross-product (xi − x̄)(yi − ȳ)',
          latex: `(x_i-\\bar{x})(y_i-\\bar{y}):\\; ${prodsLatex}` },
        { desc: `Sum all cross-products and divide by n−1 = ${n - 1} (sample covariance)`,
          latex: `\\operatorname{Cov}(X,Y) = \\frac{\\sum(x_i-\\bar{x})(y_i-\\bar{y})}{n-1} = \\frac{${f(sumProd)}}{${n - 1}} = ${f(cov)}` },
        { desc: 'Compute the sample standard deviations',
          latex: `s_x = ${f(sx)}, \\quad s_y = ${f(sy)}` },
        { desc: 'Divide covariance by (sx · sy) to normalize',
          latex: `r = \\frac{\\operatorname{Cov}(X,Y)}{s_x \\cdot s_y} = \\frac{${f(cov)}}{${f(sx)} \\cdot ${f(sy)}} = \\boxed{${f(r, 4)}}` }
      ];
    }
  );

})();

// ============================================================
// SIDEBAR — ACTIVE SECTION HIGHLIGHT (Intersection Observer)
// ============================================================
(function initSidebar() {
  const links = document.querySelectorAll('#sidebar-nav .nav-link');
  const sections = document.querySelectorAll('.stat-section');

  if (!('IntersectionObserver' in window)) return;

  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          const id = entry.target.id;
          links.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === `#${id}`);
          });
        }
      });
    },
    { threshold: 0.25 }
  );

  sections.forEach(s => observer.observe(s));

  links.forEach(link => {
    link.addEventListener('click', (e) => {
      const target = document.querySelector(link.getAttribute('href'));
      if (target) {
        e.preventDefault();
        target.scrollIntoView({ behavior: 'smooth', block: 'start' });
      }
    });
  });
})();
