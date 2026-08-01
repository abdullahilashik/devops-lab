import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ConsoleLogger, ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, {
    logger: new ConsoleLogger({
      colors: true,
      // logLevels: ['error', 'warn', 'fatal'],
      json: false,
      compact: true,
    }),
  });
  app.useGlobalPipes(new ValidationPipe({
    disableErrorMessages: true,  // enable or disable error messages
    whitelist: true, // remove the properties that are not in DTO
    transform: true, // automatically transform json to object

  })); // use new validation pipe
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
