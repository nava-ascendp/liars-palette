import { db, initDb } from './db';
import { SUBJECTS, PALETTES, MOODS, COMPOSITIONS } from '../src/lib/elements';

initDb();

console.log('[seed] Seeding Liar\'s Palette database...');

// Clean tables
db.exec(`
  DELETE FROM players;
  DELETE FROM daily_prompts;
  DELETE FROM canvases;
  DELETE FROM compositions;
  DELETE FROM lie_votes;
  DELETE FROM liar_picks;
  DELETE FROM gallery;
  DELETE FROM studios;
  DELETE FROM studio_members;
  DELETE FROM salons;
`);

const now = Date.now();
const today = new Date().toISOString().slice(0, 10);

// Seed 60 prompt seeds
const insertPrompt = db.prepare(`
  INSERT INTO daily_prompts (day, prompt_seed, element_set, is_masterwork, is_style_swap)
  VALUES (?, ?, ?, ?, ?)
`);

for (let i = 0; i < 60; i++) {
  const dateStr = new Date(now - (30 - i) * 86400_000).toISOString().slice(0, 10);
  const subj = SUBJECTS[i % SUBJECTS.length].id;
  const pal = PALETTES[i % PALETTES.length].id;
  const mood = MOODS[i % MOODS.length].id;
  const comp = COMPOSITIONS[i % COMPOSITIONS.length].id;

  const elementSetJson = JSON.stringify({ subject: subj, palette: pal, mood: mood, comp: comp });
  const isMasterwork = i % 5 === 0 ? 1 : 0;
  const isStyleSwap = i % 7 === 0 ? 1 : 0;

  insertPrompt.run(dateStr, `seed-prompt-${i + 1}`, elementSetJson, isMasterwork, isStyleSwap);
}

// Seed Demo Players
const insertPlayer = db.prepare(`
  INSERT INTO players (anon_hash, pseudo, created_at, streak_days, best_streak, brush_xp, eye_xp, hand_xp, palette_tokens)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

const demoPlayers = [
  { hash: 'user_master_1', pseudo: 'Cipher Artisan', streak: 12, best: 18, brush: 450, eye: 620, hand: 510, tokens: 15 },
  { hash: 'user_forger_2', pseudo: 'Neon Weaver', streak: 7, best: 14, brush: 280, eye: 310, hand: 420, tokens: 8 },
  { hash: 'user_detective_3', pseudo: 'Prismatic Oracle', streak: 5, best: 9, brush: 190, eye: 580, hand: 220, tokens: 6 },
  { hash: 'user_painter_4', pseudo: 'Shadow Vanguard', streak: 3, best: 5, brush: 120, eye: 140, hand: 110, tokens: 3 },
  { hash: 'user_sketch_5', pseudo: 'Ethereal Monk', streak: 1, best: 2, brush: 40, eye: 20, hand: 30, tokens: 0 },
];

for (const p of demoPlayers) {
  insertPlayer.run(p.hash, p.pseudo, now - 86400000 * 30, p.streak, p.best, p.brush, p.eye, p.hand, p.tokens);
}

// Seed Active Canvas for Today
const insertCanvas = db.prepare(`
  INSERT INTO canvases (id, day, prompt_seed, phase, phase_due, is_masterwork, liar_hash, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?)
`);

// 1. Today's active canvas (Composing Phase)
insertCanvas.run(`DAY-${today}`, today, 'seed-prompt-30', 'composing', now + 43200_000, 0, 'user_master_1', now);

// 2. Yesterday's canvas (Voting Phase)
const yest = new Date(now - 86400_000).toISOString().slice(0, 10);
insertCanvas.run(`DAY-${yest}`, yest, 'seed-prompt-29', 'voting', now + 21600_000, 1, 'user_forger_2', now - 86400_000);

// 3. Past canvas (Closed Phase)
const prev = new Date(now - 86400_000 * 2).toISOString().slice(0, 10);
insertCanvas.run(`DAY-${prev}`, prev, 'seed-prompt-28', 'closed', now - 3600_000, 0, 'user_detective_3', now - 86400_000 * 2);

// Seed Compositions for Yesterday's Canvas (Voting phase)
const insertComp = db.prepare(`
  INSERT INTO compositions (id, canvas_id, anon_hash, svg, element_subject, element_palette, element_mood, element_comp, lie_label, is_original, vote_count, created_at)
  VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
`);

// Original by Liar
insertComp.run(
  'comp_orig_29',
  `DAY-${yest}`,
  'user_forger_2',
  '<svg viewBox="0 0 600 600"><rect width="600" height="600" fill="#0B0D17"/><circle cx="300" cy="300" r="150" fill="#A855F7"/></svg>',
  'subj-1', 'pal-1', 'mood-1', 'comp-1',
  'none', 1, 4, now - 86400_000 + 1000
);

// Forgery 1 by Player 1 (Swapped Palette)
insertComp.run(
  'comp_forge_1',
  `DAY-${yest}`,
  'user_master_1',
  '<svg viewBox="0 0 600 600"><rect width="600" height="600" fill="#030712"/><circle cx="300" cy="300" r="150" fill="#06B6D4"/></svg>',
  'subj-1', 'pal-4', 'mood-1', 'comp-1',
  'palette', 0, 1, now - 86400_000 + 2000
);

// Forgery 2 by Player 3 (Swapped Subject)
insertComp.run(
  'comp_forge_2',
  `DAY-${yest}`,
  'user_detective_3',
  '<svg viewBox="0 0 600 600"><rect width="600" height="600" fill="#0B0D17"/><rect x="150" y="150" width="300" height="300" fill="#EC4899"/></svg>',
  'subj-3', 'pal-1', 'mood-1', 'comp-1',
  'subject', 0, 2, now - 86400_000 + 3000
);

// Seed 5 Studios
const insertStudio = db.prepare(`
  INSERT INTO studios (id, owner_hash, name, prompt_seeds, created_at)
  VALUES (?, ?, ?, ?, ?)
`);

insertStudio.run('studio_1', 'user_master_1', 'Cyber-Geometric Vault', JSON.stringify(['seed-prompt-1', 'seed-prompt-5', 'seed-prompt-10']), now - 86400000 * 10);
insertStudio.run('studio_2', 'user_forger_2', 'Neon Dream Atelier', JSON.stringify(['seed-prompt-2', 'seed-prompt-8']), now - 86400000 * 5);
insertStudio.run('studio_3', 'user_detective_3', 'Ethereal Sanctum', JSON.stringify(['seed-prompt-3', 'seed-prompt-12']), now - 86400000 * 2);

console.log('[seed] Seeding complete: 60 prompts, 3 canvases, 5 players, 3 studios.');
