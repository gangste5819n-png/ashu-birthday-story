import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_CONFIG } from '../config/storyConfig';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface EntranceSceneProps {
  onGiveFlowers: () => void;
  onOpenSecret: (id: string) => void;
  discoveredSecrets: string[];
}

export const EntranceScene: React.FC<EntranceSceneProps> = ({ onGiveFlowers, onOpenSecret, discoveredSecrets }) => {
  const [phase, setPhase] = useState<'reveal' | 'ready'>('reveal');
  const { playSfx } = useBackgroundMusic();

  // After the cinematic reveal, show interaction cue
  useEffect(() => {
    const t = setTimeout(() => setPhase('ready'), 3200);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="scene">
      {/* Background — camera zooms back from close to reveal Ashu at entrance */}
      <motion.img
        src="/images/entrance_girl_arrives.jpg"
        alt="She arrives at the entrance"
        className="scene-env"
        initial={{ scale: 1.18, x: -15 }}
        animate={{ scale: 1.02, x: 0 }}
        transition={{ duration: 3.5, ease: [0.16, 1, 0.3, 1] }}
        style={{ objectPosition: 'center 30%' }}
      />

      {/* Warm entrance glow */}
      <div className="warm-glow" style={{
        width: 400, height: 400, bottom: '10%', left: '35%',
        background: 'radial-gradient(circle, rgba(255,160,60,0.22), transparent)',
        zIndex: 3
      }} />

      {/* Bokeh particles — fairy lights effect */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="bokeh"
          style={{
            width: 4 + Math.random() * 6, height: 4 + Math.random() * 6,
            left: `${15 + Math.random() * 70}%`,
            bottom: `${20 + Math.random() * 60}%`,
            background: `rgba(${255},${Math.floor(180 + Math.random() * 70)},${Math.floor(60 + Math.random() * 80)},0.7)`,
            animationDuration: `${4 + Math.random() * 5}s`,
            animationDelay: `${Math.random() * 3}s`,
            filter: `blur(${1 + Math.random() * 2}px)`,
            zIndex: 6
          }}
        />
      ))}

      {/* Secret heart near entrance */}
      {!discoveredSecrets.includes('secret-4') && (
        <button
          className="secret-heart"
          style={{ bottom: '28%', left: '14%' }}
          onClick={() => onOpenSecret('secret-4')}
          aria-label="Discover secret note"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}

      <div className="vignette" />
      <div className="atmos-bottom" />
      <div className="atmos-top" />
      <div className="atmos-sides" />

      {/* Cinematic narration lines */}
      <div className="subtitle-bar" style={{ bottom: 'clamp(120px, 22vh, 180px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="subtitle-text"
        >
          {STORY_CONFIG.arrival.firstLine}
        </motion.div>
        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 2 }}
          className="film-title"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', marginTop: '0.5rem', display: 'block', textAlign: 'center' }}
        >
          {STORY_CONFIG.arrival.secondLine}
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 3 }}
          style={{
            marginTop: '0.4rem', fontSize: '0.9rem',
            color: 'rgba(203,213,225,0.7)', fontFamily: 'var(--font-serif)',
            fontStyle: 'italic', textAlign: 'center',
            textShadow: '0 1px 8px rgba(0,0,0,0.8)'
          }}
        >
          {STORY_CONFIG.arrival.quietLine}
        </motion.div>
      </div>

      {/* Continue cue */}
      <AnimatePresence>
        {phase === 'ready' && (
          <motion.button
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.7 }}
            onClick={() => { playSfx('sparkle'); onGiveFlowers(); }}
            className="film-btn film-btn-primary"
            style={{
              position: 'absolute', zIndex: 60,
              bottom: 'clamp(52px, 9vh, 76px)', left: '50%',
              transform: 'translateX(-50%)',
              fontSize: '0.85rem', padding: '0.7rem 1.8rem'
            }}
          >
            {STORY_CONFIG.arrival.buttonText}
          </motion.button>
        )}
      </AnimatePresence>
    </div>
  );
};
