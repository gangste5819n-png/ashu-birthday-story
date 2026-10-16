import React, { useState } from 'react';
import { VolumeX, Music } from 'lucide-react';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';
import { motion, AnimatePresence } from 'framer-motion';

export const MusicPlayer: React.FC = () => {
  const {
    isPlaying, isMuted, volume,
    togglePlay, toggleMute, setVolume,
    sfxEnabled, toggleSfx,
    fireworksSoundEnabled, fireworksVolume,
    setFireworksVolume, toggleFireworksSound
  } = useBackgroundMusic();

  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className="music-ctrl"
      style={{
        position: 'fixed', top: 'clamp(28px, 5vh, 48px)', right: '1.25rem',
        zIndex: 90, userSelect: 'none', pointerEvents: 'auto'
      }}
    >
      {/* EQ bars or muted icon — clicking toggles mute */}
      <button
        onClick={toggleMute}
        style={{ background: 'none', border: 'none', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6, color: 'rgba(255,201,121,0.85)', padding: '0 2px' }}
        title={isMuted ? 'Unmute' : 'Mute'}
        aria-label={isMuted ? 'Unmute music' : 'Mute music'}
      >
        {isMuted || volume === 0 ? (
          <VolumeX size={13} color="rgba(251,113,133,0.85)" />
        ) : isPlaying ? (
          <div style={{ display: 'flex', alignItems: 'flex-end', gap: 2, height: 14 }}>
            <span className="eq-bar" style={{ height: 6 }} />
            <span className="eq-bar" style={{ height: 10 }} />
            <span className="eq-bar" style={{ height: 7 }} />
            <span className="eq-bar" style={{ height: 12 }} />
          </div>
        ) : (
          <Music size={13} color="rgba(255,201,121,0.6)" />
        )}
      </button>

      <button
        onClick={() => setIsExpanded(!isExpanded)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer',
          fontSize: '0.65rem', color: 'rgba(255,201,121,0.65)',
          letterSpacing: '0.12em', fontFamily: 'var(--font-body)',
          padding: '0 2px'
        }}
      >
        ♫
      </button>

      {/* Expanded panel */}
      <AnimatePresence>
        {isExpanded && (
          <motion.div
            initial={{ opacity: 0, y: -8, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: -8, scale: 0.95 }}
            transition={{ duration: 0.25 }}
            style={{
              position: 'absolute', top: '100%', right: 0, marginTop: 8,
              width: 220, padding: '0.9rem 1rem',
              background: 'rgba(4,13,26,0.95)',
              backdropFilter: 'blur(20px)',
              border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 12,
              boxShadow: '0 16px 48px rgba(0,0,0,0.6)',
              display: 'flex', flexDirection: 'column', gap: '0.75rem'
            }}
          >
            {/* Music vol */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(253,230,138,0.75)', fontFamily: 'var(--font-body)' }}>
                <span>Music</span>
                <span>{Math.round((isMuted ? 0 : volume) * 100)}%</span>
              </div>
              <input
                type="range" min="0" max="1" step="0.02"
                value={isMuted ? 0 : volume}
                onChange={e => setVolume(parseFloat(e.target.value))}
                style={{ width: '100%', accentColor: '#fcd34d', height: 3 }}
                aria-label="Music volume"
              />
            </div>
            {/* Fireworks vol */}
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(253,164,175,0.75)', fontFamily: 'var(--font-body)' }}>
                <span>Fireworks</span>
                <button onClick={toggleFireworksSound} style={{ background: 'none', border: '1px solid rgba(251,113,133,0.3)', borderRadius: 99, padding: '1px 6px', cursor: 'pointer', fontSize: '0.6rem', color: fireworksSoundEnabled ? '#fda4af' : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
                  {fireworksSoundEnabled ? 'ON' : 'OFF'}
                </button>
              </div>
              {fireworksSoundEnabled && (
                <input
                  type="range" min="0" max="1" step="0.02"
                  value={fireworksVolume}
                  onChange={e => setFireworksVolume(parseFloat(e.target.value))}
                  style={{ width: '100%', accentColor: '#fb7185', height: 3 }}
                  aria-label="Fireworks volume"
                />
              )}
            </div>
            {/* Story chimes */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', paddingTop: '0.5rem', borderTop: '1px solid rgba(255,255,255,0.08)', fontSize: '0.65rem', letterSpacing: '0.1em', textTransform: 'uppercase', color: 'rgba(253,230,138,0.6)', fontFamily: 'var(--font-body)' }}>
              <span>Chimes</span>
              <button onClick={toggleSfx} style={{ background: 'none', border: '1px solid rgba(253,230,138,0.25)', borderRadius: 99, padding: '1px 6px', cursor: 'pointer', fontSize: '0.6rem', color: sfxEnabled ? 'rgba(253,230,138,0.85)' : 'rgba(255,255,255,0.3)', fontFamily: 'var(--font-body)' }}>
                {sfxEnabled ? 'ON' : 'OFF'}
              </button>
            </div>
            {/* Play toggle */}
            <button
              onClick={togglePlay}
              style={{
                marginTop: 2, padding: '0.5rem', borderRadius: 8,
                background: 'rgba(255,201,121,0.1)', border: '1px solid rgba(255,201,121,0.2)',
                color: 'rgba(255,201,121,0.85)', cursor: 'pointer',
                fontSize: '0.72rem', fontFamily: 'var(--font-body)', letterSpacing: '0.08em'
              }}
            >
              {isPlaying ? '⏸ Pause' : '▶ Play'}
            </button>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};
