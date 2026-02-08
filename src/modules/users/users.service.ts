import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

 async create(userData: Partial<User>): Promise<User> {
  // 1. Нууц үг ирсэн эсэхийг шалгах
  if (!userData.password) {
    throw new Error('Password is required'); 
    // Эсвэл NestJS-ийн BadRequestException ашиглаж болно
  }

  // 2. Нууц үгийг hash-лах
  const salt = await bcrypt.genSalt();
  // Энд TypeScript password-ийг string байна гэдэгт итгэлтэй болно
  const hashedPassword = await bcrypt.hash(userData.password, salt);

  // 3. Шинэ хэрэглэгч үүсгэх
  const newUser = this.usersRepository.create({
    ...userData,
    password: hashedPassword,
  });

  return this.usersRepository.save(newUser);
}

  async findOneByUsername(user_id: string): Promise<User | null> {
  return this.usersRepository.findOne({ where: { user_id } });
}
}