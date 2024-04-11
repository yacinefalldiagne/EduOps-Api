import { Body, Controller, Post, Get, Param, Res, Query, InternalServerErrorException, Put } from '@nestjs/common';
import { CahierDeTexteService } from './cahier-de-texte.service';
import { Response } from 'express';
import { ListArgs } from 'src/lib/listArg';
import { Prisma, CahierDeTexte, CoursDansCahierDetexte } from '@prisma/client';

@Controller('cahier-de-texte')
export class CahierDeTexteController {
    constructor(private cahierDeTexteService: CahierDeTexteService) { }
    @Post('coursCahier')
    async CreateCoursDansCahierDexte(
        @Body() data: any
    ): Promise<CoursDansCahierDetexte | null> {


        return await this.cahierDeTexteService.createCoursDansCahierDetexte(data);
    }

    @Get(':id')
    async cahierDeTexte(@Param('id') id: number): Promise<CahierDeTexte | null> {
        const args: Prisma.CahierDeTexteFindUniqueArgs = { where: { id } };
        return await this.cahierDeTexteService.findOne(args);
    }
    @Put(':id')
    async updateCahier(
        @Param('id') id: number,
        @Body() data: Prisma.CahierDeTexteUpdateArgs['data'],
    ): Promise<CahierDeTexte> {
        const args: Prisma.CahierDeTexteUpdateArgs = { where: { id }, data };
        return await this.cahierDeTexteService.updateOne(args);
    }

    @Get()
    async cahierDeTextes(
        @Res() response: Response,
        @Query('sort') sort?: string,
        @Query('range') range?: string,
        // @Query('filter') filter?: string,
    ) {
        try {
            const args: ListArgs = {
                field: sort ? JSON.parse(sort)[0] : undefined,
                order: sort ? JSON.parse(sort)[1] : undefined,
                skip: range ? JSON.parse(range)[0] : undefined,
                take: range ? JSON.parse(range)[1] : undefined,
            };
            // const parsedFilter = filter ? JSON.parse(filter) : undefined;

            const { cahierDeTextes, count } = await this.cahierDeTexteService.findMany(
                // parsedFilter,
                args


            );
            if (args.order) {
                const length = cahierDeTextes.length;
                response.set(
                    'Content-Range',
                    `cahierDeTextes ${args.skip}-${args.skip + length}/${count}`,
                );
            }

            response.json(cahierDeTextes);
        } catch (error) {
            throw new InternalServerErrorException(
                `List cahierDeTextes failed due to ${error}`,
            );
        }
    }

}
