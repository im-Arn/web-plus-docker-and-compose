import { Injectable, BadRequestException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from '../users/entities/user.entity';
import { Wishlist } from './entities/wishlist.entity';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { WishesService } from '../wishes/wishes.service';

@Injectable()
export class WishlistsService {
  constructor(
    @InjectRepository(Wishlist)
    private wishListsRepository: Repository<Wishlist>,
    private wishesService: WishesService,
  ) {}

  async create(createWishListDto: CreateWishlistDto, user: User) {
    const items = await this.wishesService.findMany(createWishListDto.itemsId);
    const wishList = this.wishListsRepository.create({
      ...createWishListDto,
      items,
      owner: user,
    });
    return await this.wishListsRepository.save(wishList);
  }

  async findOne(id: number) {
    const wishlist = await this.wishListsRepository.findOne({
      where: { id },
      relations: { items: true, owner: true },
    });
    if (!wishlist) {
      throw new BadRequestException('Коллекция не найдена');
    }
    delete wishlist.owner.password;
    delete wishlist.owner.email;
    return wishlist;
  }

  async updateOne(
    user: User,
    updateWishlistDto: UpdateWishlistDto,
    wishlistId: number,
  ) {
    const wishlist = await this.findOne(wishlistId);
    if (user.id !== wishlist.owner.id) {
      throw new BadRequestException(
        'Нет прав на изменение коллекции другого пользователя',
      );
    }
    const wishes = await this.wishesService.findMany(updateWishlistDto.itemsId);
    return await this.wishListsRepository.save({
      ...wishlist,
      name: updateWishlistDto.name,
      image: updateWishlistDto.image,
      items: wishes,
    });
  }

  async removeOne(wishlistId: number, userId: number) {
    const wishlist = await this.findOne(wishlistId);
    if (userId !== wishlist.owner.id) {
      throw new BadRequestException(
        'Нет прав удалить коллекцию другого пользователя',
      );
    }
    await this.wishListsRepository.delete(wishlistId);
    return wishlist;
  }

  async findMany() {
    return await this.wishListsRepository.find({
      relations: {
        items: true,
        owner: true,
      },
    });
  }
}
