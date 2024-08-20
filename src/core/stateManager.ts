import { create } from 'zustand';
import { AudioState, PluginState } from './types';

const useAudioStore = create<AudioState>((set) => ({
  plugins: {},
  addPlugin: (pluginName, initialState) => set((state) => ({
    plugins: {
      ...state.plugins,
      [pluginName]: initialState
    }
  })),
  updatePluginState: (pluginName: string, newState: Partial<PluginState<any>>) =>
    set((state) => ({
      plugins: {
        ...state.plugins,
        [pluginName]: {
          ...state.plugins[pluginName],
          ...newState
        } as PluginState<any>
      }
    }))
}));

export default useAudioStore;
