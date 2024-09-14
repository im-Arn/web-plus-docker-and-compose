import { ExtractJwt, Strategy } from 'passport-jwt';
import { PassportStrategy } from '@nestjs/passport';
import { Injectable, BadRequestException } from '@nestjs/common';
import { UsersService } from '../../users/users.service';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class JwtStrategy extends PassportStrategy(Strategy) {
  constructor(
    private configService: ConfigService,
    private usersService: UsersService,
  ) {
    super({
      jwtFromRequest: ExtractJwt.fromAuthHeaderAsBearerToken(),
      ignoreExpiration: false,
      secretOrKey: configService.get<string>('jwt.key'),
    });
  }

  async validate(jwtPayload: { id: number }) {
    try {
      const user = await this.usersService.findById(jwtPayload.id);
      if (!user) {
        throw new BadRequestException('Пользователь не найден');
      }
      return user;
    } catch (error) {
      throw new BadRequestException('Invalid token or user not found');
    }
  }
}
