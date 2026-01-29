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

  console.log('✅ 5 guides créés');

  // Créer des images de profil pour les guides
  console.log('📸 Upload des images de profil des guides vers MinIO...');

  const guides = [
    { guide: guide1, name: 'Sophie Martin', userId: guideUser1.id },
    { guide: guide2, name: 'Thomas Dubois', userId: guideUser2.id },
    { guide: guide3, name: 'Camille Rousseau', userId: guideUser3.id },
    { guide: guide4, name: 'Alexandre Laurent', userId: guideUser4.id },
    { guide: guide5, name: 'Emma Leroy', userId: guideUser5.id },
  ];

  // Upload des photos de profil (profile_picture)
  for (let i = 0; i < guides.length; i++) {
    const { guide, name } = guides[i];
    try {
      const imageFileName = `guide-home-${i + 1}.avif`;
      const imagePath = path.join(__dirname, 'assets', imageFileName);

      if (fs.existsSync(imagePath)) {
        const imageBuffer = fs.readFileSync(imagePath);
        const fileName = `profiles/guides/profile-picture/${guide.id}-${name.toLowerCase().replace(/ /g, '-')}.avif`;

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
          console.log(`✅ Image de galerie ${imageIndex + 1} pour ${name} uploadée`);
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

  // Créer des disponibilités de guides
  console.log('📅 Création des disponibilités de guides...');

  // Disponibilités pour guide1 (Sophie) - prochaines semaines
  await prisma.guide_availability.create({
    data: {
      guide_id: guide1.id,
      start_date: new Date('2026-01-20T09:00:00Z'),
      end_date: new Date('2026-01-20T18:00:00Z'),
      status: 'available',
    },
  });

  await prisma.guide_availability.create({
    data: {
      guide_id: guide1.id,
      start_date: new Date('2026-01-21T09:00:00Z'),
      end_date: new Date('2026-01-21T18:00:00Z'),
      status: 'available',
    },
  });

  await prisma.guide_availability.create({
    data: {
      guide_id: guide1.id,
      start_date: new Date('2026-01-22T09:00:00Z'),
      end_date: new Date('2026-01-22T12:00:00Z'),
      status: 'unavailable',
    },
  });

  // Disponibilités pour guide2 (Thomas)
  await prisma.guide_availability.create({
    data: {
      guide_id: guide2.id,
      start_date: new Date('2026-01-18T14:00:00Z'),
      end_date: new Date('2026-01-18T22:00:00Z'),
      status: 'available',
    },
  });

  await prisma.guide_availability.create({
    data: {
      guide_id: guide2.id,
      start_date: new Date('2026-01-25T10:00:00Z'),
      end_date: new Date('2026-01-25T20:00:00Z'),
      status: 'available',
    },
  });

  // Disponibilités pour guide3 (Camille) - bloqué certains jours
  await prisma.guide_availability.create({
    data: {
      guide_id: guide3.id,
      start_date: new Date('2026-01-19T09:00:00Z'),
      end_date: new Date('2026-01-19T17:00:00Z'),
      status: 'available',
    },
  });

  await prisma.guide_availability.create({
    data: {
      guide_id: guide3.id,
      start_date: new Date('2026-01-26T00:00:00Z'),
      end_date: new Date('2026-02-02T00:00:00Z'),
      status: 'blocked',
    },
  });

  // Disponibilités pour guide4 (Alexandre)
  await prisma.guide_availability.create({
    data: {
      guide_id: guide4.id,
      start_date: new Date('2026-01-20T10:00:00Z'),
      end_date: new Date('2026-01-20T19:00:00Z'),
      status: 'available',
    },
  });

  await prisma.guide_availability.create({
    data: {
      guide_id: guide4.id,
      start_date: new Date('2026-01-27T10:00:00Z'),
      end_date: new Date('2026-01-27T19:00:00Z'),
      status: 'available',
    },
  });

  // Disponibilités pour guide5 (Emma)
  await prisma.guide_availability.create({
    data: {
      guide_id: guide5.id,
      start_date: new Date('2026-01-18T14:00:00Z'),
      end_date: new Date('2026-01-18T18:00:00Z'),
      status: 'available',
    },
  });

  await prisma.guide_availability.create({
    data: {
      guide_id: guide5.id,
      start_date: new Date('2026-01-19T14:00:00Z'),
      end_date: new Date('2026-01-19T18:00:00Z'),
      status: 'available',
    },
  });

  console.log('✅ Disponibilités de guides créées');

  // Créer des cities
  console.log('🌍 Création des cities...');
  const paris = await prisma.city.create({
    data: {
      name: 'Paris',
      country: 'France',
      slug: 'paris-france',
      description: 'La ville lumière, capitale de la France',
      latitude: 48.8566,
      longitude: 2.3522,
      image_url: 'https://example.com/images/paris.jpg',
      is_active: true,
    },
  });

  const lyon = await prisma.city.create({
    data: {
      name: 'Lyon',
      country: 'France',
      slug: 'lyon-france',
      description: 'Capitale de la gastronomie française',
      latitude: 45.764,
      longitude: 4.8357,
      image_url: 'https://example.com/images/lyon.jpg',
      is_active: true,
    },
  });

  const marseille = await prisma.city.create({
    data: {
      name: 'Marseille',
      country: 'France',
      slug: 'marseille-france',
      description: 'Cité phocéenne, porte de la Méditerranée',
      latitude: 43.2965,
      longitude: 5.3698,
      image_url: 'https://example.com/images/marseille.jpg',
      is_active: true,
    },
  });

  const bordeaux = await prisma.city.create({
    data: {
      name: 'Bordeaux',
      country: 'France',
      slug: 'bordeaux-france',
      description: 'Capitale mondiale du vin',
      latitude: 44.8378,
      longitude: -0.5792,
      image_url: 'https://example.com/images/bordeaux.jpg',
      is_active: true,
    },
  });

  const nice = await prisma.city.create({
    data: {
      name: 'Nice',
      country: 'France',
      slug: 'nice-france',
      description: 'Perle de la Côte d\'Azur',
      latitude: 43.7102,
      longitude: 7.262,
      image_url: 'https://example.com/images/nice.jpg',
      is_active: true,
    },
  });

  const strasbourg = await prisma.city.create({
    data: {
      name: 'Strasbourg',
      country: 'France',
      slug: 'strasbourg-france',
      description: 'Capitale européenne, au cœur de l\'Alsace',
      latitude: 48.5734,
      longitude: 7.7521,
      image_url: 'https://example.com/images/strasbourg.jpg',
      is_active: true,
    },
  });

  console.log(`✅ Villes créées: ${paris.name}, ${lyon.name}, ${marseille.name}, ${bordeaux.name}, ${nice.name}, ${strasbourg.name}`);

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

  // Ajouter des price en différentes currencies
  console.log('💰 Ajout des price multi-currencies...');
  await prisma.experience_price.create({
    data: {
      experience_id: exp1.id,
      currency_code: 'EUR',
      price: 49.99,
    },
  });

  await prisma.experience_price.create({
    data: {
      experience_id: exp1.id,
      currency_code: 'USD',
      price: 54.99,
    },
  });

  await prisma.experience_price.create({
    data: {
      experience_id: exp2.id,
      currency_code: 'EUR',
      price: 79.99,
    },
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

  console.log('✅ 8 réservations créées avec leurs paiements');

  // Créer des disputes
  console.log('⚖️ Création des disputes...');

  // Dispute 1 - Ouverte, client mécontent du guide
  await prisma.dispute.create({
    data: {
      booking_id: booking5.id,
      user_id: client6.id,
      reason: "Le guide est arrivé avec 30 minutes de retard et la visite a été écourtée. Je demande un remboursement partiel de 50% car nous n'avons pas pu voir tous les points prévus dans le programme.",
      status: 'open',
    },
  });

  // Dispute 2 - En attente, problème de description de l'expérience
  await prisma.dispute.create({
    data: {
      booking_id: booking6.id,
      user_id: client7.id,
      reason: "La dégustation ne correspondait pas à la description. Il était mentionné 6 vins différents mais nous n'en avons goûté que 4. De plus, les fromages promis n'étaient pas inclus. Je souhaite un remboursement partiel.",
      status: 'pending',
    },
  });

  // Dispute 3 - Résolue en faveur du client
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

  // Dispute 4 - Rejetée, réclamation non fondée
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

  console.log('✅ 18 avis créés pour les différentes expériences');

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

  // Créer une conversation
  console.log("💬 Création d'une conversation...");
  const conversation = await prisma.conversation.create({
    data: {
      booking_id: booking1.id,
    },
  });

  // Créer des messages
  await prisma.message.create({
    data: {
      conversation_id: conversation.id,
      author_id: client1.id,
      content: "Bonjour, j'ai une question sur le point de rendez-vous.",
    },
  });

  await prisma.message.create({
    data: {
      conversation_id: conversation.id,
      author_id: guideUser1.id,
      content:
        'Bonjour ! Le point de rendez-vous est devant la pyramide du Louvre.',
    },
  });

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
