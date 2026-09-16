import { getElement, CompositionElements } from '../elements';

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}

function seededRandom(seed: number) {
  let s = seed % 2147483647;
  if (s <= 0) s += 2147483646;
  return () => {
    s = (s * 16807) % 2147483647;
    return (s - 1) / 2147483646;
  };
}

export function generateSvgCanvas(
  elements: CompositionElements,
  width: number = 600,
  height: number = 600,
  seedExtra: string = ''
): string {
  const seedKey = `${elements.subject}_${elements.palette}_${elements.mood}_${elements.comp}_${seedExtra}`;
  const seed = hashString(seedKey);
  const rand = seededRandom(seed);

  const palObj = getElement('palette', elements.palette);
  const subjObj = getElement('subject', elements.subject);
  const moodObj = getElement('mood', elements.mood);
  const compObj = getElement('comp', elements.comp);

  // Palette color schemes
  const colorMap: Record<string, string[]> = {
    'pal-1': ['#0B0D17', '#A855F7', '#EC4899', '#06B6D4', '#F472B6'],
    'pal-2': ['#030712', '#1E1B4B', '#312E81', '#4F46E5', '#93C5FD'],
    'pal-3': ['#1C1917', '#78350F', '#B45309', '#F59E0B', '#FDE68A'],
    'pal-4': ['#022C22', '#064E3B', '#047857', '#10B981', '#A7F3D0'],
    'pal-5': ['#0A0A0A', '#262626', '#525252', '#A3A3A3', '#FAFAFA'],
    'pal-6': ['#1F111E', '#701A75', '#BE185D', '#F43F5E', '#FCA5A5'],
    'pal-7': ['#1E1B2E', '#C084FC', '#F472B6', '#38BDF8', '#E0E7FF'],
    'pal-8': ['#03071E', '#03045E', '#0077B6', '#00B4D8', '#90E0EF'],
  };

  const colors = colorMap[palObj.id] || ['#0B0D17', '#A855F7', '#EC4899', '#06B6D4', '#FFFFFF'];

  // Base SVG wrapper
  let elementsXml = '';

  // Background gradient
  const bgGradId = `bgGrad_${seed}`;
  const compGradId = `compGrad_${seed}`;

  let bgDef = `
    <linearGradient id="${bgGradId}" x1="0%" y1="0%" x2="100%" y2="100%">
      <stop offset="0%" stop-color="${colors[0]}" />
      <stop offset="50%" stop-color="${colors[1]}" />
      <stop offset="100%" stop-color="${colors[2]}" />
    </linearGradient>
    <radialGradient id="${compGradId}" cx="50%" cy="50%" r="60%">
      <stop offset="0%" stop-color="${colors[3]}" stop-opacity="0.8"/>
      <stop offset="70%" stop-color="${colors[1]}" stop-opacity="0.2"/>
      <stop offset="100%" stop-color="${colors[0]}" stop-opacity="0"/>
    </radialGradient>
  `;

  // Draw background
  elementsXml += `<rect width="${width}" height="${height}" fill="url(#${bgGradId})" />`;

  // Draw Mood Overlay
  if (moodObj.id === 'mood-1') { // Melancholic Solitude
    elementsXml += `<rect width="${width}" height="${height}" fill="${colors[0]}" opacity="0.45" />`;
    for (let i = 0; i < 40; i++) {
      const cx = rand() * width;
      const cy = rand() * height;
      const r = rand() * 2 + 0.5;
      elementsXml += `<circle cx="${cx}" cy="${cy}" r="${r}" fill="#ffffff" opacity="${rand() * 0.3}" />`;
    }
  } else if (moodObj.id === 'mood-2') { // Kinetic Chaos
    for (let i = 0; i < 15; i++) {
      const x1 = rand() * width;
      const y1 = rand() * height;
      const x2 = x1 + (rand() - 0.5) * 300;
      const y2 = y1 + (rand() - 0.5) * 300;
      elementsXml += `<line x1="${x1}" y1="${y1}" x2="${x2}" y2="${y2}" stroke="${colors[3]}" stroke-width="${rand() * 4 + 1}" opacity="0.6" stroke-dasharray="5 5" />`;
    }
  } else if (moodObj.id === 'mood-5') { // Euphoric Vibrancy
    elementsXml += `<rect width="${width}" height="${height}" fill="url(#${compGradId})" mix-blend-mode="screen" />`;
  }

  // Draw Composition Geometry
  const cx = compObj.id === 'comp-1' ? width * 0.66 :
             compObj.id === 'comp-6' ? width * 0.5 : width / 2;
  const cy = compObj.id === 'comp-1' ? height * 0.33 :
             compObj.id === 'comp-6' ? height * 0.75 : height / 2;

  if (compObj.id === 'comp-2') { // Golden Spiral
    let r = 10;
    let angle = 0;
    let pathD = `M ${cx} ${cy}`;
    for (let i = 0; i < 60; i++) {
      angle += 0.3;
      r += 4;
      const px = cx + Math.cos(angle) * r;
      const py = cy + Math.sin(angle) * r;
      pathD += ` L ${px} ${py}`;
    }
    elementsXml += `<path d="${pathD}" fill="none" stroke="${colors[4]}" stroke-width="2" opacity="0.5" />`;
  } else if (compObj.id === 'comp-3') { // Symmetric Mirror
    elementsXml += `<line x1="${width/2}" y1="0" x2="${width/2}" y2="${height}" stroke="${colors[3]}" stroke-width="1" stroke-dasharray="4 4" opacity="0.4"/>`;
  } else if (compObj.id === 'comp-4') { // Radial Burst
    for (let i = 0; i < 24; i++) {
      const a = (i / 24) * Math.PI * 2;
      const x2 = cx + Math.cos(a) * (width * 0.6);
      const y2 = cy + Math.sin(a) * (height * 0.6);
      elementsXml += `<line x1="${cx}" y1="${cy}" x2="${x2}" y2="${y2}" stroke="${colors[2]}" stroke-width="1.5" opacity="0.25" />`;
    }
  }

  // Draw Subject Art Elements
  if (subjObj.id === 'subj-1') { // Cyberpunk Metropolis
    for (let i = 0; i < 8; i++) {
      const bw = rand() * 60 + 40;
      const bh = rand() * (height * 0.6) + 100;
      const bx = (i / 8) * width + (rand() - 0.5) * 20;
      const by = height - bh;
      const buildingColor = colors[(i % 3) + 1];
      elementsXml += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" fill="${buildingColor}" opacity="0.75" rx="2" />`;
      // Windows
      for (let wx = bx + 5; wx < bx + bw - 10; wx += 12) {
        for (let wy = by + 10; wy < height - 20; wy += 20) {
          if (rand() > 0.4) {
            elementsXml += `<rect x="${wx}" y="${wy}" width="6" height="10" fill="${colors[3]}" opacity="${rand() * 0.8 + 0.2}" />`;
          }
        }
      }
    }
  } else if (subjObj.id === 'subj-2' || subjObj.id === 'subj-6') { // Lotus / Quantum Flora
    for (let i = 0; i < 12; i++) {
      const angle = (i / 12) * Math.PI * 2;
      const px = cx + Math.cos(angle) * 80;
      const py = cy + Math.sin(angle) * 80;
      elementsXml += `<path d="M ${cx} ${cy} Q ${px} ${py} ${cx + Math.cos(angle + 0.5) * 120} ${cy + Math.sin(angle + 0.5) * 120}" fill="${colors[i % 3 + 1]}" opacity="0.6" />`;
      elementsXml += `<circle cx="${px}" cy="${py}" r="${rand() * 8 + 4}" fill="${colors[3]}" opacity="0.8"/>`;
    }
    elementsXml += `<circle cx="${cx}" cy="${cy}" r="25" fill="${colors[4]}" filter="drop-shadow(0 0 10px ${colors[3]})" />`;
  } else if (subjObj.id === 'subj-3' || subjObj.id === 'subj-7') { // Nebula / Eclipse
    elementsXml += `<circle cx="${cx}" cy="${cy}" r="${width * 0.25}" fill="url(#${compGradId})" />`;
    elementsXml += `<circle cx="${cx}" cy="${cy}" r="${width * 0.18}" fill="${colors[0]}" stroke="${colors[3]}" stroke-width="4" />`;
    for (let i = 0; i < 30; i++) {
      const sx = rand() * width;
      const sy = rand() * height;
      const sr = rand() * 3 + 1;
      elementsXml += `<circle cx="${sx}" cy="${sy}" r="${sr}" fill="${colors[4]}" opacity="${rand()}" />`;
    }
  } else { // Generic Geometric Procedural Art
    for (let i = 0; i < 7; i++) {
      const px = cx + (rand() - 0.5) * 200;
      const py = cy + (rand() - 0.5) * 200;
      const size = rand() * 80 + 30;
      const col = colors[(i % 4) + 1];
      if (i % 2 === 0) {
        elementsXml += `<polygon points="${px},${py - size} ${px + size},${py + size} ${px - size},${py + size}" fill="${col}" opacity="0.5" />`;
      } else {
        elementsXml += `<rect x="${px - size/2}" y="${py - size/2}" width="${size}" height="${size}" fill="${col}" opacity="0.5" rx="8" transform="rotate(${rand() * 90} ${px} ${py})" />`;
      }
    }
  }

  // Signature overlay
  elementsXml += `<text x="15" y="${height - 15}" fill="${colors[4]}" font-family="monospace" font-size="11" opacity="0.6">LIAR'S PALETTE // ${seedKey.slice(0, 16)}</text>`;

  return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${width} ${height}" width="100%" height="100%">
    <defs>${bgDef}</defs>
    ${elementsXml}
  </svg>`;
}
