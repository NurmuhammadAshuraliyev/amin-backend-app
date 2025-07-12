import {
  Body,
  Controller,
  Get,
  Post,
  Req,
  Res,
  SetMetadata,
  UseGuards,
} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Request, Response } from 'express';
import {
  AdminRegisterDto,
  AdminLoginDto,
  UserRegisterDto,
  UserLoginDto,
} from './dto';
import { AuthGuard } from '@nestjs/passport';

@Controller('auth')
@SetMetadata('isPublic', true)
export class AuthController {
  constructor(private authService: AuthService) {}

  @Get('google')
  @UseGuards(AuthGuard('google'))
  googleAuthRedirect() {}

  @Get('google/callback')
  @UseGuards(AuthGuard('google'))
  async googleCallback(@Req() req: Request) {
    const user = req['user'];
    return await this.authService.oauthGoogleCallback(user);
  }

  @Get('github')
  @UseGuards(AuthGuard('github'))
  githubAuthRedirect() {}

  @Get('github/callback')
  @UseGuards(AuthGuard('github'))
  async githubCallback(@Req() req: Request) {
    const user = req['user'];
    return await this.authService.oauthGithubCallback(user);
  }

  @Post('admin/register')
  async adminRegister(@Body() dto: AdminRegisterDto) {
    const { access_token, admin } = await this.authService.adminRegister(dto);

    return {
      access_token,
      admin,
    };
  }

  @Post('admin/login')
  async adminLogin(@Body() dto: AdminLoginDto) {
    const { access_token, admin } = await this.authService.adminLogin(dto);

    return {
      access_token,
      admin,
    };
  }

  @Post('user/register')
  async userRegister(@Body() dto: UserRegisterDto) {
    const { access_token, user } = await this.authService.userRegister(dto);

    return {
      access_token,
      user,
    };
  }

  @Post('user/login')
  async userLogin(@Body() dto: UserLoginDto) {
    const { access_token, user } = await this.authService.userLogin(dto);

    return {
      access_token,
      user,
    };
  }
}
