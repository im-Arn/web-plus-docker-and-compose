import { PartialType } from '@nestjs/swagger';
import {
  IsNumber,
  IsUrl,
  IsArray,
  IsOptional,
  Length,
  ArrayNotEmpty,
  IsString,
} from 'class-validator';
import { CreateWishlistDto } from './create-wishlist.dto';

export class UpdateWishlistDto extends PartialType(CreateWishlistDto) {
  @IsOptional()
  @IsString()
  @Length(5, 250)
  name: string;

  @IsOptional()
  @IsString()
  @IsUrl()
  image: string;

  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @IsNumber()
  itemsId: number[];

  @IsOptional()
  @IsString()
  @Length(10, 350)
  description: string;
}
