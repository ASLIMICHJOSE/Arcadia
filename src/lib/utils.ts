/**
 * Arcadia Utility Functions
 * Lightweight, zero-dependency helper functions for UI, formatting, and assets.
 */

export type ClassValue =
  | string
  | number
  | boolean
  | undefined
  | null
  | { [key: string]: boolean | undefined | null }
  | ClassValue[];

/**
 * Class name utility to merge conditionally applied classes without external dependencies.
 */
export function cn(...inputs: ClassValue[]): string {
  const classes: string[] = [];

  const process = (val: ClassValue): void => {
    if (!val && val !== 0) return;

    if (typeof val === 'string' || typeof val === 'number') {
      const str = String(val).trim();
      if (str) {
        classes.push(str);
      }
    } else if (Array.isArray(val)) {
      for (const item of val) {
        process(item);
      }
    } else if (typeof val === 'object') {
      for (const [key, condition] of Object.entries(val)) {
        if (condition && key.trim()) {
          classes.push(key.trim());
        }
      }
    }
  };

  for (const input of inputs) {
    process(input);
  }

  return classes.join(' ');
}

/**
 * Format numbers with locale-aware commas (e.g., 45280 -> "45,280").
 */
export function formatNumber(n: number | string | null | undefined): string {
  if (n === null || n === undefined) return '0';
  const num = typeof n === 'number' ? n : Number(n);
  if (isNaN(num)) return String(n);
  return new Intl.NumberFormat('en-US').format(num);
}

/**
 * Format playtime hours into standardized '127h 30m' format.
 * Supports numbers (127, 127.5) and string inputs ('127h', '127').
 */
export function formatTime(hours: number | string | null | undefined): string {
  if (hours === null || hours === undefined) return '0h 00m';
  if (typeof hours === 'string' && hours.includes('h') && hours.includes('m')) {
    return hours.trim();
  }

  const cleanStr = typeof hours === 'string' ? hours.replace(/[^\d.-]/g, '') : String(hours);
  const num = parseFloat(cleanStr);
  if (isNaN(num)) return '0h 00m';

  const totalMinutes = Math.round(num * 60);
  const h = Math.floor(totalMinutes / 60);
  const m = totalMinutes % 60;
  return `${h}h ${m.toString().padStart(2, '0')}m`;
}

/**
 * Generates an SVG Data URI placeholder for a game based on its slug.
 * Features Arcadia's signature neoclassical gold-and-obsidian luxury palette.
 */
export function getGameImage(slug: string): string {
  const normalizedSlug = slug.toLowerCase().trim();

  let iconContent = '';
  let title = 'Arcadia Game';
  let subtitle = 'Sanctuary Title';

  switch (normalizedSlug) {
    case 'tic-tac-toe':
      title = 'Tic-Tac-Toe';
      subtitle = 'Strategy & Cunning';
      iconContent = `
        <g stroke="#C5A46D" stroke-width="3" stroke-linecap="round" opacity="0.4">
          <line x1="280" y1="120" x2="280" y2="280" />
          <line x1="360" y1="120" x2="360" y2="280" />
          <line x1="200" y1="170" x2="440" y2="170" />
          <line x1="200" y1="230" x2="440" y2="230" />
        </g>
        <!-- Golden X -->
        <g stroke="url(#goldGrad)" stroke-width="6" stroke-linecap="round">
          <line x1="225" y1="135" x2="255" y2="155" />
          <line x1="255" y1="135" x2="225" y2="155" />
        </g>
        <!-- Bronze O -->
        <circle cx="320" cy="200" r="16" fill="none" stroke="#DFCA9B" stroke-width="5" />
        <!-- Golden X -->
        <g stroke="url(#goldGrad)" stroke-width="6" stroke-linecap="round">
          <line x1="385" y1="245" x2="415" y2="265" />
          <line x1="415" y1="245" x2="385" y2="265" />
        </g>
      `;
      break;

    case 'snake':
      title = 'Snake';
      subtitle = 'Celestial Serpent';
      iconContent = `
        <!-- Serpent Grid -->
        <g opacity="0.15">
          <circle cx="240" cy="160" r="2" fill="#C5A46D" />
          <circle cx="280" cy="160" r="2" fill="#C5A46D" />
          <circle cx="320" cy="160" r="2" fill="#C5A46D" />
          <circle cx="360" cy="160" r="2" fill="#C5A46D" />
          <circle cx="400" cy="160" r="2" fill="#C5A46D" />
          <circle cx="240" cy="200" r="2" fill="#C5A46D" />
          <circle cx="400" cy="200" r="2" fill="#C5A46D" />
          <circle cx="240" cy="240" r="2" fill="#C5A46D" />
          <circle cx="280" cy="240" r="2" fill="#C5A46D" />
          <circle cx="320" cy="240" r="2" fill="#C5A46D" />
          <circle cx="360" cy="240" r="2" fill="#C5A46D" />
          <circle cx="400" cy="240" r="2" fill="#C5A46D" />
        </g>
        <!-- Serpent Body Path -->
        <path d="M 220 220 L 320 220 L 320 160 L 380 160" fill="none" stroke="url(#goldGrad)" stroke-width="12" stroke-linecap="round" stroke-linejoin="round" />
        <!-- Glowing Serpent Head -->
        <circle cx="380" cy="160" r="8" fill="#FFF2D6" />
        <circle cx="380" cy="160" r="16" fill="none" stroke="#C5A46D" stroke-width="2" opacity="0.6" />
        <!-- Food Orb -->
        <circle cx="260" cy="160" r="6" fill="#E5A93C" filter="url(#glowFilter)" />
      `;
      break;

    case 'memory-match':
      title = 'Memory Match';
      subtitle = 'Arcane Sigils';
      iconContent = `
        <!-- Card 1 (Flipped) -->
        <rect x="230" y="140" width="70" height="95" rx="8" fill="#211C16" stroke="url(#goldGrad)" stroke-width="2" />
        <circle cx="265" cy="187" r="14" fill="none" stroke="#C5A46D" stroke-width="2.5" />
        <polygon points="265,178 271,192 259,192" fill="#DFCA9B" />
        <!-- Card 2 (Paired) -->
        <rect x="340" y="140" width="70" height="95" rx="8" fill="#211C16" stroke="url(#goldGrad)" stroke-width="2" />
        <circle cx="375" cy="187" r="14" fill="none" stroke="#C5A46D" stroke-width="2.5" />
        <polygon points="375,178 381,192 369,192" fill="#DFCA9B" />
        <!-- Sparkle between cards -->
        <path d="M 320 180 L 322 186 L 328 187 L 322 189 L 320 195 L 318 189 L 312 187 L 318 186 Z" fill="#FFF2D6" />
      `;
      break;

    case 'rock-paper-scissors':
      title = 'Rock Paper Scissors';
      subtitle = 'Classical Duel';
      iconContent = `
        <!-- Central Emblem Shield -->
        <circle cx="320" cy="190" r="55" fill="#211C16" stroke="url(#goldGrad)" stroke-width="2" />
        <!-- Crossed Blades / Shears -->
        <g stroke="#DFCA9B" stroke-width="3" stroke-linecap="round">
          <line x1="295" y1="165" x2="345" y2="215" />
          <line x1="345" y1="165" x2="295" y2="215" />
        </g>
        <circle cx="320" cy="190" r="10" fill="#80613C" stroke="#C5A46D" stroke-width="2" />
      `;
      break;

    default:
      title = 'Arcadia Arena';
      subtitle = 'Classic Game';
      iconContent = `
        <circle cx="320" cy="190" r="45" fill="none" stroke="url(#goldGrad)" stroke-width="3" />
        <polygon points="320,160 332,185 360,187 338,205 345,232 320,217 295,232 302,205 280,187 308,185" fill="url(#goldGrad)" />
      `;
      break;
  }

  const svg = `
<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 360" width="100%" height="100%">
  <defs>
    <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#191713" />
      <stop offset="50%" stop-color="#14120F" />
      <stop offset="100%" stop-color="#100F0D" />
    </linearGradient>
    <linearGradient id="goldGrad" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="#DFCA9B" />
      <stop offset="50%" stop-color="#C5A46D" />
      <stop offset="100%" stop-color="#80613C" />
    </linearGradient>
    <radialGradient id="centerGlow" cx="50%" cy="50%" r="50%">
      <stop offset="0%" stop-color="#C5A46D" stop-opacity="0.18" />
      <stop offset="100%" stop-color="#100F0D" stop-opacity="0" />
    </radialGradient>
    <filter id="glowFilter" x="-20%" y="-20%" width="140%" height="140%">
      <feGaussianBlur stdDeviation="4" result="blur" />
      <feComposite in="SourceGraphic" in2="blur" operator="over" />
    </filter>
  </defs>

  <!-- Background Base -->
  <rect width="640" height="360" fill="url(#bgGrad)" />
  <circle cx="320" cy="190" r="180" fill="url(#centerGlow)" />

  <!-- Outer Border Frame with Neoclassical Corner Accents -->
  <rect x="16" y="16" width="608" height="328" rx="12" fill="none" stroke="#2B241C" stroke-width="1.5" />
  <rect x="24" y="24" width="592" height="312" rx="8" fill="none" stroke="url(#goldGrad)" stroke-width="0.8" opacity="0.35" />
  
  <!-- Corner Glyphs -->
  <path d="M 28 40 L 40 40 L 40 28" fill="none" stroke="#C5A46D" stroke-width="1.5" opacity="0.6" />
  <path d="M 612 40 L 600 40 L 600 28" fill="none" stroke="#C5A46D" stroke-width="1.5" opacity="0.6" />
  <path d="M 28 320 L 40 320 L 40 332" fill="none" stroke="#C5A46D" stroke-width="1.5" opacity="0.6" />
  <path d="M 612 320 L 600 320 L 600 332" fill="none" stroke="#C5A46D" stroke-width="1.5" opacity="0.6" />

  <!-- Game Specific Graphic Art -->
  ${iconContent}

  <!-- Typography Labels -->
  <text x="320" y="300" text-anchor="middle" font-family="'Playfair Display', Georgia, serif" font-size="20" font-weight="700" fill="#F3EBDD" letter-spacing="1.5">${title}</text>
  <text x="320" y="322" text-anchor="middle" font-family="'Inter', sans-serif" font-size="11" font-weight="500" fill="#B8AA96" letter-spacing="2.5" text-transform="uppercase" opacity="0.8">${subtitle}</text>
</svg>
  `.trim();

  return `data:image/svg+xml;utf8,${encodeURIComponent(svg)}`;
}
