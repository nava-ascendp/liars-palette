import React, { useEffect, useState } from 'react';
import confetti from 'canvas-confetti';
import { CompositionElements } from '../lib/elements';
import { CanvasViewer } from '../components/CanvasViewer';
import { EagleEyeHighlight } from '../components/EagleEyeHighlight';
import { ForgeryCardModal } from '../components/ForgeryCardModal';
import { getPseudonym } from '../lib/anonId';
import { Trophy, Share2, Sparkles, Award, CheckCircle, ArrowRight, Eye, Brush, Flame } from 'lucide-react';

interface RevealProps {
  setActiveTab: (tab: string) => void;
}

export const Reveal: React.FC<RevealProps> = ({ setActiveTab }) => {
  const [modalType, setModalType] = useState<'forgery' | 'detective' | null>(null);
  const pseudo = getPseudonym();

  useEffect(() => {
    // Fire confetti victory burst
    confetti({
      particleCount: 80,
      spread: 70,
      origin: { y: 0.6 },
    });
  }, []);

  const origElements: CompositionElements = {
    subject: 'subj-1',
    palette: 'pal-1',
    mood: 'mood-1',
    comp: 'comp-1',
  };

  const forgedElements: CompositionElements = {
    subject: 'subj-1',
    palette: 'pal-4',
    mood: 'mood-1',
    comp: 'comp-1',
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="text-center max-w-3xl mx-auto space-y-3">
        <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40 text-xs font-mono font-bold">
          <Sparkles className="w-3.5 h-3.5" />
          <span>MATCH REVEAL & LIAR UNMASKED</span>
        </div>
        <h1 className="text-4xl font-extrabold text-white">Post-Round Results Recap</h1>
        <p className="text-sm text-slate-300">
          The original canvas author was <span className="font-bold text-purple-300">Cipher Artisan</span>. 6 of 8 players were fooled by your forgery!
        </p>
      </div>

      {/* Near-Miss Eagle Eye Highlight Badge */}
      <EagleEyeHighlight correctCount={3} totalCount={4} />

      {/* Side-by-Side Original vs Liar Comparison */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <CanvasViewer
          elements={origElements}
          title="ORIGINAL PROMPT CANVAS"
          subtitle="Authored by Liar (Cipher Artisan)"
        />

        <CanvasViewer
          elements={forgedElements}
          title="YOUR FABRICATED FORGERY"
          subtitle="Swapped: PALETTE SCHEME (Fooled 6 Viewers)"
          lieLabel="palette"
        />
      </div>

      {/* XP Score Breakdown Card */}
      <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
        <h3 className="text-lg font-bold text-white flex items-center space-x-2">
          <Trophy className="w-5 h-5 text-amber-400" />
          <span>Round Score Breakdown</span>
        </h3>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 text-center space-y-1">
            <span className="text-xs text-purple-300 font-mono uppercase flex items-center justify-center space-x-1">
              <Brush className="w-3.5 h-3.5" />
              <span>Brush XP</span>
            </span>
            <span className="block text-3xl font-extrabold text-white font-mono">+25 XP</span>
            <span className="text-[10px] text-slate-400">Composition Submission</span>
          </div>

          <div className="p-4 rounded-xl bg-cyan-950/40 border border-cyan-500/30 text-center space-y-1">
            <span className="text-xs text-cyan-300 font-mono uppercase flex items-center justify-center space-x-1">
              <Eye className="w-3.5 h-3.5" />
              <span>Eye XP</span>
            </span>
            <span className="block text-3xl font-extrabold text-white font-mono">+95 XP</span>
            <span className="text-[10px] text-slate-400">Detective Accuracy</span>
          </div>

          <div className="p-4 rounded-xl bg-pink-950/40 border border-pink-500/30 text-center space-y-1">
            <span className="text-xs text-pink-300 font-mono uppercase flex items-center justify-center space-x-1">
              <Sparkles className="w-3.5 h-3.5" />
              <span>Hand XP</span>
            </span>
            <span className="block text-3xl font-extrabold text-white font-mono">+180 XP</span>
            <span className="text-[10px] text-slate-400">Fooled 6 of 8 Voters</span>
          </div>
        </div>

        {/* Share Artifact Triggers */}
        <div className="flex flex-wrap gap-4 pt-2">
          <button
            onClick={() => setModalType('forgery')}
            className="flex-1 py-3.5 px-5 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-xs flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Share2 className="w-4 h-4" />
            <span>EXPORT VIRAL FORGERY CARD (1080x1350)</span>
          </button>

          <button
            onClick={() => setModalType('detective')}
            className="flex-1 py-3.5 px-5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-200 border border-slate-700 font-bold text-xs flex items-center justify-center space-x-2 transition-all"
          >
            <Award className="w-4 h-4 text-cyan-400" />
            <span>EXPORT CAUGHT-THE-LIAR RECAP CARD</span>
          </button>
        </div>
      </div>

      {/* Forgery Card Modal */}
      <ForgeryCardModal
        isOpen={modalType !== null}
        onClose={() => setModalType(null)}
        type={modalType || 'forgery'}
        originalElements={origElements}
        forgedElements={forgedElements}
        fooledCount={6}
        totalVoters={8}
        detectedCount={3}
        totalLiars={4}
        eyeXpGained={95}
        pseudonym={pseudo}
        theme="CYBERPUNK METROPOLIS"
      />
    </div>
  );
};
