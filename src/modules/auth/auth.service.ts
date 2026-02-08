import { Injectable, UnauthorizedException } from '@nestjs/common';
import { UsersService } from '../users/users.service';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async login(user_id: string, pass: string) {
    const user = await this.usersService.findOneByUsername(user_id);
    
    // Нууц үг шалгах
    if (user && (await bcrypt.compare(pass, user.password))) {
      const payload = { sub: user.id, username: user.user_id, level: user.user_level };
      return {
        access_token: this.jwtService.sign(payload),
        user: {
          first_name: user.first_name,
          last_name: user.last_name,
          level: user.user_level
        }
      };
    }
    throw new UnauthorizedException('Нэвтрэх нэр эсвэл нууц үг буруу байна');
  }
}