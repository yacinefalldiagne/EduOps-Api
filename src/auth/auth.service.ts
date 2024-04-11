import { BadRequestException, ForbiddenException, Injectable, InternalServerErrorException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, userRole } from './dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    private readonly jwtAccessSecret: string;

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {
        this.jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
    }

    async signIn(data: AuthDto) {
        const authorizedRoles = userRole[data.originType] as Role[];
        const user = await this.prisma.user.findUnique({
            where: { username: data.username, role: { in: authorizedRoles } }
        });
        if (!user) {
            throw new BadRequestException('Permission denied or user does not exist');
        }
        if (user.password !== data.password) {
            throw new BadRequestException('Password is incorrect');
        }
        const token = await this.getTokens(user.username, user.role, `${user.firstName} ${user.lastName}`);
        return {
            message: 'Login Success',
            result: true,
            data: {
                username: user.username,
                role: user.role,
                fullName: `${user.firstName} ${user.lastName}`,
                token: token,
            }
        };
    }





    async getTokens(username: string, role: Role, fullname: string) {
        try {
            const token = await this.jwtService.signAsync(
                { username, role, fullName: fullname },
                { secret: this.jwtAccessSecret, expiresIn: '30m' }
            );

            return token;
        } catch (error) {
            throw new InternalServerErrorException(error);
        }
    }


}
