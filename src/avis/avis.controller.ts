import { Body, Controller, Post, Get, Param, Res, Query, InternalServerErrorException } from '@nestjs/common';
import { AvisService } from './avis.service';
import { Avis, Prisma } from '@prisma/client';
import { ListArgs } from 'src/lib/listArg';
import { Response } from 'express';
import { promises } from 'dns';

@Controller('avis')
export class AvisController {

    constructor(private readonly avisService: AvisService) { }

    @Post()
    async addAvis(
        @Body() data: Prisma.AvisCreateInput,
    ): Promise<Avis> {
        return await this.avisService.createAvis(data);
    }

    @Get(':id')
    async Avis(@Param('id') id: number): Promise<Avis | null> {
        const args: Prisma.AvisFindUniqueArgs = { where: { id } };
        return await this.avisService.findOne(args);
    }

    @Get()
    async Aviss(
        // @Res() response: Response,
        // @Query('sort') sort?: string,
        // @Query('range') range?: string,
        // // @Query('filter') filter?: string,
    ): Promise<{ aviss: Avis[]; count: number }> {
        try {

            const { aviss, count } = await this.avisService.findMany();


            return { aviss, count }
        } catch (error) {
            throw new InternalServerErrorException(
                `List Aviss failed due to ${error}`,
            );
        }
    }

}
