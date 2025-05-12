import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn } from 'typeorm';

@Entity('requests') // ✅ Table name is "requests"
export class Request {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phone: string;

  @Column({ type: 'text' })
  content: string; // The request message

  @CreateDateColumn()
  createdAt: Date;
}
