import { Module } from '@nestjs/common';
import { AuthController } from './auth.controller';
import { AuthService } from './auth.service';
import { GoogleStrategy } from './strategies/google.strategies';
import { GithubStrategy } from './strategies/github.strategies';

@Module({
  controllers: [AuthController],
  providers: [AuthService, GoogleStrategy, GithubStrategy],
  exports: [AuthService, GoogleStrategy, GithubStrategy],
})
export class AuthModule {}
