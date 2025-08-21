import {
  IsEmail,
  IsNotEmpty,
  IsString,
  MinLength,
  MaxLength,
  IsEnum,
  IsDateString,
  IsOptional,
} from 'class-validator';

export class UpdateUserDto {
  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsNotEmpty()
  @IsString()
  @MaxLength(100)
  lastName: string;

  @IsNotEmpty()
  @IsEmail()
  @MaxLength(150)
  email: string;

  @IsString()
  @IsOptional()
  @MinLength(6)
  password?: string;

  @IsNotEmpty()
  @IsEnum(['male', 'female', 'other'])
  gender: 'male' | 'female' | 'other';

  @IsDateString()
  dateOfBirth: string; // format: YYYY-MM-DD
}
