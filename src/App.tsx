import React, { useState, useEffect } from 'react';
import { Navbar } from './components/Navbar';
import { Home } from './pages/Home';
import { Compose } from './pages/Compose';
import { Detective } from './pages/Detective';
import { Reveal } from './pages/Reveal';
import { Gallery } from './pages/Gallery';
import { Profile } from './pages/Profile';
import { Studio } from './pages/Studio';
import { SalonSim } from './pages/SalonSim';
import { getAnonId } from './lib/anonId';

export function App() {
  const [activeTab, setActiveTab] = useState<string>('home');
  const [playerStats, setPlayerStats] = useState<any>({
    brushXp: 320,
    eyeXp: 450,
    handXp: 290,
    streakDays: 7,
    paletteTokens: 8,
  });

  const anonHash = getAnonId();

  useEffect(() => {
    fetch(`/api/players/${anonHash}`)
      .then((res) => res.json())
      .then((data) => {
        if (data.player) {
          setPlayerStats({
            brushXp: data.player.brush_xp,
            eyeXp: data.player.eye_xp,
            handXp: data.player.hand_xp,
            streakDays: data.player.streak_days,
            paletteTokens: data.player.palette_tokens,
          });
        }
      })
      .catch(() => {});
  }, [anonHash]);

  return (
    <div className="min-h-screen bg-[#0B0D17] text-slate-100 flex flex-col font-sans">
      <Navbar activeTab={activeTab} setActiveTab={setActiveTab} playerStats={playerStats} />

      <main className="flex-1 pb-16">
        {activeTab === 'home' && <Home setActiveTab={setActiveTab} playerStats={playerStats} />}
        {activeTab === 'compose' && <Compose setActiveTab={setActiveTab} />}
        {activeTab === 'detective' && <Detective setActiveTab={setActiveTab} />}
        {activeTab === 'reveal' && <Reveal setActiveTab={setActiveTab} />}
        {activeTab === 'gallery' && <Gallery />}
        {activeTab === 'profile' && <Profile />}
        {activeTab === 'studio' && <Studio />}
        {activeTab === 'salon' && <SalonSim />}
      </main>

      {/* Footer */}
      <footer className="border-t border-slate-800/80 bg-slate-950/80 py-6 text-center text-xs font-mono text-slate-500">
        <div className="max-w-7xl mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <span>LIAR'S PALETTE © 2026 — Generative Art Lie Detection</span>
          <div className="flex items-center space-x-4">
            <span className="text-purple-400 font-bold">Client-Side WebGL / SVG Engine</span>
            <span>·</span>
            <span>Supabase Free Feasibility</span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
