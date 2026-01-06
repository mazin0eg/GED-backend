import { IsEmail, IsNotEmpty, IsString, MinLength, IsOptional, IsArray, ArrayNotEmpty, ArrayUnique, IsInt } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @IsNotEmpty()
  username: string;

  @IsEmail()
  email: string;

  @IsString()
  @MinLength(6)
  password: string;

  // Optional: role IDs to assign on creation (e.g., hr/manager)
  @IsOptional()
  @IsArray()
  @ArrayNotEmpty()
  @ArrayUnique()
  roleIds?: number[];
}
