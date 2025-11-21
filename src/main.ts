import 'dotenv/config';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { DocumentBuilder, SwaggerModule } from '@nestjs/swagger';
import { ValidationPipe } from '@nestjs/common';
import helmet from 'helmet';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Locotrip API')
    .setDescription('API REST complète pour la plateforme Locotrip')
    .setVersion('1.3.0')
    .addBearerAuth(
      {
        type: 'http',
        scheme: 'bearer',
        bearerFormat: 'JWT',
        name: 'JWT',
        description: 'Entrez votre token JWT',
        in: 'header',
      },
      'JWT-auth',
    )
    .addTag('Authentification', 'Authentification et gestion des sessions')
    
    .addTag('Utilisateurs', 'Gestion des comptes utilisateurs')
    .addTag('Guides', 'Gestion des profils guides')
    
    .addTag('Expériences', 'Gestion des expériences touristiques')
    .addTag('Catégories', 'Gestion des catégories d\'expériences')
    .addTag('Villes', 'Gestion des villes disponibles')
    
    .addTag('Réservations', 'Gestion des réservations')
    .addTag('Paiements', 'Gestion des transactions financières')
    .addTag('Prix des expériences', 'Gestion des tarifs et promotions')
    .addTag('Devises', 'Gestion des devises et taux de change')
    
    .addTag('Avis', 'Système d\'évaluations et commentaires')
    .addTag('Abonnements', 'Gestion des abonnements premium')
    .addTag('Offres de Boost', 'Gestion des offres de boost pour les guides')

    .addTag('Messagerie', 'Gestion des conversations entre utilisateurs')
    .addTag('Messages', 'Gestion des messages utilisateurs')
    .addTag('Notifications', 'Gestion des notifications')
    
    .addTag('Support', 'Service client et support')
    .addTag('Litiges', 'Gestion des disputes entre utilisateurs')
    .addTag('Médias', 'Gestion des fichiers médias')
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

  // Sécuriser les en-têtes HTTP
  app.use(helmet());

  app.useGlobalPipes(new ValidationPipe({
    whitelist: true,
    forbidNonWhitelisted: true,
    transform: true,
  }));

  // Configurer CORS
  app.enableCors({
    origin: '*',
    methods: 'GET,HEAD,PUT,PATCH,POST,DELETE',
    credentials: true,
  });

  // TO DO : add CRSF protection for form

  const prismaService = app.get(PrismaService);
  await prismaService.enableShutdownHooks(app);
  
  await app.listen(process.env.API_PORT ?? 3000);
}
bootstrap();
