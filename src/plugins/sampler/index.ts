import { el, ElemNode } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { AudioPlugin, PluginState } from '../../core/types';
import useAudioStore from '../../core/stateManager';

export interface Sample {
  buffer: Float32Array;
  sampleRate: number;
}

export interface SamplerVoice {
  sampleIndex: number;
  pitch: number;
  gain: number;
  start: number;
  end: number;
  loop: boolean;
  triggerTime: number;
}

export interface SamplerState {
  samples: Sample[];
  voices: SamplerVoice[];
  attack: number;
  decay: number;
  sustain: number;
  release: number;
}

class SamplerPlugin implements AudioPlugin<SamplerState> {
  name = 'sampler';
  private audioContext: AudioContext | null = null;
  private renderer: WebRenderer | any | null = null;

  initialState: PluginState<SamplerState> = {
    samples: { value: [] },
    voices: { value: [] },
    attack: { value: 0.01, min: 0, max: 2, step: 0.01 },
    decay: { value: 0.1, min: 0, max: 2, step: 0.01 },
    sustain: { value: 0.5, min: 0, max: 1, step: 0.01 },
    release: { value: 0.5, min: 0, max: 2, step: 0.01 },
  };

  setAudioContext(ctx: AudioContext) {
    console.log('SET AudioContext FOR SAMPLER');
    this.audioContext = ctx;
  }

  setRenderer(renderer: WebRenderer | null) {
    this.renderer = renderer;
  }

  async loadSample(url: string): Promise<void> {
    if (!this.audioContext) {
      throw new Error(
        'AudioContext not set. Make sure to call setAudioContext before loading samples.'
      );
    }
    if (!this.renderer) {
      throw new Error(
        'Renderer not set. Make sure to call setRenderer before loading samples.'
      );
    }

    const response = await fetch(url);
    const arrayBuffer = await response.arrayBuffer();
    const audioBuffer = await this.audioContext.decodeAudioData(arrayBuffer);

    const sample: Sample = {
      buffer: audioBuffer.getChannelData(0),
      sampleRate: audioBuffer.sampleRate,
    };

    const sampleIndex = this.initialState.samples.value.length;
    this.initialState.samples.value.push(sample);

    // Update the Virtual File System
    this.renderer.updateVirtualFileSystem({
      [`sample_${sampleIndex}`]: sample.buffer.slice(),
    });

    console.log({ url, buffer: sample.buffer });

    console.log('VFS contents:', await this.renderer.listVirtualFileSystem());
  }

  triggerSample(
    sampleIndex: number,
    pitch: number = 1,
    start: number = 0,
    end: number = 1,
    loop: boolean = false
  ): void {
    const voice: SamplerVoice = {
      sampleIndex,
      pitch,
      gain: 1,
      start,
      end,
      loop,
      triggerTime: Date.now(),
    };

    console.log('TRIGGER SAMPLE', voice);
    useAudioStore.getState().updatePluginState('sampler', {
      voices: {
        value: [
          ...useAudioStore.getState().plugins.sampler.voices.value,
          voice,
        ],
      },
    });
  }

  releaseSample(index: number): void {
    if (index < this.initialState.voices.value.length) {
      this.initialState.voices.value.splice(index, 1);
    }
  }

  process(input: ElemNode | null): ElemNode {
    const { samples, voices, attack, decay, sustain, release } =
      useAudioStore.getState().plugins.sampler as PluginState<SamplerState>;

    const samplerNodes = voices.value.map((voice, index) => {
      const sample = samples.value[voice.sampleIndex];
      if (!sample) return el.const({ value: 0 });

      const playbackRate = el.const({ value: voice.pitch });
      const trigger = el.const({
        value: Date.now() - voice.triggerTime < 10 ? 1 : 0,
      });

      const samplePlayer = el.sample(
        {
          path: `sample_${voice.sampleIndex}`,
          mode: voice.loop ? 'loop' : 'trigger',
        },
        trigger,
        playbackRate
      );

      const envelope = el.adsr(
        attack.value,
        decay.value,
        sustain.value,
        release.value,
        trigger
      );

      return el.mul(samplePlayer, envelope, el.const({ value: voice.gain }));
    });

    const mixedOutput = samplerNodes.reduce(
      (acc, node) => el.add(acc, node),
      el.const({ value: 0 })
    );

    return input ? el.add(input, mixedOutput) : mixedOutput;
  }
}

export default new SamplerPlugin();
