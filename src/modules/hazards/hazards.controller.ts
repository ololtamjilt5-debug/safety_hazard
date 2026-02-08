import { Controller, Post, Body, UseGuards, Request, Get } from '@nestjs/common';
import { HazardsService } from './hazards.service';
import { CreateHazardDto } from './dto/GreateHazardDto';
import { AuthGuard } from '@nestjs/passport';

@Controller('hazards')
export class HazardsController {
  constructor(private readonly hazardsService: HazardsService) {}

  @UseGuards(AuthGuard('jwt')) // Заавал токен шаардана
  @Post()
  async create(@Body() createHazardDto: CreateHazardDto, @Request() req) {
    // req.user нь JwtStrategy-аас ирж байгаа
    return this.hazardsService.create(createHazardDto, req.user);
  }

  @Get()
  async findAll() {
    return this.hazardsService.findAll();
  }
}