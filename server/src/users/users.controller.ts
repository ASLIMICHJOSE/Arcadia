import {
  Body,
  Controller,
  Get,
  Patch,
  Query,
  UseGuards,
} from '@nestjs/common';
import { UsersService } from './users.service';
import { CurrentUser } from '../auth/decorators/current-user.decorator';
import { Roles } from '../auth/decorators/roles.decorator';
import { RolesGuard } from '../auth/guards/roles.guard';
import { AuthenticatedUser } from '../auth/interfaces/jwt-payload.interface';

@Controller('users')
export class UsersController {
  constructor(private readonly usersService: UsersService) {}

  @Get('profile')
  async getProfile(@CurrentUser('id') userId: string) {
    return this.usersService.findById(userId);
  }

  @Patch('profile')
  async updateProfile(
    @CurrentUser('id') userId: string,
    @Body() body: { avatar?: string; title?: string },
  ) {
    return this.usersService.updateProfile(userId, body);
  }

  // ---------------------------------------------------------------------------
  // Admin Protected Routes (RBAC)
  // ---------------------------------------------------------------------------
  @Get('admin/roster')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async getAdminRoster(
    @Query('page') page?: string,
    @Query('limit') limit?: string,
  ) {
    return this.usersService.getAllUsersForAdmin(
      limit ? parseInt(limit, 10) : 50,
      page ? parseInt(page, 10) : 1,
    );
  }

  @Get('admin/stats')
  @Roles('ADMIN')
  @UseGuards(RolesGuard)
  async getAdminStats() {
    return this.usersService.getAdminStats();
  }
}

