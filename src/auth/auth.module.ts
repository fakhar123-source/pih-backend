import { Module } from '@nestjs/common';
import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { UsersModule } from '../users/users.module';
import { JwtModule } from '@nestjs/jwt';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectorApplicant } from '../inspector-applicant/entities/inspector-applicant.entity';
import { InspectorApplicantModule } from '../inspector-applicant/inspector-applicant.module';

@Module({
  imports: [
    UsersModule,
    InspectorApplicantModule, // ✅ Ensure it's imported
    TypeOrmModule.forFeature([InspectorApplicant]), // ✅ Include Repository
    JwtModule.register({
      secret: process.env.JWT_SECRET || 'default_secret',
      signOptions: { expiresIn: '1h' },
    }),
  ],
  controllers: [AuthController],
  providers: [AuthService],
  exports: [AuthService],
})
export class AuthModule {}
