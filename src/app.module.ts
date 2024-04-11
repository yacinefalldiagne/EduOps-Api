import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { APP_GUARD } from '@nestjs/core';
import { AccessTokenGuard } from './auth/guard/accessToken.guard';
import { AvisModule } from './avis/avis.module';
import { CahierDeTexteModule } from './cahier-de-texte/cahier-de-texte.module';
import { SyllabusModule } from './syllabus/syllabus.module';
@Module({
  imports: [AuthModule, AvisModule, CahierDeTexteModule, SyllabusModule],
  controllers: [AppController],
  providers: [AppService, {
    provide: APP_GUARD,
    useClass: AccessTokenGuard,
  }]

})
export class AppModule { }
