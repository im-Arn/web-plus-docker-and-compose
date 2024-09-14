import { Column, Entity, ManyToOne, OneToMany } from 'typeorm';
import { IsUrl, Length, IsNumber, IsDecimal, IsString } from 'class-validator';
import { IdDateEntity } from '../../constants/idDateEntity';
import { User } from '../../users/entities/user.entity';
import { Offer } from '../../offers/entities/offer.entity';

@Entity()
export class Wish extends IdDateEntity {
  @Column()
  @IsString()
  @Length(5, 250)
  name: string;

  @Column()
  @IsString()
  @IsUrl()
  link: string;

  @Column()
  @IsString()
  @IsUrl()
  image: string;

  @Column({ default: 0 })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  price: number;

  @Column({ default: 0 })
  @IsNumber({
    maxDecimalPlaces: 2,
  })
  raised: number;

  @Column({ default: 'Sacred wish' })
  @IsString()
  @Length(5, 350)
  description: string;

  @Column({ default: 0 })
  @IsDecimal()
  copied: number;

  @ManyToOne(() => User, (user) => user.wishes)
  owner: User;

  @OneToMany(() => Offer, (offer) => offer.item)
  offers: Offer[];
}
