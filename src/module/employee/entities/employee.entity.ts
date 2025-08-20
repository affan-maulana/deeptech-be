import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, OneToOne, JoinColumn, OneToMany } from 'typeorm';
import { Leave } from '../../leaves/entities/leave.entity';

@Entity('employees')
export class Employee {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ name: 'first_name', length: 100 })
  firstName: string;

  @Column({ name: 'last_name', length: 100 })
  lastName: string;

  @Column({ unique: true, length: 150 })
  email: string;

  @Column({ name: 'phone_number', length: 20 })
  phoneNumber: string;

  @Column({ type: 'text' })
  address: string;

  @Column({ type: 'enum', enum: ['male', 'female'] })
  gender: string;

  @Column({ name: 'remaining_leaves', type: 'int', default: 12 })
  remainingLeaves: number;

  @OneToMany(() => Leave, (leave) => leave.employee)
  leaves: Leave[];

  @CreateDateColumn({ name: 'created_at' })
  createdAt: Date;

  @UpdateDateColumn({ name: 'updated_at' })
  updatedAt: Date;

  @DeleteDateColumn({ name: 'deleted_at' })
  deletedAt: Date;
}
