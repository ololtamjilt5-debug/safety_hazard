import { IsNotEmpty, IsString, MinLength } from 'class-validator';

export class CreateHazardDto {
  @IsNotEmpty()
  @IsString()
  @MinLength(5)
  title: string;

  @IsNotEmpty()
  @IsString()
  description: string;
}