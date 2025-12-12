import { PrismaClient } from '@prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import 'dotenv/config';

const adapter = new PrismaPg({
  connectionString: process.env.DATABASE_URL,
});
const prisma = new PrismaClient({ adapter });

async function main() {
  console.log('🌱 Début du seeding...');

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

  const guideUser = await prisma.user.create({
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

  const admin = await prisma.user.create({
    data: {
      last_name: 'Admin',
      first_name: 'Système',
      email: 'admin@locotrip.com',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'admin',
      is_active: true,
      is_verified: true,
    },
  });

  // Créer un utilisateur inactif pour tester le soft delete
  const inactiveUser = await prisma.user.create({
    data: {
      last_name: 'Inactive',
      first_name: 'Test',
      email: 'inactive@example.com',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'client',
      is_active: false,
      is_verified: false,
      deleted_at: new Date(),
      deleted_reason: 'Test de soft delete',
    },
  });

  console.log(
    `✅ Utilisateurs créés: ${client1.email}, ${guideUser.email}, ${admin.email}, ${inactiveUser.email}`,
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
      user_id: guideUser.id,
      street: '45 Avenue des Champs-Élysées',
      city: 'Paris',
      state: 'Île-de-France',
      postal_code: '75008',
      country: 'France',
      longitude: 2.3077,
      latitude: 48.8698,
    },
  });

  console.log('✅ Adresses créées');

  // Créer un guide
  console.log('🎯 Création du profil guide...');
  const guide1 = await prisma.guide.create({
    data: {
      user_id: guideUser.id,
      bio: "Guide passionnée avec 5 ans d'expérience à Paris",
      languages: 'Français, Anglais, Espagnol',
      years_of_experience: 5,
      guide_status: 'pro',
      pro_card: true,
      country: 'France',
    },
  });

  console.log(`✅ Guide créé pour ${guideUser.first_name}`);

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

  console.log(`✅ Villes créées: ${paris.name}, ${lyon.name}`);

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

  console.log(
    `✅ Catégories créées: ${culture.name}, ${gastronomie.name}, ${aventure.name}`,
  );

  // Créer des expériences
  console.log('🎨 Création des expériences...');
  const exp1 = await prisma.experience.create({
    data: {
      title: 'Visite guidée du Louvre',
      description: "Découvrez les chefs-d'œuvre du plus grand musée du monde",
      price: 49.99,
      duration: 180, // 3 heures
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
        'Dégustez les spécialités lyonnaises dans les meilleurs bouchons',
      price: 79.99,
      duration: 240, // 4 heures
      city_id: lyon.id,
      guide_id: guide1.id,
      max_capacity: 10,
      meeting_point: 'Place Bellecour',
      meeting_latitude: 45.7578,
      meeting_longitude: 4.832,
      is_active: true,
      is_published: true,
    },
  });

  // Créer une expérience brouillon pour tester
  const exp3 = await prisma.experience.create({
    data: {
      title: 'Visite des catacombes (Brouillon)',
      description: 'Explorez les souterrains mystérieux de Paris',
      price: 35.0,
      duration: 120,
      city_id: paris.id,
      guide_id: guide1.id,
      max_capacity: 20,
      is_active: true,
      is_published: false, // Brouillon
    },
  });

  console.log(
    `✅ Expériences créées: ${exp1.title}, ${exp2.title}, ${exp3.title}`,
  );

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

  // Créer un review
  console.log("⭐ Création d'un avis...");
  await prisma.review.create({
    data: {
      user_id: client1.id,
      experience_id: exp1.id,
      rating: 5,
      comment: 'Expérience exceptionnelle ! Guide très compétente et passionnée.',
    },
  });

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
      author_id: guideUser.id,
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
  console.log('🎫 Création d\'un ticket de support...');
  const ticket = await prisma.support_ticket.create({
    data: {
      user_id: client1.id,
      subject: 'Question sur le remboursement',
      status: 'open',
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket.id,
      author_id: client1.id,
      content:
        "Bonjour, j'aimerais savoir comment fonctionne la politique de remboursement.",
    },
  });

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

  // Créer des médias
  console.log('📸 Ajout de médias...');
  await prisma.media.create({
    data: {
      entity_type: 'experience',
      entity_id: exp1.id,
      url: 'https://example.com/images/louvre1.jpg',
      media_type: 'photo',
      description: 'Vue extérieure du Louvre',
    },
  });

  await prisma.media.create({
    data: {
      entity_type: 'guide',
      entity_id: guide1.id,
      url: 'https://example.com/images/sophie-profile.jpg',
      media_type: 'photo',
      description: 'Photo de profil',
    },
  });

  console.log('✅ Médias ajoutés');

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
