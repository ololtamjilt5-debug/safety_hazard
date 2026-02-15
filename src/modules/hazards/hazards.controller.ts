import {
  Controller,
  Post,
  Get,
  Patch,
  Body,
  UseGuards,
  Request,
  Param,
  Query,
  UseInterceptors,
  UploadedFile,
} from '@nestjs/common';
import { HazardsService } from './hazards.service';
import { CreateHazardDto } from './dto/GreateHazardDto';
import { AuthGuard } from '@nestjs/passport';
import { HazardStatus } from './entities/hazard.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { FileInterceptor } from '@nestjs/platform-express';
import { CloudinaryService } from 'src/common/cloudinary/cloudinary.service';

@Controller('hazards')
export class HazardsController {
  constructor(
    private readonly hazardsService: HazardsService,
    private readonly cloudinaryService: CloudinaryService,
  ) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  @UseInterceptors(FileInterceptor('image')) // Storage тохиргоогүй бол шууд санах ойд авна
  async create(
    @UploadedFile() file: Express.Multer.File,
    @Body() createHazardDto: CreateHazardDto,
    @Request() req,
  ) {
    let imageUrl = undefined;

    if (file) {
      // Cloudinary руу хуулах
      const uploadRes = await this.cloudinaryService.uploadImage(file);
      imageUrl = uploadRes.secure_url; // Cloudinary-гаас ирсэн зургийн URL
    }

    return this.hazardsService.create(createHazardDto, req.user, imageUrl);
  }

  @UseGuards(AuthGuard('jwt')) // Заавал нэвтэрсэн байх ёстой
  @Get('my')
  async findMyDashboard(
    @Request() req,
    @Query('status') status?: HazardStatus,
    @Query('range') range?: string,
  ) {
    // req.user.userId нь таны JwtStrategy-аас ирж буй утга
    return this.hazardsService.getMyDashboardData(req.user.userId, status, range);
  }

  @Get()
  async findAll(
    @Query('status') status?: HazardStatus,
    @Query('range') range: string = '1y', // Default утга
  ) {
    return this.hazardsService.getDashboardData(status, range);
  }

  // 2. Параметртэй Get-үүд үргэлж хамгийн доор байна
  @Get(':id')
  async findOne(@Param('id') id: number) {
    return this.hazardsService.findOne(id);
  }

  @UseGuards(AuthGuard('jwt'), RolesGuard)
  @Roles(3)
  @Patch(':id/status')
  async updateStatus(@Param('id') id: number, @Body('status') status: HazardStatus) {
    return this.hazardsService.updateStatus(id, status);
  }
}
