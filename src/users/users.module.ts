import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { User } from './entities/user.entity';
import { JwtModule } from '@nestjs/jwt';

@Module({
  imports: [
    TypeOrmModule.forFeature([User]), 
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'my-secret-key',
      signOptions: { expiresIn: '1h' }, // Adjust expiration time
    }),
  ],
  controllers: [UsersController],
  providers: [UsersService],
  exports: [UsersService], // Export for Auth Module
})
export class UsersModule {}
