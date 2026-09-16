import React, { useState, useEffect } from 'react';
import { CompositionElements } from '../lib/elements';
import { generateForgeryCardPng, generateDetectiveCardPng } from '../lib/forgeryCard';
import { Download, Share2, X, Sparkles, Image as ImageIcon } from 'lucide-react';

interface ForgeryCardModalProps {
  isOpen: boolean;
  onClose: () => void;
  type: 'forgery' | 'detective';
  originalElements: CompositionElements;
  forgedElements: CompositionElements;
  fooledCount?: number;
  totalVoters?: number;
  detectedCount?: number;
  totalLiars?: number;
  eyeXpGained?: number;
  pseudonym: string;
  theme: string;
}

export const ForgeryCardModal: React.FC<ForgeryCardModalProps> = ({
  isOpen,
  onClose,
  type,
  originalElements,
  forgedElements,
  fooledCount = 6,
  totalVoters = 8,
  detectedCount = 3,
  totalLiars = 4,
  eyeXpGained = 120,
  pseudonym,
  theme,
}) => {
  const [pngDataUrl, setPngDataUrl] = useState<string>('');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (isOpen) {
      setLoading(true);
      if (type === 'forgery') {
        generateForgeryCardPng({
          originalElements,
          forgedElements,
          fooledCount,
          totalVoters,
          pseudonym,
          theme,
        }).then(url => {
          setPngDataUrl(url);
          setLoading(false);
        });
      } else {
        generateDetectiveCardPng({
          detectedCount,
          totalLiars,
          pseudonym,
          eyeXpGained,
          theme,
        }).then(url => {
          setPngDataUrl(url);
          setLoading(false);
        });
      }
    }
  }, [isOpen, type, originalElements, forgedElements, fooledCount, totalVoters, detectedCount, totalLiars, eyeXpGained, pseudonym, theme]);

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 bg-black/80 backdrop-blur-md flex items-center justify-center p-4">
      <div className="bg-slate-900 border border-purple-500/40 rounded-2xl max-w-lg w-full p-6 space-y-4 shadow-2xl relative">
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1.5 rounded-lg bg-slate-800 text-slate-400 hover:text-white"
        >
          <X className="w-5 h-5" />
        </button>

        <div className="flex items-center space-x-2 text-purple-400 font-bold">
          <Sparkles className="w-5 h-5 text-purple-400" />
          <h3 className="text-lg">
            {type === 'forgery' ? 'Export Viral Forgery Card' : 'Export Detective Flex Card'}
          </h3>
        </div>

        <p className="text-xs text-slate-300">
          High-resolution 1080×1350 PNG optimized for sharing on Twitter, ArtStation, Tumblr, and Discord.
        </p>

        {/* Image Preview Container */}
        <div className="w-full aspect-[4/5] bg-slate-950 rounded-xl overflow-hidden border border-slate-800 flex items-center justify-center relative">
          {loading ? (
            <div className="text-center space-y-2">
              <div className="w-8 h-8 rounded-full border-2 border-purple-500 border-t-transparent animate-spin mx-auto"></div>
              <span className="text-xs text-slate-400 font-mono">Rendering 1080x1350 PNG Card...</span>
            </div>
          ) : (
            <img src={pngDataUrl} alt="Export Card" className="w-full h-full object-contain" />
          )}
        </div>

        {/* Action Buttons */}
        <div className="flex items-center space-x-3 pt-2">
          <a
            href={pngDataUrl}
            download={type === 'forgery' ? 'forgery_card.png' : 'detective_card.png'}
            className="flex-1 py-3 px-4 rounded-xl bg-purple-600 hover:bg-purple-500 text-white font-bold text-sm flex items-center justify-center space-x-2 shadow-lg shadow-purple-600/30 transition-all"
          >
            <Download className="w-4 h-4" />
            <span>DOWNLOAD PNG CARD</span>
          </a>
        </div>
      </div>
    </div>
  );
};
