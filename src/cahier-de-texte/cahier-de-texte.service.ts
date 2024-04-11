import { Injectable, InternalServerErrorException, Logger, NotFoundException } from '@nestjs/common';
import { Prisma, CahierDeTexte, CoursDansCahierDetexte } from '@prisma/client';
import { ListArgs } from 'src/lib/listArg';
import { PrismaService } from 'src/lib/prisma.service';
import { omit } from 'lodash';


@Injectable()
export class CahierDeTexteService {

    private readonly logger = new Logger(CahierDeTexteService.name);
    constructor(private prisma: PrismaService) { }
    async createCoursDansCahierDetexte(data: any): Promise<CoursDansCahierDetexte> {
        try {
            const { username, ...coursData } = data;

            // Recherche de l'utilisateur par son username pour obtenir la classe
            const user = await this.prisma.user.findUnique({
                where: { username: username }
            });

            if (!user) {
                throw new NotFoundException(`User with username ${username} not found`);
            }

            // Obtention de l'ID de la classe de l'utilisateur
            const classeId = user.idClasse;

            if (!classeId) {
                throw new NotFoundException(`User ${username} does not belong to any class`);
            }

            // Recherche du cahier de texte correspondant à la classe
            const cahierDeTexte = await this.prisma.cahierDeTexte.findUnique({
                where: { id: classeId },
            });

            if (!cahierDeTexte) {
                throw new NotFoundException(`CahierDeTexte not found for class ID ${classeId}`);
            }

            // Associer le cahierDeTexte avec le coursData
            coursData.idCahierDeTexte = cahierDeTexte.id;
            coursData.dateCours = new Date(coursData.dateCours as string).toISOString();

            // Enregistrement du cours dans le cahier de texte
            const coursDansCahierDetexte = await this.prisma.coursDansCahierDetexte.create({
                data: coursData
            });

            return coursDansCahierDetexte;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(`Failed to create the CoursDansCahierDetexte: ${error}`);
        }
    }

    async createCahierDeTexte(data: Prisma.CahierDeTexteCreateInput): Promise<CahierDeTexte> {
        try {
            const cahierDeTexte = await this.prisma.cahierDeTexte.create({ data });
            return cahierDeTexte;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                `Failed to create the cahierDeTexte because of: ${error}`,
            );
        }
    }

    async findOne(args: Prisma.CahierDeTexteFindUniqueArgs): Promise<CahierDeTexte | null> {
        try {
            const { id } = args.where;
            const cahierDeTexte = await this.prisma.cahierDeTexte.findUnique({
                where: { id },
            });
            if (!cahierDeTexte) {
                throw new NotFoundException(`CahierDeTexte with ID ${id} not found`);
            }
            return cahierDeTexte;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                `Failed to fetch thecahierDeTexte with the ID ${args.where.id} due to ${error}`,
            );
        }
    }

    async updateOne(args: Prisma.CahierDeTexteUpdateArgs): Promise<CahierDeTexte> {
        try {
            const updatedCahierDeTexte = await this.prisma.cahierDeTexte.update({
                where: args.where,
                data: omit(args.data, 'id'),
            });
            return updatedCahierDeTexte;
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                `Failed to update the CahierDeTexte with the ID ${args.where.id} due to: ${error}`,
            );
        }
    }

    async findMany(
        // filter: Prisma.CahierDeTexteWhereInput,
        listArg?: ListArgs,
    ): Promise<{ cahierDeTextes: CahierDeTexte[]; count: number }> {
        try {
            let allArgs: Prisma.CahierDeTexteFindManyArgs = {};

            if (listArg.order) {
                const { field, order, skip, take } = listArg;
                const orderBy = { [field]: order.toLowerCase() as 'asc' | 'desc' };
                allArgs = {
                    ...allArgs,
                    orderBy,
                    skip,
                    take: take - skip + 1,
                    // where: filter,
                };
            } else {
                // const filterName = Object.keys(filter)[0];
                // const filterContent = filter[filterName];
                // const filterArray = Array.isArray(filterContent)
                //     ? { [filterName]: { in: filterContent } }
                //     : { [filterName]: filterContent };

                allArgs = {
                    ...allArgs,
                    // where: filterArray,
                };
            }
            const [cahierDeTextes, count] = await Promise.all([
                this.prisma.cahierDeTexte.findMany(allArgs),
                this.prisma.cahierDeTexte.count(),
            ]);

            return { cahierDeTextes, count };
        } catch (error) {
            this.logger.error(error);
            throw new InternalServerErrorException(
                `ListcahierDeTextes failed due to ${error}`,
            );
        }
    }
}
