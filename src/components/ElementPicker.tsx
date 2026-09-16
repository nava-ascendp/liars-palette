import React from 'react';
import { CompositionElements, SUBJECTS, PALETTES, MOODS, COMPOSITIONS, getElement } from '../lib/elements';
import { Sparkles, AlertCircle, CheckCircle2, Lock } from 'lucide-react';

interface ElementPickerProps {
  originalElements: CompositionElements;
  forgedElements: CompositionElements;
  onChangeElements: (newElements: CompositionElements, modifiedCategory: 'subject' | 'palette' | 'mood' | 'comp') => void;
  activeLieCategory: 'subject' | 'palette' | 'mood' | 'comp';
}

export const ElementPicker: React.FC<ElementPickerProps> = ({
  originalElements,
  forgedElements,
  onChangeElements,
  activeLieCategory,
}) => {
  const categories: { key: 'subject' | 'palette' | 'mood' | 'comp'; label: string; list: any[] }[] = [
    { key: 'subject', label: '1. Subject Element', list: SUBJECTS },
    { key: 'palette', label: '2. Palette Scheme', list: PALETTES },
    { key: 'mood', label: '3. Mood Atmosphere', list: MOODS },
    { key: 'comp', label: '4. Composition Grid', list: COMPOSITIONS },
  ];

  return (
    <div className="space-y-6">
      {/* Rules Notice */}
      <div className="p-4 rounded-xl bg-purple-950/40 border border-purple-500/30 flex items-start space-x-3">
        <Sparkles className="w-5 h-5 text-purple-400 mt-0.5 flex-shrink-0" />
        <div className="text-xs space-y-1">
          <p className="font-bold text-purple-200">FORGERY RULE: SWAP EXACTLY 1 ELEMENT</p>
          <p className="text-slate-300">
            To fabricate a lie, modify <span className="text-purple-300 font-bold underline">only 1</span> of the 4 elements below. The remaining 3 elements must stay identical to the original canvas.
          </p>
        </div>
      </div>

      {/* Category Accordion Pickers */}
      <div className="space-y-4">
        {categories.map((cat) => {
          const isModified = activeLieCategory === cat.key;
          const currentId = forgedElements[cat.key];

          return (
            <div
              key={cat.key}
              className={`p-4 rounded-xl border transition-all ${
                isModified
                  ? 'bg-slate-900/90 border-purple-500/80 shadow-lg shadow-purple-500/10'
                  : 'bg-slate-900/50 border-slate-800'
              }`}
            >
              <div className="flex items-center justify-between mb-3">
                <div className="flex items-center space-x-2">
                  {isModified ? (
                    <span className="w-2.5 h-2.5 rounded-full bg-purple-400 animate-ping"></span>
                  ) : (
                    <Lock className="w-3.5 h-3.5 text-slate-500" />
                  )}
                  <h4 className="text-sm font-bold text-slate-200">{cat.label}</h4>
                </div>
                {isModified ? (
                  <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-purple-500/20 text-purple-300 border border-purple-500/40">
                    FABRICATED LIE
                  </span>
                ) : (
                  <span className="text-[10px] font-mono text-slate-500">SAME AS ORIGINAL</span>
                )}
              </div>

              {/* Options Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-2">
                {cat.list.map((item) => {
                  const isSelected = currentId === item.id;
                  const isOriginalOption = originalElements[cat.key] === item.id;

                  return (
                    <button
                      key={item.id}
                      onClick={() => {
                        const updated = { ...originalElements, [cat.key]: item.id };
                        onChangeElements(updated, cat.key);
                      }}
                      className={`p-2.5 rounded-lg border text-left text-xs transition-all relative ${
                        isSelected
                          ? 'bg-purple-600/30 border-purple-400 text-white font-semibold shadow-md'
                          : 'bg-slate-950/60 border-slate-800/80 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="truncate">{item.name}</span>
                        {isOriginalOption && (
                          <span className="text-[9px] text-slate-500 font-mono" title="Original element">
                            (Orig)
                          </span>
                        )}
                      </div>
                      {item.gradient && (
                        <div className={`h-1.5 w-full rounded-full mt-1.5 bg-gradient-to-r ${item.gradient}`} />
                      )}
                    </button>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
