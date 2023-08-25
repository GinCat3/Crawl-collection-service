import { Inject } from '@nestjs/common';
import {
  getBrowserToken,
  getPageToken,
  getContextToken,
} from './puppeteer.util';

export const InjectBrowser = (instanceName?: string) =>
  Inject(getBrowserToken(instanceName));

export const InjectContext = (instanceName?: string) =>
  Inject(getContextToken(instanceName));

export const InjectPage = (instanceName?: string) =>
  Inject(getPageToken(instanceName));
