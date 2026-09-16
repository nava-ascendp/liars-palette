import React, { useEffect, useState } from 'react';
import { TruthLieVote, CompositionItem } from '../components/TruthLieVote';
import { getAnonId } from '../lib/anonId';
import { updateLiePrior } from '../lib/lieDetector';
import { Eye, ShieldAlert, ArrowRight, CheckCircle2 } from 'lucide-react';

interface DetectiveProps {
  setActiveTab: (tab: string) => void;
}

export const Detective: React.FC<DetectiveProps> = ({ setActiveTab }) => {
  const [canvasData, setCanvasData] = useState<any>(null);
  const [compositions, setCompositions] = useState<CompositionItem[]>([]);
  const [votedTruthLieMap, setVotedTruthLieMap] = useState<Record<string, 'truth' | 'lie'>>({});
  const [pickedLiarHash, setPickedLiarHash] = useState<string>('');

  useEffect(() => {
    // Fetch yesterday's voting canvas or fallback
    fetch('/api/canvases/DAY-today')
      .then((res) => res.json())
      .then((data) => {
        setCanvasData(data.canvas);
        if (data.compositions && data.compositions.length > 0) {
          setCompositions(data.compositions);
        } else {
          // Demo fallback compositions
          setCompositions([
            { id: 'comp-1', anon_hash: 'user_master_1', element_subject: 'subj-1', element_palette: 'pal-1', element_mood: 'mood-1', element_comp: 'comp-1', vote_count: 4 },
            { id: 'comp-2', anon_hash: 'user_forger_2', element_subject: 'subj-1', element_palette: 'pal-4', element_mood: 'mood-1', element_comp: 'comp-1', vote_count: 2 },
            { id: 'comp-3', anon_hash: 'user_detective_3', element_subject: 'subj-3', element_palette: 'pal-1', element_mood: 'mood-1', element_comp: 'comp-1', vote_count: 3 },
          ]);
        }
      })
      .catch(() => {
        setCompositions([
          { id: 'comp-1', anon_hash: 'user_master_1', element_subject: 'subj-1', element_palette: 'pal-1', element_mood: 'mood-1', element_comp: 'comp-1', vote_count: 4 },
          { id: 'comp-2', anon_hash: 'user_forger_2', element_subject: 'subj-1', element_palette: 'pal-4', element_mood: 'mood-1', element_comp: 'comp-1', vote_count: 2 },
          { id: 'comp-3', anon_hash: 'user_detective_3', element_subject: 'subj-3', element_palette: 'pal-1', element_mood: 'mood-1', element_comp: 'comp-1', vote_count: 3 },
        ]);
      });
  }, []);

  const handleVoteTruthLie = async (compId: string, vote: 'truth' | 'lie') => {
    setVotedTruthLieMap((prev) => ({ ...prev, [compId]: vote }));
    const voterHash = getAnonId();

    try {
      await fetch(`/api/canvases/${canvasData?.id || 'DAY-today'}/vote-truth`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterHash, compositionId: compId, vote }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  const handlePickLiar = async (pickedHash: string) => {
    setPickedLiarHash(pickedHash);
    const voterHash = getAnonId();

    // Update Bayesian prior model
    updateLiePrior(pickedHash, 'Anonymous Opponent', 'palette');

    try {
      await fetch(`/api/canvases/${canvasData?.id || 'DAY-today'}/vote-liar`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ voterHash, pickedHash }),
      });
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Eye className="w-4 h-4" />
            <span>DETECTIVE VOTING ROOM</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Unmask the Liar & Spot Forgeries</h1>
        </div>

        <button
          onClick={() => setActiveTab('reveal')}
          className="py-3 px-5 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-2 shadow-lg shadow-purple-600/30 transition-all"
        >
          <span>FINALIZE VOTES & SEE REVEAL</span>
          <ArrowRight className="w-4 h-4" />
        </button>
      </div>

      {/* Interactive Voting Grid */}
      <TruthLieVote
        compositions={compositions}
        onVoteTruthLie={handleVoteTruthLie}
        onPickLiar={handlePickLiar}
        votedTruthLieMap={votedTruthLieMap}
        pickedLiarHash={pickedLiarHash}
      />
    </div>
  );
};
