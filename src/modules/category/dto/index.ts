import { IsString, IsOptional } from "class-validator"

export class CreateCategoryDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string
}

export class UpdateCategoryDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string
}

export class CreateSubCategoryDto {
  @IsString()
  name: string

  @IsOptional()
  @IsString()
  description?: string

  @IsString()
  categoryId: string
}

export class UpdateSubCategoryDto {
  @IsOptional()
  @IsString()
  name?: string

  @IsOptional()
  @IsString()
  description?: string

  @IsOptional()
  @IsString()
  categoryId?: string
}
