import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config'; // ConfigService нэмэх

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(private configService: ConfigService) {
    // Inject хийх
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      // .env файлаас JWT_SECRET-ийг унших
      secretOrKey: configService.get<string>('JWT_SECRET')!,
    });
  }

  async validate(payload: any) {
    // Таны өмнөх асуудал (reporterId null байсан) эндээс шалтгаалж байсан бол:
    // Хэрэв бааз чинь 'id' хүлээж авдаг бол 'id: payload.sub' гэж нэмж өгөх нь найдвартай
    return {
      id: payload.sub, // TypeORM-д зориулж id-г нэмэв
      userId: payload.sub,
      username: payload.username,
      level: payload.level,
    };
  }
}
