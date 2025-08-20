import { ConflictException, Injectable, UnauthorizedException } from '@nestjs/common';
import { Repository } from 'typeorm';
import { User } from '../users/entities/user.entity';
import { LoginDto } from './dto/loginDto';
import { RegisterDto } from './dto/registerDto';
import * as bcrypt from 'bcrypt';
import { InjectRepository } from '@nestjs/typeorm';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
    private readonly jwtService: JwtService,
  ) {}

  async login(loginDto: LoginDto): Promise<any> {
    try {
      const user = await this.userRepository.findOne({
        where: { email: loginDto.email },
      });

      if (!user) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const isMatch = await bcrypt.compare(
        loginDto.password,
        user?.password,
      );

      if (!isMatch) {
        throw new UnauthorizedException('Invalid credentials');
      }

      const dataToEncode = {
        email: loginDto.email,
        id: user.id,
      };

      console.log('dataToEncode', dataToEncode);

      const accessToken = this.jwtService.sign(dataToEncode, {
        expiresIn: process.env.JWT_EXPIRATION || '2h',
      });

      const refreshToken = this.jwtService.sign(dataToEncode, {
        expiresIn: process.env.JWT_REFRESH_EXPIRATION || '7d',
      });

      return {
        result: {
          user: user.id,
          token: accessToken,
          refreshToken: refreshToken,
        },
        message: 'Login successful',
      };
    } catch (error) {
      throw new UnauthorizedException('Invalid credentials');
    }
  }

  async register(registerDto: RegisterDto): Promise<any> {
    const existingEmail = await this.userRepository.findOne({
      select: ['email'],
      where: {
        email: registerDto.email,
      },
    });
    if (existingEmail) {
      throw new ConflictException('Email already exists');
    }
    const hashedPassword = await bcrypt.hash(registerDto.password, 10);
    const newUser = this.userRepository.create({
      firstName: registerDto.firstName,
      lastName: registerDto.lastName,
      email: registerDto.email,
      gender: registerDto.gender,
      dateOfBirth: registerDto.dateOfBirth,
      password: hashedPassword,
    });
    await this.userRepository.save(newUser);

    return {
      statusCode: 201,
      result: { id: newUser.id, email: newUser.email },
      message: 'Registration successful',
    };
  }
}
