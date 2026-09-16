import express, { Request, Response } from 'express';
import cors from 'cors';
import { db, initDb } from './db';
import { SUBJECTS, PALETTES, MOODS, COMPOSITIONS } from '../src/lib/elements';

initDb();

const app = express();
const PORT = process.env.LOCAL_API_PORT || 5174;

app.use(cors());
app.use(express.json({ limit: '10mb' }));

// 1. Get Palette of the Day & Today's Canvas
app.get('/api/canvases/today', (req: Request, res: Response): void => {
  const today = new Date().toISOString().slice(0, 10);
  let canvas = db.prepare(`SELECT * FROM canvases WHERE day = ? ORDER BY created_at DESC LIMIT 1`).get(today) as any;

  if (!canvas) {
    const seedIdx = Math.abs(hashCode(today)) % 60;
    const promptSeed = `seed-prompt-${seedIdx + 1}`;
    const isMasterwork = seedIdx % 5 === 0 ? 1 : 0;
    const isStyleSwap = new Date().getDay() === 0 ? 1 : 0;

    const canvasId = `DAY-${today}`;
    const now = Date.now();
    const phaseDue = now + 12 * 3600_000;

    db.prepare(`
      INSERT INTO daily_prompts (day, prompt_seed, element_set, is_masterwork, is_style_swap)
      VALUES (?, ?, ?, ?, ?)
      ON CONFLICT(day) DO NOTHING
    `).run(today, promptSeed, JSON.stringify({
      subject: SUBJECTS[seedIdx % SUBJECTS.length].id,
      palette: PALETTES[seedIdx % PALETTES.length].id,
      mood: MOODS[seedIdx % MOODS.length].id,
      comp: COMPOSITIONS[seedIdx % COMPOSITIONS.length].id,
    }), isMasterwork, isStyleSwap);

    db.prepare(`
      INSERT INTO canvases (id, day, prompt_seed, phase, phase_due, is_masterwork, liar_hash, created_at)
      VALUES (?, ?, ?, 'composing', ?, ?, 'user_master_1', ?)
    `).run(canvasId, today, promptSeed, phaseDue, isMasterwork, now);

    canvas = db.prepare(`SELECT * FROM canvases WHERE id = ?`).get(canvasId);
  }

  const prompt = db.prepare(`SELECT * FROM daily_prompts WHERE day = ?`).get(canvas.day) as any;
  const elementSet = prompt ? JSON.parse(prompt.element_set) : {
    subject: SUBJECTS[0].id,
    palette: PALETTES[0].id,
    mood: MOODS[0].id,
    comp: COMPOSITIONS[0].id,
  };

  res.json({
    canvas,
    promptSeed: canvas.prompt_seed,
    elementSet,
    isMasterwork: Boolean(canvas.is_masterwork),
    isStyleSwap: prompt ? Boolean(prompt.is_style_swap) : false,
  });
});

// 2. Get Canvas Details & Compositions
app.get('/api/canvases/:id', (req: Request, res: Response): void => {
  const canvasId = req.params.id;
  const canvas = db.prepare(`SELECT * FROM canvases WHERE id = ?`).get(canvasId) as any;
  if (!canvas) {
    res.status(404).json({ error: 'Canvas not found' });
    return;
  }

  const compositions = db.prepare(`SELECT * FROM compositions WHERE canvas_id = ? ORDER BY created_at ASC`).all(canvasId);
  const prompt = db.prepare(`SELECT * FROM daily_prompts WHERE day = ?`).get(canvas.day) as any;
  const elementSet = prompt ? JSON.parse(prompt.element_set) : null;

  res.json({
    canvas,
    compositions,
    elementSet,
  });
});

// 3. Submit Canvas Composition (Forged element)
app.post('/api/canvases/:id/compositions', (req: Request, res: Response): void => {
  const canvasId = req.params.id;
  const { anonHash, svg, elementSubject, elementPalette, elementMood, elementComp, lieLabel, isOriginal } = req.body;

  if (!anonHash || !svg || !lieLabel) {
    res.status(400).json({ error: 'Missing required composition fields' });
    return;
  }

  ensurePlayer(anonHash, req.body.pseudo || 'Anonymous Painter');

  const compId = 'comp_' + Math.random().toString(36).substring(2, 10);
  const now = Date.now();

  db.prepare(`
    INSERT INTO compositions (id, canvas_id, anon_hash, svg, element_subject, element_palette, element_mood, element_comp, lie_label, is_original, vote_count, created_at)
    VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, 0, ?)
  `).run(compId, canvasId, anonHash, svg, elementSubject, elementPalette, elementMood, elementComp, lieLabel, isOriginal ? 1 : 0, now);

  db.prepare(`UPDATE players SET brush_xp = brush_xp + 25 WHERE anon_hash = ?`).run(anonHash);

  res.json({ success: true, compositionId: compId });
});

// 4. Vote Truth vs Lie on a Composition
app.post('/api/canvases/:id/vote-truth', (req: Request, res: Response): void => {
  const canvasId = req.params.id;
  const { voterHash, compositionId, vote } = req.body;

  if (!voterHash || !compositionId || !vote) {
    res.status(400).json({ error: 'Missing vote parameters' });
    return;
  }

  ensurePlayer(voterHash, 'Anonymous Detective');

  db.prepare(`
    INSERT INTO lie_votes (canvas_id, voter_hash, composition_id, vote, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(canvas_id, voter_hash, composition_id) DO UPDATE SET vote = excluded.vote
  `).run(canvasId, voterHash, compositionId, vote, Date.now());

  db.prepare(`UPDATE compositions SET vote_count = vote_count + 1 WHERE id = ?`).run(compositionId);

  res.json({ success: true });
});

// 5. Pick Suspected Liar
app.post('/api/canvases/:id/vote-liar', (req: Request, res: Response): void => {
  const canvasId = req.params.id;
  const { voterHash, pickedHash } = req.body;

  const canvas = db.prepare(`SELECT liar_hash FROM canvases WHERE id = ?`).get(canvasId) as any;
  const isCorrect = canvas && canvas.liar_hash === pickedHash ? 1 : 0;

  db.prepare(`
    INSERT INTO liar_picks (canvas_id, voter_hash, picked_hash, is_correct, created_at)
    VALUES (?, ?, ?, ?, ?)
    ON CONFLICT(canvas_id, voter_hash) DO UPDATE SET picked_hash = excluded.picked_hash, is_correct = excluded.is_correct
  `).run(canvasId, voterHash, pickedHash, isCorrect, Date.now());

  res.json({ success: true, isCorrect: Boolean(isCorrect) });
});

// 6. Get Player Profile & Stats
app.get('/api/players/:hash', (req: Request, res: Response): void => {
  const hash = req.params.hash;
  let player = db.prepare(`SELECT * FROM players WHERE anon_hash = ?`).get(hash) as any;

  if (!player) {
    player = ensurePlayer(hash, 'New Painter');
  }

  const compositions = db.prepare(`
    SELECT c.*, canv.day, canv.is_masterwork
    FROM compositions c
    JOIN canvases canv ON c.canvas_id = canv.id
    WHERE c.anon_hash = ?
    ORDER BY c.created_at DESC
  `).all(hash);

  res.json({
    player,
    compositions,
  });
});

// 7. Get Curated Gallery
app.get('/api/gallery', (req: Request, res: Response): void => {
  const items = db.prepare(`
    SELECT g.*, c.svg, c.element_subject, c.element_palette, c.element_mood, c.element_comp, c.lie_label, c.vote_count, p.pseudo
    FROM gallery g
    JOIN compositions c ON g.composition_id = c.id
    JOIN players p ON c.anon_hash = p.anon_hash
    ORDER BY g.featured_at DESC
    LIMIT 20
  `).all();

  res.json({ gallery: items });
});

// 8. Get / Create Studio Spaces
app.get('/api/studios', (req: Request, res: Response): void => {
  const studios = db.prepare(`
    SELECT s.*, p.pseudo
    FROM studios s
    JOIN players p ON s.owner_hash = p.anon_hash
    ORDER BY s.created_at DESC
  `).all();
  res.json({ studios });
});

app.post('/api/studios', (req: Request, res: Response): void => {
  const { ownerHash, name, promptSeeds } = req.body;
  if (!ownerHash || !name) {
    res.status(400).json({ error: 'Missing studio parameters' });
    return;
  }

  const studioId = 'studio_' + Math.random().toString(36).substring(2, 10);
  db.prepare(`
    INSERT INTO studios (id, owner_hash, name, prompt_seeds, created_at)
    VALUES (?, ?, ?, ?, ?)
  `).run(studioId, ownerHash, name, JSON.stringify(promptSeeds || []), Date.now());

  res.json({ success: true, studioId });
});

// 9. Instant Salon Simulation Endpoint
app.post('/api/salon/simulate', (req: Request, res: Response): void => {
  const canvasId = 'SALON-' + Math.random().toString(36).substring(2, 8);
  const now = Date.now();
  const today = new Date().toISOString().slice(0, 10);

  const origSubj = SUBJECTS[Math.floor(Math.random() * SUBJECTS.length)].id;
  const origPal = PALETTES[Math.floor(Math.random() * PALETTES.length)].id;
  const origMood = MOODS[Math.floor(Math.random() * MOODS.length)].id;
  const origComp = COMPOSITIONS[Math.floor(Math.random() * COMPOSITIONS.length)].id;

  const promptSeed = `salon-seed-${Math.floor(Math.random() * 1000)}`;
  const liarIndex = Math.floor(Math.random() * 8);

  const bots = Array.from({ length: 8 }).map((_, i) => ({
    hash: `bot_player_${i + 1}`,
    pseudo: `Agent Bot #${i + 1}`,
  }));

  bots.forEach(b => ensurePlayer(b.hash, b.pseudo));
  const liarHash = bots[liarIndex].hash;

  db.prepare(`
    INSERT INTO canvases (id, day, prompt_seed, phase, phase_due, is_masterwork, liar_hash, created_at)
    VALUES (?, ?, ?, 'closed', ?, 0, ?, ?)
  `).run(canvasId, today, promptSeed, now, liarHash, now);

  bots.forEach((b, i) => {
    const isLiar = i === liarIndex;
    let subj = origSubj;
    let pal = origPal;
    let mood = origMood;
    let comp = origComp;
    let lieLabel = 'none';

    if (!isLiar) {
      lieLabel = 'palette';
      pal = PALETTES.find(p => p.id !== origPal)?.id || 'pal-2';
    }

    const svg = `<svg viewBox="0 0 600 600"><rect width="600" height="600" fill="#0B0D17"/><circle cx="300" cy="300" r="120" fill="#A855F7"/></svg>`;

    db.prepare(`
      INSERT INTO compositions (id, canvas_id, anon_hash, svg, element_subject, element_palette, element_mood, element_comp, lie_label, is_original, vote_count, created_at)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `).run(`salon_comp_${canvasId}_${i}`, canvasId, b.hash, svg, subj, pal, mood, comp, lieLabel, isLiar ? 1 : 0, Math.floor(Math.random() * 5), now);
  });

  res.json({ success: true, canvasId, liarHash });
});

function ensurePlayer(hash: string, pseudo: string) {
  let player = db.prepare(`SELECT * FROM players WHERE anon_hash = ?`).get(hash);
  if (!player) {
    db.prepare(`
      INSERT INTO players (anon_hash, pseudo, created_at, streak_days, best_streak, brush_xp, eye_xp, hand_xp, palette_tokens)
      VALUES (?, ?, ?, 1, 1, 0, 0, 0, 0)
    `).run(hash, pseudo, Date.now());
    player = db.prepare(`SELECT * FROM players WHERE anon_hash = ?`).get(hash);
  }
  return player;
}

function hashCode(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return hash;
}

app.listen(PORT, () => {
  console.log(`[express] Liar's Palette dev server listening on http://localhost:${PORT}`);
});
