import { IsEmail, IsNotEmpty, IsOptional, MinLength, IsEnum } from 'class-validator';
import { UserRole } from '../entities/user.entity';

export class CreateUserDto {
  @IsNotEmpty()
  fullName: string;

  @IsEmail()
  email: string;

  @IsOptional()
  phone?: string;

  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @IsOptional()
  registerAsInspector?: boolean; // If true, role should be 'inspector'

  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole; // ✅ Add this line
}
