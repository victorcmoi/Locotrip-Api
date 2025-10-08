import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Locotrip API')
    .setDescription('API REST complète pour la plateforme Locotrip')
    .setVersion('1.2.0')
    .addTag('Utilisateurs', 'Gestion des comptes utilisateurs')
    .addTag('Guides', 'Gestion des profils guides')
    .addTag('Expériences', 'Gestion des expériences touristiques')
    .addTag('Réservations', 'Gestion des réservations')
    .addTag('Messages', 'Communication entre utilisateurs')
    .addTag('Support', 'Service client et support')
    .addTag('Avis', 'Système d\'évaluations et commentaires')
    .addTag('Notifications', 'Gestion des notifications')
    .addTag('Paiements', 'Gestion des transactions financières')
    .addTag('Offres de Boost', 'Gestion des offres de boost pour les guides')
    .addTag('Catégories', 'Gestion des catégories d\'expériences')
    .addTag('Villes', 'Gestion des villes disponibles sur la plateforme')
    .addTag('Litiges', 'Gestion des litiges entre utilisateurs')
    .addTag('Abonnements', 'Gestion des abonnements premium')
    .addTag('Médias', 'Gestion des fichiers médias')
    .addTag('Devises', 'Gestion devises et taux de change')
    .addTag('Messagerie', 'Gestion des conversations entre utilisateurs')
    .addTag('Prix des expériences', 'Gestion des tarifs et promotions')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory(), {
    customSiteTitle: 'Locotrip API Documentation',
    customCss: `
      .swagger-ui .topbar { display: none }
    `,
    swaggerOptions: {
      persistAuthorization: true,
      docExpansion: 'none',
      filter: true,
      showRequestDuration: true,
      defaultModelsExpandDepth: -1,
    },
  });

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  
  await app.listen(process.env.PORT ?? 3000);
}
bootstrap();
