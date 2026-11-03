import { Injectable, Logger } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { PassportStrategy } from '@nestjs/passport';
import { Strategy, Profile, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  private readonly logger = new Logger(GoogleStrategy.name);

  constructor(private readonly configService: ConfigService) {
    const clientID = configService.get<string>('GOOGLE_CLIENT_ID') || 'DUMMY_CLIENT_ID';
    const clientSecret = configService.get<string>('GOOGLE_CLIENT_SECRET') || 'DUMMY_CLIENT_SECRET';
    const callbackURL =
      configService.get<string>('GOOGLE_CALLBACK_URL') ||
      'http://localhost:4000/api/auth/google/callback';

    super({
      clientID,
      clientSecret,
      callbackURL,
      scope: ['email', 'profile'],
    });

    if (clientID === 'DUMMY_CLIENT_ID') {
      this.logger.warn(
        'Google OAuth 2.0 is running with placeholder credentials. Configure GOOGLE_CLIENT_ID and GOOGLE_CLIENT_SECRET in server/.env for production OAuth.',
      );
    }
  }

  async validate(
    accessToken: string,
    refreshToken: string,
    profile: Profile,
    done: VerifyCallback,
  ): Promise<any> {
    const { id, name, emails, photos } = profile;
    const user = {
      provider: 'google',
      providerAccountId: id,
      email: emails?.[0]?.value,
      firstName: name?.givenName,
      lastName: name?.familyName,
      displayName: profile.displayName || name?.givenName || 'Contender',
      avatar: photos?.[0]?.value,
      accessToken,
      refreshToken,
    };
    done(null, user);
  }
}

