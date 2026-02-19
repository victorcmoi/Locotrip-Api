import { Controller, Get, Query } from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse } from '@nestjs/swagger';
import { SearchService } from './search.service';
import { SearchDto } from './dto/search.dto';
import { Public } from '../common/decorators/authentification-decorator';

@ApiTags('Search')
@Controller('search')
export class SearchController {
    constructor(private readonly searchService: SearchService) { }

    @Get()
    @Public()
    @ApiOperation({
        summary: 'Recherche unifiée de guides ou expériences',
        description:
            'Effectue une recherche selon le mode spécifié (guide ou experience). Les paramètres disponibles varient selon le mode choisi.',
    })
    @ApiResponse({
        status: 200,
        description: 'Résultats de la recherche avec pagination',
    })
    @ApiResponse({
        status: 400,
        description: 'Paramètres de recherche invalides',
    })
    async search(@Query() searchDto: SearchDto) {
        return this.searchService.search(searchDto);
    }
}
