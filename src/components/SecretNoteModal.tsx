import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { X, Sparkles, Heart } from 'lucide-react';
import type { SecretNoteData } from '../types';

interface SecretNoteModalProps {
  note: SecretNoteData | null;
  onClose: () => void;
}

export const SecretNoteModal: React.FC<SecretNoteModalProps> = ({ note, onClose }) => {
  if (!note) return null;

  return (
    <AnimatePresence>
      <div 
        className="fixed inset-0 z-50 flex items-center justify-center p-4"
        style={{
          background: 'rgba(7, 20, 38, 0.78)',
          backdropFilter: 'blur(8px)'
        }}
        onClick={onClose}
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.85, y: 20 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.85, y: 20 }}
          transition={{ duration: 0.35, ease: [0.16, 1, 0.3, 1] }}
          onClick={(e) => e.stopPropagation()}
          className="relative w-full max-w-sm paper-parchment p-7 shadow-2xl rounded-xl border border-amber-200/40 select-text"
        >
          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-3.5 right-3.5 p-1.5 rounded-full hover:bg-stone-800/10 text-stone-600 transition-colors"
            aria-label="Close note"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Header */}
          <div className="flex items-center gap-2 mb-3">
            <Sparkles className="w-4 h-4 text-amber-600" />
            <span className="text-xs font-semibold tracking-wider uppercase text-stone-500 font-sans">
              {note.title}
            </span>
          </div>

          {/* Note content */}
          <p className="font-handwriting text-2xl text-stone-800 leading-relaxed my-2">
            "{note.message}"
          </p>

          {/* Footer seal / heart */}
          <div className="mt-5 pt-3 border-t border-amber-900/10 flex items-center justify-between text-xs text-stone-500 font-sans">
            <span className="flex items-center gap-1 text-rose-700 font-medium">
              <Heart className="w-3.5 h-3.5 fill-rose-600 text-rose-600" />
              <span>A little secret for you</span>
            </span>
            <button
              onClick={onClose}
              className="text-stone-600 hover:text-stone-900 font-medium underline underline-offset-2 text-xs"
            >
              Keep safe
            </button>
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
};
