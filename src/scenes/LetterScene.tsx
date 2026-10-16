import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Heart } from 'lucide-react';
import { STORY_CONFIG } from '../config/storyConfig';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface LetterSceneProps {
  onContinue: () => void;
}

export const LetterScene: React.FC<LetterSceneProps> = ({ onContinue }) => {
  const [phase, setPhase] = useState<'approaching' | 'envelope' | 'reading'>('approaching');
  const [revealedLines, setRevealedLines] = useState(0);
  const { playSfx } = useBackgroundMusic();

  // Camera approaches the envelope — after 2.5s, show envelope
  useEffect(() => {
    const t = setTimeout(() => setPhase('envelope'), 2500);
    return () => clearTimeout(t);
  }, []);

  // Progressively reveal letter lines
  useEffect(() => {
    if (phase !== 'reading') return;
    if (revealedLines < STORY_CONFIG.letter.paragraphs.length) {
      const t = setTimeout(() => setRevealedLines(p => p + 1), 900);
      return () => clearTimeout(t);
    }
  }, [phase, revealedLines]);

  const handleOpenEnvelope = () => {
    playSfx('paper');
    setPhase('reading');
    setRevealedLines(0);
  };

  const allRevealed = revealedLines >= STORY_CONFIG.letter.paragraphs.length;

  return (
    <div className="scene" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Background — envelope on warm surface, camera approach */}
      <motion.img
        src="/images/envelope_wax_seal.jpg"
        alt="Envelope"
        className="scene-env"
        initial={{ scale: 1.18, y: 30 }}
        animate={{
          scale: phase === 'approaching' ? 1.06 : phase === 'envelope' ? 1.03 : 1.1,
          y: phase === 'approaching' ? 0 : -10
        }}
        transition={{ duration: phase === 'approaching' ? 2.5 : 1.8, ease: [0.16, 1, 0.3, 1] }}
      />

      {/* Warm candlelight glow */}
      <div className="warm-glow" style={{
        width: 320, height: 320, top: '35%', left: '45%',
        background: 'radial-gradient(circle, rgba(255,180,60,0.3), transparent)',
        zIndex: 2
      }} />

      <div className="vignette" />
      <div className="atmos-bottom" />
      <div className="atmos-top" />

      {/* Approaching narration */}
      <AnimatePresence>
        {phase === 'approaching' && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -20 }}
            transition={{ duration: 0.8, delay: 0.5 }}
            style={{
              position: 'absolute', zIndex: 30, bottom: '15%', left: '50%',
              transform: 'translateX(-50%)', textAlign: 'center',
              color: 'rgba(255,246,236,0.8)', fontFamily: 'var(--font-serif)',
              fontSize: 'clamp(1.1rem, 2.5vw, 1.4rem)',
              fontStyle: 'italic', fontWeight: 300,
              textShadow: '0 2px 12px rgba(0,0,0,0.8)',
              maxWidth: 480, padding: '0 1.5rem'
            }}
          >
            {STORY_CONFIG.letter.promptText}
          </motion.div>
        )}
      </AnimatePresence>

      {/* Envelope interaction */}
      <AnimatePresence>
        {phase === 'envelope' && (
          <motion.div
            initial={{ opacity: 0, scale: 0.88, y: 30 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: -20 }}
            transition={{ duration: 0.9, ease: [0.16, 1, 0.3, 1] }}
            style={{
              position: 'absolute', zIndex: 30,
              display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '1.25rem'
            }}
          >
            {/* Envelope body */}
            <div
              className="envelope-body"
              onClick={handleOpenEnvelope}
              role="button"
              tabIndex={0}
              onKeyPress={e => e.key === 'Enter' && handleOpenEnvelope()}
              aria-label="Open envelope"
              style={{ perspective: 600 }}
            >
              {/* V-flap */}
              <div className="envelope-flap" />
              {/* Wax seal */}
              <div className="wax-seal" style={{ transform: 'translate(-50%, -50%)', top: '52%', left: '50%' }}>
                <Heart size={20} fill="rgba(255,228,230,0.9)" color="rgba(255,228,230,0.9)" />
              </div>
            </div>

            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 2, repeat: Infinity }}
              style={{
                fontFamily: 'var(--font-body)', fontSize: '0.7rem',
                letterSpacing: '0.18em', textTransform: 'uppercase',
                color: 'rgba(255,201,121,0.72)'
              }}
            >
              Tap to open
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Letter reading — full screen parchment */}
      <AnimatePresence>
        {phase === 'reading' && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              background: 'rgba(4,13,26,0.88)',
              backdropFilter: 'blur(12px)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '1rem'
            }}
          >
            <motion.div
              initial={{ opacity: 0, y: 40, rotateX: 8 }}
              animate={{ opacity: 1, y: 0, rotateX: 0 }}
              transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              className="parchment"
              style={{
                width: '100%', maxWidth: 480,
                padding: 'clamp(1.5rem, 5vw, 2.75rem)',
                borderRadius: 12,
                maxHeight: '88vh', overflowY: 'auto',
                userSelect: 'text'
              }}
            >
              {/* Greeting */}
              <motion.div
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="font-hand"
                style={{ fontSize: 'clamp(1.5rem, 4vw, 2rem)', color: '#881337', fontWeight: 600, marginBottom: '1.25rem' }}
              >
                {STORY_CONFIG.letter.greeting}
              </motion.div>

              {/* Progressive paragraphs */}
              <div className="font-hand" style={{ fontSize: 'clamp(1rem, 2.5vw, 1.25rem)', color: '#292524', lineHeight: 1.7 }}>
                {STORY_CONFIG.letter.paragraphs.slice(0, revealedLines).map((para, i) => (
                  <motion.p
                    key={i}
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.5 }}
                    style={{ marginBottom: '0.8rem' }}
                  >
                    {para}
                  </motion.p>
                ))}
              </div>

              {/* Signature */}
              <AnimatePresence>
                {allRevealed && (
                  <motion.div
                    initial={{ opacity: 0, y: 8 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                    style={{
                      marginTop: '1.5rem', paddingTop: '1rem',
                      borderTop: '1px solid rgba(120,53,15,0.15)',
                      display: 'flex', alignItems: 'center', justifyContent: 'space-between'
                    }}
                  >
                    <span className="font-hand" style={{ fontSize: '1.4rem', color: '#44403c' }}>
                      {STORY_CONFIG.letter.closing} ❤️
                    </span>
                    <button
                      onClick={() => { playSfx('sparkle'); onContinue(); }}
                      className="film-btn film-btn-primary"
                      style={{ fontSize: '0.82rem', padding: '0.55rem 1.4rem' }}
                    >
                      Let's go to midnight →
                    </button>
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
