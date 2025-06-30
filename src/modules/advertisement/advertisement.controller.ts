import {
  Controller,
  Get,
  Post,
  Patch,
  Param,
  Delete,
  UseGuards,
  Body,
  SetMetadata,
  Query,
} from '@nestjs/common';
import { AdvertisementService } from './advertisement.service';
import {
  CreateAdvertisementDto,
  UpdateAdvertisementDto,
  AdvertisementQueryDto,
} from './dto';
import { RoleGuard } from 'src/core/guards/role.guard';

@Controller('advertisements')
export class AdvertisementController {
  constructor(private readonly advertisementService: AdvertisementService) {}

  @Post()
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async create(@Body() createAdvertisementDto: CreateAdvertisementDto) {
    return await this.advertisementService.create(createAdvertisementDto);
  }

  @Get()
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async findAll(@Query() query: AdvertisementQueryDto) {
    return await this.advertisementService.findAll(query);
  }

  @Get('active')
  async getActiveAds() {
    return await this.advertisementService.getActiveAds();
  }

  @Get(':id')
  async findOne(@Param('id') id: string) {
    return await this.advertisementService.findOne(id);
  }

  @Patch(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async update(
    @Param('id') id: string,
    @Body() updateAdvertisementDto: UpdateAdvertisementDto,
  ) {
    return await this.advertisementService.update(id, updateAdvertisementDto);
  }

  @Patch(':id/view')
  async incrementView(@Param('id') id: string) {
    return await this.advertisementService.incrementView(id);
  }

  @Patch(':id/click')
  async incrementClick(@Param('id') id: string) {
    return await this.advertisementService.incrementClick(id);
  }

  @Delete(':id')
  @UseGuards(RoleGuard)
  @SetMetadata('role', ['admin'])
  async remove(@Param('id') id: string) {
    return await this.advertisementService.remove(id);
  }
}
