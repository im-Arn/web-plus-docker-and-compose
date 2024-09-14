import {
  Injectable,
  BadRequestException,
  InternalServerErrorException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { User } from './entities/user.entity';
import { Repository, Like } from 'typeorm';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { HashProvider } from '../constants/hashProvider';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}

  async findByEmail(email: string) {
    const mail = await this.userRepository.findOne({ where: { email } });
    return mail;
  }

  async findByName(username: string) {
    const user = await this.userRepository.findOne({ where: { username } });
    if (!user) return null;
    return user;
  }

  async findById(id: number) {
    const user = await this.userRepository.findOne({ where: { id } });
    if (!user) return null;
    return user;
  }

  async create(createUserDto: CreateUserDto) {
    console.log('REGISTATION');
    const username = await this.findByName(createUserDto.username);
    const email = await this.findByEmail(createUserDto.email);
    if (username !== null || email) {
      throw new BadRequestException(
        'Пользователь с таким именем или почтой уже существует',
      );
    }
    const user = this.userRepository.create(createUserDto);
    user.password = await HashProvider.generateHash(user.password);
    return this.userRepository.save(user);
  }

  async findAll(searchQuery: string): Promise<User[]> {
    return this.userRepository.find({
      where: [
        { username: Like(`%${searchQuery}%`) },
        { email: Like(`%${searchQuery}%`) },
      ],
    });
  }

  async getWishes(userId: number) {
    const user = await this.userRepository.findOneBy({ id: userId });
    if (!user) {
      throw new BadRequestException('Пользователь не найден');
    }
    const wishes = await this.userRepository.findOne({
      where: { id: userId },
      select: ['wishes'],
      relations: ['wishes', 'wishes.owner', 'wishes.offers'],
    });
    if (!wishes) {
      throw new BadRequestException('Подарки пользователю не найдены');
    }
    return wishes.wishes;
  }

  async updateOne(id: number, updateUserDto: UpdateUserDto) {
    try {
      if (updateUserDto.password) {
        updateUserDto.password = await HashProvider.generateHash(
          updateUserDto.password,
        );
      }
      if (updateUserDto.username) {
        const existingUserByUsername = await this.findByName(
          updateUserDto.username,
        );
        if (existingUserByUsername && existingUserByUsername.id !== id) {
          throw new BadRequestException(
            'Пользователь с таким логином уже существует',
          );
        }
      }
      if (updateUserDto.email) {
        const existingUserByEmail = await this.findByEmail(updateUserDto.email);
        if (existingUserByEmail && existingUserByEmail.id !== id) {
          throw new BadRequestException(
            'Пользователь с таким email уже существует',
          );
        }
      }
      await this.userRepository.update({ id }, updateUserDto);

      const updatedUser = await this.findById(id);
      delete updatedUser.password;
      return updatedUser;
    } catch (error) {
      console.error('Ошибка при обновлении пользователя:', error.message);
      throw new InternalServerErrorException(
        'Не удалось обновить пользователя.',
      );
    }
  }
}
