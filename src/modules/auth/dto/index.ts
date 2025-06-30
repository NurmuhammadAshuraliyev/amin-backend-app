import { Role } from '@prisma/client';
import {
  IsString,
  IsOptional,
  IsPhoneNumber,
  MinLength,
  IsEmail,
  IsEnum,
} from 'class-validator';

export class AdminRegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsPhoneNumber('UZ')
  phone: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @IsString()
  @MinLength(6)
  password: string;
}

export class AdminLoginDto {
  @IsString()
  identifier: string; // phone yoki email

  @IsString()
  password: string;
}

export class UserRegisterDto {
  @IsPhoneNumber('UZ')
  phone: string;

  @IsString()
  name: string;

  @IsOptional()
  @IsEmail()
  email?: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UserLoginDto {
  @IsPhoneNumber('UZ')
  phone: string;

  @IsString()
  password: string;
}
