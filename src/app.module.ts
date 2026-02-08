import { Module } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config'; // Нэмэх
import { TypeOrmModule } from '@nestjs/typeorm'; // Нэмэх
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './modules/auth/auth.module';
import { UsersModule } from './modules/users/users.module';
import { HazardsModule } from './modules/hazards/hazards.module';
import { AuditLogsModule } from './modules/audit-logs/audit-logs.module';
import { User } from './modules/users/entities/user.entity'; // Entity-гээ импортлох
import { Hazard } from './modules/hazards/entities/hazard.entity';

@Module({
  imports: [
    // 1. .env файлыг уншиж эхлүүлэх
    ConfigModule.forRoot({
      isGlobal: true, 
    }),

    // 2. TypeORM холболт
    TypeOrmModule.forRootAsync({
      imports: [ConfigModule],
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => ({
        type: 'postgres',
        host: configService.get<string>('DB_HOST'),
        port: configService.get<number>('DB_PORT'),
        username: configService.get<string>('DB_USERNAME'),
        password: configService.get<string>('DB_PASSWORD'),
        database: configService.get<string>('DB_NAME'),
        entities: [User, Hazard], // Энд бүх Entity-үүдээ нэмнэ (Hazard г.м)
        synchronize: true, // Хөгжүүлэлтийн үед true, Production-д false!
      }),
    }),

    AuthModule,
    UsersModule,
    HazardsModule,
    AuditLogsModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}