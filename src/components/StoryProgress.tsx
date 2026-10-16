import React from 'react';
import type { SceneId } from '../types';
import { Heart } from 'lucide-react';

interface StoryProgressProps {
  currentScene: SceneId;
  totalFoundSecrets: number;
  totalSecrets: number;
  onSceneSelect?: (scene: SceneId) => void;
}

const SCENE_NAMES: { id: SceneId; label: string }[] = [
  { id: 'opening', label: '1. Opening' },
  { id: 'letter', label: '2. Secret Letter' },
  { id: 'waiting', label: '3. 11:55 PM' },
  { id: 'midnight', label: '4. Midnight Fireworks' },
  { id: 'arrival', label: '5. She Arrives' },
  { id: 'bouquet', label: '6. The Bouquet' },
  { id: 'hug', label: '7. The Hug' },
  { id: 'scooter', label: '8. Night Ride' },
  { id: 'chai', label: '9. Chai Point' },
  { id: 'rooftop', label: '10. Rooftop' },
  { id: 'finale', label: '11. Final Note & Heart Fireworks' }
];

export const StoryProgress: React.FC<StoryProgressProps> = ({
  currentScene,
  totalFoundSecrets,
  totalSecrets,
  onSceneSelect
}) => {
  const currentIndex = SCENE_NAMES.findIndex(s => s.id === currentScene);

  return (
    <div className="story-progress-indicator select-none pointer-events-auto">
      <div className="flex items-center gap-1.5">
        {SCENE_NAMES.map((scene, idx) => {
          const isActive = idx === currentIndex;
          const isCompleted = idx < currentIndex;
          return (
            <button
              key={scene.id}
              onClick={() => onSceneSelect?.(scene.id)}
              className={`progress-dot transition-all ${isActive ? 'active' : isCompleted ? 'completed' : ''}`}
              title={scene.label}
              aria-label={scene.label}
            />
          );
        })}
      </div>

      {totalFoundSecrets > 0 && (
        <div 
          className="ml-2 pl-2 border-l border-white/20 flex items-center gap-1 text-[11px] text-rose-300 font-medium"
          title={`${totalFoundSecrets} out of ${totalSecrets} hidden secret messages discovered!`}
        >
          <Heart className="w-3 h-3 fill-rose-400 text-rose-400" />
          <span>{totalFoundSecrets}/{totalSecrets}</span>
        </div>
      )}
    </div>
  );
};
