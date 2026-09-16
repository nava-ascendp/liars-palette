import React, { useEffect, useState } from 'react';
import { StudioSpace } from '../components/StudioSpace';
import { getAnonId } from '../lib/anonId';
import { Sparkles } from 'lucide-react';

export const Studio: React.FC = () => {
  const [studios, setStudios] = useState<any[]>([]);
  const anonHash = getAnonId();

  useEffect(() => {
    fetch('/api/studios')
      .then((res) => res.json())
      .then((data) => setStudios(data.studios || []))
      .catch(() => {});
  }, []);

  const handleCreateStudio = async (name: string, promptSeeds: string[]) => {
    try {
      const res = await fetch('/api/studios', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          ownerHash: anonHash,
          name,
          promptSeeds,
        }),
      });
      if (res.ok) {
        fetch('/api/studios')
          .then((r) => r.json())
          .then((data) => setStudios(data.studios || []));
      }
    } catch (e) {
      console.error(e);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="border-b border-slate-800 pb-5">
        <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold mb-1">
          <Sparkles className="w-4 h-4" />
          <span>7-DAY STREAK UNLOCK</span>
        </div>
        <h1 className="text-3xl font-extrabold text-white">Community Studio Rooms</h1>
        <p className="text-xs text-slate-400 mt-1">
          Studio Spaces allow high-streak creators to publish persistent creative prompt seeds and share private forgery rooms.
        </p>
      </div>

      <StudioSpace studios={studios} streakDays={7} onCreateStudio={handleCreateStudio} />
    </div>
  );
};
