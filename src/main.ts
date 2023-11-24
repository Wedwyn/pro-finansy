import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import * as session from 'express-session';
import RedisStore from 'connect-redis';
import { createClient } from 'redis';

async function start() {
  const PORT = process.env.PORT || 5000;
  const app = await NestFactory.create(AppModule);

  const redisClient = createClient({
    socket: {
      host: process.env.REDIS_HOST,
      port: Number(process.env.REDIS_PORT),
    },
  });

  await redisClient.connect();

  const redisStore = new RedisStore({
    client: redisClient,
    prefix: 'myapp:',
  });

  app.use(
    session({
      store: redisStore,
      secret: process.env.REDIS_SECRET_KEY,
      resave: false,
      saveUninitialized: false,
    }),
  );

  redisClient.on('ready', () => console.log('Redis client ready'));
  redisClient.on('error', (err) => console.log('Redis error: ', err));

  await app.listen(PORT, () => console.log(`Server started on port ${PORT}`));
}
start();
