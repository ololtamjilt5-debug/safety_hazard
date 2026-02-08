import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Hazard } from './entities/hazard.entity';
import { CreateHazardDto } from './dto/GreateHazardDto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HazardsService {
  constructor(
    @InjectRepository(Hazard)
    private hazardsRepository: Repository<Hazard>,
  ) {}

  async create(createHazardDto: CreateHazardDto, user: any) {
    const newHazard = this.hazardsRepository.create({
      ...createHazardDto,
      reporter: { id: user.userId } as User, // Токеноос ирсэн userId-г холбож байна
      modified: 'initial report', // Entity дээр чинь modified талбар NOT NULL тул утга өглөө
    });
    
    return this.hazardsRepository.save(newHazard);
  }

  async findAll() {
    return this.hazardsRepository.find({
      relations: ['reporter'], // Мэдээлсэн хэрэглэгчийн мэдээллийг хамт татах
      order: { created_at: 'DESC' },
    });
  }
}