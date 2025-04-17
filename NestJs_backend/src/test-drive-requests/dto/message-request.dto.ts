
import { IsString, IsNotEmpty } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class MessageRequestDto {
  @ApiProperty({ example: 'I have a question about the upcoming test drive.' })
  @IsString()
  @IsNotEmpty()
  message: string;
}
