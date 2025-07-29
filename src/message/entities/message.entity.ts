import { Property } from 'src/property/entities/property.entity';
import { User } from 'src/users/entities/user.entity';
import { Slot } from 'src/slots/entities/slot.entity'; // Import the Slot entity
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';

@Entity()
export class Message {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column()
  email: string;

  @Column()
  phoneNumber: string;

  @Column('text')
  message: string;

  @ManyToOne(() => Property)
  @JoinColumn({ name: 'propertyId' })
  property: Property;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'senderId' })
  sender: User;

  @ManyToOne(() => Slot) // Add a relationship to Slot
  @JoinColumn({ name: 'slotId' })
  slot: Slot;

  @Column({ default: 'Sent' })
  status: string;

  @Column({ type: 'timestamp', default: () => 'CURRENT_TIMESTAMP' })
  createdAt: Date;
}
