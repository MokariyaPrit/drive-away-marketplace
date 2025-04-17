
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, ManyToOne, JoinColumn } from 'typeorm';
import { User } from '../../users/entities/user.entity';
import { Car } from '../../cars/entities/car.entity';

@Entity('test_drive_requests')
export class TestDriveRequest {
  @PrimaryGeneratedColumn('uuid')
  id: string;

  @ManyToOne(() => User, user => user.testDriveRequests)
  @JoinColumn({ name: 'user_id' })
  user: User;

  @ManyToOne(() => Car, car => car.testDriveRequests)
  @JoinColumn({ name: 'car_id' })
  car: Car;

  @ManyToOne(() => User)
  @JoinColumn({ name: 'manager_id' })
  manager: User;

  @Column({ 
    type: 'enum', 
    enum: ['pending', 'approved', 'rejected'],
    default: 'pending'
  })
  status: string;

  @Column({ type: 'timestamp' })
  preferredDate: Date;

  @Column({ nullable: true })
  preferredTimeSlot: string;

  @Column({ type: 'text', nullable: true })
  message: string;

  @Column({ type: 'text', nullable: true })
  note: string;

  @Column({ type: 'text', nullable: true })
  rejectionReason: string;

  @Column({ type: 'text', nullable: true })
  latestMessage: string;

  @Column({ nullable: true })
  latestMessageSender: string;

  @Column({ type: 'timestamp', nullable: true })
  latestMessageTimestamp: Date;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
