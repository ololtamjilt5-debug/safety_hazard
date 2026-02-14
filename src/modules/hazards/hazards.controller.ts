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
} from '@nestjs/common';
import { HazardsService } from './hazards.service';
import { CreateHazardDto } from './dto/GreateHazardDto';
import { AuthGuard } from '@nestjs/passport';
import { HazardStatus } from './entities/hazard.entity';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';

@Controller('hazards')
export class HazardsController {
  constructor(private readonly hazardsService: HazardsService) {}

  @UseGuards(AuthGuard('jwt'))
  @Post('create')
  async create(@Body() createHazardDto: CreateHazardDto, @Request() req) {
    return this.hazardsService.create(createHazardDto, req.user);
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
