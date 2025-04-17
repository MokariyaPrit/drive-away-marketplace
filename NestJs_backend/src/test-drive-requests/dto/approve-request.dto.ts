
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveRequestDto {
  @ApiProperty({ example: 'Please arrive 10 minutes before the appointment.' })
  @IsString()
  @IsOptional()
  note?: string;
}
