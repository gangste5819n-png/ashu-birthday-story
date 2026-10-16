import React, { useEffect, useRef, useState, useCallback } from 'react';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface FireworksCanvasProps {
  onWishTriggered?: (wish: string) => void;
  interactive?: boolean;
  onlyHearts?: boolean;
}

interface Particle {
  x: number;
  y: number;
  vx: number;
  vy: number;
  alpha: number;
  decay: number;
  color: string;
  size: number;
  sparkle?: boolean;
}

interface Rocket {
  x: number;
  y: number;
  targetY: number;
  vy: number;
  color: string;
  isHeart: boolean;
  wishWord?: string;
}

interface FloatingWish {
  id: number;
  text: string;
  x: number;
  y: number;
  alpha: number;
}

const WISH_WORDS = [
  "Endless Happiness ✨",
  "Gentle Peace 🌙",
  "Beautiful Dreams 🌟",
  "Laughter & Joy 😄",
  "Soft Days & Warmth ❤️",
  "Magic in Ordinary Things 💫",
  "Everything You Hope For 💖",
  "A Thousand Smiles 🌹"
];

// Curated colors: pink, gold, purple, blue, white, rose
const FIREWORK_COLORS = [
  '#f43f5e', // rose
  '#fb7185', // pink
  '#fbbf24', // gold amber
  '#c084fc', // purple
  '#38bdf8', // sky blue
  '#f472b6', // soft pink
  '#ffffff', // glistening white
];

export const FireworksCanvas: React.FC<FireworksCanvasProps> = ({
  onWishTriggered,
  interactive = true,
  onlyHearts = false
}) => {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);
  const { playFireworkLaunch, playFireworkBurst, playFireworkSparkle } = useBackgroundMusic();
  const [floatingWishes, setFloatingWishes] = useState<FloatingWish[]>([]);
  const lastTapRef = useRef<number>(0);

  // References for animation state
  const rocketsRef = useRef<Rocket[]>([]);
  const particlesRef = useRef<Particle[]>([]);
  const animFrameRef = useRef<number | null>(null);

  // Helper to create an explosion
  const createExplosion = useCallback((x: number, y: number, color: string, isHeart: boolean) => {
    // Synchronized explosion audio
    playFireworkBurst();
    setTimeout(() => {
      playFireworkSparkle();
    }, 180);

    const particleCount = isHeart ? 75 : 65;

    if (isHeart) {
      // Parametric Heart Formula
      // x = 16 * sin^3(t)
      // y = -(13 * cos(t) - 5 * cos(2t) - 2 * cos(3t) - cos(4t))
      for (let i = 0; i < particleCount; i++) {
        const t = (Math.PI * 2 * i) / particleCount;
        const heartX = 16 * Math.pow(Math.sin(t), 3);
        const heartY = -(13 * Math.cos(t) - 5 * Math.cos(2 * t) - 2 * Math.cos(3 * t) - Math.cos(4 * t));
        const speed = 0.19 + Math.random() * 0.04;

        particlesRef.current.push({
          x,
          y,
          vx: heartX * speed,
          vy: heartY * speed,
          alpha: 1,
          decay: 0.011 + Math.random() * 0.007,
          color: color || '#ff4d6d',
          size: 2.8 + Math.random() * 2,
          sparkle: Math.random() > 0.35
        });
      }
    } else {
      // Circular burst with varied velocities and gravity
      for (let i = 0; i < particleCount; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = 1.4 + Math.random() * 5.6;
        particlesRef.current.push({
          x,
          y,
          vx: Math.cos(angle) * speed,
          vy: Math.sin(angle) * speed,
          alpha: 1,
          decay: 0.014 + Math.random() * 0.014,
          color,
          size: 2.2 + Math.random() * 2.2,
          sparkle: Math.random() > 0.4
        });
      }
    }
  }, [playFireworkBurst, playFireworkSparkle]);

  // Launch a rocket
  const launchRocket = useCallback((
    targetX: number,
    targetY: number,
    isHeart = false,
    wishWord?: string
  ) => {
    playFireworkLaunch();
    const startX = targetX + (Math.random() * 60 - 30);
    const color = FIREWORK_COLORS[Math.floor(Math.random() * FIREWORK_COLORS.length)];
    rocketsRef.current.push({
      x: startX,
      y: window.innerHeight,
      targetY,
      vy: -13 - Math.random() * 3.5,
      color,
      isHeart: onlyHearts ? true : isHeart,
      wishWord
    });
  }, [onlyHearts, playFireworkLaunch]);

  // Handle canvas click / tap
  const handleCanvasClick = useCallback((e: React.MouseEvent<HTMLCanvasElement> | React.TouchEvent<HTMLCanvasElement>) => {
    if (!interactive) return;

    const now = Date.now();
    if (now - lastTapRef.current < 200) return; // rate limit taps
    lastTapRef.current = now;

    let clientX = 0;
    let clientY = 0;

    if ('touches' in e && e.touches.length > 0) {
      clientX = e.touches[0].clientX;
      clientY = e.touches[0].clientY;
    } else if ('clientX' in e) {
      clientX = e.clientX;
      clientY = e.clientY;
    }

    const randomWish = WISH_WORDS[Math.floor(Math.random() * WISH_WORDS.length)];
    const isHeartBurst = onlyHearts ? true : Math.random() > 0.35;

    launchRocket(clientX, clientY, isHeartBurst, randomWish);

    if (onWishTriggered) {
      onWishTriggered(randomWish);
    }

    // Show floating wish text at burst site
    const wishId = Date.now() + Math.random();
    setFloatingWishes(prev => [...prev.slice(-3), {
      id: wishId,
      text: randomWish,
      x: clientX,
      y: clientY,
      alpha: 1
    }]);

    setTimeout(() => {
      setFloatingWishes(prev => prev.filter(w => w.id !== wishId));
    }, 2400);
  }, [interactive, launchRocket, onWishTriggered, onlyHearts]);

  // Main canvas animation loop
  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;

    let width = (canvas.width = window.innerWidth);
    let height = (canvas.height = window.innerHeight);

    const handleResize = () => {
      if (!canvas) return;
      width = canvas.width = window.innerWidth;
      height = canvas.height = window.innerHeight;
    };

    window.addEventListener('resize', handleResize);

    // Auto-launch rockets periodically
    let autoLaunchTimer: ReturnType<typeof setInterval>;
    if (interactive) {
      autoLaunchTimer = setInterval(() => {
        if (rocketsRef.current.length < 3) {
          const targetX = width * 0.15 + Math.random() * (width * 0.7);
          const targetY = height * 0.12 + Math.random() * (height * 0.4);
          const isHeart = onlyHearts ? true : Math.random() > 0.5;
          launchRocket(targetX, targetY, isHeart);
        }
      }, 1600);
    }

    const render = () => {
      // Semi-transparent clear creates smooth cinematic fading motion trails
      ctx.globalCompositeOperation = 'destination-out';
      ctx.fillStyle = 'rgba(0, 0, 0, 0.22)';
      ctx.fillRect(0, 0, width, height);
      ctx.globalCompositeOperation = 'lighter';

      // Update rockets
      for (let i = rocketsRef.current.length - 1; i >= 0; i--) {
        const r = rocketsRef.current[i];
        r.y += r.vy;
        r.vy *= 0.985; // slight air deceleration

        // Draw rocket head & tail trail
        ctx.beginPath();
        ctx.arc(r.x, r.y, 2.8, 0, Math.PI * 2);
        ctx.fillStyle = '#fff';
        ctx.shadowBlur = 8;
        ctx.shadowColor = r.color;
        ctx.fill();

        ctx.beginPath();
        ctx.moveTo(r.x, r.y);
        ctx.lineTo(r.x, r.y - r.vy * 2.2);
        ctx.strokeStyle = r.color;
        ctx.lineWidth = 2.2;
        ctx.stroke();

        // Check if rocket reached apex
        if (r.y <= r.targetY || r.vy >= -1.2) {
          createExplosion(r.x, r.y, r.color, r.isHeart);
          rocketsRef.current.splice(i, 1);
        }
      }

      // Update particles
      for (let i = particlesRef.current.length - 1; i >= 0; i--) {
        const p = particlesRef.current[i];
        p.x += p.vx;
        p.y += p.vy;
        p.vy += 0.055; // natural gravity
        p.vx *= 0.98; // air drag
        p.alpha -= p.decay;

        if (p.alpha <= 0) {
          particlesRef.current.splice(i, 1);
          continue;
        }

        ctx.save();
        ctx.globalAlpha = p.alpha;
        ctx.beginPath();
        ctx.arc(p.x, p.y, p.size, 0, Math.PI * 2);
        ctx.fillStyle = p.sparkle && Math.random() > 0.3 ? '#ffffff' : p.color;
        ctx.shadowBlur = 12;
        ctx.shadowColor = p.color;
        ctx.fill();
        ctx.restore();
      }

      animFrameRef.current = requestAnimationFrame(render);
    };

    render();

    return () => {
      window.removeEventListener('resize', handleResize);
      if (autoLaunchTimer) clearInterval(autoLaunchTimer);
      if (animFrameRef.current) cancelAnimationFrame(animFrameRef.current);
    };
  }, [interactive, launchRocket, createExplosion, onlyHearts]);

  return (
    <div className="absolute inset-0 z-20 pointer-events-none overflow-hidden select-none">
      <canvas
        ref={canvasRef}
        onClick={handleCanvasClick}
        onTouchStart={handleCanvasClick}
        className="w-full h-full pointer-events-auto cursor-crosshair"
      />

      {/* Floating Wish Badges */}
      {floatingWishes.map(wish => (
        <div
          key={wish.id}
          className="absolute transform -translate-x-1/2 -translate-y-1/2 pointer-events-none select-none transition-all duration-1000 ease-out"
          style={{
            left: wish.x,
            top: wish.y - 25,
            animation: 'wish-float-up 2.2s ease-out forwards'
          }}
        >
          <div className="px-3.5 py-1.5 rounded-full text-xs font-semibold tracking-wide text-amber-100 bg-slate-900/85 backdrop-blur-md border border-amber-300/60 shadow-[0_0_20px_rgba(255,201,121,0.6)]">
            {wish.text}
          </div>
        </div>
      ))}

      <style>{`
        @keyframes wish-float-up {
          0% { transform: translate(-50%, 0) scale(0.8); opacity: 0; }
          20% { transform: translate(-50%, -15px) scale(1.08); opacity: 1; }
          80% { transform: translate(-50%, -42px) scale(1); opacity: 0.95; }
          100% { transform: translate(-50%, -70px) scale(0.9); opacity: 0; }
        }
      `}</style>
    </div>
  );
};
