import React, { useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart } from 'lucide-react';
import type { SecretNoteData } from '../types';

interface SecretPhotoModalProps {
  note: SecretNoteData | null;
  onClose: () => void;
}

export const SecretPhotoModal: React.FC<SecretPhotoModalProps> = ({ note, onClose }) => {
  // Listen for Escape key to close
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') onClose();
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  if (!note) return null;

  const hasPhoto = Boolean(note.photoUrl && note.photoUrl.trim().length > 0);

  return (
    <AnimatePresence>
      <motion.div
        key="secret-modal-backdrop"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.3 }}
        className="fixed inset-0 z-50 flex items-center justify-center p-3 sm:p-5 select-none"
        style={{
          background: 'rgba(3, 10, 22, 0.88)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)'
        }}
        onClick={onClose}
      >
        {hasPhoto ? (
          /* PHOTO POPUP */
          <motion.div
            key="secret-photo-content"
            initial={{ opacity: 0, scale: 0.9, y: 15 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 15 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative flex flex-col items-center max-w-[92vw] sm:max-w-lg md:max-w-xl max-h-[92vh] p-4 sm:p-5 rounded-2xl border border-amber-300/30 shadow-[0_25px_65px_rgba(0,0,0,0.85)]"
            style={{
              background: 'linear-gradient(145deg, rgba(16, 26, 43, 0.96), rgba(8, 15, 27, 0.98))',
              boxShadow: '0 25px 60px rgba(0,0,0,0.85), 0 0 35px rgba(244,114,182,0.18)'
            }}
          >
            {/* Close button — prominent & clean */}
            <button
              onClick={onClose}
              className="absolute top-3 right-3 sm:top-3.5 sm:right-3.5 p-2 rounded-full bg-black/40 hover:bg-rose-900/60 text-white/80 hover:text-white transition-all z-20 border border-white/10 shadow-lg"
              aria-label="Close photo"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header / Note label */}
            <div className="w-full flex items-center justify-between mb-3 pr-10">
              <div className="flex items-center gap-2">
                <Sparkles className="w-4 h-4 text-amber-300" />
                <span 
                  className="text-sm sm:text-base font-bold tracking-wider uppercase text-amber-300 font-sans"
                  style={{ textShadow: '0 2px 8px rgba(0,0,0,0.8)' }}
                >
                  {note.title}
                </span>
              </div>
              {note.sceneName && (
                <span className="text-xs font-medium text-amber-200/70 hidden sm:inline-block">
                  {note.sceneName}
                </span>
              )}
            </div>

            {/* Photo Container — aspect ratio strictly preserved, crisp rendering */}
            <div className="relative flex items-center justify-center w-full overflow-hidden rounded-xl bg-black/60 border border-white/15 p-1 sm:p-2 shadow-inner">
              <img
                src={note.photoUrl}
                alt={note.title}
                className="w-auto h-auto max-w-full rounded-lg object-contain block mx-auto"
                style={{
                  maxHeight: 'calc(75vh - 130px)',
                  boxShadow: '0 8px 30px rgba(0,0,0,0.6)'
                }}
                loading="eager"
              />
            </div>

            {/* Note caption — crystal clear, high contrast, elegant & easily readable */}
            {note.message && (
              <div className="w-full mt-3 px-4 py-2.5 rounded-xl bg-black/60 border border-white/15 backdrop-blur-md shadow-md">
                <p 
                  className="text-center text-sm sm:text-base md:text-lg text-white font-medium leading-relaxed tracking-wide"
                  style={{ 
                    fontFamily: "'Outfit', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
                    textShadow: '0 1px 3px rgba(0,0,0,0.9)'
                  }}
                >
                  "{note.message}"
                </p>
              </div>
            )}

            {/* Bottom seal */}
            <div className="mt-3 pt-2.5 w-full border-t border-white/15 flex items-center justify-between text-xs text-amber-200/80 font-sans">
              <span className="flex items-center gap-1.5 text-rose-300 font-semibold text-xs sm:text-sm">
                <Heart className="w-4 h-4 fill-rose-500 text-rose-500" />
                <span>A special memory for Ashu</span>
              </span>
              <button
                onClick={onClose}
                className="text-stone-300 hover:text-white font-semibold transition-colors underline underline-offset-4 text-xs sm:text-sm"
              >
                Continue story ➔
              </button>
            </div>
          </motion.div>
        ) : (
          /* TEXT NOTE POPUP (FALLBACK WHEN PHOTO IS NOT YET PROVIDED) */
          <motion.div
            key="secret-text-content"
            initial={{ opacity: 0, scale: 0.88, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.88, y: 20 }}
            transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
            onClick={(e) => e.stopPropagation()}
            className="relative w-full max-w-md bg-[#fffcf7] p-8 shadow-2xl rounded-2xl border-2 border-amber-300/60 select-text"
            style={{
              boxShadow: '0 25px 60px rgba(0,0,0,0.8), inset 0 0 50px rgba(217,119,6,0.06)'
            }}
          >
            {/* Close button */}
            <button
              onClick={onClose}
              className="absolute top-4 right-4 p-2 rounded-full hover:bg-stone-200/80 text-stone-700 transition-colors"
              aria-label="Close note"
            >
              <X className="w-5 h-5" />
            </button>

            {/* Header */}
            <div className="flex items-center gap-2 mb-4">
              <Sparkles className="w-5 h-5 text-amber-600" />
              <span className="text-sm font-bold tracking-wider uppercase text-amber-900 font-sans">
                {note.title}
              </span>
            </div>

            {/* Note content — deep crisp charcoal, clear serif font, highly legible */}
            <p 
              className="text-xl sm:text-2xl text-stone-900 font-semibold leading-relaxed my-4"
              style={{
                fontFamily: "'Cormorant Garamond', Georgia, serif",
                letterSpacing: '0.015em',
                lineHeight: '1.65'
              }}
            >
              "{note.message}"
            </p>

            {/* Footer seal / heart */}
            <div className="mt-6 pt-4 border-t border-amber-900/15 flex items-center justify-between text-sm text-stone-600 font-sans">
              <span className="flex items-center gap-1.5 text-rose-700 font-bold">
                <Heart className="w-4 h-4 fill-rose-600 text-rose-600" />
                <span>A little secret for you</span>
              </span>
              <button
                onClick={onClose}
                className="text-stone-800 hover:text-stone-950 font-bold underline underline-offset-4 text-sm"
              >
                Keep safe
              </button>
            </div>
          </motion.div>
        )}
      </motion.div>
    </AnimatePresence>
  );
};
