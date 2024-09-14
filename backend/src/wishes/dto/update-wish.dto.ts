import { PartialType } from '@nestjs/swagger';
import {
  IsOptional,
  Length,
  IsNumber,
  IsInt,
  IsUrl,
  IsString,
} from 'class-validator';
import { CreateWishDto } from './create-wish.dto';

export class UpdateWishDto extends PartialType(CreateWishDto) {
  @IsOptional()
  @IsString()
  @Length(5, 250)
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  link: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsNumber()
  price: number;

  @IsOptional()
  @IsString()
  @Length(10, 350)
  description: string;

  @IsOptional()
  @IsInt()
  raised: number;
}
