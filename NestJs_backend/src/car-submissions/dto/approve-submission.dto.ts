
import { IsString, IsOptional } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class ApproveSubmissionDto {
  @ApiProperty({ example: 'Your car submission has been approved. The listing is now live.' })
  @IsString()
  @IsOptional()
  feedback?: string;
}
