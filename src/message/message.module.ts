import { Module } from '@nestjs/common';
import { MessageController } from './message.controller';
import { MessageService } from './message.service';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Message } from './entities/message.entity';
import { Property } from '../property/entities/property.entity';
import { User } from '../users/entities/user.entity';
import { Slot } from '../slots/entities/slot.entity'; // Import Slot entity

@Module({
  imports: [TypeOrmModule.forFeature([Message, Property, User, Slot])], // Add Slot to TypeOrmModule
  controllers: [MessageController],
  providers: [MessageService],
})
export class MessageModule {}
