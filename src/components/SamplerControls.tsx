import React from 'react';
import useAudioPlugin from '../hooks/useAudioPlugin';
import { SamplerState } from '../plugins/sampler';

const SamplerControls: React.FC = () => {
  const [samplerState, setParameter] = useAudioPlugin<SamplerState>('sampler');

  if (!samplerState) {
    return <p>Loading sampler state...</p>;
  }

  const triggerSample = () => {
    setParameter('voices', [
      ...samplerState.voices.value,
      {
        sampleIndex: 0,
        pitch: 1,
        gain: 1,
        start: 0,
        end: 100,
        loop: false,
        triggerTime: Date.now(),
      },
    ]);
  };

  return (
    <div>
      <h2>Sampler Controls</h2>
      <button onClick={triggerSample}>Play Sample</button>
      <div>
        <label>
          Attack:
          <input
            type='range'
            min={samplerState.attack.min}
            max={samplerState.attack.max}
            step={samplerState.attack.step}
            value={samplerState.attack.value}
            onChange={(e) => setParameter('attack', parseFloat(e.target.value))}
          />
          {samplerState.attack.value.toFixed(2)} s
        </label>
      </div>
      {/* Add similar controls for decay, sustain, and release */}
    </div>
  );
};

export default SamplerControls;
