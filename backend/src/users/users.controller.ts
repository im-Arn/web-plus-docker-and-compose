import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  UseGuards,
  Request,
  NotFoundException,
  UnauthorizedException,
  ForbiddenException,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { JwtGuard } from '../guards/jwt.guard';

interface IUserRequest extends Request {
  user: User;
}

@UseGuards(JwtGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('me')
  async findMe(@Request() req: IUserRequest) {
    const { user } = req;
    if (!user || !user.id) {
      throw new UnauthorizedException('User not authenticated');
    }
    const me = await this.usersService.findById(user.id);
    if (me == null) throw new NotFoundException('Поьзователь не найден');
    // console.log('ME_'+me.id);
    return me;
  }

  @Patch('me')
  async updateUser(
    @Request() req: IUserRequest,
    @Body() updateUserDto: UpdateUserDto,
  ) {
    const user = this.usersService.findById(req.user.id);
    if (!user) {
      throw new ForbiddenException(
        'вы можете редактировать только свой профиль',
      );
    }
    const { id } = req.user;
    await this.usersService.updateOne(id, updateUserDto);
    return this.usersService.findById(id);
  }

  @Get(':username')
  async findOne(@Param('username') username: string) {
    const user = await this.usersService.findByName(username);
    if (user == null) throw new NotFoundException('Поьзователь не найден');
    return user;
  }

  @Get('me/wishes')
  async getMyWishes(@Request() req: IUserRequest) {
    const { id } = req.user;
    try {
      return await this.usersService.getWishes(id);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Подарки пользователя не найдены');
    }
  }

  @Get(':username/wishes')
  async getUsersWishes(@Param() params: { username: string }) {
    try {
      const user = await this.usersService.findByName(params.username);
      return await this.usersService.getWishes(user.id);
    } catch (error) {
      console.error(error);
      throw new NotFoundException('Подарки пользователя не найдены');
    }
  }

  // @UseGuards(JwtGuard)
  @Post('find')
  async findMany(@Body('query') query: string) {
    return await this.usersService.findAll(query);
  }
}
