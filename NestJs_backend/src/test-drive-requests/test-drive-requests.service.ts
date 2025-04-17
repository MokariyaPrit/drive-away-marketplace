
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { TestDriveRequest } from './entities/test-drive-request.entity';
import { CreateTestDriveRequestDto } from './dto/create-test-drive-request.dto';
import { CarsService } from '../cars/cars.service';
import { UsersService } from '../users/users.service';

@Injectable()
export class TestDriveRequestsService {
  constructor(
    @InjectRepository(TestDriveRequest)
    private testDriveRequestsRepository: Repository<TestDriveRequest>,
    private carsService: CarsService,
    private usersService: UsersService,
  ) {}

  async create(createTestDriveRequestDto: CreateTestDriveRequestDto, userId: string): Promise<TestDriveRequest> {
    const car = await this.carsService.findOne(createTestDriveRequestDto.carId);
    const user = await this.usersService.findById(userId);
    
    const request = this.testDriveRequestsRepository.create({
      ...createTestDriveRequestDto,
      user,
      car,
      manager: await this.usersService.findById(car.managerId),
      status: 'pending',
    });
    
    return this.testDriveRequestsRepository.save(request);
  }

  async findUserRequests(userId: string): Promise<TestDriveRequest[]> {
    return this.testDriveRequestsRepository.find({
      where: { user: { id: userId } },
      relations: ['car', 'user', 'manager'],
    });
  }

  async findManagerRequests(managerId: string): Promise<TestDriveRequest[]> {
    return this.testDriveRequestsRepository.find({
      where: { manager: { id: managerId } },
      relations: ['car', 'user', 'manager'],
    });
  }

  async findOne(id: string, user: any): Promise<TestDriveRequest> {
    const request = await this.testDriveRequestsRepository.findOne({
      where: { id },
      relations: ['car', 'user', 'manager'],
    });
    
    if (!request) {
      throw new NotFoundException(`Test drive request with ID "${id}" not found`);
    }
    
    // Check if user has access to this request
    if (user.role !== 'admin' && 
        user.id !== request.user.id && 
        user.id !== request.manager.id) {
      throw new ForbiddenException('You do not have access to this test drive request');
    }
    
    return request;
  }

  async approve(id: string, note: string, managerId: string): Promise<TestDriveRequest> {
    const request = await this.testDriveRequestsRepository.findOne({
      where: { id },
      relations: ['car', 'user', 'manager'],
    });
    
    if (!request) {
      throw new NotFoundException(`Test drive request with ID "${id}" not found`);
    }
    
    if (request.manager.id !== managerId) {
      throw new ForbiddenException('You do not have permission to approve this request');
    }
    
    if (request.status !== 'pending') {
      throw new ForbiddenException('Request has already been processed');
    }
    
    request.status = 'approved';
    request.note = note;
    
    return this.testDriveRequestsRepository.save(request);
  }

  async reject(id: string, reason: string, managerId: string): Promise<TestDriveRequest> {
    const request = await this.testDriveRequestsRepository.findOne({
      where: { id },
      relations: ['car', 'user', 'manager'],
    });
    
    if (!request) {
      throw new NotFoundException(`Test drive request with ID "${id}" not found`);
    }
    
    if (request.manager.id !== managerId) {
      throw new ForbiddenException('You do not have permission to reject this request');
    }
    
    if (request.status !== 'pending') {
      throw new ForbiddenException('Request has already been processed');
    }
    
    request.status = 'rejected';
    request.rejectionReason = reason;
    
    return this.testDriveRequestsRepository.save(request);
  }

  async sendMessage(id: string, message: string, user: any): Promise<void> {
    const request = await this.testDriveRequestsRepository.findOne({
      where: { id },
      relations: ['user', 'manager'],
    });
    
    if (!request) {
      throw new NotFoundException(`Test drive request with ID "${id}" not found`);
    }
    
    // Check if user has access to send a message
    if (user.id !== request.user.id && user.id !== request.manager.id && user.role !== 'admin') {
      throw new ForbiddenException('You do not have permission to send a message for this request');
    }
    
    // In a real application, you would save the message to a messages table
    // and potentially send notifications to the user/manager
    
    // For now, we'll just update the request with the latest message
    request.latestMessage = message;
    request.latestMessageSender = user.id;
    request.latestMessageTimestamp = new Date();
    
    await this.testDriveRequestsRepository.save(request);
  }
}
