import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_CONFIG } from '../config/storyConfig';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface RooftopSceneProps {
  onContinue: () => void;
  onOpenSecret: (id: string) => void;
  discoveredSecrets: string[];
}

interface StarSparkle {
  id: number;
  x: number;
  y: number;
}

export const RooftopScene: React.FC<RooftopSceneProps> = ({
  onContinue,
  onOpenSecret,
  discoveredSecrets
}) => {
  const { playSfx } = useBackgroundMusic();
  const [sparkles, setSparkles] = useState<StarSparkle[]>([]);

  const handleNext = () => {
    playSfx('paper');
    onContinue();
  };

  const handleSkyTap = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    const id = Date.now() + Math.random();
    playSfx('sparkle');
    setSparkles(prev => [...prev.slice(-10), { id, x, y }]);
  };

  return (
    <div className="scene" onClick={handleSkyTap}>
      {/* Background artwork: Rooftop stargazing over quiet city skyline */}
      <motion.img
        src="/images/rooftop_finale.jpg"
        alt="Rooftop Midnight Sky"
        className="scene-env"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.12 }}
        transition={{ duration: 25, ease: 'linear' }}
        style={{ objectPosition: 'center 40%' }}
      />

      {/* Atmospheric Overlays */}
      <div className="vignette" />
      <div className="atmos-bottom" style={{ height: '55%' }} />
      <div className="atmos-sides" />
      <div className="atmos-top" />

      {/* Cool moonlight glow */}
      <div
        className="warm-glow"
        style={{
          width: 500,
          height: 500,
          top: '8%',
          right: '20%',
          background: 'radial-gradient(circle, rgba(186,230,253,0.18) 0%, rgba(99,102,241,0.06) 50%, transparent 70%)',
          zIndex: 8
        }}
      />

      {/* Dynamic Shooting Star */}
      <motion.div
        initial={{ x: '90vw', y: '10vh', opacity: 0 }}
        animate={{
          x: ['90vw', '40vw'],
          y: ['10vh', '35vh'],
          opacity: [0, 1, 0]
        }}
        transition={{
          duration: 1.8,
          repeat: Infinity,
          repeatDelay: 5,
          ease: 'easeOut'
        }}
        style={{
          position: 'absolute',
          width: 140,
          height: 2,
          background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.9), transparent)',
          transform: 'rotate(-28deg)',
          filter: 'blur(0.5px)',
          pointerEvents: 'none',
          zIndex: 14
        }}
      />

      {/* Twinkling Starlight points */}
      {[...Array(12)].map((_, i) => (
        <div
          key={i}
          className="bokeh"
          style={{
            width: 2 + Math.random() * 4,
            height: 2 + Math.random() * 4,
            left: `${10 + Math.random() * 80}%`,
            top: `${12 + Math.random() * 40}%`,
            background: i % 3 === 0 ? 'rgba(255,201,121,0.9)' : 'rgba(255,255,255,0.95)',
            animationDuration: `${2.5 + Math.random() * 3}s`,
            animationDelay: `${Math.random() * 2}s`,
            filter: `blur(${0.5 + Math.random() * 0.8}px)`,
            zIndex: 12
          }}
        />
      ))}

      {/* Interactive tap sparkles */}
      <AnimatePresence>
        {sparkles.map(s => (
          <motion.div
            key={s.id}
            initial={{ scale: 0, opacity: 1 }}
            animate={{ scale: [0, 1.4, 0], opacity: [1, 0.8, 0] }}
            exit={{ opacity: 0 }}
            transition={{ duration: 1 }}
            style={{
              position: 'absolute',
              left: s.x - 12,
              top: s.y - 12,
              width: 24,
              height: 24,
              pointerEvents: 'none',
              zIndex: 35,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: '#fde68a',
              fontSize: '1.2rem',
              textShadow: '0 0 12px #fde68a'
            }}
          >
            ✦
          </motion.div>
        ))}
      </AnimatePresence>

      {/* Secret Heart hidden among the stars */}
      {!discoveredSecrets.includes('secret-5') && (
        <button
          className="secret-heart"
          style={{ top: '18%', right: '34%' }}
          onClick={(e) => {
            e.stopPropagation();
            onOpenSecret('secret-5');
          }}
          aria-label="Discover secret note"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}

      {/* Top Scene Badge */}
      <div className="scene-badge">
        <span>🌙</span>
        <span>{STORY_CONFIG.rooftop.badgeText}</span>
      </div>

      {/* Subtitle Bar — Environmental Cinematic Narration */}
      <div className="subtitle-bar" style={{ bottom: 'clamp(110px, 18vh, 160px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 15 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.4 }}
          className="film-title"
          style={{ fontSize: 'clamp(1.8rem, 4.5vw, 2.7rem)', marginBottom: '0.6rem' }}
        >
          "{STORY_CONFIG.rooftop.line1}"
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, delay: 1.2 }}
          className="subtitle-text"
          style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', maxWidth: 580, margin: '0 auto' }}
        >
          {STORY_CONFIG.rooftop.line2}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.2 }}
          style={{
            marginTop: '0.6rem',
            fontSize: '0.75rem',
            color: 'rgba(255,201,121,0.65)',
            fontFamily: 'var(--font-body)',
            letterSpacing: '0.12em',
            textTransform: 'uppercase'
          }}
        >
          ✦ Tap the sky to make a wish upon a star
        </motion.div>
      </div>

      {/* Continue to Final Note Button */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 2 }}
        onClick={(e) => {
          e.stopPropagation();
          handleNext();
        }}
        className="film-btn film-btn-primary"
        style={{
          position: 'absolute',
          zIndex: 65,
          bottom: 'clamp(40px, 7vh, 65px)',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.9rem',
          padding: '0.75rem 2.2rem'
        }}
      >
        <span>{STORY_CONFIG.rooftop.buttonText}</span>
      </motion.button>
    </div>
  );
};
