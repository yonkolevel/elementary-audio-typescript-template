export interface BasicSynthState {
  frequency: number;
  waveform: 'sine' | 'saw';
  noteOn: boolean;
  noteFrequency: number;
}
