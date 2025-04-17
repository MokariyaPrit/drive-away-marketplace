
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CarSubmissionsController } from './car-submissions.controller';
import { CarSubmissionsService } from './car-submissions.service';
import { CarSubmission } from './entities/car-submission.entity';
import { UsersModule } from '../users/users.module';
import { CarsModule } from '../cars/cars.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CarSubmission]),
    UsersModule,
    CarsModule,
  ],
  controllers: [CarSubmissionsController],
  providers: [CarSubmissionsService],
  exports: [CarSubmissionsService],
})
export class CarSubmissionsModule {}
