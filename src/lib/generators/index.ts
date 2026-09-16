/// <reference types="vite/client" />
import { generateSvgCanvas } from './svg';
import { renderShaderCanvas } from './shader';
import { createP5Instance } from './p5mode';

export type GeneratorMode = 'shader' | 'svg' | 'p5';

export function getGeneratorMode(): GeneratorMode {
  const mode = (import.meta as any).env?.VITE_GENERATOR_MODE || 'shader';
  if (mode === 'svg' || mode === 'p5' || mode === 'shader') return mode;
  return 'shader';
}

export { generateSvgCanvas, renderShaderCanvas, createP5Instance };
