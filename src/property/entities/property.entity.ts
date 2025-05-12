import { Entity, PrimaryGeneratedColumn, Column, ManyToOne } from 'typeorm';
import { User } from '../../users/entities/user.entity'; // ✅ Correct path

@Entity()
export class Property {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ type: 'varchar', nullable: false, default: 'Untitled Property' })
  title: string;

  @Column({ type: 'varchar', nullable: false, default: 'Uncategorized' })
  category: string;

  @Column()
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

  @Column('text', { array: true, nullable: true }) // ✅ Allow nullable images
  images: string[];

  // ✅ Many-to-One relation: Multiple properties belong to one user
  @ManyToOne(() => User, (user: User) => user.properties, { onDelete: 'CASCADE' })
  user: User;
}
