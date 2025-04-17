
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
  @Exclude({ toPlainOnly: true })
  password: string;

  @Column({ 
    type: 'enum', 
    enum: ['user', 'admin', 'manager'],
    default: 'user'
  })
  role: string;

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
