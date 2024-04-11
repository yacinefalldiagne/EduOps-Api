import { Module } from '@nestjs/common';
import { CahierDeTexteService } from './cahier-de-texte.service';
import { CahierDeTexteController } from './cahier-de-texte.controller';
import { PrismaService } from 'src/lib/prisma.service';

@Module({
  providers: [CahierDeTexteService, PrismaService],
  controllers: [CahierDeTexteController]
})
export class CahierDeTexteModule { }
