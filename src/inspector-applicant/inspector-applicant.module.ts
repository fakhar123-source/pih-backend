import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { InspectorApplicant } from './entities/inspector-applicant.entity';
import { InspectorApplicantService } from './inspector-applicant.service';
import { InspectorApplicantController } from './inspector-applicant.controller';

@Module({
  imports: [TypeOrmModule.forFeature([InspectorApplicant])], // ✅ Ensure Repository is Provided
  controllers: [InspectorApplicantController],
  providers: [InspectorApplicantService],
  exports: [InspectorApplicantService], // ✅ Export the service if needed elsewhere
})
export class InspectorApplicantModule {}
