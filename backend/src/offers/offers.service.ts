import {
  ForbiddenException,
  Injectable,
  InternalServerErrorException,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { Offer } from './entities/offer.entity';
import { CreateOfferDto } from './dto/createOffer.dto';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class OffersService {
  constructor(
    @InjectRepository(Offer)
    private readonly offerRepository: Repository<Offer>,
    private readonly wishesService: WishesService,
  ) {}

  async create(createOfferDto: CreateOfferDto, user: User) {
    const wishes = await this.wishesService.findOne(createOfferDto.itemId);
    const wish = await this.wishesService.findOne(wishes.id);
    const sum = wish.price - wish.raised;
    const newRise = Number(wish.raised) + Number(createOfferDto.amount);
    if (wish.owner.id === user.id) {
      throw new ForbiddenException('Недостаточно прав для внесения денег');
    }
    if (createOfferDto.amount > wish.price || createOfferDto.amount > sum) {
      throw new ForbiddenException('Cумма превышает лимит подарка');
    }
    await this.wishesService.updateRaised(createOfferDto.itemId, newRise);
    const offerDto = { ...createOfferDto, user: user, item: wish };
    return await this.offerRepository.save(offerDto);
  }

  async findOne(id: number): Promise<Offer> {
    const offer = await this.offerRepository.findOneBy({ id });
    if (!offer) {
      throw new NotFoundException(`Запись не найдена`);
    }
    return offer;
  }

  async findAll(): Promise<Offer[]> {
    try {
      const offers = await this.offerRepository.find({
        relations: ['user', 'item'],
      });
      offers.forEach((offer) => delete offer.user.password);
      return offers;
    } catch (error) {
      console.error(error);
      throw new InternalServerErrorException('Записи не найдены');
    }
  }
}
