import { applyDecorators, Type } from '@nestjs/common';
import {
  ApiNotFoundResponse,
  ApiBadRequestResponse,
  ApiOkResponse,
  ApiCreatedResponse,
} from '@nestjs/swagger';

/**
 * Décorateur pour les réponses standards d'erreur
 */
export function ApiStandardErrors() {
  return applyDecorators(
    ApiNotFoundResponse({ description: 'Ressource non trouvée' }),
    ApiBadRequestResponse({ description: 'Données invalides ou requête malformée' }),
  );
}

/**
 * Décorateur pour une réponse GET (récupération d'un seul élément)
 */
export function ApiGetOneResponse(type: Type<any>) {
  return applyDecorators(
    ApiOkResponse({ type, description: 'Ressource récupérée avec succès' }),
    ApiNotFoundResponse({ description: 'Ressource non trouvée' }),
  );
}

/**
 * Décorateur pour une réponse GET (récupération de plusieurs éléments)
 */
export function ApiGetManyResponse(type: Type<any>) {
  return applyDecorators(
    ApiOkResponse({ 
      type: [type], 
      description: 'Liste des ressources récupérée avec succès',
    }),
  );
}

/**
 * Décorateur pour une réponse POST (création)
 */
export function ApiCreateResponse(type: Type<any>) {
  return applyDecorators(
    ApiCreatedResponse({ type, description: 'Ressource créée avec succès' }),
    ApiBadRequestResponse({ description: 'Données invalides' }),
  );
}

/**
 * Décorateur pour une réponse PUT/PATCH (mise à jour)
 */
export function ApiUpdateResponse(type: Type<any>) {
  return applyDecorators(
    ApiOkResponse({ type, description: 'Ressource mise à jour avec succès' }),
    ApiNotFoundResponse({ description: 'Ressource non trouvée' }),
    ApiBadRequestResponse({ description: 'Données invalides' }),
  );
}

/**
 * Décorateur pour une réponse DELETE
 */
export function ApiDeleteResponse() {
  return applyDecorators(
    ApiOkResponse({ description: 'Ressource supprimée avec succès' }),
    ApiNotFoundResponse({ description: 'Ressource non trouvée' }),
  );
}
