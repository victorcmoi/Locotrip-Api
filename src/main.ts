import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { PrismaService } from './prisma.service';
import { DocumentBuilder, SwaggerModule, } from '@nestjs/swagger';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  const config = new DocumentBuilder()
    .setTitle('Loctrip API')
    .setDescription('API destinée à la plateforme web Locotrip. Basée sur NestJS et Prisma.')
    .setVersion('1.0')
    .addTag('Locotrip')
    .build();

  const documentFactory = () => SwaggerModule.createDocument(app, config);
  SwaggerModule.setup('api', app, documentFactory());

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
