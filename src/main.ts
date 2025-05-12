import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { join } from 'path';
import * as express from 'express';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // ✅ Enable CORS
  app.enableCors({
    origin: process.env.FRONTEND_URL || 'http://localhost:3001',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    allowedHeaders: 'Content-Type, Authorization',
  });

  // ✅ Serve static files correctly
  app.use('/uploads', express.static(join(__dirname, '..', 'uploads')));

  await app.listen(3000);
  console.log(`🚀 Server running at http://localhost:3000`);
  console.log(`📂 Serving uploads from: http://localhost:3000/uploads/`);
}
bootstrap();
