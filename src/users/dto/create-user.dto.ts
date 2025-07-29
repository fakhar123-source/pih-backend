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

export class CreateUserDto {
  @IsNotEmpty()
  @IsEmail()
  email: string;

  @IsNotEmpty()
  phoneNumber: string;

  @IsNotEmpty()
  password: string;

  @IsOptional()
  confirmPassword: string;

  @IsOptional()
  fullName?: string;

  @IsNotEmpty()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  @IsIn(['seller', 'inspector'], { each: true })
  roles: string[];
  // Optional Inspector fields

  @IsOptional()
  @IsNumber()
  @Min(18)
  age: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  address: string;
  
  @IsOptional()
  @IsString()
  @IsNotEmpty()
  qualification: string;

  @IsOptional()
  @IsNumber()
  @Min(4)
  workExperience: number;

  @IsOptional()
  @IsString()
  @IsNotEmpty()
  inspectorCategory: string;

  @IsOptional()
  image?: string;

  @IsOptional()
  experienceLetter?: string;
  @IsOptional()
  @IsString()
  status?: string;
}
