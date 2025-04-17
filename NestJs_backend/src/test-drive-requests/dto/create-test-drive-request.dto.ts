
import { IsNotEmpty, IsString, IsDateString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class CreateTestDriveRequestDto {
  @ApiProperty({ example: 'car-uuid' })
  @IsString()
  @IsNotEmpty()
  carId: string;

  @ApiProperty({ example: '2023-04-18T14:00:00Z' })
  @IsDateString()
  @IsNotEmpty()
  preferredDate: string;

  @ApiProperty({ example: 'Afternoon' })
  @IsString()
  @IsOptional()
  preferredTimeSlot?: string;

  @ApiProperty({ example: 'I would like to test the acceleration and handling.' })
  @IsString()
  @IsOptional()
  message?: string;
}
