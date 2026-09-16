import React from 'react';
import { getAnonId, getPseudonym } from '../lib/anonId';
import { Palette, Eye, Brush, Flame, Trophy, Sparkles, Users, Layers } from 'lucide-react';

interface NavbarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  playerStats?: {
    brushXp: number;
    eyeXp: number;
    handXp: number;
    streakDays: number;
    paletteTokens: number;
  };
}

export const Navbar: React.FC<NavbarProps> = ({ activeTab, setActiveTab, playerStats }) => {
  const pseudo = getPseudonym();

  const navItems = [
    { id: 'home', label: 'Today', icon: Flame },
    { id: 'compose', label: 'Compose', icon: Brush },
    { id: 'detective', label: 'Detective', icon: Eye },
    { id: 'gallery', label: 'Gallery', icon: Layers },
    { id: 'salon', label: '8-Player Salon', icon: Users },
    { id: 'profile', label: 'Mural & Stats', icon: Trophy },
  ];

  return (
    <header className="sticky top-0 z-50 backdrop-blur-md bg-[#0B0D17]/85 border-b border-palette-border/60">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 h-16 flex items-center justify-between">
        {/* Brand Logo */}
        <div
          onClick={() => setActiveTab('home')}
          className="flex items-center space-x-3 cursor-pointer group"
        >
          <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-purple-600 via-pink-500 to-cyan-400 p-0.5 shadow-lg shadow-purple-500/20 group-hover:scale-105 transition-transform">
            <div className="w-full h-full bg-[#0B0D17] rounded-[10px] flex items-center justify-center">
              <Palette className="w-5 h-5 text-purple-400 group-hover:rotate-12 transition-transform" />
            </div>
          </div>
          <div>
            <span className="font-extrabold text-lg tracking-tight bg-clip-text text-transparent bg-gradient-to-r from-purple-400 via-pink-400 to-cyan-300">
              LIAR'S PALETTE
            </span>
            <span className="block text-[10px] uppercase font-mono tracking-widest text-slate-400">
              Generative Art Lie Detection
            </span>
          </div>
        </div>

        {/* Navigation Tabs */}
        <nav className="hidden md:flex items-center space-x-1">
          {navItems.map((item) => {
            const Icon = item.icon;
            const isActive = activeTab === item.id;
            return (
              <button
                key={item.id}
                onClick={() => setActiveTab(item.id)}
                className={`flex items-center space-x-2 px-3.5 py-2 rounded-lg text-sm font-medium transition-all ${
                  isActive
                    ? 'bg-purple-600/20 text-purple-300 border border-purple-500/40 shadow-sm shadow-purple-500/10'
                    : 'text-slate-300 hover:text-white hover:bg-slate-800/50'
                }`}
              >
                <Icon className={`w-4 h-4 ${isActive ? 'text-purple-400' : 'text-slate-400'}`} />
                <span>{item.label}</span>
              </button>
            );
          })}
        </nav>

        {/* Right Status Badges */}
        <div className="flex items-center space-x-3">
          {playerStats && (
            <div className="hidden lg:flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-900/80 border border-slate-800 text-xs">
              <div className="flex items-center space-x-1 text-amber-400" title="Mural Streak">
                <Flame className="w-3.5 h-3.5 fill-amber-400" />
                <span className="font-bold">{playerStats.streakDays}d</span>
              </div>
              <span className="text-slate-700">|</span>
              <div className="flex items-center space-x-1 text-purple-400" title="Palette Tokens">
                <Sparkles className="w-3.5 h-3.5" />
                <span className="font-bold">{playerStats.paletteTokens} Tokens</span>
              </div>
            </div>
          )}

          <button
            onClick={() => setActiveTab('profile')}
            className="flex items-center space-x-2 px-3 py-1.5 rounded-lg bg-slate-800/80 hover:bg-slate-700/80 border border-slate-700 text-xs font-mono transition-colors"
          >
            <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></div>
            <span className="font-semibold text-slate-200">{pseudo}</span>
          </button>
        </div>
      </div>
    </header>
  );
};
