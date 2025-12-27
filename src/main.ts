import { NestExpressApplication } from '@nestjs/platform-express';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Logger, ValidationPipe } from '@nestjs/common';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';
import { HttpExceptionFilter } from 'src/shared/filters/http-exception.filter';
import { LoggingInterceptor } from 'src/shared/interceptors/logging.interceptor';

async function bootstrap() {
  const app = await NestFactory.create<NestExpressApplication>(AppModule, { logger: ['log','error'] });

  const config = new DocumentBuilder()
    .setTitle('Football Manager')
    .setDescription('The football manager API description')
    .setVersion('1.0')
    .addTag('football_manager')
    .addBearerAuth(
      {
        description: `Please enter token in following format: JWT`,
        name: 'Authorization',
        bearerFormat: 'Bearer',
        type: 'http',
        in: 'Header',
      },
      'jwt',
    )
    .build();
  const document = SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, document);
  app.enableCors();
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      transform: true,
      transformOptions: { enableImplicitConversion: true },
      forbidNonWhitelisted: true,
    }),
  );
  app.useGlobalInterceptors(new LoggingInterceptor());
  app.useGlobalFilters(new HttpExceptionFilter());

  const port = process.env.DOCKER_PORT || process.env.PORT;
  await app.listen(port, '0.0.0.0');

  Logger.log(`App is running on port ${port}`);
}

bootstrap();
