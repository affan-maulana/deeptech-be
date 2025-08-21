import { ConflictException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateEmployeeDto } from './dto/create-employee.dto';
import { UpdateEmployeeDto } from './dto/update-employee.dto';
import { Employee } from './entities/employee.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';

@Injectable()
export class EmployeeService {
  constructor(
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}
  async create(createEmployeeDto: CreateEmployeeDto) {
    try {
      // check duplicate email
      const existingEmployee = await this.employeeRepository.findOne({
        where: { email: createEmployeeDto.email },
      });
      if (existingEmployee) {
        throw new ConflictException('Email already exists');
      }
      return await this.employeeRepository.save(createEmployeeDto);
    } catch (error) {
      throw error;
    }
  }

  async findAll() {
    try {
      return await this.employeeRepository.find();
    } catch (error) {
      throw error;
    }
  }

  async dropdown() {
    try {
      const employees = await this.employeeRepository.find();
      return employees.map(employee => ({
        label: employee.firstName + ' ' + employee.lastName,
        value: employee.id,
      }));
    } catch (error) {
      throw error;
    }
  }

  async findOne(id: string) {
    try {
      return await this.employeeRepository.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async update(id: string, updateEmployeeDto: UpdateEmployeeDto) {
    try {
      await this.employeeRepository.update(id, updateEmployeeDto);
      return await this.employeeRepository.findOne({ where: { id } });
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const data = await this.employeeRepository.findOne({
        where: { id },
      });

      if (!data) {
        throw new NotFoundException(`Employee with ID ${id} not found`);
      }

      await this.employeeRepository.softDelete(id);

      return {
        message: `Employee with ID ${id} successfully removed`,
      };
    } catch (error) {
      throw error;
    }
  }
}
