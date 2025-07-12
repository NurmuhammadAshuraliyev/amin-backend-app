import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-google-oauth20';
import { VerifiedCallback } from 'passport-jwt';

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
    refresh_token: string,
    profile: Profile,
    veriyfyCallback: VerifiedCallback,
  ): any {
    const user = profile._json;

    veriyfyCallback(null, user);
  }
}
