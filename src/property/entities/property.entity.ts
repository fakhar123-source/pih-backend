import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, default: 'Untitled Property' })
  title: string;

  @Column({ type: 'varchar', nullable: false, default: 'Uncategorized' })
  category: string;

  @Column({ type: 'bigint', nullable: true }) // Make price nullable
  price: number;
  

  @Column()
  description: string;

  @Column()
  location: string;

  @Column()
  city: string;

  @Column()
  bedrooms: number;

  @Column()
  bathrooms: number;

  @Column()
  surface: number;

  @Column()
  yearBuilt: number;

  @Column({ type: 'double precision', nullable: true })
  latitude: number;

  @Column({ type: 'double precision', nullable: true })
  longitude: number;

  @Column('text', { array: true, nullable: true })
  images: string[];

  @ManyToOne(() => User, (user) => user.properties)
  user: User;
}
