
import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  Query,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CarsService } from './cars.service';
import { CreateCarDto } from './dto/create-car.dto';
import { UpdateCarDto } from './dto/update-car.dto';

@ApiTags('cars')
@Controller('cars')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CarsController {
  constructor(private readonly carsService: CarsService) {}

  @Get()
  @ApiOperation({ summary: 'Get all cars' })
  @ApiResponse({ status: 200, description: 'Return all cars' })
  findAll(
    @Query('make') make?: string,
    @Query('model') model?: string,
    @Query('minPrice') minPrice?: number,
    @Query('maxPrice') maxPrice?: number,
    @Query('year') year?: number,
  ) {
    return this.carsService.findAll({
      make,
      model,
      minPrice,
      maxPrice,
      year,
    });
  }

  @Get('user')
  @Roles('user')
  @ApiOperation({ summary: 'Get user cars' })
  @ApiResponse({ status: 200, description: 'Return user cars' })
  findUserCars(@Req() req) {
    return this.carsService.findUserCars(req.user.id);
  }

  @Get('manager')
  @Roles('manager')
  @ApiOperation({ summary: 'Get manager cars' })
  @ApiResponse({ status: 200, description: 'Return manager cars' })
  findManagerCars(@Req() req) {
    return this.carsService.findManagerCars(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car by ID' })
  @ApiResponse({ status: 200, description: 'Return a car by ID' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  findOne(@Param('id') id: string) {
    return this.carsService.findOne(id);
  }

  @Post()
  @Roles('manager', 'admin')
  @ApiOperation({ summary: 'Create a new car' })
  @ApiResponse({ status: 201, description: 'Car created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createCarDto: CreateCarDto, @Req() req) {
    return this.carsService.create(createCarDto, req.user.id);
  }

  @Put(':id')
  @Roles('manager', 'admin')
  @ApiOperation({ summary: 'Update a car' })
  @ApiResponse({ status: 200, description: 'Car updated successfully' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  update(@Param('id') id: string, @Body() updateCarDto: UpdateCarDto, @Req() req) {
    return this.carsService.update(id, updateCarDto, req.user);
  }

  @Delete(':id')
  @Roles('manager', 'admin')
  @ApiOperation({ summary: 'Delete a car' })
  @ApiResponse({ status: 200, description: 'Car deleted successfully' })
  @ApiResponse({ status: 404, description: 'Car not found' })
  remove(@Param('id') id: string, @Req() req) {
    return this.carsService.remove(id, req.user);
  }
}
