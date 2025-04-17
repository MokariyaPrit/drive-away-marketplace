
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, OneToMany, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { TestDriveRequest } from '../../test-drive-requests/entities/test-drive-request.entity';

@Entity('cars')
export class Car {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @Column()
  make: string;

  @Column()
  model: string;

  @Column()
  year: number;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  price: number;

  @Column()
  mileage: number;

  @Column({ type: 'text', array: true })
  images: string[];

  @Column({ type: 'text' })
  description: string;

  @Column()
  color: string;

  @Column()
  transmission: string;

  @Column()
  fuelType: string;

  @Column({ type: 'text', array: true })
  features: string[];

  @Column({ default: true })
  isAvailable: boolean;

  @ManyToOne(() => User, user => user.cars)
  @JoinColumn({ name: 'owner_id' })
  owner: User;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @OneToMany(() => TestDriveRequest, testDriveRequest => testDriveRequest.car)
  testDriveRequests: TestDriveRequest[];

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
