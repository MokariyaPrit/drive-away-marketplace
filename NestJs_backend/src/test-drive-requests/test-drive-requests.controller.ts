
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
import { TestDriveRequestsService } from './test-drive-requests.service';
import { CreateTestDriveRequestDto } from './dto/create-test-drive-request.dto';
import { ApproveRequestDto } from './dto/approve-request.dto';
import { RejectRequestDto } from './dto/reject-request.dto';
import { MessageRequestDto } from './dto/message-request.dto';

@ApiTags('test-drive-requests')
@Controller('test-drive-requests')
@UseGuards(JwtAuthGuard, RolesGuard)
@ApiBearerAuth()
export class TestDriveRequestsController {
  constructor(private readonly testDriveRequestsService: TestDriveRequestsService) {}

  @Post()
  @Roles('user')
  @ApiOperation({ summary: 'Create a test drive request' })
  @ApiResponse({ status: 201, description: 'Request created successfully' })
  create(@Body() createTestDriveRequestDto: CreateTestDriveRequestDto, @Req() req) {
    return this.testDriveRequestsService.create(createTestDriveRequestDto, req.user.id);
  }

  @Get()
  @Roles('user')
  @ApiOperation({ summary: 'Get user test drive requests' })
  @ApiResponse({ status: 200, description: 'Return user test drive requests' })
  findUserRequests(@Req() req) {
    return this.testDriveRequestsService.findUserRequests(req.user.id);
  }

  @Get('manager')
  @Roles('manager')
  @ApiOperation({ summary: 'Get manager test drive requests' })
  @ApiResponse({ status: 200, description: 'Return manager test drive requests' })
  findManagerRequests(@Req() req) {
    return this.testDriveRequestsService.findManagerRequests(req.user.id);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get a test drive request by ID' })
  @ApiResponse({ status: 200, description: 'Return a test drive request' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  findOne(@Param('id') id: string, @Req() req) {
    return this.testDriveRequestsService.findOne(id, req.user);
  }

  @Put(':id/approve')
  @Roles('manager')
  @ApiOperation({ summary: 'Approve a test drive request' })
  @ApiResponse({ status: 200, description: 'Request approved successfully' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  approve(@Param('id') id: string, @Body() approveRequestDto: ApproveRequestDto, @Req() req) {
    return this.testDriveRequestsService.approve(id, approveRequestDto.note, req.user.id);
  }

  @Put(':id/reject')
  @Roles('manager')
  @ApiOperation({ summary: 'Reject a test drive request' })
  @ApiResponse({ status: 200, description: 'Request rejected successfully' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  reject(@Param('id') id: string, @Body() rejectRequestDto: RejectRequestDto, @Req() req) {
    return this.testDriveRequestsService.reject(id, rejectRequestDto.reason, req.user.id);
  }

  @Post(':id/message')
  @ApiOperation({ summary: 'Send a message about a test drive request' })
  @ApiResponse({ status: 200, description: 'Message sent successfully' })
  @ApiResponse({ status: 404, description: 'Request not found' })
  sendMessage(@Param('id') id: string, @Body() messageRequestDto: MessageRequestDto, @Req() req) {
    return this.testDriveRequestsService.sendMessage(id, messageRequestDto.message, req.user);
  }
}
