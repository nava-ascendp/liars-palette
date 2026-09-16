export function calculateJaccardSimilarity(textA: string, textB: string): number {
  const getTrigrams = (str: string): Set<string> => {
    const s = str.toLowerCase().replace(/[^a-z0-9]/g, '');
    const trigrams = new Set<string>();
    for (let i = 0; i < s.length - 2; i++) {
      trigrams.add(s.substring(i, i + 3));
    }
    return trigrams;
  };

  const setA = getTrigrams(textA);
  const setB = getTrigrams(textB);

  if (setA.size === 0 || setB.size === 0) return 0;

  let intersection = 0;
  setA.forEach(tri => {
    if (setB.has(tri)) intersection++;
  });

  const union = setA.size + setB.size - intersection;
  return union === 0 ? 0 : intersection / union;
}

export function isNearDuplicatePrompt(newPrompt: string, existingPrompts: string[], threshold: number = 0.85): { isDuplicate: boolean; maxSimilarity: number; matchingPrompt?: string } {
  let maxSim = 0;
  let match: string | undefined = undefined;

  for (const p of existingPrompts) {
    const sim = calculateJaccardSimilarity(newPrompt, p);
    if (sim > maxSim) {
      maxSim = sim;
      match = p;
    }
  }

  return {
    isDuplicate: maxSim >= threshold,
    maxSimilarity: Number(maxSim.toFixed(2)),
    matchingPrompt: match,
  };
}
