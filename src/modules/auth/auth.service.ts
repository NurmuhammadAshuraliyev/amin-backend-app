import {
  Injectable,
  UnauthorizedException,
  ConflictException,
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
        OR: [{ phone: dto.identifier }, { email: dto.identifier }],
      },
    });

    if (!admin || !(await bcrypt.compare(dto.password, admin.password))) {
      throw new UnauthorizedException('Invalid password or phone or email');
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
    const existingUser = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (existingUser) {
      throw new ConflictException('User with this phone already exists');
    }

    const hashedPassword = await bcrypt.hash(dto.password, 12);

    const user = await this.prisma.user.create({
      data: {
        phone: dto.phone,
        name: dto.name,
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
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    };
  }

  async userLogin(dto: UserLoginDto) {
    const user = await this.prisma.user.findUnique({
      where: { phone: dto.phone },
    });

    if (!user || !(await bcrypt.compare(dto.password, user.password))) {
      throw new UnauthorizedException('Invalid password or phone ');
    }

    const token = this.jwtService.sign({
      userId: user.id,
      role: user.role,
    });

    return {
      access_token: token,
      user: {
        id: user.id,
        name: user.name,
        phone: user.phone,
        email: user.email,
      },
    };
  }
}
