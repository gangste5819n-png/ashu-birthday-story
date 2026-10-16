import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_CONFIG } from '../config/storyConfig';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface ScooterSceneProps {
  onArriveAtCafe: () => void;
  onOpenSecret: (id: string) => void;
  discoveredSecrets: string[];
}

export const ScooterScene: React.FC<ScooterSceneProps> = ({
  onArriveAtCafe,
  onOpenSecret,
  discoveredSecrets
}) => {
  const [selectedRoute, setSelectedRoute] = useState<'city' | 'riverside' | 'direct'>('direct');
  const { playSfx } = useBackgroundMusic();

  const currentRoute = STORY_CONFIG.scooter.routes.find(r => r.id === selectedRoute) || STORY_CONFIG.scooter.routes[0];

  const handleSelectRoute = (id: 'city' | 'riverside' | 'direct') => {
    playSfx('sparkle');
    setSelectedRoute(id);
  };

  return (
    <div className="scene">
      {/* Background artwork with cinematic motion and crossfade when switching routes */}
      <AnimatePresence mode="wait">
        <motion.img
          key={currentRoute.bgImage}
          src={currentRoute.bgImage}
          alt={currentRoute.name}
          className="scene-env"
          initial={{ scale: 1.05, opacity: 0.7 }}
          animate={{ scale: 1.12, opacity: 1 }}
          exit={{ opacity: 0.4 }}
          transition={{
            scale: { duration: 20, ease: 'linear' },
            opacity: { duration: 0.8 }
          }}
          style={{ objectPosition: 'center 45%' }}
        />
      </AnimatePresence>

      {/* Atmospheric Overlays */}
      <div className="vignette" />
      <div className="atmos-bottom" />
      <div className="atmos-sides" />
      <div className="atmos-top" />

      {/* Warm headlight glow emanating from bottom center */}
      <div
        className="warm-glow"
        style={{
          width: 600,
          height: 350,
          bottom: '10%',
          left: '50%',
          transform: 'translateX(-50%)',
          background: 'radial-gradient(ellipse, rgba(255,201,121,0.2) 0%, rgba(255,160,80,0.08) 50%, transparent 75%)',
          zIndex: 8
        }}
      />

      {/* Dynamic passing street lights / neon streaks */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden" style={{ zIndex: 12 }}>
        {[...Array(5)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ x: '120vw', y: `${30 + i * 12}%`, opacity: 0 }}
            animate={{ x: '-40vw', opacity: [0, 0.6, 0] }}
            transition={{
              duration: 2.2 + i * 0.4,
              repeat: Infinity,
              delay: i * 0.7,
              ease: 'easeIn'
            }}
            style={{
              position: 'absolute',
              width: 180 + i * 30,
              height: 2,
              background: 'linear-gradient(90deg, transparent, rgba(255,215,140,0.8), transparent)',
              transform: 'rotate(-8deg)',
              filter: 'blur(1px)'
            }}
          />
        ))}
      </div>

      {/* Drifting warm bokeh particles representing distant city lights */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="bokeh"
          style={{
            width: 4 + Math.random() * 6,
            height: 4 + Math.random() * 6,
            left: `${15 + Math.random() * 70}%`,
            bottom: `${30 + Math.random() * 45}%`,
            background: i % 2 === 0 ? 'rgba(255,201,121,0.7)' : 'rgba(255,120,80,0.6)',
            animationDuration: `${4 + Math.random() * 4}s`,
            animationDelay: `${Math.random() * 2}s`,
            filter: `blur(${1 + Math.random()}px)`,
            zIndex: 14
          }}
        />
      ))}

      {/* Secret Heart along the illuminated street */}
      {!discoveredSecrets.includes('secret-4') && (
        <button
          className="secret-heart"
          style={{ bottom: '38%', left: '16%' }}
          onClick={() => onOpenSecret('secret-4')}
          aria-label="Discover secret note"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}

      {/* Discreet top scene badge */}
      <div className="scene-badge">
        <span>🛵</span>
        <span>{STORY_CONFIG.scooter.badgeText}</span>
      </div>

      {/* Lower third: Cinematic Subtitles & Route Interactivity */}
      <div
        className="subtitle-bar"
        style={{
          bottom: 'clamp(95px, 16vh, 140px)',
          pointerEvents: 'auto',
          maxWidth: 'min(720px, 92vw)'
        }}
      >
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          className="film-title"
          style={{ fontSize: 'clamp(1.7rem, 4vw, 2.4rem)', marginBottom: '0.4rem' }}
        >
          {STORY_CONFIG.scooter.heading}
        </motion.div>

        {/* Dynamic Route Narration as film subtitle */}
        <AnimatePresence mode="wait">
          <motion.div
            key={currentRoute.id}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.5 }}
            className="subtitle-text"
            style={{ fontSize: 'clamp(0.95rem, 1.8vw, 1.15rem)', marginBottom: '1.25rem' }}
          >
            "{currentRoute.narration}"
          </motion.div>
        </AnimatePresence>

        {/* Minimal environmental route selection pills */}
        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '0.6rem',
            marginBottom: '1rem'
          }}
        >
          {STORY_CONFIG.scooter.routes.map(route => {
            const isActive = selectedRoute === route.id;
            return (
              <button
                key={route.id}
                onClick={() => handleSelectRoute(route.id as any)}
                style={{
                  background: isActive ? 'rgba(255, 201, 121, 0.22)' : 'rgba(4, 13, 26, 0.65)',
                  border: isActive ? '1px solid rgba(255, 201, 121, 0.85)' : '1px solid rgba(255, 255, 255, 0.15)',
                  color: isActive ? '#fff6ec' : 'rgba(255, 255, 255, 0.7)',
                  borderRadius: 99,
                  padding: '0.45rem 1.1rem',
                  fontSize: '0.8rem',
                  fontFamily: 'var(--font-body)',
                  fontWeight: 500,
                  cursor: 'pointer',
                  backdropFilter: 'blur(12px)',
                  boxShadow: isActive ? '0 0 20px rgba(255,201,121,0.35)' : 'none',
                  transform: isActive ? 'scale(1.05)' : 'scale(1)',
                  transition: 'all 0.3s cubic-bezier(0.16, 1, 0.3, 1)'
                }}
              >
                <span>{route.name}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Arrive at Chai Point Continue Button */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.6 }}
        onClick={() => {
          playSfx('tea');
          onArriveAtCafe();
        }}
        className="film-btn film-btn-primary"
        style={{
          position: 'absolute',
          zIndex: 65,
          bottom: 'clamp(36px, 6vh, 60px)',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.9rem',
          padding: '0.75rem 2.2rem'
        }}
      >
        <span>{STORY_CONFIG.scooter.buttonText}</span>
      </motion.button>
    </div>
  );
};
