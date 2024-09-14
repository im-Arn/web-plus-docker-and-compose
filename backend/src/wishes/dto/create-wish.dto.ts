import { IsNumber, Length, IsUrl, IsString } from 'class-validator';

export class CreateWishDto {
  @IsString()
  @Length(5, 250)
  name: string;

  @IsString()
  @IsUrl()
  link: string;

  @IsString()
  @IsUrl()
  image: string;

  @IsNumber()
  price: number;

  @IsString()
  @Length(10, 350)
  description: string;
}
