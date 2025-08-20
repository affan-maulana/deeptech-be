import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { ResponseDefaultDto } from 'src/common/dto/response-default.dto';

@UseGuards(JwtAuthGuard)
@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Post()
  async create(@Body() createUserDto: CreateUserDto) {
    const resp = await this.usersService.create(createUserDto);
    return new ResponseDefaultDto({
      statusCode: 201,
      message: 'User successfully created',
      data: resp,
    });
  }

  @Get()
  async findAll() {
    const resp = await this.usersService.findAll();
    return new ResponseDefaultDto(resp);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const resp = await this.usersService.findOne(id);
    return new ResponseDefaultDto(resp);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateUserDto: UpdateUserDto) {
    await this.usersService.update(id, updateUserDto);
    return new ResponseDefaultDto({
      data: null,
      message: 'User successfully updated',
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.usersService.remove(id);
    return new ResponseDefaultDto({
      data: null,
      message: 'User successfully removed',
    });
  }
}
