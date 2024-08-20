import { ElemNode } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';
import { AudioPlugin } from './types';

class AudioEngine {
  private core: WebRenderer | null = null;
  private ctx: AudioContext | null = null;
  private plugins: AudioPlugin[] = [];

  async initialize(): Promise<void> {
    console.log('AudioEngine: Initializing...');
    this.ctx = new (window.AudioContext || (window as any).webkitAudioContext)();
    this.core = new WebRenderer();
    console.log('AudioEngine: AudioContext and WebRenderer created');
  }

  async start(): Promise<void> {
    console.log('AudioEngine: Starting...');
    if (!this.ctx || !this.core) {
      throw new Error('AudioEngine not initialized');
    }

    try {
      console.log('AudioEngine: Initializing WebRenderer...');
      const node = await this.core.initialize(this.ctx, {
        numberOfInputs: 0,
        numberOfOutputs: 1,
        outputChannelCount: [2],
      }) as any;

      console.log({ node })
      node.connect(this.ctx.destination);
      console.log('AudioEngine: WebRenderer initialized and connected');
    } catch (error) {
      console.error('Failed to initialize WebRenderer:', error);
      throw error;
    }

    console.log('AudioEngine: Started');
  }

  addPlugin(plugin: AudioPlugin): void {
    console.log(`AudioEngine: Adding plugin ${plugin.name}`);
    this.plugins.push(plugin);
    console.log("plugins", this.plugins)
    if (plugin.setAudioContext) {
      plugin.setAudioContext(this.ctx!);
    }
    if (plugin.setRenderer) {
      plugin.setRenderer(this.core);
    }
  }

  render(): void {
    console.log('AudioEngine: Rendering...');
    if (!this.core) {
      console.error('AudioEngine: Core not initialized');
      return;
    }

    const nodes = this.plugins.reduce<ElemNode | null>((acc, plugin) => {
      return plugin.process(acc);
    }, null);

    if (nodes) {
      this.core.render(nodes, nodes);
      console.log('AudioEngine: Rendered');
    } else {
      console.warn('AudioEngine: No nodes to render');
    }
  }
}

export default new AudioEngine();
