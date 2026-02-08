import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor() {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: 'SECRET_KEY_123', // Энэ нь AuthModule-д заасантай ижил байх ёстой
    });
  }

  async validate(payload: any) {
    // Энэ функц токен хүчинтэй байвал ажиллана
    return { userId: payload.sub, username: payload.username, level: payload.level };
  }
}