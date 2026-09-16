import { generateSvgCanvas } from './generators/svg';
import { CompositionElements } from './elements';

export async function generateForgeryCardPng(params: {
  originalElements: CompositionElements;
  forgedElements: CompositionElements;
  fooledCount: number;
  totalVoters: number;
  pseudonym: string;
  theme: string;
}): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
  bgGrad.addColorStop(0, '#0B0D17');
  bgGrad.addColorStop(0.5, '#13182B');
  bgGrad.addColorStop(1, '#05060A');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1350);

  // Header banner
  ctx.fillStyle = '#A855F7';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText("LIAR'S PALETTE", 80, 90);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '22px sans-serif';
  ctx.fillText(`FORGERY CARD // ${params.theme.toUpperCase()}`, 80, 130);

  // Side-by-side canvases (440x440 each)
  const origSvg = generateSvgCanvas(params.originalElements, 440, 440, 'card_orig');
  const forgeSvg = generateSvgCanvas(params.forgedElements, 440, 440, 'card_forge');

  // Load SVG into Image objects
  const loadImg = (svgStr: string): Promise<HTMLImageElement> => {
    return new Promise((resolve) => {
      const img = new Image();
      const blob = new Blob([svgStr], { type: 'image/svg+xml;charset=utf-8' });
      const url = URL.createObjectURL(blob);
      img.onload = () => resolve(img);
      img.src = url;
    });
  };

  const [origImg, forgeImg] = await Promise.all([loadImg(origSvg), loadImg(forgeSvg)]);

  // Draw original frame
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(70, 180, 460, 520);
  ctx.drawImage(origImg, 80, 190, 440, 440);
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('ORIGINAL CANVAS', 80, 675);

  // Draw forgery frame
  ctx.fillStyle = '#1E293B';
  ctx.fillRect(550, 180, 460, 520);
  ctx.drawImage(forgeImg, 560, 190, 440, 440);
  ctx.fillStyle = '#EC4899';
  ctx.font = 'bold 22px monospace';
  ctx.fillText('FABRICATED LIE', 560, 675);

  // Fooled stats card
  const statGrad = ctx.createLinearGradient(80, 750, 1000, 950);
  statGrad.addColorStop(0, 'rgba(168, 85, 247, 0.2)');
  statGrad.addColorStop(1, 'rgba(236, 72, 153, 0.2)');
  ctx.fillStyle = statGrad;
  ctx.strokeStyle = '#A855F7';
  ctx.lineWidth = 2;
  ctx.beginPath();
  ctx.roundRect(80, 750, 920, 200, 20);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 54px sans-serif';
  ctx.fillText(`FOOLED ${params.fooledCount} OF ${params.totalVoters} VIEWERS`, 120, 835);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '28px sans-serif';
  ctx.fillText(`Forged by ${params.pseudonym} — Swap exactly 1 element to lie.`, 120, 895);

  // Footer CTA
  ctx.fillStyle = '#06B6D4';
  ctx.font = 'bold 32px sans-serif';
  ctx.fillText('BEAT MY FORGERY -> play liars-palette.com', 80, 1260);

  return canvas.toDataURL('image/png');
}

export async function generateDetectiveCardPng(params: {
  detectedCount: number;
  totalLiars: number;
  pseudonym: string;
  eyeXpGained: number;
  theme: string;
}): Promise<string> {
  const canvas = document.createElement('canvas');
  canvas.width = 1080;
  canvas.height = 1350;
  const ctx = canvas.getContext('2d')!;

  // Background gradient
  const bgGrad = ctx.createLinearGradient(0, 0, 1080, 1350);
  bgGrad.addColorStop(0, '#0F172A');
  bgGrad.addColorStop(0.5, '#0284C7');
  bgGrad.addColorStop(1, '#030712');
  ctx.fillStyle = bgGrad;
  ctx.fillRect(0, 0, 1080, 1350);

  // Header
  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 40px sans-serif';
  ctx.fillText("CAUGHT THE LIAR", 80, 120);

  ctx.fillStyle = '#94A3B8';
  ctx.font = '24px sans-serif';
  ctx.fillText(`DETECTIVE RECAP // ${params.theme.toUpperCase()}`, 80, 170);

  // Badge card
  ctx.fillStyle = 'rgba(15, 23, 42, 0.8)';
  ctx.strokeStyle = '#38BDF8';
  ctx.lineWidth = 3;
  ctx.beginPath();
  ctx.roundRect(80, 240, 920, 480, 24);
  ctx.fill();
  ctx.stroke();

  ctx.fillStyle = '#F59E0B';
  ctx.font = 'bold 96px sans-serif';
  ctx.fillText(`${params.detectedCount} / ${params.totalLiars}`, 140, 400);

  ctx.fillStyle = '#FFFFFF';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('LIARS IDENTIFIED IN THIS MATCH', 140, 480);

  ctx.fillStyle = '#38BDF8';
  ctx.font = 'bold 42px monospace';
  ctx.fillText(`+${params.eyeXpGained} EYE XP EARNED`, 140, 570);

  ctx.fillStyle = '#CBD5E1';
  ctx.font = '28px sans-serif';
  ctx.fillText(`Detective Tag: ${params.pseudonym}`, 140, 640);

  // Footer CTA
  ctx.fillStyle = '#F472B6';
  ctx.font = 'bold 36px sans-serif';
  ctx.fillText('TEST YOUR EYE -> play liars-palette.com', 80, 1240);

  return canvas.toDataURL('image/png');
}
