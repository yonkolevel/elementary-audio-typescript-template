import audioEngine from './audioEngine';
import useAudioStore from './stateManager';
import { AudioPlugin } from './types';

const pluginSystem = {
  loadPlugin: (pluginModule: AudioPlugin | { default: AudioPlugin }) => {
    const plugin = 'default' in pluginModule ? pluginModule.default : pluginModule;
    audioEngine.addPlugin(plugin);
    useAudioStore.getState().addPlugin(plugin.name, plugin.initialState);
  }
};

export default pluginSystem;
