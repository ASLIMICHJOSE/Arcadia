import { Injectable, NotFoundException } from '@nestjs/common';
import { PrismaService } from '../prisma/prisma.service';

@Injectable()
export class UsersService {
  constructor(private readonly prisma: PrismaService) {}

  async findById(id: string) {
    const user = await this.prisma.user.findUnique({
      where: { id },
      include: {
        playerProfile: true,
        accounts: {
          select: {
            provider: true,
            createdAt: true,
          },
        },
      },
    });

    if (!user) {
      throw new NotFoundException('Contender not found');
    }

    return {
      id: user.id,
      username: user.username,
      email: user.email,
      avatar: user.avatar,
      emailVerified: user.emailVerified,
      role: user.role,
      createdAt: user.createdAt,
      updatedAt: user.updatedAt,
      playerProfile: user.playerProfile,
      connectedAccounts: user.accounts,
    };
  }

  async updateProfile(userId: string, data: { avatar?: string; title?: string }) {
    if (data.avatar) {
      await this.prisma.user.update({
        where: { id: userId },
        data: { avatar: data.avatar },
      });
    }

    if (data.title) {
      await this.prisma.playerProfile.update({
        where: { userId },
        data: { title: data.title },
      });
    }

    return this.findById(userId);
  }

  async getAllUsersForAdmin(limit = 50, page = 1) {
    const skip = (page - 1) * limit;
    const [users, total] = await Promise.all([
      this.prisma.user.findMany({
        skip,
        take: limit,
        select: {
          id: true,
          username: true,
          email: true,
          role: true,
          avatar: true,
          emailVerified: true,
          createdAt: true,
          playerProfile: true,
        },
        orderBy: { createdAt: 'desc' },
      }),
      this.prisma.user.count(),
    ]);

    return { users, total, page, limit };
  }

  async getAdminStats() {
    const [totalUsers, verifiedUsers, activeSessions, totalDuels] = await Promise.all([
      this.prisma.user.count(),
      this.prisma.user.count({ where: { emailVerified: true } }),
      this.prisma.session.count({ where: { expiresAt: { gt: new Date() } } }),
      this.prisma.playerProfile.aggregate({ _sum: { duelsWon: true } }),
    ]);

    return {
      totalUsers,
      verifiedUsers,
      activeSessions,
      totalDuelsWon: totalDuels._sum.duelsWon || 0,
    };
  }
}

