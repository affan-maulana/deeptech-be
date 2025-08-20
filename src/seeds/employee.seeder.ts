import { DataSource } from 'typeorm';
import { Employee } from '../module/employee/entities/employee.entity';

export async function seedEmployee(dataSource: DataSource) {
  const employeeRepo = dataSource.getRepository(Employee);
  const employee = employeeRepo.create({
    firstName: 'John',
    lastName: 'Doe',
    email: 'john.doe@example.com',
    phoneNumber: '08123456789',
    gender: 'male',
    address: 'Jl. Mawar No. 1',
  });
  await employeeRepo.save(employee);
  console.log('Seeded employee!');
}