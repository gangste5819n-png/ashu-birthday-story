import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { STORY_CONFIG } from '../config/storyConfig';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface BouquetSceneProps {
  onGiveHug: () => void;
  onOpenSecret: (id: string) => void;
  discoveredSecrets: string[];
}

export const BouquetScene: React.FC<BouquetSceneProps> = ({ onGiveHug, onOpenSecret, discoveredSecrets }) => {
  const [activeFlower, setActiveFlower] = useState<number | null>(null);
  const [openedFlowers, setOpenedFlowers] = useState<number[]>([]);
  const { playSfx } = useBackgroundMusic();

  // Positions chosen to look like they're on actual flower stems in the bouquet
  const positions = [
    { top: '18%', left: '24%' },
    { top: '12%', left: '48%' },
    { top: '20%', right: '22%' },
    { top: '38%', left: '16%' },
    { top: '35%', right: '18%' },
  ];

  // Message card offset — appears above/beside the pip
  const cardOffsets = [
    { bottom: '100%', left: '-10px', marginBottom: 8 },
    { bottom: '100%', left: '50%', transform: 'translateX(-50%)', marginBottom: 8 },
    { bottom: '100%', right: '-10px', marginBottom: 8 },
    { bottom: '100%', left: '-10px', marginBottom: 8 },
    { bottom: '100%', right: '-10px', marginBottom: 8 },
  ];

  const handleFlower = (id: number) => {
    playSfx('sparkle');
    setActiveFlower(prev => prev === id ? null : id);
    if (!openedFlowers.includes(id)) setOpenedFlowers(p => [...p, id]);
  };

  return (
    <div className="scene">
      {/* Background — bouquet fills frame */}
      <motion.img
        src="/images/bouquet_closeup.jpg"
        alt="Bouquet of roses"
        className="scene-env"
        initial={{ scale: 1.06 }}
        animate={{ scale: 1.01 }}
        transition={{ duration: 10, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
        style={{ objectPosition: 'center 35%' }}
      />

      {/* Falling rose petal effect */}
      {[...Array(8)].map((_, i) => (
        <div
          key={i}
          className="petal"
          style={{
            left: `${10 + Math.random() * 80}%`,
            top: `${-5 + Math.random() * 20}%`,
            width: 8, height: 10,
            background: `rgba(${Math.floor(200 + Math.random() * 55)},${Math.floor(50 + Math.random() * 80)},${Math.floor(70 + Math.random() * 60)},0.6)`,
            borderRadius: '50% 0 50% 0',
            animationDuration: `${6 + Math.random() * 6}s`,
            animationDelay: `${Math.random() * 4}s`,
            filter: 'blur(0.5px)', zIndex: 6
          }}
        />
      ))}

      {/* Warm floral glow */}
      <div className="warm-glow" style={{
        width: 350, height: 350, top: '20%', left: '40%',
        background: 'radial-gradient(circle, rgba(225,29,72,0.18), transparent)',
        zIndex: 3
      }} />

      {/* Secret heart in bouquet ribbon */}
      {!discoveredSecrets.includes('secret-3') && (
        <button
          className="secret-heart"
          style={{ bottom: '45%', right: '36%' }}
          onClick={() => onOpenSecret('secret-3')}
          aria-label="Discover secret note"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}

      <div className="vignette" />
      <div className="atmos-bottom" />
      <div className="atmos-sides" />

      {/* Interactive flower pips — placed over bouquet */}
      {STORY_CONFIG.bouquet.flowers.map((flower, idx) => {
        const pos = positions[idx];
        const isOpen = activeFlower === flower.id;
        const isRead = openedFlowers.includes(flower.id);
        const cardOff = cardOffsets[idx];

        return (
          <div
            key={flower.id}
            className="flower-pip"
            style={{ ...pos, zIndex: 40 }}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.2 * idx + 0.4, type: 'spring' }}
            >
              <div
                className={`flower-pip-inner ${isRead ? 'opened' : ''}`}
                onClick={() => handleFlower(flower.id)}
                role="button"
                tabIndex={0}
                onKeyPress={e => e.key === 'Enter' && handleFlower(flower.id)}
                aria-label={`Rose: ${flower.title}`}
                style={{ background: isRead && !isOpen ? 'rgba(4,13,26,0.75)' : undefined }}
              >
                {isRead ? '✓' : '🌹'}
              </div>
            </motion.div>

            {/* Message card — appears directly in environment above pip */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: 8, scale: 0.9 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: 6, scale: 0.92 }}
                  transition={{ duration: 0.3 }}
                  className="flower-message-card"
                  style={{ position: 'absolute', ...cardOff, bottom: 'calc(100% + 8px)' }}
                >
                  <div style={{
                    fontSize: '0.6rem', letterSpacing: '0.15em', textTransform: 'uppercase',
                    color: 'rgba(253,164,175,0.8)', marginBottom: '0.3rem',
                    fontFamily: 'var(--font-body)'
                  }}>
                    🌹 {flower.title}
                  </div>
                  <p className="font-hand" style={{ fontSize: '1rem', color: 'rgba(255,246,236,0.95)', lineHeight: 1.45 }}>
                    "{flower.message}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Bottom narration */}
      <div className="subtitle-bar" style={{ bottom: 'clamp(100px, 18vh, 150px)', pointerEvents: 'none' }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            fontSize: '0.7rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(253,164,175,0.75)', fontFamily: 'var(--font-body)',
            marginBottom: '0.4rem'
          }}
        >
          🌹 A bouquet for you
        </motion.div>
        <div className="subtitle-text" style={{ fontSize: 'clamp(0.9rem, 2vw, 1.1rem)' }}>
          {STORY_CONFIG.bouquet.heading}
        </div>
        <div style={{ marginTop: '0.3rem', fontSize: '0.72rem', color: 'rgba(203,213,225,0.65)', fontFamily: 'var(--font-body)', letterSpacing: '0.05em' }}>
          Tap each rose · {openedFlowers.length}/{STORY_CONFIG.bouquet.flowers.length} opened
        </div>
      </div>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        onClick={() => { playSfx('hug'); onGiveHug(); }}
        className="film-btn film-btn-primary"
        style={{
          position: 'absolute', zIndex: 60,
          bottom: 'clamp(52px, 9vh, 76px)', left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.85rem', padding: '0.7rem 1.8rem'
        }}
      >
        {STORY_CONFIG.bouquet.buttonText}
      </motion.button>
    </div>
  );
};
