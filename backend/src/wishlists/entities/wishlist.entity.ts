import { Column, Entity, ManyToMany, ManyToOne, JoinTable } from 'typeorm';
import { IsUrl, Length, IsOptional, IsString } from 'class-validator';
import { IdDateEntity } from '../../constants/idDateEntity';
import { User } from '../../users/entities/user.entity';
import { Wish } from '../../wishes/entities/wish.entity';

@Entity()
export class Wishlist extends IdDateEntity {
  @Column()
  @IsString()
  @Length(1, 250)
  name: string;

  @Column()
  @IsString()
  @IsUrl()
  image: string;

  @Column({ default: 'Какая прекрасная коллекция' })
  @IsString()
  @Length(10, 350)
  description: string;

  @ManyToMany(() => Wish)
  @JoinTable()
  @IsOptional()
  items: Wish[];

  @ManyToOne(() => User, (user) => user.wishlists)
  owner: User;
}
