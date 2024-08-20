export interface SamplerState {
  samples: Sample[];
  voices: SamplerVoice[];
  attack: number;
  decay: number;
  sustain: number;
  release: number;
  playbackMode: 'thru' | 'trigger';
}

export interface SamplerVoice {
  sampleIndex: number;
  pitch: number;
  gain: number;
  start: number;
  end: number;
  loop: boolean;
  triggerTime: number;
  isPlaying: boolean;
}

export interface Sample {
  buffer: Float32Array;
  sampleRate: number;
}
