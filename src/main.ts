import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Transport, MicroserviceOptions } from '@nestjs/microservices';
import { ConfigService } from '@nestjs/config';

async function bootstrap() {

  const RABBITMQ_HOST = process.env.RABBITMQ_HOST;
  const RABBITMQ_PORT = process.env.RABBITMQ_PORT;
  const RABBITMQ_USERNAME = process.env.RABBITMQ_USERNAME;
  const RABBITMQ_PASSWORD = process.env.RABBITMQ_PASSWORD;

  const app = await NestFactory.createMicroservice<MicroserviceOptions>(
    AppModule,
    {
      transport: Transport.RMQ,
      options: {
        urls: [`amqp://${RABBITMQ_USERNAME}:${RABBITMQ_PASSWORD}@${RABBITMQ_HOST}:${RABBITMQ_PORT}`],
        queue: 'spider',
        queueOptions: {
          durable: false,
          autoDelete: false,
          exchange: 'spider',
          routingKey: 'spider.classic.magiceden',
        },
        noAck: false,
        prefetchCount: 1,
        isGlobalPrefetchCount: true,
      },
    },
  );

  await app.listen();
}
bootstrap();
