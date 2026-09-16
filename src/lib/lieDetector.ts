export interface OpponentPrior {
  opponentHash: string;
  opponentPseudo: string;
  totalRounds: number;
  liesByElement: {
    subject: number;
    palette: number;
    mood: number;
    comp: number;
  };
}

export function getLiePriors(): Record<string, OpponentPrior> {
  try {
    const raw = localStorage.getItem('liePriors');
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export function updateLiePrior(
  opponentHash: string,
  opponentPseudo: string,
  liedElement: 'subject' | 'palette' | 'mood' | 'comp'
): Record<string, OpponentPrior> {
  const priors = getLiePriors();
  if (!priors[opponentHash]) {
    priors[opponentHash] = {
      opponentHash,
      opponentPseudo,
      totalRounds: 0,
      liesByElement: { subject: 1, palette: 1, mood: 1, comp: 1 }, // Laplace smoothing prior
    };
  }

  const p = priors[opponentHash];
  p.totalRounds += 1;
  p.liesByElement[liedElement] += 1;

  localStorage.setItem('liePriors', JSON.stringify(priors));
  return priors;
}

export function calculateBayesianProbabilities(opponentHash: string): Record<'subject' | 'palette' | 'mood' | 'comp', number> {
  const priors = getLiePriors();
  const defaultProb = { subject: 0.25, palette: 0.25, mood: 0.25, comp: 0.25 };

  if (!priors[opponentHash]) return defaultProb;

  const p = priors[opponentHash];
  const total = p.liesByElement.subject + p.liesByElement.palette + p.liesByElement.mood + p.liesByElement.comp;

  return {
    subject: Number((p.liesByElement.subject / total).toFixed(2)),
    palette: Number((p.liesByElement.palette / total).toFixed(2)),
    mood: Number((p.liesByElement.mood / total).toFixed(2)),
    comp: Number((p.liesByElement.comp / total).toFixed(2)),
  };
}
