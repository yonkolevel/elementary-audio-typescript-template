import { ElemNode } from '@elemaudio/core';
import WebRenderer from '@elemaudio/web-renderer';


export interface AudioPlugin<T extends Record<string, any> = any> {
  name: string;
  initialState: PluginState<T>;
  process: (input: ElemNode | null) => ElemNode;
  setAudioContext?: (ctx: AudioContext) => void;
  setRenderer?: (renderer: WebRenderer | null) => void;
}

export type PluginParameter<T> = {
  value: T;
  min?: number;
  max?: number;
  step?: number;
};

export type PluginState<T extends Record<string, any>> = {
  [K in keyof T]: PluginParameter<T[K]>;
};

export interface AudioState {
  plugins: {
    [key: string]: PluginState<any>;
  };
  addPlugin: (pluginName: string, initialState: PluginState<any>) => void;
  updatePluginState: (pluginName: string, newState: Partial<PluginState<any>>) => void;
}
