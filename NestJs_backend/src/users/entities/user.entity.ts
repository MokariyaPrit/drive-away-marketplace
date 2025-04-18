import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from 'typeorm';
import { Exclude } from 'class-transformer';
import { Car } from '../../cars/entities/car.entity';
import { TestDriveRequest } from '../../test-drive-requests/entities/test-drive-request.entity';
import { CarSubmission } from '../../car-submissions/entities/car-submission.entity';

@Entity('users')
export class User {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column({ unique: true })
  email: string;

  @Column()
  name: string;

  @Column()
  password: string;

  @Column({ 
    type: 'enum', 
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  })
  role: string;

  @Column({ nullable: true })
  otp: string;

  @Column({ nullable: true })
  otpType: 'email_verification' | 'forgot_password';

  @Column({ nullable: true, type: 'timestamp' })
  otpExpiresAt: Date;

  @Column({ 
    type: 'enum', 
    enum: ['active', 'inactive'],
    default: 'inactive'
  })
  status: 'active' | 'inactive';

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => Car, car => car.owner)
  cars: Car[];

  @OneToMany(() => TestDriveRequest, request => request.user)
  testDriveRequests: TestDriveRequest[];

  @OneToMany(() => CarSubmission, submission => submission.user)
  carSubmissions: CarSubmission[];
}
