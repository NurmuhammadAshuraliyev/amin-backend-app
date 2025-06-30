import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseGuards,
  SetMetadata,
  Req,
} from '@nestjs/common';
import { Request } from 'express';
import { ReviewService } from './review.service';
import {
  CreateReviewDto,
  UpdateReviewDto,
  ReviewQueryDto,
  RespondToReviewDto,
} from './dto';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('reviews')
export class ReviewController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['user'])
  async create(@Body() createReviewDto: CreateReviewDto, @Req() req: Request) {
    return await this.reviewService.create(req['userId'], createReviewDto);
  }

  @Get()
  async findAll(@Query() query: ReviewQueryDto) {
    return await this.reviewService.findAll(query);
  }

  @Get('my-reviews')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['user'])
  async getUserReviews(@Query() query: ReviewQueryDto, @Req() req: Request) {
    return await this.reviewService.getUserReviews(req['userId'], query);
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.reviewService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['user'])
  async update(
    @Param('id') id: string,
    @Body() updateReviewDto: UpdateReviewDto,
    @Req() req: Request,
  ) {
    return await this.reviewService.update(id, req['userId'], updateReviewDto);
  }

  @Patch(':id/respond')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async respondToReview(
    @Param('id') id: string,
    @Body() respondDto: RespondToReviewDto,
  ) {
    return await this.reviewService.respondToReview(id, respondDto);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['user'])
  async removeByUser(@Param('id') id: string, @Req() req: Request) {
    return await this.reviewService.remove(id, req['userId']);
  }

  @Delete(':id/admin')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async removeByAdmin(@Param('id') id: string) {
    return await this.reviewService.remove(id);
  }
}
