import { Injectable, Logger } from '@nestjs/common';
import { MailgunService } from 'nestjs-mailgun';

@Injectable()
export class MailService {
  private readonly logger = new Logger(MailService.name);
  private readonly fromEmail: string;
  private readonly domain: string;

  constructor(private readonly mailgunService: MailgunService) {
    this.fromEmail = process.env.FROM_EMAIL || 'noreply@loco-trip.com';
    this.domain = process.env.MAILGUN_DOMAIN || process.env.MAILGUN_SANDBOX_DOMAIN || '';
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
    const resetUrl = `${process.env.FRONTEND_URL || 'https://loco-trip.com'}/reset-password?token=${resetToken}`;
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
  async sendBookingConfirmationEmail(to: string, bookingDetails: {
    userName: string;
    experienceName: string;
    date: string;
    price: string;
    bookingId: string;
  }) {
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
}
