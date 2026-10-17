import type { SecretNoteData } from '../types';

/**
 * PHOTO MAPPING CONFIGURATION FOR ALL SECRET-NOTE HEARTS
 * 
 * To change or add a photo for any secret note:
 * 1. Place your photo inside the /public/photos/ folder.
 * 2. Update the `photoUrl` field below to point to '/photos/your-image.jpg'.
 * 
 * If `photoUrl` is set to undefined or an empty string, that secret note
 * will seamlessly display its original text message with NO broken image.
 */

export interface SecretNoteConfigItem extends SecretNoteData {
  noteNumber: number;
  sceneName: string;
}

export const SECRET_NOTES_CONFIG: SecretNoteConfigItem[] = [
  {
    id: 'secret-1',
    noteNumber: 1,
    title: 'Secret Note #1 🌟',
    sceneName: 'Scene 1: Opening Skyline',
    photoUrl: '/photos/photo-1-opening.jpeg',
    message: 'A little reminder: you deserve endless kindness, patience, and warmth.',
    locationHint: 'Glowing window in the opening city skyline'
  },
  {
    id: 'secret-2',
    noteNumber: 2,
    title: 'Secret Note #2 🏠',
    sceneName: 'Scene 3: 11:55 PM Waiting',
    photoUrl: '/photos/photo-2-waiting.png',
    message: 'Every minute waiting for you is worth every single second.',
    locationHint: 'Glowing window in the apartment building'
  },
  {
    id: 'secret-3',
    noteNumber: 3,
    title: 'Secret Note #3 🎆',
    sceneName: 'Scene 4: Midnight Fireworks',
    photoUrl: '/photos/photo-3-midnight-hbd.jpeg',
    message: 'I hope something genuinely wonderful surprises you today and makes you laugh out loud.',
    locationHint: 'Floating in the midnight fireworks sky'
  },
  {
    id: 'secret-4',
    noteNumber: 4,
    title: 'Secret Note #4 🚪',
    sceneName: 'Scene 5: She Arrives',
    photoUrl: '/photos/photo-4-arrival.jpeg',
    message: 'Seeing your smile at the door makes everything feel right in the world.',
    locationHint: 'Doorway entrance when she arrives'
  },
  {
    id: 'secret-5',
    noteNumber: 5,
    title: 'Secret Note #5 🌹',
    sceneName: 'Scene 6: The Bouquet',
    photoUrl: undefined, // Unmodified until photo is provided
    message: 'May you find unexpected joy and peace in the smallest, simplest moments of your day.',
    locationHint: 'Tucked inside the bouquet wrapping'
  },
  {
    id: 'secret-6',
    noteNumber: 6,
    title: 'Secret Note #6 🫂',
    sceneName: 'Scene 7: The Hug',
    photoUrl: '/photos/photo-5-hug.jpeg',
    message: 'Some hugs feel like coming home after a very long journey.',
    locationHint: 'Floating among the warm bokeh lights'
  },
  {
    id: 'secret-7',
    noteNumber: 7,
    title: 'Secret Note #7 🛵',
    sceneName: 'Scene 8: Night Ride',
    photoUrl: undefined, // Unmodified until photo is provided
    message: 'Late night rides, cool breeze, and your laughter in my ear.',
    locationHint: 'Along the illuminated night street'
  },
  {
    id: 'secret-8',
    noteNumber: 8,
    title: 'Secret Note #8 ☕',
    sceneName: 'Scene 9: Chai Point',
    photoUrl: '/photos/photo-6-chai.jpeg',
    message: 'Every conversation with you is my favorite memory in the making.',
    locationHint: 'Warm window pane at Chai Point'
  },
  {
    id: 'secret-9',
    noteNumber: 9,
    title: 'Secret Note #9 🌙',
    sceneName: 'Scene 10: Rooftop',
    photoUrl: '/photos/photo-7-rooftop.jpeg',
    message: 'Under a sky full of stars, looking at the brightest one beside me.',
    locationHint: 'Shooting star in the rooftop night sky'
  },
  {
    id: 'secret-10',
    noteNumber: 10,
    title: 'Secret Note #10 ✨',
    sceneName: 'Scene 11: Final Wishes',
    photoUrl: undefined, // Unmodified until photo is provided
    message: "Here's one more reason to smile: you are loved, today and every day after. ❤️",
    locationHint: 'Finale starlight in the night sky'
  }
];
