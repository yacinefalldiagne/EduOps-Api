import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Syllabus, Prisma } from '@prisma/client';
import { PrismaService } from 'src/lib/prisma.service';


@Injectable()
export class SyllabusService {
    private readonly logger = new Logger(SyllabusService.name);
    constructor(private prisma: PrismaService) { }
    async createSyllabus(data: Prisma.SyllabusCreateInput): Promise<Syllabus> {
        try {
            const Syllabus = await this.prisma.syllabus.create({ data });
            return Syllabus;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                `Failed to create the Syllabus because of: ${error}`,
            );
        }
    }

    async findOne(args: Prisma.SyllabusFindUniqueArgs): Promise<Syllabus | null> {
        try {
            const { id } = args.where;
            const Syllabus = await this.prisma.syllabus.findUnique({
                where: { id },
            });
            if (!Syllabus) {
                throw new NotFoundException(`Syllabus with ID ${id} not found`);
            }
            return Syllabus;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                `Failed to fetch the Syllabus with the ID ${args.where.id} due to ${error}`,
            );
        }
    }

    async findMany(): Promise<{ Syllabuss: Syllabus[]; count: number }> {
        try {


            const [Syllabuss, count] = await Promise.all([
                this.prisma.syllabus.findMany(),
                this.prisma.syllabus.count(),
            ]);

            return { Syllabuss, count };
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                `List Syllabuss failed due to ${error}`,
            );
        }
    }
}
