import {
  Injectable,
  UnauthorizedException,
  ConflictException,
  BadRequestException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import bcrypt from 'bcrypt';
import type {
  AdminRegisterDto,
  AdminLoginDto,
  UserRegisterDto,
  UserLoginDto,
} from './dto';
import { PrismaService } from 'src/core/database/prisma.service';

@Injectable()
export class AuthService {
  constructor(
    private prisma: PrismaService,
    private jwtService: JwtService,
  ) {}

  async oauthGoogleCallback(user: any) {
    const findUser = await this.prisma.user.findFirst({
      where: { email: user.email },
      include: { accounts: true },
    });

    if (!findUser) {
      const userData = await this.prisma.user.create({
        data: {
          email: user.email,
          fullName: user.name,
        },
      });

      await this.prisma.oAuthAccount.create({
        data: {
          provider: 'google',
          provider_id: user.sub,
          user_id: userData.id,
        },
      });

      const token = await this.jwtService.signAsync({ userId: userData.id });

      return { token };
    }

    const findAccount = findUser?.accounts.find(
      (account) => account.provider === 'google',
    );

    if (!findAccount) {
      await this.prisma.oAuthAccount.create({
        data: {
          provider: 'github',
          provider_id: user.sub,
          user_id: findUser?.id as string,
        },
      });
    }

    const token = await this.jwtService.signAsync({ userId: findUser.id });

    return { token };
  }

  async oauthGithubCallback(user: any) {
    const findUser = await this.prisma.user.findFirst({
      where: { email: user.email },
      include: { accounts: true },
    });

    if (!findUser) {
      const userData = await this.prisma.user.create({
        data: {
          email: user.email,
          fullName: user.name,
        },
      });

      await this.prisma.oAuthAccount.create({
        data: {
          provider: 'github',
          provider_id: user.id,
          user_id: userData.id,
        },
      });

      const token = await this.jwtService.signAsync({ userId: userData.id });

      return { token };
    }

    const findAccount = findUser?.accounts.find(
      (account) => account.provider === 'github',
    );

    if (!findAccount) {
      await this.prisma.oAuthAccount.create({
        data: {
          provider: 'github',
          provider_id: user.id,
          user_id: findUser?.id as string,
        },
      });
    }

    const token = await this.jwtService.signAsync({ userId: findUser.id });

    return { token };
  }

  async adminRegister(dto: AdminRegisterDto) {
    const existingAdmin = await this.prisma.admin.findFirst({
      where: {
        OR: [{ phone: dto.phone }, { email: dto.email }],
      },
    });

    if (existingAdmin) {
      throw new ConflictException(
        'Admin with this phone or email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const admin = await this.prisma.admin.create({
      data: {
        firstName: dto.firstName,
        lastName: dto.lastName,
        phone: dto.phone,
        email: dto.email,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({
      userId: admin.id,
      role: admin.role,
    });

    return {
      access_token: token,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        phone: admin.phone,
        email: admin.email,
      },
    };
  }

  async adminLogin(dto: AdminLoginDto) {
    const admin = await this.prisma.admin.findFirst({
      where: {
        email: dto.email,
      },
    });

    if (!admin?.password) throw new BadRequestException('password not set');

    if (!admin || !(await bcrypt.compare(dto.password, admin.password))) {
      throw new UnauthorizedException('Invalid password or email');
    }

    const token = this.jwtService.sign({
      userId: admin.id,
      role: admin.role,
    });

    return {
      access_token: token,
      admin: {
        id: admin.id,
        firstName: admin.firstName,
        lastName: admin.lastName,
        phone: admin.phone,
        email: admin.email,
      },
    };
  }

  async userRegister(dto: UserRegisterDto) {
    const existingAdmin = await this.prisma.user.findFirst({
      where: {
        OR: [{ phone: dto.phone }, { email: dto.email }],
      },
    });

    if (existingAdmin) {
      throw new ConflictException(
        'User with this phone or email already exists',
      );
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        fullName: dto.fullName,
        email: dto.email,
        password: hashedPassword,
      },
    });

    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
      },
    };
  }

  async userLogin(dto: UserLoginDto) {
    const user = await this.prisma.user.findFirst({
      where: { email: dto.email },
    });

    if (!user?.password) throw new BadRequestException('password not set');

    if (!user || !(await bcrypt.compare(dto.password, user.password!))) {
      throw new UnauthorizedException('Invalid password or email ');
    }

    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        fullName: user.fullName,
        phone: user.phone,
        email: user.email,
      },
    };
  }
}
