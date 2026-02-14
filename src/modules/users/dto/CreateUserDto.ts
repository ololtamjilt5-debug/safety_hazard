import {
  IsNotEmpty,
  IsString,
  MinLength,
  IsOptional,
  isNotEmpty,
  isInt,
  IsNumber,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
  @IsString()
  user_id: string;

  @IsNotEmpty()
  @IsString()
  @MinLength(6, { message: 'Нууц үг хамгийн багадаа 6 тэмдэгт байх ёстой' })
  password: string;

  @IsNotEmpty()
  @IsString()
  first_name: string;

  @IsNotEmpty()
  @IsString()
  last_name: string;

  @IsNotEmpty()
  @IsNumber()
  user_level: number;

  @IsOptional()
  @IsString()
  job?: string;
}
