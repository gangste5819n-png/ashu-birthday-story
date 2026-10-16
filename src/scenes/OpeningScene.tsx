import React, { useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { STORY_CONFIG } from '../config/storyConfig';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface OpeningSceneProps {
  onBegin: () => void;
  onOpenSecret: (id: string) => void;
  discoveredSecrets: string[];
}

export const OpeningScene: React.FC<OpeningSceneProps> = ({ onBegin, onOpenSecret, discoveredSecrets }) => {
  const { startMusic, playSfx } = useBackgroundMusic();
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Atmospheric particle canvas — bokeh city lights
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const particles: { x: number; y: number; r: number; alpha: number; speed: number; color: string; dy: number }[] = [];
    const colors = ['rgba(255,201,121,', 'rgba(242,161,182,', 'rgba(183,164,232,', 'rgba(255,255,255,'];

    for (let i = 0; i < 55; i++) {
      particles.push({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        r: Math.random() * 3 + 0.8,
        alpha: Math.random() * 0.5 + 0.15,
        speed: Math.random() * 0.6 + 0.15,
        color: colors[Math.floor(Math.random() * colors.length)],
        dy: -Math.random() * 0.3 - 0.05
      });
    }

    let frame = 0;
    let raf: number;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      frame++;
      particles.forEach(p => {
        p.y += p.dy;
        p.alpha = 0.15 + Math.abs(Math.sin(frame * p.speed * 0.02)) * 0.5;
        if (p.y < -10) { p.y = canvas.height + 10; p.x = Math.random() * canvas.width; }

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = p.color + p.alpha + ')';
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color + '0.6)';
        ctx.fill();
      });
      raf = requestAnimationFrame(draw);
    };
    draw();

    const resize = () => { canvas.width = window.innerWidth; canvas.height = window.innerHeight; };
    window.addEventListener('resize', resize);
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); };
  }, []);

  const handleStart = async () => {
    playSfx('sparkle');
    await startMusic();
    onBegin();
  };

  return (
    <div className="scene" style={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
      {/* Parallax background — slow rightward pan simulating aerial camera */}
      <motion.img
        src="/images/opening_skyline.jpg"
        alt="Twilight City"
        className="scene-env"
        initial={{ scale: 1.12, x: -20 }}
        animate={{ scale: 1.04, x: 20 }}
        transition={{ duration: 22, ease: 'easeInOut', repeat: Infinity, repeatType: 'reverse' }}
      />

      {/* Color grading layers */}
      <div style={{
        position: 'absolute', inset: 0,
        background: 'linear-gradient(180deg, rgba(15,5,40,0.3) 0%, transparent 40%, rgba(4,13,26,0.6) 100%)',
        mixBlendMode: 'multiply',
        pointerEvents: 'none', zIndex: 1
      }} />

      {/* Atmospheric overlays */}
      <div className="vignette" />
      <div className="atmos-bottom" />
      <div className="atmos-top" />
      <div className="atmos-sides" />

      {/* Bokeh particle layer */}
      <canvas
        ref={canvasRef}
        style={{ position: 'absolute', inset: 0, zIndex: 8, pointerEvents: 'none', mixBlendMode: 'screen', opacity: 0.65 }}
      />

      {/* Secret heart in city */}
      {!discoveredSecrets.includes('secret-1') && (
        <button
          className="secret-heart"
          style={{ bottom: '22%', right: '18%' }}
          onClick={() => onOpenSecret('secret-1')}
          title="A glowing window in the night"
          aria-label="Discover secret note"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}
      {discoveredSecrets.includes('secret-1') && (
        <div className="secret-heart found" style={{ bottom: '22%', right: '18%' }}>
          <span style={{ fontSize: '0.75rem' }}>✦</span>
        </div>
      )}

      {/* Hero content — centered, environmental */}
      <div style={{
        position: 'relative', zIndex: 30,
        display: 'flex', flexDirection: 'column',
        alignItems: 'center', textAlign: 'center', gap: '1.5rem',
        padding: '0 1.5rem', maxWidth: 560
      }}>
        {/* Dedication badge */}
        <motion.div
          initial={{ opacity: 0, y: -18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          style={{
            fontSize: '0.65rem', letterSpacing: '0.22em', textTransform: 'uppercase',
            color: 'rgba(255,201,121,0.72)', fontFamily: 'var(--font-body)',
            borderBottom: '1px solid rgba(255,201,121,0.2)',
            paddingBottom: '0.6rem',
          }}
        >
          For {STORY_CONFIG.girlName} &nbsp;·&nbsp; With all my heart
        </motion.div>

        {/* Main title */}
        <motion.h1
          className="film-title"
          initial={{ opacity: 0, scale: 0.92, y: 10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ duration: 1.6, delay: 0.7, ease: [0.16, 1, 0.3, 1] }}
          style={{ fontSize: 'clamp(3.5rem, 10vw, 6.5rem)' }}
        >
          {STORY_CONFIG.opening.title}
        </motion.h1>

        {/* Subtitle */}
        <motion.p
          className="film-narration"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.2, delay: 1.3 }}
          style={{ fontSize: 'clamp(0.95rem, 2vw, 1.2rem)', color: 'rgba(255,246,236,0.75)' }}
        >
          "{STORY_CONFIG.opening.subtitle}"
        </motion.p>

        {/* Begin button */}
        <motion.div
          initial={{ opacity: 0, y: 18 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 1.8 }}
          style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', gap: '0.75rem', paddingTop: '0.5rem' }}
        >
          <button
            onClick={handleStart}
            className="film-btn film-btn-primary"
            style={{ fontSize: '0.95rem', padding: '0.8rem 2.2rem' }}
          >
            <span>{STORY_CONFIG.opening.buttonText}</span>
            <span style={{ fontSize: '0.9rem', marginLeft: 2 }}>→</span>
          </button>
          <span style={{ fontSize: '0.65rem', letterSpacing: '0.15em', color: 'rgba(255,201,121,0.5)', fontFamily: 'var(--font-body)', textTransform: 'uppercase' }}>
            ♫ Best with sound
          </span>
        </motion.div>
      </div>
    </div>
  );
};
