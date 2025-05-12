import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToMany, OneToOne  } from 'typeorm';
import { Property } from '../../property/entities/property.entity'; // ✅ Correct path
import { InspectorApplicant } from 'src/inspector-applicant/entities/inspector-applicant.entity';

export enum UserRole {
  SELLER = 'seller',
  INSPECTOR = 'inspector',
  ADMIN = 'admin',
}

@Entity('users')
export class User {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column({ unique: true })
  email: string;

  @Column({ nullable: true })
  phone: string;

  @Column()
  password: string;

  @Column({
    type: 'enum',
    enum: UserRole,
    default: UserRole.SELLER, // Default role is Seller
  })
  role: UserRole;

  @Column({ nullable: true })
  image: string; // Assuming you will store the image URL or file path here

  @CreateDateColumn()
  createdAt: Date;

  picture: string;
  @OneToOne(() => InspectorApplicant, (inspector) => inspector.user)
  inspectorApplicant: InspectorApplicant;
  // ✅ One-to-Many relation: A user can have multiple properties
  @OneToMany(() => Property, (property: Property) => property.user, { cascade: true })
  properties: Property[];
  
}
