import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, MoreThanOrEqual } from 'typeorm';
import { Hazard, HazardStatus, HazardMainType } from './entities/hazard.entity';
import { CreateHazardDto } from './dto/GreateHazardDto';
import { User } from '../users/entities/user.entity';

@Injectable()
export class HazardsService {
  constructor(
    @InjectRepository(Hazard)
    private hazardsRepository: Repository<Hazard>,
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  /**
   * Шинэ аюул бүртгэх
   */
  async create(createHazardDto: CreateHazardDto, user: any, imagePath?: string) {
    // 1. Console дээр user объект ирж байгааг, дотор нь ямар ID байгааг шалгах
    console.log('Reporter user object:', user);

    const newHazard = this.hazardsRepository.create({
      ...createHazardDto,
      // TypeORM харилцааг тодорхойлохдоо reporter: { id: user.id } гэж өгөх нь хамгийн найдвартай
      // Хэрэв таны JwtStrategy id-г 'userId' гэж дамжуулдаг бол user.userId гэж бичнэ
      reporter: { id: user.id || user.userId },
      image: imagePath,
    });

    return await this.hazardsRepository.save(newHazard);
  }

  /**
   * Бүх аюулыг харах (Мэдээлсэн хэрэглэгчийн нэртэй хамт)
   */
  async findAll(): Promise<Hazard[]> {
    return await this.hazardsRepository.find({
      relations: ['reporter'],
      order: { created_at: 'DESC' },
    });
  }

  /**
   * Нэг аюулыг ID-аар харах
   */
  async findOne(id: number): Promise<Hazard> {
    const hazard = await this.hazardsRepository.findOne({
      where: { id },
      relations: ['reporter'],
    });

    if (!hazard) {
      throw new NotFoundException(`ID: ${id} бүхий аюулын мэдээлэл олдсонгүй.`);
    }

    return hazard;
  }

  /**
   * Аюулын статусыг өөрчлөх (Батлах, Арилгасан гэж тэмдэглэх г.м)
   */
  async updateStatus(id: number, status: HazardStatus): Promise<Hazard> {
    const hazard = await this.findOne(id);

    hazard.status = status;

    // Хэрэв арилгасан (DONE) гэж тэмдэглэж байвал closed_at цагийг онооно
    if (status === HazardStatus.DONE) {
      hazard.closed_at = new Date();
    }

    return await this.hazardsRepository.save(hazard);
  }

  /**
   * Хэрэглэгч өөрийнхөө мэдээлсэн аюулуудыг харах
   */
  async findMyHazards(userId: number): Promise<Hazard[]> {
    return await this.hazardsRepository.find({
      where: { reporter: { id: userId } },
      order: { created_at: 'DESC' },
    });
  }

  async findAllByStatus(status: HazardStatus): Promise<Hazard[]> {
    console.log('Шүүж буй статус:', status); // Энд юу ирж байгааг хар

    return await this.hazardsRepository.find({
      where: { status: status }, // Баганын нэр : хайх утга
      relations: ['reporter'],
      order: { created_at: 'DESC' },
    });
  }

  async findAllByTimeRange(range: string): Promise<Hazard[]> {
    const now = new Date();
    let startDate = new Date();

    switch (range) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return this.findAll(); // Хэрэв буруу утга ирвэл бүгдийг нь буцаана
    }

    return await this.hazardsRepository.find({
      where: {
        created_at: MoreThanOrEqual(startDate),
      },
      relations: ['reporter'],
      order: { created_at: 'DESC' },
    });
  }

  async getDashboardData(status?: HazardStatus, range?: string) {
    const where: any = {};

    if (status) {
      where.status = status;
    }

    if (range) {
      const startDate = this.getStartDateFromRange(range);
      if (startDate) {
        where.created_at = MoreThanOrEqual(startDate);
      }
    }

    // 1. Шүүлтүүрт таарсан датаг татах
    const [hazards, filteredTotal] = await this.hazardsRepository.findAndCount({
      where,
      relations: ['reporter'],
      order: { created_at: 'DESC' },
    });

    // 2. Статистикийг зөвхөн ЭНЭ шүүгдсэн дата (hazards) дээр суурилж тооцоолох
    const summary = {
      total: filteredTotal, // Энэ range/status доторх нийт тоо
      byStatus: {
        'Хүлээгдэж буй': hazards.filter((h) => h.status === 'Хүлээгдэж буй').length,
        Баталсан: hazards.filter((h) => h.status === 'Баталсан').length,
        Арилгасан: hazards.filter((h) => h.status === 'Арилгасан').length,
        Цуцалсан: hazards.filter((h) => h.status === 'Цуцалсан').length,
      },
      byLevel: {
        'Маш их': hazards.filter((h) => h.level === 'Маш их').length,
        Их: hazards.filter((h) => h.level === 'Их').length,
        'Дунд зэрэг': hazards.filter((h) => h.level === 'Дунд зэрэг').length,
        Бага: hazards.filter((h) => h.level === 'Бага').length,
        'Маш бага': hazards.filter((h) => h.level === 'Маш бага').length,
      },
    };

    return {
      summary,
      data: hazards,
    };
  }

  // Хугацаа тооцоолох туслах функц
  private getStartDateFromRange(range: string): Date | null {
    const now = new Date();
    const startDate = new Date();
    switch (range) {
      case '24h':
        startDate.setHours(now.getHours() - 24);
        break;
      case '7d':
        startDate.setDate(now.getDate() - 7);
        break;
      case '1m':
        startDate.setMonth(now.getMonth() - 1);
        break;
      case 'quarter':
        startDate.setMonth(now.getMonth() - 3);
        break;
      case '1y':
        startDate.setFullYear(now.getFullYear() - 1);
        break;
      default:
        return null;
    }
    return startDate;
  }

  // src/modules/hazards/hazards.service.ts

  async getMyDashboardData(userId: number, status?: HazardStatus, range?: string) {
    // 1. Хэрэглэгчийн профайл мэдээллийг татах
    const userProfile = await this.usersRepository.findOne({
      where: { id: userId },
      select: ['user_id', 'first_name', 'last_name', 'job', 'user_image'], // Нууц үг зэргийг алгасах
    });
    const where: any = {
      reporter: { id: userId }, // Зөвхөн тухайн хэрэглэгчийн ID-аар шүүнэ
    };

    if (status) {
      where.status = status;
    }

    if (range) {
      const startDate = this.getStartDateFromRange(range);
      if (startDate) {
        where.created_at = MoreThanOrEqual(startDate);
      }
    }

    // 1. Хэрэглэгчийн шүүгдсэн датаг татах
    const [hazards, filteredTotal] = await this.hazardsRepository.findAndCount({
      where,
      relations: ['reporter'],
      order: { created_at: 'DESC' },
    });

    // 2. Статистикийг тооцоолох
    const summary = {
      profile: userProfile,
      myTotal: filteredTotal,
      reportedCount: hazards.filter((h) => h.main_type === HazardMainType.REPORT).length,
      fixedCount: hazards.filter((h) => h.main_type === HazardMainType.FIXED).length,
      byStatus: {
        'Хүлээгдэж буй': hazards.filter((h) => h.status === 'Хүлээгдэж буй').length,
        Баталсан: hazards.filter((h) => h.status === 'Баталсан').length,
        Арилгасан: hazards.filter((h) => h.status === 'Арилгасан').length,
        Цуцалсан: hazards.filter((h) => h.status === 'Цуцалсан').length,
      },
      byLevel: {
        'Маш их': hazards.filter((h) => h.level === 'Маш их').length,
        Их: hazards.filter((h) => h.level === 'Их').length,
        'Дунд зэрэг': hazards.filter((h) => h.level === 'Дунд зэрэг').length,
        Бага: hazards.filter((h) => h.level === 'Бага').length,
        'Маш бага': hazards.filter((h) => h.level === 'Маш бага').length,
      },
    };

    return {
      summary,
      data: hazards,
    };
  }
}
