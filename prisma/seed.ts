import { PrismaClient } from '../src/generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';
import * as fs from 'fs';
import * as path from 'path';
import * as bcrypt from 'bcrypt';
import { MinioService } from '../src/minio/minio.service';
import { ConfigService } from '@nestjs/config';
import { BucketName } from '../src/minio/enums/minio.enum';

const adapter = new PrismaPg({ connectionString: process.env.DATABASE_URL });
const prisma = new PrismaClient({ adapter });
const minioService = new MinioService(new ConfigService());

const GUIDE_FIRST_NAMES = [
  'Sophie', 'Thomas', 'Camille', 'Alexandre', 'Emma', 'Julien', 'Isabelle', 'Francois',
  'Clara', 'Antoine', 'Lea', 'Maxime', 'Nathalie', 'Olivier', 'Audrey', 'Vincent',
  'Marion', 'Hugo', 'Lucie', 'Nicolas', 'Sarah', 'Baptiste', 'Pauline', 'Mathieu',
  'Elsa', 'Loic', 'Ines', 'Romain', 'Marine', 'Jeremy',
];

const GUIDE_LAST_NAMES = [
  'Martin', 'Bernard', 'Dubois', 'Rousseau', 'Laurent', 'Simon', 'Mercier', 'Garcia',
  'Lopez', 'Morel', 'Girard', 'Andre', 'Faure', 'Noel', 'Dupuis', 'Chevalier',
  'Robin', 'Gauthier', 'Moulin', 'Renaud', 'Masson', 'Perrot', 'Leclerc', 'Arnaud',
];

const TRAVELER_FIRST_NAMES = [
  'Jean', 'Marie', 'Pierre', 'Julie', 'Lucas', 'Camille', 'Lea', 'Hugo', 'Clara',
  'Theo', 'Manon', 'Kevin', 'Nina', 'Valentin', 'Elise', 'Tom', 'Chloe', 'Yanis',
];

const TRAVELER_LAST_NAMES = [
  'Dupont', 'Petit', 'Moreau', 'Garcia', 'Lefebvre', 'Roux', 'Fournier', 'Vincent',
  'Mercier', 'Lopez', 'Rossi', 'Bianchi', 'Ricci', 'Schmidt', 'Meyer',
];

const CATEGORY_NAMES = [
  'Culture', 'Histoire', 'Gastronomie', 'Aventure', 'Nature', 'Photo', 'Art',
  'Sport', 'Bien-etre', 'Architecture', 'Mode', 'Musique', 'Street food',
  'Famille', 'Nocturne', 'Patrimoine', 'Randonnée', 'Atelier',
];

const EXPERIENCE_TITLES = [
  'Balade historique du centre ancien',
  'Tour street food et specialites locales',
  'Atelier cuisine regionale',
  'Visite photo des meilleurs points de vue',
  'Randonnee panoramique facile',
  'Parcours art et galeries',
  'Tour velo des quartiers iconiques',
  'Experience coucher de soleil en ville',
  'Circuit patrimoine et legendes',
  'Matinee bien-etre et marche local',
  'Nocturne culturelle et adresses cachees',
  'Immersion artisanat et savoir-faire',
];

const EXPERIENCE_DESCRIPTIONS = [
  'Une experience immersive menee en petit groupe pour decouvrir la ville autrement, avec des anecdotes locales et des conseils pratiques.',
  'Parcours vivant et accessible, ideal pour les voyageurs qui veulent comprendre la culture locale en peu de temps.',
  'Activite conviviale avec un rythme adapte, des pauses, et des points d interet soigneusement selectionnes.',
  'Sortie complete avec un guide experimente, un programme clair, et un niveau de confort adapte a tous.',
  'Decouverte authentique combinee a des rencontres locales et des recommandations personnalisees pour la suite du sejour.',
];

const EXPERIENCE_STEPS = [
  { title: 'Accueil et briefing', description: 'Presentation du groupe, verification des attentes et rappel du programme.' },
  { title: 'Parcours principal', description: 'Immersion guidee sur les points forts avec explications detaillees.' },
  { title: 'Pause et echanges', description: 'Questions, retours d experience et conseils pratiques du guide.' },
  { title: 'Cloture', description: 'Recapitulatif, bonnes adresses, et recommandations pour continuer la decouverte.' },
];

const REVIEW_TITLES = [
  'Superbe experience', 'Tres bonne visite', 'Guide passionne', 'A refaire',
  'Excellent rapport qualite prix', 'Organisation parfaite',
];

const REVIEW_COMMENTS = [
  'Nous avons passe un excellent moment, tout etait fluide et bien organise.',
  'Le guide etait ponctuel, tres clair, et tres agreable avec le groupe.',
  'Programme complet, rythme ideal, et tres bonnes recommandations locales.',
  'Experience realiste, humaine, et vraiment utile pour decouvrir la ville.',
  'Nous recommandons sans hesitation, surtout pour un premier sejour.',
];

const DISPUTE_REASONS = [
  'Le programme annonce etait incomplet par rapport a la description.',
  'Le point de rendez-vous n etait pas assez clair dans le message de confirmation.',
  'Retard important au demarrage de l activite.',
  'Des prestations prevues n ont pas pu etre assurees.',
  'Demande de remboursement partiel suite a une annulation de segment.',
];

const MESSAGE_TEMPLATES_CLIENT = [
  'Bonjour, nous serons au point de rendez-vous 10 minutes avant.',
  'Pouvez-vous confirmer le materiel a prevoir ?',
  'Merci pour les informations, a demain.',
  'Nous sommes un groupe avec un enfant, est-ce adapte ?',
  'Est-ce possible de decalage de 15 minutes ?',
];

const MESSAGE_TEMPLATES_GUIDE = [
  'Bonjour, je vous confirme la disponibilite et le lieu exact.',
  'Pensez a prendre des chaussures confortables et de l eau.',
  'Je resterai joignable en cas de retard.',
  'Parfait pour votre groupe, je vous envoie le recapitulatif.',
  'A demain, je vous attends au point indique.',
];

const DEMO_PASSWORD = 'Locotrip123!';

function getErrorMessage(error: unknown): string {
  return error instanceof Error ? error.message : String(error);
}

function randomInt(min: number, max: number): number {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

function pickOne<T>(items: T[]): T {
  return items[randomInt(0, items.length - 1)];
}

function pickMany<T>(items: T[], count: number): T[] {
  const shuffled = [...items].sort(() => Math.random() - 0.5);
  return shuffled.slice(0, Math.min(count, items.length));
}

function addDays(date: Date, days: number): Date {
  const d = new Date(date);
  d.setDate(d.getDate() + days);
  return d;
}

function getGuideImagePath(index: number): string {
  const guidesDir = path.join(__dirname, 'assets', 'guides');
  const candidates = [
    path.join(guidesDir, `guide-${index}.avif`),
    path.join(guidesDir, `guide-${index}.jpg`),
    path.join(guidesDir, `guide-${index}.jpeg`),
    path.join(guidesDir, `guide-${index}.png`),
  ];
  const found = candidates.find((p) => fs.existsSync(p));
  if (found) return found;

  const fallback = path.join(guidesDir, 'guide-default.avif');
  if (fs.existsSync(fallback)) return fallback;

  throw new Error('Aucune image guide trouvee et guide-default.avif manquant.');
}

function getMimeTypeFromPath(filePath: string): string {
  const ext = path.extname(filePath).toLowerCase();
  if (ext === '.avif') return 'image/avif';
  if (ext === '.png') return 'image/png';
  return 'image/jpeg';
}

async function uploadAsset(filePath: string, key: string, metadata?: Record<string, string>): Promise<string> {
  if (!fs.existsSync(filePath)) return '';
  const buffer = fs.readFileSync(filePath);
  const uploaded = await minioService.uploadFile(
    BucketName.LOCOTRIP,
    key,
    buffer,
    getMimeTypeFromPath(filePath),
    metadata,
  );
  return uploaded.url;
}

async function resetBuckets(): Promise<void> {
  const existingBuckets = await minioService.listBuckets();
  for (const bucket of existingBuckets) {
    await minioService.deleteBucket(bucket);
  }
  for (const bucket of Object.values(BucketName)) {
    await minioService.ensureBucketExists(bucket);
  }
}

async function clearDatabase(): Promise<void> {
  await prisma.ticket_message.deleteMany();
  await prisma.support_ticket.deleteMany();
  await prisma.notification.deleteMany();
  await prisma.data_access_log.deleteMany();

  await prisma.message.deleteMany();
  await prisma.conversation.deleteMany();
  await prisma.dispute.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.booking.deleteMany();

  await prisma.media.deleteMany();
  await prisma.review.deleteMany();
  await prisma.subscription.deleteMany();

  await prisma.experience_availability.deleteMany();
  await prisma.experience_step.deleteMany();
  await prisma.experience_category.deleteMany();
  await prisma.experience_price.deleteMany();
  await prisma.experience.deleteMany();

  await prisma.guide_document.deleteMany();
  await prisma.guide_hobby.deleteMany();
  await prisma.guide_boost.deleteMany();
  await prisma.boost_offer.deleteMany();
  await prisma.guide.deleteMany();

  await prisma.address.deleteMany();
  await prisma.city.deleteMany();
  await prisma.category.deleteMany();
  await prisma.user.deleteMany();
  await prisma.currency.deleteMany();
}

async function main() {
  console.log('Seed start: clean and full dataset');

  try {
    await resetBuckets();
    await clearDatabase();

    const eur = await prisma.currency.create({
      data: { code: 'EUR', name: 'Euro', exchange_rate: 1.0 },
    });
    const usd = await prisma.currency.create({
      data: { code: 'USD', name: 'US Dollar', exchange_rate: 1.1 },
    });

    await prisma.category.createMany({
      data: CATEGORY_NAMES.map((name) => ({ name })),
    });
    const categories = await prisma.category.findMany();
    const hashedDemoPassword = await bcrypt.hash(DEMO_PASSWORD, 10);

    const adminUser = await prisma.user.create({
      data: {
        first_name: 'Admin',
        last_name: 'Locotrip',
        email: 'admin@locotrip.com',
        phone: '+33611111111',
        birth_date: new Date('1990-01-01'),
        password: '$2b$10$MW4ryE5jmOcqbKEn97xcHOPIUIK2TJiy.EjAf/338FY.ibPcsCQsi',
        role: 'admin',
        is_active: true,
        is_verified: true,
        marketing_consent: false,
      },
    });

    const travelers: Array<{ id: string; email: string }> = [];
    for (let i = 1; i <= 80; i++) {
      const first = pickOne(TRAVELER_FIRST_NAMES);
      const last = pickOne(TRAVELER_LAST_NAMES);
      const user = await prisma.user.create({
        data: {
          first_name: first,
          last_name: last,
          email: `voyageur${i}@locotrip.com`,
          phone: `+336${String(10000000 + i).padStart(8, '0')}`,
          birth_date: new Date(randomInt(1970, 2003), randomInt(0, 11), randomInt(1, 28)),
          password: hashedDemoPassword,
          role: 'client',
          is_active: true,
          is_verified: true,
          marketing_consent: i % 2 === 0,
          marketing_consent_date: i % 2 === 0 ? new Date() : null,
        },
      });
      travelers.push({ id: user.id, email: user.email });
    }

    const guideUsers: Array<{ userId: string; guideId: string; firstName: string; lastName: string }> = [];
    for (let i = 1; i <= 40; i++) {
      const first = GUIDE_FIRST_NAMES[(i - 1) % GUIDE_FIRST_NAMES.length];
      const last = GUIDE_LAST_NAMES[(i - 1) % GUIDE_LAST_NAMES.length];

      const user = await prisma.user.create({
        data: {
          first_name: first,
          last_name: last,
          email: `guide${i}@locotrip.com`,
          phone: `+337${String(20000000 + i).padStart(8, '0')}`,
          birth_date: new Date(randomInt(1972, 1998), randomInt(0, 11), randomInt(1, 28)),
          password: hashedDemoPassword,
          role: 'guide',
          is_active: true,
          is_verified: true,
          marketing_consent: true,
          marketing_consent_date: new Date(),
        },
      });

      const guide = await prisma.guide.create({
        data: {
          user_id: user.id,
          bio: `${first} ${last} accompagne des voyageurs avec une approche humaine et locale. Experience terrain et programme personnalise selon le groupe.`,
          languages: pickMany(['Francais', 'Anglais', 'Espagnol', 'Italien', 'Allemand'], randomInt(2, 3)).join(', '),
          years_of_experience: randomInt(2, 18),
          guide_status: i % 3 === 0 ? 'pro' : 'local',
          pro_card: i % 3 === 0,
          country: 'France',
          card_request_date: i % 3 === 0 ? addDays(new Date(), -randomInt(100, 600)) : null,
          card_verification_date: i % 3 === 0 ? addDays(new Date(), -randomInt(30, 200)) : null,
          response_time_hours: Number((Math.random() * 12 + 1).toFixed(2)),
          is_active: true,
        },
      });

      const imagePath = getGuideImagePath(((i - 1) % 15) + 1);
      const profileUrl = await uploadAsset(
        imagePath,
        `profiles/guides/${guide.id}/profile${path.extname(imagePath)}`,
        { entityType: 'guide', mediaType: 'profile_picture', guideId: guide.id },
      );

      if (profileUrl) {
        await prisma.media.create({
          data: {
            entity_type: 'guide',
            entity_id: guide.id,
            url: profileUrl,
            media_type: 'profile_picture',
            description: `Photo de profil de ${first} ${last}`,
            guide_id: guide.id,
          },
        });
      }

      const hobbies = pickMany(categories, randomInt(3, 5));
      for (const hobby of hobbies) {
        await prisma.guide_hobby.create({
          data: { guide_id: guide.id, category_id: hobby.id },
        });
      }

      await prisma.guide_document.createMany({
        data: [
          {
            guide_id: guide.id,
            document_type: 'CV',
            verification_status: 'verified',
            verification_comment: 'Profil professionnel valide',
            document_url: `docs/guides/${guide.id}/cv.pdf`,
            verification_date: addDays(new Date(), -randomInt(5, 150)),
          },
          {
            guide_id: guide.id,
            document_type: 'proof_of_residence',
            verification_status: 'verified',
            verification_comment: 'Justificatif conforme',
            document_url: `docs/guides/${guide.id}/residence.pdf`,
            verification_date: addDays(new Date(), -randomInt(5, 150)),
          },
          {
            guide_id: guide.id,
            document_type: 'diploma',
            verification_status: i % 6 === 0 ? 'pending' : 'verified',
            verification_comment: i % 6 === 0 ? null : 'Diplome valide',
            document_url: `docs/guides/${guide.id}/diploma.pdf`,
            verification_date: i % 6 === 0 ? null : addDays(new Date(), -randomInt(5, 150)),
          },
        ],
      });

      guideUsers.push({ userId: user.id, guideId: guide.id, firstName: first, lastName: last });
    }

    const cityRaw = JSON.parse(fs.readFileSync(path.join(__dirname, 'assets', 'cities.json'), 'utf-8')) as Array<any>;
    const cityInputs = cityRaw;
    const cityCreateData = cityInputs.map((c) => ({
      name: c.name,
      country: c.country,
      slug: c.slug,
      description: c.description || `Ville ${c.name} ideale pour des experiences authentiques.`,
      latitude: typeof c.latitude === 'number' ? c.latitude : null,
      longitude: typeof c.longitude === 'number' ? c.longitude : null,
      is_active: true,
      is_suggested: Boolean(c.is_suggested),
    }));

    await prisma.city.createMany({
      data: cityCreateData,
      skipDuplicates: true,
    });

    const insertedCities = await prisma.city.findMany({
      where: {
        slug: {
          in: cityCreateData.map((c) => c.slug),
        },
      },
      select: {
        id: true,
        slug: true,
        name: true,
        country: true,
        latitude: true,
        longitude: true,
      },
    });

    const cities: Array<{ id: string; slug: string; name: string; country: string; latitude: number | null; longitude: number | null }> = insertedCities;

    const cityImageMap: Record<string, string> = {
      'paris-france': 'paris.jpg',
      'lyon-france': 'lyon.jpg',
      'nice-france': 'nice.jpg',
      'barcelona-espagne': 'barcelone.jpg',
      'madrid-espagne': 'madrid.jpg',
      'berlin-allemagne': 'berlin.jpg',
      'munich-allemagne': 'munich.jpg',
      'seville-espagne': 'seville.jpg',
    };

    for (const city of cities) {
      const imageName = cityImageMap[city.slug];
      if (!imageName) continue;
      const imagePath = path.join(__dirname, 'assets', 'citites', imageName);
      const cityImageUrl = await uploadAsset(
        imagePath,
        `cities/${city.id}/${imageName}`,
        { entityType: 'city', mediaType: 'city_image', cityId: city.id },
      );
      if (!cityImageUrl) continue;
      await prisma.media.create({
        data: {
          entity_type: 'city',
          entity_id: city.id,
          url: cityImageUrl,
          media_type: 'city_image',
          description: `Image de ${city.name}`,
          city_id: city.id,
        },
      });
    }

    const boostOffers = await Promise.all([
      prisma.boost_offer.create({
        data: { name: 'Boost Starter', description: 'Mise en avant 7 jours', duration_days: 7, discount_percentage: 0, price: 19.9 },
      }),
      prisma.boost_offer.create({
        data: { name: 'Boost Plus', description: 'Mise en avant 15 jours', duration_days: 15, discount_percentage: 10, price: 34.9 },
      }),
      prisma.boost_offer.create({
        data: { name: 'Boost Pro', description: 'Mise en avant 30 jours', duration_days: 30, discount_percentage: 15, price: 59.9 },
      }),
    ]);

    for (let i = 0; i < guideUsers.length; i++) {
      if (i % 2 !== 0) continue;
      const offer = boostOffers[i % boostOffers.length];
      const purchaseDate = addDays(new Date(), -randomInt(1, 45));
      const expirationDate = addDays(purchaseDate, offer.duration_days);
      await prisma.guide_boost.create({
        data: {
          guide_id: guideUsers[i].guideId,
          boost_offer_id: offer.id,
          purchase_date: purchaseDate,
          expiration_date: expirationDate,
          status: expirationDate > new Date() ? 'active' : 'expired',
        },
      });
    }

    const experiences: Array<{ id: string; guideId: string; cityId: string; price: number; title: string }> = [];
    const parisCity = cities.find((city) => city.slug === 'paris-france' || city.name.toLowerCase() === 'paris');
    for (let i = 1; i <= 120; i++) {
      const guide = guideUsers[(i - 1) % guideUsers.length];
      const city = i <= 12 && parisCity ? parisCity : cities[(i - 1) % cities.length];
      const title = `${pickOne(EXPERIENCE_TITLES)} - ${city.name}`;
      const price = Number((randomInt(25, 140) + Math.random()).toFixed(2));

      const exp = await prisma.experience.create({
        data: {
          title,
          description: pickOne(EXPERIENCE_DESCRIPTIONS),
          additional_info: 'Petit groupe, materiel essentiel indique avant depart, confirmation envoyee 24h avant.',
          price,
          duration: randomInt(90, 360),
          city_id: city.id,
          guide_id: guide.guideId,
          max_capacity: randomInt(4, 20),
          meeting_point: `${city.name} - Point central`,
          meeting_latitude: city.latitude ? Number((city.latitude + (Math.random() - 0.5) * 0.03).toFixed(6)) : null,
          meeting_longitude: city.longitude ? Number((city.longitude + (Math.random() - 0.5) * 0.03).toFixed(6)) : null,
          is_accessible: i % 5 !== 0,
          is_active: true,
          is_published: true,
        },
      });

      experiences.push({ id: exp.id, guideId: guide.guideId, cityId: city.id, price, title });

      await prisma.experience_price.createMany({
        data: [
          { experience_id: exp.id, currency_code: eur.code, price },
          { experience_id: exp.id, currency_code: usd.code, price: Number((price * 1.1).toFixed(2)) },
        ],
      });

      const expCategories = pickMany(categories, randomInt(2, 3));
      await prisma.experience_category.createMany({
        data: expCategories.map((cat) => ({
          experience_id: exp.id,
          category_id: cat.id,
        })),
        skipDuplicates: true,
      });

      await prisma.experience_step.createMany({
        data: Array.from({ length: 4 }, (_, s) => ({
          experience_id: exp.id,
          step_number: s + 1,
          title: EXPERIENCE_STEPS[s].title,
          description: EXPERIENCE_STEPS[s].description,
        })),
      });

      const availabilityBase = addDays(new Date(), randomInt(2, 20));
      await prisma.experience_availability.createMany({
        data: Array.from({ length: 2 }, (_, a) => {
          const start = addDays(availabilityBase, a * 7);
          return {
            experience_id: exp.id,
            start_date: start,
            end_date: addDays(start, 1),
            status: a % 5 === 0 ? 'unavailable' : 'available',
          };
        }),
      });

      const mediaRows: Array<{
        entity_type: string;
        entity_id: string;
        url: string;
        media_type: 'profile_picture' | 'pictures';
        description: string;
        experience_id: string;
      }> = [];
      for (let m = 0; m < 2; m++) {
        const imgNum = ((i + m - 1) % 66) + 1;
        const expPath = path.join(__dirname, 'assets', 'experiences', `exp-${imgNum}.png`);
        const mediaType = m === 0 ? 'profile_picture' : 'pictures';
        const expUrl = await uploadAsset(
          expPath,
          `experiences/${exp.id}/${mediaType}/exp-${imgNum}.png`,
          { entityType: 'experience', mediaType, experienceId: exp.id },
        );

        if (!expUrl) continue;
        mediaRows.push({
          entity_type: 'experience',
          entity_id: exp.id,
          url: expUrl,
          media_type: mediaType,
          description: m === 0 ? `Image principale - ${title}` : `Galerie - ${title}`,
          experience_id: exp.id,
        });
      }

      if (mediaRows.length > 0) {
        await prisma.media.createMany({
          data: mediaRows,
        });
      }
    }

    const bookings: Array<{ id: string; userId: string; experienceId: string; status: 'pending' | 'confirmed' | 'cancelled' | 'completed' }> = [];
    for (let i = 1; i <= 220; i++) {
      const traveler = pickOne(travelers);
      const exp = pickOne(experiences);
      const participants = randomInt(1, 5);
      const total = Number((exp.price * participants).toFixed(2));
      const statusOptions: Array<'pending' | 'confirmed' | 'cancelled' | 'completed'> = ['pending', 'confirmed', 'cancelled', 'completed'];
      const bookingStatus = statusOptions[i % statusOptions.length];
      const bookingDate = addDays(new Date(), -randomInt(1, 120));

      const booking = await prisma.booking.create({
        data: {
          user_id: traveler.id,
          experience_id: exp.id,
          booking_date: bookingDate,
          status: bookingStatus,
          number_of_participants: participants,
          total_price: total,
        },
      });

      bookings.push({ id: booking.id, userId: traveler.id, experienceId: exp.id, status: bookingStatus });

      await prisma.payment.create({
        data: {
          booking_id: booking.id,
          amount: total,
          currency: 'EUR',
          payment_date: addDays(bookingDate, 0),
          method: pickOne(['card', 'paypal', 'apple_pay']),
          status:
            bookingStatus === 'cancelled'
              ? 'cancelled'
              : bookingStatus === 'pending'
                ? 'pending'
                : 'completed',
          stripe_payment_intent_id: `pi_seed_${i}_${Math.random().toString(36).slice(2, 9)}`,
          stripe_customer_id: `cus_seed_${randomInt(1000, 9999)}`,
          metadata: { source: 'seed', bookingIndex: i },
        },
      });
    }

    const conversationBookings = pickMany(bookings, 170);
    for (let i = 0; i < conversationBookings.length; i++) {
      const booking = conversationBookings[i];
      const exp = experiences.find((e) => e.id === booking.experienceId);
      if (!exp) continue;
      const conv = await prisma.conversation.create({ data: { booking_id: booking.id } });

      const msgCount = randomInt(3, 6);
      const startAt = addDays(new Date(), -randomInt(1, 45));
      const guideUserId = guideUsers.find((g) => g.guideId === exp.guideId)?.userId || booking.userId;
      await prisma.message.createMany({
        data: Array.from({ length: msgCount }, (_, m) => {
          const fromClient = m % 2 === 0;
          return {
            conversation_id: conv.id,
            author_id: fromClient ? booking.userId : guideUserId,
            content: fromClient ? pickOne(MESSAGE_TEMPLATES_CLIENT) : pickOne(MESSAGE_TEMPLATES_GUIDE),
            is_read: m < msgCount - 1,
            sent_at: addDays(startAt, 0),
          };
        }),
      });
    }

    const disputeBookings = pickMany(bookings.filter((b) => b.status !== 'pending'), 24);
    for (let i = 0; i < disputeBookings.length; i++) {
      const b = disputeBookings[i];
      const status: 'open' | 'pending' | 'resolved' | 'rejected' =
        i % 4 === 0 ? 'open' : i % 4 === 1 ? 'pending' : i % 4 === 2 ? 'resolved' : 'rejected';
      await prisma.dispute.create({
        data: {
          booking_id: b.id,
          user_id: b.userId,
          reason: pickOne(DISPUTE_REASONS),
          status,
          admin_id: status === 'resolved' || status === 'rejected' ? adminUser.id : null,
          resolution_date: status === 'resolved' || status === 'rejected' ? addDays(new Date(), -randomInt(0, 10)) : null,
        },
      });
    }

    for (let i = 0; i < 260; i++) {
      const traveler = pickOne(travelers);
      const exp = pickOne(experiences);
      const rating = randomInt(3, 5);
      const review = await prisma.review.create({
        data: {
          user_id: traveler.id,
          experience_id: exp.id,
          rating,
          title: pickOne(REVIEW_TITLES),
          comment: pickOne(REVIEW_COMMENTS),
          review_date: addDays(new Date(), -randomInt(0, 120)),
        },
      });

      if (i % 4 === 0) {
        const imgNum = (i % 66) + 1;
        const reviewPath = path.join(__dirname, 'assets', 'experiences', `exp-${imgNum}.png`);
        const reviewUrl = await uploadAsset(
          reviewPath,
          `reviews/${review.id}/review-${imgNum}.png`,
          { entityType: 'review', mediaType: 'pictures', reviewId: review.id },
        );

        if (reviewUrl) {
          await prisma.media.create({
            data: {
              entity_type: 'review',
              entity_id: review.id,
              url: reviewUrl,
              media_type: 'pictures',
              description: 'Photo partagee par le voyageur',
              review_id: review.id,
            },
          });
        }
      }
    }

    for (let i = 0; i < 45; i++) {
      const t = travelers[i % travelers.length];
      const start = addDays(new Date(), -randomInt(0, 180));
      const end = addDays(start, 365);
      await prisma.subscription.create({
        data: {
          user_id: t.id,
          subscription_type: i % 3 === 0 ? 'loco_plus' : 'standard',
          start_date: start,
          end_date: end,
          status: end > new Date() ? 'active' : 'expired',
        },
      });
    }

    const allUsers = await prisma.user.findMany({ select: { id: true, role: true } });
    await prisma.notification.createMany({
      data: Array.from({ length: allUsers.length * 2 }, (_, i) => {
        const u = allUsers[i % allUsers.length];
        return {
          user_id: u.id,
          type: i % 2 === 0 ? 'booking_reminder' : 'new_message',
          content:
            i % 2 === 0
              ? 'Rappel: votre reservation approche, verifiez les details pratiques.'
              : 'Vous avez recu un nouveau message sur une conversation de reservation.',
          read: i % 4 === 0,
          sent_at: addDays(new Date(), -randomInt(0, 45)),
        };
      }),
    });

    for (let i = 0; i < 55; i++) {
      const owner = allUsers[i % allUsers.length];
      const ticket = await prisma.support_ticket.create({
        data: {
          user_id: owner.id,
          subject:
            i % 3 === 0
              ? 'Question sur une reservation'
              : i % 3 === 1
                ? 'Probleme de paiement'
                : 'Aide sur mon profil',
          status: i % 3 === 0 ? 'open' : i % 3 === 1 ? 'in_progress' : 'closed',
          created_at: addDays(new Date(), -randomInt(0, 80)),
          closed_at: i % 3 === 2 ? addDays(new Date(), -randomInt(0, 20)) : null,
        },
      });

      const admin = adminUser.id;
      await prisma.ticket_message.createMany({
        data: [
          {
            ticket_id: ticket.id,
            author_id: owner.id,
            content: 'Bonjour, je vous contacte pour obtenir de l aide sur ce sujet.',
            sent_at: addDays(new Date(), -randomInt(0, 60)),
          },
          {
            ticket_id: ticket.id,
            author_id: admin,
            content: 'Merci pour votre message, nous analysons votre demande.',
            sent_at: addDays(new Date(), -randomInt(0, 30)),
          },
        ],
      });
    }

    await prisma.data_access_log.createMany({
      data: Array.from({ length: 360 }, (_, i) => {
        const targetUser = allUsers[i % allUsers.length];
        const actorUser = allUsers[(i + 7) % allUsers.length];
        return {
          user_id: targetUser.role === 'admin' ? null : targetUser.id,
          accessed_by: actorUser.id,
          entity_type: pickOne(['booking', 'payment', 'message', 'review', 'support_ticket']),
          entity_id: bookings[i % bookings.length]?.id || experiences[i % experiences.length].id,
          action: pickOne(['read', 'create', 'update']),
          ip_address: `192.168.${randomInt(0, 255)}.${randomInt(1, 254)}`,
          reason: 'Consultation operationnelle et suivi qualite',
          access_date: addDays(new Date(), -randomInt(0, 90)),
        };
      }),
    });

    const addressUsers = await prisma.user.findMany({ select: { id: true }, take: 130 });
    await prisma.address.createMany({
      data: addressUsers.map((user, i) => {
        const city = cities[i % cities.length];
        return {
          user_id: user.id,
          street: `${randomInt(1, 199)} Rue des Voyageurs`,
          city: city.name,
          state: city.country,
          postal_code: `${randomInt(10000, 95999)}`,
          country: city.country,
          longitude: city.longitude ?? Number((2 + Math.random()).toFixed(6)),
          latitude: city.latitude ?? Number((48 + Math.random()).toFixed(6)),
        };
      }),
    });

    console.log('Seed done');
    console.log(`Users: ${allUsers.length}`);
    console.log(`Guides: ${guideUsers.length}`);
    console.log(`Cities: ${cities.length}`);
    console.log(`Experiences: ${experiences.length}`);
    console.log(`Bookings: ${bookings.length}`);
    console.log(`Demo guide account: guide1@locotrip.com / ${DEMO_PASSWORD}`);
    console.log(`Demo traveler account: voyageur1@locotrip.com / ${DEMO_PASSWORD}`);
  } catch (error) {
    console.error('Seed error:', getErrorMessage(error));
    throw error;
  } finally {
    await prisma.$disconnect();
  }
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
