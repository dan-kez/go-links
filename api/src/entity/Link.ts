import { IsNotEmpty, IsUrl } from 'class-validator';
import {
  BaseEntity,
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
} from 'typeorm';

@Entity()
export default class Link extends BaseEntity {
  @PrimaryGeneratedColumn()
  public id!: number;

  @Column({
    length: 100,
    unique: true,
  })
  @IsNotEmpty()
  public shortUrl!: string;

  @Column({
    length: 255,
  })
  public ipAddress!: string;

  @Column({
    type: 'longtext',
  })
  @IsNotEmpty()
  @IsUrl()
  public destinationUrl!: string;

  @Column({
    default: 0,
  })
  public hits!: number;

  @CreateDateColumn()
  public created!: Date;
}
