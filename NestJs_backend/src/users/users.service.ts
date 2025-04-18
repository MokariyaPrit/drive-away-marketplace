import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './entities/user.entity';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import * as bcrypt from 'bcrypt';
import { randomInt } from 'crypto';

@Injectable()
export class UsersService {
  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
  ) {}

  async findAll(role?: string): Promise<User[]> {
    if (role) {
      return this.usersRepository.find({ where: { role } });
    }
    return this.usersRepository.find();
  }

  async findById(id: string): Promise<User> {
    const user = await this.usersRepository.findOne({ where: { id } });
    if (!user) {
      throw new NotFoundException(`User with ID "${id}" not found`);
    }
    return user;
  }

  async findByEmail(email: string): Promise<User | null> {
    return this.usersRepository.findOne({ where: { email } });
  }

  async create(createUserDto: CreateUserDto): Promise<User> {
    const { password, ...rest } = createUserDto;
    // Always hash password here
    const hashedPassword = password 
      ? await bcrypt.hash(password, 10)
      : undefined;

    // Generate OTP for email verification
    const otp = randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now

    const user = this.usersRepository.create({
      ...rest,
      password: hashedPassword,
      otp,
      otpType: 'email_verification',
      otpExpiresAt,
      status: 'inactive',
    });

    return this.usersRepository.save(user);
  }

  async update(id: string, updateUserDto: Partial<User>): Promise<User> {
    await this.usersRepository.update(id, updateUserDto);
    return this.findById(id);
  }

  async clearExpiredOtps(): Promise<void> {
    const now = new Date();
    await this.usersRepository
      .createQueryBuilder()
      .update(User)
      .set({ otp: null, otpType: null, otpExpiresAt: null })
      .where('otpExpiresAt IS NOT NULL AND otpExpiresAt < :now', { now })
      .execute();
  }

  async remove(id: string): Promise<void> {
    const user = await this.findById(id);
    await this.usersRepository.remove(user);
  }
}
