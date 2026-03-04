import { Controller, Post, Body, HttpCode, HttpStatus } from '@nestjs/common';
import { ApiTags, ApiBearerAuth, ApiOperation } from '@nestjs/swagger';
import { VideoService } from './video.service';
import { GenerateTokenDto } from './dto/generate-token.dto';
import { Roles } from '../common/decorators/role.decorator';
import { UserRole } from '../users/enums/user.enum';

@ApiTags('Video')
@ApiBearerAuth('JWT-auth')
@Controller('video')
export class VideoController {
  constructor(private readonly videoService: VideoService) {}

  @Post('token')
  @HttpCode(HttpStatus.OK)
  @ApiOperation({ summary: "Générer un token d'accès Twilio Video" })
  generateToken(@Body() generateTokenDto: GenerateTokenDto) {
    const token = this.videoService.generateToken(
      generateTokenDto.identity,
      generateTokenDto.room,
    );
    return { token };
  }
}
