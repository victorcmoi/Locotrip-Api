import {
  Controller,
  Get,
  Post,
  Put,
  Delete,
  Body,
  Param,
  HttpCode,
  HttpStatus,
} from '@nestjs/common';
import {
  ApiTags,
  ApiOperation,
  ApiParam,
  ApiBearerAuth,
} from '@nestjs/swagger';
import { ReviewService } from './review.service';
import { SubscriptionService } from './subscription.service';
import { CreateReviewDto } from './dto/create-review.dto';
import { UpdateReviewDto } from './dto/update-review.dto';
import { CreateSubscriptionDto } from './dto/create-subscription.dto';
import { UpdateSubscriptionDto } from './dto/update-subscription.dto';
import { ReviewEntity } from './entities/review.entity';
import {
  ApiCreateResponse,
  ApiGetManyResponse,
  ApiGetOneResponse,
  ApiUpdateResponse,
  ApiDeleteResponse,
} from '../common/decorators/api-standard-responses.decorator';
import { UserRole } from '../users/enums/user.enum';
import { Roles } from '../common/decorators/role.decorator';
import { Public } from '../common/decorators/authentification-decorator';

@ApiTags('Avis')
@ApiBearerAuth('JWT-auth')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un avis' })
  @ApiCreateResponse(ReviewEntity)
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @Public()
  @ApiOperation({ summary: 'Récupérer tous les avis' })
  @ApiGetManyResponse(ReviewEntity)
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer un avis par son ID' })
  @ApiParam({ name: 'id', description: "ID de l'avis" })
  @ApiGetOneResponse(ReviewEntity)
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Get('experience/:experienceId')
  @Public()
  @ApiOperation({ summary: "Récupérer les avis d'une expérience" })
  @ApiParam({ name: 'experienceId', description: "ID de l'expérience" })
  @ApiGetManyResponse(ReviewEntity)
  findByExperience(@Param('experienceId') experienceId: string) {
    return this.reviewService.findByExperience(experienceId);
  }

  @Get('user/:userId')
  @Public()
  @ApiOperation({ summary: "Récupérer les avis d'un utilisateur" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiGetManyResponse(ReviewEntity)
  findByUser(@Param('userId') userId: string) {
    return this.reviewService.findByUser(userId);
  }

  @Put(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Mettre à jour un avis' })
  @ApiParam({ name: 'id', description: "ID de l'avis" })
  @ApiUpdateResponse(ReviewEntity)
  update(@Param('id') id: string, @Body() UpdateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, UpdateReviewDto);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un avis' })
  @ApiParam({ name: 'id', description: "ID de l'avis" })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.reviewService.delete(id);
  }
}

@ApiTags('Abonnements')
@ApiBearerAuth('JWT-auth')
@Controller('subscriptions')
export class AbonnementsController {
  constructor(private readonly abonnementsService: SubscriptionService) {}

  @Post()
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un abonnement' })
  @ApiCreateResponse(Object)
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.abonnementsService.create(createSubscriptionDto);
  }

  @Get()
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer tous les abonnements' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.abonnementsService.findAll();
  }

  @Get('actifs')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer les abonnements actifs' })
  @ApiGetManyResponse(Object)
  findActive() {
    return this.abonnementsService.findActive();
  }

  @Get(':id')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer un abonnement' })
  @ApiParam({ name: 'id', description: "ID de l'abonnement" })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.abonnementsService.findOne(id);
  }

  @Get('user/:userId')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: "Récupérer les abonnements d'un utilisateur" })
  @ApiParam({ name: 'userId', description: "ID de l'utilisateur" })
  @ApiGetManyResponse(Object)
  findByUser(@Param('userId') userId: string) {
    return this.abonnementsService.findByUser(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un abonnement' })
  @ApiParam({ name: 'id', description: "ID de l'abonnement" })
  @ApiUpdateResponse(Object)
  update(
    @Param('id') id: string,
    @Body() updateSubscriptionDto: UpdateSubscriptionDto,
  ) {
    return this.abonnementsService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un abonnement' })
  @ApiParam({ name: 'id', description: "ID de l'abonnement" })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.abonnementsService.delete(id);
  }
}
