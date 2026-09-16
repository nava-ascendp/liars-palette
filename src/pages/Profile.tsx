import React, { useEffect, useState } from 'react';
import { getAnonId, getPseudonym } from '../lib/anonId';
import { getPlayerTier, TIERS } from '../lib/tiers';
import { MuralGrid, MuralTile } from '../components/MuralGrid';
import { Trophy, Brush, Eye, Flame, Sparkles, Award, Lock, Check } from 'lucide-react';

export const Profile: React.FC = () => {
  const anonHash = getAnonId();
  const pseudo = getPseudonym();
  const [profileData, setProfileData] = useState<any>(null);

  useEffect(() => {
    fetch(`/api/players/${anonHash}`)
      .then((res) => res.json())
      .then((data) => setProfileData(data))
      .catch(() => {});
  }, [anonHash]);

  const p = profileData?.player || {
    brush_xp: 320,
    eye_xp: 450,
    hand_xp: 290,
    streak_days: 7,
    best_streak: 12,
    palette_tokens: 8,
  };

  const totalRounds = Math.floor((p.brush_xp + p.eye_xp + p.hand_xp) / 50);
  const currentTier = getPlayerTier(totalRounds, p.streak_days);

  // Demo mural tiles
  const muralTiles: MuralTile[] = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400_000).toISOString().slice(0, 10);
    if (i === 3) {
      return { day: d, isCompleted: false, isBrokenStreakSlot: true };
    }
    if (i < 12) {
      return {
        day: d,
        isCompleted: true,
        composition: {
          element_subject: 'subj-1',
          element_palette: 'pal-1',
          element_mood: 'mood-1',
          element_comp: 'comp-1',
          lie_label: i % 2 === 0 ? 'palette' : 'subject',
        },
      };
    }
    return { day: d, isCompleted: false };
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-10">
      {/* Profile Header */}
      <div className="p-8 rounded-3xl bg-gradient-to-r from-slate-900 via-purple-950/40 to-slate-950 border border-slate-800 shadow-2xl flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
        <div className="flex items-center space-x-5">
          <div className="w-20 h-20 rounded-2xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-1 shadow-xl shadow-purple-500/20">
            <div className="w-full h-full bg-[#0B0D17] rounded-xl flex items-center justify-center">
              <Trophy className="w-10 h-10 text-purple-400" />
            </div>
          </div>

          <div className="space-y-1">
            <div className="flex items-center space-x-3">
              <h1 className="text-2xl font-extrabold text-white">{pseudo}</h1>
              <span className={`px-3 py-1 rounded-full text-xs font-mono font-bold border ${currentTier.badgeColor}`}>
                {currentTier.name.toUpperCase()} TIER
              </span>
            </div>
            <p className="text-xs text-slate-400 font-mono">
              ANONYMOUS ID: {anonHash.slice(0, 16)}...
            </p>
          </div>
        </div>

        {/* Tokens & Streak stats */}
        <div className="flex items-center space-x-4 bg-slate-950/80 p-4 rounded-2xl border border-slate-800">
          <div className="text-center px-3">
            <span className="text-xs text-slate-400 font-mono uppercase block">Palette Tokens</span>
            <span className="text-xl font-extrabold text-purple-400 font-mono">{p.palette_tokens}</span>
          </div>
          <div className="h-8 w-px bg-slate-800"></div>
          <div className="text-center px-3">
            <span className="text-xs text-slate-400 font-mono uppercase block">Active Streak</span>
            <span className="text-xl font-extrabold text-amber-400 font-mono">{p.streak_days} Days</span>
          </div>
        </div>
      </div>

      {/* 3-Axis Progression Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-purple-400">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <Brush className="w-4 h-4" />
              <span>Brush XP (Composition)</span>
            </div>
            <span className="font-mono text-xs font-bold">{p.brush_xp} XP</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
            <div className="h-full bg-purple-500 rounded-full" style={{ width: `${Math.min(100, (p.brush_xp / 500) * 100)}%` }} />
          </div>
          <p className="text-[11px] text-slate-400">Earned by generating & submitting daily prompt compositions.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-cyan-400">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <Eye className="w-4 h-4" />
              <span>Eye XP (Detection)</span>
            </div>
            <span className="font-mono text-xs font-bold">{p.eye_xp} XP</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
            <div className="h-full bg-cyan-500 rounded-full" style={{ width: `${Math.min(100, (p.eye_xp / 500) * 100)}%` }} />
          </div>
          <p className="text-[11px] text-slate-400">Earned by correctly identifying lies & unmasking original author.</p>
        </div>

        <div className="p-6 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
          <div className="flex items-center justify-between text-pink-400">
            <div className="flex items-center space-x-2 font-bold text-sm">
              <Sparkles className="w-4 h-4" />
              <span>Hand XP (Deception)</span>
            </div>
            <span className="font-mono text-xs font-bold">{p.hand_xp} XP</span>
          </div>
          <div className="w-full h-2 rounded-full bg-slate-950 overflow-hidden">
            <div className="h-full bg-pink-500 rounded-full" style={{ width: `${Math.min(100, (p.hand_xp / 500) * 100)}%` }} />
          </div>
          <p className="text-[11px] text-slate-400">Earned when voters fail to spot your fabricated lie (&lt;30% detected).</p>
        </div>
      </div>

      {/* Progression Tier Unlock Ladder */}
      <div className="p-6 rounded-3xl bg-slate-900 border border-slate-800 space-y-4 shadow-xl">
        <h3 className="text-lg font-bold text-white">Progression Tier Unlocks</h3>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-3">
          {TIERS.map((tier) => {
            const isUnlocked = totalRounds >= tier.roundsRequired || p.streak_days >= tier.streakRequired;
            return (
              <div
                key={tier.id}
                className={`p-4 rounded-xl border text-left space-y-2 transition-all ${
                  isUnlocked
                    ? 'bg-slate-950 border-purple-500/50 shadow-md'
                    : 'bg-slate-950/40 border-slate-900 opacity-60'
                }`}
              >
                <div className="flex items-center justify-between">
                  <span className="font-bold text-xs text-slate-200">{tier.name}</span>
                  {isUnlocked ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Lock className="w-3.5 h-3.5 text-slate-600" />}
                </div>
                <p className="text-[10px] text-slate-400">{tier.unlocks}</p>
              </div>
            );
          })}
        </div>
      </div>

      {/* Mural Grid Section */}
      <div className="space-y-4">
        <h3 className="text-xl font-extrabold text-white">Public Mural History</h3>
        <MuralGrid tiles={muralTiles} streakDays={p.streak_days} />
      </div>
    </div>
  );
};
