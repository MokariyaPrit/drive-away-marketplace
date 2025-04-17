
import { Injectable, NotFoundException, ForbiddenException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';
import { Car } from './entities/car.entity';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';
import { UsersService } from '../users/users.service';

@Injectable()
export class CarsService {
  constructor(
    @InjectRepository(Car)
    private carsRepository: Repository<Car>,
    private usersService: UsersService,
  ) {}

  async findAll(filters: {
    make?: string;
    model?: string;
    minPrice?: number;
    maxPrice?: number;
    year?: number;
  }): Promise<Car[]> {
    const where: FindOptionsWhere<Car> = {};
    
    if (filters.make) {
      where.make = filters.make;
    }
    
    if (filters.model) {
      where.model = filters.model;
    }
    
    if (filters.year) {
      where.year = filters.year;
    }
    
    if (filters.minPrice || filters.maxPrice) {
      where.price = Between(
        filters.minPrice || 0,
        filters.maxPrice || 1000000
      );
    }
    
    return this.carsRepository.find({
      where,
      relations: ['owner', 'manager'],
    });
  }

  async findUserCars(userId: string): Promise<Car[]> {
    return this.carsRepository.find({
      where: { owner: { id: userId } },
      relations: ['owner', 'manager'],
    });
  }

  async findManagerCars(managerId: string): Promise<Car[]> {
    return this.carsRepository.find({
      where: { manager: { id: managerId } },
      relations: ['owner', 'manager'],
    });
  }

  async findOne(id: string): Promise<Car> {
    const car = await this.carsRepository.findOne({
      where: { id },
      relations: ['owner', 'manager'],
    });
    
    if (!car) {
      throw new NotFoundException(`Car with ID "${id}" not found`);
    }
    
    return car;
  }

  async create(createCarDto: CreateCarDto, userId: string): Promise<Car> {
    const { owner: ownerId, manager: managerId, ...carData } = createCarDto;
    
    const owner = await this.usersService.findById(ownerId || userId);
    const manager = await this.usersService.findById(managerId || userId);
    
    const car = this.carsRepository.create({
      ...carData,
      owner,
      manager,
    });
    
    return this.carsRepository.save(car);
  }

  async update(id: string, updateCarDto: UpdateCarDto, user: any): Promise<Car> {
    const car = await this.findOne(id);
    
    // Check if user is authorized to update this car
    if (user.role !== 'admin' && car.manager.id !== user.id) {
      throw new ForbiddenException('You do not have permission to update this car');
    }
    
    // Update references if provided
    if (updateCarDto.owner) {
      const owner = await this.usersService.findById(updateCarDto.owner);
      car.owner = owner;
    }
    
    if (updateCarDto.manager) {
      const manager = await this.usersService.findById(updateCarDto.manager);
      car.manager = manager;
    }
    
    // Update car data
    const { owner, manager, ...carData } = updateCarDto;
    Object.assign(car, carData);
    
    return this.carsRepository.save(car);
  }

  async remove(id: string, user: any): Promise<void> {
    const car = await this.findOne(id);
    
    // Check if user is authorized to delete this car
    if (user.role !== 'admin' && car.manager.id !== user.id) {
      throw new ForbiddenException('You do not have permission to delete this car');
    }
    
    await this.carsRepository.remove(car);
  }
}
