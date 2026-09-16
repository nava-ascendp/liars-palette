import { CompositionElements, getElement } from '../elements';

function hexToRgb(hex: string): [number, number, number] {
  const cleanHex = hex.replace('#', '');
  const bigint = parseInt(cleanHex, 16);
  const r = ((bigint >> 16) & 255) / 255;
  const g = ((bigint >> 8) & 255) / 255;
  const b = (bigint & 255) / 255;
  return [r, g, b];
}

const vsSource = `
  attribute vec2 aPosition;
  varying vec2 vUv;
  void main() {
    vUv = (aPosition + 1.0) * 0.5;
    gl_Position = vec4(aPosition, 0.0, 1.0);
  }
`;

const fsSource = `
  precision mediump float;
  varying vec2 vUv;
  uniform vec2 uResolution;
  uniform float uSeed;
  uniform vec3 uColor1;
  uniform vec3 uColor2;
  uniform vec3 uColor3;
  uniform vec3 uColor4;
  uniform float uSubjectType;
  uniform float uMoodType;
  uniform float uCompType;

  // Pseudo-random & simplex noise
  float random(vec2 st) {
    return fract(sin(dot(st.xy, vec2(12.9898, 78.233) + uSeed)) * 43758.5453123);
  }

  float noise(vec2 st) {
    vec2 i = floor(st);
    vec2 f = fract(st);
    float a = random(i);
    float b = random(i + vec2(1.0, 0.0));
    float c = random(i + vec2(0.0, 1.0));
    float d = random(i + vec2(1.0, 1.0));
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(a, b, u.x) + (c - a)* u.y * (1.0 - u.x) + (d - b) * u.x * u.y;
  }

  float fbm(vec2 st) {
    float value = 0.0;
    float amplitude = 0.5;
    for (int i = 0; i < 5; i++) {
      value += amplitude * noise(st);
      st *= 2.0;
      amplitude *= 0.5;
    }
    return value;
  }

  void main() {
    vec2 st = (gl_FragCoord.xy - 0.5 * uResolution.xy) / uResolution.y;

    // Composition transformations
    if (uCompType > 1.5 && uCompType < 2.5) { // Spiral
      float r = length(st);
      float a = atan(st.y, st.x);
      st = vec2(log(r) - a * 0.2, a);
    } else if (uCompType > 2.5 && uCompType < 3.5) { // Mirror
      st.x = abs(st.x);
    } else if (uCompType > 4.5) { // Horizon
      st.y += 0.25;
    }

    // FBM procedural texture
    vec2 q = vec2(fbm(st + vec2(0.0, 0.0)), fbm(st + vec2(5.2, 1.3)));
    vec2 r = vec2(fbm(st + 4.0 * q + vec2(1.7, 9.2)), fbm(st + 4.0 * q + vec2(8.3, 2.8)));
    float f = fbm(st + 4.0 * r);

    // Color gradient mixing
    vec3 color = mix(uColor1, uColor2, clamp(f * f * 4.0, 0.0, 1.0));
    color = mix(color, uColor3, clamp(length(q), 0.0, 1.0));
    color = mix(color, uColor4, clamp(length(r.x), 0.0, 1.0));

    // Mood modifiers
    if (uMoodType < 1.5) { // Melancholic Haze
      float grain = random(gl_FragCoord.xy) * 0.08;
      color = mix(color, vec3(0.05, 0.05, 0.15), 0.3) + grain;
    } else if (uMoodType > 1.5 && uMoodType < 2.5) { // Kinetic Sparks
      float spark = step(0.985, random(gl_FragCoord.xy * 0.1));
      color += spark * uColor4 * 2.0;
    } else if (uMoodType > 4.5) { // Euphoric Glow
      color = pow(color, vec3(0.85)) * 1.25;
    }

    // Vignette
    float dist = length(vUv - vec2(0.5));
    color *= (1.0 - dist * 0.5);

    gl_FragColor = vec4(color, 1.0);
  }
`;

export function renderShaderCanvas(
  canvas: HTMLCanvasElement,
  elements: CompositionElements,
  seedExtra: string = ''
): void {
  const gl = canvas.getContext('webgl');
  if (!gl) return;

  const seed = hashString(`${elements.subject}_${elements.palette}_${elements.mood}_${elements.comp}_${seedExtra}`);

  // Create shaders
  const vs = gl.createShader(gl.VERTEX_SHADER)!;
  gl.shaderSource(vs, vsSource);
  gl.compileShader(vs);

  const fs = gl.createShader(gl.FRAGMENT_SHADER)!;
  gl.shaderSource(fs, fsSource);
  gl.compileShader(fs);

  const program = gl.createProgram()!;
  gl.attachShader(program, vs);
  gl.attachShader(program, fs);
  gl.linkProgram(program);
  gl.useProgram(program);

  // Quad vertices
  const vertices = new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]);
  const buffer = gl.createBuffer();
  gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
  gl.bufferData(gl.ARRAY_BUFFER, vertices, gl.STATIC_DRAW);

  const aPosition = gl.getAttribLocation(program, 'aPosition');
  gl.enableVertexAttribArray(aPosition);
  gl.vertexAttribPointer(aPosition, 2, gl.FLOAT, false, 0, 0);

  // Set Uniforms
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

  const hexList = colorHexes[palObj.id] || ['#0B0D17', '#A855F7', '#EC4899', '#06B6D4'];

  gl.uniform2f(gl.getUniformLocation(program, 'uResolution'), canvas.width, canvas.height);
  gl.uniform1f(gl.getUniformLocation(program, 'uSeed'), seed % 1000);

  gl.uniform3fv(gl.getUniformLocation(program, 'uColor1'), hexToRgb(hexList[0]));
  gl.uniform3fv(gl.getUniformLocation(program, 'uColor2'), hexToRgb(hexList[1]));
  gl.uniform3fv(gl.getUniformLocation(program, 'uColor3'), hexToRgb(hexList[2]));
  gl.uniform3fv(gl.getUniformLocation(program, 'uColor4'), hexToRgb(hexList[3]));

  const subjNum = parseInt(elements.subject.replace('subj-', ''), 10) || 1;
  const moodNum = parseInt(elements.mood.replace('mood-', ''), 10) || 1;
  const compNum = parseInt(elements.comp.replace('comp-', ''), 10) || 1;

  gl.uniform1f(gl.getUniformLocation(program, 'uSubjectType'), subjNum);
  gl.uniform1f(gl.getUniformLocation(program, 'uMoodType'), moodNum);
  gl.uniform1f(gl.getUniformLocation(program, 'uCompType'), compNum);

  gl.viewport(0, 0, canvas.width, canvas.height);
  gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
}

function hashString(str: string): number {
  let hash = 0;
  for (let i = 0; i < str.length; i++) {
    hash = (hash << 5) - hash + str.charCodeAt(i);
    hash |= 0;
  }
  return Math.abs(hash);
}
