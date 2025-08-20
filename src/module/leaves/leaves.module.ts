import { Module } from '@nestjs/common';
import { LeavesService } from './leaves.service';
import { LeavesController } from './leaves.controller';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Leave } from './entities/leave.entity';
import { Employee } from '../employee/entities/employee.entity';

@Module({
  imports: [
      TypeOrmModule.forFeature([Leave, Employee]),
    ],
  controllers: [LeavesController],
  providers: [LeavesService],
})
export class LeavesModule {}
