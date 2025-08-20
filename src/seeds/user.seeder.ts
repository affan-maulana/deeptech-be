import { DataSource } from 'typeorm';
import { User } from '../module/users/entities/user.entity';
import * as bcrypt from 'bcrypt';

export async function seedUser(dataSource: DataSource) {
  const userRepo = dataSource.getRepository(User);
  const hashedPassword = await bcrypt.hash('admin123', 10);

  const user = userRepo.create({
    firstName: 'Affan',
    lastName: 'Maulana',
    email: 'affan@maulana.com',
    password: hashedPassword,
    dateOfBirth: new Date('1990-01-01'),
    gender: 'male',
  });
  await userRepo.save(user);
  console.log('Seeded user!');
}
