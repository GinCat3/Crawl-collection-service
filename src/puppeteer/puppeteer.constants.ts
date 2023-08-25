import type { PuppeteerLaunchOptions } from 'puppeteer';

export const PUPPETEER_INSTANCE_NAME = 'PuppeteerInstance';
export const PUPPETEER_MODULE_OPTIONS = 'PuppeteerModuleOptions';

export const DEFAULT_PUPPETEER_INSTANCE_NAME = 'DefaultPuppeteer';

const args: PuppeteerLaunchOptions['args'] = [
  '--allow-insecure-localhost',
  '--allow-http-screen-capture',
  '--no-zygote',
];

if (typeof process.getuid === 'function') {
  args.push('--no-sandbox');
}

export const DEFAULT_CHROME_LAUNCH_OPTIONS: PuppeteerLaunchOptions = {
  headless: false,
  args,
  pipe: process.platform !== 'win32',
};

export const DEFAULT_CHROME_USER_AGENT =
  'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/114.0.0.0 Safari/537.36';
