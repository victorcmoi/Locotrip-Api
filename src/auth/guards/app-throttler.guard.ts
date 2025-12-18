import { ThrottlerGuard } from '@nestjs/throttler';
import { Injectable } from '@nestjs/common';

@Injectable()
export class AppThrottlerGuard extends ThrottlerGuard {}
