
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TestDriveRequestsController } from './test-drive-requests.controller';
import { TestDriveRequestsService } from './test-drive-requests.service';
import { TestDriveRequest } from './entities/test-drive-request.entity';
import { CarsModule } from '../cars/cars.module';
import { UsersModule } from '../users/users.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([TestDriveRequest]),
    CarsModule,
    UsersModule,
  ],
  controllers: [TestDriveRequestsController],
  providers: [TestDriveRequestsService],
  exports: [TestDriveRequestsService],
})
export class TestDriveRequestsModule {}
