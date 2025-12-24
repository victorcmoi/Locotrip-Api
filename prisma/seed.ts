import { PrismaClient } from '../src/generated/prisma/client';
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

  console.log('✅ Adresses créées');

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
    },
  });

  console.log('✅ 5 guides créés');

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

  // Créer plusieurs reviews pour chaque expérience
  console.log('⭐ Création des avis...');

  // Reviews pour exp1 (Louvre - Sophie)
  await prisma.review.create({
    data: {
      user_id: client1.id,
      experience_id: exp1.id,
      rating: 5,
      comment:
        'Expérience exceptionnelle ! Sophie est très compétente et passionnée. Les 3h sont passées à une vitesse folle !',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client2.id,
      experience_id: exp1.id,
      rating: 5,
      comment:
        'Visite parfaite du Louvre. Sophie connaît chaque tableau par cœur et sait captiver son audience.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client3.id,
      experience_id: exp1.id,
      rating: 4,
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
      comment:
        "Thomas est un excellent guide gastronome ! Les bouchons qu'il nous a fait découvrir étaient délicieux.",
    },
  });

  await prisma.review.create({
    data: {
      user_id: client4.id,
      experience_id: exp2.id,
      rating: 5,
      comment:
        "Tour gastronomique incroyable ! J'ai découvert des saveurs que je ne connaissais pas. Thomas est passionné et ça se voit !",
    },
  });

  await prisma.review.create({
    data: {
      user_id: client2.id,
      experience_id: exp2.id,
      rating: 4,
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
      comment:
        "Camille nous a fait voir Paris sous un autre angle. Passionnant pour les amateurs d'architecture !",
    },
  });

  await prisma.review.create({
    data: {
      user_id: client1.id,
      experience_id: exp3.id,
      rating: 4,
      comment: 'Belle découverte des bâtiments parisiens. Très instructif.',
    },
  });

  // Reviews pour exp4 (Paris insolite - Alexandre)
  await prisma.review.create({
    data: {
      user_id: client2.id,
      experience_id: exp4.id,
      rating: 5,
      comment:
        'Alexandre nous a emmené dans des endroits que je ne connaissais pas du tout ! Paris secret à son meilleur.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client4.id,
      experience_id: exp4.id,
      rating: 5,
      comment:
        'Tour insolite incroyable ! Les passages couverts sont magnifiques. Alexandre est un guide exceptionnel.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client3.id,
      experience_id: exp4.id,
      rating: 5,
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
      comment:
        'Emma est super dynamique ! On a découvert des œuvres de street art incroyables à Belleville.',
    },
  });

  await prisma.review.create({
    data: {
      user_id: client1.id,
      experience_id: exp5.id,
      rating: 4,
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
      comment:
        "Montmartre avec Sophie, c'est magique ! Elle connaît toutes les anecdotes du quartier.",
    },
  });

  await prisma.review.create({
    data: {
      user_id: client3.id,
      experience_id: exp6.id,
      rating: 5,
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
      comment:
        "Thomas est un vrai sommelier ! J'ai appris énormément sur les vins français.",
    },
  });

  await prisma.review.create({
    data: {
      user_id: client2.id,
      experience_id: exp7.id,
      rating: 4,
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
  console.log("🎫 Création d'un ticket de support...");
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
