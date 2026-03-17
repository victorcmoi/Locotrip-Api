import { Injectable, Logger } from '@nestjs/common';
import { MailgunService } from 'nestjs-mailgun';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly fromEmail: string;
  private readonly domain: string;

  constructor(private readonly mailgunService: MailgunService) {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@loco-trip.com';
    this.domain =
      process.env.MAILGUN_DOMAIN || process.env.MAILGUN_SANDBOX_DOMAIN || '';
  }

  /**
   * Envoie un email simple
   */
  async sendEmail(to: string, subject: string, text: string, html?: string) {
    try {
      const result = await this.mailgunService.createEmail(this.domain, {
        from: this.fromEmail,
        to: [to],
        subject,
        text,
        html: html || text,
      });

      this.logger.log(`Email envoyé avec succès à ${to}`);
      return result;
    } catch (error) {
      this.logger.error(`Erreur lors de l'envoi de l'email à ${to}:`, error);
      throw error;
    }
  }

  /**
   * Envoie un email de bienvenue
   */
  async sendWelcomeEmail(to: string, userName: string) {
    const subject = 'Bienvenue sur Locotrip !';
    const text = `Bonjour ${userName},\n\nBienvenue sur Locotrip ! Nous sommes ravis de vous compter parmi nous.\n\nCordialement,\nL'équipe Locotrip`;
    const html = `
      <h1>Bienvenue sur Locotrip !</h1>
      <p>Bonjour <strong>${userName}</strong>,</p>
      <p>Nous sommes ravis de vous compter parmi nous.</p>
      <p>Cordialement,<br/>L'équipe Locotrip</p>
    `;

    return this.sendEmail(to, subject, text, html);
  }

  /**
   * Envoie un email de réinitialisation de mot de passe
   */
  async sendPasswordResetEmail(to: string, resetToken: string) {
    const resetUrl = `${process.env.FRONTEND_URL || 'https://www.loco-trip.com'}/reset-password?token=${resetToken}`;
    const subject = 'Réinitialisation de votre mot de passe';
    const text = `Bonjour,\n\nVous avez demandé à réinitialiser votre mot de passe.\n\nCliquez sur ce lien : ${resetUrl}\n\nCe lien expire dans 1 heure.\n\nSi vous n'avez pas demandé cette réinitialisation, ignorez cet email.\n\nCordialement,\nL'équipe Locotrip`;
    const html = `
      <h2>Réinitialisation de votre mot de passe</h2>
      <p>Bonjour,</p>
      <p>Vous avez demandé à réinitialiser votre mot de passe.</p>
      <p><a href="${resetUrl}" style="background-color: #4CAF50; color: white; padding: 14px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Réinitialiser mon mot de passe</a></p>
      <p>Ou copiez ce lien dans votre navigateur :<br/>${resetUrl}</p>
      <p><em>Ce lien expire dans 1 heure.</em></p>
      <p>Si vous n'avez pas demandé cette réinitialisation, ignorez cet email.</p>
      <p>Cordialement,<br/>L'équipe Locotrip</p>
    `;

    return this.sendEmail(to, subject, text, html);
  }

  /**
   * Envoie un email de confirmation de réservation
   */
  async sendBookingConfirmationEmail(
    to: string,
    bookingDetails: {
      userName: string;
      experienceName: string;
      date: string;
      price: string;
      bookingId: string;
    },
  ) {
    const subject = `Confirmation de réservation - ${bookingDetails.experienceName}`;
    const text = `Bonjour ${bookingDetails.userName},\n\nVotre réservation a été confirmée !\n\nDétails de la réservation :\n- Expérience : ${bookingDetails.experienceName}\n- Date : ${bookingDetails.date}\n- Prix : ${bookingDetails.price}\n- Numéro de réservation : ${bookingDetails.bookingId}\n\nCordialement,\nL'équipe Locotrip`;
    const html = `
      <h2>Confirmation de réservation</h2>
      <p>Bonjour <strong>${bookingDetails.userName}</strong>,</p>
      <p>Votre réservation a été confirmée !</p>
      <h3>Détails de la réservation :</h3>
      <ul>
        <li><strong>Expérience :</strong> ${bookingDetails.experienceName}</li>
        <li><strong>Date :</strong> ${bookingDetails.date}</li>
        <li><strong>Prix :</strong> ${bookingDetails.price}</li>
        <li><strong>Numéro de réservation :</strong> ${bookingDetails.bookingId}</li>
      </ul>
      <p>Cordialement,<br/>L'équipe Locotrip</p>
    `;

    return this.sendEmail(to, subject, text, html);
  }

  /**
   * Envoie un email de notification
   */
  async sendNotificationEmail(to: string, title: string, message: string) {
    const subject = `Notification Locotrip - ${title}`;
    const text = `Bonjour,\n\n${message}\n\nCordialement,\nL'équipe Locotrip`;
    const html = `
      <h2>${title}</h2>
      <p>Bonjour,</p>
      <p>${message}</p>
      <p>Cordialement,<br/>L'équipe Locotrip</p>
    `;

    return this.sendEmail(to, subject, text, html);
  }

  /**
   * Envoie un email pour un nouveau message
   */
  async sendNewMessageEmail(
    to: string,
    details: {
      senderName: string;
      messageContent: string;
      timestamp: string;
    },
  ) {
    const subject = `Nouveau message de ${details.senderName}`;
    const text = `Bonjour,\n\nVous avez reçu un nouveau message de ${details.senderName} à ${details.timestamp}.\n\nMessage :\n${details.messageContent}\n\nConnectez-vous à Locotrip pour répondre.\n\nCordialement,\nL'équipe Locotrip`;
    const html = `
      <h2>Nouveau message</h2>
      <p>Bonjour,</p>
      <p>Vous avez reçu un nouveau message de <strong>${details.senderName}</strong> à <strong>${details.timestamp}</strong>.</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #327A78; margin: 20px 0;">
        <p style="font-style: italic; margin: 0;">"${details.messageContent}"</p>
      </div>
      <p><a href="${process.env.FRONTEND_URL || 'https://www.loco-trip.com'}/me/messages" style="background-color: #327A78; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Voir le message</a></p>
      <p>Cordialement,<br/>L'équipe Locotrip</p>
    `;

    return this.sendEmail(to, subject, text, html);
  }

  /**
   * Envoie un email de confirmation d'annulation de réservation
   */
  async sendBookingCancelledEmail(
    to: string,
    bookingDetails: {
      userName: string;
      experienceName: string;
      date: string;
      bookingId: string;
    },
  ) {
    const subject = `Annulation de réservation - ${bookingDetails.experienceName}`;
    const text = `Bonjour ${bookingDetails.userName},\n\nVotre réservation pour l'expérience "${bookingDetails.experienceName}" prévue le ${bookingDetails.date} a été annulée.\n\nNuméro de réservation : ${bookingDetails.bookingId}\n\nSi vous avez des questions, n'hésitez pas à nous contacter.\n\nCordialement,\nL'équipe Locotrip`;
    const html = `
      <h2>Annulation de réservation</h2>
      <p>Bonjour <strong>${bookingDetails.userName}</strong>,</p>
      <p>Votre réservation pour l'expérience "<strong>${bookingDetails.experienceName}</strong>" prévue le <strong>${bookingDetails.date}</strong> a été annulée.</p>
      <p><strong>Numéro de réservation :</strong> ${bookingDetails.bookingId}</p>
      <p>Si vous avez des questions, n'hésitez pas à nous contacter.</p>
      <p>Cordialement,<br/>L'équipe Locotrip</p>
    `;

    return this.sendEmail(to, subject, text, html);
  }

  /**
   * Envoie un email de notification de nouvelle réservation pour le guide
   */
  async sendNewBookingForGuideEmail(
    to: string,
    bookingDetails: {
      guideName: string;
      clientName: string;
      experienceName: string;
      date: string;
      bookingId: string;
    },
  ) {
    const subject = `Nouvelle réservation reçue - ${bookingDetails.experienceName}`;
    const text = `Bonjour ${bookingDetails.guideName},\n\nBonne nouvelle ! Vous avez reçu une nouvelle réservation pour votre expérience "${bookingDetails.experienceName}".\n\nDétails de la réservation :\n- Client : ${bookingDetails.clientName}\n- Date : ${bookingDetails.date}\n- Numéro de réservation : ${bookingDetails.bookingId}\n\nVous pouvez consulter les détails dans votre espace guide.\n\nCordialement,\nL'équipe Locotrip`;
    const html = `
      <h2>Nouvelle réservation reçue !</h2>
      <p>Bonjour <strong>${bookingDetails.guideName}</strong>,</p>
      <p>Bonne nouvelle ! Vous avez reçu une nouvelle réservation pour votre expérience "<strong>${bookingDetails.experienceName}</strong>".</p>
      <h3>Détails de la réservation :</h3>
      <ul>
        <li><strong>Client :</strong> ${bookingDetails.clientName}</li>
        <li><strong>Date :</strong> ${bookingDetails.date}</li>
        <li><strong>Numéro de réservation :</strong> ${bookingDetails.bookingId}</li>
      </ul>
      <p><a href="${process.env.FRONTEND_URL || 'https://www.loco-trip.com'}/me/experiences" style="background-color: #327A78; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Gérer mes réservations</a></p>
      <p>Cordialement,<br/>L'équipe Locotrip</p>
    `;

    return this.sendEmail(to, subject, text, html);
  }

  /**
   * Envoie un email de notification quand un nouveau commentaire est laissé sur une expérience
   */
  async sendNewReviewEmail(
    to: string,
    details: {
      clientName: string;
      rating: number;
      comment: string;
      experienceName: string;
    },
  ) {
    const starRating = '⭐️'.repeat(details.rating) + '☆'.repeat(5 - details.rating);
    const subject = `Nouvel avis sur votre expérience - ${details.experienceName}`;
    const text = `Bonjour,\n\nVous avez reçu un nouvel avis de la part de ${details.clientName} pour votre expérience "${details.experienceName}".\n\nNote : ${details.rating}/5\nCommentaire : ${details.comment}\n\nConnectez-vous à Locotrip pour gérer vos avis.\n\nCordialement,\nL'équipe Locotrip`;
    const html = `
      <h2>Nouvel avis reçu !</h2>
      <p>Bonjour,</p>
      <p>Vous avez reçu un nouvel avis de la part de <strong>${details.clientName}</strong> pour votre expérience "<strong>${details.experienceName}</strong>".</p>
      <div style="background-color: #f9f9f9; padding: 15px; border-left: 4px solid #327A78; margin: 20px 0;">
        <p style="font-size: 18px; margin-top: 0;"><strong>Note :</strong> ${starRating} (${details.rating}/5)</p>
        <p style="font-style: italic; margin-bottom: 0;">"${details.comment || 'Aucun commentaire'}"</p>
      </div>
      <p><a href="${process.env.FRONTEND_URL || 'https://www.loco-trip.com'}/me/experiences" style="background-color: #327A78; color: white; padding: 12px 20px; text-decoration: none; border-radius: 4px; display: inline-block;">Voir mes expériences</a></p>
      <p>Cordialement,<br/>L'équipe Locotrip</p>
    `;

    return this.sendEmail(to, subject, text, html);
  }
}
