import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';
import cookieParser from 'cookie-parser';
import cors from 'cors';

if (process.env.NODE_ENV === 'production' && (!process.env.REDIS_URL || !process.env.DATABASE_URL)) {
  throw new Error('Missing production config');
}

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.use(cookieParser());

  const originWhitelist: string[] = require('./originWhiteList');
  const corsOptions = {
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);
      if (originWhitelist.indexOf(origin) !== -1) return callback(null, true);
      callback(new Error('Not allowed by CORS'), false);
    },
    credentials: true,
    optionsSuccessStatus: 204,
  };
  app.use(cors(corsOptions));

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
  }));

  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();