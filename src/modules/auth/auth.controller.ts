import { Body, Controller, Post, Res, SetMetadata } from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import {
  AdminRegisterDto,
  AdminLoginDto,
  UserRegisterDto,
  UserLoginDto,
} from './dto';

@Controller('auth')
@SetMetadata('isPublic', true)
export class AuthController {
  constructor(private authService: AuthService) {}

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
