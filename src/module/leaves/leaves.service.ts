import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { CreateLeaveDto } from './dto/create-leave.dto';
import { UpdateLeaveDto } from './dto/update-leave.dto';
import { Leave } from './entities/leave.entity';
import { Repository } from 'typeorm/repository/Repository';
import { InjectRepository } from '@nestjs/typeorm';
import { Employee } from '../employee/entities/employee.entity';
import { Between } from 'typeorm/find-options/operator/Between';

@Injectable()
export class LeavesService {
  constructor(
    @InjectRepository(Leave)
    private readonly leaveRepository: Repository<Leave>,
    @InjectRepository(Employee)
    private readonly employeeRepository: Repository<Employee>,
  ) {}
  async create(createLeaveDto: CreateLeaveDto) {
    try {
      const employee = await this.employeeRepository.findOne({
        where: { id: createLeaveDto.employeeId },
      });
      if (!employee) throw new NotFoundException('Employee not found');

      // a. Maksimal 12 hari cuti per tahun
      if (employee.remainingLeaves < 1) {
        throw new BadRequestException('Leave quota exhausted');
      }

      // b. Hanya boleh 1 hari cuti di bulan yang sama
      // validation start date dan end date hanya dua hari 
      if (createLeaveDto.startDate !== createLeaveDto.endDate) {
        throw new BadRequestException('Start date and end date must be the same');
      }

      const startDate = new Date(createLeaveDto.startDate);
      const year = startDate.getFullYear();
      const month = startDate.getMonth() + 1; // getMonth() 0-based

      const leavesThisMonth = await this.leaveRepository.find({
        where: [
          {
            employee: { id: employee.id },
            startDate: Between(
              new Date(year, month - 1, 1),
              new Date(year, month, 0),
            ),
          },
        ],
      });

      if (leavesThisMonth.length > 0) {
        throw new BadRequestException('Only one leave per month is allowed');
      }

      // Pengajuan berhasil, kurangi remainingLeaves
      employee.remainingLeaves -= 1;
      await this.employeeRepository.save(employee);

      const leave = this.leaveRepository.create({
        ...createLeaveDto,
        employee,
      });
      return await this.leaveRepository.save(leave);
    } catch (error) {
      throw error
    }
  }

  async findAll() {
    return await this.leaveRepository.find({
      relations: ['employee'],
    });
  }

  async findOne(id: string) {
    return await this.leaveRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
  }

  async update(id: string, updateLeaveDto: UpdateLeaveDto) {
    try {
      const leave = await this.leaveRepository.findOne({
      where: { id },
      relations: ['employee'],
    });
    if (!leave) {
      throw new NotFoundException(`Leave with ID ${id} not found`);
    }

    const employee = leave.employee;
    if (!employee) throw new NotFoundException('Employee not found');

    // Validasi startDate dan endDate harus sama (1 hari)
    if (updateLeaveDto.startDate !== updateLeaveDto.endDate) {
      throw new BadRequestException('Start date and end date must be the same');
    }

    if (!updateLeaveDto.startDate) {
      throw new BadRequestException('Start date is required');
    }
    const startDate = new Date(updateLeaveDto.startDate);
    const year = startDate.getFullYear();
    const month = startDate.getMonth() + 1;

    // Cek apakah sudah ada cuti lain di bulan yang sama (selain cuti yang sedang diupdate)
    const leavesThisMonth = await this.leaveRepository.find({
      where: [
        {
          employee: { id: employee.id },
          startDate: Between(
            new Date(year, month - 1, 1),
            new Date(year, month, 0),
          ),
        },
      ],
    });

    const otherLeavesThisMonth = leavesThisMonth.filter(l => l.id !== id);
    if (otherLeavesThisMonth.length > 0) {
      throw new BadRequestException('Only one leave per month is allowed');
    }

      return await this.leaveRepository.update(id, updateLeaveDto);
    } catch (error) {
      throw error;
    }
  }

  async remove(id: string) {
    try {
      const data = await this.leaveRepository.findOne({
        where: { id },
      });

      if (!data) {
        throw new NotFoundException(`Leave with ID ${id} not found`);
      }

      await this.leaveRepository.softDelete(id);

      return {
        message: `Leave with ID ${id} successfully removed`,
      };
    } catch (error) {
        throw error;
    }
  }
}
