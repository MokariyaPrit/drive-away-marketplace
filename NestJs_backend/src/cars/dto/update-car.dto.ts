
import { IsString, IsNumber, IsArray, IsOptional, IsBoolean } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateCarDto {
  @ApiProperty({ example: 'Toyota' })
  @IsString()
  @IsOptional()
  make?: string;

  @ApiProperty({ example: 'Camry' })
  @IsString()
  @IsOptional()
  model?: string;

  @ApiProperty({ example: 2020 })
  @IsNumber()
  @IsOptional()
  year?: number;

  @ApiProperty({ example: 25000 })
  @IsNumber()
  @IsOptional()
  price?: number;

  @ApiProperty({ example: 15000 })
  @IsNumber()
  @IsOptional()
  mileage?: number;

  @ApiProperty({ example: ['http://example.com/image1.jpg'] })
  @IsArray()
  @IsOptional()
  images?: string[];

  @ApiProperty({ example: 'Well-maintained Toyota Camry with low mileage.' })
  @IsString()
  @IsOptional()
  description?: string;

  @ApiProperty({ example: 'Blue' })
  @IsString()
  @IsOptional()
  color?: string;

  @ApiProperty({ example: 'Automatic' })
  @IsString()
  @IsOptional()
  transmission?: string;

  @ApiProperty({ example: 'Gasoline' })
  @IsString()
  @IsOptional()
  fuelType?: string;

  @ApiProperty({ example: ['Bluetooth', 'Backup Camera', 'Navigation'] })
  @IsArray()
  @IsOptional()
  features?: string[];

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
