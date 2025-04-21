
import { IsEmail, IsString, MinLength, IsEnum, IsOptional, IsUrl } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';

export class UpdateUserDto {
  @ApiProperty({ example: 'john@example.com' })
  @IsEmail()
  @IsOptional()
  email?: string;

  @ApiProperty({ example: 'John Doe' })
  @IsString()
  @IsOptional()
  name?: string;

  @ApiProperty({ example: 'Password123' })
  @IsString()
  @MinLength(6)
  @IsOptional()
  password?: string;

  @ApiProperty({ example: 'user', enum: ['user', 'admin', 'manager'] })
  @IsEnum(['user', 'admin', 'manager'])
  @IsOptional()
  role?: string;

  @ApiProperty({ example: 'https://example.com/avatar.jpg' })
  @IsUrl({ require_protocol: true }, { message: 'Avatar must be a valid URL' })
  @IsOptional()
  avatar?: string;

  @ApiProperty({ example: '+1234567890' })
  @IsString()
  @IsOptional()
  phone?: string;

  @ApiProperty({ example: 'New York, USA' })
  @IsString()
  @IsOptional()
  location?: string;
}
