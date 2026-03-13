import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import { MinioService } from '../src/minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { BucketName } from '../src/minio/enums/minio.enum';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

// Initialiser MinIO pour upload des images
const configService = new ConfigService();
const minioService = new MinioService(configService);

async function main() {
  console.log('🌱 Début du seeding...');

  console.log('🧹 Nettoyage et création des buckets MinIO...');
  try {
    const existingBuckets = await minioService.listBuckets();
    console.log(`Buckets existants: ${existingBuckets.join(', ') || 'aucun'}`);

    for (const bucket of existingBuckets) {
      await minioService.deleteBucket(bucket);
    }

    const buckets = Object.values(BucketName);
    for (const bucket of buckets) {
      await minioService.ensureBucketExists(bucket);
    }
    console.log(`✅ Buckets MinIO créés: ${buckets.join(', ')}`);
  } catch (error) {
    console.error('❌ Erreur lors de la création des buckets MinIO:', error.message);
    throw error;
  }

  // Créer des currencies
  console.log('💱 Création des currencies...');
  const euro = await prisma.currency.upsert({
    where: { code: 'EUR' },
    update: {},
    create: {
      code: 'EUR',
      name: 'Euro',
      exchange_rate: 1.0,
    },
  });

  const usd = await prisma.currency.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      name: 'Dollar américain',
      exchange_rate: 1.1,
    },
  });

  console.log(`✅ Devises créées: ${euro.code}, ${usd.code}`);

  // Créer des users
  console.log('👥 Création des users...');

  const admin = await prisma.user.create({
    data: {
      last_name: 'Admin',
      first_name: 'Admin',
      email: 'admin@admin.com',
      phone: '+33612345678',
      birth_date: new Date('1990-05-15'),
      password: '$2b$10$MW4ryE5jmOcqbKEn97xcHOPIUIK2TJiy.EjAf/338FY.ibPcsCQsi',
      role: 'admin',
      is_active: true,
      is_verified: true,
    },
  });

  const client1 = await prisma.user.create({
    data: {
      last_name: 'Dupont',
      first_name: 'Jean',
      email: 'jean.dupont@example.com',
      phone: '+33612345678',
      birth_date: new Date('1990-05-15'),
      password: '$2a$10$abcdefghijklmnopqrstuv', // Hash fictif
      role: 'client',
      is_active: true,
      is_verified: true,
    },
  });

  const client2 = await prisma.user.create({
    data: {
      last_name: 'Bernard',
      first_name: 'Marie',
      email: 'marie.bernard@example.com',
      phone: '+33612345679',
      birth_date: new Date('1992-08-20'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'client',
      is_active: true,
      is_verified: true,
    },
  });

  const client3 = await prisma.user.create({
    data: {
      last_name: 'Petit',
      first_name: 'Pierre',
      email: 'pierre.petit@example.com',
      phone: '+33612345680',
      birth_date: new Date('1985-12-10'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'client',
      is_active: true,
      is_verified: true,
    },
  });

  const client4 = await prisma.user.create({
    data: {
      last_name: 'Moreau',
      first_name: 'Julie',
      email: 'julie.moreau@example.com',
      phone: '+33612345681',
      birth_date: new Date('1995-04-15'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'client',
      is_active: true,
      is_verified: true,
    },
  });

  const client5 = await prisma.user.create({
    data: {
      last_name: 'Garcia',
      first_name: 'Lucas',
      email: 'lucas.garcia@example.com',
      phone: '+33612345682',
      birth_date: new Date('1988-07-22'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'client',
      is_active: true,
      is_verified: true,
    },
  });

  const client6 = await prisma.user.create({
    data: {
      last_name: 'Lefebvre',
      first_name: 'Camille',
      email: 'camille.lefebvre@example.com',
      phone: '+33612345683',
      birth_date: new Date('1993-02-14'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'client',
      is_active: true,
      is_verified: true,
    },
  });

  const client7 = await prisma.user.create({
    data: {
      last_name: 'Roux',
      first_name: 'Antoine',
      email: 'antoine.roux@example.com',
      phone: '+33612345684',
      birth_date: new Date('1991-11-30'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'client',
      is_active: true,
      is_verified: true,
    },
  });

  const client8 = await prisma.user.create({
    data: {
      last_name: 'Fournier',
      first_name: 'Léa',
      email: 'lea.fournier@example.com',
      phone: '+33612345685',
      birth_date: new Date('1997-09-08'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'client',
      is_active: true,
      is_verified: true,
    },
  });

  const client9 = await prisma.user.create({
    data: {
      last_name: 'Vincent',
      first_name: 'Hugo',
      email: 'hugo.vincent@example.com',
      phone: '+33612345686',
      birth_date: new Date('1986-03-25'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'client',
      is_active: true,
      is_verified: true,
    },
  });

  const client10 = await prisma.user.create({
    data: {
      last_name: 'Mercier',
      first_name: 'Chloé',
      email: 'chloe.mercier@example.com',
      phone: '+33612345687',
      birth_date: new Date('1994-06-12'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'client',
      is_active: true,
      is_verified: true,
    },
  });

  // Créer 5 utilisateurs guides
  const guideUser1 = await prisma.user.create({
    data: {
      last_name: 'Martin',
      first_name: 'Sophie',
      email: 'sophie.martin@example.com',
      phone: '+33687654321',
      birth_date: new Date('1988-03-20'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'guide',
      is_active: true,
      is_verified: true,
    },
  });

  const guideUser2 = await prisma.user.create({
    data: {
      last_name: 'Dubois',
      first_name: 'Thomas',
      email: 'thomas.dubois@example.com',
      phone: '+33687654322',
      birth_date: new Date('1985-07-12'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'guide',
      is_active: true,
      is_verified: true,
    },
  });

  const guideUser3 = await prisma.user.create({
    data: {
      last_name: 'Rousseau',
      first_name: 'Camille',
      email: 'camille.rousseau@example.com',
      phone: '+33687654323',
      birth_date: new Date('1990-11-05'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'guide',
      is_active: true,
      is_verified: true,
    },
  });

  const guideUser4 = await prisma.user.create({
    data: {
      last_name: 'Laurent',
      first_name: 'Alexandre',
      email: 'alexandre.laurent@example.com',
      phone: '+33687654324',
      birth_date: new Date('1987-02-28'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'guide',
      is_active: true,
      is_verified: true,
    },
  });

  const guideUser5 = await prisma.user.create({
    data: {
      last_name: 'Leroy',
      first_name: 'Emma',
      email: 'emma.leroy@example.com',
      phone: '+33687654325',
      birth_date: new Date('1993-09-18'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'guide',
      is_active: true,
      is_verified: true,
    },
  });

  const guideUser6 = await prisma.user.create({
    data: {
      last_name: 'Durand',
      first_name: 'Julien',
      email: 'julien.durand@example.com',
      phone: '+33687654326',
      birth_date: new Date('1989-04-10'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'guide',
      is_active: true,
      is_verified: true,
    },
  });

  const guideUser7 = await prisma.user.create({
    data: {
      last_name: 'Girard',
      first_name: 'Isabelle',
      email: 'isabelle.girard@example.com',
      phone: '+33687654327',
      birth_date: new Date('1991-06-25'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'guide',
      is_active: true,
      is_verified: true,
    },
  });

  const guideUser8 = await prisma.user.create({
    data: {
      last_name: 'Morel',
      first_name: 'François',
      email: 'francois.morel@example.com',
      phone: '+33687654328',
      birth_date: new Date('1984-12-03'),
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'guide',
      is_active: true,
      is_verified: true,
    },
  });

  console.log(
    `✅ Utilisateurs créés: ${client1.email}, ${guideUser1.email}, etc.`,
  );

  // Créer des adresses
  console.log('📍 Création des adresses...');
  await prisma.address.create({
    data: {
      user_id: client1.id,
      street: '123 Rue de la Paix',
      city: 'Paris',
      state: 'Île-de-France',
      postal_code: '75002',
      country: 'France',
      longitude: 2.3522,
      latitude: 48.8566,
    },
  });

  await prisma.address.create({
    data: {
      user_id: client2.id,
      street: '45 Avenue des Champs-Élysées',
      city: 'Paris',
      state: 'Île-de-France',
      postal_code: '75008',
      country: 'France',
      longitude: 2.3067,
      latitude: 48.8698,
    },
  });

  await prisma.address.create({
    data: {
      user_id: client5.id,
      street: '78 Rue de la République',
      city: 'Lyon',
      state: 'Auvergne-Rhône-Alpes',
      postal_code: '69002',
      country: 'France',
      longitude: 4.8357,
      latitude: 45.764,
    },
  });

  await prisma.address.create({
    data: {
      user_id: guideUser1.id,
      street: '12 Rue du Faubourg Saint-Honoré',
      city: 'Paris',
      state: 'Île-de-France',
      postal_code: '75008',
      country: 'France',
      longitude: 2.3173,
      latitude: 48.8708,
    },
  });

  await prisma.address.create({
    data: {
      user_id: guideUser2.id,
      street: '34 Quai Saint-Antoine',
      city: 'Lyon',
      state: 'Auvergne-Rhône-Alpes',
      postal_code: '69002',
      country: 'France',
      longitude: 4.8312,
      latitude: 45.7627,
    },
  });

  await prisma.address.create({
    data: {
      user_id: guideUser3.id,
      street: '89 Cours de l\'Intendance',
      city: 'Bordeaux',
      state: 'Nouvelle-Aquitaine',
      postal_code: '33000',
      country: 'France',
      longitude: -0.5792,
      latitude: 44.8378,
    },
  });

  console.log('✅ 6 adresses créées');

  // Créer 5 profils guides
  console.log('🎯 Création des profils guides...');
  const guide1 = await prisma.guide.create({
    data: {
      user_id: guideUser1.id,
      bio: "Guide passionnée avec 5 ans d'expérience. Spécialiste de l'art et de l'histoire parisienne. J'adore faire découvrir les secrets cachés de la capitale !",
      languages: 'Français, Anglais, Espagnol',
      years_of_experience: 5,
      guide_status: 'pro',
      pro_card: true,
      country: 'France',
    },
  });

  const guide2 = await prisma.guide.create({
    data: {
      user_id: guideUser2.id,
      bio: "Expert en gastronomie française avec 8 ans d'expérience. Je vous emmène dans les meilleurs restaurants et marchés de France.",
      languages: 'Français, Anglais, Italien',
      years_of_experience: 8,
      guide_status: 'pro',
      pro_card: true,
      country: 'France',
    },
  });

  const guide3 = await prisma.guide.create({
    data: {
      user_id: guideUser3.id,
      bio: "Passionnée d'architecture et d'urbanisme. 3 ans d'expérience à faire découvrir les trésors architecturaux de Lyon et Paris.",
      languages: 'Français, Anglais',
      years_of_experience: 3,
      guide_status: 'local',
      pro_card: false,
      country: 'France',
      card_request_date: new Date('2025-12-15T10:30:00Z'),
    },
  });

  const guide4 = await prisma.guide.create({
    data: {
      user_id: guideUser4.id,
      bio: "Guide aventurier spécialisé dans les expériences insolites. 10 ans d'expérience dans le tourisme alternatif.",
      languages: 'Français, Anglais, Allemand, Espagnol',
      years_of_experience: 10,
      guide_status: 'pro',
      pro_card: true,
      country: 'France',
    },
  });

  const guide5 = await prisma.guide.create({
    data: {
      user_id: guideUser5.id,
      bio: "Jeune guide dynamique spécialisée dans les visites pour les jeunes voyageurs. 2 ans d'expérience mais une passion infinie !",
      languages: 'Français, Anglais, Japonais',
      years_of_experience: 2,
      guide_status: 'local',
      pro_card: false,
      country: 'France',
      card_request_date: new Date('2026-01-05T14:00:00Z'),
    },
  });

  const guide6 = await prisma.guide.create({
    data: {
      user_id: guideUser6.id,
      bio: "Guide spécialisé dans l'histoire médiévale et les quartiers historiques de Paris. 6 ans d'expérience.",
      languages: 'Français, Anglais, Allemand',
      years_of_experience: 6,
      guide_status: 'pro',
      pro_card: true,
      country: 'France',
      response_time_hours: 2.5,
    },
  });

  const guide7 = await prisma.guide.create({
    data: {
      user_id: guideUser7.id,
      bio: "Passionnée de mode et de design parisien. 4 ans à guider dans les boutiques et ateliers emblématiques de Paris.",
      languages: 'Français, Anglais, Italien',
      years_of_experience: 4,
      guide_status: 'pro',
      pro_card: true,
      country: 'France',
      response_time_hours: 1.5,
    },
  });

  const guide8 = await prisma.guide.create({
    data: {
      user_id: guideUser8.id,
      bio: "Expert en œnologie et gastronomie parisienne. 12 ans d'expérience dans les meilleures tables de la capitale.",
      languages: 'Français, Anglais, Espagnol',
      years_of_experience: 12,
      guide_status: 'pro',
      pro_card: true,
      country: 'France',
      response_time_hours: 3.0,
    },
  });

  console.log('✅ 8 guides créés');

  // Créer des images de profil pour les guides
  console.log('📸 Upload des images de profil des guides vers MinIO...');

  const guides = [
    { guide: guide1, name: 'Sophie Martin', userId: guideUser1.id },
    { guide: guide2, name: 'Thomas Dubois', userId: guideUser2.id },
    { guide: guide3, name: 'Camille Rousseau', userId: guideUser3.id },
    { guide: guide4, name: 'Alexandre Laurent', userId: guideUser4.id },
    { guide: guide5, name: 'Emma Leroy', userId: guideUser5.id },
    { guide: guide6, name: 'Julien Durand', userId: guideUser6.id },
    { guide: guide7, name: 'Isabelle Girard', userId: guideUser7.id },
    { guide: guide8, name: 'François Morel', userId: guideUser8.id },
  ];

  // Upload des photos de profil (profile_picture)
  for (let i = 0; i < guides.length; i++) {
    const { guide, name } = guides[i];
    try {
      const imageFileName = `guide-home-${i + 1}.avif`;
      const imagePath = path.join(__dirname, 'assets', imageFileName);

      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const fileName = `profiles/guides/profile-picture/${guide.id}.avif`;

        const uploadResult = await minioService.uploadFile(
          BucketName.LOCOTRIP,
          fileName,
          imageBuffer,
          'image/avif',
          {
            guideId: guide.id,
            uploadedBy: 'seeder',
            mediaType: 'profile_picture',
          }
        );

        await prisma.media.create({
          data: {
            url: uploadResult.url,
            media_type: 'profile_picture',
            entity_type: 'guide',
            entity_id: guide.id,
            guide_id: guide.id,
            description: `Photo de profil de ${name}`,
          },
        });
        console.log(`✅ Photo de profil de ${name} uploadée (${imageFileName})`);
      }
    } catch (error) {
      console.error(`❌ Erreur upload photo de profil ${name}:`, error.message);
    }
  }

  console.log('✅ Images de profil des guides créées');

  // Upload des images de galerie (pictures) pour chaque guide
  console.log('📸 Upload des images de galerie des guides vers MinIO...');

  const baladeImages = [
    'Balade corniche 1.png',
    'Balade corniche 2.png',
    'Balade corniche 3.png',
    'Balade corniche 4.png',
    'Balade corniche 5.png',
    'Balade corniche 6.png',
    'Balade corniche 7.png',
    'Balade corniche 8.png',
    'Balade corniche 9.png',
    'Balade corniche 10.png',
    'Balade corniche 11.png',
    'Balade corniche 12.png',
  ];

  // Distribuer les images de galerie entre les guides (2-3 images par guide)
  let imageIndex = 0;
  for (const { guide, name } of guides) {
    const imagesCount = 2 + Math.floor(Math.random() * 2); // 2 ou 3 images par guide

    for (let i = 0; i < imagesCount && imageIndex < baladeImages.length; i++) {
      try {
        const imageName = baladeImages[imageIndex];
        const imagePath = path.join(__dirname, 'assets', imageName);

        if (fs.existsSync(imagePath)) {
          const imageBuffer = fs.readFileSync(imagePath);
          const fileName = `profiles/guides/pictures/${guide.id}/${imageName}`;

          const uploadResult = await minioService.uploadFile(
            BucketName.LOCOTRIP,
            fileName,
            imageBuffer,
            'image/png',
            {
              guideId: guide.id,
              uploadedBy: 'seeder',
              mediaType: 'pictures',
            }
          );

          await prisma.media.create({
            data: {
              url: uploadResult.url,
              media_type: 'pictures',
              entity_type: 'guide',
              entity_id: guide.id,
              experience_id: null,
              description: `Image de galerie ${i + 1} de ${name}`,
            },
          });
        }
        imageIndex++;
      } catch (error) {
        console.error(`❌ Erreur upload image galerie ${imageIndex + 1} pour ${name}:`, error.message);
        imageIndex++;
      }
    }
  }

  console.log('✅ Images de galerie des guides créées');

  // Créer des documents pour les guides
  console.log('📄 Création des documents de guides...');

  // Documents pour guide1 (pro - tous vérifiés)
  await prisma.guide_document.create({
    data: {
      guide_id: guide1.id,
      document_type: 'CV',
      verification_status: 'verified',
      verification_comment: 'CV complet et professionnel',
      verification_date: new Date('2024-06-15T10:00:00Z'),
    },
  });

  await prisma.guide_document.create({
    data: {
      guide_id: guide1.id,
      document_type: 'diploma',
      verification_status: 'verified',
      verification_comment: 'Diplôme de guide-conférencier validé',
      verification_date: new Date('2024-06-15T10:30:00Z'),
    },
  });

  // Documents pour guide2 (pro - tous vérifiés)
  await prisma.guide_document.create({
    data: {
      guide_id: guide2.id,
      document_type: 'CV',
      verification_status: 'verified',
      verification_comment: 'Expérience en gastronomie confirmée',
      verification_date: new Date('2024-05-20T14:00:00Z'),
    },
  });

  await prisma.guide_document.create({
    data: {
      guide_id: guide2.id,
      document_type: 'proof_of_residence',
      verification_status: 'verified',
      verification_comment: 'Justificatif de domicile valide',
      verification_date: new Date('2024-05-20T14:30:00Z'),
    },
  });

  // Documents pour guide3 (local avec demande de carte - en attente)
  await prisma.guide_document.create({
    data: {
      guide_id: guide3.id,
      document_type: 'CV',
      verification_status: 'pending',
      verification_comment: null,
    },
  });

  await prisma.guide_document.create({
    data: {
      guide_id: guide3.id,
      document_type: 'diploma',
      verification_status: 'pending',
      verification_comment: null,
    },
  });

  await prisma.guide_document.create({
    data: {
      guide_id: guide3.id,
      document_type: 'proof_of_residence',
      verification_status: 'verified',
      verification_comment: 'Justificatif accepté',
      verification_date: new Date('2025-12-20T11:00:00Z'),
    },
  });

  // Documents pour guide4 (pro)
  await prisma.guide_document.create({
    data: {
      guide_id: guide4.id,
      document_type: 'CV',
      verification_status: 'verified',
      verification_comment: '10 ans d\'expérience confirmée',
      verification_date: new Date('2024-03-10T09:00:00Z'),
    },
  });

  await prisma.guide_document.create({
    data: {
      guide_id: guide4.id,
      document_type: 'diploma',
      verification_status: 'verified',
      verification_comment: 'Formation tourisme validée',
      verification_date: new Date('2024-03-10T09:30:00Z'),
    },
  });

  // Documents pour guide5 (local avec demande de carte - mixte)
  await prisma.guide_document.create({
    data: {
      guide_id: guide5.id,
      document_type: 'CV',
      verification_status: 'pending',
      verification_comment: null,
    },
  });

  await prisma.guide_document.create({
    data: {
      guide_id: guide5.id,
      document_type: 'diploma',
      verification_status: 'rejected',
      verification_comment: 'Diplôme non reconnu - veuillez fournir une attestation officielle',
      verification_date: new Date('2026-01-10T16:00:00Z'),
    },
  });

  await prisma.guide_document.create({
    data: {
      guide_id: guide5.id,
      document_type: 'proof_of_residence',
      verification_status: 'pending',
      verification_comment: null,
    },
  });

  console.log('✅ Documents de guides créés');

  // Créer des cities depuis le fichier JSON
  console.log('🌍 Création des cities depuis cities.json...');

  const citiesJsonPath = path.join(__dirname, 'assets', 'cities.json');
  const citiesData = JSON.parse(fs.readFileSync(citiesJsonPath, 'utf-8'));

  console.log(`📊 ${citiesData.length} villes à créer...`);

  // Créer toutes les villes en batch pour la performance
  await prisma.city.createMany({
    data: citiesData.map((city: any) => ({
      name: city.name,
      country: city.country,
      slug: city.slug,
      description: city.description,
      latitude: city.latitude,
      longitude: city.longitude,
      is_active: city.is_active,
      is_suggested: city.is_suggested || false,
    })),
    skipDuplicates: true,
  });

  console.log(`✅ ${citiesData.length} villes créées avec succès`);

  // Récupérer les villes françaises spécifiques pour les utiliser dans les expériences
  const paris = await prisma.city.findUnique({ where: { slug: 'paris-france' } });
  const lyon = await prisma.city.findUnique({ where: { slug: 'lyon-france' } });
  const marseille = await prisma.city.findUnique({ where: { slug: 'marseille-france' } });
  const bordeaux = await prisma.city.findUnique({ where: { slug: 'bordeaux-france' } });
  const nice = await prisma.city.findUnique({ where: { slug: 'nice-france' } });
  const strasbourg = await prisma.city.findUnique({ where: { slug: 'strasbourg-france' } });

  if (!paris || !lyon || !marseille || !bordeaux || !nice || !strasbourg) {
    throw new Error('❌ Erreur: Les villes françaises n\'ont pas été trouvées dans la base de données');
  }

  console.log(`✅ Villes françaises récupérées pour les expériences: ${paris.name}, ${lyon.name}, ${marseille.name}, ${bordeaux.name}, ${nice.name}, ${strasbourg.name}`);

  // Récupérer les villes internationales
  const barcelona = await prisma.city.findUnique({ where: { slug: 'barcelona-espagne' } });
  const madrid = await prisma.city.findUnique({ where: { slug: 'madrid-espagne' } });
  const berlin = await prisma.city.findUnique({ where: { slug: 'berlin-allemagne' } });
  const munich = await prisma.city.findUnique({ where: { slug: 'munich-allemagne' } });
  const seville = await prisma.city.findUnique({ where: { slug: 'seville-espagne' } });

  if (!barcelona || !madrid || !berlin || !munich || !seville) {
    throw new Error('❌ Erreur: Les villes internationales n\'ont pas été trouvées dans la base de données');
  }

  console.log(`✅ Villes internationales récupérées: ${barcelona.name}, ${madrid.name}, ${berlin.name}, ${munich.name}, ${seville.name}`);

  // Upload des images des villes suggérées vers MinIO
  console.log('📸 Upload des images des villes suggérées vers MinIO...');

  const suggestedCitiesImages = [
    { slug: 'paris-france', fileName: 'paris.jpg', name: 'Paris' },
    { slug: 'barcelona-espagne', fileName: 'barcelone.jpg', name: 'Barcelona' },
    { slug: 'berlin-allemagne', fileName: 'berlin.jpg', name: 'Berlin' },
    { slug: 'madrid-espagne', fileName: 'madrid.jpg', name: 'Madrid' },
    { slug: 'lyon-france', fileName: 'lyon.jpg', name: 'Lyon' },
    { slug: 'munich-allemagne', fileName: 'munich.jpg', name: 'Munich' },
    { slug: 'nice-france', fileName: 'nice.jpg', name: 'Nice' },
    { slug: 'seville-espagne', fileName: 'seville.jpg', name: 'Seville' },
  ];

  for (const cityImage of suggestedCitiesImages) {
    try {
      const city = await prisma.city.findUnique({ where: { slug: cityImage.slug } });

      if (!city) {
        console.warn(`⚠️ Ville non trouvée: ${cityImage.slug}`);
        continue;
      }

      const imagePath = path.join(__dirname, 'assets', cityImage.fileName);

      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const fileName = `cities/${city.id}.jpg`;

        const uploadResult = await minioService.uploadFile(
          BucketName.LOCOTRIP,
          fileName,
          imageBuffer,
          'image/jpeg',
          {
            cityId: city.id,
            uploadedBy: 'seeder',
            mediaType: 'city_image',
          }
        );

        await prisma.media.create({
          data: {
            url: uploadResult.url,
            media_type: 'city_image',
            entity_type: 'city',
            entity_id: city.id,
            city_id: city.id,
            description: `Image de ${cityImage.name}`,
          },
        });
        console.log(`✅ Image de ${cityImage.name} uploadée (${cityImage.fileName})`);
      } else {
        console.warn(`⚠️ Fichier image non trouvé: ${cityImage.fileName}`);
      }
    } catch (error) {
      console.error(`❌ Erreur upload image ${cityImage.name}:`, error.message);
    }
  }

  console.log('✅ Images des villes suggérées uploadées');

  // Créer des catégories
  console.log('📂 Création des catégories...');
  const culture = await prisma.category.create({
    data: {
      name: 'Culture & Histoire',
    },
  });

  const gastronomie = await prisma.category.create({
    data: {
      name: 'Gastronomie',
    },
  });

  const aventure = await prisma.category.create({
    data: {
      name: 'Aventure',
    },
  });

  const nature = await prisma.category.create({
    data: {
      name: 'Nature & Plein air',
    },
  });

  const artisanat = await prisma.category.create({
    data: {
      name: 'Artisanat & Savoir-faire',
    },
  });

  const nightlife = await prisma.category.create({
    data: {
      name: 'Vie nocturne',
    },
  });

  const sport = await prisma.category.create({
    data: {
      name: 'Sport & Fitness',
    },
  });

  const art = await prisma.category.create({
    data: {
      name: 'Art & Créativité',
    },
  });

  const musique = await prisma.category.create({
    data: {
      name: 'Musique',
    },
  });

  const photographie = await prisma.category.create({
    data: {
      name: 'Photographie',
    },
  });

  const lecture = await prisma.category.create({
    data: {
      name: 'Lecture',
    },
  });

  const cinema = await prisma.category.create({
    data: {
      name: 'Cinéma & Théâtre',
    },
  });

  const mode = await prisma.category.create({
    data: {
      name: 'Mode & Style',
    },
  });

  const technologie = await prisma.category.create({
    data: {
      name: 'Technologie',
    },
  });

  const jardinage = await prisma.category.create({
    data: {
      name: 'Jardinage',
    },
  });

  const cuisine = await prisma.category.create({
    data: {
      name: 'Cuisine',
    },
  });

  const voyage = await prisma.category.create({
    data: {
      name: 'Voyage',
    },
  });

  const animaux = await prisma.category.create({
    data: {
      name: 'Animaux',
    },
  });

  const yoga = await prisma.category.create({
    data: {
      name: 'Yoga & Méditation',
    },
  });

  const danse = await prisma.category.create({
    data: {
      name: 'Danse',
    },
  });

  // Créer des hobbies pour les guides
  console.log('🎨 Association des hobbies aux guides...');

  // Guide 1 - Sophie Martin (Culture & Histoire)
  await prisma.guide_hobby.createMany({
    data: [
      { guide_id: guide1.id, category_id: culture.id },
      { guide_id: guide1.id, category_id: art.id },
      { guide_id: guide1.id, category_id: lecture.id },
      { guide_id: guide1.id, category_id: cinema.id },
      { guide_id: guide1.id, category_id: photographie.id },
      { guide_id: guide1.id, category_id: musique.id },
      { guide_id: guide1.id, category_id: voyage.id },
      { guide_id: guide1.id, category_id: gastronomie.id },
      { guide_id: guide1.id, category_id: mode.id },
      { guide_id: guide1.id, category_id: jardinage.id },
    ],
  });

  // Guide 2 - Thomas Dubois (Gastronomie)
  await prisma.guide_hobby.createMany({
    data: [
      { guide_id: guide2.id, category_id: gastronomie.id },
      { guide_id: guide2.id, category_id: cuisine.id },
      { guide_id: guide2.id, category_id: voyage.id },
      { guide_id: guide2.id, category_id: culture.id },
      { guide_id: guide2.id, category_id: nature.id },
      { guide_id: guide2.id, category_id: jardinage.id },
      { guide_id: guide2.id, category_id: artisanat.id },
      { guide_id: guide2.id, category_id: photographie.id },
      { guide_id: guide2.id, category_id: musique.id },
      { guide_id: guide2.id, category_id: lecture.id },
    ],
  });

  // Guide 3 - Camille Rousseau (Architecture)
  await prisma.guide_hobby.createMany({
    data: [
      { guide_id: guide3.id, category_id: art.id },
      { guide_id: guide3.id, category_id: culture.id },
      { guide_id: guide3.id, category_id: photographie.id },
      { guide_id: guide3.id, category_id: mode.id },
      { guide_id: guide3.id, category_id: cinema.id },
      { guide_id: guide3.id, category_id: voyage.id },
      { guide_id: guide3.id, category_id: lecture.id },
      { guide_id: guide3.id, category_id: technologie.id },
      { guide_id: guide3.id, category_id: danse.id },
      { guide_id: guide3.id, category_id: yoga.id },
    ],
  });

  // Guide 4 - Marc Leroy (Aventure)
  await prisma.guide_hobby.createMany({
    data: [
      { guide_id: guide4.id, category_id: aventure.id },
      { guide_id: guide4.id, category_id: nature.id },
      { guide_id: guide4.id, category_id: sport.id },
      { guide_id: guide4.id, category_id: voyage.id },
      { guide_id: guide4.id, category_id: photographie.id },
      { guide_id: guide4.id, category_id: animaux.id },
      { guide_id: guide4.id, category_id: musique.id },
      { guide_id: guide4.id, category_id: technologie.id },
      { guide_id: guide4.id, category_id: cuisine.id },
      { guide_id: guide4.id, category_id: yoga.id },
    ],
  });

  // Guide 5 - Laura Fontaine (Jeune & Dynamique)
  await prisma.guide_hobby.createMany({
    data: [
      { guide_id: guide5.id, category_id: nightlife.id },
      { guide_id: guide5.id, category_id: musique.id },
      { guide_id: guide5.id, category_id: danse.id },
      { guide_id: guide5.id, category_id: mode.id },
      { guide_id: guide5.id, category_id: art.id },
      { guide_id: guide5.id, category_id: cinema.id },
      { guide_id: guide5.id, category_id: photographie.id },
      { guide_id: guide5.id, category_id: voyage.id },
      { guide_id: guide5.id, category_id: sport.id },
      { guide_id: guide5.id, category_id: technologie.id },
    ],
  });

  // Guide 6 - Julien Durand (Histoire médiévale)
  await prisma.guide_hobby.createMany({
    data: [
      { guide_id: guide6.id, category_id: culture.id },
      { guide_id: guide6.id, category_id: lecture.id },
      { guide_id: guide6.id, category_id: art.id },
      { guide_id: guide6.id, category_id: cinema.id },
      { guide_id: guide6.id, category_id: voyage.id },
      { guide_id: guide6.id, category_id: photographie.id },
      { guide_id: guide6.id, category_id: musique.id },
      { guide_id: guide6.id, category_id: jardinage.id },
      { guide_id: guide6.id, category_id: gastronomie.id },
      { guide_id: guide6.id, category_id: artisanat.id },
    ],
  });

  // Guide 7 - Isabelle Girard (Mode & Design)
  await prisma.guide_hobby.createMany({
    data: [
      { guide_id: guide7.id, category_id: mode.id },
      { guide_id: guide7.id, category_id: art.id },
      { guide_id: guide7.id, category_id: artisanat.id },
      { guide_id: guide7.id, category_id: photographie.id },
      { guide_id: guide7.id, category_id: cinema.id },
      { guide_id: guide7.id, category_id: culture.id },
      { guide_id: guide7.id, category_id: voyage.id },
      { guide_id: guide7.id, category_id: musique.id },
      { guide_id: guide7.id, category_id: danse.id },
      { guide_id: guide7.id, category_id: lecture.id },
    ],
  });

  // Guide 8 - François Morel (Œnologie & Gastronomie)
  await prisma.guide_hobby.createMany({
    data: [
      { guide_id: guide8.id, category_id: gastronomie.id },
      { guide_id: guide8.id, category_id: cuisine.id },
      { guide_id: guide8.id, category_id: artisanat.id },
      { guide_id: guide8.id, category_id: culture.id },
      { guide_id: guide8.id, category_id: voyage.id },
      { guide_id: guide8.id, category_id: nature.id },
      { guide_id: guide8.id, category_id: lecture.id },
      { guide_id: guide8.id, category_id: musique.id },
      { guide_id: guide8.id, category_id: photographie.id },
      { guide_id: guide8.id, category_id: jardinage.id },
    ],
  });

  console.log('✅ Hobbies associés aux guides (10 par guide)');

  // Créer des expériences pour chaque guide
  console.log('🎨 Création des expériences...');
  const exp1 = await prisma.experience.create({
    data: {
      title: 'Visite guidée du Louvre',
      description:
        "Découvrez les chefs-d'œuvre du plus grand musée du monde avec Sophie",
      price: 49.99,
      duration: 180,
      city_id: paris.id,
      guide_id: guide1.id,
      max_capacity: 15,
      meeting_point: 'Devant la Pyramide du Louvre',
      meeting_latitude: 48.8606,
      meeting_longitude: 2.3376,
      is_active: true,
      is_published: true,
    },
  });

  const exp2 = await prisma.experience.create({
    data: {
      title: 'Tour gastronomique de Lyon',
      description:
        'Dégustez les spécialités lyonnaises avec Thomas, expert en gastronomie',
      price: 79.99,
      duration: 240,
      city_id: lyon.id,
      guide_id: guide2.id,
      max_capacity: 10,
      meeting_point: 'Place Bellecour',
      meeting_latitude: 45.7578,
      meeting_longitude: 4.832,
      is_active: true,
      is_published: true,
    },
  });

  const exp3 = await prisma.experience.create({
    data: {
      title: 'Balade architecturale à Paris',
      description: 'Découvrez les trésors architecturaux de Paris avec Camille',
      price: 35.0,
      duration: 120,
      city_id: paris.id,
      guide_id: guide3.id,
      max_capacity: 20,
      is_active: true,
      is_published: true,
    },
  });

  const exp4 = await prisma.experience.create({
    data: {
      title: 'Paris insolite - Les passages couverts',
      description: 'Explorez le Paris secret avec Alexandre, guide aventurier',
      price: 45.0,
      duration: 150,
      city_id: paris.id,
      guide_id: guide4.id,
      max_capacity: 12,
      meeting_point: 'Galerie Vivienne',
      meeting_latitude: 48.8686,
      meeting_longitude: 2.3396,
      is_active: true,
      is_published: true,
    },
  });

  const exp5 = await prisma.experience.create({
    data: {
      title: 'Paris pour les jeunes - Street Art Tour',
      description:
        'Découvrez le street art parisien avec Emma, guide dynamique',
      price: 29.99,
      duration: 120,
      city_id: paris.id,
      guide_id: guide5.id,
      max_capacity: 15,
      meeting_point: 'Belleville',
      meeting_latitude: 48.8717,
      meeting_longitude: 2.3824,
      is_active: true,
      is_published: true,
    },
  });

  const exp6 = await prisma.experience.create({
    data: {
      title: 'Montmartre et le Sacré-Cœur',
      description: 'Visite complète du quartier mythique avec Sophie',
      price: 39.99,
      duration: 180,
      city_id: paris.id,
      guide_id: guide1.id,
      max_capacity: 20,
      meeting_point: 'Place du Tertre',
      meeting_latitude: 48.8867,
      meeting_longitude: 2.3407,
      is_active: true,
      is_published: true,
    },
  });

  const exp7 = await prisma.experience.create({
    data: {
      title: 'Dégustation de vins français',
      description: 'Initiez-vous aux vins de France avec Thomas',
      price: 65.0,
      duration: 150,
      city_id: paris.id,
      guide_id: guide2.id,
      max_capacity: 8,
      is_active: true,
      is_published: true,
    },
  });

  console.log('✅ 7 expériences créées pour 5 guides');

  // Créer 15 expériences supplémentaires dans différentes villes
  console.log('🎨 Création de 15 expériences supplémentaires...');

  const exp8 = await prisma.experience.create({
    data: {
      title: 'Découverte des Calanques de Marseille',
      description: 'Randonnée guidée dans les calanques avec vues spectaculaires',
      price: 55.0,
      duration: 240,
      city_id: marseille.id,
      guide_id: guide1.id,
      max_capacity: 12,
      meeting_point: 'Port de Cassis',
      is_active: true,
      is_published: true,
    },
  });

  const exp9 = await prisma.experience.create({
    data: {
      title: 'Visite des vignobles bordelais',
      description: 'Découvrez les châteaux viticoles de Bordeaux et dégustez les meilleurs crus',
      price: 89.99,
      duration: 300,
      city_id: bordeaux.id,
      guide_id: guide2.id,
      max_capacity: 10,
      meeting_point: 'Place de la Bourse',
      is_active: true,
      is_published: true,
    },
  });

  const exp10 = await prisma.experience.create({
    data: {
      title: 'Promenade des Anglais à vélo',
      description: 'Balade à vélo le long de la magnifique Promenade des Anglais',
      price: 35.0,
      duration: 120,
      city_id: nice.id,
      guide_id: guide3.id,
      max_capacity: 15,
      meeting_point: 'Promenade des Anglais',
      is_active: true,
      is_published: true,
    },
  });

  const exp11 = await prisma.experience.create({
    data: {
      title: 'Architecture alsacienne à Strasbourg',
      description: 'Explorez la Petite France et la cathédrale avec un guide passionné',
      price: 42.0,
      duration: 150,
      city_id: strasbourg.id,
      guide_id: guide4.id,
      max_capacity: 18,
      meeting_point: 'Place de la Cathédrale',
      is_active: true,
      is_published: true,
    },
  });

  const exp12 = await prisma.experience.create({
    data: {
      title: 'Sagrada Familia et Gaudí',
      description: 'Visite guidée des chefs-d\'œuvre de Gaudí à Barcelone',
      price: 59.99,
      duration: 180,
      city_id: barcelona.id,
      guide_id: guide5.id,
      max_capacity: 20,
      meeting_point: 'Sagrada Familia',
      is_active: true,
      is_published: true,
    },
  });

  const exp13 = await prisma.experience.create({
    data: {
      title: 'Tapas Tour à Madrid',
      description: 'Découvrez les meilleurs bars à tapas de Madrid avec un local',
      price: 49.0,
      duration: 180,
      city_id: madrid.id,
      guide_id: guide1.id,
      max_capacity: 12,
      meeting_point: 'Puerta del Sol',
      is_active: true,
      is_published: true,
    },
  });

  const exp14 = await prisma.experience.create({
    data: {
      title: 'Histoire du Mur de Berlin',
      description: 'Parcourez les vestiges du Mur de Berlin et découvrez son histoire',
      price: 38.0,
      duration: 150,
      city_id: berlin.id,
      guide_id: guide2.id,
      max_capacity: 25,
      meeting_point: 'East Side Gallery',
      is_active: true,
      is_published: true,
    },
  });

  const exp15 = await prisma.experience.create({
    data: {
      title: 'Oktoberfest et brasseries munichoises',
      description: 'Plongez dans la culture de la bière bavaroise',
      price: 69.0,
      duration: 210,
      city_id: munich.id,
      guide_id: guide3.id,
      max_capacity: 15,
      meeting_point: 'Marienplatz',
      is_active: true,
      is_published: true,
    },
  });

  const exp16 = await prisma.experience.create({
    data: {
      title: 'Flamenco et culture andalouse',
      description: 'Découvrez l\'art du flamenco à Séville avec spectacle en direct',
      price: 75.0,
      duration: 180,
      city_id: seville.id,
      guide_id: guide4.id,
      max_capacity: 20,
      meeting_point: 'Plaza de España',
      is_active: true,
      is_published: true,
    },
  });

  const exp17 = await prisma.experience.create({
    data: {
      title: 'Cours de cuisine lyonnaise',
      description: 'Apprenez à cuisiner les spécialités lyonnaises avec un chef',
      price: 95.0,
      duration: 240,
      city_id: lyon.id,
      guide_id: guide5.id,
      max_capacity: 8,
      meeting_point: 'Les Halles de Lyon Paul Bocuse',
      is_active: true,
      is_published: true,
    },
  });

  const exp18 = await prisma.experience.create({
    data: {
      title: 'Paris la nuit - Tour nocturne',
      description: 'Découvrez Paris illuminée avec une croisière sur la Seine',
      price: 52.0,
      duration: 150,
      city_id: paris.id,
      guide_id: guide1.id,
      max_capacity: 30,
      meeting_point: 'Pont Neuf',
      is_active: true,
      is_published: true,
    },
  });

  const exp19 = await prisma.experience.create({
    data: {
      title: 'Marché provençal et senteurs de Nice',
      description: 'Visite du marché Cours Saleya et dégustation de produits locaux',
      price: 45.0,
      duration: 120,
      city_id: nice.id,
      guide_id: guide2.id,
      max_capacity: 12,
      meeting_point: 'Cours Saleya',
      is_active: true,
      is_published: true,
    },
  });

  const exp20 = await prisma.experience.create({
    data: {
      title: 'Atelier de photographie urbaine',
      description: 'Apprenez la photographie de rue dans les quartiers de Marseille',
      price: 48.0,
      duration: 180,
      city_id: marseille.id,
      guide_id: guide3.id,
      max_capacity: 10,
      meeting_point: 'Vieux-Port',
      is_active: true,
      is_published: true,
    },
  });

  const exp21 = await prisma.experience.create({
    data: {
      title: 'Vélo électrique à Barcelone',
      description: 'Parcourez Barcelone en vélo électrique, du Barri Gòtic à la plage',
      price: 44.0,
      duration: 150,
      city_id: barcelona.id,
      guide_id: guide4.id,
      max_capacity: 12,
      meeting_point: 'Gothic Quarter',
      is_active: true,
      is_published: true,
    },
  });

  const exp22 = await prisma.experience.create({
    data: {
      title: 'Musées et art contemporain à Berlin',
      description: 'Visite guidée des musées de l\'île aux musées',
      price: 46.0,
      duration: 180,
      city_id: berlin.id,
      guide_id: guide5.id,
      max_capacity: 18,
      meeting_point: 'Museum Island',
      is_active: true,
      is_published: true,
    },
  });

  // Nouvelles expériences à Paris
  const exp23 = await prisma.experience.create({
    data: {
      title: 'Quartier Latin et Sorbonne',
      description: 'Découvrez l\'histoire universitaire de Paris et flânez dans les ruelles du Quartier Latin',
      price: 38.0,
      duration: 120,
      city_id: paris.id,
      guide_id: guide6.id,
      max_capacity: 15,
      meeting_point: 'Fontaine Saint-Michel',
      meeting_latitude: 48.8534,
      meeting_longitude: 2.3437,
      is_active: true,
      is_published: true,
    },
  });

  const exp24 = await prisma.experience.create({
    data: {
      title: 'Shopping de luxe dans le Triangle d\'Or',
      description: 'Visite des boutiques prestigieuses et ateliers de mode parisiens avec Isabelle',
      price: 55.0,
      duration: 150,
      city_id: paris.id,
      guide_id: guide7.id,
      max_capacity: 8,
      meeting_point: 'Avenue Montaigne',
      meeting_latitude: 48.8662,
      meeting_longitude: 2.3044,
      is_active: true,
      is_published: true,
    },
  });

  const exp25 = await prisma.experience.create({
    data: {
      title: 'Dégustation de vins et fromages français',
      description: 'Initiation à l\'œnologie avec François, expert sommelier, dans une cave parisienne',
      price: 89.0,
      duration: 180,
      city_id: paris.id,
      guide_id: guide8.id,
      max_capacity: 10,
      meeting_point: 'Rue des Canettes',
      meeting_latitude: 48.8516,
      meeting_longitude: 2.3328,
      is_active: true,
      is_published: true,
    },
  });

  const exp26 = await prisma.experience.create({
    data: {
      title: 'Le Marais médiéval et ses secrets',
      description: 'Plongez dans le Paris médiéval avec Julien, spécialiste de l\'histoire ancienne',
      price: 42.0,
      duration: 135,
      city_id: paris.id,
      guide_id: guide6.id,
      max_capacity: 12,
      meeting_point: 'Place des Vosges',
      meeting_latitude: 48.8556,
      meeting_longitude: 2.3659,
      is_active: true,
      is_published: true,
    },
  });

  const exp27 = await prisma.experience.create({
    data: {
      title: 'Balade gastronomique à Saint-Germain',
      description: 'Découvrez les meilleures adresses gourmandes de Saint-Germain-des-Prés',
      price: 75.0,
      duration: 180,
      city_id: paris.id,
      guide_id: guide8.id,
      max_capacity: 10,
      meeting_point: 'Église Saint-Germain-des-Prés',
      meeting_latitude: 48.8541,
      meeting_longitude: 2.3336,
      is_active: true,
      is_published: true,
    },
  });

  const exp28 = await prisma.experience.create({
    data: {
      title: 'Musée d\'Orsay et impressionnisme',
      description: 'Visite guidée des chefs-d\'œuvre impressionnistes avec Sophie',
      price: 52.0,
      duration: 150,
      city_id: paris.id,
      guide_id: guide1.id,
      max_capacity: 15,
      meeting_point: 'Musée d\'Orsay',
      meeting_latitude: 48.8599,
      meeting_longitude: 2.3265,
      is_active: true,
      is_published: true,
    },
  });

  const exp29 = await prisma.experience.create({
    data: {
      title: 'Les coulisses de l\'Opéra Garnier',
      description: 'Visite exclusive de l\'Opéra Garnier et de ses secrets architecturaux',
      price: 48.0,
      duration: 120,
      city_id: paris.id,
      guide_id: guide3.id,
      max_capacity: 20,
      meeting_point: 'Place de l\'Opéra',
      meeting_latitude: 48.8711,
      meeting_longitude: 2.3314,
      is_active: true,
      is_published: true,
    },
  });

  const exp30 = await prisma.experience.create({
    data: {
      title: 'Canal Saint-Martin et République',
      description: 'Explorez les quartiers branchés du nord de Paris avec Emma',
      price: 32.0,
      duration: 120,
      city_id: paris.id,
      guide_id: guide5.id,
      max_capacity: 15,
      meeting_point: 'Écluse du Canal Saint-Martin',
      meeting_latitude: 48.8725,
      meeting_longitude: 2.3642,
      is_active: true,
      is_published: true,
    },
  });

  const exp31 = await prisma.experience.create({
    data: {
      title: 'Versailles et ses jardins',
      description: 'Journée complète au château de Versailles avec visite guidée et jardins',
      price: 95.0,
      duration: 360,
      city_id: paris.id,
      guide_id: guide6.id,
      max_capacity: 20,
      meeting_point: 'Gare RER Versailles',
      meeting_latitude: 48.8015,
      meeting_longitude: 2.1301,
      is_active: true,
      is_published: true,
    },
  });

  const exp32 = await prisma.experience.create({
    data: {
      title: 'Ateliers d\'artistes à Montparnasse',
      description: 'Découvrez les ateliers d\'artistes et l\'histoire bohème de Montparnasse',
      price: 40.0,
      duration: 135,
      city_id: paris.id,
      guide_id: guide1.id,
      max_capacity: 12,
      meeting_point: 'La Rotonde',
      meeting_latitude: 48.8420,
      meeting_longitude: 2.3289,
      is_active: true,
      is_published: true,
    },
  });

  const exp33 = await prisma.experience.create({
    data: {
      title: 'Mode et tendances au Marais',
      description: 'Tour des créateurs émergents et boutiques vintage avec Isabelle',
      price: 45.0,
      duration: 150,
      city_id: paris.id,
      guide_id: guide7.id,
      max_capacity: 10,
      meeting_point: 'Rue des Francs-Bourgeois',
      meeting_latitude: 48.8579,
      meeting_longitude: 2.3611,
      is_active: true,
      is_published: true,
    },
  });

  const exp34 = await prisma.experience.create({
    data: {
      title: 'Île de la Cité et Sainte-Chapelle',
      description: 'Découvrez le berceau de Paris et les vitraux de la Sainte-Chapelle',
      price: 46.0,
      duration: 120,
      city_id: paris.id,
      guide_id: guide6.id,
      max_capacity: 18,
      meeting_point: 'Parvis Notre-Dame',
      meeting_latitude: 48.8533,
      meeting_longitude: 2.3488,
      is_active: true,
      is_published: true,
    },
  });

  const exp35 = await prisma.experience.create({
    data: {
      title: 'Apéro parisien et terrasses secrètes',
      description: 'Soirée apéro dans les meilleurs rooftops et terrasses cachées de Paris',
      price: 68.0,
      duration: 180,
      city_id: paris.id,
      guide_id: guide5.id,
      max_capacity: 12,
      meeting_point: 'Place du Châtelet',
      meeting_latitude: 48.8583,
      meeting_longitude: 2.3472,
      is_active: true,
      is_published: true,
    },
  });

  const exp36 = await prisma.experience.create({
    data: {
      title: 'Boulangeries et pâtisseries parisiennes',
      description: 'Tournée des meilleures boulangeries avec dégustation de viennoiseries',
      price: 58.0,
      duration: 150,
      city_id: paris.id,
      guide_id: guide8.id,
      max_capacity: 10,
      meeting_point: 'Rue Montorgueil',
      meeting_latitude: 48.8644,
      meeting_longitude: 2.3469,
      is_active: true,
      is_published: true,
    },
  });

  const exp37 = await prisma.experience.create({
    data: {
      title: 'Paris romantique au coucher du soleil',
      description: 'Balade romantique dans les lieux les plus charmants de Paris au crépuscule',
      price: 44.0,
      duration: 120,
      city_id: paris.id,
      guide_id: guide1.id,
      max_capacity: 14,
      meeting_point: 'Pont des Arts',
      meeting_latitude: 48.8583,
      meeting_longitude: 2.3376,
      is_active: true,
      is_published: true,
    },
  });

  const allExperiences = [
    exp1, exp2, exp3, exp4, exp5, exp6, exp7, exp8, exp9, exp10,
    exp11, exp12, exp13, exp14, exp15, exp16, exp17, exp18, exp19, exp20,
    exp21, exp22, exp23, exp24, exp25, exp26, exp27, exp28, exp29, exp30,
    exp31, exp32, exp33, exp34, exp35, exp36, exp37,
  ];

  const experiencesWithPartialData = new Set([exp30.id, exp35.id]);
  const lessAccessibleExperiences = new Set([exp8.id, exp10.id, exp16.id, exp31.id]);

  const buildAdditionalInfo = (title: string) => {
    if (title.includes('Louvre')) {
      return 'Entrée coupe-file incluse. Prévoir des chaussures confortables et une pièce d\'identité.';
    }
    if (title.includes('gastronomique') || title.includes('Dégustation') || title.includes('Boulangeries')) {
      return 'Dégustations incluses. Merci de signaler vos allergies alimentaires 48h avant la visite.';
    }
    if (title.includes('vélo')) {
      return 'Casque fourni. Taille minimum requise: 145 cm. Parcours adapté à un niveau débutant.';
    }
    if (title.includes('nuit') || title.includes('Flamenco') || title.includes('Apéro')) {
      return 'Activité en soirée. Merci d\'arriver 10 minutes en avance pour le briefing de départ.';
    }

    return 'Prévoir des chaussures adaptées et une bouteille d\'eau. Activité maintenue sauf conditions extrêmes.';
  };

  console.log('🧩 Enrichissement des expériences (champs additionnels et accessibilité)...');
  for (const experience of allExperiences) {
    const shouldStayPartial = experiencesWithPartialData.has(experience.id);

    await prisma.experience.update({
      where: { id: experience.id },
      data: {
        additional_info: shouldStayPartial ? null : buildAdditionalInfo(experience.title),
        is_accessible: !lessAccessibleExperiences.has(experience.id),
      },
    });
  }

  console.log('🪜 Création des étapes des expériences...');
  const experiencesWithoutSteps = new Set([exp35.id]);
  await prisma.experience_step.createMany({
    data: allExperiences
      .filter((experience) => !experiencesWithoutSteps.has(experience.id))
      .flatMap((experience) => [
        {
          experience_id: experience.id,
          step_number: 1,
          title: 'Accueil et présentation',
          description: `Rencontre du groupe et rappel du déroulé pour "${experience.title}".`,
        },
        {
          experience_id: experience.id,
          step_number: 2,
          title: 'Parcours principal',
          description: 'Immersion guidée avec explications, anecdotes locales et temps d\'échange.',
        },
        {
          experience_id: experience.id,
          step_number: 3,
          title: 'Clôture de l\'expérience',
          description: 'Questions-réponses, recommandations personnalisées et conseils pour la suite du séjour.',
        },
      ]),
  });

  console.log('✅ Expériences enrichies avec champs crédibles et steps (sauf cas de test ciblés)');

  console.log('✅ 15 expériences supplémentaires créées (total: 37 expériences)');

  // Upload des images des expériences vers MinIO
  console.log('📸 Upload des images des expériences vers MinIO...');

  const experiencesWithImages = [
    { experience: exp1, images: ['exp1.png', 'exp2.png', 'exp3.png', 'exp4.png'] },
    { experience: exp2, images: ['exp5.png', 'exp6.png', 'exp7.png'] },
    { experience: exp3, images: ['exp8.png', 'exp9.png', 'exp10.png'] },
    { experience: exp4, images: ['exp11.png', 'exp12.png', 'exp13.png'] },
    { experience: exp5, images: ['exp14.png', 'exp1.png', 'exp2.png'] },
    { experience: exp6, images: ['exp3.png', 'exp4.png', 'exp5.png', 'exp6.png'] },
    { experience: exp7, images: ['exp7.png', 'exp8.png', 'exp9.png'] },
    { experience: exp8, images: ['exp10.png', 'exp11.png', 'exp12.png', 'exp13.png'] },
    { experience: exp9, images: ['exp14.png', 'exp1.png', 'exp2.png'] },
    { experience: exp10, images: ['exp3.png', 'exp4.png', 'exp5.png'] },
    { experience: exp11, images: ['exp6.png', 'exp7.png', 'exp8.png'] },
    { experience: exp12, images: ['exp9.png', 'exp10.png', 'exp11.png', 'exp12.png'] },
    { experience: exp13, images: ['exp13.png', 'exp14.png', 'exp1.png'] },
    { experience: exp14, images: ['exp2.png', 'exp3.png', 'exp4.png', 'exp5.png'] },
    { experience: exp15, images: ['exp6.png', 'exp7.png', 'exp8.png'] },
    { experience: exp16, images: ['exp9.png', 'exp10.png', 'exp11.png'] },
    { experience: exp17, images: ['exp12.png', 'exp13.png', 'exp14.png', 'exp1.png'] },
    { experience: exp18, images: ['exp2.png', 'exp3.png', 'exp4.png'] },
    { experience: exp19, images: ['exp5.png', 'exp6.png', 'exp7.png'] },
    { experience: exp20, images: ['exp8.png', 'exp9.png', 'exp10.png', 'exp11.png'] },
    { experience: exp21, images: ['exp12.png', 'exp13.png', 'exp14.png'] },
    { experience: exp22, images: ['exp1.png', 'exp2.png', 'exp3.png'] },
    { experience: exp23, images: ['exp4.png', 'exp5.png', 'exp6.png'] },
    { experience: exp24, images: ['exp7.png', 'exp8.png', 'exp9.png', 'exp10.png'] },
    { experience: exp25, images: ['exp11.png', 'exp12.png', 'exp13.png'] },
    { experience: exp26, images: ['exp14.png', 'exp1.png', 'exp2.png', 'exp3.png'] },
    { experience: exp27, images: ['exp4.png', 'exp5.png', 'exp6.png'] },
    { experience: exp28, images: ['exp7.png', 'exp8.png', 'exp9.png'] },
    { experience: exp29, images: ['exp10.png', 'exp11.png', 'exp12.png', 'exp13.png'] },
    { experience: exp30, images: ['exp14.png', 'exp1.png', 'exp2.png'] },
    { experience: exp31, images: ['exp3.png', 'exp4.png', 'exp5.png', 'exp6.png'] },
    { experience: exp32, images: ['exp7.png', 'exp8.png', 'exp9.png'] },
    { experience: exp33, images: ['exp10.png', 'exp11.png', 'exp12.png'] },
    { experience: exp34, images: ['exp13.png', 'exp14.png', 'exp1.png', 'exp2.png'] },
    { experience: exp35, images: ['exp3.png', 'exp4.png', 'exp5.png'] },
    { experience: exp36, images: ['exp6.png', 'exp7.png', 'exp8.png', 'exp9.png'] },
    { experience: exp37, images: ['exp10.png', 'exp11.png', 'exp12.png'] },
  ];

  for (const { experience, images } of experiencesWithImages) {
    for (let i = 0; i < images.length; i++) {
      try {
        const imageName = images[i];
        const imagePath = path.join(__dirname, 'assets', imageName);

        if (fs.existsSync(imagePath)) {
          const imageBuffer = fs.readFileSync(imagePath);
          const isProfilePicture = i === 0; // La première image est la photo principale
          const mediaType = isProfilePicture ? 'profile_picture' : 'pictures';
          const fileName = `experiences/${experience.id}/${mediaType}/${imageName}`;

          const uploadResult = await minioService.uploadFile(
            BucketName.LOCOTRIP,
            fileName,
            imageBuffer,
            'image/png',
            {
              experienceId: experience.id,
              uploadedBy: 'seeder',
              mediaType,
            }
          );

          await prisma.media.create({
            data: {
              url: uploadResult.url,
              media_type: mediaType,
              entity_type: 'experience',
              entity_id: experience.id,
              experience_id: experience.id,
              description: isProfilePicture
                ? `Image principale de ${experience.title}`
                : `Image ${i} de ${experience.title}`,
            },
          });

          console.log(
            `✅ Image ${isProfilePicture ? 'principale' : i} de "${experience.title}" uploadée (${imageName})`
          );
        }
      } catch (error) {
        console.error(
          `❌ Erreur upload image ${images[i]} pour "${experience.title}":`,
          error.message
        );
      }
    }
  }

  console.log('✅ Images des expériences créées');

  // Créer des disponibilités pour les expériences
  console.log('📅 Création des disponibilités d\'expériences...');

  // Disponibilités pour exp1 (Visite du Louvre)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp1.id,
        start_date: new Date('2026-02-10T09:00:00Z'),
        end_date: new Date('2026-02-10T12:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp1.id,
        start_date: new Date('2026-02-11T09:00:00Z'),
        end_date: new Date('2026-02-11T12:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp1.id,
        start_date: new Date('2026-02-15T14:00:00Z'),
        end_date: new Date('2026-02-15T17:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp2 (Atelier cuisine)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp2.id,
        start_date: new Date('2026-02-12T18:00:00Z'),
        end_date: new Date('2026-02-12T21:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp2.id,
        start_date: new Date('2026-02-14T18:00:00Z'),
        end_date: new Date('2026-02-14T21:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp3 (Balade architecture)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp3.id,
        start_date: new Date('2026-02-08T10:00:00Z'),
        end_date: new Date('2026-02-08T12:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp3.id,
        start_date: new Date('2026-02-09T10:00:00Z'),
        end_date: new Date('2026-02-09T12:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp3.id,
        start_date: new Date('2026-02-16T14:00:00Z'),
        end_date: new Date('2026-02-16T16:00:00Z'),
        status: 'unavailable',
      },
    ],
  });

  // Disponibilités pour exp4 (Randonnée)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp4.id,
        start_date: new Date('2026-02-20T08:00:00Z'),
        end_date: new Date('2026-02-20T13:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp4.id,
        start_date: new Date('2026-02-22T08:00:00Z'),
        end_date: new Date('2026-02-22T13:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp5 (Vie nocturne)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp5.id,
        start_date: new Date('2026-02-13T20:00:00Z'),
        end_date: new Date('2026-02-14T02:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp5.id,
        start_date: new Date('2026-02-14T20:00:00Z'),
        end_date: new Date('2026-02-15T02:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp6 (Visite vignobles)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp6.id,
        start_date: new Date('2026-02-18T10:00:00Z'),
        end_date: new Date('2026-02-18T14:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp6.id,
        start_date: new Date('2026-02-19T10:00:00Z'),
        end_date: new Date('2026-02-19T14:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp7 (Dégustation vins)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp7.id,
        start_date: new Date('2026-02-17T14:00:00Z'),
        end_date: new Date('2026-02-17T16:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp7.id,
        start_date: new Date('2026-02-21T14:00:00Z'),
        end_date: new Date('2026-02-21T16:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp7.id,
        start_date: new Date('2026-02-25T14:00:00Z'),
        end_date: new Date('2026-02-25T16:30:00Z'),
        status: 'blocked',
      },
    ],
  });

  // Disponibilités pour exp8 (Calanques Marseille)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp8.id,
        start_date: new Date('2026-04-05T08:00:00Z'),
        end_date: new Date('2026-04-05T12:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp8.id,
        start_date: new Date('2026-05-12T08:00:00Z'),
        end_date: new Date('2026-05-12T12:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp8.id,
        start_date: new Date('2026-06-20T08:00:00Z'),
        end_date: new Date('2026-06-20T12:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp9 (Vignobles Bordeaux)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp9.id,
        start_date: new Date('2026-03-15T10:00:00Z'),
        end_date: new Date('2026-03-15T15:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp9.id,
        start_date: new Date('2026-09-10T10:00:00Z'),
        end_date: new Date('2026-09-10T15:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp10 (Vélo Nice)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp10.id,
        start_date: new Date('2026-05-20T09:00:00Z'),
        end_date: new Date('2026-05-20T11:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp10.id,
        start_date: new Date('2026-07-08T09:00:00Z'),
        end_date: new Date('2026-07-08T11:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp10.id,
        start_date: new Date('2026-08-15T09:00:00Z'),
        end_date: new Date('2026-08-15T11:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp11 (Architecture Strasbourg)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp11.id,
        start_date: new Date('2026-04-18T10:00:00Z'),
        end_date: new Date('2026-04-18T12:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp11.id,
        start_date: new Date('2026-10-05T10:00:00Z'),
        end_date: new Date('2026-10-05T12:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp12 (Gaudí Barcelone)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp12.id,
        start_date: new Date('2026-03-22T11:00:00Z'),
        end_date: new Date('2026-03-22T14:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp12.id,
        start_date: new Date('2026-06-14T11:00:00Z'),
        end_date: new Date('2026-06-14T14:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp12.id,
        start_date: new Date('2026-09-25T11:00:00Z'),
        end_date: new Date('2026-09-25T14:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp13 (Tapas Madrid)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp13.id,
        start_date: new Date('2026-04-10T19:00:00Z'),
        end_date: new Date('2026-04-10T22:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp13.id,
        start_date: new Date('2026-07-18T19:00:00Z'),
        end_date: new Date('2026-07-18T22:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp14 (Mur de Berlin)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp14.id,
        start_date: new Date('2026-05-03T10:00:00Z'),
        end_date: new Date('2026-05-03T12:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp14.id,
        start_date: new Date('2026-08-20T10:00:00Z'),
        end_date: new Date('2026-08-20T12:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp14.id,
        start_date: new Date('2026-11-09T10:00:00Z'),
        end_date: new Date('2026-11-09T12:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp15 (Brasseries Munich)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp15.id,
        start_date: new Date('2026-06-25T17:00:00Z'),
        end_date: new Date('2026-06-25T20:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp15.id,
        start_date: new Date('2026-09-18T17:00:00Z'),
        end_date: new Date('2026-09-18T20:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp16 (Flamenco Séville)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp16.id,
        start_date: new Date('2026-04-25T20:00:00Z'),
        end_date: new Date('2026-04-25T23:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp16.id,
        start_date: new Date('2026-05-30T20:00:00Z'),
        end_date: new Date('2026-05-30T23:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp16.id,
        start_date: new Date('2026-10-15T20:00:00Z'),
        end_date: new Date('2026-10-15T23:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp17 (Cuisine Lyon)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp17.id,
        start_date: new Date('2026-03-28T14:00:00Z'),
        end_date: new Date('2026-03-28T18:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp17.id,
        start_date: new Date('2026-06-05T14:00:00Z'),
        end_date: new Date('2026-06-05T18:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp18 (Paris la nuit)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp18.id,
        start_date: new Date('2026-05-15T20:30:00Z'),
        end_date: new Date('2026-05-15T23:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp18.id,
        start_date: new Date('2026-07-22T20:30:00Z'),
        end_date: new Date('2026-07-22T23:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp18.id,
        start_date: new Date('2026-12-31T20:30:00Z'),
        end_date: new Date('2026-12-31T23:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp19 (Marché Nice)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp19.id,
        start_date: new Date('2026-04-12T08:00:00Z'),
        end_date: new Date('2026-04-12T10:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp19.id,
        start_date: new Date('2026-06-28T08:00:00Z'),
        end_date: new Date('2026-06-28T10:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp20 (Photographie Marseille)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp20.id,
        start_date: new Date('2026-05-08T09:00:00Z'),
        end_date: new Date('2026-05-08T12:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp20.id,
        start_date: new Date('2026-09-12T09:00:00Z'),
        end_date: new Date('2026-09-12T12:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp21 (Vélo électrique Barcelone)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp21.id,
        start_date: new Date('2026-04-20T10:00:00Z'),
        end_date: new Date('2026-04-20T12:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp21.id,
        start_date: new Date('2026-08-05T10:00:00Z'),
        end_date: new Date('2026-08-05T12:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp22 (Musées Berlin)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp22.id,
        start_date: new Date('2026-06-10T10:00:00Z'),
        end_date: new Date('2026-06-10T13:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp22.id,
        start_date: new Date('2026-10-22T10:00:00Z'),
        end_date: new Date('2026-10-22T13:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp22.id,
        start_date: new Date('2026-12-15T10:00:00Z'),
        end_date: new Date('2026-12-15T13:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp23 (Quartier Latin)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp23.id,
        start_date: new Date('2026-03-12T14:00:00Z'),
        end_date: new Date('2026-03-12T16:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp23.id,
        start_date: new Date('2026-03-15T10:00:00Z'),
        end_date: new Date('2026-03-15T12:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp23.id,
        start_date: new Date('2026-03-18T14:30:00Z'),
        end_date: new Date('2026-03-18T16:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp24 (Shopping Triangle d'Or)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp24.id,
        start_date: new Date('2026-03-11T10:00:00Z'),
        end_date: new Date('2026-03-11T12:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp24.id,
        start_date: new Date('2026-03-14T14:00:00Z'),
        end_date: new Date('2026-03-14T16:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp24.id,
        start_date: new Date('2026-03-17T11:00:00Z'),
        end_date: new Date('2026-03-17T13:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp25 (Dégustation vins et fromages)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp25.id,
        start_date: new Date('2026-03-13T18:00:00Z'),
        end_date: new Date('2026-03-13T21:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp25.id,
        start_date: new Date('2026-03-16T19:00:00Z'),
        end_date: new Date('2026-03-16T22:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp25.id,
        start_date: new Date('2026-03-20T18:30:00Z'),
        end_date: new Date('2026-03-20T21:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp26 (Marais médiéval)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp26.id,
        start_date: new Date('2026-03-12T09:30:00Z'),
        end_date: new Date('2026-03-12T11:45:00Z'),
        status: 'available',
      },
      {
        experience_id: exp26.id,
        start_date: new Date('2026-03-15T15:00:00Z'),
        end_date: new Date('2026-03-15T17:15:00Z'),
        status: 'available',
      },
      {
        experience_id: exp26.id,
        start_date: new Date('2026-03-19T10:00:00Z'),
        end_date: new Date('2026-03-19T12:15:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp27 (Balade gastronomique Saint-Germain)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp27.id,
        start_date: new Date('2026-03-11T11:00:00Z'),
        end_date: new Date('2026-03-11T14:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp27.id,
        start_date: new Date('2026-03-14T12:00:00Z'),
        end_date: new Date('2026-03-14T15:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp27.id,
        start_date: new Date('2026-03-18T11:30:00Z'),
        end_date: new Date('2026-03-18T14:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp28 (Musée d'Orsay)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp28.id,
        start_date: new Date('2026-03-13T09:00:00Z'),
        end_date: new Date('2026-03-13T11:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp28.id,
        start_date: new Date('2026-03-16T14:00:00Z'),
        end_date: new Date('2026-03-16T16:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp28.id,
        start_date: new Date('2026-03-20T10:00:00Z'),
        end_date: new Date('2026-03-20T12:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp29 (Opéra Garnier)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp29.id,
        start_date: new Date('2026-03-12T10:00:00Z'),
        end_date: new Date('2026-03-12T12:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp29.id,
        start_date: new Date('2026-03-15T14:00:00Z'),
        end_date: new Date('2026-03-15T16:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp29.id,
        start_date: new Date('2026-03-19T11:00:00Z'),
        end_date: new Date('2026-03-19T13:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp30 (Canal Saint-Martin)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp30.id,
        start_date: new Date('2026-03-11T15:00:00Z'),
        end_date: new Date('2026-03-11T17:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp30.id,
        start_date: new Date('2026-03-14T10:00:00Z'),
        end_date: new Date('2026-03-14T12:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp30.id,
        start_date: new Date('2026-03-17T15:30:00Z'),
        end_date: new Date('2026-03-17T17:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp31 (Versailles)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp31.id,
        start_date: new Date('2026-03-13T08:00:00Z'),
        end_date: new Date('2026-03-13T14:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp31.id,
        start_date: new Date('2026-03-16T08:00:00Z'),
        end_date: new Date('2026-03-16T14:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp31.id,
        start_date: new Date('2026-03-20T08:30:00Z'),
        end_date: new Date('2026-03-20T14:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp32 (Ateliers Montparnasse)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp32.id,
        start_date: new Date('2026-03-12T14:30:00Z'),
        end_date: new Date('2026-03-12T16:45:00Z'),
        status: 'available',
      },
      {
        experience_id: exp32.id,
        start_date: new Date('2026-03-15T10:30:00Z'),
        end_date: new Date('2026-03-15T12:45:00Z'),
        status: 'available',
      },
      {
        experience_id: exp32.id,
        start_date: new Date('2026-03-19T15:00:00Z'),
        end_date: new Date('2026-03-19T17:15:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp33 (Mode Marais)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp33.id,
        start_date: new Date('2026-03-11T13:00:00Z'),
        end_date: new Date('2026-03-11T15:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp33.id,
        start_date: new Date('2026-03-14T11:00:00Z'),
        end_date: new Date('2026-03-14T13:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp33.id,
        start_date: new Date('2026-03-18T14:00:00Z'),
        end_date: new Date('2026-03-18T16:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp34 (Île de la Cité)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp34.id,
        start_date: new Date('2026-03-13T09:30:00Z'),
        end_date: new Date('2026-03-13T11:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp34.id,
        start_date: new Date('2026-03-16T14:30:00Z'),
        end_date: new Date('2026-03-16T16:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp34.id,
        start_date: new Date('2026-03-20T10:30:00Z'),
        end_date: new Date('2026-03-20T12:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp35 (Apéro parisien)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp35.id,
        start_date: new Date('2026-03-12T18:00:00Z'),
        end_date: new Date('2026-03-12T21:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp35.id,
        start_date: new Date('2026-03-15T17:30:00Z'),
        end_date: new Date('2026-03-15T20:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp35.id,
        start_date: new Date('2026-03-19T18:30:00Z'),
        end_date: new Date('2026-03-19T21:30:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp36 (Boulangeries)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp36.id,
        start_date: new Date('2026-03-11T08:00:00Z'),
        end_date: new Date('2026-03-11T10:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp36.id,
        start_date: new Date('2026-03-14T08:30:00Z'),
        end_date: new Date('2026-03-14T11:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp36.id,
        start_date: new Date('2026-03-18T07:30:00Z'),
        end_date: new Date('2026-03-18T10:00:00Z'),
        status: 'available',
      },
    ],
  });

  // Disponibilités pour exp37 (Paris romantique)
  await prisma.experience_availability.createMany({
    data: [
      {
        experience_id: exp37.id,
        start_date: new Date('2026-03-13T17:00:00Z'),
        end_date: new Date('2026-03-13T19:00:00Z'),
        status: 'available',
      },
      {
        experience_id: exp37.id,
        start_date: new Date('2026-03-16T17:30:00Z'),
        end_date: new Date('2026-03-16T19:30:00Z'),
        status: 'available',
      },
      {
        experience_id: exp37.id,
        start_date: new Date('2026-03-20T17:00:00Z'),
        end_date: new Date('2026-03-20T19:00:00Z'),
        status: 'available',
      },
    ],
  });

  console.log('✅ Disponibilités d\'expériences créées');

  // Lier les expériences aux catégories
  await prisma.experience_category.create({
    data: {
      experience_id: exp1.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp2.id,
      category_id: gastronomie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp3.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp4.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp5.id,
      category_id: art.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp6.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp7.id,
      category_id: gastronomie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp8.id,
      category_id: nature.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp9.id,
      category_id: gastronomie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp10.id,
      category_id: sport.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp11.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp12.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp13.id,
      category_id: gastronomie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp14.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp15.id,
      category_id: gastronomie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp16.id,
      category_id: musique.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp17.id,
      category_id: gastronomie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp18.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp19.id,
      category_id: gastronomie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp20.id,
      category_id: photographie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp21.id,
      category_id: sport.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp22.id,
      category_id: art.id,
    },
  });

  // Catégories pour les nouvelles expériences à Paris
  await prisma.experience_category.create({
    data: {
      experience_id: exp23.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp24.id,
      category_id: mode.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp25.id,
      category_id: gastronomie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp26.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp27.id,
      category_id: gastronomie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp28.id,
      category_id: art.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp29.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp30.id,
      category_id: art.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp31.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp32.id,
      category_id: art.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp33.id,
      category_id: mode.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp34.id,
      category_id: culture.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp35.id,
      category_id: nightlife.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp36.id,
      category_id: gastronomie.id,
    },
  });

  await prisma.experience_category.create({
    data: {
      experience_id: exp37.id,
      category_id: culture.id,
    },
  });

  console.log('✅ Catégories associées aux expériences');

  console.log('💰 Ajout des price multi-currencies...');
  const experiencesWithoutPriceRows = new Set([exp35.id]);
  const experiencesWithOnlyEurPrice = new Set([exp30.id]);

  await prisma.experience_price.createMany({
    data: allExperiences
      .filter((experience) => !experiencesWithoutPriceRows.has(experience.id))
      .flatMap((experience) => {
        const basePrice = Number(experience.price);
        const usdPrice = Number((basePrice * Number(usd.exchange_rate)).toFixed(2));

        if (experiencesWithOnlyEurPrice.has(experience.id)) {
          return [
            {
              experience_id: experience.id,
              currency_code: 'EUR',
              price: basePrice,
            },
          ];
        }

        return [
          {
            experience_id: experience.id,
            currency_code: 'EUR',
            price: basePrice,
          },
          {
            experience_id: experience.id,
            currency_code: 'USD',
            price: usdPrice,
          },
        ];
      }),
    skipDuplicates: true,
  });

  // Créer une réservation
  console.log("📅 Création d'une réservation...");
  const booking1 = await prisma.booking.create({
    data: {
      user_id: client1.id,
      experience_id: exp1.id,
      booking_date: new Date('2025-11-15T10:00:00Z'),
      status: 'confirmed',
      number_of_participants: 2,
      total_price: 99.98,
    },
  });

  console.log(`✅ Réservation créée pour ${client1.first_name}`);

  // Créer un payment
  console.log("💳 Création d'un payment...");
  await prisma.payment.create({
    data: {
      booking_id: booking1.id,
      amount: 99.98,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'completed',
      stripe_payment_intent_id: 'pi_test_123456789',
      stripe_charge_id: 'ch_test_123456789',
      stripe_customer_id: 'cus_test_123456789',
      metadata: {
        booking_reference: 'BOOK-001',
        payment_method: 'visa',
      },
    },
  });

  // Créer plus de réservations
  console.log('📅 Création de réservations supplémentaires...');

  const booking2 = await prisma.booking.create({
    data: {
      user_id: client2.id,
      experience_id: exp2.id,
      booking_date: new Date('2025-12-01T14:00:00Z'),
      status: 'completed',
      number_of_participants: 4,
      total_price: 319.96,
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking2.id,
      amount: 319.96,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'completed',
      stripe_payment_intent_id: 'pi_test_223456789',
      stripe_charge_id: 'ch_test_223456789',
      stripe_customer_id: 'cus_test_223456789',
      metadata: { booking_reference: 'BOOK-002', payment_method: 'mastercard' },
    },
  });

  const booking3 = await prisma.booking.create({
    data: {
      user_id: client3.id,
      experience_id: exp4.id,
      booking_date: new Date('2025-12-10T11:00:00Z'),
      status: 'cancelled',
      number_of_participants: 2,
      total_price: 90.0,
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking3.id,
      amount: 90.0,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'refunded',
      stripe_payment_intent_id: 'pi_test_323456789',
      refunded_amount: 90.0,
      refunded_at: new Date('2025-12-08T15:00:00Z'),
      metadata: { booking_reference: 'BOOK-003', cancellation_reason: 'client_request' },
    },
  });

  const booking4 = await prisma.booking.create({
    data: {
      user_id: client5.id,
      experience_id: exp5.id,
      booking_date: new Date('2026-01-20T10:00:00Z'),
      status: 'confirmed',
      number_of_participants: 3,
      total_price: 89.97,
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking4.id,
      amount: 89.97,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'completed',
      stripe_payment_intent_id: 'pi_test_423456789',
      metadata: { booking_reference: 'BOOK-004', payment_method: 'visa' },
    },
  });

  const booking5 = await prisma.booking.create({
    data: {
      user_id: client6.id,
      experience_id: exp6.id,
      booking_date: new Date('2025-11-25T09:00:00Z'),
      status: 'completed',
      number_of_participants: 2,
      total_price: 79.98,
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking5.id,
      amount: 79.98,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'completed',
      stripe_payment_intent_id: 'pi_test_523456789',
      metadata: { booking_reference: 'BOOK-005', payment_method: 'visa' },
    },
  });

  const booking6 = await prisma.booking.create({
    data: {
      user_id: client7.id,
      experience_id: exp7.id,
      booking_date: new Date('2025-12-15T18:00:00Z'),
      status: 'completed',
      number_of_participants: 2,
      total_price: 130.0,
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking6.id,
      amount: 130.0,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'completed',
      stripe_payment_intent_id: 'pi_test_623456789',
      metadata: { booking_reference: 'BOOK-006', payment_method: 'amex' },
    },
  });

  const booking7 = await prisma.booking.create({
    data: {
      user_id: client8.id,
      experience_id: exp3.id,
      booking_date: new Date('2026-01-10T14:00:00Z'),
      status: 'pending',
      number_of_participants: 1,
      total_price: 35.0,
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking7.id,
      amount: 35.0,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'pending',
      stripe_payment_intent_id: 'pi_test_723456789',
      metadata: { booking_reference: 'BOOK-007' },
    },
  });

  const booking8 = await prisma.booking.create({
    data: {
      user_id: client9.id,
      experience_id: exp1.id,
      booking_date: new Date('2025-10-20T10:00:00Z'),
      status: 'completed',
      number_of_participants: 5,
      total_price: 249.95,
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking8.id,
      amount: 249.95,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'completed',
      stripe_payment_intent_id: 'pi_test_823456789',
      metadata: { booking_reference: 'BOOK-008', payment_method: 'visa' },
    },
  });

  const booking9 = await prisma.booking.create({
    data: {
      user_id: client10.id,
      experience_id: exp24.id,
      booking_date: new Date('2026-02-12T10:30:00Z'),
      status: 'completed',
      number_of_participants: 2,
      total_price: 110.0,
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking9.id,
      amount: 110.0,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'completed',
      stripe_payment_intent_id: 'pi_test_923456789',
      metadata: { booking_reference: 'BOOK-009', payment_method: 'visa' },
    },
  });

  const booking10 = await prisma.booking.create({
    data: {
      user_id: client4.id,
      experience_id: exp25.id,
      booking_date: new Date('2026-02-18T18:00:00Z'),
      status: 'confirmed',
      number_of_participants: 3,
      total_price: 267.0,
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking10.id,
      amount: 267.0,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'completed',
      stripe_payment_intent_id: 'pi_test_1023456789',
      metadata: { booking_reference: 'BOOK-010', payment_method: 'mastercard' },
    },
  });

  const booking11 = await prisma.booking.create({
    data: {
      user_id: client8.id,
      experience_id: exp37.id,
      booking_date: new Date('2026-03-06T17:45:00Z'),
      status: 'completed',
      number_of_participants: 2,
      total_price: 88.0,
    },
  });

  await prisma.payment.create({
    data: {
      booking_id: booking11.id,
      amount: 88.0,
      currency: 'eur',
      method: 'carte_bancaire',
      status: 'completed',
      stripe_payment_intent_id: 'pi_test_1123456789',
      metadata: { booking_reference: 'BOOK-011', payment_method: 'visa' },
    },
  });

  console.log('✅ 11 réservations créées avec leurs paiements');

  // Créer des disputes
  console.log('⚖️ Création des disputes...');

  await prisma.dispute.create({
    data: {
      booking_id: booking5.id,
      user_id: client6.id,
      reason: "Le guide est arrivé avec 30 minutes de retard et la visite a été écourtée. Je demande un remboursement partiel de 50% car nous n'avons pas pu voir tous les points prévus dans le programme.",
      status: 'open',
    },
  });

  await prisma.dispute.create({
    data: {
      booking_id: booking6.id,
      user_id: client7.id,
      reason: "La dégustation ne correspondait pas à la description. Il était mentionné 6 vins différents mais nous n'en avons goûté que 4. De plus, les fromages promis n'étaient pas inclus. Je souhaite un remboursement partiel.",
      status: 'pending',
    },
  });

  await prisma.dispute.create({
    data: {
      booking_id: booking8.id,
      user_id: client9.id,
      reason: "L'expérience a été annulée par le guide sans préavis. J'ai attendu 45 minutes au point de rendez-vous avant de recevoir un message d'annulation. Je demande un remboursement complet.",
      status: 'resolved',
      resolution_date: new Date('2025-10-25T16:30:00Z'),
      admin_id: admin.id,
    },
  });

  await prisma.dispute.create({
    data: {
      booking_id: booking2.id,
      user_id: client2.id,
      reason: "Je trouve que le prix était trop élevé pour la prestation fournie. Les restaurants étaient de qualité moyenne. Je demande un remboursement de 30%.",
      status: 'rejected',
      resolution_date: new Date('2025-12-05T11:00:00Z'),
      admin_id: admin.id,
    },
  });

  console.log('✅ 4 disputes créées');

  // Créer plusieurs reviews pour chaque expérience
  console.log('⭐ Création des avis...');

  // Reviews pour exp1 (Louvre - Sophie)
  await prisma.review.create({
    data: {
      user_id: client1.id,
      experience_id: exp1.id,
      rating: 5,
      title: 'Expérience exceptionnelle au Louvre !',
      comment:
        'Expérience exceptionnelle ! Sophie est très compétente et passionnée. Les 3h sont passées à une vitesse folle !',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client2.id,
      experience_id: exp1.id,
      rating: 5,
      title: 'Guide passionnée et captivante',
      comment:
        'Visite parfaite du Louvre. Sophie connaît chaque tableau par cœur et sait captiver son audience.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client3.id,
      experience_id: exp1.id,
      rating: 4,
      title: 'Très bonne visite, rythme un peu rapide',
      comment:
        "Très bonne visite, beaucoup d'informations intéressantes. Petit bémol sur le rythme un peu rapide.",
    },
  });

  // Reviews pour exp2 (Lyon - Thomas)
  await prisma.review.create({
    data: {
      user_id: client1.id,
      experience_id: exp2.id,
      rating: 5,
      title: 'Excellent guide gastronome',
      comment:
        "Thomas est un excellent guide gastronome ! Les bouchons qu'il nous a fait découvrir étaient délicieux.",
    },
  });

  await prisma.review.create({
    data: {
      user_id: client4.id,
      experience_id: exp2.id,
      rating: 5,
      title: 'Tour gastronomique incroyable !',
      comment:
        "Tour gastronomique incroyable ! J'ai découvert des saveurs que je ne connaissais pas. Thomas est passionné et ça se voit !",
    },
  });

  await prisma.review.create({
    data: {
      user_id: client2.id,
      experience_id: exp2.id,
      rating: 4,
      title: 'Excellente expérience, qualité au rendez-vous',
      comment:
        'Excellente expérience culinaire. Seul petit bémol : un peu cher mais la qualité est au rendez-vous.',
    },
  });

  // Reviews pour exp3 (Architecture - Camille)
  await prisma.review.create({
    data: {
      user_id: client3.id,
      experience_id: exp3.id,
      rating: 5,
      title: 'Paris sous un autre angle',
      comment:
        "Camille nous a fait voir Paris sous un autre angle. Passionnant pour les amateurs d'architecture !",
    },
  });

  await prisma.review.create({
    data: {
      user_id: client1.id,
      experience_id: exp3.id,
      rating: 4,
      title: 'Belle découverte architecturale',
      comment: 'Belle découverte des bâtiments parisiens. Très instructif.',
    },
  });

  // Reviews pour exp4 (Paris insolite - Alexandre)
  await prisma.review.create({
    data: {
      user_id: client2.id,
      experience_id: exp4.id,
      rating: 5,
      title: 'Paris secret à son meilleur',
      comment:
        'Alexandre nous a emmené dans des endroits que je ne connaissais pas du tout ! Paris secret à son meilleur.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client4.id,
      experience_id: exp4.id,
      rating: 5,
      title: 'Tour insolite incroyable',
      comment:
        'Tour insolite incroyable ! Les passages couverts sont magnifiques. Alexandre est un guide exceptionnel.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client3.id,
      experience_id: exp4.id,
      rating: 5,
      title: 'Meilleure visite de Paris !',
      comment:
        "Meilleure visite que j'ai faite à Paris ! Alexandre connaît tous les secrets de la ville.",
    },
  });

  // Reviews pour exp5 (Street Art - Emma)
  await prisma.review.create({
    data: {
      user_id: client4.id,
      experience_id: exp5.id,
      rating: 5,
      title: 'Guide dynamique, street art incroyable',
      comment:
        'Emma est super dynamique ! On a découvert des œuvres de street art incroyables à Belleville.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client1.id,
      experience_id: exp5.id,
      rating: 4,
      title: 'Tour sympa, guide compétente',
      comment:
        'Tour sympa pour découvrir le street art parisien. Emma connaît bien son sujet.',
    },
  });

  // Reviews pour exp6 (Montmartre - Sophie)
  await prisma.review.create({
    data: {
      user_id: client2.id,
      experience_id: exp6.id,
      rating: 5,
      title: 'Montmartre magique avec Sophie',
      comment:
        "Montmartre avec Sophie, c'est magique ! Elle connaît toutes les anecdotes du quartier.",
    },
  });

  await prisma.review.create({
    data: {
      user_id: client3.id,
      experience_id: exp6.id,
      rating: 5,
      title: 'Visite parfaite du Sacré-Cœur',
      comment:
        'Visite parfaite du Sacré-Cœur et de ses alentours. Sophie est une guide exceptionnelle.',
    },
  });

  // Reviews pour exp7 (Dégustation vins - Thomas)
  await prisma.review.create({
    data: {
      user_id: client4.id,
      experience_id: exp7.id,
      rating: 5,
      title: 'Un vrai sommelier passionné',
      comment:
        "Thomas est un vrai sommelier ! J'ai appris énormément sur les vins français.",
    },
  });

  await prisma.review.create({
    data: {
      user_id: client2.id,
      experience_id: exp7.id,
      rating: 4,
      title: 'Très bonne initiation aux vins',
      comment:
        'Très bonne initiation aux vins. Thomas sait transmettre sa passion.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client10.id,
      experience_id: exp24.id,
      rating: 5,
      title: 'Parfait pour découvrir les maisons de luxe',
      comment:
        'Isabelle connaît très bien les boutiques et partage de vrais conseils mode. Très belle expérience.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client6.id,
      experience_id: exp24.id,
      rating: 4,
      title: 'Circuit premium bien rythmé',
      comment:
        'Parcours fluide, bonnes adresses et ambiance agréable. Petit groupe appréciable.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client5.id,
      experience_id: exp25.id,
      rating: 5,
      title: 'Très belle initiation œnologique',
      comment:
        'Atelier très pédagogique, excellents accords vins/fromages et format convivial.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client8.id,
      experience_id: exp31.id,
      rating: 4,
      title: 'Versailles bien organisé',
      comment:
        'Très bon accompagnement sur la journée complète, timing respecté et explications claires.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client7.id,
      experience_id: exp37.id,
      rating: 5,
      title: 'Balade parisienne parfaite en amoureux',
      comment:
        'Très belle promenade au coucher du soleil. Le guide a choisi des spots magnifiques et a su garder un rythme doux et agréable.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client9.id,
      experience_id: exp37.id,
      rating: 4,
      title: 'Expérience romantique réussie',
      comment:
        'Le parcours est très bien pensé et les anecdotes sur Paris ajoutent une vraie valeur. Un peu plus de temps sur les quais aurait été parfait.',
    },
  });

  console.log('✅ 24 avis créés pour les différentes expériences');

  // Créer un subscription
  console.log("🎫 Création d'un subscription...");
  await prisma.subscription.create({
    data: {
      user_id: client1.id,
      subscription_type: 'loco_plus',
      start_date: new Date(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 an
      status: 'active',
    },
  });

  // Créer des conversations et des messages
  console.log("💬 Création des conversations et des messages...");

  // Booking 1 (client1, guideUser1) - Confirmé
  const conv1 = await prisma.conversation.create({ data: { booking_id: booking1.id } });
  await prisma.message.create({ data: { conversation_id: conv1.id, author_id: client1.id, content: "Bonjour, j'ai une question sur le point de rendez-vous." } });
  await prisma.message.create({ data: { conversation_id: conv1.id, author_id: guideUser1.id, content: 'Bonjour ! Le point de rendez-vous est devant la pyramide du Louvre.' } });

  // Booking 2 (client2, guideUser2) - Complété
  const conv2 = await prisma.conversation.create({ data: { booking_id: booking2.id } });
  await prisma.message.create({ data: { conversation_id: conv2.id, author_id: client2.id, content: "Bonjour Thomas, nous avons hâte de faire ce tour gastronomique !" } });
  await prisma.message.create({ data: { conversation_id: conv2.id, author_id: guideUser2.id, content: "Bonjour Marie, préparez votre appétit, ça va être délicieux. À demain !" } });
  await prisma.message.create({ data: { conversation_id: conv2.id, author_id: client2.id, content: "Merci beaucoup pour cette excellente visite, c'était parfait." } });

  // Booking 3 (client3, guideUser4) - Annulé
  const conv3 = await prisma.conversation.create({ data: { booking_id: booking3.id } });
  await prisma.message.create({ data: { conversation_id: conv3.id, author_id: client3.id, content: "Bonjour Alexandre, est-ce que la randonnée est maintenue malgré la pluie annoncée ?" } });
  await prisma.message.create({ data: { conversation_id: conv3.id, author_id: guideUser4.id, content: "Malheureusement, les conditions ne sont pas sûres. Je préfère annuler pour notre sécurité." } });

  // Booking 4 (client5, guideUser5) - Confirmé
  const conv4 = await prisma.conversation.create({ data: { booking_id: booking4.id } });
  await prisma.message.create({ data: { conversation_id: conv4.id, author_id: client5.id, content: "Salut Emma, est-ce qu'on marchera beaucoup pendant le tour de street art ?" } });
  await prisma.message.create({ data: { conversation_id: conv4.id, author_id: guideUser5.id, content: "Salut Lucas ! On marchera environ 2km. Prends des chaussures confortables !" } });

  // Booking 5 (client6, guideUser1) - Complété (avec dispute)
  const conv5 = await prisma.conversation.create({ data: { booking_id: booking5.id } });
  await prisma.message.create({ data: { conversation_id: conv5.id, author_id: client6.id, content: "Bonjour Sophie, vous êtes bien au point de RDV ? Je ne vous vois pas." } });
  await prisma.message.create({ data: { conversation_id: conv5.id, author_id: guideUser1.id, content: "Je suis désolée, j'ai eu un problème de transport. J'arrive dans 20 minutes." } });
  await prisma.message.create({ data: { conversation_id: conv5.id, author_id: client6.id, content: "Ça fait 30 minutes, c'est inacceptable. Je vais demander un remboursement." } });

  // Booking 6 (client7, guideUser2) - Complété
  const conv6 = await prisma.conversation.create({ data: { booking_id: booking6.id } });
  await prisma.message.create({ data: { conversation_id: conv6.id, author_id: client7.id, content: "Bonjour, est-ce qu'il y aura des options végétariennes pendant la dégustation ?" } });
  await prisma.message.create({ data: { conversation_id: conv6.id, author_id: guideUser2.id, content: "Absolument Antoine, j'ai prévu des fromages et des accompagnements adaptés." } });

  // Booking 7 (client8, guideUser3) - En attente
  const conv7 = await prisma.conversation.create({ data: { booking_id: booking7.id } });
  await prisma.message.create({ data: { conversation_id: conv7.id, author_id: client8.id, content: "Bonjour Camille, j'aimerais savoir si la balade inclut la visite interne des bâtiments." } });

  // Booking 8 (client9, guideUser1) - Complété
  const conv8 = await prisma.conversation.create({ data: { booking_id: booking8.id } });
  await prisma.message.create({ data: { conversation_id: conv8.id, author_id: client9.id, content: "Bonjour Sophie, nous serons 5 personnes. Pouvons-nous avoir un tarif de groupe ?" } });
  await prisma.message.create({ data: { conversation_id: conv8.id, author_id: guideUser1.id, content: "Bonjour Hugo, le tarif appliqué est déjà dégressif pour 5 personnes." } });

  // Créer des notifications
  console.log('🔔 Création de notifications...');
  await prisma.notification.create({
    data: {
      user_id: client1.id,
      type: 'booking_reminder',
      content: 'Votre visite du Louvre a lieu demain à 10h',
      read: false,
    },
  });

  // Créer un ticket de support
  console.log("🎫 Création des tickets de support...");
  const ticket1 = await prisma.support_ticket.create({
    data: {
      user_id: client1.id,
      subject: 'Question sur le remboursement',
      status: 'open',
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket1.id,
      author_id: client1.id,
      content:
        "Bonjour, j'aimerais savoir comment fonctionne la politique de remboursement.",
    },
  });

  // Ticket 2 - En cours de traitement
  const ticket2 = await prisma.support_ticket.create({
    data: {
      user_id: client5.id,
      subject: 'Problème de connexion à mon compte',
      status: 'in_progress',
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket2.id,
      author_id: client5.id,
      content: "Bonjour, je n'arrive plus à me connecter à mon compte depuis hier. J'ai essayé de réinitialiser mon mot de passe mais je ne reçois pas l'email.",
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket2.id,
      author_id: admin.id,
      content: "Bonjour, merci de nous avoir contacté. Pouvez-vous me confirmer l'adresse email associée à votre compte ? Je vais vérifier si les emails de réinitialisation sont bien envoyés.",
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket2.id,
      author_id: client5.id,
      content: "Mon adresse email est lucas.garcia@example.com. Merci de votre aide !",
    },
  });

  // Ticket 3 - Fermé, résolu
  const ticket3 = await prisma.support_ticket.create({
    data: {
      user_id: client7.id,
      subject: 'Modification de réservation',
      status: 'closed',
      closed_at: new Date('2025-12-18T14:30:00Z'),
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket3.id,
      author_id: client7.id,
      content: "Bonjour, est-il possible de changer la date de ma réservation pour la dégustation de vins ? Je souhaite passer du 15 décembre au 20 décembre.",
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket3.id,
      author_id: admin.id,
      content: "Bonjour, j'ai bien transmis votre demande au guide. La modification a été acceptée. Votre réservation est maintenant programmée pour le 20 décembre à 18h. Bonne dégustation !",
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket3.id,
      author_id: client7.id,
      content: "Parfait, merci beaucoup pour votre réactivité !",
    },
  });

  // Ticket 4 - Ouvert, réclamation
  const ticket4 = await prisma.support_ticket.create({
    data: {
      user_id: client9.id,
      subject: 'Réclamation suite à annulation',
      status: 'open',
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket4.id,
      author_id: client9.id,
      content: "Bonjour, ma visite guidée du Louvre a été annulée sans explication le jour même. J'étais au point de rendez-vous avec ma famille (5 personnes). C'est inacceptable ! Je demande un remboursement complet et un geste commercial.",
    },
  });

  // Ticket 5 - En cours, question technique
  const ticket5 = await prisma.support_ticket.create({
    data: {
      user_id: guideUser3.id,
      subject: 'Comment ajouter mes disponibilités ?',
      status: 'in_progress',
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket5.id,
      author_id: guideUser3.id,
      content: "Bonjour, je suis nouvelle sur la plateforme et je ne trouve pas comment définir mes disponibilités pour les prochaines semaines. Pouvez-vous m'aider ?",
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket5.id,
      author_id: admin.id,
      content: "Bonjour Camille ! Pour définir vos disponibilités, rendez-vous dans votre espace guide > Calendrier > Ajouter des créneaux. Vous pouvez définir des plages horaires récurrentes ou ponctuelles. N'hésitez pas si vous avez d'autres questions !",
    },
  });

  console.log('✅ 5 tickets de support créés avec leurs conversations');

  // Créer des offres de boost
  console.log("🚀 Création d'offres de boost...");
  const boostBasic = await prisma.boost_offer.create({
    data: {
      name: 'Boost Basic',
      description: 'Augmentez votre visibilité pendant 7 jours',
      duration_days: 7,
      discount_percentage: 0,
      price: 19.99,
    },
  });

  const boostPremium = await prisma.boost_offer.create({
    data: {
      name: 'Boost Premium',
      description: 'Apparaissez en premier pendant 30 jours',
      duration_days: 30,
      discount_percentage: 20,
      price: 79.99,
    },
  });

  console.log(
    `✅ Offres de boost créées: ${boostBasic.name}, ${boostPremium.name}`,
  );

  // Créer un boost actif pour le guide
  await prisma.guide_boost.create({
    data: {
      guide_id: guide1.id,
      boost_offer_id: boostPremium.id,
      expiration_date: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      status: 'active',
    },
  });

  console.log('\n🎉 Seeding terminé avec succès !');
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
