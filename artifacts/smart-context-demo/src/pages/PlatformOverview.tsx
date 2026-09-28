import { AnimatePresence, motion, useReducedMotion } from 'framer-motion';
import { ArrowLeft, Play, RotateCcw } from 'lucide-react';
import { useCallback, useEffect, useRef, useState } from 'react';
import { Link } from 'wouter';
import { PlatformScene, STORY_TIMING } from '../components/PlatformScenes';
import { BrandLogo } from '../components/BrandLogo';

const SCENE_COUNT = 6;

function startsInAutoplay() {
  return new URLSearchParams(window.location.search).get('autoplay') === '1';
}

export function PlatformOverview() {
  const autoplayOnLoad = useRef(startsInAutoplay()).current;
  const [presentationMode, setPresentationMode] = useState(autoplayOnLoad);
  const [playing, setPlaying] = useState(autoplayOnLoad);
  const [activeScene, setActiveScene] = useState(0);
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const reduceMotion = useReducedMotion() ?? false;

  const startPresentation = useCallback((fromScene = 0) => {
    setActiveScene(fromScene >= SCENE_COUNT - 1 ? 0 : fromScene);
    setPresentationMode(true);
    setPlaying(true);
  }, []);

  useEffect(() => {
    if (!playing) return;
    const timer = window.setTimeout(() => {
      if (activeScene >= SCENE_COUNT - 1) {
        setPlaying(false);
        return;
      }
      setActiveScene((scene) => Math.min(scene + 1, SCENE_COUNT - 1));
    }, STORY_TIMING.sceneDurationMs);
    return () => window.clearTimeout(timer);
  }, [playing, activeScene]);

  useEffect(() => {
    const oldOverflow = document.body.style.overflow;
    const oldCursor = document.body.style.cursor;
    if (playing) {
      document.body.style.overflow = 'hidden';
      document.body.style.cursor = 'none';
    }
    return () => {
      document.body.style.overflow = oldOverflow;
      document.body.style.cursor = oldCursor;
    };
  }, [playing]);

  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key.toLowerCase() !== 'p' || event.metaKey || event.ctrlKey || event.altKey) return;
      const target = event.target as HTMLElement | null;
      if (target?.isContentEditable || ['INPUT', 'TEXTAREA', 'SELECT'].includes(target?.tagName ?? '')) return;
      event.preventDefault();
      if (playing) {
        setPlaying(false);
      } else {
        startPresentation();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [playing, startPresentation]);

  const handleScroll = () => {
    const container = scrollContainerRef.current;
    if (!container || presentationMode) return;
    const scene = Math.max(0, Math.min(SCENE_COUNT - 1, Math.round(container.scrollTop / window.innerHeight)));
    setActiveScene((current) => current === scene ? current : scene);
  };

  const exitPresentation = () => {
    setPlaying(false);
    setPresentationMode(false);
  };

  return (
    <div
      className={`${presentationMode ? 'fixed inset-0 z-40 overflow-hidden' : 'relative h-[100dvh]'} ${playing ? 'sc-platform-locked' : ''} bg-sc-navy text-white`}
      data-testid="platform-overview"
    >
      {!presentationMode && (
        <header className="fixed left-0 right-0 top-0 z-30 border-b border-white/10 bg-sc-navy/80 px-5 py-4 backdrop-blur-xl sm:px-8">
          <div className="mx-auto flex max-w-[1440px] items-center justify-between gap-4">
            <BrandLogo variant="wordmark" invert className="h-7" testId="link-platform-brand-home" linkClassName="shrink-0" />
            <div className="hidden items-center gap-1.5 md:flex" aria-label={`Platform story, scene ${activeScene + 1} of ${SCENE_COUNT}`}>
              {Array.from({ length: SCENE_COUNT }, (_, index) => (
                <span key={index} className={`h-1 w-7 rounded-full transition-colors ${index === activeScene ? 'bg-sc-cyan' : index < activeScene ? 'bg-sc-green/80' : 'bg-white/15'}`} />
              ))}
            </div>
            <button
              type="button"
              onClick={() => startPresentation()}
              data-testid="button-play-platform-story"
              className="inline-flex shrink-0 items-center gap-2 rounded-lg border border-sc-cyan/35 bg-sc-cyan/10 px-3 py-2 text-xs font-black text-sc-cyan transition-colors hover:bg-sc-cyan/20"
            >
              <Play className="h-3.5 w-3.5 fill-current" /> Play story <span className="hidden font-mono text-[10px] text-white/45 sm:inline">P</span>
            </button>
          </div>
        </header>
      )}

      {presentationMode && playing && (
        <BrandLogo
          variant="wordmark"
          invert
          className="h-6"
          testId="link-platform-presentation-home"
          linkClassName="absolute left-5 top-5 z-30 border border-white/10 bg-sc-navy/70 p-2 backdrop-blur-md sm:left-8 sm:top-6"
        />
      )}

      {presentationMode && !playing && (
        <div className="absolute left-0 right-0 top-0 z-30 flex items-center justify-between gap-4 border-b border-white/10 bg-sc-navy/75 px-5 py-4 backdrop-blur-xl sm:px-8">
          <Link href="/" data-testid="link-platform-exit" className="inline-flex items-center gap-2 text-xs font-black text-white/60 hover:text-white">
            <ArrowLeft className="h-4 w-4" /> Exit story
          </Link>
          <button type="button" onClick={() => startPresentation(0)} data-testid="button-replay-platform-story" className="inline-flex items-center gap-2 rounded-lg border border-sc-cyan/35 bg-sc-cyan/10 px-3 py-2 text-xs font-black text-sc-cyan hover:bg-sc-cyan/20">
            <RotateCcw className="h-3.5 w-3.5" /> Replay story
          </button>
        </div>
      )}

      {presentationMode ? (
        <>
          <div className="pointer-events-none absolute left-0 right-0 top-0 z-20 h-1.5 bg-white/10" aria-hidden="true">
            <div className="h-full bg-sc-cyan transition-[width]" style={{ width: `${((activeScene + (playing ? 0.12 : 1)) / SCENE_COUNT) * 100}%`, transitionDuration: `${STORY_TIMING.sceneTransitionSeconds * 1000}ms` }} />
          </div>
          <AnimatePresence mode="wait" initial={false}>
            <motion.div
              key={activeScene}
              initial={reduceMotion ? false : { opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={reduceMotion ? undefined : { opacity: 0 }}
              transition={{ duration: reduceMotion ? 0 : STORY_TIMING.sceneTransitionSeconds }}
              className="h-full"
            >
              <PlatformScene index={activeScene} presentation reduceMotion={reduceMotion} />
            </motion.div>
          </AnimatePresence>
        </>
      ) : (
        <div ref={scrollContainerRef} onScroll={handleScroll} className="h-full overflow-y-auto sc-platform-scroll">
          {Array.from({ length: SCENE_COUNT }, (_, index) => (
            <PlatformScene key={index} index={index} presentation={false} reduceMotion={reduceMotion} />
          ))}
        </div>
      )}
    </div>
  );
}
