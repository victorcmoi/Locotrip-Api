import { Injectable } from '@nestjs/common';
import { PrismaService } from '../prisma.service';
import { UserRole } from '../users/enums/user.enum';
import { BookingStatus } from '../bookings/enums/booking.enum';
import { SupportTicketStatus } from '../support/enums/ticket-message.enum';
import { DisputeStatus } from '../bookings/enums/dispute.enum';

@Injectable()
export class StatisticsService {
  constructor(private prisma: PrismaService) {}

  async getDashboardStats() {
    const [
      totalUsers,
      usersByRole,
      totalGuides,
      guidesByStatus,
      totalBookings,
      bookingsByStatus,
      openTickets,
      pendingDisputes,
    ] = await Promise.all([
      // Total Users
      this.prisma.user.count(),
      
      // Users by Role
      this.prisma.user.groupBy({
        by: ['role'],
        _count: {
          role: true,
        },
      }),

      // Total Guides
      this.prisma.guide.count(),

      // Guides by Status
      this.prisma.guide.groupBy({
        by: ['guide_status'],
        _count: {
          guide_status: true,
        },
      }),

      // Total Bookings
      this.prisma.booking.count(),

      // Bookings by Status
      this.prisma.booking.groupBy({
        by: ['status'],
        _count: {
          status: true,
        },
      }),

      // Open Tickets
      this.prisma.support_ticket.count({
        where: {
          status: SupportTicketStatus.OUVERT,
        },
      }),

      // Pending Disputes
      this.prisma.dispute.count({
        where: {
          status: DisputeStatus.PENDING,
        },
      }),
    ]);

    return {
      users: {
        total: totalUsers,
        breakdown: usersByRole.map((item) => ({
          name: item.role,
          value: item._count.role,
        })),
      },
      guides: {
        total: totalGuides,
        breakdown: guidesByStatus.map((item) => ({
          name: item.guide_status,
          value: item._count.guide_status,
        })),
      },
      bookings: {
        total: totalBookings,
        breakdown: bookingsByStatus.map((item) => ({
          name: item.status,
          value: item._count.status,
        })),
      },
      tickets: {
        open: openTickets,
      },
      disputes: {
        pending: pendingDisputes,
      },
    };
  }
}
