import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { Throttle } from '@nestjs/throttler';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { UpdateProfileDto } from './dto/update-profile.dto';
import { PaginationQueryDto } from './dto/pagination-query.dto';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  @Throttle({ default: { limit: 60, ttl: 60000 } })
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Patch('profile')
  @Throttle({ default: { limit: 20, ttl: 60000 } })
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: UpdateProfileDto,
  ) {
    return this.usersService.updateProfile(userId, body);
  }

  // ---------------------------------------------------------------------------
  // Admin Protected Routes (RBAC)
  // ---------------------------------------------------------------------------
  @Get('admin/roster')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async getAdminRoster(@Query() query: PaginationQueryDto) {
    return this.usersService.getAllUsersForAdmin(
      query.limit ?? 50,
      query.page ?? 1,
    );
  }

  @Get('admin/stats')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  @Throttle({ default: { limit: 30, ttl: 60000 } })
  async getAdminStats() {
    return this.usersService.getAdminStats();
  }
}

