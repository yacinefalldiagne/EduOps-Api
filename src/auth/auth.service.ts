import { BadRequestException, ForbiddenException, Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import * as argon2 from 'argon2';
import { JwtService } from '@nestjs/jwt';
import { AuthDto, userRole } from './dto/auth.dto';
import { Role } from '@prisma/client';

@Injectable()
export class AuthService {
    private readonly jwtAccessSecret: string;
    private readonly jwtRefreshSecret: string;

    constructor(
        private prisma: PrismaService,
        private jwtService: JwtService,
    ) {
        this.jwtAccessSecret = process.env.JWT_ACCESS_SECRET;
        this.jwtRefreshSecret = process.env.JWT_REFRESH_SECRET;
    }

    async signIn(data: AuthDto) {
        const autorrizheuser = userRole[data.type] as Role[];
        const user = await this.prisma.user.findUnique({ where: { username: data.username, role: { in: autorrizheuser } } });
        if (!user) throw new BadRequestException('Permision denied or user does not exist');
        if (user.password !== data.password) {
            throw new BadRequestException('Password is incorrect');
        }
        const tokens = await this.getTokens(user.id, user.username, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

    async logout(userId: number) {
        return this.prisma.user.update({ where: { id: userId }, data: { refreshToken: null } });
    }

    hashData(data: string) {
        return argon2.hash(data);
    }

    async updateRefreshToken(userId: number, refreshToken: string) {
        const hashedRefreshToken = await this.hashData(refreshToken);
        await this.prisma.user.update({ where: { id: userId }, data: { refreshToken: hashedRefreshToken } });
    }

    async getTokens(userId: number, username: string, role: Role) {
        const [accessToken, refreshToken] = await Promise.all([
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                    role
                },
                {
                    secret: this.jwtAccessSecret,
                    expiresIn: '30m',
                },
            ),
            this.jwtService.signAsync(
                {
                    sub: userId,
                    username,
                    role
                },
                {
                    secret: this.jwtRefreshSecret,
                    expiresIn: '7d',
                },
            ),
        ]);

        return {
            accessToken,
            refreshToken,
        };
    }

    async refreshTokens(userId: string, refreshToken: string) {

        const user = await this.prisma.user.findUnique({ where: { username: userId } });
        if (!user || !user.refreshToken)
            throw new ForbiddenException('Access Denied');
        const refreshTokenMatches = await argon2.verify(
            user.refreshToken,
            refreshToken,
        );
        if (!refreshTokenMatches) throw new ForbiddenException('Access Denied');
        const tokens = await this.getTokens(user.id, user.username, user.role);
        await this.updateRefreshToken(user.id, tokens.refreshToken);
        return tokens;
    }

}
