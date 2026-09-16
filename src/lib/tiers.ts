export interface TierDefinition {
  id: string;
  name: string;
  roundsRequired: number;
  streakRequired: number;
  unlocks: string;
  perks: string[];
  badgeColor: string;
}

export const TIERS: TierDefinition[] = [
  {
    id: 'sketch',
    name: 'Sketch',
    roundsRequired: 0,
    streakRequired: 0,
    unlocks: 'Compose mode unlocked',
    perks: ['Can generate and submit forgeries'],
    badgeColor: 'text-slate-400 bg-slate-900/80 border-slate-700',
  },
  {
    id: 'painter',
    name: 'Painter',
    roundsRequired: 10,
    streakRequired: 5,
    unlocks: 'Vote mode + Eye XP gains',
    perks: ['Detective voting unlocked', '+10% Eye XP bonus'],
    badgeColor: 'text-cyan-400 bg-cyan-950/80 border-cyan-800',
  },
  {
    id: 'forger',
    name: 'Forger',
    roundsRequired: 30,
    streakRequired: 14,
    unlocks: 'Custom-palette tokens (3/week)',
    perks: ['3 Palette Tokens weekly', '+5% Brush XP bonus'],
    badgeColor: 'text-purple-400 bg-purple-950/80 border-purple-800',
  },
  {
    id: 'curator',
    name: 'Curator',
    roundsRequired: 100,
    streakRequired: 30,
    unlocks: 'Studio Space + Custom Prompt submission',
    perks: ['Studio Space creation', 'Public gallery curation privileges'],
    badgeColor: 'text-amber-400 bg-amber-950/80 border-amber-800',
  },
  {
    id: 'master',
    name: 'Master',
    roundsRequired: 250,
    streakRequired: 45,
    unlocks: 'Masterwork prompt seeding + Hall of Fame',
    perks: ['5x Masterwork drop seeding', 'Profile pulsing aura'],
    badgeColor: 'text-pink-400 bg-pink-950/80 border-pink-800',
  },
  {
    id: 'laureate',
    name: 'Laureate',
    roundsRequired: 500,
    streakRequired: 60,
    unlocks: 'Mythic Gallery + Permanent Studio',
    perks: ['Lifetime Masterwork prompt access', 'Mythic Curator Tag'],
    badgeColor: 'text-emerald-400 bg-emerald-950/80 border-emerald-800',
  },
];

export function getPlayerTier(totalRounds: number, streakDays: number): TierDefinition {
  for (let i = TIERS.length - 1; i >= 0; i--) {
    const tier = TIERS[i];
    if (totalRounds >= tier.roundsRequired || streakDays >= tier.streakRequired) {
      return tier;
    }
  }
  return TIERS[0];
}
