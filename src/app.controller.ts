import { Controller } from '@nestjs/common';
import { AppService } from './app.service';
import {
  MessagePattern,
  Payload,
  Ctx,
  RmqContext,
} from '@nestjs/microservices';

@Controller()
export class AppController {
  


  constructor(private readonly appService: AppService) {}

  @MessagePattern('crawl')
  async crawl(@Payload() data: number[], @Ctx() context: RmqContext) {

    const originalMsg = context.getMessage();
    const message = originalMsg.content.toString();

    const channel = context.getChannelRef();

    await this.appService.crawl(message, context);

    channel.ack(originalMsg);
  }
}
