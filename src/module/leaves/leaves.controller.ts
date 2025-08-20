import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { ResponseDefaultDto } from 'src/common/dto/response-default.dto';

@UseGuards(JwtAuthGuard)
@Controller('leaves')
export class LeavesController {
  constructor(private readonly leavesService: LeavesService) {}

  @Post()
  async create(@Body() createLeaveDto: CreateLeaveDto) {
    const resp = await this.leavesService.create(createLeaveDto);
    return new ResponseDefaultDto({
      statusCode: 201,
      message: 'Leave successfully created',
      data: resp,
    });
  }

  @Get()
  async findAll() {
    const resp = await this.leavesService.findAll();
    return new ResponseDefaultDto(resp);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const resp = await this.leavesService.findOne(id);
    return new ResponseDefaultDto(resp);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateLeaveDto: UpdateLeaveDto) {
    await this.leavesService.update(id, updateLeaveDto);
    return new ResponseDefaultDto({
       data: null,
       message: 'Leave successfully updated',
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.leavesService.remove(id);
    return new ResponseDefaultDto({
      data: null,
      message: 'Leave successfully removed',
    });
  }
}
