import {
  IsString,
  IsEmail,
  IsNotEmpty,
  IsNumber,
  IsOptional,
} from 'class-validator';

export class CreateMessageDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsEmail()
  @IsNotEmpty()
  email: string;

  @IsString()
  @IsNotEmpty()
  phoneNumber: string;

  @IsString()
  @IsNotEmpty()
  message: string;

  @IsOptional() // Make propertyId optional
  @IsNumber()
  propertyId: number;

  @IsOptional() // Make slotId optional
  @IsNumber()
  slotId: number;
}
