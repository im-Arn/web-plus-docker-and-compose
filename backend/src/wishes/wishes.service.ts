import {
  Injectable,
  ForbiddenException,
  BadRequestException,
} from '@nestjs/common';
import { Repository, UpdateResult, MoreThan, In } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wish } from './entities/wish.entity';
import { CreateWishDto } from './dto/create-wish.dto';
import { UpdateWishDto } from './dto/update-wish.dto';

@Injectable()
export class WishesService {
  constructor(
    @InjectRepository(Wish)
    private readonly wishesRepository: Repository<Wish>,
  ) {}

  async create(owner: User, createWishDto: CreateWishDto) {
    return await this.wishesRepository.save({
      ...createWishDto,
      owner: owner,
    });
  }

  async findLast(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { createdAt: 'DESC' },
      take: 40,
    });
  }

  async findTop(): Promise<Wish[]> {
    return await this.wishesRepository.find({
      order: { copied: 'DESC' },
      where: { copied: MoreThan(0) },
      take: 10,
    });
  }

  async findOne(id: number): Promise<Wish> {
    const wish = await this.wishesRepository.findOne({
      where: { id },
      relations: ['owner', 'offers', 'offers.user'],
    });
    if (!wish)
      throw new BadRequestException('Кажется мы не нашли такого подарка :(');
    return wish;
  }

  async updateRaised(id: number, newRise: number): Promise<UpdateResult> {
    return await this.wishesRepository.update({ id: id }, { raised: newRise });
  }

  async updateOne(wishId: number, updatedWish: UpdateWishDto, userId: number) {
    const wish = await this.findOne(wishId);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException(
        'Недостаточно прав для редактирования карточки',
      );
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ForbiddenException(
        'Недостаточно прав для редактирования карточки. Нельзя менять цену после того, как кто-то уже внес деньги',
      );
    }
    return await this.wishesRepository.update(wishId, updatedWish);
  }

  async findMany(items: number[]): Promise<Wish[]> {
    return this.wishesRepository.findBy({ id: In(items) });
  }

  async removeOne(wishId: number, userId: number) {
    const wish = await this.findOne(wishId);
    if (userId !== wish.owner.id) {
      throw new ForbiddenException('Недостаточно прав для удаления карточки');
    }
    if (wish.raised > 0 && wish.price !== undefined) {
      throw new ForbiddenException('Недостаточно прав для удаления карточки');
    }
    await this.wishesRepository.delete(wishId);
    return wish;
  }

  async copyWish(wishId: number, user: User) {
    const wish = await this.findOne(wishId);
    if (user.id === wish.owner.id) {
      throw new ForbiddenException(
        'Нельзя создать дубликат существующей карточки',
      );
    }
    await this.wishesRepository.update(wishId, {
      copied: (wish.copied += 1),
    });
    const wishCopy = {
      ...wish,
      raised: 0,
      owner: user.id,
      offers: [],
    };
    await this.create(user, wishCopy);
    return {};
  }
}
