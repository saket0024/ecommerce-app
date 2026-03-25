import React from 'react';

const COLORS = [
  ['#3B82F6', '#1D4ED8'], // blue
  ['#10B981', '#047857'], // green
  ['#F59E0B', '#B45309'], // amber
  ['#EF4444', '#B91C1C'], // red
  ['#8B5CF6', '#6D28D9'], // purple
  ['#EC4899', '#BE185D'], // pink
  ['#14B8A6', '#0F766E'], // teal
  ['#F97316', '#C2410C'], // orange
  ['#6366F1', '#4338CA'], // indigo
  ['#84CC16', '#4D7C0F'], // lime
];

// Generate a consistent color index from a string
function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash * 31 + str.charCodeAt(i)) & 0xffffffff;
  }
  return Math.abs(hash);
}

// Generate a colored SVG placeholder with initials
export function generatePlaceholder(name: string): string {
  const idx = hashString(name) % COLORS.length;
  const [bg, text] = COLORS[idx];
  const initials = name
    .split(' ')
    .slice(0, 2)
    .map(w => w[0]?.toUpperCase() || '')
    .join('');

  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="300" height="300">
    <defs>
      <linearGradient id="g" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" style="stop-color:${bg};stop-opacity:1" />
        <stop offset="100%" style="stop-color:${text};stop-opacity:1" />
      </linearGradient>
    </defs>
    <rect width="300" height="300" fill="url(#g)" rx="8"/>
    <text x="150" y="175" text-anchor="middle" font-family="sans-serif" font-size="96" font-weight="bold" fill="white" opacity="0.9">${initials}</text>
  </svg>`;

  return 'data:image/svg+xml,' + encodeURIComponent(svg);
}

export const PLACEHOLDER_IMAGE = generatePlaceholder('Product');

export const handleImageError = (e: React.SyntheticEvent<HTMLImageElement>) => {
  const img = e.target as HTMLImageElement;
  // Only replace if it's an external URL (http/https), not already a data URI
  if (img.src.startsWith('http')) {
    img.src = PLACEHOLDER_IMAGE;
  }
};
