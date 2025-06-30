import { IsString, IsNumber, Min, Max, IsOptional } from "class-validator"
import { Type } from "class-transformer"

export class CreateReviewDto {
  @IsString()
  productId: string

  @IsNumber()
  @Min(1)
  @Max(5)
  rating: number

  @IsString()
  comment: string
}

export class UpdateReviewDto {
  @IsOptional()
  @IsNumber()
  @Min(1)
  @Max(5)
  rating?: number

  @IsOptional()
  @IsString()
  comment?: string
}

export class RespondToReviewDto {
  @IsString()
  response: string
}

export class ReviewQueryDto {
  @IsOptional()
  @Type(() => Number)
  page?: number

  @IsOptional()
  @Type(() => Number)
  limit?: number

  @IsOptional()
  @IsString()
  productId?: string
}
