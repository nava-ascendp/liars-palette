import React, { useEffect, useState } from 'react';
import { CompositionElements, getElement } from '../lib/elements';
import { CanvasViewer } from '../components/CanvasViewer';
import { MuralGrid, MuralTile } from '../components/MuralGrid';
import { AdBanner } from '../components/AdBanner';
import { Flame, Sparkles, Clock, ArrowRight, Eye, Brush, Trophy, Users, ShieldAlert } from 'lucide-react';

interface HomeProps {
  setActiveTab: (tab: string) => void;
  playerStats?: any;
}

export const Home: React.FC<HomeProps> = ({ setActiveTab, playerStats }) => {
  const [todayData, setTodayData] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    fetch('/api/canvases/today')
      .then((res) => res.json())
      .then((data) => {
        setTodayData(data);
        setLoading(false);
      })
      .catch(() => setLoading(false));
  }, []);

  const defaultElements: CompositionElements = todayData?.elementSet || {
    subject: 'subj-1',
    palette: 'pal-1',
    mood: 'mood-1',
    comp: 'comp-1',
  };

  const muralTiles: MuralTile[] = Array.from({ length: 14 }).map((_, i) => {
    const d = new Date(Date.now() - (13 - i) * 86400_000).toISOString().slice(0, 10);
    if (i === 4 || i === 8) {
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
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-12">
      {/* Hero Header Banner */}
      <div className="relative rounded-3xl overflow-hidden bg-gradient-to-r from-purple-950 via-slate-900 to-slate-950 border border-purple-500/30 p-8 shadow-2xl">
        <div className="absolute top-0 right-0 w-96 h-96 bg-purple-600/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
          <div className="lg:col-span-7 space-y-5">
            <div className="inline-flex items-center space-x-2 px-3 py-1 rounded-full bg-purple-500/20 text-purple-300 border border-purple-500/40 text-xs font-mono font-bold">
              <Sparkles className="w-3.5 h-3.5" />
              <span>PALETTE OF THE DAY RELEASED AT 10:00 AM</span>
            </div>

            <h1 className="text-4xl sm:text-5xl font-extrabold tracking-tight text-white leading-tight">
              Spot the Lie in <br />
              <span className="bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300">
                Generative Masterpieces
              </span>
            </h1>

            <p className="text-sm sm:text-base text-slate-300 leading-relaxed max-w-2xl">
              Every day, 5–8 players receive the same generative canvas. One player composed the original — the rest swap <span className="text-purple-300 font-bold underline">exactly 1 element</span> to forge a lie. Inspect, vote, and unmask the liar.
            </p>

            <div className="flex flex-wrap gap-4 pt-2">
              <button
                onClick={() => setActiveTab('compose')}
                className="py-3.5 px-6 rounded-xl bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white font-bold text-sm flex items-center space-x-2 shadow-xl shadow-purple-600/30 transition-all hover:scale-[1.02]"
              >
                <Brush className="w-4 h-4" />
                <span>FORGE TODAY'S CANVAS</span>
                <ArrowRight className="w-4 h-4" />
              </button>

              <button
                onClick={() => setActiveTab('detective')}
                className="py-3.5 px-6 rounded-xl bg-slate-900 hover:bg-slate-800 text-slate-200 border border-slate-700 font-bold text-sm flex items-center space-x-2 transition-all"
              >
                <Eye className="w-4 h-4 text-cyan-400" />
                <span>ENTER DETECTIVE ROOM</span>
              </button>
            </div>
          </div>

          {/* Canvas Preview Card */}
          <div className="lg:col-span-5">
            <CanvasViewer
              elements={defaultElements}
              title="TODAY'S PROMPT CANVAS"
              subtitle={todayData?.isMasterwork ? '★ MASTERWORK DROP (5x XP)' : 'Daily Deterministic Canvas'}
            />
          </div>
        </div>
      </div>

      {/* 320x50 Adsterra Mobile Leaderboard Banner */}
      <AdBanner type="320x50" />

      {/* Live Activity & Social Proof Counter */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-400 font-mono uppercase">Detecting Liars</span>
          <span className="block text-2xl font-extrabold text-cyan-400 font-mono">3,891 Active</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-400 font-mono uppercase">Forgeries Submitted</span>
          <span className="block text-2xl font-extrabold text-pink-400 font-mono">894 Today</span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-400 font-mono uppercase">Truth Tier Drop</span>
          <span className="block text-2xl font-extrabold text-amber-400 font-mono">
            {todayData?.isMasterwork ? '5x Masterwork' : 'Standard'}
          </span>
        </div>
        <div className="p-4 rounded-2xl bg-slate-900/80 border border-slate-800 text-center space-y-1">
          <span className="text-xs text-slate-400 font-mono uppercase">Round Ends In</span>
          <span className="block text-2xl font-extrabold text-purple-400 font-mono">05h 42m</span>
        </div>
      </div>

      {/* Adsterra Native Banner */}
      <AdBanner type="native" />

      {/* Public Mural Streak Preview Section */}
      <div className="space-y-4">
        <h2 className="text-xl font-extrabold text-white flex items-center space-x-2">
          <Flame className="w-5 h-5 text-amber-400 fill-amber-400" />
          <span>Your Public Mural Streak</span>
        </h2>
        <MuralGrid tiles={muralTiles} streakDays={playerStats?.streakDays || 5} />
      </div>
    </div>
  );
};
