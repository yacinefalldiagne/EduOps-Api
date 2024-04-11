import { Module } from '@nestjs/common';
import { AvisService } from './avis.service';
import { AvisController } from './avis.controller';
import { PrismaService } from 'src/lib/prisma.service';

@Module({
  providers: [AvisService, PrismaService],
  controllers: [AvisController]
})
export class AvisModule { }
