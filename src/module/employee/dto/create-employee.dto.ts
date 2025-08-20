import { IsEmail, IsEnum, IsNotEmpty, IsString, Length, MaxLength } from 'class-validator';

export class CreateEmployeeDto {
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
  @Length(1, 20)
  phoneNumber: string;

  @IsNotEmpty()
  @IsEnum(['male', 'female', 'other'])
  gender: 'male' | 'female' | 'other';

  @IsString()
  address: string;
}
