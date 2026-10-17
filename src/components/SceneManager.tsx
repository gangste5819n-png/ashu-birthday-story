import React, { useState, useCallback, useEffect } from 'react';
import { AnimatePresence, motion } from 'framer-motion';
import type { SceneId, SecretNoteData } from '../types';
import { STORY_CONFIG } from '../config/storyConfig';

// Import Scenes
import { OpeningScene } from '../scenes/OpeningScene';
import { LetterScene } from '../scenes/LetterScene';
import { BuildingScene } from '../scenes/BuildingScene';
import { FireworksScene } from '../scenes/FireworksScene';
import { EntranceScene } from '../scenes/EntranceScene';
import { BouquetScene } from '../scenes/BouquetScene';
import { HugScene } from '../scenes/HugScene';
import { ScooterScene } from '../scenes/ScooterScene';
import { ChaiPointScene } from '../scenes/ChaiPointScene';
import { RooftopScene } from '../scenes/RooftopScene';
import { FinaleScene } from '../scenes/FinaleScene';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { SecretPhotoModal } from './SecretPhotoModal';

const SCENE_SEQUENCE: SceneId[] = [
  'opening', 'letter', 'waiting', 'midnight',
  'arrival', 'bouquet', 'hug', 'scooter', 'chai', 'rooftop', 'finale'
];

// Cinematic scene transitions
const filmTransition = {
  initial: { opacity: 0 },
  animate: { opacity: 1 },
  exit:    { opacity: 0 },
  transition: { duration: 1.1, ease: [0.16, 1, 0.3, 1] as const }
};

export const SceneManager: React.FC = () => {
  const [currentScene, setCurrentScene] = useState<SceneId>('opening');
  const [activeSecret, setActiveSecret] = useState<SecretNoteData | null>(null);
  const [discoveredSecrets, setDiscoveredSecrets] = useState<string[]>([]);
  const [isLetterModalOpen, setIsLetterModalOpen] = useState(false);
  const [showProgress, setShowProgress] = useState(false);
  const { playSfx } = useBackgroundMusic();

  const currentIndex = SCENE_SEQUENCE.indexOf(currentScene);

  // Show progress after opening scene
  useEffect(() => {
    if (currentScene !== 'opening') setShowProgress(true);
  }, [currentScene]);

  const goToScene = useCallback((sceneId: SceneId) => {
    setCurrentScene(sceneId);
  }, []);

  const handleOpenSecret = useCallback((id: string) => {
    const found = STORY_CONFIG.secretMessages.find(s => s.id === id);
    if (found) {
      playSfx('sparkle');
      setActiveSecret(found);
      if (!discoveredSecrets.includes(id)) {
        setDiscoveredSecrets(prev => [...prev, id]);
      }
    }
  }, [discoveredSecrets, playSfx]);

  const handleReplay = useCallback(() => {
    setCurrentScene('opening');
    setShowProgress(false);
  }, []);

  const openLetterModal = useCallback(() => {
    playSfx('paper');
    setIsLetterModalOpen(true);
  }, [playSfx]);

  return (
    <div className="scene" style={{ background: '#040d1a' }}>
      {/* Cinematic letterbox bars */}
      <div className="letterbox-top" style={{ zIndex: 85 }} />
      <div className="letterbox-bottom" style={{ zIndex: 85 }} />

      {/* Active Scene — slow cinematic crossfade */}
      <AnimatePresence mode="wait">
        <motion.div
          key={currentScene}
          {...filmTransition}
          className="absolute inset-0 w-full h-full"
        >
          {currentScene === 'opening' && (
            <OpeningScene
              onBegin={() => goToScene('letter')}
              onOpenSecret={handleOpenSecret}
              discoveredSecrets={discoveredSecrets}
            />
          )}
          {currentScene === 'letter' && (
            <LetterScene onContinue={() => goToScene('waiting')} />
          )}
          {currentScene === 'waiting' && (
            <BuildingScene
              onMidnightReached={() => goToScene('midnight')}
              onOpenLetterAgain={openLetterModal}
              onOpenSecret={handleOpenSecret}
              discoveredSecrets={discoveredSecrets}
            />
          )}
          {currentScene === 'midnight' && (
            <FireworksScene
              onContinue={() => goToScene('arrival')}
              onOpenSecret={handleOpenSecret}
              discoveredSecrets={discoveredSecrets}
            />
          )}
          {currentScene === 'arrival' && (
            <EntranceScene
              onGiveFlowers={() => goToScene('bouquet')}
              onOpenSecret={handleOpenSecret}
              discoveredSecrets={discoveredSecrets}
            />
          )}
          {currentScene === 'bouquet' && (
            <BouquetScene
              onGiveHug={() => goToScene('hug')}
              onOpenSecret={handleOpenSecret}
              discoveredSecrets={discoveredSecrets}
            />
          )}
          {currentScene === 'hug' && (
            <HugScene
              onGoForRide={() => goToScene('scooter')}
              onOpenSecret={handleOpenSecret}
              discoveredSecrets={discoveredSecrets}
            />
          )}
          {currentScene === 'scooter' && (
            <ScooterScene
              onArriveAtCafe={() => goToScene('chai')}
              onOpenSecret={handleOpenSecret}
              discoveredSecrets={discoveredSecrets}
            />
          )}
          {currentScene === 'chai' && (
            <ChaiPointScene
              onSeeStars={() => goToScene('rooftop')}
              onOpenSecret={handleOpenSecret}
              discoveredSecrets={discoveredSecrets}
            />
          )}
          {currentScene === 'rooftop' && (
            <RooftopScene
              onContinue={() => goToScene('finale')}
              onOpenSecret={handleOpenSecret}
              discoveredSecrets={discoveredSecrets}
            />
          )}
          {currentScene === 'finale' && (
            <FinaleScene
              onOpenLetterAgain={openLetterModal}
              onReplayStory={handleReplay}
              onOpenSecret={handleOpenSecret}
              discoveredSecrets={discoveredSecrets}
            />
          )}
        </motion.div>
      </AnimatePresence>

      {/* Discreet Progress Dots — bottom center */}
      <div className={`film-progress ${showProgress ? 'visible' : ''}`} style={{ zIndex: 90 }}>
        {SCENE_SEQUENCE.filter(s => s !== 'opening').map((s, i) => {
          const adjIdx = i; // 0-based without opening
          const curAdj = currentIndex - 1;
          return (
            <button
              key={s}
              className={`pdot ${adjIdx < curAdj ? 'done' : adjIdx === curAdj ? 'now' : ''}`}
              onClick={() => goToScene(s)}
              title={s}
              aria-label={`Go to ${s}`}
            />
          );
        })}
      </div>

      {/* Secret Note & Photo Modal */}
      <SecretPhotoModal note={activeSecret} onClose={() => setActiveSecret(null)} />

      {/* Letter Re-read overlay */}
      <AnimatePresence>
        {isLetterModalOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.4 }}
            onClick={() => setIsLetterModalOpen(false)}
            style={{
              position: 'fixed', inset: 0, zIndex: 110,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem',
              background: 'rgba(4,13,26,0.88)',
              backdropFilter: 'blur(12px)'
            }}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.88, y: 30 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.88 }}
              transition={{ duration: 0.45 }}
              onClick={e => e.stopPropagation()}
              className="parchment"
              style={{
                position: 'relative', width: '100%', maxWidth: 480,
                padding: '2.25rem 2.5rem',
                borderRadius: 12, maxHeight: '85vh', overflowY: 'auto',
                userSelect: 'text'
              }}
            >
              <button
                onClick={() => setIsLetterModalOpen(false)}
                style={{
                  position: 'absolute', top: '1rem', right: '1rem',
                  background: 'none', border: 'none', cursor: 'pointer',
                  color: '#78716c', fontSize: '1rem', padding: '0.25rem'
                }}
                aria-label="Close letter"
              >
                ✕
              </button>
              <div className="font-hand" style={{ fontSize: '1.8rem', color: '#881337', fontWeight: 600, marginBottom: '1rem' }}>
                {STORY_CONFIG.letter.greeting}
              </div>
              <div className="font-hand" style={{ fontSize: '1.2rem', color: '#292524', lineHeight: 1.65 }}>
                {STORY_CONFIG.letter.paragraphs.map((para, i) => (
                  <p key={i} style={{ marginBottom: '0.75rem' }}>{para}</p>
                ))}
              </div>
              <div style={{ marginTop: '1.5rem', paddingTop: '1rem', borderTop: '1px solid rgba(120,53,15,0.15)', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span className="font-hand" style={{ fontSize: '1.4rem', color: '#44403c' }}>{STORY_CONFIG.letter.closing}</span>
                <span style={{ fontSize: '1.2rem' }}>❤️</span>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
