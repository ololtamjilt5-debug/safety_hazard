import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HazardsService } from './hazards.service';
import { HazardsController } from './hazards.controller';
import { Hazard } from './entities/hazard.entity';
import { User } from '../users/entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Hazard, User])],
  controllers: [HazardsController],
  providers: [HazardsService],
  exports: [HazardsService], // Хэрэв бусад модульд ашиглах бол
})
export class HazardsModule {}
