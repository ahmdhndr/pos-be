/* istanbul ignore file */
import { AllExceptionsFilter } from '@core/filters';
import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { getEnv } from '@shared/utils';
import { Request, Response } from 'express';

import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  const configService = app.get(ConfigService);
  const env = getEnv(configService);

  // Global validation pipe with class-validator
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,
      forbidNonWhitelisted: true,
      transform: true,
      transformOptions: {
        enableImplicitConversion: true,
      },
    }),
  );

  app.setGlobalPrefix('api');

  // Swagger configuration
  const config = new DocumentBuilder()
    .setTitle('Multi-Tenant POS API')
    .setDescription('RESTful API for POS Systems')
    .setVersion('1.0')
    .setContact(
      'API Support',
      'https://github.com/ahmdhndr/pos-be',
      'ahmdhndrsyh@gmail.com',
    )
    .setLicense('MIT', 'https://github.com/ahmdhndr/pos-be/blob/main/LICENSE')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        description: 'Enter JWT token',
      },
      'bearer',
    )
    .addTag('POS')
    .build();

  const document = () => SwaggerModule.createDocument(app, config);

  // Setup Swagger UI
  SwaggerModule.setup('docs', app, document, {
    customSiteTitle: 'POS API Documentation',
    jsonDocumentUrl: 'docs/json',
  });

  // Export OpenAPI schema as JSON (for openapi-typescript)
  app.use('/docs-json', (_req: Request, res: Response) => {
    res.json(document);
  });

  app.useGlobalFilters(new AllExceptionsFilter());
  await app.listen(env.PORT);

  console.log(`
  ╔═════════════════════════════════════════════════════════════════╗
  ║   🚀 Multi-Tenant POS API Server Running                        ║
  ╠═════════════════════════════════════════════════════════════════╣
  ║   Environment:       ${env.NODE_ENV.padEnd(38)}     ║
  ║   Port:              ${String(env.PORT).padEnd(38)}     ║
  ║   API:               http://localhost:${env.PORT}/api/v1               ║
  ║   Swagger Docs:      http://localhost:${env.PORT}/docs                 ║
  ║   OpenAPI Schema:    http://localhost:${env.PORT}/docs-json            ║
  ╠═════════════════════════════════════════════════════════════════╣
  ║   Generate FE Types: pnpm api:generate                          ║
  ╚═════════════════════════════════════════════════════════════════╝
  `);
}
void bootstrap();
