import { Injectable, Inject } from '@nestjs/common';
import { PuppeteerService } from '../services/puppeteer.service';
// import { TwitterAccountService } from '../entities/twitter-account.service';
import { TaskMessage } from '../common/interfaces/task-message.interface';

@Injectable()
export class MagicEdenService {
  @Inject()
  private puppeteerService: PuppeteerService;

  @Inject()
  // private twitterAccountService: TwitterAccountService;

  public async crawl(msg: TaskMessage) {
    await this.puppeteerService.crawl1(msg);
  }
}
