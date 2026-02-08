import { IsNotEmpty, IsString } from 'class-validator';

export class LoginDto {
  @IsNotEmpty({ message: 'Хэрэглэгчийн нэр заавал байх ёстой' })
  @IsString()
  user_id: string;

  @IsNotEmpty({ message: 'Нууц үг заавал байх ёстой' })
  @IsString()
  password: string;
}