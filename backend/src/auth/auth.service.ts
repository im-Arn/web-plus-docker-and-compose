import { Injectable, InternalServerErrorException } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { HashProvider } from '../constants/hashProvider';

@Injectable()
export class AuthService {
  constructor(
    private jwtService: JwtService,
    private usersService: UsersService,
    private readonly configService: ConfigService,
  ) {}

  auth(user: User) {
    // console.log('AUTH' + user.id);
    try {
      const payload = { sub: user.id };
      const secret = this.configService.get<string>('jwt.key');
      return { access_token: this.jwtService.sign(payload, { secret }) };
    } catch (error) {
      throw new InternalServerErrorException(
        'ошибка сервера при выполнении авторизации',
      );
    }
  }

  async validatePassword(username: string, password: string) {
    const user = await this.usersService.findByName(username);
    const isPasswordMatch = await HashProvider.validateHash(
      password,
      user.password,
    );
    if (user && isPasswordMatch) {
      return user;
    }
    return null;
  }
}
