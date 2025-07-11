import { Role } from '@prisma/client';
import { IsString, MinLength, IsEmail, IsEnum } from 'class-validator';

export class AdminRegisterDto {
  @IsString()
  firstName: string;

  @IsString()
  lastName: string;

  @IsString()
  phone: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class AdminLoginDto {
  @IsString()
  email: string;

  @IsString()
  password: string;
}

export class UserRegisterDto {
  @IsString()
  phone: string;

  @IsString()
  fullName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;
}

export class UserLoginDto {
  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  password: string;
}
