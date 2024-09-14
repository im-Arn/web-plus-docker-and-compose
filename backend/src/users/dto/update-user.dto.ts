import { PartialType } from '@nestjs/swagger';
import { CreateUserDto } from './create-user.dto';
import {
  Length,
  IsEmail,
  IsUrl,
  IsOptional,
  IsString,
  MinLength,
} from 'class-validator';

export class UpdateUserDto extends PartialType(CreateUserDto) {
  @IsOptional()
  @IsString()
  @Length(2, 30)
  username: string;

  @IsOptional()
  @Length(2, 200)
  @IsString()
  about: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  avatar: string;

  @IsOptional()
  @IsString()
  @IsEmail()
  @MinLength(4)
  email: string;

  @IsOptional()
  @IsString()
  password: string;
}
