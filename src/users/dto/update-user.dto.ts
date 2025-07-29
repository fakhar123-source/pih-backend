import {
  IsNotEmpty,
  IsOptional,
  IsEmail,
  IsArray,
  ArrayNotEmpty,
  ArrayUnique,
  IsIn,
  IsInt,
  IsString,
  Min,
  IsNumber,
} from 'class-validator';

export class UpdateUserDto {
  @IsOptional()
  @IsEmail()
  email?: string;

  @IsOptional()
  phoneNumber?: string;

  @IsOptional()
  password?: string;

  @IsOptional()
  fullName?: string;

  @IsOptional()
  @IsArray()
  @ArrayUnique()
  @IsIn(['seller', 'inspector'], { each: true })
  roles?: string[];

  @IsOptional()
  @IsNumber()
  @Min(18)
  age?: number;

  @IsOptional()
  @IsString()
  address?: string;
  
  @IsOptional()
  @IsString()
  qualification?: string;

  @IsOptional()
  @IsNumber()
  @Min(4)
  workExperience?: number;

  @IsOptional()
  @IsString()
  inspectorCategory?: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  experienceLetter?: string;

  @IsOptional()
  @IsString()
  status?: string;
}
