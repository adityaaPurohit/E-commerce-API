import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  app.setGlobalPrefix('api');
  app.useGlobalPipes(new ValidationPipe()); // enable ValidationPipe`

  const port = process.env.PORT;
  
  await app.listen(port).then(() => {
    console.log(`App listening on ${port}`);
  });
}

bootstrap();
