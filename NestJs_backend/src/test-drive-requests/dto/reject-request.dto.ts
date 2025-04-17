
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectRequestDto {
  @ApiProperty({ example: 'The car is not available at the requested time.' })
  @IsString()
  @IsNotEmpty()
  reason: string;
}
