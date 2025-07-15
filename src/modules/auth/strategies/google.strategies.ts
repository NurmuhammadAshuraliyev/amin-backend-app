import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy, VerifyCallback } from 'passport-google-oauth20';

@Injectable()
export class GoogleStrategy extends PassportStrategy(Strategy, 'google') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID_GOOGLE as string,
      clientSecret: process.env.CLIENT_SECRET_GOOGLE as string,
      callbackURL: process.env.CALLBACK_URL_GOOGLE as string,
      scope: ['email', 'profile'],
    });
  }

  validate(
    access_token: string,
    refreshToken: string,
    profile: Profile,
    veriyfyCallback: VerifyCallback,
  ): any {
    const user = profile._json;

    veriyfyCallback(null, user);
  }
}
