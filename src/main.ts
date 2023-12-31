import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { cors: true });
  app.useGlobalPipes(
    new ValidationPipe({
      transform: true,
    }),
  );
  await app.listen(process.env.SERVER_PORT);

  app.enableCors();

  console.log(
    `App running at http://${process.env.CONFIG_POSTGRES_HOST}:${process.env.SERVER_PORT}/docs`,
  );
}
bootstrap();
