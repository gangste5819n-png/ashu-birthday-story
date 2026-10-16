import React from 'react';
import { MusicProvider } from './context/MusicContext';
import { SceneManager } from './components/SceneManager';
import { MusicPlayer } from './components/MusicPlayer';

export const App: React.FC = () => {
  return (
    <MusicProvider>
      <main className="w-full h-full relative overflow-hidden bg-slate-950 font-sans" role="main">
        {/* Core Cinematic Scene Manager */}
        <SceneManager />

        {/* Global Persistent Audio Controller */}
        <MusicPlayer />
      </main>
    </MusicProvider>
  );
};

export default App;
