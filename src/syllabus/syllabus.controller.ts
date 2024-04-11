import { Body, Controller, Post, Get, Param, InternalServerErrorException } from '@nestjs/common';
import { Syllabus, Prisma } from '@prisma/client';
import { SyllabusService } from './syllabus.service';


@Controller('syllabus')
export class SyllabusController {

    constructor(private readonly SyllabusService: SyllabusService) { }

    @Post()
    async addSyllabus(
        @Body() data: Prisma.SyllabusCreateInput,
    ): Promise<Syllabus> {
        return await this.SyllabusService.createSyllabus(data);
    }

    @Get(':id')
    async Syllabus(@Param('id') id: number): Promise<Syllabus | null> {
        const args: Prisma.SyllabusFindUniqueArgs = { where: { id } };
        return await this.SyllabusService.findOne(args);
    }

    @Get()
    async Syllabuss(): Promise<{ Syllabuss: Syllabus[]; count: number }> {
        try {

            const { Syllabuss, count } = await this.SyllabusService.findMany();


            return { Syllabuss, count }
        } catch (error) {
            throw new InternalServerErrorException(
                `List Syllabuss failed due to ${error}`,
            );
        }
    }
}
