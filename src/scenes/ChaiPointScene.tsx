import React, { useState, useEffect, useRef } from 'react';
import { motion } from 'framer-motion';
import { STORY_CONFIG } from '../config/storyConfig';
import { useBackgroundMusic } from '../hooks/useBackgroundMusic';

interface ChaiPointSceneProps {
  onSeeStars: () => void;
  onOpenSecret: (id: string) => void;
  discoveredSecrets: string[];
}

interface ChatMessage {
  id: string;
  speaker: 'Ashu' | 'Akshay';
  text: string;
}

export const ChaiPointScene: React.FC<ChaiPointSceneProps> = ({
  onSeeStars,
  onOpenSecret,
  discoveredSecrets
}) => {
  const { playSfx } = useBackgroundMusic();

  const initialConv = STORY_CONFIG.chai.conversations[0];
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      id: `${initialConv.id}-0`,
      speaker: initialConv.turns[0].speaker,
      text: initialConv.turns[0].text
    },
    {
      id: `${initialConv.id}-1`,
      speaker: initialConv.turns[1].speaker,
      text: initialConv.turns[1].text
    }
  ]);

  const [askedQuestionIds, setAskedQuestionIds] = useState<string[]>([initialConv.id]);
  const [isTyping, setIsTyping] = useState<string | null>(null);
  const [activeQuestionId, setActiveQuestionId] = useState<string | null>(null);

  const chatContainerRef = useRef<HTMLDivElement | null>(null);
  const timeoutsRef = useRef<number[]>([]);

  const scrollToBottom = () => {
    if (chatContainerRef.current) {
      chatContainerRef.current.scrollTo({
        top: chatContainerRef.current.scrollHeight,
        behavior: 'smooth'
      });
    }
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages, isTyping]);

  useEffect(() => {
    return () => {
      timeoutsRef.current.forEach(t => clearTimeout(t));
    };
  }, []);

  const handleSelectQuestion = (convId: string) => {
    if (askedQuestionIds.includes(convId)) {
      scrollToBottom();
      return;
    }

    if (activeQuestionId !== null) return;

    const conv = STORY_CONFIG.chai.conversations.find(c => c.id === convId);
    if (!conv) return;

    setActiveQuestionId(convId);
    setAskedQuestionIds(prev => [...prev, convId]);
    playSfx('sparkle');

    let accumulatedDelay = 0;

    conv.turns.forEach((turn, idx) => {
      if (idx === 0) {
        setMessages(prev => [
          ...prev,
          {
            id: `${conv.id}-${idx}-${Date.now()}`,
            speaker: turn.speaker,
            text: turn.text
          }
        ]);
      } else {
        accumulatedDelay += turn.delayMs || 1200;

        const typingTimer = window.setTimeout(() => {
          setIsTyping(turn.speaker);
        }, accumulatedDelay - 700);
        timeoutsRef.current.push(typingTimer);

        const msgTimer = window.setTimeout(() => {
          setIsTyping(null);
          playSfx('tea');
          setMessages(prev => [
            ...prev,
            {
              id: `${conv.id}-${idx}-${Date.now()}`,
              speaker: turn.speaker,
              text: turn.text
            }
          ]);

          if (idx === conv.turns.length - 1) {
            setActiveQuestionId(null);
          }
        }, accumulatedDelay);
        timeoutsRef.current.push(msgTimer);
      }
    });
  };

  return (
    <div className="scene">
      {/* Background artwork — warm midnight café ambiance */}
      <motion.img
        src="/images/chai_point.jpg"
        alt="Chai Point Midnight Café"
        className="scene-env"
        initial={{ scale: 1.05 }}
        animate={{ scale: 1.11 }}
        transition={{ duration: 25, ease: 'linear' }}
        style={{ objectPosition: 'center 45%' }}
      />

      {/* Atmospheric Overlays */}
      <div className="vignette" />
      <div className="atmos-bottom" style={{ height: '70%' }} />
      <div className="atmos-sides" />
      <div className="atmos-top" />

      {/* Warm café lantern glow */}
      <div
        className="warm-glow"
        style={{
          width: 550,
          height: 450,
          top: '12%',
          left: '25%',
          background: 'radial-gradient(circle, rgba(255,180,70,0.22) 0%, rgba(220,120,40,0.08) 55%, transparent 75%)',
          zIndex: 8
        }}
      />

      {/* Rising Tea Steam Effect */}
      <div className="absolute inset-0 pointer-events-none" style={{ zIndex: 12 }}>
        {[...Array(6)].map((_, i) => (
          <motion.div
            key={i}
            initial={{ y: '75%', x: `${38 + (i % 3) * 6}%`, opacity: 0, scale: 0.8 }}
            animate={{
              y: '45%',
              x: `${40 + (i % 3) * 6 + (i % 2 === 0 ? 3 : -3)}%`,
              opacity: [0, 0.45, 0],
              scale: 1.6
            }}
            transition={{
              duration: 4.5 + i * 0.7,
              repeat: Infinity,
              delay: i * 0.9,
              ease: 'easeOut'
            }}
            style={{
              position: 'absolute',
              width: 18 + i * 4,
              height: 40 + i * 8,
              borderRadius: '50%',
              background: 'radial-gradient(ellipse, rgba(255,245,230,0.3) 0%, transparent 70%)',
              filter: 'blur(4px)'
            }}
          />
        ))}
      </div>

      {/* Secret Heart hidden near the warm café window */}
      {!discoveredSecrets.includes('secret-4') && (
        <button
          className="secret-heart"
          style={{ top: '32%', right: '22%' }}
          onClick={() => onOpenSecret('secret-4')}
          aria-label="Discover secret note"
        >
          <span style={{ fontSize: '0.85rem' }}>♥</span>
        </button>
      )}

      {/* Top Scene Badge */}
      <div className="scene-badge">
        <span>☕</span>
        <span>{STORY_CONFIG.chai.signboardText} • LATE NIGHT CHAI</span>
      </div>

      {/* Center Environment Narration */}
      <div
        style={{
          position: 'absolute',
          top: 'clamp(72px, 11vh, 95px)',
          left: '50%',
          transform: 'translateX(-50%)',
          zIndex: 30,
          textAlign: 'center',
          pointerEvents: 'none',
          width: 'min(640px, 90vw)'
        }}
      >
        <div className="film-title" style={{ fontSize: 'clamp(1.6rem, 3.5vw, 2.2rem)', marginBottom: '0.2rem' }}>
          "{STORY_CONFIG.chai.line1} {STORY_CONFIG.chai.line2}"
        </div>
      </div>

      {/* Main Conversation Stream — Cinematic Chat Bubble Flow */}
      <div
        style={{
          position: 'absolute',
          bottom: 'clamp(120px, 18vh, 160px)',
          left: '50%',
          transform: 'translateX(-50%)',
          width: 'min(680px, 92vw)',
          zIndex: 40,
          display: 'flex',
          flexDirection: 'column',
          gap: '0.75rem'
        }}
      >
        {/* Scrollable Conversation Stream */}
        <div
          ref={chatContainerRef}
          style={{
            maxHeight: 'clamp(210px, 34vh, 290px)',
            overflowY: 'auto',
            paddingRight: '0.5rem',
            display: 'flex',
            flexDirection: 'column',
            gap: '0.65rem',
            maskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)',
            WebkitMaskImage: 'linear-gradient(to bottom, transparent 0%, black 15%, black 100%)'
          }}
        >
          {messages.map(msg => {
            const isAshu = msg.speaker === 'Ashu';
            return (
              <motion.div
                key={msg.id}
                initial={{ opacity: 0, y: 10, scale: 0.98 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                transition={{ duration: 0.4 }}
                style={{
                  alignSelf: isAshu ? 'flex-start' : 'flex-end',
                  maxWidth: '85%'
                }}
              >
                {/* Speaker Tag */}
                <div
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.35rem',
                    fontSize: '0.68rem',
                    fontFamily: 'var(--font-body)',
                    fontWeight: 600,
                    letterSpacing: '0.12em',
                    textTransform: 'uppercase',
                    marginBottom: '0.25rem',
                    justifyContent: isAshu ? 'flex-start' : 'flex-end',
                    color: isAshu ? 'rgba(242,161,182,0.9)' : 'rgba(255,201,121,0.9)'
                  }}
                >
                  <span>{msg.speaker}</span>
                  <span>{isAshu ? '✨' : '☕'}</span>
                </div>

                {/* Speech Bubble with ambient café glassmorphism */}
                <div
                  style={{
                    padding: '0.65rem 1.15rem',
                    borderRadius: '16px',
                    borderTopLeftRadius: isAshu ? '4px' : '16px',
                    borderTopRightRadius: !isAshu ? '4px' : '16px',
                    background: isAshu
                      ? 'linear-gradient(135deg, rgba(136, 19, 55, 0.78), rgba(76, 5, 25, 0.72))'
                      : 'linear-gradient(135deg, rgba(30, 41, 59, 0.85), rgba(15, 23, 42, 0.85))',
                    border: isAshu
                      ? '1px solid rgba(244, 63, 94, 0.4)'
                      : '1px solid rgba(255, 201, 121, 0.35)',
                    backdropFilter: 'blur(12px)',
                    color: '#fffbf5',
                    fontFamily: 'var(--font-serif)',
                    fontStyle: 'italic',
                    fontSize: 'clamp(0.95rem, 1.8vw, 1.1rem)',
                    lineHeight: 1.45,
                    boxShadow: '0 4px 20px rgba(0,0,0,0.5)'
                  }}
                >
                  "{msg.text}"
                </div>
              </motion.div>
            );
          })}

          {/* Typing Indicator */}
          {isTyping && (
            <motion.div
              initial={{ opacity: 0, y: 6 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              style={{
                alignSelf: isTyping === 'Ashu' ? 'flex-start' : 'flex-end',
                padding: '0.45rem 0.9rem',
                borderRadius: '12px',
                background: 'rgba(4, 13, 26, 0.65)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                backdropFilter: 'blur(8px)',
                fontSize: '0.75rem',
                color: isTyping === 'Ashu' ? 'rgba(242,161,182,0.9)' : 'rgba(255,201,121,0.9)',
                fontStyle: 'italic'
              }}
            >
              {isTyping} is typing...
            </motion.div>
          )}
        </div>

        {/* Conversation Topic Pills (Interactive cues) */}
        <div
          style={{
            display: 'flex',
            overflowX: 'auto',
            gap: '0.5rem',
            paddingTop: '0.4rem',
            paddingBottom: '0.2rem',
            scrollbarWidth: 'none',
            WebkitOverflowScrolling: 'touch'
          }}
        >
          {STORY_CONFIG.chai.conversations.map(conv => {
            const isAsked = askedQuestionIds.includes(conv.id);
            return (
              <button
                key={conv.id}
                onClick={() => handleSelectQuestion(conv.id)}
                disabled={activeQuestionId !== null}
                style={{
                  flexShrink: 0,
                  background: isAsked ? 'rgba(255, 201, 121, 0.12)' : 'rgba(4, 13, 26, 0.65)',
                  border: isAsked ? '1px solid rgba(255, 201, 121, 0.45)' : '1px solid rgba(255, 255, 255, 0.18)',
                  color: isAsked ? '#fff6ec' : 'rgba(255, 255, 255, 0.75)',
                  borderRadius: 99,
                  padding: '0.4rem 0.95rem',
                  fontSize: '0.75rem',
                  fontFamily: 'var(--font-body)',
                  cursor: activeQuestionId !== null ? 'default' : 'pointer',
                  backdropFilter: 'blur(10px)',
                  opacity: activeQuestionId !== null ? 0.6 : 1,
                  transition: 'all 0.25s ease'
                }}
              >
                <span>{isAsked ? '✓ ' : '💬 '}{conv.choiceText}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* Advance to Rooftop Scene Button */}
      <motion.button
        initial={{ opacity: 0, y: 15 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
        onClick={() => {
          playSfx('sparkle');
          onSeeStars();
        }}
        className="film-btn film-btn-primary"
        style={{
          position: 'absolute',
          zIndex: 65,
          bottom: 'clamp(32px, 5vh, 52px)',
          left: '50%',
          transform: 'translateX(-50%)',
          fontSize: '0.85rem',
          padding: '0.7rem 2rem'
        }}
      >
        <span>{STORY_CONFIG.chai.buttonText}</span>
      </motion.button>
    </div>
  );
};
