import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, OneToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';

@Entity()
export class InspectorApplicant {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  fullName: string;

  @Column()
  age: number;

  @Column()
  address: string;

  @Column()
  qualification: string;

  @Column()
  workExperience: number;

  @Column()
  inspectorCategory: string;

  @Column({ nullable: true, default: "" })
  image: string;

  @Column({ nullable: true, default: "" })
  experienceLetter: string;

  @Column({ default: 'Pending' })
  status: string;

  @CreateDateColumn()
  createdAt: Date;

  @Column({ type: 'json', nullable: true, default: [] })
  slots: { date: string; time: string; charges: number }[];

  // ✅ One-to-One Relation: Link Inspector Applicant to a User
  
  @OneToOne(() => User)
  @JoinColumn() // This creates a `userId` column in InspectorApplicant
  user: User;
}
