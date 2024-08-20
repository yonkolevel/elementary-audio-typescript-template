import { useCallback } from 'react';
import useAudioStore from '../core/stateManager';
import audioEngine from '../core/audioEngine';
import { PluginState, PluginParameter } from '../core/types';

function useAudioPlugin<T extends Record<string, any>>(pluginName: string): [
  PluginState<T> | null,
  <K extends keyof T>(param: K, value: T[K]) => void
] {
  const pluginState = useAudioStore((state) => state.plugins[pluginName]) as PluginState<T> | undefined;
  const updatePluginState = useAudioStore((state) => state.updatePluginState);

  const setParameter = useCallback(<K extends keyof T>(param: K, value: T[K]) => {
    if (pluginState) {
      updatePluginState(pluginName, { [param]: { ...pluginState[param], value } as PluginParameter<T[K]> });
      audioEngine.render();
    }
  }, [pluginName, updatePluginState, pluginState]);
console.log(pluginState)
  return [pluginState || null, setParameter];
}

export default useAudioPlugin;
