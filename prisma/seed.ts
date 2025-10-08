import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('🌱 Début du seeding...');

  // Créer des devises
  console.log('💱 Création des devises...');
  const euro = await prisma.devise.upsert({
    where: { code: 'EUR' },
    update: {},
    create: {
      code: 'EUR',
      nom: 'Euro',
      taux_change: 1.0,
    },
  });

  const usd = await prisma.devise.upsert({
    where: { code: 'USD' },
    update: {},
    create: {
      code: 'USD',
      nom: 'Dollar américain',
      taux_change: 1.1,
    },
  });

  console.log(`✅ Devises créées: ${euro.code}, ${usd.code}`);

  // Créer des utilisateurs
  console.log('👥 Création des utilisateurs...');
  const client1 = await prisma.utilisateur.create({
    data: {
      nom: 'Dupont',
      prenom: 'Jean',
      email: 'jean.dupont@example.com',
      mot_de_passe: '$2a$10$abcdefghijklmnopqrstuv', // Hash fictif
      role: 'client',
    },
  });

  const guideUser = await prisma.utilisateur.create({
    data: {
      nom: 'Martin',
      prenom: 'Sophie',
      email: 'sophie.martin@example.com',
      mot_de_passe: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'guide',
    },
  });

  const admin = await prisma.utilisateur.create({
    data: {
      nom: 'Admin',
      prenom: 'Système',
      email: 'admin@locotrip.com',
      mot_de_passe: '$2a$10$abcdefghijklmnopqrstuv',
      role: 'admin',
    },
  });

  console.log(`✅ Utilisateurs créés: ${client1.email}, ${guideUser.email}, ${admin.email}`);

  // Créer un guide
  console.log('🎯 Création du profil guide...');
  const guide1 = await prisma.guide.create({
    data: {
      utilisateur_id: guideUser.id,
      bio: 'Guide passionnée avec 5 ans d\'expérience à Paris',
      langues: 'Français, Anglais, Espagnol',
      experience_annees: 5,
      statut_guide: 'pro',
      carte_pro: true,
      pays: 'France',
    },
  });

  console.log(`✅ Guide créé pour ${guideUser.prenom}`);

  // Créer des villes
  console.log('🌍 Création des villes...');
  const paris = await prisma.ville.create({
    data: {
      nom: 'Paris',
      pays: 'France',
      description: 'La ville lumière, capitale de la France',
    },
  });

  const lyon = await prisma.ville.create({
    data: {
      nom: 'Lyon',
      pays: 'France',
      description: 'Capitale de la gastronomie française',
    },
  });

  console.log(`✅ Villes créées: ${paris.nom}, ${lyon.nom}`);

  // Créer des catégories
  console.log('📂 Création des catégories...');
  const culture = await prisma.categorie.create({
    data: {
      nom: 'Culture & Histoire',
    },
  });

  const gastronomie = await prisma.categorie.create({
    data: {
      nom: 'Gastronomie',
    },
  });

  const aventure = await prisma.categorie.create({
    data: {
      nom: 'Aventure',
    },
  });

  console.log(`✅ Catégories créées: ${culture.nom}, ${gastronomie.nom}, ${aventure.nom}`);

  // Créer des expériences
  console.log('🎨 Création des expériences...');
  const exp1 = await prisma.experience.create({
    data: {
      titre: 'Visite guidée du Louvre',
      description: 'Découvrez les chefs-d\'œuvre du plus grand musée du monde',
      prix: 49.99,
      duree: 180, // 3 heures
      ville_id: paris.id,
      guide_id: guide1.id,
      capacite_max: 15,
    },
  });

  const exp2 = await prisma.experience.create({
    data: {
      titre: 'Tour gastronomique de Lyon',
      description: 'Dégustez les spécialités lyonnaises dans les meilleurs bouchons',
      prix: 79.99,
      duree: 240, // 4 heures
      ville_id: lyon.id,
      guide_id: guide1.id,
      capacite_max: 10,
    },
  });

  console.log(`✅ Expériences créées: ${exp1.titre}, ${exp2.titre}`);

  // Lier les expériences aux catégories
  await prisma.experience_categorie.create({
    data: {
      experience_id: exp1.id,
      categorie_id: culture.id,
    },
  });

  await prisma.experience_categorie.create({
    data: {
      experience_id: exp2.id,
      categorie_id: gastronomie.id,
    },
  });

  // Ajouter des prix en différentes devises
  console.log('💰 Ajout des prix multi-devises...');
  await prisma.experience_prix.create({
    data: {
      experience_id: exp1.id,
      devise_code: 'EUR',
      prix: 49.99,
    },
  });

  await prisma.experience_prix.create({
    data: {
      experience_id: exp1.id,
      devise_code: 'USD',
      prix: 54.99,
    },
  });

  await prisma.experience_prix.create({
    data: {
      experience_id: exp2.id,
      devise_code: 'EUR',
      prix: 79.99,
    },
  });

  // Créer une réservation
  console.log('📅 Création d\'une réservation...');
  const reservation1 = await prisma.reservation.create({
    data: {
      utilisateur_id: client1.id,
      experience_id: exp1.id,
      date_reservation: new Date('2025-11-15T10:00:00Z'),
      statut: 'confirmee',
      nombre_participants: 2,
      prix_total: 99.98,
    },
  });

  console.log(`✅ Réservation créée pour ${client1.prenom}`);

  // Créer un paiement
  console.log('💳 Création d\'un paiement...');
  await prisma.paiement.create({
    data: {
      reservation_id: reservation1.id,
      montant: 99.98,
      methode: 'carte_bancaire',
      statut: 'effectue',
      stripe_id: 'pi_test_123456789',
    },
  });

  // Créer un avis
  console.log('⭐ Création d\'un avis...');
  await prisma.avis.create({
    data: {
      utilisateur_id: client1.id,
      experience_id: exp1.id,
      note: 5,
      commentaire: 'Expérience exceptionnelle ! Guide très compétente et passionnée.',
    },
  });

  // Créer un abonnement
  console.log('🎫 Création d\'un abonnement...');
  await prisma.abonnement.create({
    data: {
      utilisateur_id: client1.id,
      type_abonnement: 'loco_plus',
      date_debut: new Date(),
      date_fin: new Date(Date.now() + 365 * 24 * 60 * 60 * 1000), // +1 an
      statut: 'actif',
    },
  });

  // Créer une conversation
  console.log('💬 Création d\'une conversation...');
  const conversation = await prisma.conversation.create({
    data: {
      reservation_id: reservation1.id,
    },
  });

  // Créer des messages
  await prisma.message.create({
    data: {
      conversation_id: conversation.id,
      auteur_id: client1.id,
      contenu: 'Bonjour, j\'ai une question sur le point de rendez-vous.',
    },
  });

  await prisma.message.create({
    data: {
      conversation_id: conversation.id,
      auteur_id: guideUser.id,
      contenu: 'Bonjour ! Le point de rendez-vous est devant la pyramide du Louvre.',
    },
  });

  // Créer des notifications
  console.log('🔔 Création de notifications...');
  await prisma.notification.create({
    data: {
      utilisateur_id: client1.id,
      type: 'rappel_reservation',
      contenu: 'Votre visite du Louvre a lieu demain à 10h',
      lu: false,
    },
  });

  // Créer un ticket de support
  console.log('🎫 Création d\'un ticket de support...');
  const ticket = await prisma.support_ticket.create({
    data: {
      utilisateur_id: client1.id,
      sujet: 'Question sur le remboursement',
      statut: 'ouvert',
    },
  });

  await prisma.ticket_message.create({
    data: {
      ticket_id: ticket.id,
      auteur_id: client1.id,
      contenu: 'Bonjour, j\'aimerais savoir comment fonctionne la politique de remboursement.',
    },
  });

  // Créer des offres de boost
  console.log('🚀 Création d\'offres de boost...');
  const boostBasic = await prisma.boost_offer.create({
    data: {
      nom: 'Boost Basic',
      description: 'Augmentez votre visibilité pendant 7 jours',
      duree_jours: 7,
      pourcentage_reduction: 0,
      prix: 19.99,
    },
  });

  const boostPremium = await prisma.boost_offer.create({
    data: {
      nom: 'Boost Premium',
      description: 'Apparaissez en premier pendant 30 jours',
      duree_jours: 30,
      pourcentage_reduction: 20,
      prix: 79.99,
    },
  });

  console.log(`✅ Offres de boost créées: ${boostBasic.nom}, ${boostPremium.nom}`);

  // Créer un boost actif pour le guide
  await prisma.guide_boost.create({
    data: {
      guide_id: guide1.id,
      boost_offer_id: boostPremium.id,
      date_expiration: new Date(Date.now() + 30 * 24 * 60 * 60 * 1000), // +30 jours
      statut: 'active',
    },
  });

  // Créer des médias
  console.log('📸 Ajout de médias...');
  await prisma.media.create({
    data: {
      entity_type: 'experience',
      entity_id: exp1.id,
      url: 'https://example.com/images/louvre1.jpg',
      type_media: 'photo',
      description: 'Vue extérieure du Louvre',
    },
  });

  await prisma.media.create({
    data: {
      entity_type: 'guide',
      entity_id: guide1.id,
      url: 'https://example.com/images/sophie-profile.jpg',
      type_media: 'photo',
      description: 'Photo de profil',
    },
  });

  console.log('✅ Médias ajoutés');

  console.log('\n🎉 Seeding terminé avec succès !');
  console.log('\n📊 Récapitulatif:');
  console.log(`   - ${await prisma.utilisateur.count()} utilisateurs`);
  console.log(`   - ${await prisma.guide.count()} guide(s)`);
  console.log(`   - ${await prisma.ville.count()} villes`);
  console.log(`   - ${await prisma.experience.count()} expériences`);
  console.log(`   - ${await prisma.categorie.count()} catégories`);
  console.log(`   - ${await prisma.reservation.count()} réservation(s)`);
  console.log(`   - ${await prisma.avis.count()} avis`);
  console.log(`   - ${await prisma.devise.count()} devises`);
}

main()
  .catch((e) => {
    console.error('❌ Erreur lors du seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
