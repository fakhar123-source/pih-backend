import {
  IsString,
  IsNumber,
  IsNotEmpty,
  Min,
  Max,
  IsOptional,
  IsArray,
} from 'class-validator';

export class CreateInspectorApplicantDto {
  @IsString()
  @IsNotEmpty()
  fullName: string;

  @IsNumber()
  @Min(18)
  age: number;

  @IsString()
  @IsNotEmpty()
  address: string;

  @IsString()
  @IsNotEmpty()
  qualification: string;

  @IsNumber()
  @Min(4)
  workExperience: number;

  @IsString()
  @IsNotEmpty()
  inspectorCategory: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  experienceLetter?: string;
   @IsOptional()
  @IsArray()
  slots?: { date: string; time: string; charges: number }[];
  
}
