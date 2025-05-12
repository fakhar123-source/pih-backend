import { IsNotEmpty, IsEmail, IsString } from 'class-validator';

export class CreateRequestDto {
  @IsNotEmpty({ message: "Name is required" })
  @IsString()
  name: string;

  @IsNotEmpty({ message: "Email is required" })
  @IsEmail({}, { message: "Invalid email format" })
  email: string;

  @IsNotEmpty({ message: "Phone number is required" })
  @IsString()
  phone: string;

  @IsNotEmpty({ message: "Message content is required" })
  @IsString()
  content: string;
}
