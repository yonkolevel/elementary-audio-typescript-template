declare module '@elemaudio/web-renderer' {
  export default class WebRenderer {
    workletUrl: string;
    initialize(ctx: AudioContext, options: any): Promise<void>;
    render(left: any, right: any): void;
  }
}
