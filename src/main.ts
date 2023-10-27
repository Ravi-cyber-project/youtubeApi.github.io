import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { ENV } from 'config/environment';
import { ValidationPipe } from '@nestjs/common';
const express = require('express');

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.use('/uploads', express.static('uploads'));
  app.useGlobalPipes(new ValidationPipe());
  await app.listen(ENV.PORT);
}
bootstrap();
