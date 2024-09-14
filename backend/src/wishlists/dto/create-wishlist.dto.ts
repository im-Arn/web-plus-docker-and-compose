import {
  IsArray,
  IsUrl,
  Length,
  IsNumber,
  ArrayNotEmpty,
  IsOptional,
  IsString,
} from 'class-validator';

export class CreateWishlistDto {
  @IsString()
  @Length(5, 250)
  name: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsArray()
  @ArrayNotEmpty()
  @IsNumber(
    {},
    {
      each: true,
    },
  )
  itemsId: number[];

  @IsString()
  @IsOptional()
  @Length(10, 350)
  description: string;
}
