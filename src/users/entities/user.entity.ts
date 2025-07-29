import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  OneToMany,
} from 'typeorm';
import { Property } from '../../property/entities/property.entity'; // ✅ Correct path
import { Slot } from 'src/slots/entities/slot.entity';
@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  email: string;

  @Column({ nullable: true })  // Allow phoneNumber to be nullable
  phoneNumber: string;

  @Column()
  password: string;

  @Column({ nullable: true })  // Make confirmPassword nullable
  confirmPassword: string;
  

  @Column({ nullable: true })
  fullName?: string;
  
  @Column('simple-array')
  roles: string[];

  @Column({ nullable: true, default: 0 })
  age?: number;

  @Column({ nullable: true, default: '' })
  address: string;

  @Column({ nullable: true, default: '' })
  qualification: string;

  @Column({ nullable: true, default: 0 })
  workExperience: number;

  @Column({ nullable: true, default: '' })
  inspectorCategory: string;

  @Column({ nullable: true, default: '' })
  image: string;

  @Column({ nullable: true, default: '' })
  experienceLetter: string;

  @Column({ default: 'Pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;
  // ✅ Define the relation between User and Property entities
  @OneToMany(() => Property, (property) => property.user)
  properties: Property[]; // This line establishes the relation

  @OneToMany(() => Slot, (slot) => slot.user)
  slots: Slot[];
}

