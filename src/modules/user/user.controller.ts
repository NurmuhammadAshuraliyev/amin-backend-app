import {
  Controller,
  Get,
  Patch,
  Body,
  UseGuards,
  Req,
  SetMetadata,
} from '@nestjs/common';
import { Request } from 'express';
import { UserService } from './user.service';
import { UpdateUserDto } from './dto';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('user')
@UseGuards(RoleGuard)
@SetMetadata('role', ['user'])
export class UserController {
  constructor(private readonly userService: UserService) {}

  @Get('profile')
  async getProfile(@Req() req: Request) {
    return await this.userService.findProfile(req['userId']);
  }

  @Patch('profile')
  async updateProfile(
    @Req() req: Request,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    return await this.userService.updateProfile(req['userId'], updateUserDto);
  }
}
