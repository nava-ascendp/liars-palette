import React, { useState } from 'react';
import { CompositionElements } from '../lib/elements';
import { CanvasViewer } from './CanvasViewer';
import { calculateBayesianProbabilities } from '../lib/lieDetector';
import { Check, X, ShieldAlert, User, HelpCircle, BrainCircuit } from 'lucide-react';

export interface CompositionItem {
  id: string;
  anon_hash: string;
  pseudo?: string;
  element_subject: string;
  element_palette: string;
  element_mood: string;
  element_comp: string;
  vote_count: number;
}

interface TruthLieVoteProps {
  compositions: CompositionItem[];
  onVoteTruthLie: (compId: string, vote: 'truth' | 'lie') => void;
  onPickLiar: (pickedHash: string) => void;
  votedTruthLieMap: Record<string, 'truth' | 'lie'>;
  pickedLiarHash?: string;
}

export const TruthLieVote: React.FC<TruthLieVoteProps> = ({
  compositions,
  onVoteTruthLie,
  onPickLiar,
  votedTruthLieMap,
  pickedLiarHash,
}) => {
  const [selectedCompId, setSelectedCompId] = useState<string>(compositions[0]?.id || '');
  const selectedComp = compositions.find((c) => c.id === selectedCompId) || compositions[0];

  if (!selectedComp) {
    return <div className="p-8 text-center text-slate-500">No submitted compositions available for voting yet.</div>;
  }

  const selectedElements: CompositionElements = {
    subject: selectedComp.element_subject,
    palette: selectedComp.element_palette,
    mood: selectedComp.element_mood,
    comp: selectedComp.element_comp,
  };

  // Bayesian prior suggestions for selected player
  const bayesProbs = calculateBayesianProbabilities(selectedComp.anon_hash);

  return (
    <div className="space-y-6">
      {/* Top Selector Grid of Compositions */}
      <div>
        <h4 className="text-xs uppercase font-mono tracking-wider text-slate-400 mb-3">
          Submitted Canvases in Match ({compositions.length})
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-6 gap-3">
          {compositions.map((c, idx) => {
            const isSelected = c.id === selectedCompId;
            const userVote = votedTruthLieMap[c.id];
            const isPickedAsLiar = pickedLiarHash === c.anon_hash;

            return (
              <button
                key={c.id}
                onClick={() => setSelectedCompId(c.id)}
                className={`p-2 rounded-xl border text-left transition-all relative overflow-hidden group ${
                  isSelected
                    ? 'bg-purple-950/60 border-purple-500 ring-2 ring-purple-500/40 shadow-lg'
                    : 'bg-slate-900/60 border-slate-800 hover:border-slate-700'
                }`}
              >
                <div className="text-[11px] font-mono font-bold text-slate-300 truncate mb-1">
                  Canvas #{idx + 1}
                </div>
                <div className="w-full aspect-square bg-[#0B0D17] rounded-lg overflow-hidden border border-slate-800">
                  <CanvasViewer
                    elements={{
                      subject: c.element_subject,
                      palette: c.element_palette,
                      mood: c.element_mood,
                      comp: c.element_comp,
                    }}
                    showBadges={false}
                  />
                </div>

                {/* Vote badges */}
                <div className="mt-2 flex items-center justify-between text-[10px] font-mono">
                  {userVote === 'truth' && <span className="text-emerald-400 font-bold">✓ Truth</span>}
                  {userVote === 'lie' && <span className="text-rose-400 font-bold">✗ Lie</span>}
                  {!userVote && <span className="text-slate-500">Unvoted</span>}

                  {isPickedAsLiar && (
                    <span className="px-1.5 py-0.5 rounded bg-amber-500/20 text-amber-300 border border-amber-500/40 font-bold">
                      LIAR
                    </span>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      {/* Main Inspection Area */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Canvas Preview */}
        <div className="lg:col-span-7">
          <CanvasViewer
            elements={selectedElements}
            title={`Inspecting Canvas #${compositions.findIndex((c) => c.id === selectedCompId) + 1}`}
            subtitle={`Submitted by Anonymous Painter (${selectedComp.anon_hash.slice(0, 10)})`}
            showBadges={true}
          />
        </div>

        {/* Right Voting Controls & Bayesian Prior Panel */}
        <div className="lg:col-span-5 space-y-5">
          {/* Truth vs Lie Decision Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <ShieldAlert className="w-5 h-5 text-purple-400" />
              <span>Step 1: Is this Canvas Authentic?</span>
            </h3>
            <p className="text-xs text-slate-400">
              Did this player submit the original untampered prompt, or did they modify 1 element to fabricate a lie?
            </p>

            <div className="grid grid-cols-2 gap-3">
              <button
                onClick={() => onVoteTruthLie(selectedComp.id, 'truth')}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 border transition-all ${
                  votedTruthLieMap[selectedComp.id] === 'truth'
                    ? 'bg-emerald-600 text-white border-emerald-400 shadow-lg shadow-emerald-600/30'
                    : 'bg-slate-950 text-emerald-400 border-emerald-800/60 hover:bg-emerald-950/40'
                }`}
              >
                <Check className="w-4 h-4" />
                <span>VOTE TRUTH</span>
              </button>

              <button
                onClick={() => onVoteTruthLie(selectedComp.id, 'lie')}
                className={`py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 border transition-all ${
                  votedTruthLieMap[selectedComp.id] === 'lie'
                    ? 'bg-rose-600 text-white border-rose-400 shadow-lg shadow-rose-600/30'
                    : 'bg-slate-950 text-rose-400 border-rose-800/60 hover:bg-rose-950/40'
                }`}
              >
                <X className="w-4 h-4" />
                <span>VOTE LIE</span>
              </button>
            </div>
          </div>

          {/* Pick Liar Card */}
          <div className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
            <h3 className="text-base font-bold text-slate-100 flex items-center space-x-2">
              <User className="w-5 h-5 text-amber-400" />
              <span>Step 2: Suspect Original Author?</span>
            </h3>
            <p className="text-xs text-slate-400">
              If you believe this player wrote the original prompt that everyone forged from, mark them as the Liar.
            </p>

            <button
              onClick={() => onPickLiar(selectedComp.anon_hash)}
              className={`w-full py-3 px-4 rounded-xl font-bold text-sm flex items-center justify-center space-x-2 border transition-all ${
                pickedLiarHash === selectedComp.anon_hash
                  ? 'bg-amber-600 text-white border-amber-400 shadow-lg shadow-amber-600/30'
                  : 'bg-slate-950 text-amber-400 border-amber-800/60 hover:bg-amber-950/40'
              }`}
            >
              <HelpCircle className="w-4 h-4" />
              <span>
                {pickedLiarHash === selectedComp.anon_hash ? 'SUSPECTED LIAR SELECTED' : 'MARK THIS PLAYER AS THE LIAR'}
              </span>
            </button>
          </div>

          {/* Client-Side Bayesian Lie Prior Card */}
          <div className="p-4 rounded-xl bg-purple-950/30 border border-purple-500/20 space-y-3">
            <div className="flex items-center space-x-2 text-purple-300 font-bold text-xs">
              <BrainCircuit className="w-4 h-4 text-purple-400" />
              <span>Bayesian Opponent Prior Model</span>
            </div>
            <p className="text-[11px] text-slate-400">
              Based on past rounds, this opponent's predicted element forgery tendencies:
            </p>
            <div className="grid grid-cols-2 gap-2 text-[10px] font-mono">
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Subject:</span>
                <span className="text-purple-300 font-bold">{Math.round(bayesProbs.subject * 100)}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Palette:</span>
                <span className="text-purple-300 font-bold">{Math.round(bayesProbs.palette * 100)}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Mood:</span>
                <span className="text-purple-300 font-bold">{Math.round(bayesProbs.mood * 100)}%</span>
              </div>
              <div className="p-2 rounded bg-slate-950 border border-slate-800 flex justify-between">
                <span className="text-slate-400">Comp:</span>
                <span className="text-purple-300 font-bold">{Math.round(bayesProbs.comp * 100)}%</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
