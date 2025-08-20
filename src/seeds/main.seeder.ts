import { AppDataSource } from '../utils/data-source';
import { seedEmployee } from './employee.seeder';
import { seedUser } from './user.seeder';

async function main() {
  await AppDataSource.initialize();

  await seedUser(AppDataSource);
  await seedEmployee(AppDataSource);

  await AppDataSource.destroy();
  console.log('All seeders executed!');
}

main();