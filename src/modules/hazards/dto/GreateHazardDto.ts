import { IsEnum, IsNotEmpty, IsString, IsOptional } from 'class-validator';
import { HazardType, HazardImpact, HazardLevel, HazardMainType } from '../entities/hazard.entity';

export class CreateHazardDto {
  @IsNotEmpty({ message: 'Байршил заавал байх ёстой' })
  @IsString()
  location: string;

  @IsNotEmpty({ message: 'Аюулын төрөл заавал байх ёстой' })
  @IsEnum(HazardType, { message: 'Аюулын төрөл буруу байна' })
  type: HazardType;

  @IsNotEmpty({ message: 'Тайлбар заавал байх ёстой' })
  @IsString()
  description: string;

  @IsNotEmpty({ message: 'Нөлөөлөл заавал байх ёстой' })
  @IsEnum(HazardImpact, { message: 'Нөлөөллийн утга буруу байна' })
  impact: HazardImpact;

  @IsNotEmpty({ message: 'Түвшин заавал байх ёстой' })
  @IsEnum(HazardLevel, { message: 'Аюулын түвшин буруу байна' })
  level: HazardLevel;

  @IsNotEmpty({ message: 'Төрөл заавал байх ёстой' })
  @IsEnum(HazardMainType, { message: 'Төрөл буруу байна' })
  main_type: HazardMainType;

  @IsOptional()
  @IsString()
  image?: string;
}
