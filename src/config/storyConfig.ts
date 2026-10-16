/**
 * Centralized Configuration for "A Little Birthday Story"
 * 
 * Character names:
 * - Girl: Ashu
 * - Boy: Akshay
 */

export interface FlowerMessage {
  id: number;
  title: string;
  message: string;
  color: string;
}

export interface ScooterRoute {
  id: 'city' | 'riverside' | 'direct';
  name: string;
  icon: string;
  description: string;
  bgImage: string;
  narration: string;
}

export interface ChaiDialogueTurn {
  speaker: 'Ashu' | 'Akshay';
  text: string;
  delayMs?: number;
}

export interface ChaiConversation {
  id: string;
  title: string;
  choiceText: string;
  turns: ChaiDialogueTurn[];
}

export interface SecretMessage {
  id: string;
  locationHint: string;
  title: string;
  message: string;
}

export interface StoryConfig {
  boyName: string;
  girlName: string;
  birthdayDate: string;

  audio: {
    musicPath: string;
    fireworksLaunchPath: string;
    fireworksBurstPath: string;
    fireworksSparklePath: string;
    initialMusicVolume: number;
    initialFireworksVolume: number;
  };

  opening: {
    title: string;
    subtitle: string;
    buttonText: string;
    badgeText: string;
  };

  letter: {
    promptText: string;
    buttonText: string;
    greeting: string;
    paragraphs: string[];
    closing: string;
  };

  waiting: {
    clockText: string;
    title: string;
    subtitle: string;
    buttonText: string;
  };

  midnight: {
    countdownNumbers: number[];
    timeText: string;
    promptText: string;
    continueButtonText: string;
  };

  arrival: {
    badgeText: string;
    firstLine: string;
    secondLine: string;
    quietLine: string;
    buttonText: string;
  };

  bouquet: {
    heading: string;
    instructionText: string;
    buttonText: string;
    flowers: FlowerMessage[];
  };

  hug: {
    badgeText: string;
    wishText: string;
    warmthText: string;
    buttonText: string;
  };

  scooter: {
    badgeText: string;
    heading: string;
    buttonText: string;
    routes: ScooterRoute[];
  };

  chai: {
    badgeText: string;
    signboardText: string;
    line1: string;
    line2: string;
    buttonText: string;
    conversations: ChaiConversation[];
  };

  rooftop: {
    badgeText: string;
    line1: string;
    line2: string;
    buttonText: string;
  };

  finale: {
    badgeText: string;
    noteParagraphs: string[];
    noteSignature: string;
    fireworksHeading: string;
    fireworksSubtitle: string;
    replayButtonText: string;
    readLetterButtonText: string;
  };

  secretMessages: SecretMessage[];
}

export const STORY_CONFIG: StoryConfig = {
  // 1. Character Names
  boyName: "Akshay",
  girlName: "Ashu",
  birthdayDate: "Tonight",

  // 2. Audio Paths & Initial Volumes
  audio: {
    musicPath: "/audio/birthday-song.mp3",
    fireworksLaunchPath: "/audio/fireworks-launch.mp3",
    fireworksBurstPath: "/audio/fireworks-burst.mp3",
    fireworksSparklePath: "/audio/fireworks-sparkle.mp3",
    initialMusicVolume: 0.30,
    initialFireworksVolume: 0.60
  },

  // 3. Scene 1 — Opening
  opening: {
    title: "A Little Birthday Story",
    subtitle: "A little world, made just for you.",
    buttonText: "Begin our story →",
    badgeText: "A Virtual Birthday Keepsake ✨"
  },

  // 4. Scene 2 — Secret Letter
  letter: {
    promptText: "Before the night begins, there's something I want you to read.",
    buttonText: "Open your little letter 💌",
    greeting: "Hey Ashu, birthday girl,",
    paragraphs: [
      "If I could give you one thing tonight, it would be the chance to see yourself through the eyes of someone who thinks you deserve so much happiness.",
      "I hope this new year brings you quiet peace, unexpected reasons to smile, dreams that come closer, and people who make you feel appreciated.",
      "Tonight, I made you a little world of moments I wish I could share with you.",
      "So take your time. This little story is just for you.",
      "Happy Birthday."
    ],
    closing: "— Akshay"
  },

  // 5. Scene 3 — 11:55 PM Waiting
  waiting: {
    clockText: "11:55 PM",
    title: "Five minutes until your birthday.",
    subtitle: "I wish I could be there beside you right now.",
    buttonText: "Wait for midnight"
  },

  // 6. Scene 4 — Midnight Fireworks
  midnight: {
    countdownNumbers: [3, 2, 1],
    timeText: "12:00 AM",
    promptText: "Tap the sky to make a wish ✨",
    continueButtonText: "She's coming downstairs →"
  },

  // 7. Scene 5 — She Comes Downstairs
  arrival: {
    badgeText: "The Door Opens",
    firstLine: "And then, the door opens.",
    secondLine: "There you are.",
    quietLine: "For a moment, the entire city feels quiet.",
    buttonText: "Give her the flowers 🌹"
  },

  // 8. Scene 6 — The Bouquet
  bouquet: {
    heading: "You deserve a thousand reasons to smile.",
    instructionText: "Tap each rose to read a secret wish for you",
    buttonText: "A little more of this moment →",
    flowers: [
      {
        id: 1,
        title: "Reason to Smile",
        message: "I hope today gives you a hundred little reasons to smile.",
        color: "#e11d48"
      },
      {
        id: 2,
        title: "Quiet Happiness",
        message: "You deserve happiness in the ordinary moments, too.",
        color: "#f43f5e"
      },
      {
        id: 3,
        title: "Lighter Worries",
        message: "May your dreams become closer and your worries feel lighter.",
        color: "#f59e0b"
      },
      {
        id: 4,
        title: "Your Light",
        message: "Never forget how much good you bring into the world.",
        color: "#ec4899"
      },
      {
        id: 5,
        title: "New Horizons",
        message: "Here's to another year of becoming everything you hope to be.",
        color: "#fb7185"
      }
    ]
  },

  // 9. Scene 7 — The Hug
  hug: {
    badgeText: "A Quiet Embrace",
    wishText: "I wish I could give you this moment for real.",
    warmthText: "For now, I hope this little world brings a smile to your face.",
    buttonText: "Let's go for a little ride →"
  },

  // 10. Scene 8 — The Night Scooter Ride
  scooter: {
    badgeText: "Late Night Ride",
    heading: "Where should our little ride take us?",
    buttonText: "Stop at Chai Point ☕",
    routes: [
      {
        id: 'city',
        name: "City lights ✨",
        icon: "✨",
        description: "Gliding under glowing overpasses and sparkling skyscrapers",
        bgImage: "/images/scooter_citylights.jpg",
        narration: "The cool midnight wind gently brushes past as city lights drift by like fallen stars."
      },
      {
        id: 'riverside',
        name: "Quiet riverside 🌙",
        icon: "🌙",
        description: "Along the tranquil waterfront reflecting glowing lanterns",
        bgImage: "/images/scooter_riverside.jpg",
        narration: "A peaceful path along shimmering water, where the city whispers softly in the night."
      },
      {
        id: 'direct',
        name: "Straight to Chai Point ☕",
        icon: "☕",
        description: "The fastest route to two warm cups of midnight chai",
        bgImage: "/images/scooter_ride.jpg",
        narration: "Riding through empty avenues towards the familiar warm glow of our favorite tea stall."
      }
    ]
  },

  // 11. Scene 9 — Chai Point (All 8 personal natural conversations)
  chai: {
    badgeText: "Midnight Café",
    signboardText: "CHAI POINT",
    line1: "One cup of chai.",
    line2: "A thousand little conversations.",
    buttonText: "Let's see the stars →",
    conversations: [
      {
        id: 'why-matter',
        title: "Why does she matter?",
        choiceText: "Why do you always make time for me?",
        turns: [
          {
            speaker: 'Ashu',
            text: "Can I ask you something? Why do you always make time for me?",
            delayMs: 0
          },
          {
            speaker: 'Akshay',
            text: "Because talking to you never feels like something I have to make time for. Even on a busy day, hearing from you can make the whole day feel a little better.",
            delayMs: 1100
          }
        ]
      },
      {
        id: 'little-things',
        title: "The little things",
        choiceText: "What's something you like about me?",
        turns: [
          {
            speaker: 'Ashu',
            text: "What's something you like about me that I probably don't even notice?",
            delayMs: 0
          },
          {
            speaker: 'Akshay',
            text: "The little things. The way you talk about something you're excited about, the random things you tell me, and how you can make an ordinary conversation feel special without even trying.",
            delayMs: 1100
          }
        ]
      },
      {
        id: 'not-okay',
        title: "When she isn't okay",
        choiceText: "What if one day I'm not okay?",
        turns: [
          {
            speaker: 'Ashu',
            text: "What if one day I'm not okay and I don't feel like talking much?",
            delayMs: 0
          },
          {
            speaker: 'Akshay',
            text: "Then you don't have to pretend to be okay with me. We can talk if you want, or we can just sit quietly. You don't have to be cheerful all the time.",
            delayMs: 1100
          }
        ]
      },
      {
        id: 'does-he-listen',
        title: "Does he listen?",
        choiceText: "Do you actually remember what I tell you?",
        turns: [
          {
            speaker: 'Ashu',
            text: "Do you actually remember the random things I tell you?",
            delayMs: 0
          },
          {
            speaker: 'Akshay',
            text: "More than you think. You might forget that you told me something, but if it mattered to you, there's a good chance I was listening.",
            delayMs: 1100
          }
        ]
      },
      {
        id: 'love-question',
        title: "The funny love question",
        choiceText: "Do you love me? 😂",
        turns: [
          {
            speaker: 'Ashu',
            text: "Achha, tell me one thing honestly… do you love me?",
            delayMs: 0
          },
          {
            speaker: 'Akshay',
            text: "Ghari Jake Sutti Babu 😂❤️",
            delayMs: 1200
          },
          {
            speaker: 'Ashu',
            text: "SERIOUSLY? That's your answer? 😭😂",
            delayMs: 2200 // Longer playful pause for comic timing
          },
          {
            speaker: 'Akshay',
            text: "Okay, okay! 😂❤️ You already know you're special to me. I just couldn't resist teasing you.",
            delayMs: 1500
          }
        ]
      },
      {
        id: 'birthday-wish',
        title: "Her birthday wish",
        choiceText: "Your birthday wish for me?",
        turns: [
          {
            speaker: 'Ashu',
            text: "If you could wish one thing for me this year, what would it be?",
            delayMs: 0
          },
          {
            speaker: 'Akshay',
            text: "That you feel happy in ways you don't have to force. That you have people who understand you, opportunities you're excited about, and enough peaceful days to enjoy the little things. And whenever life gets messy, I hope you remember you don't have to figure everything out in one day.",
            delayMs: 1200
          }
        ]
      },
      {
        id: 'one-more-chai',
        title: "One more chai",
        choiceText: "One more cup? Or getting bored?",
        turns: [
          {
            speaker: 'Ashu',
            text: "One more cup? Or are you getting bored of me already?",
            delayMs: 0
          },
          {
            speaker: 'Akshay',
            text: "Bored of you? Never. But if we keep ordering chai, we'll have to start negotiating with the café owner to let us stay until morning. 😂",
            delayMs: 1100
          }
        ]
      },
      {
        id: 'remember-tonight',
        title: "Remember tonight",
        choiceText: "What should we remember about tonight?",
        turns: [
          {
            speaker: 'Ashu',
            text: "What's one thing you'd want us to remember about tonight?",
            delayMs: 0
          },
          {
            speaker: 'Akshay',
            text: "That we didn't need a perfect plan or anything extraordinary. Just a little time together, some chai, and a conversation I wouldn't mind having all over again.",
            delayMs: 1100
          }
        ]
      }
    ]
  },

  // 12. Scene 10 — Rooftop Finale
  rooftop: {
    badgeText: "Above The City",
    line1: "Some moments are beautiful because they are simple.",
    line2: "A quiet sky. A little time. Someone worth celebrating.",
    buttonText: "Read our final note →"
  },

  // 13. Scene 11 — Final Note & Heart Fireworks
  finale: {
    badgeText: "A Birthday Keepsake",
    noteParagraphs: [
      "Maybe I couldn't make this little dream real, but I hope you find happiness in the real world in a thousand different ways.",
      "May your days be kinder, your heart feel lighter, and your future be filled with beautiful surprises.",
      "No matter where life takes you, I hope this new year brings you reasons to smile that you never even expected.",
      "So I made this little world for you.",
      "Happy Birthday."
    ],
    noteSignature: "— Akshay",
    fireworksHeading: "Happy Birthday ❤️",
    fireworksSubtitle: "A little story, made just for you.",
    replayButtonText: "Replay our story ↻",
    readLetterButtonText: "Read the letter again ✉"
  },

  // Hidden easter egg heart messages scattered throughout scenes
  secretMessages: [
    {
      id: 'secret-1',
      locationHint: "Glowing window in the apartment building",
      title: "Secret Note #1 🌟",
      message: "A little reminder: you deserve endless kindness, patience, and warmth."
    },
    {
      id: 'secret-2',
      locationHint: "Floating in the midnight fireworks sky",
      title: "Secret Note #2 🎆",
      message: "I hope something genuinely wonderful surprises you today and makes you laugh out loud."
    },
    {
      id: 'secret-3',
      locationHint: "Tucked inside the bouquet wrapping",
      title: "Secret Note #3 🌹",
      message: "May you find unexpected joy and peace in the smallest, simplest moments of your day."
    },
    {
      id: 'secret-4',
      locationHint: "Warm window pane at Chai Point",
      title: "Secret Note #4 ☕",
      message: "Every conversation with you is my favorite memory in the making."
    },
    {
      id: 'secret-5',
      locationHint: "Shooting star in the finale rooftop sky",
      title: "Secret Note #5 🌙",
      message: "Here's one more reason to smile: you are loved, today and every day after. ❤️"
    }
  ]
};

// Also export alias for compatibility with any existing imports
export const BIRTHDAY_CONFIG = {
  ...STORY_CONFIG,
  openingDedication: STORY_CONFIG.opening.subtitle,
  personalLetter: {
    greeting: STORY_CONFIG.letter.greeting,
    paragraphs: STORY_CONFIG.letter.paragraphs,
    closing: STORY_CONFIG.letter.closing
  },
  flowerMessages: STORY_CONFIG.bouquet.flowers,
  scooterRoutes: STORY_CONFIG.scooter.routes,
  chaiDialogues: STORY_CONFIG.chai.conversations.map(c => ({
    id: c.id,
    tabTitle: c.choiceText,
    tagline: c.title,
    dialogue: c.turns.map(t => ({
      speaker: t.speaker === 'Ashu' ? ('girl' as const) : ('boy' as const),
      text: t.text
    }))
  })),
  finalBirthdayMessage: {
    heading: `Happy Birthday, ${STORY_CONFIG.girlName}. ❤️`,
    paragraphs: STORY_CONFIG.finale.noteParagraphs,
    closing: STORY_CONFIG.finale.noteSignature
  },
  finalHandwrittenNote: {
    paragraphs: STORY_CONFIG.finale.noteParagraphs,
    signature: STORY_CONFIG.finale.noteSignature
  }
};
