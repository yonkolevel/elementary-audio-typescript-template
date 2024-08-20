import React, { useState, useEffect } from 'react';
import audioEngine from './core/audioEngine';
import pluginSystem from './core/pluginSystem';
import basicSynthPlugin from './plugins/basicSynth';
import samplerPlugin from './plugins/sampler';
import AudioControls from './components/AudioControls';
import SamplerControls from './components/SamplerControls';

const App: React.FC = () => {
  const [isAudioStarted, setIsAudioStarted] = useState(false);

  useEffect(() => {
    // Load a sample when the component mounts
  }, [isAudioStarted]);

  const handleStart = async () => {
    try {
      console.log('Initializing audio...');
      await audioEngine.initialize();
      console.log('Audio initialized');

      console.log('Starting audio...');
      await audioEngine.start();
      console.log('Audio started');

      pluginSystem.loadPlugin(basicSynthPlugin);
      pluginSystem.loadPlugin(samplerPlugin);
      console.log('Plugins loaded');

      audioEngine.render();
      console.log('Audio rendered');
      samplerPlugin.loadSample('http://localhost:3000/samples/piano.mp3');

      setIsAudioStarted(true);
    } catch (error) {
      console.error('Failed to start audio:', error);
    }
  };

  return (
    <div className='App'>
      <h1>Elementary Audio TypeScript Template</h1>
      {isAudioStarted ? (
        <>
          <AudioControls />
          <SamplerControls />
        </>
      ) : (
        <button onClick={handleStart}>Start Audio</button>
      )}
    </div>
  );
};

export default App;
