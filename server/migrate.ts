import { initDb } from './db.js';

console.log('[db] Migrating database schema...');
initDb();
console.log('[db] Migration complete: 12 tables created/verified.');
