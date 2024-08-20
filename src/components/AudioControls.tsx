import React from 'react';
import audioEngine from '../core/audioEngine';
import useAudioPlugin from '../hooks/useAudioPlugin';
import { BasicSynthState } from '../plugins/basicSynth/types';

const AudioControls: React.FC = () => {
  const [pluginState, setParameter] = useAudioPlugin<BasicSynthState>('basicSynth');

  if (!pluginState) {
    return <p>Loading plugin state...</p>;
  }

  const noteOn = (note: number) => {
    setParameter('noteOn', true);
    setParameter('noteFrequency', note);
  };

  const noteOff = () => {
    setParameter('noteOn', false);
  };

  const notes = [
    { name: 'C', frequency: 261.63 },
    { name: 'D', frequency: 293.66 },
    { name: 'E', frequency: 329.63 },
    { name: 'F', frequency: 349.23 },
    { name: 'G', frequency: 392.00 },
    { name: 'A', frequency: 440.00 },
    { name: 'B', frequency: 493.88 },
  ];

  return (
    <div>
      <h2>Basic Synth Controls</h2>
      <div>
        <label>
          Base Frequency:
          <input
            type="range"
            min={pluginState.frequency.min}
            max={pluginState.frequency.max}
            step={pluginState.frequency.step}
            value={pluginState.frequency.value}
            onChange={(e) => setParameter('frequency', parseFloat(e.target.value))}
          />
          {pluginState.frequency.value.toFixed(2)} Hz
        </label>
      </div>
      <div>
        <label>
          Waveform:
          <select
            value={pluginState.waveform.value}
            onChange={(e) => setParameter('waveform', e.target.value as 'sine' | 'saw')}
          >
            <option value="sine">Sine</option>
            <option value="saw">Saw</option>
          </select>
        </label>
      </div>
      <div>
        <h3>Piano</h3>
        {notes.map((note) => (
          <button
            key={note.name}
            onMouseDown={() => noteOn(note.frequency)}
            onMouseUp={noteOff}
            onMouseLeave={noteOff}
          >
            {note.name}
          </button>
        ))}
      </div>
    </div>
  );
};

export default AudioControls;
