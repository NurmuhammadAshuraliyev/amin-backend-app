import { NestFactory } from '@nestjs/core';
import { ValidationPipe } from '@nestjs/common';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');

  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
    }),
  );

  app.enableCors({
    origin: ['http://127.0.0.1:5500', 'http://localhost:5500'],
    credentials: true,
  });

  await app.listen(process.env.PORT as string, '0.0.0.0');
  console.log(
    `🚀 Server running on http://localhost:${process.env.PORT as string}`,
  );
}
bootstrap();
