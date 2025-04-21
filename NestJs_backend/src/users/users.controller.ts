import { 
  Controller, 
  Get, 
  Post, 
  Body, 
  Param, 
  Put, 
  Delete, 
  UseGuards,
  Query,
  BadRequestException,
  Request,
  ForbiddenException,
  InternalServerErrorException,
  Logger,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { UsersService } from './users.service';
import { CreateUserDto } from './dto/create-user.dto';
import { UpdateUserDto } from './dto/update-user.dto';
import { randomInt } from 'crypto';

@ApiTags('users')
@Controller('users')
@ApiBearerAuth()
export class UsersController {
  private readonly logger = new Logger(UsersController.name);
  
  constructor(private readonly usersService: UsersService) {}

  @Get()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get all users' })
  @ApiResponse({ status: 200, description: 'Return all users' })
  findAll(@Query('role') role?: string) {
    return this.usersService.findAll(role);
  }

  @Get(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Get a user by ID' })
  @ApiResponse({ status: 200, description: 'Return a user by ID' })
  @ApiResponse({ status: 404, description: 'User not found' })
  findOne(@Param('id') id: string) {
    return this.usersService.findById(id);
  }

  @Post()
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Create a new user' })
  @ApiResponse({ status: 201, description: 'User created successfully' })
  @ApiResponse({ status: 400, description: 'Bad request' })
  create(@Body() createUserDto: CreateUserDto) {
    return this.usersService.create(createUserDto);
  }

  @Post('verify-otp')
  async verifyOtp(
    @Body() body: { email: string; otp: string }
  ) {
    const user = await this.usersService.findByEmail(body.email);
    const now = new Date();
    if (
      !user ||
      user.otp !== body.otp ||
      user.otpType !== 'email_verification' ||
      !user.otpExpiresAt ||
      user.otpExpiresAt < now
    ) {
      throw new BadRequestException('Invalid or expired OTP');
    }
    user.status = 'active';
    user.otp = null;
    user.otpType = null;
    user.otpExpiresAt = null;
    await this.usersService.update(user.id, user);
    return { message: 'Email verified successfully' };
  }

  @Post('resend-otp')
  async resendOtp(@Body() body: { email: string }) {
    const user = await this.usersService.findByEmail(body.email);
    if (!user) {
      throw new BadRequestException('User not found');
    }
    // Generate new OTP and expiration
    const otp = randomInt(100000, 999999).toString();
    const otpExpiresAt = new Date(Date.now() + 2 * 60 * 1000); // 2 minutes from now
    user.otp = otp;
    user.otpType = 'email_verification';
    user.otpExpiresAt = otpExpiresAt;
    await this.usersService.update(user.id, user);
    // TODO: Send OTP via email here
    return { message: 'OTP resent successfully' };
  }

  @Put(':id')
  @UseGuards(JwtAuthGuard)
  @ApiOperation({ summary: 'Update a user' })
  @ApiResponse({ status: 200, description: 'User updated successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  async update(@Param('id') id: string, @Body() updateUserDto: UpdateUserDto, @Request() req) {
    try {
      // Check if the user is updating their own profile or is an admin
      if (req.user.id !== id && req.user.role !== 'admin') {
        this.logger.warn(`User ${req.user.id} tried to update profile of ${id} without permission`);
        throw new ForbiddenException('You do not have permission to update this profile');
      }
      
      // If updating as non-admin, ensure they can't modify restricted fields
      if (req.user.role !== 'admin') {
        // Remove any sensitive fields that regular users shouldn't be able to update
        delete updateUserDto.role;
        
        // Keep other allowed fields for regular user profile updates
        const allowedFields = {
          name: updateUserDto.name,
          email: updateUserDto.email,
          avatar: updateUserDto.avatar,
          phone: updateUserDto.phone, 
          location: updateUserDto.location,
        };
        
        // Filter out undefined values
        const filteredFields = Object.entries(allowedFields)
          .reduce((acc, [key, value]) => {
            if (value !== undefined) {
              acc[key] = value;
            }
            return acc;
          }, {});
        
        this.logger.log(`User ${req.user.id} updating their own profile with fields: ${JSON.stringify(filteredFields)}`);
        
        // Allow the update since it's the user's own profile with safe fields
        return this.usersService.update(id, filteredFields);
      }
      
      // If we get here, it's an admin update (all fields allowed)
      this.logger.log(`Admin ${req.user.id} updating user ${id}`);
      return this.usersService.update(id, updateUserDto);
    } catch (error) {
      this.logger.error(`Error updating user ${id}: ${error.message}`, error.stack);
      if (error instanceof ForbiddenException) {
        throw error;
      }
      throw new InternalServerErrorException('Failed to update user profile');
    }
  }

  @Delete(':id')
  @UseGuards(JwtAuthGuard, RolesGuard)
  @Roles('admin')
  @ApiOperation({ summary: 'Delete a user' })
  @ApiResponse({ status: 200, description: 'User deleted successfully' })
  @ApiResponse({ status: 404, description: 'User not found' })
  remove(@Param('id') id: string) {
    return this.usersService.remove(id);
  }
}
