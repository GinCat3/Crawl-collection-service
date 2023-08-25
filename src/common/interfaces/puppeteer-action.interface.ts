export interface PuppeteerAction {
  type: string;
  selector?: string;
  value?: string;
  delay?: number;
  timeout?: number;
  url?: string;
  function?: string;
  path?: string;
}
