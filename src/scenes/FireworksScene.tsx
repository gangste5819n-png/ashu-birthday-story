import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_CONFIG } from '../config/storyConfig';
import { FireworksCanvas } from '../components/FireworksCanvas';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface FireworksSceneProps {
  onContinue: () => void;
  onOpenSecret: (id: string) => void;
  discoveredSecrets: string[];
}

export const FireworksScene: React.FC<FireworksSceneProps> = ({ onContinue, onOpenSecret, discoveredSecrets }) => {
  const [countdown, setCountdown] = useState(3);
  const [isMidnight, setIsMidnight] = useState(false);
  const [showContinue, setShowContinue] = useState(false);
  const [wishCount, setWishCount] = useState(0);
  const { playSfx, playFireworkBurst } = useBackgroundMusic();

  useEffect(() => {
    if (countdown > 0) {
      const t = setTimeout(() => { playSfx('chime'); setCountdown(p => p - 1); }, 1000);
      return () => clearTimeout(t);
    } else if (!isMidnight) {
      setIsMidnight(true);
      playFireworkBurst();
      playSfx('sparkle');
    }
  }, [countdown, isMidnight, playSfx, playFireworkBurst]);

  useEffect(() => {
    if (isMidnight) {
      const t = setTimeout(() => setShowContinue(true), 6000);
      return () => clearTimeout(t);
    }
  }, [isMidnight]);

  const handleWish = () => {
    setWishCount(p => p + 1);
    if (wishCount >= 0) setShowContinue(true);
  };

  return (
    <div className="scene" style={{ cursor: isMidnight ? 'crosshair' : 'default' }}>
      {/* Sky takes 100% of frame — darkened city silhouette only at very bottom */}
      <motion.img
        src="/images/opening_skyline.jpg"
        alt="Midnight sky"
        className="scene-env"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.0 }}
        transition={{ duration: 8, ease: 'easeOut' }}
        style={{ filter: 'brightness(0.45) saturate(0.7)', objectPosition: 'center bottom' }}
      />

      {/* Dark sky gradient overlay — 85% sky visible */}
      <div style={{
        position: 'absolute', inset: 0, zIndex: 5, pointerEvents: 'none',
        background: 'linear-gradient(to top, rgba(4,13,26,0.95) 0%, rgba(4,13,26,0.15) 20%, transparent 50%)'
      }} />

      {/* Countdown */}
      <AnimatePresence>
        {!isMidnight && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            style={{
              position: 'fixed', inset: 0, zIndex: 50,
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center',
              background: 'rgba(4,13,26,0.88)',
              backdropFilter: 'blur(6px)'
            }}
          >
            <AnimatePresence mode="wait">
              <motion.span
                key={countdown}
                initial={{ scale: 2.8, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                exit={{ scale: 0.4, opacity: 0 }}
                transition={{ duration: 0.55, ease: 'easeOut' }}
                style={{
                  fontFamily: 'ui-monospace, monospace',
                  fontSize: 'clamp(6rem, 18vw, 10rem)',
                  fontWeight: 800,
                  color: 'rgba(253,230,138,0.95)',
                  textShadow: '0 0 60px rgba(255,201,121,0.9), 0 0 120px rgba(255,201,121,0.4)',
                  lineHeight: 1
                }}
              >
                {countdown === 0 ? '🎆' : countdown}
              </motion.span>
            </AnimatePresence>
            <motion.p
              animate={{ opacity: [0.5, 1, 0.5] }}
              transition={{ duration: 1.2, repeat: Infinity }}
              style={{
                marginTop: '1.5rem', fontFamily: 'var(--font-serif)',
                fontSize: 'clamp(0.9rem, 2vw, 1.2rem)',
                color: 'rgba(253,164,175,0.85)',
                letterSpacing: '0.2em', textTransform: 'uppercase', fontStyle: 'italic'
              }}
            >
              Counting down to midnight...
            </motion.p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Fireworks Canvas — full screen interactive sky */}
      {isMidnight && (
        <FireworksCanvas
          onWishTriggered={handleWish}
          interactive={true}
        />
      )}

      {/* Secret heart floating in sky */}
      {isMidnight && !discoveredSecrets.includes('secret-3') && (
        <button
          className="secret-heart"
          style={{ top: '18%', right: '22%', zIndex: 25 }}
          onClick={() => onOpenSecret('secret-3')}
          aria-label="Discover secret wish in the sky"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}

      {/* Midnight title — appears in environment */}
      {isMidnight && (
        <>
          <motion.div
            initial={{ opacity: 0, scale: 0.6 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 1, type: 'spring', delay: 0.2 }}
            style={{
              position: 'absolute', top: 'clamp(72px, 13vh, 110px)',
              left: '50%', transform: 'translateX(-50%)',
              zIndex: 30, textAlign: 'center'
            }}
          >
            <div style={{
              fontFamily: 'ui-monospace, monospace',
              fontSize: 'clamp(1.8rem, 5vw, 2.8rem)',
              fontWeight: 800, color: 'rgba(253,164,175,0.95)',
              textShadow: '0 0 40px rgba(244,63,94,0.7)',
              letterSpacing: '0.06em'
            }}>
              {STORY_CONFIG.midnight.timeText}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.8 }}
            className="film-title"
            style={{
              position: 'absolute',
              top: 'clamp(125px, 22vh, 170px)', left: '50%',
              transform: 'translateX(-50%)',
              zIndex: 30, textAlign: 'center',
              fontSize: 'clamp(2.5rem, 8vw, 5rem)',
              whiteSpace: 'nowrap'
            }}
          >
            Happy Birthday, {STORY_CONFIG.girlName}. ❤️
          </motion.div>

          {/* Tap cue */}
          <motion.div
            animate={{ opacity: [0.4, 0.9, 0.4] }}
            transition={{ duration: 2, repeat: Infinity }}
            style={{
              position: 'absolute', zIndex: 30,
              top: 'clamp(200px, 35vh, 280px)', left: '50%',
              transform: 'translateX(-50%)',
              fontFamily: 'var(--font-body)', fontSize: '0.7rem',
              letterSpacing: '0.18em', textTransform: 'uppercase',
              color: 'rgba(255,201,121,0.75)',
              textShadow: '0 0 12px rgba(255,201,121,0.4)'
            }}
          >
            ✦ Tap the sky to make a wish
          </motion.div>
        </>
      )}

      {/* Continue cue — appears after a moment */}
      <AnimatePresence>
        {showContinue && (
          <motion.button
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            onClick={() => { playSfx('sparkle'); onContinue(); }}
            className="film-btn film-btn-primary"
            style={{
              position: 'absolute', zIndex: 60,
              bottom: 'clamp(52px, 10vh, 80px)', left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.85rem', padding: '0.7rem 1.8rem'
            }}
          >
            {STORY_CONFIG.midnight.continueButtonText}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
