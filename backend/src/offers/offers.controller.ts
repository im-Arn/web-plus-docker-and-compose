import {
  Body,
  Controller,
  Get,
  Param,
  Post,
  Req,
  UseGuards,
} from '@nestjs/common';
import { OffersService } from './offers.service';
import { CreateOfferDto } from './dto/createOffer.dto';
import { JwtGuard } from '../guards/jwt.guard';
import { UsersService } from 'src/users/users.service';
import { User } from '../users/entities/user.entity';

interface UserRequest extends Request {
  user: User;
}

@UseGuards(JwtGuard)
@Controller('offers')
export class OffersController {
  constructor(
    private readonly offersService: OffersService,
    private readonly usersService: UsersService,
  ) {}

  @Post()
  async create(
    @Body() createOfferDto: CreateOfferDto,
    @Req() req: UserRequest,
  ) {
    const { id } = req.user;
    const user = await this.usersService.findById(id);
    return await this.offersService.create(createOfferDto, user);
  }

  @Get()
  async findAllOffers() {
    const offers = await this.offersService.findAll();
    return offers;
  }

  @Get(':id')
  async findOfferById(@Param('id') id: string) {
    const offer = await this.offersService.findOne(+id);
    return offer;
  }
}
