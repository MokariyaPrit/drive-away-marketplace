
import {
  Controller,
  Get,
  Post,
  Put,
  Body,
  Param,
  UseGuards,
  Req,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiBearerAuth } from '@nestjs/swagger';
import { JwtAuthGuard } from '../auth/guards/jwt-auth.guard';
import { RolesGuard } from '../auth/guards/roles.guard';
import { Roles } from '../auth/decorators/roles.decorator';
import { CarSubmissionsService } from './car-submissions.service';
import { CreateCarSubmissionDto } from './dto/create-car-submission.dto';
import { ApproveSubmissionDto } from './dto/approve-submission.dto';
import { RejectSubmissionDto } from './dto/reject-submission.dto';

@ApiTags('car-submissions')
@Controller('car-submissions')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class CarSubmissionsController {
  constructor(private readonly carSubmissionsService: CarSubmissionsService) {}

  @Post()
  @Roles('user')
  @ApiOperation({ summary: 'Create a car submission' })
  @ApiResponse({ status: 201, description: 'Submission created successfully' })
  create(@Body() createCarSubmissionDto: CreateCarSubmissionDto, @Req() req) {
    return this.carSubmissionsService.create(createCarSubmissionDto, req.user.id);
  }

  @Get()
  @Roles('admin')
  @ApiOperation({ summary: 'Get all car submissions' })
  @ApiResponse({ status: 200, description: 'Return all car submissions' })
  findAll() {
    return this.carSubmissionsService.findAll();
  }

  @Get('user')
  @Roles('user')
  @ApiOperation({ summary: 'Get user car submissions' })
  @ApiResponse({ status: 200, description: 'Return user car submissions' })
  findUserSubmissions(@Req() req) {
    return this.carSubmissionsService.findUserSubmissions(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a car submission by ID' })
  @ApiResponse({ status: 200, description: 'Return a car submission' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.carSubmissionsService.findOne(id, req.user);
  }

  @Put(':id/approve')
  @Roles('admin')
  @ApiOperation({ summary: 'Approve a car submission' })
  @ApiResponse({ status: 200, description: 'Submission approved successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  approve(@Param('id') id: string, @Body() approveSubmissionDto: ApproveSubmissionDto) {
    return this.carSubmissionsService.approve(id, approveSubmissionDto.feedback);
  }

  @Put(':id/reject')
  @Roles('admin')
  @ApiOperation({ summary: 'Reject a car submission' })
  @ApiResponse({ status: 200, description: 'Submission rejected successfully' })
  @ApiResponse({ status: 404, description: 'Submission not found' })
  reject(@Param('id') id: string, @Body() rejectSubmissionDto: RejectSubmissionDto) {
    return this.carSubmissionsService.reject(id, rejectSubmissionDto.feedback);
  }
}
