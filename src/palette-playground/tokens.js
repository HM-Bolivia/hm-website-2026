/**
 * Editable palette entries. Each token can drive a CSS custom property on the
 * page (`css`), a color in the 3D scene (`scene`, a key of `palette` in
 * src/background/config.js), or both, so one swatch recolors page and scene together.
 *
 * Default values are read at runtime from the CSS and the scene config,
 * so they never drift from the real site.
 */
export const TOKENS = [
  { id: 'coral', label: 'Coral', hint: 'Botones principales, brillo del título', group: 'Acentos', css: '--coral' },
  { id: 'magenta', label: 'Magenta', hint: 'Etiquetas, subtítulos, bordes', group: 'Acentos', css: '--magenta' },
  { id: 'blue', label: 'Azul eléctrico', hint: 'Enlaces, bordes de paneles, tarjetas', group: 'Acentos', css: '--blue' },
  { id: 'cyan', label: 'Cian', hint: 'Detalles luminosos', group: 'Acentos', css: '--cyan' },
  { id: 'amber', label: 'Ámbar', hint: 'Títulos de sección, año, líneas de las montañas', group: 'Acentos', css: '--amber', scene: 'mountainLine' },
  { id: 'floorGrid', label: 'Grilla del piso', hint: 'Líneas del piso', group: 'Acentos', scene: 'gridLine' },
  { id: 'violet', label: 'Grilla del cielo', hint: 'Líneas del cielo', group: 'Acentos', scene: 'skyGridLine' },

  { id: 'night', label: 'Noche', hint: 'Fondo, parte alta del cielo', group: 'Fondos', css: '--bg-deep', scene: 'skyTop' },
  { id: 'horizon', label: 'Horizonte', hint: 'Brillo del cielo en el horizonte', group: 'Fondos', scene: 'skyHorizon' },
  { id: 'fog', label: 'Neblina', hint: 'Bruma a lo lejos', group: 'Fondos', scene: 'fog' },
  { id: 'floor', label: 'Piso', hint: 'Entre las líneas de la grilla', group: 'Fondos', scene: 'floor' },
  { id: 'mountainFill', label: 'Montañas', hint: 'Relleno de las montañas', group: 'Fondos', scene: 'mountainFill' },
  { id: 'panel', label: 'Paneles', hint: 'Fondo de las secciones', group: 'Fondos', css: '--panel-base' },

  { id: 'text', label: 'Texto', hint: 'Texto principal', group: 'Texto', css: '--text' },
  { id: 'muted', label: 'Texto secundario', hint: 'Menú, notas, respuestas', group: 'Texto', css: '--muted' },
];

export const GLOW = { min: 0, max: 2, step: 0.05 };
