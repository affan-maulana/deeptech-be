import { IsDateString, IsOptional, IsString, IsUUID } from 'class-validator';

export class CreateLeaveDto {
  @IsUUID()
  employeeId?: string;

  @IsString()
  reason: string;

  @IsDateString()
  startDate: Date;

  @IsDateString()
  endDate: Date;
}
