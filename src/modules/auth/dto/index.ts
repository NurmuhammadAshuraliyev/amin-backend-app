import { Optional } from '@nestjs/common';
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
  @Optional()
  phone: string;

  @IsString()
  @Optional()
  fullName: string;

  @IsEmail()
  @IsString()
  email: string;

  @IsString()
  @Optional()
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
