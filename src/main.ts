import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function startapp() {
  const app = await NestFactory.create(AppModule);
  const port = process.env.port ?? 8080
  await app.listen(port);
  console.log(`Listening on port: ${port}`)
}
startapp();
