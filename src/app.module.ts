import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { TypeOrmModule } from '@nestjs/typeorm';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HazardsModule } from './modules/hazards/hazards.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { CloudinaryModule } from './common/cloudinary/cloudinary.module'; // Cloudinary нэмэх
import { User } from './modules/users/entities/user.entity';
import { Hazard } from './modules/hazards/entities/hazard.entity';

@Module({
  imports: [
    // 1. .env файлыг унших
    ConfigModule.forRoot({
      isGlobal: true,
    }),

    // 2. TypeORM холболт (Render.com-д зориулсан SSL болон URL тохиргоо)
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        // Render танд Internal эсвэл External Database URL өгөх тул 'url' ашиглах нь хамгийн найдвартай
        url: configService.get<string>('DATABASE_URL'),
        entities: [User, Hazard],
        // Synchronize-ийг Production дээр false болгохыг зөвлөдөг ч
        // анхны deploy-д entity-үүдээ үүсгэхийн тулд түр true үлдээж болно.
        synchronize: true,

        // Render-ийн Postgres-д заавал шаардлагатай SSL тохиргоо
        ssl:
          configService.get<string>('NODE_ENV') === 'production'
            ? { rejectUnauthorized: false }
            : false,
        extra:
          configService.get<string>('NODE_ENV') === 'production'
            ? { ssl: { rejectUnauthorized: false } }
            : {},
      }),
    }),

    AuthModule,
    UsersModule,
    HazardsModule,
    AuditLogsModule,
    CloudinaryModule, // Cloudinary-г энд нээж өгнө
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
