import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsOptional, IsString, IsEnum, IsBoolean } from 'class-validator';
import { PaginationDto } from '../../common/dto/pagination.dto';
import { UserRole } from '../enums/user.enum';

export class FindAllUsersDto extends PaginationDto {
  @ApiPropertyOptional({
    description: "Rôle de l'utilisateur",
    enum: UserRole,
  })
  @IsEnum(UserRole)
  @IsOptional()
  role?: UserRole;

  @ApiPropertyOptional({
    description: 'Recherche par nom, prénom ou email',
    example: 'john',
  })
  @IsString()
  @IsOptional()
  search?: string;

  @ApiPropertyOptional({
    description: 'Inclure uniquement les utilisateurs actifs',
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isActive?: boolean;

  @ApiPropertyOptional({
    description: 'Inclure uniquement les utilisateurs vérifiés',
  })
  @Type(() => Boolean)
  @IsBoolean()
  @IsOptional()
  isVerified?: boolean;
}
