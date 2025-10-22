import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

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
      password: '$2a$10$abcdefghijklmnopqrstuv', // Hash fictif
      role: 'client',
    },
  });

  const guideUser = await prisma.user.create({
    data: {
      last_name: 'Martin',
      first_name: 'Sophie',
      email: 'sophie.martin@example.com',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'guide',
    },
  });

  const admin = await prisma.user.create({
    data: {
      last_name: 'Admin',
      first_name: 'Système',
      email: 'admin@locotrip.com',
      password: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'admin',
    },
  });

  console.log(`✅ Utilisateurs créés: ${client1.email}, ${guideUser.email}, ${admin.email}`);

  // Créer un guide
  console.log('🎯 Création du profil guide...');
  const guide1 = await prisma.guide.create({
    data: {
      user_id: guideUser.id,
      bio: 'Guide passionnée avec 5 ans d\'expérience à Paris',
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
      description: 'La ville lumière, capitale de la France',
    },
  });

  const lyon = await prisma.city.create({
    data: {
      name: 'Lyon',
      country: 'France',
      description: 'Capitale de la gastronomie française',
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

  console.log(`✅ Catégories créées: ${culture.name}, ${gastronomie.name}, ${aventure.name}`);

  // Créer des expériences
  console.log('🎨 Création des expériences...');
  const exp1 = await prisma.experience.create({
    data: {
      title: 'Visite guidée du Louvre',
      description: 'Découvrez les chefs-d\'œuvre du plus grand musée du monde',
      price: 49.99,
      duration: 180, // 3 heures
      city_id: paris.id,
      guide_id: guide1.id,
      max_capacity: 15,
    },
  });

  const exp2 = await prisma.experience.create({
    data: {
      title: 'Tour gastronomique de Lyon',
      description: 'Dégustez les spécialités lyonnaises dans les meilleurs bouchons',
      price: 79.99,
      duration: 240, // 4 heures
      city_id: lyon.id,
      guide_id: guide1.id,
      max_capacity: 10,
    },
  });

  console.log(`✅ Expériences créées: ${exp1.title}, ${exp2.title}`);

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
  console.log('📅 Création d\'une réservation...');
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
  console.log('💳 Création d\'un payment...');
  await prisma.payment.create({
    data: {
      booking_id: booking1.id,
      amount: 99.98,
      method: 'carte_bancaire',
      status: 'completed',
      stripe_id: 'pi_test_123456789',
    },
  });

  // Créer un review
  console.log('⭐ Création d\'un avis...');
  await prisma.review.create({
    data: {
      user_id: client1.id,
      experience_id: exp1.id,
      rating: 5,
      comment: 'Expérience exceptionnelle ! Guide très compétente et passionnée.',
    },
  });

  // Créer un subscription
  console.log('🎫 Création d\'un subscription...');
  await prisma.subscription.create({
    data: {
      user_id: client1.id,
      subscription_type: 'loco_plus',
      start_date: new Date(),
      end_date: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 an
      status: 'actif',
    },
  });

  // Créer une conversation
  console.log('💬 Création d\'une conversation...');
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
      content: 'Bonjour, j\'ai une question sur le point de rendez-vous.',
    },
  });

  await prisma.message.create({
    data: {
      conversation_id: conversation.id,
      author_id: guideUser.id,
      content: 'Bonjour ! Le point de rendez-vous est devant la pyramide du Louvre.',
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
      content: 'Bonjour, j\'aimerais savoir comment fonctionne la politique de remboursement.',
    },
  });

  // Créer des offres de boost
  console.log('🚀 Création d\'offres de boost...');
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

  console.log(`✅ Offres de boost créées: ${boostBasic.name}, ${boostPremium.name}`);

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
