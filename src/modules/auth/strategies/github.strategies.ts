import { Injectable } from '@nestjs/common';
import { PassportStrategy } from '@nestjs/passport';
import { Profile, Strategy } from 'passport-github2';

@Injectable()
export class GithubStrategy extends PassportStrategy(Strategy, 'github') {
  constructor() {
    super({
      clientID: process.env.CLIENT_ID_GITHUB as string,
      clientSecret: process.env.CLIENT_SECRET_GITHUB as string,
      callbackURL: process.env.CALLBACK_URL_GITHUB as string,
      scope: ['user:email', 'profile'],
    });
  }

  validate(
    access_token: string,
    refresh_token: string,
    profile: Profile,
    callback: any,
  ): void {
    callback(null, profile);
  }
}
