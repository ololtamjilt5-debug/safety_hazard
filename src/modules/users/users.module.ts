import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';

@Module({
  imports: [TypeOrmModule.forFeature([User])], // Repository-г энд бүртгэнэ
  providers: [UsersService],
  controllers: [UsersController],
  exports: [UsersService], // AuthModule-д ашиглах учраас export хийнэ
})
export class UsersModule {}