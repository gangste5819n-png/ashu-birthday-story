import React from 'react';
import { Heart } from 'lucide-react';

interface SecretHeartProps {
  top?: string;
  left?: string;
  right?: string;
  bottom?: string;
  onClick: () => void;
  discovered?: boolean;
  hint?: string;
}

export const SecretHeart: React.FC<SecretHeartProps> = ({
  top,
  left,
  right,
  bottom,
  onClick,
  discovered,
  hint = "A hidden memory"
}) => {
  return (
    <div
      onClick={(e) => {
        e.stopPropagation();
        onClick();
      }}
      className={`secret-heart-trigger ${discovered ? 'opacity-80' : 'pulse'}`}
      style={{
        top,
        left,
        right,
        bottom,
      }}
      title={hint}
      aria-label="Secret memory heart"
    >
      <Heart className={`w-4 h-4 ${discovered ? 'fill-rose-400 text-rose-400' : 'text-rose-300'}`} />
    </div>
  );
};
