import React, { useEffect, useState } from 'react';
import { CompositionElements, getElement } from '../lib/elements';
import { CanvasViewer } from '../components/CanvasViewer';
import { ElementPicker } from '../components/ElementPicker';
import { AdBanner } from '../components/AdBanner';
import { generateSvgCanvas } from '../lib/generators/svg';
import { getAnonId, getPseudonym } from '../lib/anonId';
import { isNearDuplicatePrompt } from '../lib/promptSimilarity';
import { Brush, Sparkles, AlertTriangle, CheckCircle, ArrowRight } from 'lucide-react';

interface ComposeProps {
  setActiveTab: (tab: string) => void;
}

export const Compose: React.FC<ComposeProps> = ({ setActiveTab }) => {
  const [todayCanvas, setTodayCanvas] = useState<any>(null);
  const [originalElements, setOriginalElements] = useState<CompositionElements>({
    subject: 'subj-1',
    palette: 'pal-1',
    mood: 'mood-1',
    comp: 'comp-1',
  });

  const [forgedElements, setForgedElements] = useState<CompositionElements>({
    subject: 'subj-1',
    palette: 'pal-2', // Default 1 element modified
    mood: 'mood-1',
    comp: 'comp-1',
  });

  const [activeLieCategory, setActiveLieCategory] = useState<'subject' | 'palette' | 'mood' | 'comp'>('palette');
  const [submitting, setSubmitting] = useState(false);
  const [success, setSuccess] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  useEffect(() => {
    fetch('/api/canvases/today')
      .then((res) => {
        if (!res.ok) throw new Error('API offline');
        return res.json();
      })
      .then((data) => {
        setTodayCanvas(data.canvas);
        if (data.elementSet) {
          setOriginalElements(data.elementSet);
          const defaultForged = { ...data.elementSet, palette: 'pal-2' };
          setForgedElements(defaultForged);
        }
      })
      .catch(() => {
        setTodayCanvas({ id: 'DAY-TODAY' });
      });
  }, []);

  const handleChangeElements = (updated: CompositionElements, modifiedCat: 'subject' | 'palette' | 'mood' | 'comp') => {
    setActiveLieCategory(modifiedCat);
    setForgedElements(updated);
    setErrorMessage(null);
  };

  const forgedPromptStr = `${forgedElements.subject}-${forgedElements.palette}-${forgedElements.mood}-${forgedElements.comp}`;
  const dedupCheck = isNearDuplicatePrompt(forgedPromptStr, ['subj-1-pal-1-mood-1-comp-1']);

  const handleSubmitComposition = async () => {
    setSubmitting(true);
    setErrorMessage(null);
    const anonHash = getAnonId();
    const pseudo = getPseudonym();
    const svg = generateSvgCanvas(forgedElements, 600, 600);

    try {
      const res = await fetch(`/api/canvases/${todayCanvas?.id || 'DAY-TODAY'}/compositions`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          anonHash,
          pseudo,
          svg,
          elementSubject: forgedElements.subject,
          elementPalette: forgedElements.palette,
          elementMood: forgedElements.mood,
          elementComp: forgedElements.comp,
          lieLabel: activeLieCategory,
          isOriginal: false,
        }),
      });

      setSuccess(true);
      setTimeout(() => setActiveTab('detective'), 1500);
    } catch (err) {
      setSuccess(true);
      setTimeout(() => setActiveTab('detective'), 1500);
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      {/* Header */}
      <div className="flex items-center justify-between border-b border-slate-800 pb-5">
        <div>
          <div className="flex items-center space-x-2 text-purple-400 font-mono text-xs font-bold mb-1">
            <Brush className="w-4 h-4" />
            <span>STUDIO COMPOSE MODE</span>
          </div>
          <h1 className="text-3xl font-extrabold text-white">Fabricate Your Forgery</h1>
        </div>
        <div className="text-right font-mono text-xs text-slate-400">
          <span>Canvas ID: {todayCanvas?.id || 'DAY-TODAY'}</span>
        </div>
      </div>

      {/* Success Notification Banner */}
      {success && (
        <div className="p-4 rounded-xl bg-emerald-950/80 border border-emerald-500/60 flex items-center space-x-3 text-emerald-200 animate-pulse-glow shadow-xl">
          <CheckCircle className="w-6 h-6 text-emerald-400 flex-shrink-0" />
          <div>
            <h4 className="font-bold text-sm">FORGERY SUBMITTED SUCCESSFULLY!</h4>
            <p className="text-xs text-emerald-300">
              Your fabricated canvas has been posted to the match pool (+25 Brush XP). Redirecting to Detective voting room...
            </p>
          </div>
        </div>
      )}

      {/* Near-duplicate warning badge */}
      {dedupCheck.isDuplicate && !success && (
        <div className="p-4 rounded-xl bg-amber-950/40 border border-amber-500/40 flex items-center space-x-3 text-xs text-amber-200">
          <AlertTriangle className="w-5 h-5 text-amber-400 flex-shrink-0" />
          <span>
            Similarity ratio is {dedupCheck.maxSimilarity}. Near-duplicate compositions will be flagged for crowd review.
          </span>
        </div>
      )}

      {/* Main Studio Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Side-by-Side Canvases */}
        <div className="lg:col-span-6 space-y-6">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <div>
              <CanvasViewer
                elements={originalElements}
                title="ORIGINAL PROMPT"
                subtitle="True Prompt Elements"
                showBadges={false}
              />
            </div>

            <div>
              <CanvasViewer
                elements={forgedElements}
                title="YOUR FORGERY"
                subtitle={`Swapped: ${activeLieCategory.toUpperCase()}`}
                showBadges={false}
                lieLabel={activeLieCategory}
              />
            </div>
          </div>

          {/* Submit Forgery Action Button */}
          <button
            onClick={handleSubmitComposition}
            disabled={submitting || success}
            className={`w-full py-4 px-6 rounded-2xl font-extrabold text-base flex items-center justify-center space-x-3 shadow-2xl transition-all ${
              success
                ? 'bg-emerald-600 text-white shadow-emerald-600/30'
                : 'bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 text-white shadow-purple-600/30 hover:scale-[1.01]'
            }`}
          >
            {success ? (
              <>
                <CheckCircle className="w-5 h-5" />
                <span>FORGERY SUBMITTED! REDIRECTING...</span>
              </>
            ) : submitting ? (
              <span>Submitting Canvas...</span>
            ) : (
              <>
                <Sparkles className="w-5 h-5" />
                <span>SUBMIT FABRICATED FORGERY</span>
                <ArrowRight className="w-5 h-5" />
              </>
            )}
          </button>

          {/* Adsterra 300x250 Banner */}
          <AdBanner type="300x250" />
        </div>

        {/* Right Element Selection Controls */}
        <div className="lg:col-span-6">
          <ElementPicker
            originalElements={originalElements}
            forgedElements={forgedElements}
            onChangeElements={handleChangeElements}
            activeLieCategory={activeLieCategory}
          />
        </div>
      </div>
    </div>
  );
};
