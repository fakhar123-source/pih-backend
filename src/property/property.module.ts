import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PropertyService } from './property.service';
import { PropertyController } from './property.controller';
import { Property } from './entities/property.entity';
import { User } from '../users/entities/user.entity'; // ✅ Import User Entity
import { UsersModule } from '../users/users.module'; // ✅ Import Users Module

@Module({
  imports: [
    TypeOrmModule.forFeature([Property, User]), // ✅ Register User Entity
    UsersModule, // ✅ Import UsersModule
  ],
  controllers: [PropertyController],
  providers: [PropertyService],
  exports: [PropertyService],
})
export class PropertyModule {}
