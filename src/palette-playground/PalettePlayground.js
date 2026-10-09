import './playground.css';
import { palette as scenePalette, config } from '../background/config.js';
import { TOKENS, GLOW } from './tokens.js';
import { PRESETS } from './presets.js';

const STORAGE_KEY = 'hm-palette';
const HEX = /^#[0-9a-f]{6}$/i;

const toHex = (value) =>
  typeof value === 'number' ? `#${value.toString(16).padStart(6, '0')}` : value.trim().toLowerCase();

const clampGlow = (value) => Math.min(GLOW.max, Math.max(GLOW.min, value));

/** Current values from the live site: CSS custom properties and the scene config. */
function readDefaults(background) {
  const css = getComputedStyle(document.documentElement);
  const colors = {};
  for (const t of TOKENS) colors[t.id] = toHex(t.scene ? scenePalette[t.scene] : css.getPropertyValue(t.css));
  return { colors, glow: background?.glow ?? config.bloom.strength };
}

// --- Sharing: palette <-> URL query (?palette&p=ff2bd6-00f0ff-…&g=0.55) ---

function toQuery({ colors, glow }) {
  const p = TOKENS.map((t) => colors[t.id].slice(1)).join('-');
  return `palette&p=${p}&g=${glow}`;
}

function fromQuery(params) {
  const values = params.get('p')?.split('-').map((v) => `#${v.toLowerCase()}`);
  if (!values || values.length !== TOKENS.length || !values.every((v) => HEX.test(v))) return null;
  const colors = Object.fromEntries(TOKENS.map((t, i) => [t.id, values[i]]));
  const glow = Number.parseFloat(params.get('g'));
  return { colors, glow: Number.isFinite(glow) ? clampGlow(glow) : undefined };
}

// --- Persistence (per browser, best effort) ---

function loadSaved() {
  try {
    const saved = JSON.parse(localStorage.getItem(STORAGE_KEY));
    if (saved && TOKENS.every((t) => HEX.test(saved.colors?.[t.id]))) return saved;
  } catch {
    // Storage unavailable or corrupt: start from defaults.
  }
  return null;
}

function save(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // Private mode / blocked storage: the palette just won't be remembered.
  }
}

function forget() {
  try {
    localStorage.removeItem(STORAGE_KEY);
  } catch {
    // Nothing to forget.
  }
}

async function copyText(text) {
  try {
    await navigator.clipboard.writeText(text);
    return true;
  } catch {
    const area = Object.assign(document.createElement('textarea'), { value: text });
    document.body.append(area);
    area.select();
    const ok = document.execCommand('copy');
    area.remove();
    return ok;
  }
}

/** Plain-text summary for designers plus ready-to-paste values for the code. */
function exportText({ colors, glow }) {
  const lines = ['Paleta Hackmeeting 0x7EA', ''];
  for (const t of TOKENS) lines.push(`${t.label}: ${colors[t.id]}`);
  lines.push(`Brillo neón: ${glow}`, '', '/* src/styles/main.css (:root) */');
  for (const t of TOKENS.filter((t) => t.css)) lines.push(`${t.css}: ${colors[t.id]};`);
  lines.push('', '// src/background/config.js (palette)');
  for (const t of TOKENS.filter((t) => t.scene)) lines.push(`${t.scene}: 0x${colors[t.id].slice(1)},`);
  lines.push(`// config.bloom.strength: ${glow}`);
  return lines.join('\n');
}

const sameColors = (a, b) => TOKENS.every((t) => a[t.id] === b[t.id]);

/**
 * Floating panel to try out palettes live on the real site (page + 3D scene).
 * Enabled with ?palette in the URL; see main.js.
 */
export function mountPalettePlayground(background) {
  const root = document.documentElement;
  const defaults = readDefaults(background);
  const presets = [{ name: 'Original', colors: defaults.colors }, ...PRESETS];

  const fromUrl = fromQuery(new URLSearchParams(location.search));
  let state = fromUrl
    ? { colors: fromUrl.colors, glow: fromUrl.glow ?? defaults.glow }
    : (loadSaved() ?? structuredClone(defaults));

  // --- DOM ---

  const groups = [...new Set(TOKENS.map((t) => t.group))];
  const panel = document.createElement('section');
  panel.className = 'pp-panel';
  panel.setAttribute('aria-label', 'Editor de paleta');
  panel.innerHTML = `
    <header class="pp-header">
      <h2>Paleta de colores</h2>
      <button type="button" class="pp-close" aria-label="Cerrar">×</button>
    </header>
    <div class="pp-body">
      <p class="pp-section-title">Propuestas</p>
      <div class="pp-presets">
        ${presets.map((p, i) => `<button type="button" data-preset="${i}">${p.name}</button>`).join('')}
      </div>
      ${groups
        .map(
          (group) => `
        <p class="pp-section-title">${group}</p>
        ${TOKENS.filter((t) => t.group === group)
          .map(
            (t) => `
          <label class="pp-row">
            <input type="color" data-color="${t.id}" />
            <span class="pp-label">${t.label}<small>${t.hint}</small></span>
            <input type="text" data-hex="${t.id}" maxlength="7" spellcheck="false" aria-label="${t.label} (HEX)" />
          </label>`,
          )
          .join('')}`,
        )
        .join('')}
      <p class="pp-section-title">Efecto</p>
      <label class="pp-row pp-glow">
        <span class="pp-label">Brillo neón<small>Intensidad del resplandor en la escena</small></span>
        <input type="range" data-glow min="${GLOW.min}" max="${GLOW.max}" step="${GLOW.step}" />
        <output data-glow-value></output>
      </label>
    </div>
    <footer class="pp-actions">
      <button type="button" data-action="link">Copiar enlace</button>
      <button type="button" data-action="export">Copiar valores</button>
      <button type="button" data-action="reset">Restablecer</button>
      <p class="pp-status" role="status"></p>
    </footer>
  `;

  const toggle = document.createElement('button');
  toggle.type = 'button';
  toggle.className = 'pp-toggle';
  toggle.textContent = '🎨 Paleta';
  toggle.setAttribute('aria-label', 'Abrir editor de paleta');

  document.body.append(panel, toggle);

  const $ = (selector) => panel.querySelector(selector);
  const $$ = (selector) => panel.querySelectorAll(selector);

  // --- State → page, scene and inputs ---

  function apply(next, { persist = true } = {}) {
    state = next;
    const sceneColors = {};
    for (const t of TOKENS) {
      const value = state.colors[t.id];
      if (t.css) root.style.setProperty(t.css, value);
      if (t.scene) sceneColors[t.scene] = value;
      $(`[data-color="${t.id}"]`).value = value;
      const hex = $(`[data-hex="${t.id}"]`);
      if (document.activeElement !== hex) hex.value = value;
    }
    if (background) {
      background.setPalette(sceneColors);
      background.glow = state.glow;
    }
    $('[data-glow]').value = state.glow;
    $('[data-glow-value]').textContent = state.glow.toFixed(2);
    $$('[data-preset]').forEach((button) => {
      button.setAttribute('aria-pressed', String(sameColors(presets[button.dataset.preset].colors, state.colors)));
    });
    if (persist) save(state);
  }

  const setColor = (id, value) => apply({ ...state, colors: { ...state.colors, [id]: value.toLowerCase() } });

  let statusTimer;
  function showStatus(message) {
    $('.pp-status').textContent = message;
    clearTimeout(statusTimer);
    statusTimer = setTimeout(() => ($('.pp-status').textContent = ''), 2500);
  }

  function setOpen(open) {
    panel.hidden = !open;
    toggle.hidden = open;
  }

  // --- Events ---

  panel.addEventListener('input', (event) => {
    const { color, hex, glow } = event.target.dataset;
    if (color) setColor(color, event.target.value);
    if (hex && HEX.test(event.target.value)) setColor(hex, event.target.value);
    if (glow !== undefined) apply({ ...state, glow: clampGlow(Number(event.target.value)) });
  });

  // Restore a half-typed / invalid HEX when leaving the field.
  panel.addEventListener('focusout', (event) => {
    const { hex } = event.target.dataset;
    if (hex) event.target.value = state.colors[hex];
  });

  panel.addEventListener('click', async (event) => {
    const button = event.target.closest('button');
    if (!button) return;

    if (button.dataset.preset) {
      apply({ ...state, colors: { ...presets[button.dataset.preset].colors } });
    } else if (button.dataset.action === 'link') {
      const url = new URL(location.href);
      url.hash = '';
      url.search = toQuery(state);
      showStatus((await copyText(url.toString())) ? '¡Enlace copiado! Compártelo para mostrar esta paleta.' : 'No se pudo copiar.');
    } else if (button.dataset.action === 'export') {
      showStatus((await copyText(exportText(state))) ? '¡Valores copiados!' : 'No se pudo copiar.');
    } else if (button.dataset.action === 'reset') {
      apply(structuredClone(defaults), { persist: false });
      forget();
      showStatus('Paleta original restablecida.');
    } else if (button.classList.contains('pp-close')) {
      setOpen(false);
      toggle.focus();
    }
  });

  toggle.addEventListener('click', () => setOpen(true));
  document.addEventListener('keydown', (event) => {
    if (event.key === 'Escape' && !panel.hidden) setOpen(false);
  });

  // A shared link shouldn't overwrite this browser's saved palette until the visitor edits it.
  apply(state, { persist: !fromUrl });
  setOpen(true);
}
