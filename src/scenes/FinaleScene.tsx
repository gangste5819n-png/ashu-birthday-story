import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_CONFIG } from '../config/storyConfig';
import { FireworksCanvas } from '../components/FireworksCanvas';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface FinaleSceneProps {
  onOpenLetterAgain: () => void;
  onReplayStory: () => void;
  onOpenSecret: (id: string) => void;
  discoveredSecrets: string[];
}

export const FinaleScene: React.FC<FinaleSceneProps> = ({
  onOpenLetterAgain,
  onReplayStory,
  onOpenSecret,
  discoveredSecrets
}) => {
  const [phase, setPhase] = useState<'note' | 'fireworks'>('note');
  const [revealedParagraphs, setRevealedParagraphs] = useState<number>(1);
  const { playSfx, playFireworkBurst } = useBackgroundMusic();

  const paragraphs = STORY_CONFIG.finale.noteParagraphs;

  // Reveal handwritten paragraphs gradually
  useEffect(() => {
    if (phase === 'note' && revealedParagraphs < paragraphs.length) {
      const timer = setTimeout(() => {
        setRevealedParagraphs(prev => prev + 1);
      }, 1500);
      return () => clearTimeout(timer);
    }
  }, [phase, revealedParagraphs, paragraphs.length]);

  const handleLaunchHeartFireworks = () => {
    playFireworkBurst();
    playSfx('sparkle');
    setPhase('fireworks');
  };

  return (
    <div className="scene">
      {/* Background artwork — Parchment note in Phase 1, Midnight skyline in Phase 2 */}
      <AnimatePresence mode="wait">
        {phase === 'note' ? (
          <motion.img
            key="parchment"
            src="/images/parchment_final_note.jpg"
            alt="Final Handwritten Note"
            className="scene-env"
            initial={{ scale: 1.04, opacity: 0.8 }}
            animate={{ scale: 1.09, opacity: 1 }}
            exit={{ opacity: 0.3 }}
            transition={{
              scale: { duration: 25, ease: 'linear' },
              opacity: { duration: 0.8 }
            }}
            style={{ objectPosition: 'center 38%' }}
          />
        ) : (
          <motion.img
            key="skyline"
            src="/images/opening_skyline.jpg"
            alt="Midnight Fireworks Skyline"
            className="scene-env"
            initial={{ scale: 1.06, opacity: 0.4 }}
            animate={{ scale: 1.12, opacity: 0.85 }}
            transition={{ duration: 25, ease: 'linear' }}
            style={{ objectPosition: 'center 45%' }}
          />
        )}
      </AnimatePresence>

      {/* Atmospheric Overlays */}
      <div className="vignette" />
      <div className="atmos-bottom" style={{ height: phase === 'note' ? '75%' : '50%' }} />
      <div className="atmos-sides" />
      <div className="atmos-top" />

      {/* Warm candlelight glow */}
      <div
        className="warm-glow"
        style={{
          width: 550,
          height: 450,
          bottom: '25%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: phase === 'note'
            ? 'radial-gradient(ellipse, rgba(255,201,121,0.22) 0%, rgba(225,29,72,0.1) 50%, transparent 75%)'
            : 'radial-gradient(circle, rgba(225,29,72,0.2) 0%, rgba(255,201,121,0.12) 50%, transparent 75%)',
          zIndex: 8
        }}
      />

      {/* Drifting warm petals/fairy dust */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="bokeh"
          style={{
            width: 3 + Math.random() * 5,
            height: 3 + Math.random() * 5,
            left: `${15 + Math.random() * 70}%`,
            bottom: `${20 + Math.random() * 60}%`,
            background: i % 2 === 0 ? 'rgba(242,161,182,0.85)' : 'rgba(255,201,121,0.8)',
            animationDuration: `${4 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 3}s`,
            filter: `blur(${1 + Math.random()}px)`,
            zIndex: 14
          }}
        />
      ))}

      {/* Secret Heart */}
      {!discoveredSecrets.includes('secret-10') && (
        <button
          className="secret-heart"
          style={{ top: '16%', right: '22%' }}
          onClick={() => onOpenSecret('secret-10')}
          aria-label="Discover secret note"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}

      {/* Top Scene Badge */}
      <div className="scene-badge">
        <span>✨</span>
        <span>{STORY_CONFIG.finale.badgeText}</span>
      </div>

      {/* PHASE 1: Progressive Handwritten Note on Parchment */}
      {phase === 'note' && (
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 35,
            padding: '1.5rem',
            pointerEvents: 'auto'
          }}
        >
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 1 }}
            style={{
              maxWidth: 620,
              width: '100%',
              textAlign: 'center',
              display: 'flex',
              flexDirection: 'column',
              gap: '1rem',
              marginTop: 'clamp(20px, 4vh, 40px)'
            }}
          >
            {/* Header Greeting */}
            <div
              className="film-title"
              style={{
                fontSize: 'clamp(2rem, 5vw, 3.2rem)',
                color: 'var(--gold)',
                textShadow: '0 0 25px rgba(255,201,121,0.5), 0 2px 10px rgba(0,0,0,0.9)'
              }}
            >
              Happy Birthday, {STORY_CONFIG.girlName}. ❤️
            </div>

            {/* Handwritten note lines revealed one by one */}
            <div
              style={{
                display: 'flex',
                flexDirection: 'column',
                gap: '0.85rem',
                fontFamily: 'var(--font-hand)',
                fontSize: 'clamp(1.3rem, 3vw, 1.7rem)',
                color: '#fffbf5',
                lineHeight: 1.5,
                textShadow: '0 1px 6px rgba(0,0,0,0.85), 0 0 20px rgba(0,0,0,0.6)'
              }}
            >
              {paragraphs.slice(0, revealedParagraphs).map((para, idx) => (
                <motion.p
                  key={idx}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.8 }}
                >
                  "{para}"
                </motion.p>
              ))}
            </div>

            {/* Signature */}
            {revealedParagraphs >= paragraphs.length && (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 1, delay: 0.3 }}
                style={{
                  fontFamily: 'var(--font-hand)',
                  fontSize: 'clamp(1.5rem, 3.2vw, 2rem)',
                  color: 'var(--gold)',
                  marginTop: '0.4rem',
                  display: 'flex',
                  justifyContent: 'center',
                  alignItems: 'center',
                  gap: '0.5rem'
                }}
              >
                <span>{STORY_CONFIG.finale.noteSignature}</span>
                <span style={{ color: '#f43f5e' }}>❤️</span>
              </motion.div>
            )}

            {/* Continue to Heart Fireworks Button */}
            <div style={{ marginTop: '1.2rem' }}>
              <motion.button
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.8, delay: 0.6 }}
                onClick={handleLaunchHeartFireworks}
                className="film-btn film-btn-primary"
                style={{
                  fontSize: '0.95rem',
                  padding: '0.8rem 2.4rem'
                }}
              >
                <span>Heart Fireworks for You ✨</span>
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}

      {/* PHASE 2: Midnight Skyline with Heart Fireworks */}
      {phase === 'fireworks' && (
        <>
          {/* Edge-to-edge interactive heart fireworks canvas */}
          <div style={{ position: 'absolute', inset: 0, zIndex: 25 }}>
            <FireworksCanvas interactive={true} onlyHearts={true} />
          </div>

          {/* Environmental Subtitle Bar & Keepsake Controls */}
          <div
            className="subtitle-bar"
            style={{
              bottom: 'clamp(36px, 7vh, 60px)',
              pointerEvents: 'auto',
              zIndex: 65,
              maxWidth: 'min(700px, 92vw)'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 15 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1.2 }}
              className="film-title"
              style={{
                fontSize: 'clamp(2.5rem, 6vw, 4rem)',
                marginBottom: '0.4rem'
              }}
            >
              {STORY_CONFIG.finale.fireworksHeading}
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 1, delay: 0.6 }}
              className="subtitle-text"
              style={{
                fontSize: 'clamp(1rem, 2.2vw, 1.3rem)',
                marginBottom: '0.6rem'
              }}
            >
              "{STORY_CONFIG.finale.fireworksSubtitle}"
            </motion.div>

            <div
              style={{
                fontSize: '0.75rem',
                color: 'rgba(255,201,121,0.7)',
                fontFamily: 'var(--font-body)',
                letterSpacing: '0.12em',
                textTransform: 'uppercase',
                marginBottom: '1.25rem'
              }}
            >
              ✦ Tap anywhere on the sky to launch heart fireworks
            </div>

            {/* Replay Story & Read Letter Buttons */}
            <div
              style={{
                display: 'flex',
                flexWrap: 'wrap',
                justifyContent: 'center',
                gap: '0.8rem'
              }}
            >
              <button
                onClick={() => {
                  playSfx('sparkle');
                  onReplayStory();
                }}
                className="film-btn film-btn-primary"
                style={{ fontSize: '0.85rem', padding: '0.65rem 1.6rem' }}
              >
                <span>{STORY_CONFIG.finale.replayButtonText}</span>
              </button>

              <button
                onClick={() => {
                  playSfx('paper');
                  onOpenLetterAgain();
                }}
                className="film-btn"
                style={{ fontSize: '0.85rem', padding: '0.65rem 1.6rem' }}
              >
                <span>{STORY_CONFIG.finale.readLetterButtonText}</span>
              </button>
            </div>
          </div>
        </>
      )}
    </div>
  );
};
