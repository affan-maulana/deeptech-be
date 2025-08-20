import { Controller, Get, Post, Body, Patch, Param, Delete, UseGuards, ParseUUIDPipe } from '@nestjs/common';
import { EmployeeService } from './employee.service';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { JwtAuthGuard } from 'src/common/jwt-auth.guard';
import { ResponseDefaultDto } from 'src/common/dto/response-default.dto';
  
@UseGuards(JwtAuthGuard)
@Controller('employee')
export class EmployeeController {
  constructor(private readonly employeeService: EmployeeService) {}

  @Post()
  async create (@Body() createEmployeeDto: CreateEmployeeDto) {
    const resp = await this.employeeService.create(createEmployeeDto);
    return new ResponseDefaultDto({
      statusCode: 201,
      message: 'Employee successfully created',
      data: resp,
    });
  }

  @Get()
  async findAll() {
    const resp = await this.employeeService.findAll();
    return new ResponseDefaultDto(resp);
  }

  @Get(':id')
  async findOne(@Param('id', ParseUUIDPipe) id: string) {
    const resp = await this.employeeService.findOne(id);
    return new ResponseDefaultDto(resp);
  }

  @Patch(':id')
  async update(@Param('id', ParseUUIDPipe) id: string, @Body() updateEmployeeDto: UpdateEmployeeDto) {
    await this.employeeService.update(id, updateEmployeeDto);
    return new ResponseDefaultDto({
      data: null,
      message: `Employee with ID ${id} successfully updated`,
    });
  }

  @Delete(':id')
  async remove(@Param('id', ParseUUIDPipe) id: string) {
    await this.employeeService.remove(id);
    return new ResponseDefaultDto({
      data: null,
      message: `Employee with ID ${id} successfully removed`,
    });
  }
}
