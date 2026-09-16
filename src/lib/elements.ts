export interface ElementOption {
  id: string;
  name: string;
  category: 'subject' | 'palette' | 'mood' | 'comp';
  description: string;
  colorHex?: string;
  gradient?: string;
  hslShift?: { h: number; s: number; l: number };
}

export const SUBJECTS: ElementOption[] = [
  { id: 'subj-1', name: 'Cyberpunk Metropolis', category: 'subject', description: 'Towering neon skyscrapers and rain-slicked futuristic alleyways' },
  { id: 'subj-2', name: 'Ethereal Lotus', category: 'subject', description: 'Bioluminescent aquatic lotus floating in sacred void' },
  { id: 'subj-3', name: 'Cosmic Nebula', category: 'subject', description: 'Interstellar gas clouds bursting with birth of new star clusters' },
  { id: 'subj-4', name: 'Gothic Cathedral', category: 'subject', description: 'Soaring stained glass arches with geometric shadow structures' },
  { id: 'subj-5', name: 'Submerged Atlantis', category: 'subject', description: 'Sunken ancient pillars surrounded by bioluminescent abyssal currents' },
  { id: 'subj-6', name: 'Quantum Flora', category: 'subject', description: 'Fractal crystalline plants emitting pulsing energy particles' },
  { id: 'subj-7', name: 'Solaris Eclipse', category: 'subject', description: 'Blinding solar corona framing a obsidian celestial moon' },
  { id: 'subj-8', name: 'Pixel Overdrive', category: 'subject', description: 'Retro 80s grid skyline with wireframe mountain peaks' },
  { id: 'subj-9', name: 'Vortex Sentinel', category: 'subject', description: 'Monolithic cyber-deity hovering amidst a swirling storm' },
  { id: 'subj-10', name: 'Serenade Oasis', category: 'subject', description: 'Mirage dunes reflecting double suns and prismatic waves' },
];

export const PALETTES: ElementOption[] = [
  { id: 'pal-1', name: 'Vaporwave Synth', category: 'palette', description: 'Magenta, Cyan, Electric Violet, Deep Blue', gradient: 'from-pink-500 via-purple-500 to-cyan-400' },
  { id: 'pal-2', name: 'Midnight Indigo', category: 'palette', description: 'Ultramarine, Obsidian, Silver Metallic, Cobalt', gradient: 'from-slate-900 via-indigo-950 to-blue-600' },
  { id: 'pal-3', name: 'Golden Hour Rust', category: 'palette', description: 'Amber, Burnt Sienna, Crimson, Ochre', gradient: 'from-amber-600 via-orange-500 to-yellow-400' },
  { id: 'pal-4', name: 'Toxic Cyber Green', category: 'palette', description: 'Lime, Acid Emerald, Pitch Black, Jade', gradient: 'from-emerald-500 via-green-400 to-lime-300' },
  { id: 'pal-5', name: 'Monochromatic Noir', category: 'palette', description: 'Charcoal, Platinum, Bone White, Jet Black', gradient: 'from-neutral-900 via-neutral-700 to-neutral-200' },
  { id: 'pal-6', name: 'Solarized Flare', category: 'palette', description: 'Neon Coral, Deep Plum, Fiery Gold, Rust', gradient: 'from-rose-500 via-red-600 to-amber-500' },
  { id: 'pal-7', name: 'Pastel Dreamscape', category: 'palette', description: 'Soft Lavender, Mint, Peach, Periwinkle', gradient: 'from-purple-300 via-pink-200 to-teal-200' },
  { id: 'pal-8', name: 'Abyssal Trench', category: 'palette', description: 'Deep Ocean Blue, Bioluminescent Cyan, Black', gradient: 'from-blue-950 via-cyan-900 to-teal-500' },
];

export const MOODS: ElementOption[] = [
  { id: 'mood-1', name: 'Melancholic Nostalgia', category: 'mood', description: 'Soft atmospheric haze, gentle grain, low contrast solitude' },
  { id: 'mood-2', name: 'Kinetic Chaos', category: 'mood', description: 'High contrast dynamic velocity lines, electric sparks, distortion' },
  { id: 'mood-3', name: 'Serene Harmony', category: 'mood', description: 'Smooth fluid gradient curves, peaceful radial balance' },
  { id: 'mood-4', name: 'Eerie Suspense', category: 'mood', description: 'Sharp angular shadows, dark fog, subtle glowing accents' },
  { id: 'mood-5', name: 'Euphoric Vibrancy', category: 'mood', description: 'Hyper-saturated glow effects, radiant aura energy' },
  { id: 'mood-6', name: 'Industrial Dystopia', category: 'mood', description: 'Gritty textures, sharp geometric grid overlays, rust' },
];

export const COMPOSITIONS: ElementOption[] = [
  { id: 'comp-1', name: 'Rule of Thirds Focus', category: 'comp', description: 'Asymmetric focal point placed at top-right golden intersection' },
  { id: 'comp-2', name: 'Golden Spiral Vortex', category: 'comp', description: 'Logarithmic Fibonacci spiral drawing eye to center point' },
  { id: 'comp-3', name: 'Symmetric Prism Mirror', category: 'comp', description: 'Exact bilateral vertical reflection creating sacred emblem symmetry' },
  { id: 'comp-4', name: 'Radial Explosion', category: 'comp', description: 'Bursting outward rays centered in the canvas core' },
  { id: 'comp-5', name: 'Dynamic Diagonals', category: 'comp', description: 'Sharp 45-degree slash lines creating tension and movement' },
  { id: 'comp-6', name: 'Minimalist Horizon', category: 'comp', description: 'Low horizon line with 80% negative space headroom' },
];

export interface CompositionElements {
  subject: string;
  palette: string;
  mood: string;
  comp: string;
}

export function getElement(category: 'subject' | 'palette' | 'mood' | 'comp', id: string): ElementOption {
  const list = category === 'subject' ? SUBJECTS :
               category === 'palette' ? PALETTES :
               category === 'mood' ? MOODS : COMPOSITIONS;
  return list.find(e => e.id === id) || list[0];
}
