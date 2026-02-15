import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { HazardsService } from './hazards.service';
import { HazardsController } from './hazards.controller';
import { Hazard } from './entities/hazard.entity';
import { User } from '../users/entities/user.entity';
import { CloudinaryModule } from 'src/common/cloudinary/cloudinary.module';

@Module({
  imports: [TypeOrmModule.forFeature([Hazard, User]), CloudinaryModule],
  controllers: [HazardsController],
  providers: [HazardsService],
  exports: [HazardsService], // Хэрэв бусад модульд ашиглах бол
})
export class HazardsModule {}
