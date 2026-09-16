import { db, initDb } from './db';
import { SUBJECTS, PALETTES, MOODS, COMPOSITIONS } from '../src/lib/elements';

initDb();

console.log('[salon] Running instant 8-player Salon simulation...');

const now = Date.now();
const today = new Date().toISOString().slice(0, 10);
const canvasId = `SALON-SIM-${Math.random().toString(36).substring(2, 8)}`;

const liarIndex = Math.floor(Math.random() * 8);

const bots = Array.from({ length: 8 }).map((_, i) => ({
  hash: `bot_sim_${i + 1}`,
  pseudo: `Salon Bot #${i + 1}`,
}));

bots.forEach(b => {
  db.prepare(`
    INSERT INTO players (anon_hash, pseudo, created_at, streak_days, best_streak, brush_xp, eye_xp, hand_xp, palette_tokens)
    VALUES (?, ?, ?, 1, 1, 50, 50, 50, 2)
    ON CONFLICT(anon_hash) DO NOTHING
  `).run(b.hash, b.pseudo, now);
});

const liarHash = bots[liarIndex].hash;

db.prepare(`
  INSERT INTO canvases (id, day, prompt_seed, phase, phase_due, is_masterwork, liar_hash, created_at)
  VALUES (?, ?, 'salon-sim-seed', 'closed', ?, 1, ?, ?)
`).run(canvasId, today, now, liarHash, now);

// Original Elements
const origSubj = SUBJECTS[0].id;
const origPal = PALETTES[0].id;
const origMood = MOODS[0].id;
const origComp = COMPOSITIONS[0].id;

const comps: { id: string; hash: string; isLiar: boolean }[] = [];

bots.forEach((b, i) => {
  const isLiar = i === liarIndex;
  const compId = `comp_sim_${canvasId}_${i}`;
  comps.push({ id: compId, hash: b.hash, isLiar });

  let lieLabel = 'none';
  let subj = origSubj;
  let pal = origPal;
  let mood = origMood;
  let comp = origComp;

  if (!isLiar) {
    lieLabel = 'palette';
    pal = PALETTES[1].id;
  }

  const svg = `<svg viewBox="0 0 600 600"><rect width="600" height="600" fill="#0B0D17"/><circle cx="300" cy="300" r="150" fill="#A855F7"/></svg>`;

  db.prepare(`
    INSERT INTO compositions (id, canvas_id, anon_hash, svg, element_subject, element_palette, element_mood, element_comp, lie_label, is_original, vote_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
  `).run(compId, canvasId, b.hash, svg, subj, pal, mood, comp, lieLabel, isLiar ? 1 : 0, now);
});

// Auto-vote
bots.forEach(b => {
  comps.forEach(c => {
    if (c.hash !== b.hash) {
      db.prepare(`
        INSERT INTO lie_votes (canvas_id, voter_hash, composition_id, vote, created_at)
        VALUES (?, ?, ?, ?, ?)
      `).run(canvasId, b.hash, c.id, Math.random() > 0.4 ? 'lie' : 'truth', now);
    }
  });

  // Pick suspected liar
  const suspectedLiar = bots[Math.floor(Math.random() * bots.length)].hash;
  db.prepare(`
    INSERT INTO liar_picks (canvas_id, voter_hash, picked_hash, is_correct, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(canvasId, b.hash, suspectedLiar, suspectedLiar === liarHash ? 1 : 0, now);
});

console.log(`[salon] Simulation completed! Canvas ID: ${canvasId}`);
console.log(`[salon] Assigned Liar: ${bots[liarIndex].pseudo} (${liarHash})`);
console.log(`[salon] Total Compositions: 8, Votes Cast: ${8 * 7}`);
