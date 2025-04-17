
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CarSubmission } from './entities/car-submission.entity';
import { CreateCarSubmissionDto } from './dto/create-car-submission.dto';
import { UsersService } from '../users/users.service';
import { CarsService } from '../cars/cars.service';

@Injectable()
export class CarSubmissionsService {
  constructor(
    @InjectRepository(CarSubmission)
    private carSubmissionsRepository: Repository<CarSubmission>,
    private usersService: UsersService,
    private carsService: CarsService,
  ) {}

  async create(createCarSubmissionDto: CreateCarSubmissionDto, userId: string): Promise<CarSubmission> {
    const user = await this.usersService.findById(userId);
    
    const submission = this.carSubmissionsRepository.create({
      ...createCarSubmissionDto,
      user,
      status: 'pending',
    });
    
    return this.carSubmissionsRepository.save(submission);
  }

  async findAll(): Promise<CarSubmission[]> {
    return this.carSubmissionsRepository.find({
      relations: ['user'],
    });
  }

  async findUserSubmissions(userId: string): Promise<CarSubmission[]> {
    return this.carSubmissionsRepository.find({
      where: { user: { id: userId } },
      relations: ['user'],
    });
  }

  async findOne(id: string, user: any): Promise<CarSubmission> {
    const submission = await this.carSubmissionsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!submission) {
      throw new NotFoundException(`Car submission with ID "${id}" not found`);
    }
    
    // Check if user has access to this submission
    if (user.role !== 'admin' && user.id !== submission.user.id) {
      throw new ForbiddenException('You do not have access to this car submission');
    }
    
    return submission;
  }

  async approve(id: string, feedback?: string): Promise<CarSubmission> {
    const submission = await this.carSubmissionsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!submission) {
      throw new NotFoundException(`Car submission with ID "${id}" not found`);
    }
    
    if (submission.status !== 'pending') {
      throw new ForbiddenException('Submission has already been processed');
    }
    
    // Create a new car from the submission details
    await this.carsService.create({
      ...submission.carDetails,
      owner: submission.user.id,
      // Assign a manager (in a real app, you might have a more sophisticated way of assigning managers)
      manager: (await this.usersService.findAll('manager'))[0]?.id,
    }, submission.user.id);
    
    // Update submission status
    submission.status = 'approved';
    submission.adminFeedback = feedback;
    
    return this.carSubmissionsRepository.save(submission);
  }

  async reject(id: string, feedback: string): Promise<CarSubmission> {
    const submission = await this.carSubmissionsRepository.findOne({
      where: { id },
      relations: ['user'],
    });
    
    if (!submission) {
      throw new NotFoundException(`Car submission with ID "${id}" not found`);
    }
    
    if (submission.status !== 'pending') {
      throw new ForbiddenException('Submission has already been processed');
    }
    
    submission.status = 'rejected';
    submission.adminFeedback = feedback;
    
    return this.carSubmissionsRepository.save(submission);
  }
}
