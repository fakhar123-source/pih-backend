import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property } from './entities/property.entity';
import { User } from '../users/entities/user.entity'; // Import User Entity
import { UsersModule } from '../users/users.module'; // Import Users Module

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, User]), // Register Property and User entities for ORM
    UsersModule, // Import UsersModule to access User-related functionality if needed
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService], // Export PropertyService so it can be used in other modules if needed
})
export class PropertyModule {}
