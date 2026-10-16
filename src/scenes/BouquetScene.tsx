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

  // Positions on actual flower blossoms in the bouquet, comfortably inside the safe viewport
  const positions = [
    { top: '24%', left: '26%' },
    { top: '16%', left: '50%', transform: 'translateX(-50%)' },
    { top: '24%', right: '26%' },
    { top: '44%', left: '20%' },
    { top: '42%', right: '22%' },
  ];

  // Intelligent card offsets: cards near the top extend DOWNWARDS; cards lower extend UPWARDS
  const cardConfigs = [
    {
      style: { top: 'calc(100% + 14px)', left: '-16px' },
      pointerClass: 'pointer-top-left'
    },
    {
      style: { top: 'calc(100% + 14px)', left: '50%', transform: 'translateX(-50%)' },
      pointerClass: 'pointer-top-center'
    },
    {
      style: { top: 'calc(100% + 14px)', right: '-16px' },
      pointerClass: 'pointer-top-right'
    },
    {
      style: { bottom: 'calc(100% + 14px)', left: '-16px' },
      pointerClass: 'pointer-bottom-left'
    },
    {
      style: { bottom: 'calc(100% + 14px)', right: '-16px' },
      pointerClass: 'pointer-bottom-right'
    },
  ];

  const handleFlower = (id: number) => {
    playSfx('sparkle');
    setActiveFlower(prev => prev === id ? null : id);
    if (!openedFlowers.includes(id)) setOpenedFlowers(p => [...p, id]);
  };

  return (
    <div className="scene" onClick={() => activeFlower !== null && setActiveFlower(null)}>
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
          onClick={(e) => {
            e.stopPropagation();
            onOpenSecret('secret-3');
          }}
          aria-label="Discover secret note"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}

      {/* Atmospheric overlays */}
      <div className="vignette" />
      <div className="atmos-bottom" />
      <div className="atmos-sides" />

      {/* Soft background scrim behind active card for focus & readability */}
      <AnimatePresence>
        {activeFlower !== null && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            className="flower-backdrop-scrim"
            onClick={() => setActiveFlower(null)}
          />
        )}
      </AnimatePresence>

      {/* Interactive flower pips — placed over bouquet roses */}
      {STORY_CONFIG.bouquet.flowers.map((flower, idx) => {
        const pos = positions[idx];
        const isOpen = activeFlower === flower.id;
        const isRead = openedFlowers.includes(flower.id);
        const cardConfig = cardConfigs[idx];

        return (
          <div
            key={flower.id}
            className={`flower-pip ${isOpen ? 'active' : ''} ${isRead ? 'opened' : ''}`}
            style={{ ...pos, zIndex: isOpen ? 65 : 45 }}
            onClick={(e) => e.stopPropagation()}
          >
            <motion.div
              initial={{ scale: 0, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{ delay: 0.15 * idx + 0.3, type: 'spring' }}
            >
              <div
                className="flower-pip-inner"
                onClick={() => handleFlower(flower.id)}
                role="button"
                tabIndex={0}
                onKeyDown={e => e.key === 'Enter' && handleFlower(flower.id)}
                aria-label={`Rose: ${flower.title}`}
              >
                {isOpen ? '✨' : isRead ? '✓' : '🌹'}
              </div>
            </motion.div>

            {/* High-contrast ivory message card */}
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  initial={{ opacity: 0, y: cardConfig.style.top ? -8 : 8, scale: 0.94 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.94 }}
                  transition={{ duration: 0.25, ease: 'easeOut' }}
                  className={`flower-message-card ${cardConfig.pointerClass}`}
                  style={{ ...cardConfig.style }}
                  onClick={e => e.stopPropagation()}
                >
                  {/* Header: title & close button */}
                  <div style={{
                    display: 'flex',
                    alignItems: 'center',
                    justifyContent: 'space-between',
                    gap: '0.5rem',
                    paddingBottom: '0.45rem',
                    borderBottom: '1px solid rgba(225, 29, 72, 0.15)',
                    marginBottom: '0.45rem'
                  }}>
                    <span style={{
                      fontSize: '0.74rem',
                      fontWeight: 700,
                      letterSpacing: '0.14em',
                      textTransform: 'uppercase',
                      color: '#9f1239',
                      fontFamily: 'var(--font-body)',
                      display: 'flex',
                      alignItems: 'center',
                      gap: '0.35rem'
                    }}>
                      <span>🌹</span>
                      <span>{flower.title}</span>
                    </span>
                    <button
                      onClick={(e) => {
                        e.stopPropagation();
                        setActiveFlower(null);
                      }}
                      aria-label="Close message"
                      style={{
                        background: 'none',
                        border: 'none',
                        cursor: 'pointer',
                        color: '#78716c',
                        fontSize: '0.95rem',
                        lineHeight: 1,
                        padding: '0.2rem',
                        borderRadius: '4px',
                        transition: 'color 0.2s ease'
                      }}
                      onMouseEnter={e => (e.currentTarget.style.color = '#1c1917')}
                      onMouseLeave={e => (e.currentTarget.style.color = '#78716c')}
                    >
                      ✕
                    </button>
                  </div>

                  {/* Dark, crisp, readable message text */}
                  <p
                    className="font-hand"
                    style={{
                      fontSize: 'clamp(1.15rem, 2.2vw, 1.35rem)',
                      color: '#1c1917',
                      fontWeight: 600,
                      lineHeight: 1.55,
                      margin: 0
                    }}
                  >
                    "{flower.message}"
                  </p>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        );
      })}

      {/* Bottom narration & 5/5 progress feedback */}
      <div className="subtitle-bar" style={{ bottom: 'clamp(100px, 18vh, 150px)', pointerEvents: 'none', zIndex: 50 }}>
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1 }}
          style={{
            fontSize: '0.72rem', letterSpacing: '0.18em', textTransform: 'uppercase',
            color: 'rgba(253,164,175,0.85)', fontFamily: 'var(--font-body)',
            marginBottom: '0.35rem'
          }}
        >
          🌹 A bouquet for you
        </motion.div>
        <div className="subtitle-text" style={{ fontSize: 'clamp(0.95rem, 2vw, 1.15rem)' }}>
          {STORY_CONFIG.bouquet.heading}
        </div>
        <div style={{
          marginTop: '0.35rem',
          fontSize: '0.75rem',
          color: openedFlowers.length === STORY_CONFIG.bouquet.flowers.length ? '#fde68a' : 'rgba(203,213,225,0.75)',
          fontFamily: 'var(--font-body)',
          letterSpacing: '0.06em'
        }}>
          {openedFlowers.length === STORY_CONFIG.bouquet.flowers.length
            ? `✨ All ${STORY_CONFIG.bouquet.flowers.length} rose wishes discovered!`
            : `Tap each rose · ${openedFlowers.length}/${STORY_CONFIG.bouquet.flowers.length} opened`}
        </div>
      </div>

      {/* Continue button */}
      <motion.button
        initial={{ opacity: 0, y: 12 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.5 }}
        onClick={(e) => {
          e.stopPropagation();
          playSfx('hug');
          onGiveHug();
        }}
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
