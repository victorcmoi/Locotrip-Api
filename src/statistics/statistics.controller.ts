import { Controller, Get, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { StatisticsService } from './statistics.service';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '../users/enums/user.enum';

@ApiTags('Statistics')
@ApiBearerAuth('JWT-auth')
@Controller('statistics')
export class StatisticsController {
  constructor(private readonly statisticsService: StatisticsService) {}

  @Get('dashboard')
  @ApiOperation({ summary: 'Récupérer les statistiques du tableau de bord' })
  getDashboardStats() {
    return this.statisticsService.getDashboardStats();
  }
}
