import { IsEmail, IsNotEmpty, IsString, MinLength } from "class-validator";

export class LoginDto {
  @IsEmail()
  @IsNotEmpty()
  email: string; // required

  @IsString()
  @MinLength(6)
  @IsNotEmpty()
  password: string; // required
}