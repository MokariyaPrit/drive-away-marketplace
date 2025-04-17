
import { IsNotEmpty, IsString, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateCarDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsNotEmpty()
  make: string;

  @ApiProperty({ example: 'Camry' })
  @IsString()
  @IsNotEmpty()
  model: string;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  year: number;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  price: number;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  mileage: number;

  @ApiProperty({ example: ['http://example.com/image1.jpg'] })
  @IsArray()
  images: string[];

  @ApiProperty({ example: 'Well-maintained Toyota Camry with low mileage.' })
  @IsString()
  @IsNotEmpty()
  description: string;

  @ApiProperty({ example: 'Blue' })
  @IsString()
  @IsNotEmpty()
  color: string;

  @ApiProperty({ example: 'Automatic' })
  @IsString()
  @IsNotEmpty()
  transmission: string;

  @ApiProperty({ example: 'Gasoline' })
  @IsString()
  @IsNotEmpty()
  fuelType: string;

  @ApiProperty({ example: ['Bluetooth', 'Backup Camera', 'Navigation'] })
  @IsArray()
  features: string[];

  @ApiProperty({ example: true })
  @IsBoolean()
  @IsOptional()
  isAvailable?: boolean;

  @ApiProperty({ example: 'user-uuid' })
  @IsString()
  @IsOptional()
  owner?: string;

  @ApiProperty({ example: 'manager-uuid' })
  @IsString()
  @IsOptional()
  manager?: string;
}
