import {
  ConflictException,
  Injectable,
  InternalServerErrorException,
} from '@nestjs/common';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { User } from './entities/user.entity';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm/repository/Repository';
import * as bcrypt from 'bcrypt';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private readonly userRepository: Repository<User>,
  ) {}
  async create(createUserDto: CreateUserDto) {
    try {
      const existingEmail = await this.userRepository.findOne({
        select: ['email'],
        where: {
          email: createUserDto.email,
        },
      });
      if (existingEmail) {
        throw new ConflictException('Email already exists');
      }
      const hashedPassword = await bcrypt.hash(createUserDto.password, 10);
      const newUser = this.userRepository.create({
        firstName: createUserDto.firstName,
        lastName: createUserDto.lastName,
        email: createUserDto.email,
        gender: createUserDto.gender,
        dateOfBirth: createUserDto.dateOfBirth,
        password: hashedPassword,
      });
      await this.userRepository.save(newUser);
      
      return newUser;
    } catch (error) {
      throw new InternalServerErrorException('Error creating user');
    }
  }

  async findAll() {
    try {
      return await this.userRepository.find();
    } catch (error) {
      throw new InternalServerErrorException('Error fetching users');
    }
  }

  async findOne(id: string) {
    try {
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException('Error fetching user');
    }
  }

  async update(id: string, updateUserDto: UpdateUserDto) {
    try {
      const existingEmail = await this.userRepository.findOne({
        select: ['email','id'],
        where: {
          email: updateUserDto.email,
        },
      });
      if (existingEmail && existingEmail.id !== id) {
        throw new ConflictException('Email already exists');
      }
      let hashedPassword: string | undefined = undefined;
      if (updateUserDto.password) {
        hashedPassword = await bcrypt.hash(updateUserDto.password, 10);
      }
      await this.userRepository.update(id, {
        ...updateUserDto,
        ...(hashedPassword && { password: hashedPassword }),
      });
      return await this.userRepository.findOne({ where: { id } });
    } catch (error) {
      throw new InternalServerErrorException(error);
    }
  }

  async remove(id: string) {
    try {
      await this.userRepository.softDelete(id);
    } catch (error) {
      throw new InternalServerErrorException('Error removing user');
    }
  }
}
