import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from './generated/prisma/client';
import { PrismaPg } from '@prisma/adapter-pg';
import type { INestApplication } from '@nestjs/common';
import 'dotenv/config';

@Injectable()
export class PrismaService
  extends PrismaClient
  implements OnModuleInit, OnModuleDestroy
{
  private static instance: PrismaService;

  constructor() {
    if (!PrismaService.instance) {
      const adapter = new PrismaPg({
        connectionString: process.env.DATABASE_URL as string,
      });

      super({
        adapter,
        log: ['query', 'error', 'warn'],
      });
      PrismaService.instance = this;
    }

    return PrismaService.instance;
  }

  async onModuleInit() {
    await this.$connect();
  }

  async onModuleDestroy() {
    await this.$disconnect();
  }

  enableShutdownHooks(app: INestApplication) {
    process.on('beforeExit', () => {
      void app.close();
    });
  }

  async cleanDatabase() {
    if (process.env.NODE_ENV === 'production') {
      throw new Error(
        'Impossible de nettoyer la base de données en production',
      );
    }

    const models = Reflect.ownKeys(this).filter(
      (key) => key[0] !== '_' && key[0] !== '$',
    );

    type ModelDelegate = {
      deleteMany: () => Promise<unknown>;
    };

    return Promise.all(
      models.map((modelKey) => {
        const model = this[modelKey as keyof this];
        if (
          model &&
          typeof model === 'object' &&
          'deleteMany' in model &&
          typeof model.deleteMany === 'function'
        ) {
          return (model as ModelDelegate).deleteMany();
        }
        return Promise.resolve();
      }),
    );
  }
}
