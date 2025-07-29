import { User } from 'src/users/entities/user.entity';
import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  JoinColumn,
  ManyToOne,
} from 'typeorm';

@Entity('slots')
export class Slot {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  date: string; // Format: YYYY-MM-DD

  @Column()
  time: string; // Format: HH:mm

  @Column('decimal', { precision: 10, scale: 2 })
  charges: number;

  @Column()
  city: string;

  @Column()
  address: string;
  @ManyToOne(() => User, (user) => user.slots)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
