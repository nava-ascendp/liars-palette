import React, { useEffect, useRef, useState } from 'react';
import { CompositionElements, getElement } from '../lib/elements';
import { generateSvgCanvas, renderShaderCanvas, createP5Instance, getGeneratorMode } from '../lib/generators';
import { Maximize2, RefreshCw, Code, Sparkles } from 'lucide-react';

interface CanvasViewerProps {
  elements: CompositionElements;
  title?: string;
  subtitle?: string;
  seedExtra?: string;
  width?: number;
  height?: number;
  interactive?: boolean;
  className?: string;
  showBadges?: boolean;
  lieLabel?: string;
}

export const CanvasViewer: React.FC<CanvasViewerProps> = ({
  elements,
  title,
  subtitle,
  seedExtra = '',
  width = 600,
  height = 600,
  className = '',
  showBadges = true,
  lieLabel = 'none',
}) => {
  const mode = getGeneratorMode();
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const p5ContainerRef = useRef<HTMLDivElement | null>(null);
  const [svgHtml, setSvgHtml] = useState<string>('');
  const [isFullscreen, setIsFullscreen] = useState(false);

  useEffect(() => {
    if (mode === 'svg') {
      const svg = generateSvgCanvas(elements, width, height, seedExtra);
      setSvgHtml(svg);
    } else if (mode === 'shader' && canvasRef.current) {
      canvasRef.current.width = width;
      canvasRef.current.height = height;
      renderShaderCanvas(canvasRef.current, elements, seedExtra);
    } else if (mode === 'p5' && p5ContainerRef.current) {
      p5ContainerRef.current.innerHTML = '';
      const p5Inst = createP5Instance(p5ContainerRef.current, elements, width, height, seedExtra);
      return () => {
        p5Inst.remove();
      };
    }
    return undefined;
  }, [elements, mode, width, height, seedExtra]);

  const subjObj = getElement('subject', elements.subject);
  const palObj = getElement('palette', elements.palette);
  const moodObj = getElement('mood', elements.mood);
  const compObj = getElement('comp', elements.comp);

  return (
    <div className={`relative group rounded-2xl overflow-hidden border border-palette-border bg-palette-card shadow-2xl flex flex-col ${className}`}>
      {/* Title Header */}
      {(title || subtitle) && (
        <div className="px-4 py-3 bg-slate-900/90 border-b border-slate-800/80 flex items-center justify-between">
          <div>
            {title && <h3 className="text-sm font-bold text-slate-100">{title}</h3>}
            {subtitle && <p className="text-xs text-slate-400">{subtitle}</p>}
          </div>
          <button
            onClick={() => setIsFullscreen(!isFullscreen)}
            className="p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white transition-colors"
            title="Toggle fullscreen"
          >
            <Maximize2 className="w-4 h-4" />
          </button>
        </div>
      )}

      {/* Canvas Graphic Container */}
      <div className="relative w-full aspect-square bg-[#0B0D17] flex items-center justify-center overflow-hidden">
        {mode === 'svg' && (
          <div
            className="w-full h-full flex items-center justify-center"
            dangerouslySetInnerHTML={{ __html: svgHtml }}
          />
        )}

        {mode === 'shader' && (
          <canvas ref={canvasRef} className="w-full h-full object-contain" />
        )}

        {mode === 'p5' && (
          <div ref={p5ContainerRef} className="w-full h-full flex items-center justify-center" />
        )}

        {/* Lie Badge Overlay */}
        {lieLabel !== 'none' && (
          <div className="absolute top-3 right-3 px-2.5 py-1 rounded-full bg-rose-500/90 text-white font-mono text-[11px] font-bold shadow-lg shadow-rose-500/30 backdrop-blur-md flex items-center space-x-1">
            <Sparkles className="w-3 h-3" />
            <span>FABRICATED: {lieLabel.toUpperCase()}</span>
          </div>
        )}
      </div>

      {/* 4 Element Badges */}
      {showBadges && (
        <div className="p-3 bg-slate-950/80 border-t border-slate-800/80 grid grid-cols-2 gap-2 text-[11px] font-mono">
          <div className={`px-2 py-1 rounded bg-slate-900 border ${lieLabel === 'subject' ? 'border-rose-500 text-rose-300' : 'border-slate-800 text-slate-300'}`}>
            <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Subject</span>
            <span className="font-semibold truncate block">{subjObj.name}</span>
          </div>
          <div className={`px-2 py-1 rounded bg-slate-900 border ${lieLabel === 'palette' ? 'border-rose-500 text-rose-300' : 'border-slate-800 text-slate-300'}`}>
            <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Palette</span>
            <span className="font-semibold truncate block">{palObj.name}</span>
          </div>
          <div className={`px-2 py-1 rounded bg-slate-900 border ${lieLabel === 'mood' ? 'border-rose-500 text-rose-300' : 'border-slate-800 text-slate-300'}`}>
            <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Mood</span>
            <span className="font-semibold truncate block">{moodObj.name}</span>
          </div>
          <div className={`px-2 py-1 rounded bg-slate-900 border ${lieLabel === 'comp' ? 'border-rose-500 text-rose-300' : 'border-slate-800 text-slate-300'}`}>
            <span className="text-slate-500 uppercase tracking-wider block text-[9px]">Composition</span>
            <span className="font-semibold truncate block">{compObj.name}</span>
          </div>
        </div>
      )}

      {/* Fullscreen Lightbox Modal */}
      {isFullscreen && (
        <div
          onClick={() => setIsFullscreen(false)}
          className="fixed inset-0 z-50 bg-black/90 backdrop-blur-lg flex items-center justify-center p-6 cursor-pointer"
        >
          <div className="max-w-3xl w-full aspect-square bg-[#0B0D17] rounded-3xl overflow-hidden border border-purple-500/40 p-2 shadow-2xl">
            <div
              className="w-full h-full"
              dangerouslySetInnerHTML={{ __html: generateSvgCanvas(elements, 1000, 1000, seedExtra) }}
            />
          </div>
        </div>
      )}
    </div>
  );
};
