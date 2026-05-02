import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  app.enableCors();
  const port = process.env.PORT || 3000;
  await app.listen(port);
  console.log(`🚀 API HMS corriendo en: http://localhost:${port}`);
}

// Corregimos el error de ESLint manejando la promesa:
bootstrap().catch((err: unknown) => {
  console.error('❌ Error crítico al iniciar la aplicación:', err);
  process.exit(1);
});
