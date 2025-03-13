import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as cookieParser from 'cookie-parser';
import { join } from 'path';
import { NestExpressApplication } from '@nestjs/platform-express';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { rawBody: true });
  app.use(cookieParser());
  app.enableCors({
    origin:["http://localhost:3000","https://scrive.pro"],
    credentials: true,
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS',
    allowedHeaders: 'Content-Type, Accept, Authorization',
  });
  app.useStaticAssets(join(process.cwd(), 'public'), {
    prefix: '/',
  });
  await app.listen(5000);
}
bootstrap();
