import React from 'react';
import { CompositionElements } from '../lib/elements';
import { CanvasViewer } from './CanvasViewer';
import { Flame, AlertTriangle, Sparkles, Lock } from 'lucide-react';

export interface MuralTile {
  day: string;
  isCompleted: boolean;
  isBrokenStreakSlot?: boolean;
  composition?: {
    element_subject: string;
    element_palette: string;
    element_mood: string;
    element_comp: string;
    lie_label: string;
  };
}

interface MuralGridProps {
  tiles: MuralTile[];
  streakDays: number;
}

export const MuralGrid: React.FC<MuralGridProps> = ({ tiles, streakDays }) => {
  return (
    <div className="space-y-4">
      {/* Header Info */}
      <div className="flex items-center justify-between p-4 rounded-xl bg-slate-900 border border-slate-800">
        <div className="flex items-center space-x-3">
          <div className="w-10 h-10 rounded-lg bg-amber-500/20 border border-amber-500/40 flex items-center justify-center">
            <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          </div>
          <div>
            <h3 className="text-sm font-bold text-slate-100">Daily Mural Streak</h3>
            <p className="text-xs text-slate-400">
              Your public canvas grid. Quitting day ≥ 3 leaves a permanent missing tile!
            </p>
          </div>
        </div>
        <div className="text-right">
          <span className="text-2xl font-extrabold text-amber-400 font-mono">{streakDays} Days</span>
          <span className="block text-[10px] text-slate-400 uppercase tracking-widest">Active Streak</span>
        </div>
      </div>

      {/* Grid of Canvases */}
      <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-7 gap-3">
        {tiles.map((tile, idx) => {
          if (tile.isCompleted && tile.composition) {
            const elements: CompositionElements = {
              subject: tile.composition.element_subject,
              palette: tile.composition.element_palette,
              mood: tile.composition.element_mood,
              comp: tile.composition.element_comp,
            };

            return (
              <div
                key={tile.day + idx}
                className="aspect-square rounded-xl bg-slate-900 border border-slate-800 overflow-hidden relative group shadow-md"
              >
                <CanvasViewer elements={elements} showBadges={false} />
                <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity p-2 flex flex-col justify-end text-[9px] font-mono text-slate-200">
                  <span>Day: {tile.day}</span>
                  <span className="text-purple-300">Lie: {tile.composition.lie_label}</span>
                </div>
              </div>
            );
          }

          if (tile.isBrokenStreakSlot) {
            return (
              <div
                key={tile.day + idx}
                className="aspect-square rounded-xl bg-rose-950/20 border-2 border-dashed border-rose-500/50 flex flex-col items-center justify-center p-2 text-center relative group"
                title="Missing tile from broken streak!"
              >
                <AlertTriangle className="w-5 h-5 text-rose-400 mb-1" />
                <span className="text-[9px] font-mono text-rose-300 font-bold">MISSING TILE</span>
                <span className="text-[8px] text-rose-400/80">{tile.day}</span>
              </div>
            );
          }

          // Future locked tile
          return (
            <div
              key={tile.day + idx}
              className="aspect-square rounded-xl bg-slate-950/60 border border-slate-900 flex flex-col items-center justify-center text-slate-700 relative group"
            >
              <Lock className="w-4 h-4 mb-1 text-slate-700" />
              <span className="text-[8px] font-mono text-slate-600">???</span>
            </div>
          );
        })}
      </div>
    </div>
  );
};
