import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { SlotsController } from './slots.controller';
import { SlotsService } from './slots.service';
import { Slot } from './entities/slot.entity';
import { User } from '../users/entities/user.entity'; // Add this import

@Module({
  imports: [TypeOrmModule.forFeature([Slot, User])], // Add User to the forFeature array
  controllers: [SlotsController],
  providers: [SlotsService],
  exports: [SlotsService], // Export if needed by other modules
})
export class SlotsModule {}