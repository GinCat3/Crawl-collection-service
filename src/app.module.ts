import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { PuppeteerModule } from './puppeteer/puppeteer.module';
import { PuppeteerService } from './services/puppeteer.service';
import { MagicEdenService } from './services/magiceden.service';
import { CollectionService } from './collection/collection.service';
import { CollectionModule } from './collection/collection.module';
import { ConfigModule } from '@nestjs/config';
import configuration from './config/configuration';


@Module({
  imports: [ 
    PuppeteerModule.forRoot(), 
    CollectionModule, 
    ConfigModule.forRoot({
      envFilePath: ['.env.development', '.env.prod'],
      load: [ configuration ],
      isGlobal: true,
    }), 
  ],
  controllers: [AppController],
  providers: [AppService,  PuppeteerService, MagicEdenService, CollectionService],
})
export class AppModule {}
