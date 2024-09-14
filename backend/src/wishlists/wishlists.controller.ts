import {
  Body,
  Controller,
  Delete,
  Get,
  InternalServerErrorException,
  NotFoundException,
  Param,
  Patch,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { WishlistsService } from './wishlists.service';
import { CreateWishlistDto } from './dto/create-wishlist.dto';
import { UpdateWishlistDto } from './dto/update-wishlist.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { Wishlist } from './entities/wishlist.entity';

interface Request {
  user?: any;
}

@UseGuards(JwtGuard)
@Controller('wishlistlists')
export class WishlistsController {
  constructor(private wishlistsService: WishlistsService) {}

  @Get()
  async findAll(): Promise<Wishlist[]> {
    try {
      return await this.wishlistsService.findMany();
    } catch (error) {
      console.log(error);
      throw new NotFoundException('коллекции не найдены');
    }
  }

  @Get(':id')
  async findOne(@Param('id') id: number): Promise<Wishlist> {
    try {
      return await this.wishlistsService.findOne(id);
    } catch (error) {
      throw new NotFoundException('коллекция не найдена');
    }
  }

  @Post()
  async create(
    @Req() req: Request,
    @Body() createWishListDto: CreateWishlistDto,
  ): Promise<Wishlist> {
    try {
      if (!req.user) {
        throw new NotFoundException('Пользователь не найден');
      }
      return await this.wishlistsService.create(createWishListDto, req.user);
    } catch (error) {
      console.log(error);
      throw new InternalServerErrorException(
        'Незвестная ошибка, не удалось создать коллекцию.',
      );
    }
  }

  @Patch(':id')
  async updateOne(
    @Body() updateWishlistDto: UpdateWishlistDto,
    @Param('id') id: string,
    @Req() req: Request,
  ): Promise<Wishlist> {
    return await this.wishlistsService.updateOne(
      req.user.id,
      updateWishlistDto,
      +id,
    );
  }

  @Delete(':id')
  async removeOne(
    @Req() req: Request,
    @Param('id') id: number,
  ): Promise<Wishlist> {
    return await this.wishlistsService.removeOne(id, req.user.id);
  }
}
