import Database from 'better-sqlite3';
import path from 'path';
import fs from 'fs';

const dbPath = process.env.DB_PATH || './data/dev.db';
const dir = path.dirname(dbPath);
if (!fs.existsSync(dir)) {
  fs.mkdirSync(dir, { recursive: true });
}

export const db = new Database(dbPath);

export function initDb() {
  db.exec(`
    CREATE TABLE IF NOT EXISTS players (
      anon_hash     TEXT PRIMARY KEY,
      pseudo        TEXT NOT NULL,
      created_at    INTEGER NOT NULL,
      streak_days   INTEGER NOT NULL DEFAULT 0,
      best_streak   INTEGER NOT NULL DEFAULT 0,
      brush_xp      INTEGER NOT NULL DEFAULT 0,
      eye_xp        INTEGER NOT NULL DEFAULT 0,
      hand_xp       INTEGER NOT NULL DEFAULT 0,
      palette_tokens INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS daily_prompts (
      day           TEXT PRIMARY KEY,
      prompt_seed   TEXT NOT NULL,
      element_set   TEXT NOT NULL,
      is_masterwork INTEGER NOT NULL DEFAULT 0,
      is_style_swap INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS canvases (
      id            TEXT PRIMARY KEY,
      day           TEXT NOT NULL,
      prompt_seed   TEXT NOT NULL,
      phase         TEXT NOT NULL,
      phase_due     INTEGER NOT NULL,
      is_masterwork INTEGER NOT NULL DEFAULT 0,
      liar_hash     TEXT,
      created_at    INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS compositions (
      id            TEXT PRIMARY KEY,
      canvas_id     TEXT NOT NULL,
      anon_hash     TEXT NOT NULL,
      svg           TEXT NOT NULL,
      element_subject TEXT NOT NULL,
      element_palette TEXT NOT NULL,
      element_mood    TEXT NOT NULL,
      element_comp    TEXT NOT NULL,
      lie_label       TEXT NOT NULL,
      is_original     INTEGER NOT NULL DEFAULT 0,
      vote_count      INTEGER NOT NULL DEFAULT 0,
      created_at      INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS lie_votes (
      canvas_id     TEXT NOT NULL,
      voter_hash    TEXT NOT NULL,
      composition_id TEXT NOT NULL,
      vote          TEXT NOT NULL,
      created_at    INTEGER NOT NULL,
      PRIMARY KEY (canvas_id, voter_hash, composition_id)
    );

    CREATE TABLE IF NOT EXISTS liar_picks (
      canvas_id     TEXT NOT NULL,
      voter_hash    TEXT NOT NULL,
      picked_hash   TEXT NOT NULL,
      is_correct    INTEGER NOT NULL DEFAULT 0,
      created_at    INTEGER NOT NULL,
      PRIMARY KEY (canvas_id, voter_hash)
    );

    CREATE TABLE IF NOT EXISTS gallery (
      id            TEXT PRIMARY KEY,
      composition_id TEXT NOT NULL,
      curator_hash  TEXT,
      day           TEXT NOT NULL,
      featured_at   INTEGER NOT NULL,
      engagements   INTEGER NOT NULL DEFAULT 0
    );

    CREATE TABLE IF NOT EXISTS studios (
      id            TEXT PRIMARY KEY,
      owner_hash    TEXT NOT NULL,
      name          TEXT NOT NULL,
      prompt_seeds  TEXT NOT NULL,
      created_at    INTEGER NOT NULL
    );

    CREATE TABLE IF NOT EXISTS studio_members (
      studio_id     TEXT NOT NULL,
      anon_hash     TEXT NOT NULL,
      joined_at     INTEGER NOT NULL,
      PRIMARY KEY (studio_id, anon_hash)
    );

    CREATE TABLE IF NOT EXISTS salons (
      id            TEXT PRIMARY KEY,
      host_hash     TEXT NOT NULL,
      starts_at     INTEGER NOT NULL,
      ends_at       INTEGER NOT NULL,
      canvas_id     TEXT
    );

    CREATE TABLE IF NOT EXISTS style_swaps (
      week_id       TEXT NOT NULL,
      style_key     TEXT NOT NULL,
      PRIMARY KEY (week_id, style_key)
    );

    CREATE TABLE IF NOT EXISTS unlocks (
      anon_hash     TEXT NOT NULL,
      unlock_key    TEXT NOT NULL,
      PRIMARY KEY (anon_hash, unlock_key)
    );
  `);
}
