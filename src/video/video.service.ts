import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import * as twilio from 'twilio';

@Injectable()
export class VideoService {
  private readonly accountSid: string;
  private readonly apiKey: string;
  private readonly apiSecret: string;

  constructor(private readonly configService: ConfigService) {
    this.accountSid = this.configService.get<string>('TWILIO_ACCOUNT_SID', '');
    this.apiKey = this.configService.get<string>('TWILIO_API_KEY', '');
    this.apiSecret = this.configService.get<string>('TWILIO_API_SECRET', '');
  }

  generateToken(identity: string, room: string): string {
    const AccessToken = twilio.jwt.AccessToken;
    const VideoGrant = AccessToken.VideoGrant;

    const token = new AccessToken(
      this.accountSid,
      this.apiKey,
      this.apiSecret,
      { identity },
    );

    const videoGrant = new VideoGrant({ room });
    token.addGrant(videoGrant);

    return token.toJwt();
  }
}
