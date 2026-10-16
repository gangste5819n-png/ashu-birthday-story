export type SceneId = 
  | 'opening'
  | 'letter'
  | 'waiting'
  | 'midnight'
  | 'arrival'
  | 'bouquet'
  | 'hug'
  | 'scooter'
  | 'chai'
  | 'rooftop'
  | 'finale';

export interface SecretNoteData {
  id: string;
  title: string;
  message: string;
  locationHint?: string;
}

export interface SoundEffectsController {
  playChime: () => void;
  playSparkle: () => void;
  playFireworkLaunch: () => void;
  playFireworkBurst: () => void;
  playFireworkSparkle: () => void;
  playPaperRustle: () => void;
  playTeaPour: () => void;
  playHugWarmth: () => void;
  enabled: boolean;
  toggleSfx: () => void;
  fireworksSoundEnabled: boolean;
  toggleFireworksSound: () => void;
}
