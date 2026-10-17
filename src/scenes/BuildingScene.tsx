import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_CONFIG } from '../config/storyConfig';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface BuildingSceneProps {
  onMidnightReached: () => void;
  onOpenLetterAgain: () => void;
  onOpenSecret: (id: string) => void;
  discoveredSecrets: string[];
}

export const BuildingScene: React.FC<BuildingSceneProps> = ({
  onMidnightReached, onOpenLetterAgain, onOpenSecret, discoveredSecrets
}) => {
  const [timeText, setTimeText] = useState('11:55 PM');
  const [isCountingDown, setIsCountingDown] = useState(false);
  const { playSfx } = useBackgroundMusic();

  // Animate window lights blinking naturally
  const windowLights = [
    { top: '22%', left: '38%', w: 18, h: 24, delay: 0 },
    { top: '28%', left: '44%', w: 14, h: 18, delay: 1.2 },
    { top: '35%', left: '52%', w: 20, h: 16, delay: 0.6 },
    { top: '18%', left: '60%', w: 16, h: 20, delay: 2.1 },
    { top: '42%', left: '30%', w: 22, h: 16, delay: 1.8 },
    { top: '15%', left: '72%', w: 12, h: 16, delay: 0.9 },
  ];

  useEffect(() => {
    if (!isCountingDown) return;
    const times = ['11:56 PM', '11:57 PM', '11:58 PM', '11:59 PM'];
    let step = 0;
    const interval = setInterval(() => {
      if (step < times.length) {
        setTimeText(times[step]);
        playSfx('chime');
        step++;
      } else {
        clearInterval(interval);
        setTimeout(onMidnightReached, 1200);
      }
    }, 1600);
    return () => clearInterval(interval);
  }, [isCountingDown, onMidnightReached, playSfx]);

  return (
    <div className="scene">
      {/* Background — slow upward tilt like a camera looking up at the building */}
      <motion.img
        src="/images/building_night_boy.jpg"
        alt="Apartment building at night"
        className="scene-env"
        initial={{ scale: 1.08, y: 30 }}
        animate={{ scale: 1.02, y: 0 }}
        transition={{ duration: 4, ease: 'easeOut' }}
        style={{ objectPosition: 'center bottom' }}
      />

      {/* Animated window lights */}
      {windowLights.map((w, i) => (
        <motion.div
          key={i}
          animate={{ opacity: [0.4, 0.9, 0.5, 0.85, 0.4] }}
          transition={{ duration: 3 + i * 0.8, delay: w.delay, repeat: Infinity, repeatType: 'loop' }}
          className="window-light"
          style={{
            top: w.top, left: w.left,
            width: w.w, height: w.h,
            background: 'rgba(255,220,120,0.7)',
            boxShadow: '0 0 16px rgba(255,200,80,0.8)',
            zIndex: 6
          }}
        />
      ))}

      {/* Secret heart on a lit window */}
      {!discoveredSecrets.includes('secret-2') && (
        <button
          className="secret-heart"
          style={{ top: '28%', left: '52%' }}
          onClick={() => onOpenSecret('secret-2')}
          aria-label="Discover secret note"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}

      <div className="vignette" />
      <div className="atmos-bottom" />
      <div className="atmos-top" />
      <div className="atmos-sides" />

      {/* Clock — floating in the environment */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 1, delay: 0.5 }}
        style={{
          position: 'absolute', zIndex: 30,
          top: 'clamp(72px, 14vh, 120px)', left: '50%',
          transform: 'translateX(-50%)',
          display: 'flex', alignItems: 'center', gap: '0.6rem',
          padding: '0.5rem 1.4rem',
          background: 'rgba(4,13,26,0.72)',
          backdropFilter: 'blur(14px)',
          border: '1px solid rgba(255,201,121,0.28)',
          borderRadius: 99,
          boxShadow: '0 0 30px rgba(255,201,121,0.2)'
        }}
      >
        <span style={{ fontSize: '0.7rem', color: 'rgba(255,201,121,0.6)', fontFamily: 'var(--font-body)', letterSpacing: '0.12em', textTransform: 'uppercase' }}>⏱</span>
        <AnimatePresence mode="wait">
          <motion.span
            key={timeText}
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: 8 }}
            transition={{ duration: 0.35 }}
            style={{
              fontFamily: 'ui-monospace, SFMono-Regular, monospace',
              fontSize: 'clamp(1.5rem, 4vw, 2.2rem)',
              fontWeight: 700, color: 'rgba(253,230,138,0.95)',
              letterSpacing: '0.06em',
              textShadow: '0 0 20px rgba(255,201,121,0.5)'
            }}
          >
            {timeText}
          </motion.span>
        </AnimatePresence>
      </motion.div>

      {/* Narration lines — film subtitle style */}
      <div className="subtitle-bar" style={{ bottom: isCountingDown ? 'clamp(90px, 16vh, 140px)' : 'clamp(120px, 20vh, 180px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 0.8 }}
          className="subtitle-text"
        >
          {STORY_CONFIG.waiting.title}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.4 }}
          style={{ marginTop: '0.4rem', fontSize: '0.85rem', color: 'rgba(203,213,225,0.75)', fontFamily: 'var(--font-serif)', fontStyle: 'italic', textAlign: 'center', textShadow: '0 1px 8px rgba(0,0,0,0.8)' }}
        >
          {STORY_CONFIG.waiting.subtitle}
        </motion.div>
      </div>

      {/* Action cues — minimal, at bottom */}
      <div style={{
        position: 'absolute', zIndex: 50,
        bottom: 'clamp(44px, 9vh, 72px)', left: '50%',
        transform: 'translateX(-50%)',
        display: 'flex', alignItems: 'center', gap: '0.75rem',
        flexWrap: 'wrap', justifyContent: 'center'
      }}>
        {!isCountingDown ? (
          <>
            <button
              onClick={() => { setIsCountingDown(true); playSfx('chime'); }}
              className="film-btn film-btn-primary"
              style={{ fontSize: '0.82rem' }}
            >
              {STORY_CONFIG.waiting.buttonText} →
            </button>
            <button
              onClick={onOpenLetterAgain}
              className="film-btn"
              style={{ fontSize: '0.78rem', color: 'rgba(203,213,225,0.85)' }}
            >
              ✉ Re-read letter
            </button>
          </>
        ) : (
          <motion.div
            animate={{ opacity: [0.5, 1, 0.5] }}
            transition={{ duration: 1.8, repeat: Infinity }}
            style={{ fontFamily: 'ui-monospace, monospace', fontSize: '0.75rem', color: 'rgba(253,230,138,0.8)', letterSpacing: '0.12em' }}
          >
            Approaching midnight... ✨
          </motion.div>
        )}
      </div>
    </div>
  );
};
