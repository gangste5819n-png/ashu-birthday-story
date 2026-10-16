# A Little Birthday Story — Cinematic Interactive Mini-Movie 🎂✨

An immersive, cinematic interactive web experience crafted to celebrate someone truly special. Features layered nighttime cityscapes, animated fireworks with realistic physics on HTML Canvas, Web Audio API sound synthesis & custom MP3 support, romantic envelope opening with wax seal, interactive flower bouquet, late-night scooter ride, Chai Point café conversation choices, quiet rooftop stargazing, and handwritten keepsakes.

---

## 🚀 Quick Start Guide

### 1. Install Dependencies
```bash
npm install
```

### 2. Start the Development Server
```bash
npm run dev
```
Open **[http://localhost:5173](http://localhost:5173)** in your browser.

### 3. Build for Production
```bash
npm run build
npm run preview
```

---

## 🎵 Background Music & Audio Setup

### 1. Where to Put Your Background Music File
Place your MP3 file directly into the `public/audio/` folder:
- File path: `public/audio/birthday-song.mp3`
- Browser URL: `/audio/birthday-song.mp3`

> **Note**: Even if you haven't added the MP3 file yet, the website will **never crash**! An atmospheric piano synthesizer will play gentle romantic arpeggios via the Web Audio API until your custom MP3 file is placed. Once placed, your song will start smoothly after clicking *"Begin our story"*, looping across all 11 scene transitions without restarting.

### 2. Fireworks & Sound Effects (Local or Synthesized Fallback)
The interactive fireworks experience includes launch whistles, deep explosions, and delicate sparkling tails.

You may optionally place custom sound effects in:
- `public/audio/fireworks-launch.mp3`
- `public/audio/fireworks-burst.mp3`
- `public/audio/fireworks-sparkle.mp3`

If these files are omitted, our built-in **Web Audio API synthesizer** automatically generates realistic, synchronized acoustic effects for every launch and burst.

### 3. Audio Controls
The floating music pill in the top-right corner allows you to:
- **Play / Pause** background music.
- **Mute / Unmute** sound.
- Expand controls to adjust **Music Volume** (slider).
- Independently toggle and adjust **Fireworks Sound** (slider).
- Toggle **Story Chimes & Ambience**.

---

## ✍️ How to Personalize Names, Notes, and Messages

All character names, letter text, bouquet flower messages, café dialogues, final notes, and audio paths are managed in a single central configuration file:

📁 **`src/config/storyConfig.ts`**

### Editable Fields:
```typescript
export const STORY_CONFIG = {
  // 1. Character Names
  boyName: "Akshay",
  girlName: "Ashu",
  birthdayDate: "Tonight",

  // 2. Secret Letter (Scene 2)
  letter: {
    greeting: "Hey Ashu, birthday girl,",
    paragraphs: [ ... ],
    closing: "— Akshay"
  },

  // 3. Flower Messages (Scene 6)
  bouquet: {
    flowers: [
      { id: 1, title: "Reason to Smile", message: "..." },
      ...
    ]
  },

  // 4. Café Dialogues (Scene 9)
  chai: {
    conversations: [
      { id: 'why-matter', choiceText: "...", response: "..." },
      ...
    ]
  },

  // 5. Final Handwritten Note (Scene 11)
  finale: {
    noteParagraphs: [ ... ],
    noteSignature: "— Akshay"
  }
};
```
Change any value in `src/config/storyConfig.ts` and the entire experience updates instantly via Vite Hot Module Replacement (HMR)!

---

## 🎬 The 11 Story Scenes

1. **Scene 1 — Opening**: Twilight skyline, crescent moon, title, dedication to Ashu, and *"Begin our story →"* (starts audio).
2. **Scene 2 — The Secret Letter**: Warmly lit envelope with wax seal, break the seal to read the handwritten letter from Akshay.
3. **Scene 3 — 11:55 PM**: Apartment building exterior, anticipation, digital clock, accelerated wait to midnight.
4. **Scene 4 — Midnight Fireworks**: 3… 2… 1… countdown, *"12:00 AM Happy Birthday, Ashu!"*, interactive Canvas fireworks, click anywhere in the sky to make wishes.
5. **Scene 5 — She Comes Downstairs**: Illuminated entrance, gentle camera reveal, *"Give her the flowers 🌹"*.
6. **Scene 6 — The Bouquet**: Wrapping paper and ribbon, tap individual roses to reveal 5 distinct secret wishes.
7. **Scene 7 — The Hug**: Emotional embrace with slow zoom, rim lighting, and warm light particles.
8. **Scene 8 — The Night Scooter Ride**: Helmets on, realistic riding pose, passing streetlights, road reflections, and 3 selectable routes (*City Lights*, *Quiet Riverside*, *Direct*).
9. **Scene 9 — Chai Point**: Warm café interior with steaming chai cups, 4 interactive conversation choices with speech bubbles.
10. **Scene 10 — Rooftop Finale**: Peaceful elevated skyline, crescent moon, and quiet reflection.
11. **Scene 11 — Final Note & Heart Fireworks**: Handwritten keepsake appearing gradually on parchment, followed by an explosion of heart-shaped fireworks and replay options.

---

## 🔍 How to Test the Complete Experience

1. Run `npm run dev` and navigate to `http://localhost:5173`.
2. Click **"Begin our story →"** on the opening scene (starts audio).
3. Click the **Wax Seal** to open and read the secret letter; test closing and re-opening it.
4. On the **11:55 PM** scene, click **"Wait for midnight"** and observe the fictional accelerated clock ticking down to midnight.
5. On the **Midnight Fireworks** scene, tap multiple areas of the sky to launch fireworks and release floating wish badges; observe particle gravity, trails, and synchronized audio.
6. Click **"She's coming downstairs →"**, then **"Give her the flowers 🌹"**.
7. In **The Bouquet**, click different roses to verify each popup message opens and closes cleanly.
8. Continue to **The Hug** and **The Scooter Ride**; test clicking different route buttons (*"City lights ✨"*, *"Quiet riverside 🌙"*) to observe the background transitions.
9. At **Chai Point**, tap through the conversation choices (*"Tell me something that made you smile"*, *"What's one dream you want to chase?"*, etc.) to test the dialogue bubbles.
10. Progress to the **Rooftop** and **Finale**; observe the handwritten letter typed out on parchment, click **"Heart Fireworks for You ✨"**, and test the **"Replay our story ↻"** button (restarts from Scene 1 without restarting the background music).
11. Use the top-left **Progress Dots** and bottom-left **Arrow Controls** to quickly jump between any scenes.
12. Find the hidden glowing **Secret Hearts** in the scenes to unlock bonus sweet notes!
