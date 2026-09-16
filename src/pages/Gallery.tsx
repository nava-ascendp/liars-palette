import React, { useEffect, useState } from 'react';
import { CompositionElements } from '../lib/elements';
import { CanvasViewer } from '../components/CanvasViewer';
import { Layers, Sparkles, Flame, Eye, ThumbsUp } from 'lucide-react';

export const Gallery: React.FC = () => {
  const [galleryItems, setGalleryItems] = useState<any[]>([]);

  useEffect(() => {
    fetch('/api/gallery')
      .then((res) => res.json())
      .then((data) => setGalleryItems(data.gallery || []))
      .catch(() => {});
  }, []);

  // Demo fallback items
  const displayItems = galleryItems.length > 0 ? galleryItems : [
    {
      id: 'g-1',
      pseudo: 'Cipher Artisan',
      day: '2026-09-14',
      vote_count: 8,
      lie_label: 'palette',
      element_subject: 'subj-1',
      element_palette: 'pal-4',
      element_mood: 'mood-1',
      element_comp: 'comp-1',
    },
    {
      id: 'g-2',
      pseudo: 'Neon Weaver',
      day: '2026-09-14',
      vote_count: 6,
      lie_label: 'subject',
      element_subject: 'subj-3',
      element_palette: 'pal-1',
      element_mood: 'mood-1',
      element_comp: 'comp-1',
    },
    {
      id: 'g-3',
      pseudo: 'Prismatic Oracle',
      day: '2026-09-13',
      vote_count: 5,
      lie_label: 'mood',
      element_subject: 'subj-2',
      element_palette: 'pal-2',
      element_mood: 'mood-4',
      element_comp: 'comp-2',
    },
  ];

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold mb-1">
            <Layers className="w-4 h-4" />
            <span>PUBLIC FORGERY FEED</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Today's Best Forgeries</h1>
        </div>
        <div className="text-right font-mono text-xs text-purple-300 font-bold">
          <span>🔍 3,891 DETECTING · 894 FORGING</span>
        </div>
      </div>

      {/* Grid of Top Forgeries */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {displayItems.map((item) => {
          const elements: CompositionElements = {
            subject: item.element_subject,
            palette: item.element_palette,
            mood: item.element_mood,
            comp: item.element_comp,
          };

          return (
            <div key={item.id} className="p-4 rounded-2xl bg-slate-900 border border-slate-800 space-y-3 shadow-xl">
              <CanvasViewer
                elements={elements}
                showBadges={true}
                lieLabel={item.lie_label}
              />

              <div className="flex items-center justify-between pt-2 border-t border-slate-800/80">
                <div>
                  <span className="text-xs font-bold text-slate-100">{item.pseudo}</span>
                  <span className="block text-[10px] text-slate-500 font-mono">{item.day}</span>
                </div>

                <div className="flex items-center space-x-1.5 px-3 py-1 rounded-lg bg-purple-950/60 border border-purple-500/30 text-purple-300 text-xs font-mono font-bold">
                  <ThumbsUp className="w-3.5 h-3.5" />
                  <span>Fooled {item.vote_count} Voters</span>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
