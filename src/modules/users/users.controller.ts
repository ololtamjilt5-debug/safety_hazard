import { Controller, Post, Body, Get, Param } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/CreateUserDto';

@Controller('users') // API хаяг: http://localhost:3000/users
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post('register') // Эцсийн хаяг: POST /users/register
  async register(@Body() createUserDto: CreateUserDto) {
    const user = await this.usersService.create(createUserDto);
    
    // Security: Буцааж явуулахдаа нууц үгийг хасаж явуулах
    const { password, ...result } = user;
    return {
      message: 'Хэрэглэгч амжилттай бүртгэгдлээ',
      data: result,
    };
  }

  @Get(':id') // Ганц хэрэглэгч харах
  findOne(@Param('id') id: string) {
    return this.usersService.findOneByUsername(id);
  }
}