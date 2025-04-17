
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class RejectSubmissionDto {
  @ApiProperty({ example: 'We were unable to approve your car submission due to incomplete information.' })
  @IsString()
  @IsNotEmpty()
  feedback: string;
}
