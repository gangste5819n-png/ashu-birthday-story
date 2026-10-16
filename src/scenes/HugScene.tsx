import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { STORY_CONFIG } from '../config/storyConfig';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface HugSceneProps {
  onGoForRide: () => void;
  onOpenSecret: (id: string) => void;
  discoveredSecrets: string[];
}

export const HugScene: React.FC<HugSceneProps> = ({ onGoForRide, onOpenSecret, discoveredSecrets }) => {
  const [showBtn, setShowBtn] = useState(false);
  const { playSfx } = useBackgroundMusic();

  useEffect(() => {
    const t = setTimeout(() => setShowBtn(true), 4000);
    return () => clearTimeout(t);
  }, []);

  return (
    <div className="scene">
      {/* Background — slow zoom in, intimate camera move toward the characters */}
      <motion.img
        src="/images/tender_hug.jpg"
        alt="Tender embrace"
        className="scene-env"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1.13 }}
        transition={{ duration: 18, ease: 'linear' }}
        style={{ objectPosition: 'center 40%' }}
      />

      {/* Romantic pink lens flare glow */}
      <div className="warm-glow" style={{
        width: 500, height: 500, top: '15%', left: '30%',
        background: 'radial-gradient(circle, rgba(225,29,72,0.15) 0%, rgba(255,150,100,0.08) 50%, transparent 70%)',
        zIndex: 3, animationDuration: '7s'
      }} />

      {/* Drifting warm particles — like fairy lights */}
      {[...Array(10)].map((_, i) => (
        <div
          key={i}
          className="bokeh"
          style={{
            width: 3 + Math.random() * 5, height: 3 + Math.random() * 5,
            left: `${20 + Math.random() * 60}%`,
            bottom: `${25 + Math.random() * 55}%`,
            background: i % 2 === 0 ? 'rgba(242,161,182,0.8)' : 'rgba(255,201,121,0.7)',
            animationDuration: `${5 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 3}s`,
            filter: `blur(${1 + Math.random() * 1.5}px)`,
            zIndex: 7
          }}
        />
      ))}

      {/* Secret heart */}
      {!discoveredSecrets.includes('secret-4') && (
        <button
          className="secret-heart"
          style={{ top: '22%', left: '18%' }}
          onClick={() => onOpenSecret('secret-4')}
          aria-label="Discover secret note"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}

      <div className="vignette" />
      <div className="atmos-bottom" />
      <div className="atmos-sides" />

      {/* Environmental narration */}
      <div className="subtitle-bar" style={{ bottom: 'clamp(120px, 22vh, 180px)' }}>
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.8 }}
          className="film-title"
          style={{ fontSize: 'clamp(2rem, 5vw, 3rem)', textAlign: 'center', display: 'block' }}
        >
          Happy Birthday, {STORY_CONFIG.girlName}. ❤️
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1, delay: 1.8 }}
          className="subtitle-text"
          style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', marginTop: '0.6rem' }}
        >
          "{STORY_CONFIG.hug.wishText}"
        </motion.div>
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.8, delay: 2.8 }}
          style={{
            marginTop: '0.4rem', fontSize: '0.85rem',
            color: 'rgba(203,213,225,0.7)', fontFamily: 'var(--font-serif)',
            fontStyle: 'italic', textAlign: 'center',
            textShadow: '0 1px 8px rgba(0,0,0,0.8)'
          }}
        >
          {STORY_CONFIG.hug.warmthText}
        </motion.div>
      </div>

      {/* Continue cue */}
      {showBtn && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.7 }}
          onClick={() => { playSfx('sparkle'); onGoForRide(); }}
          className="film-btn film-btn-primary"
          style={{
            position: 'absolute', zIndex: 60,
            bottom: 'clamp(52px, 9vh, 76px)', left: '50%',
            transform: 'translateX(-50%)',
            fontSize: '0.85rem', padding: '0.7rem 1.8rem'
          }}
        >
          {STORY_CONFIG.hug.buttonText}
        </motion.button>
      )}
    </div>
  );
};
