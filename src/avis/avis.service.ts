import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Avis, Prisma } from '@prisma/client';
import { ListArgs } from 'src/lib/listArg';
import { PrismaService } from 'src/lib/prisma.service';

@Injectable()
export class AvisService {

    private readonly logger = new Logger(AvisService.name);
    constructor(private prisma: PrismaService) { }
    async createAvis(data: Prisma.AvisCreateInput): Promise<Avis> {
        try {
            const Avis = await this.prisma.avis.create({ data });
            return Avis;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                `Failed to create the Avis because of: ${error}`,
            );
        }
    }

    async findOne(args: Prisma.AvisFindUniqueArgs): Promise<Avis | null> {
        try {
            const { id } = args.where;
            const Avis = await this.prisma.avis.findUnique({
                where: { id },
            });
            if (!Avis) {
                throw new NotFoundException(`Avis with ID ${id} not found`);
            }
            return Avis;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                `Failed to fetch the Avis with the ID ${args.where.id} due to ${error}`,
            );
        }
    }

    async findMany(): Promise<{ aviss: Avis[]; count: number }> {
        try {


            const [aviss, count] = await Promise.all([
                this.prisma.avis.findMany(),
                this.prisma.avis.count(),
            ]);

            return { aviss, count };
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                `List Aviss failed due to ${error}`,
            );
        }
    }

}
