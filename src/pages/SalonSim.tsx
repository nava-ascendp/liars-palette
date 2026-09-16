import React, { useState } from 'react';
import { Users, Play, CheckCircle2, Sparkles, ShieldAlert, Trophy } from 'lucide-react';
import { CanvasViewer } from '../components/CanvasViewer';

export const SalonSim: React.FC = () => {
  const [loading, setLoading] = useState(false);
  const [salonResult, setSalonResult] = useState<any>(null);

  const handleRunSalonSim = async () => {
    setLoading(true);
    try {
      const res = await fetch('/api/salon/simulate', { method: 'POST' });
      const data = await res.json();
      setSalonResult(data);
    } catch (e) {
      console.error(e);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-cyan-400 font-mono text-xs font-bold mb-1">
            <Users className="w-4 h-4" />
            <span>8-PLAYER SALON SIMULATOR</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Instant 8-Player Match Simulation</h1>
        </div>

        <button
          onClick={handleRunSalonSim}
          disabled={loading}
          className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-sm flex items-center space-x-2 shadow-lg shadow-cyan-600/30 transition-all"
        >
          {loading ? (
            <span>Simulating 8 Players...</span>
          ) : (
            <>
              <Play className="w-4 h-4 fill-white" />
              <span>RUN INSTANT 8-PLAYER MATCH</span>
            </>
          )}
        </button>
      </div>

      {salonResult ? (
        <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-6 shadow-2xl">
          <div className="flex items-center justify-between p-4 rounded-xl bg-emerald-950/40 border border-emerald-500/40">
            <div className="flex items-center space-x-3">
              <CheckCircle2 className="w-6 h-6 text-emerald-400" />
              <div>
                <h3 className="text-sm font-bold text-slate-100">SIMULATION COMPLETE!</h3>
                <p className="text-xs text-slate-400">
                  Canvas ID: <span className="font-mono text-emerald-300 font-bold">{salonResult.canvasId}</span>
                </p>
              </div>
            </div>
            <div className="text-right">
              <span className="text-xs font-mono text-purple-300 font-bold block">Assigned Liar Hash:</span>
              <span className="text-xs font-mono text-slate-400">{salonResult.liarHash}</span>
            </div>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            {Array.from({ length: 8 }).map((_, i) => (
              <div key={i} className="p-3 rounded-xl bg-slate-950 border border-slate-800 space-y-2 text-center">
                <span className="text-xs font-mono font-bold text-slate-300">Bot Agent #{i + 1}</span>
                <div className="w-full aspect-square rounded-lg bg-slate-900 border border-slate-800 overflow-hidden">
                  <CanvasViewer
                    elements={{
                      subject: 'subj-1',
                      palette: i === 0 ? 'pal-1' : 'pal-2',
                      mood: 'mood-1',
                      comp: 'comp-1',
                    }}
                    showBadges={false}
                  />
                </div>
                <span className="text-[10px] font-mono text-purple-400 block">
                  {i === 0 ? '★ TRUE ORIGINAL' : 'SWAPPED PALETTE'}
                </span>
              </div>
            ))}
          </div>
        </div>
      ) : (
        <div className="p-12 rounded-3xl bg-slate-900/60 border border-dashed border-slate-800 text-center space-y-4">
          <Users className="w-12 h-12 text-slate-600 mx-auto" />
          <h3 className="text-lg font-bold text-slate-300">No Salon Simulation Active</h3>
          <p className="text-xs text-slate-500 max-w-md mx-auto">
            Click "RUN INSTANT 8-PLAYER MATCH" to launch an automated 8-player bot match that generates forgeries, casts votes, and tallies liar detection scores in under 30 seconds.
          </p>
        </div>
      )}
    </div>
  );
};
