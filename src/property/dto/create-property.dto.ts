import { IsString, IsNumber, IsOptional, IsArray } from 'class-validator';

export class CreatePropertyDto {
  @IsString()
  title: string;

  @IsString()
  category: string;

  @IsNumber()
  price: number;

  @IsString()
  description: string;

  @IsString()
  location: string;

  @IsString()
  city: string;

  @IsNumber()
  bedrooms: number;

  @IsNumber()
  bathrooms: number;

  @IsNumber()
  surface: number;

  @IsNumber()
  yearBuilt: number;

  @IsArray()
  @IsOptional()
  images?: string[];

  @IsNumber()
  userId: number; // ✅ Ensure `userId` is included
}
