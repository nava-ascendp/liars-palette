export interface ScoreResult {
  brushXpGained: number;
  eyeXpGained: number;
  handXpGained: number;
  paletteTokensGained: number;
  isEagleEye: boolean;
  correctLiarPicked: boolean;
  fooledCount: number;
}

export function calculateRoundScores(params: {
  isMasterwork: boolean;
  isOriginalAuthor: boolean;
  correctVotesGiven: number; // how many compositions correctly identified as truth/lie
  totalCompositionsVoted: number;
  correctLiarPicked: boolean;
  votersFooledCount: number; // how many voters thought your forgery was truth
  totalVoters: number;
}): ScoreResult {
  const multiplier = params.isMasterwork ? 5 : 1;

  // Brush XP: for participating in composition
  const brushXpGained = 25 * multiplier;

  // Eye XP: for correctly spotting lies and identifying the liar
  let eyeXpGained = params.correctVotesGiven * 15 * multiplier;
  if (params.correctLiarPicked) {
    eyeXpGained += 50 * multiplier;
  }

  // Hand XP: for deceiving voters with your forgery
  let handXpGained = 0;
  if (!params.isOriginalAuthor) {
    handXpGained = params.votersFooledCount * 30 * multiplier;
  }

  // Palette Tokens: 1 token for every 50 total XP milestone
  const totalXp = brushXpGained + eyeXpGained + handXpGained;
  const paletteTokensGained = Math.floor(totalXp / 100);

  // Eagle Eye Highlight near-miss: correctly guessed at least 75% of truth/lies but missed liar OR guessed liar with close call
  const voteRatio = params.totalCompositionsVoted > 0 ? params.correctVotesGiven / params.totalCompositionsVoted : 0;
  const isEagleEye = voteRatio >= 0.75 && (!params.correctLiarPicked || params.correctVotesGiven >= 3);

  return {
    brushXpGained,
    eyeXpGained,
    handXpGained,
    paletteTokensGained,
    isEagleEye,
    correctLiarPicked: params.correctLiarPicked,
    fooledCount: params.votersFooledCount,
  };
}
