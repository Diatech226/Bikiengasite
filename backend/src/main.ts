import { ValidationPipe } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { NestFactory } from '@nestjs/core';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { json, urlencoded } from 'express';
import compression from 'compression';
import helmet from 'helmet';
import { AppModule } from './app.module';
import { HttpExceptionFilter } from './common/filters/http-exception.filter';

async function bootstrap() {
  const app = await NestFactory.create(AppModule, { bodyParser: false });
  const config = app.get(ConfigService);
  app.setGlobalPrefix('api/v1');
  app.use(json({ limit: '1mb' }));
  app.use(urlencoded({ extended: true, limit: '1mb' }));
  app.use(helmet());
  app.use(compression());
  app.useGlobalPipes(new ValidationPipe({ whitelist: true, forbidNonWhitelisted: true, transform: true, transformOptions: { enableImplicitConversion: false } }));
  app.useGlobalFilters(new HttpExceptionFilter());
  const origins = config.getOrThrow<string>('FRONTEND_URL').split(',').map((origin) => origin.trim());
  app.enableCors({ origin: origins, credentials: true, methods: ['GET', 'POST', 'PATCH', 'DELETE', 'OPTIONS'] });
  const document = SwaggerModule.createDocument(app, new DocumentBuilder().setTitle('Bikienga API').setDescription('API persistante du site Bikienga — les dons sont indépendants de toute autre fonctionnalité').setVersion('1.0').addBearerAuth().build());
  SwaggerModule.setup('api/docs', app, document);
  app.getHttpAdapter().getInstance().set('trust proxy', 1);
  await app.listen(config.get<number>('PORT', 5000), '0.0.0.0');
}
void bootstrap();
