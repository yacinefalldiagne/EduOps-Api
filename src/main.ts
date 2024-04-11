import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { CorsOptions } from '@nestjs/common/interfaces/external/cors-options.interface';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuration des options CORS
  const corsOptions: CorsOptions = {
    origin: true, // Autoriser tous les domaines
    methods: ['GET', 'POST', 'PUT', 'DELETE'], // Méthodes HTTP autorisées
    allowedHeaders: ['Content-Type', 'Authorization'], // Headers autorisés
  };

  // Activer CORS en utilisant les options configurées
  app.enableCors(corsOptions);

  await app.listen(3000);
}
bootstrap();
