import {
  Module,
  Inject,
  Global,
  DynamicModule,
  OnApplicationShutdown,
  OnModuleDestroy,
} from '@nestjs/common';

import { ModuleRef } from '@nestjs/core';

import {
  PuppeteerLaunchOptions,
  Browser,
  BrowserContext,
  launch,
} from 'puppeteer';
import {
  DEFAULT_CHROME_LAUNCH_OPTIONS,
  DEFAULT_PUPPETEER_INSTANCE_NAME,
  PUPPETEER_INSTANCE_NAME,
} from './puppeteer.constants';

import {
  getBrowserToken,
  getPageToken,
  getContextToken,
} from './puppeteer.util';

@Global()
@Module({})
export class PuppeteerModule implements OnApplicationShutdown, OnModuleDestroy {
  constructor(
    @Inject(PUPPETEER_INSTANCE_NAME) private readonly instanceName: string,
    private readonly moduleRef: ModuleRef,
  ) {}
  onApplicationShutdown() {
    return this.onModuleDestroy();
  }

  static forRoot(
    launchOptions: PuppeteerLaunchOptions = DEFAULT_CHROME_LAUNCH_OPTIONS,
    instanceName: string = DEFAULT_PUPPETEER_INSTANCE_NAME,
  ): DynamicModule {
    const instanceNameProvider = {
      provide: PUPPETEER_INSTANCE_NAME,
      useValue: instanceName,
    };

    const browserProvider = {
      provide: getBrowserToken(instanceName),
      async useFactory() {
        return await launch(launchOptions);
      },
    };

    const contextProvider = {
      provide: getContextToken(instanceName),
      async useFactory(browser: Browser) {
        return browser.createIncognitoBrowserContext();
      },
      inject: [getBrowserToken(instanceName)],
    };

    const pageProvider = {
      provide: getPageToken(instanceName),
      async useFactory(context: BrowserContext) {
        return await context.newPage();
      },
      inject: [getContextToken(instanceName)],
    };

    return {
      module: PuppeteerModule,
      providers: [
        instanceNameProvider,
        browserProvider,
        contextProvider,
        pageProvider,
      ],
      exports: [browserProvider, contextProvider, pageProvider],
    };
  }

  async onModuleDestroy() {
    const instanceName = getBrowserToken(this.instanceName);
    const browser: Browser = this.moduleRef.get(instanceName);

    if (browser?.isConnected()) await browser.close();
  }
}
