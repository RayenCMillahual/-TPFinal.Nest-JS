import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { SwaggerModule, DocumentBuilder } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);

  // Configuración de Swagger
  const config = new DocumentBuilder()
    .setTitle('API de Inventario') // Título de la API
    .setDescription('Documentación de la API para el sistema de inventario') // Descripción
    .setVersion('1.0') // Versión de la API
    .addBearerAuth() // Agrega autenticación Bearer (JWT)
    .build();
  const document = SwaggerModule.createDocument(app, config); // Crea el documento Swagger
  SwaggerModule.setup('api', app, document); // Monta Swagger en la ruta /api

  // Levantar el servidor
  const port = process.env.PORT ?? 3000; // Usa el puerto de las variables de entorno o 3000 por defecto
  await app.listen(port);
  console.log(`Servidor corriendo en: http://localhost:${port}`);
}

bootstrap();
