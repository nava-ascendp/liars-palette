import p5 from 'p5';
import { CompositionElements, getElement } from '../elements';

export function createP5Instance(
  container: HTMLElement,
  elements: CompositionElements,
  width: number = 600,
  height: number = 600,
  seedExtra: string = ''
): p5 {
  const seedKey = `${elements.subject}_${elements.palette}_${elements.mood}_${elements.comp}_${seedExtra}`;
  let seed = 0;
  for (let i = 0; i < seedKey.length; i++) {
    seed = (seed << 5) - seed + seedKey.charCodeAt(i);
    seed |= 0;
  }
  seed = Math.abs(seed);

  const sketch = (p: p5) => {
    p.setup = () => {
      p.createCanvas(width, height);
      p.randomSeed(seed);
      p.noiseSeed(seed);
      p.noLoop();

      const palObj = getElement('palette', elements.palette);
      const colorHexes: Record<string, string[]> = {
        'pal-1': ['#0B0D17', '#A855F7', '#EC4899', '#06B6D4'],
        'pal-2': ['#030712', '#1E1B4B', '#4F46E5', '#93C5FD'],
        'pal-3': ['#1C1917', '#78350F', '#F59E0B', '#FDE68A'],
        'pal-4': ['#022C22', '#047857', '#10B981', '#A7F3D0'],
        'pal-5': ['#0A0A0A', '#333333', '#888888', '#FAFAFA'],
        'pal-6': ['#1F111E', '#BE185D', '#F43F5E', '#FCA5A5'],
        'pal-7': ['#1E1B2E', '#C084FC', '#F472B6', '#38BDF8'],
        'pal-8': ['#03071E', '#03045E', '#00B4D8', '#90E0EF'],
      };
      const colors = colorHexes[palObj.id] || ['#0B0D17', '#A855F7', '#EC4899', '#06B6D4'];

      p.background(colors[0]);

      // Flow field / Perlin noise grid
      p.strokeWeight(1.5);
      for (let y = 0; y < height; y += 15) {
        for (let x = 0; x < width; x += 15) {
          const n = p.noise(x * 0.005, y * 0.005);
          const angle = n * p.TWO_PI * 4;
          const colIndex = Math.floor(p.noise(x * 0.01, y * 0.01) * (colors.length - 1)) + 1;
          p.stroke(colors[colIndex]);

          const x2 = x + Math.cos(angle) * 20;
          const y2 = y + Math.sin(angle) * 20;
          p.line(x, y, x2, y2);
        }
      }

      // Centerpiece geometry
      p.push();
      p.translate(width / 2, height / 2);
      p.noFill();
      p.stroke(colors[colors.length - 1]);
      p.strokeWeight(2);
      p.beginShape();
      for (let a = 0; a < p.TWO_PI; a += 0.1) {
        const r = 120 + p.noise(Math.cos(a) * 2, Math.sin(a) * 2) * 80;
        const x = r * Math.cos(a);
        const y = r * Math.sin(a);
        p.vertex(x, y);
      }
      p.endShape(p.CLOSE);
      p.pop();
    };
  };

  return new p5(sketch, container);
}
