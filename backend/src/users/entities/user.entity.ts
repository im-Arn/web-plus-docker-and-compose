import { Entity, Column, OneToMany } from 'typeorm';
import { IdDateEntity } from '../../constants/idDateEntity';
import {
  IsNotEmpty,
  Length,
  IsUrl,
  IsEmail,
  IsString,
  MinLength,
} from 'class-validator';
import { Wish } from '../../wishes/entities/wish.entity';
import { Offer } from 'src/offers/entities/offer.entity';
import { Wishlist } from 'src/wishlists/entities/wishlist.entity';

@Entity()
export class User extends IdDateEntity {
  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  @Length(2, 30)
  username: string;

  @Column({ default: 'Пока ничего не рассказал о себе' })
  @IsString()
  @Length(2, 200)
  about: string;

  @Column({ default: 'https://i.pravatar.cc/300' })
  @IsString()
  @IsUrl()
  avatar: string;

  @Column({ unique: true })
  @IsNotEmpty()
  @IsString()
  @IsEmail()
  @MinLength(4)
  email: string;

  @Column()
  @IsString()
  password: string;

  @OneToMany(() => Wish, (wish) => wish.owner)
  wishes: Wish[];

  @OneToMany(() => Offer, (offer) => offer.user)
  offers: Offer[];

  @OneToMany(() => Wishlist, (wishlist) => wishlist.owner)
  wishlists: Wishlist[];
}
