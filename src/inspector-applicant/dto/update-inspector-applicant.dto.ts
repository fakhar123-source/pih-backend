import { PartialType } from '@nestjs/mapped-types';
import { CreateInspectorApplicantDto } from './create-inspector-applicant.dto';
import { IsOptional, IsArray } from 'class-validator';

export class UpdateInspectorApplicantDto extends PartialType(CreateInspectorApplicantDto) {
  @IsOptional()
  status?: string; // ✅ Keep status as it is (optional)

  @IsOptional()
  @IsArray()
  slots?: { date: string; time: string; charges: number }[]; // ✅ Allow updating slots (optional)
}
