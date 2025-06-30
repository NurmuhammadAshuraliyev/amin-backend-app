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
  async adminRegister(
    @Body() dto: AdminRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, admin } = await this.authService.adminRegister(dto);

    res.cookie('token', access_token, {
      maxAge: 148.8 * 3600 * 1000,
      httpOnly: true,
    });

    return {
      access_token,
      admin,
    };
  }

  @Post('admin/login')
  async adminLogin(
    @Body() dto: AdminLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, admin } = await this.authService.adminLogin(dto);

    res.cookie('token', access_token, {
      maxAge: 148.8 * 3600 * 1000,
      httpOnly: true,
    });

    return {
      access_token,
      admin,
    };
  }

  @Post('user/register')
  async userRegister(
    @Body() dto: UserRegisterDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, user } = await this.authService.userRegister(dto);

    res.cookie('token', access_token, {
      maxAge: 148.8 * 3600 * 1000,
      httpOnly: true,
    });

    return {
      access_token,
      user,
    };
  }

  @Post('user/login')
  async userLogin(
    @Body() dto: UserLoginDto,
    @Res({ passthrough: true }) res: Response,
  ) {
    const { access_token, user } = await this.authService.userLogin(dto);

    res.cookie('token', access_token, {
      maxAge: 148.8 * 3600 * 1000,
      httpOnly: true,
    });

    return {
      access_token,
      user,
    };
  }
}
