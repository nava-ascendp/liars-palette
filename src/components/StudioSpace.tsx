import React, { useState } from 'react';
import { Sparkles, Plus, Lock, Users, Code, Copy, Check } from 'lucide-react';

interface StudioItem {
  id: string;
  name: string;
  owner_hash: string;
  pseudo?: string;
  prompt_seeds: string;
  created_at: number;
}

interface StudioSpaceProps {
  studios: StudioItem[];
  streakDays: number;
  onCreateStudio: (name: string, seeds: string[]) => void;
}

export const StudioSpace: React.FC<StudioSpaceProps> = ({ studios, streakDays, onCreateStudio }) => {
  const isUnlocked = streakDays >= 7;
  const [newStudioName, setNewStudioName] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const handleCreate = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newStudioName.trim()) return;
    onCreateStudio(newStudioName.trim(), ['seed-custom-1', 'seed-custom-2']);
    setNewStudioName('');
  };

  const handleCopy = (id: string) => {
    navigator.clipboard.writeText(window.location.origin + `?studio=${id}`);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Unlock Status Banner */}
      <div className={`p-5 rounded-2xl border flex items-center justify-between shadow-xl ${
        isUnlocked
          ? 'bg-gradient-to-r from-purple-950/60 via-slate-900 to-slate-900 border-purple-500/50'
          : 'bg-slate-900/60 border-slate-800'
      }`}>
        <div className="flex items-center space-x-4">
          <div className={`w-12 h-12 rounded-xl flex items-center justify-center ${
            isUnlocked ? 'bg-purple-500/20 text-purple-400 border border-purple-500/40' : 'bg-slate-800 text-slate-500'
          }`}>
            {isUnlocked ? <Sparkles className="w-6 h-6" /> : <Lock className="w-6 h-6" />}
          </div>
          <div>
            <div className="flex items-center space-x-2">
              <h3 className="text-base font-bold text-slate-100">STUDIO SPACE</h3>
              {isUnlocked ? (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono font-bold bg-purple-500/20 text-purple-300 border border-purple-500/40">
                  UNLOCKED
                </span>
              ) : (
                <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-slate-800 text-slate-400">
                  REQUIRES 7-DAY STREAK ({streakDays}/7)
                </span>
              )}
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Persistent room where your top forgeries become permanent prompt seeds for your community.
            </p>
          </div>
        </div>
      </div>

      {/* Studio Creation Form */}
      {isUnlocked && (
        <form onSubmit={handleCreate} className="p-4 rounded-xl bg-slate-900 border border-slate-800 flex gap-3">
          <input
            type="text"
            placeholder="Studio Room Name (e.g., Cybernetic Atelier)..."
            value={newStudioName}
            onChange={(e) => setNewStudioName(e.target.value)}
            className="flex-1 bg-slate-950 border border-slate-800 rounded-lg px-3.5 py-2 text-sm text-slate-100 focus:outline-none focus:border-purple-500"
          />
          <button
            type="submit"
            className="px-4 py-2 rounded-lg bg-purple-600 hover:bg-purple-500 text-white font-bold text-xs flex items-center space-x-1.5 shadow-md shadow-purple-600/20"
          >
            <Plus className="w-4 h-4" />
            <span>CREATE STUDIO</span>
          </button>
        </form>
      )}

      {/* Active Studios List */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {studios.map((studio) => {
          let seeds: string[] = [];
          try {
            seeds = JSON.parse(studio.prompt_seeds);
          } catch {
            seeds = [];
          }

          return (
            <div key={studio.id} className="p-5 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-lg">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-purple-300">{studio.name}</h4>
                <button
                  onClick={() => handleCopy(studio.id)}
                  className="p-1.5 rounded bg-slate-800 text-slate-400 hover:text-white text-xs"
                  title="Copy Studio Invite URL"
                >
                  {copiedId === studio.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>

              <div className="text-xs text-slate-400">
                Created by <span className="text-slate-200 font-mono">{studio.pseudo || studio.owner_hash.slice(0, 10)}</span>
              </div>

              <div className="pt-2 border-t border-slate-800">
                <span className="text-[10px] uppercase font-mono text-slate-500 block mb-1">Studio Prompt Seeds ({seeds.length})</span>
                <div className="flex flex-wrap gap-1">
                  {seeds.map((s, i) => (
                    <span key={i} className="px-2 py-0.5 rounded bg-slate-950 text-[10px] font-mono text-slate-300 border border-slate-800">
                      {s}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
