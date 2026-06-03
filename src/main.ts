import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import cookieParser from 'cookie-parser';

async function startapp() {
  const app = await NestFactory.create(AppModule);
  app.enableCors({
    origin: 'http://localhost:3000',
    credentials: true,
  });
  app.use(cookieParser());
  const port = process.env.port ?? 8080
  await app.listen(port);
  console.log(`Listening on port: ${port}`)
}
startapp();
