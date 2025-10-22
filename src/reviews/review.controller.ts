import { Controller, Get, Post, Put, Delete, Body, Param, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiParam, ApiBearerAuth } from '@nestjs/swagger';
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

@ApiTags('Reviews')
@ApiBearerAuth('JWT-auth')
@Controller('reviews')
export class ReviewsController {
  constructor(private readonly reviewService: ReviewService) {}

  @Post()

  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Créer un reviews' })
  @ApiCreateResponse(ReviewEntity)
  create(@Body() createReviewDto: CreateReviewDto) {
    return this.reviewService.create(createReviewDto);
  }

  @Get()
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer tous les reviews' })
  @ApiGetManyResponse(ReviewEntity)
  findAll() {
    return this.reviewService.findAll();
  }

  @Get(':id')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer un reviews par son ID' })
  @ApiParam({ name: 'id', description: 'ID de l\'reviews' })
  @ApiGetOneResponse(ReviewEntity)
  findOne(@Param('id') id: string) {
    return this.reviewService.findOne(id);
  }

  @Get('experience/:experienceId')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer les reviews d\'une expérience' })
  @ApiParam({ name: 'experienceId', description: 'ID de l\'expérience' })
  @ApiGetManyResponse(ReviewEntity)
  findByExperience(@Param('experienceId') experienceId: string) {
    return this.reviewService.findByExperience(experienceId);
  }

  @Get('user/:userId')
  @Roles(UserRole.CLIENT, UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer les reviews d\'un user' })
  @ApiParam({ name: 'userId', description: 'ID de l\'user' })
  @ApiGetManyResponse(ReviewEntity)
  findByUser(@Param('userId') userId: string) {
    return this.reviewService.findByUser(userId);
  }

  @Put(':id')
  @Roles(UserRole.CLIENT)
  @ApiOperation({ summary: 'Mettre à jour un reviews' })
  @ApiParam({ name: 'id', description: 'ID de l\'reviews' })
  @ApiUpdateResponse(ReviewEntity)
  update(@Param('id') id: string, @Body() UpdateReviewDto: UpdateReviewDto) {
    return this.reviewService.update(id, UpdateReviewDto);
  }

  @Delete(':id')
  @Roles(UserRole.CLIENT)
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un reviews' })
  @ApiParam({ name: 'id', description: 'ID de l\'reviews' })
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
  @ApiOperation({ summary: 'Créer un subscription' })
  @ApiCreateResponse(Object)
  create(@Body() createSubscriptionDto: CreateSubscriptionDto) {
    return this.abonnementsService.create(createSubscriptionDto);
  }

  @Get()
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer tous les subscriptions' })
  @ApiGetManyResponse(Object)
  findAll() {
    return this.abonnementsService.findAll();
  }

  @Get('actifs')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer les subscriptions actifs' })
  @ApiGetManyResponse(Object)
  findActive() {
    return this.abonnementsService.findActive();
  }

  @Get(':id')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer un subscription' })
  @ApiParam({ name: 'id', description: 'ID de l\'subscription' })
  @ApiGetOneResponse(Object)
  findOne(@Param('id') id: string) {
    return this.abonnementsService.findOne(id);
  }

  @Get('user/:userId')
  @Roles(UserRole.GUIDE)
  @ApiOperation({ summary: 'Récupérer les subscriptions d\'un user' })
  @ApiParam({ name: 'userId', description: 'ID de l\'user' })
  @ApiGetManyResponse(Object)
  findByUser(@Param('userId') userId: string) {
    return this.abonnementsService.findByUser(userId);
  }

  @Put(':id')
  @ApiOperation({ summary: 'Mettre à jour un subscription' })
  @ApiParam({ name: 'id', description: 'ID de l\'subscription' })
  @ApiUpdateResponse(Object)
  update(@Param('id') id: string, @Body() updateSubscriptionDto: UpdateSubscriptionDto) {
    return this.abonnementsService.update(id, updateSubscriptionDto);
  }

  @Delete(':id')
  @HttpCode(HttpStatus.NO_CONTENT)
  @ApiOperation({ summary: 'Supprimer un subscription' })
  @ApiParam({ name: 'id', description: 'ID de l\'subscription' })
  @ApiDeleteResponse()
  delete(@Param('id') id: string) {
    return this.abonnementsService.delete(id);
  }
}
