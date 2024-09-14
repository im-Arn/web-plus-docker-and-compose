import {
  IsEmail,
  IsOptional,
  IsString,
  IsUrl,
  Length,
  MinLength,
  IsNotEmpty,
} from 'class-validator';

export class CreateUserDto {
  @IsNotEmpty()
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

  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(4)
  email: string;

  @IsString()
  password: string;
}
