import React from 'react';
import { Eye, Sparkles, Award } from 'lucide-react';

interface EagleEyeHighlightProps {
  correctCount: number;
  totalCount: number;
}

export const EagleEyeHighlight: React.FC<EagleEyeHighlightProps> = ({ correctCount, totalCount }) => {
  return (
    <div className="p-4 rounded-xl bg-gradient-to-r from-amber-950/60 via-purple-950/60 to-slate-900 border border-amber-500/50 flex items-center space-x-4 shadow-xl animate-pulse-glow">
      <div className="w-12 h-12 rounded-xl bg-amber-500/20 border border-amber-400/60 flex items-center justify-center flex-shrink-0">
        <Award className="w-6 h-6 text-amber-400" />
      </div>
      <div className="flex-1">
        <div className="flex items-center space-x-2">
          <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-amber-500 text-slate-950">
            EAGLE-EYE HIGHLIGHT
          </span>
          <span className="text-xs font-mono text-amber-300 font-bold">NEAR-MISS DETECTED!</span>
        </div>
        <p className="text-xs text-slate-200 mt-1">
          You guessed <span className="font-bold text-amber-400">{correctCount} of {totalCount}</span> liar elements correctly! 1 more correct vote would have placed you in the top 5% of detectives today.
        </p>
      </div>
    </div>
  );
};
