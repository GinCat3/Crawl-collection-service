import { Injectable, Inject } from '@nestjs/common';
import { MagicEdenService } from './services/magiceden.service';
import { TaskMessage } from './common/interfaces/task-message.interface';
import { Ctx, RmqContext } from '@nestjs/microservices';

@Injectable()
export class AppService {
  // @Inject()
  // private twitterService: TwitterService;
  @Inject()
  private magicEdenService: MagicEdenService;

  public parseMessage(msg: string): TaskMessage {
    const message: TaskMessage = JSON.parse(msg);
    return message;
  }

  public async crawl(msg: string, @Ctx() context: RmqContext): Promise<void> {
    console.log('msg', msg);

    // 手动发送消息
    // msg {"pattern": "crawl", "symbol": "nw", "url": "https://magiceden.io/ordinals/marketplace/nw", "type": ""}
    // 自动发消息时数据结构
    // msg {"pattern":"crawl","data":{"pattern":"crawl","symbol":"nw","url":"https://magiceden.io/ordinals/marketplace/nw","type":""}}

    let message = JSON.parse(msg);

    if (message.data) {
      message = message.data;
    }

    await this.magicEdenService.crawl(message);
  }
}

