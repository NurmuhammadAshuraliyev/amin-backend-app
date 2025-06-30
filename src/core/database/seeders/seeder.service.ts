import { Injectable, Logger, OnModuleInit } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { ConfigService } from '@nestjs/config';
import bcrypt from 'bcrypt';

@Injectable()
export class SeederService implements OnModuleInit {
  private readonly logger: Logger;
  constructor(
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
  ) {
    this.logger = new Logger(SeederService.name);
  }

  async sendAll() {
    await this.sendUsers();
  }

  async sendUsers() {
    this.logger.log('Admin seedr started');

    const password = this.configService.get('SUPERADMIN_PASSWORD') as string;

    const phone_number = this.configService.get(
      'SUPERADMIN_PHONE_NUMBER',
    ) as string;

    const role = 'SUPERADMIN';

    const findUsername = await this.prisma.admin.findUnique({
      where: {
        phone: phone_number,
      },
    });

    const hashPassword = await bcrypt.hash(password, 12);

    if (!findUsername) {
      await this.prisma.admin.create({
        data: {
          password: hashPassword,
          phone: phone_number,
          firstName: 'Sotvoldi',
          lastName: 'Sotvoldiyev',
          role: 'superadmin',
        },
      });

      this.logger.log('Admin seedrs ended');
    }

    return true;
  }

  async onModuleInit() {
    try {
      await this.sendAll();
    } catch (error) {
      this.logger.error(error.message);
    }
  }
}
