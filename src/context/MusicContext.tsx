import React, { createContext, useContext, useEffect, useRef, useState, useCallback } from 'react';
import { STORY_CONFIG } from '../config/storyConfig';

interface MusicContextType {
  // Background Music
  isPlaying: boolean;
  isMuted: boolean;
  volume: number;
  hasAudioFile: boolean;
  isLoaded: boolean;
  error: string | null;
  togglePlay: () => Promise<void>;
  toggleMute: () => void;
  setVolume: (val: number) => void;
  startMusic: () => Promise<void>;
  ambientSynthActive: boolean;

  // Fireworks Audio
  fireworksSoundEnabled: boolean;
  fireworksVolume: number;
  setFireworksVolume: (val: number) => void;
  toggleFireworksSound: () => void;
  playFireworkLaunch: () => void;
  playFireworkBurst: () => void;
  playFireworkSparkle: () => void;

  // General SFX
  sfxEnabled: boolean;
  toggleSfx: () => void;
  playSfx: (type: 'sparkle' | 'chime' | 'paper' | 'tea' | 'hug') => void;
}

const MusicContext = createContext<MusicContextType | null>(null);

export const MusicProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const audioRef = useRef<HTMLAudioElement | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [isMuted, setIsMuted] = useState(false);
  const [volume, setVolumeState] = useState(STORY_CONFIG.audio.initialMusicVolume);
  const [hasAudioFile, setHasAudioFile] = useState(true);
  const [isLoaded, setIsLoaded] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ambientSynthActive, setAmbientSynthActive] = useState(false);

  // Fireworks Audio Controls
  const [fireworksSoundEnabled, setFireworksSoundEnabled] = useState(true);
  const [fireworksVolume, setFireworksVolumeState] = useState(STORY_CONFIG.audio.initialFireworksVolume);

  // General SFX Controls
  const [sfxEnabled, setSfxEnabled] = useState(true);

  // Web Audio Context for synthesis and mixing
  const audioCtxRef = useRef<AudioContext | null>(null);
  const ambientIntervalRef = useRef<number | null>(null);

  // Sound effect audio buffers if local files exist
  const launchBufferRef = useRef<AudioBuffer | null>(null);
  const burstBufferRef = useRef<AudioBuffer | null>(null);
  const sparkleBufferRef = useRef<AudioBuffer | null>(null);

  const getAudioContext = useCallback(() => {
    if (!audioCtxRef.current) {
      const AudioCtx = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      if (AudioCtx) {
        audioCtxRef.current = new AudioCtx();
      }
    }
    if (audioCtxRef.current && audioCtxRef.current.state === 'suspended') {
      audioCtxRef.current.resume();
    }
    return audioCtxRef.current;
  }, []);

  // Try loading local audio buffers for fireworks if available
  useEffect(() => {
    const loadSound = async (path: string, ref: React.MutableRefObject<AudioBuffer | null>) => {
      try {
        const res = await fetch(path);
        if (res.ok) {
          const arrayBuffer = await res.arrayBuffer();
          const ctx = getAudioContext();
          if (ctx) {
            const decoded = await ctx.decodeAudioData(arrayBuffer);
            ref.current = decoded;
          }
        }
      } catch {
        // Fallback to Web Audio synthesis
      }
    };

    loadSound(STORY_CONFIG.audio.fireworksLaunchPath, launchBufferRef);
    loadSound(STORY_CONFIG.audio.fireworksBurstPath, burstBufferRef);
    loadSound(STORY_CONFIG.audio.fireworksSparklePath, sparkleBufferRef);
  }, [getAudioContext]);

  // Gentle synthesizer for ambient romantic melody if birthday-song.mp3 is not yet placed
  const playAmbientNote = useCallback((freq: number, duration: number, gainLevel: number) => {
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(freq, now);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(gainLevel * (isMuted ? 0 : volume) * 0.4, now + 0.1);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + duration);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + duration + 0.1);
    } catch {
      // Ignore
    }
  }, [getAudioContext, isMuted, volume]);

  const startAmbientSynth = useCallback(() => {
    if (ambientIntervalRef.current) return;
    setAmbientSynthActive(true);
    setIsPlaying(true);

    // Warm, quiet arpeggiated piano-like progression: C - G - Am - F
    const chords = [
      [261.63, 329.63, 392.00, 523.25], // C major
      [196.00, 246.94, 293.66, 392.00], // G major
      [220.00, 261.63, 329.63, 440.00], // A minor
      [174.61, 220.00, 261.63, 349.23], // F major
    ];

    let chordIdx = 0;
    let noteIdx = 0;

    ambientIntervalRef.current = window.setInterval(() => {
      const currentChord = chords[chordIdx];
      const freq = currentChord[noteIdx];
      playAmbientNote(freq, 1.8, 0.08);

      noteIdx++;
      if (noteIdx >= currentChord.length) {
        noteIdx = 0;
        chordIdx = (chordIdx + 1) % chords.length;
      }
    }, 650);
  }, [playAmbientNote]);

  const stopAmbientSynth = useCallback(() => {
    if (ambientIntervalRef.current) {
      clearInterval(ambientIntervalRef.current);
      ambientIntervalRef.current = null;
    }
    setAmbientSynthActive(false);
  }, []);

  // Initialize main audio element ONCE at the application level
  useEffect(() => {
    const audio = new Audio();
    audio.src = STORY_CONFIG.audio.musicPath;
    audio.loop = true;
    audio.volume = volume;
    audio.preload = 'auto';

    const handleCanPlay = () => {
      setIsLoaded(true);
      setHasAudioFile(true);
      setError(null);
    };

    const handleError = () => {
      // In development or until the user adds the MP3 file,
      // the browser will fire an error if /audio/birthday-song.mp3 is 404.
      setHasAudioFile(false);
      setIsLoaded(false);
      setError("Place birthday-song.mp3 in public/audio/ to play your song!");
    };

    const handlePlay = () => setIsPlaying(true);
    const handlePause = () => {
      if (!ambientIntervalRef.current) {
        setIsPlaying(false);
      }
    };

    audio.addEventListener('canplay', handleCanPlay);
    audio.addEventListener('error', handleError);
    audio.addEventListener('play', handlePlay);
    audio.addEventListener('pause', handlePause);

    audioRef.current = audio;

    return () => {
      audio.removeEventListener('canplay', handleCanPlay);
      audio.removeEventListener('error', handleError);
      audio.removeEventListener('play', handlePlay);
      audio.removeEventListener('pause', handlePause);
      audio.pause();
      audioRef.current = null;
      if (ambientIntervalRef.current) clearInterval(ambientIntervalRef.current);
    };
  }, []);

  // Set music volume
  const setVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setVolumeState(clamped);
    if (audioRef.current) {
      audioRef.current.volume = clamped;
      if (clamped > 0 && isMuted) {
        audioRef.current.muted = false;
        setIsMuted(false);
      }
    }
  }, [isMuted]);

  // Set fireworks volume
  const setFireworksVolume = useCallback((val: number) => {
    const clamped = Math.max(0, Math.min(1, val));
    setFireworksVolumeState(clamped);
  }, []);

  // Toggle Mute
  const toggleMute = useCallback(() => {
    const nextMuted = !isMuted;
    setIsMuted(nextMuted);
    if (audioRef.current) {
      audioRef.current.muted = nextMuted;
    }
  }, [isMuted]);

  // Start music on first user gesture ("Begin our story")
  const startMusic = useCallback(async () => {
    getAudioContext();
    if (!audioRef.current) return;

    if (hasAudioFile) {
      try {
        audioRef.current.volume = volume;
        await audioRef.current.play();
        setIsPlaying(true);
        setError(null);
        return;
      } catch (err) {
        console.warn("Autoplay notice for song:", err);
      }
    }

    // If MP3 is missing or blocked, start atmospheric ambient synth so experience is never silent!
    startAmbientSynth();
  }, [volume, getAudioContext, hasAudioFile, startAmbientSynth]);

  // Toggle Play / Pause
  const togglePlay = useCallback(async () => {
    getAudioContext();
    if (isPlaying) {
      if (audioRef.current) audioRef.current.pause();
      stopAmbientSynth();
      setIsPlaying(false);
    } else {
      if (hasAudioFile && audioRef.current) {
        try {
          await audioRef.current.play();
          setIsPlaying(true);
          setError(null);
          return;
        } catch {
          // Fall back to synth
        }
      }
      startAmbientSynth();
    }
  }, [isPlaying, getAudioContext, hasAudioFile, startAmbientSynth, stopAmbientSynth]);

  // Toggle SFX & Fireworks
  const toggleSfx = useCallback(() => {
    setSfxEnabled(prev => !prev);
  }, []);

  const toggleFireworksSound = useCallback(() => {
    setFireworksSoundEnabled(prev => !prev);
  }, []);

  // --- FIREWORKS SOUND EFFECTS (Launch Whistle, Burst, Sparkle Tail) ---

  // 1. Launch Whistle
  const playFireworkLaunch = useCallback(() => {
    if (!fireworksSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      // If pre-decoded buffer exists, play it
      if (launchBufferRef.current) {
        const source = ctx.createBufferSource();
        source.buffer = launchBufferRef.current;
        const gain = ctx.createGain();
        gain.gain.value = fireworksVolume * 0.7;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
        return;
      }

      // Web Audio Synthesis: Ascending whistle sweep + gentle white noise trail
      const now = ctx.currentTime;
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();

      osc.type = 'sine';
      osc.frequency.setValueAtTime(280 + Math.random() * 50, now);
      osc.frequency.exponentialRampToValueAtTime(780 + Math.random() * 120, now + 0.45);

      gain.gain.setValueAtTime(0, now);
      gain.gain.linearRampToValueAtTime(0.09 * fireworksVolume, now + 0.05);
      gain.gain.exponentialRampToValueAtTime(0.001, now + 0.45);

      osc.connect(gain);
      gain.connect(ctx.destination);

      osc.start(now);
      osc.stop(now + 0.46);
    } catch {
      // Ignore
    }
  }, [fireworksSoundEnabled, fireworksVolume, getAudioContext]);

  // 2. Deep Crisp Burst Explosion
  const playFireworkBurst = useCallback(() => {
    if (!fireworksSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (burstBufferRef.current) {
        const source = ctx.createBufferSource();
        source.buffer = burstBufferRef.current;
        const gain = ctx.createGain();
        gain.gain.value = fireworksVolume;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
        return;
      }

      // Web Audio Synthesis: Punchy low-end thud + filtered noise burst
      const now = ctx.currentTime;

      // Low punch oscillator
      const osc = ctx.createOscillator();
      const oscGain = ctx.createGain();
      osc.type = 'triangle';
      osc.frequency.setValueAtTime(110, now);
      osc.frequency.exponentialRampToValueAtTime(42, now + 0.35);

      oscGain.gain.setValueAtTime(0.25 * fireworksVolume, now);
      oscGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      osc.connect(oscGain);
      oscGain.connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.36);

      // Noise component for the crisp atmospheric explosion
      const bufferSize = Math.floor(ctx.sampleRate * 0.35);
      const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = (Math.random() * 2 - 1);
      }
      const noise = ctx.createBufferSource();
      noise.buffer = buffer;

      const filter = ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(1400, now);
      filter.frequency.exponentialRampToValueAtTime(200, now + 0.35);

      const noiseGain = ctx.createGain();
      noiseGain.gain.setValueAtTime(0.18 * fireworksVolume, now);
      noiseGain.gain.exponentialRampToValueAtTime(0.001, now + 0.35);

      noise.connect(filter);
      filter.connect(noiseGain);
      noiseGain.connect(ctx.destination);

      noise.start(now);
    } catch {
      // Ignore
    }
  }, [fireworksSoundEnabled, fireworksVolume, getAudioContext]);

  // 3. Delicate Sparkling and Crackling Tail
  const playFireworkSparkle = useCallback(() => {
    if (!fireworksSoundEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;

      if (sparkleBufferRef.current) {
        const source = ctx.createBufferSource();
        source.buffer = sparkleBufferRef.current;
        const gain = ctx.createGain();
        gain.gain.value = fireworksVolume * 0.6;
        source.connect(gain);
        gain.connect(ctx.destination);
        source.start();
        return;
      }

      // Web Audio Synthesis: Cluster of delicate high-frequency sparkling pings
      const now = ctx.currentTime;
      const count = 5;
      for (let i = 0; i < count; i++) {
        const delay = 0.12 + Math.random() * 0.35;
        const freq = 2200 + Math.random() * 1800;

        const osc = ctx.createOscillator();
        const gain = ctx.createGain();

        osc.type = 'sine';
        osc.frequency.setValueAtTime(freq, now + delay);

        gain.gain.setValueAtTime(0, now + delay);
        gain.gain.linearRampToValueAtTime(0.04 * fireworksVolume, now + delay + 0.01);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + delay + 0.15);

        osc.connect(gain);
        gain.connect(ctx.destination);

        osc.start(now + delay);
        osc.stop(now + delay + 0.16);
      }
    } catch {
      // Ignore
    }
  }, [fireworksSoundEnabled, fireworksVolume, getAudioContext]);

  // --- GENERAL SFX ---
  const playSfx = useCallback((type: 'sparkle' | 'chime' | 'paper' | 'tea' | 'hug') => {
    if (!sfxEnabled) return;
    try {
      const ctx = getAudioContext();
      if (!ctx) return;
      const now = ctx.currentTime;

      if (type === 'sparkle') {
        const freqs = [1046.5, 1318.5, 1567.98, 2093.0];
        freqs.forEach((f, idx) => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now + idx * 0.05);
          gain.gain.setValueAtTime(0, now + idx * 0.05);
          gain.gain.linearRampToValueAtTime(0.06, now + idx * 0.05 + 0.01);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + idx * 0.05 + 0.3);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now + idx * 0.05);
          osc.stop(now + idx * 0.05 + 0.32);
        });
      } else if (type === 'chime') {
        const freqs = [523.25, 659.25, 783.99];
        freqs.forEach(f => {
          const osc = ctx.createOscillator();
          const gain = ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(f, now);
          gain.gain.setValueAtTime(0.05, now);
          gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);
          osc.connect(gain);
          gain.connect(ctx.destination);
          osc.start(now);
          osc.stop(now + 1.25);
        });
      } else if (type === 'paper') {
        const bufferSize = ctx.sampleRate * 0.18;
        const buffer = ctx.createBuffer(1, bufferSize, ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.05;
        }
        const noise = ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(1400, now);
        const gain = ctx.createGain();
        gain.gain.setValueAtTime(0.07, now);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.18);
        noise.connect(filter);
        filter.connect(gain);
        gain.connect(ctx.destination);
        noise.start(now);
      } else if (type === 'tea') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(480, now);
        osc.frequency.exponentialRampToValueAtTime(320, now + 0.25);
        gain.gain.setValueAtTime(0.04, now);
        gain.gain.exponentialRampToValueAtTime(0.001, now + 0.25);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 0.26);
      } else if (type === 'hug') {
        const osc = ctx.createOscillator();
        const gain = ctx.createGain();
        osc.type = 'sine';
        osc.frequency.setValueAtTime(196, now);
        osc.frequency.exponentialRampToValueAtTime(261.63, now + 0.6);
        gain.gain.setValueAtTime(0, now);
        gain.gain.linearRampToValueAtTime(0.07, now + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.0001, now + 1.5);
        osc.connect(gain);
        gain.connect(ctx.destination);
        osc.start(now);
        osc.stop(now + 1.5);
      }
    } catch {
      // Ignore
    }
  }, [sfxEnabled, getAudioContext]);

  return (
    <MusicContext.Provider
      value={{
        isPlaying,
        isMuted,
        volume,
        hasAudioFile,
        isLoaded,
        error,
        togglePlay,
        toggleMute,
        setVolume,
        startMusic,
        ambientSynthActive,

        fireworksSoundEnabled,
        fireworksVolume,
        setFireworksVolume,
        toggleFireworksSound,
        playFireworkLaunch,
        playFireworkBurst,
        playFireworkSparkle,

        sfxEnabled,
        toggleSfx,
        playSfx
      }}
    >
      {children}
    </MusicContext.Provider>
  );
};

export const useMusic = () => {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusic must be used within a MusicProvider');
  }
  return context;
};
