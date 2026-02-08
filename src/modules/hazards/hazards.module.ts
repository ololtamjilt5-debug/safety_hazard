import { Module } from '@nestjs/common';
import { HazardsController } from './hazards.controller';
import { HazardsService } from './hazards.service';
import { TypeOrmModule } from '@nestjs/typeorm'; // Нэмэх
import { Hazard } from './entities/hazard.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hazard])],
  providers: [HazardsService],
  controllers: [HazardsController],
})
export class HazardsModule {}
