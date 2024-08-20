import { el, ElemNode } from '@elemaudio/core';
import { AudioPlugin, PluginState } from '../../core/types';
import useAudioStore from '../../core/stateManager';
import { BasicSynthState } from './types';

const basicSynthPlugin: AudioPlugin<BasicSynthState> = {
  name: 'basicSynth',
  initialState: {
    frequency: { value: 440, min: 20, max: 20000, step: 1 },
    waveform: { value: 'sine' },
    noteOn: { value: false },
    noteFrequency: { value: 440 },
  },
  process: (input): ElemNode => {
    const { frequency, waveform, noteOn, noteFrequency } = useAudioStore.getState().plugins.basicSynth as PluginState<BasicSynthState>;
    
    const freq = noteOn.value ? noteFrequency.value : frequency.value;
    const oscillator = waveform.value === 'sine' ? el.cycle(freq) : el.saw(freq);
    
    const envelope = el.adsr(0.01, 0.1, 0.5, 0.1, noteOn.value ? 1 : 0);
    
    return el.mul(oscillator, envelope);
  }
};

export default basicSynthPlugin;
