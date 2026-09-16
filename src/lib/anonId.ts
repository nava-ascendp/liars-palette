export function getAnonId(): string {
  let id = localStorage.getItem('liars_anon_id');
  if (!id) {
    id = 'user_' + Math.random().toString(36).substring(2, 15) + Math.random().toString(36).substring(2, 15);
    localStorage.setItem('liars_anon_id', id);
  }
  return id;
}

export function getPseudonym(): string {
  let pseudo = localStorage.getItem('liars_pseudonym');
  if (!pseudo) {
    const adjectives = ['Cipher', 'Quantum', 'Prismatic', 'Shadow', 'Neon', 'Arcane', 'Ethereal', 'Abstract'];
    const nouns = ['Vanguard', 'Brush', 'Detective', 'Weaver', 'Specter', 'Oracle', 'Monk', 'Artisan'];
    pseudo = `${adjectives[Math.floor(Math.random() * adjectives.length)]} ${nouns[Math.floor(Math.random() * nouns.length)]}`;
    localStorage.setItem('liars_pseudonym', pseudo);
  }
  return pseudo;
}
