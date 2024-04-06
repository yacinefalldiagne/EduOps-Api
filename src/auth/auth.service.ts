import { Injectable, UnauthorizedException } from '@nestjs/common';
import { PrismaService } from 'src/lib/prisma.service';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {
    constructor(private prisma: PrismaService, private jwtService: JwtService) { }

    async signIn(email: string, password: string): Promise<{ access_token: string }> {
        const user = await this.prisma.user.findUnique({ where: { email: email } });

        if (user) {
            if (user.password !== password) {
                throw new UnauthorizedException();
            }
            const payload = { id: user.id, role: user.role, fullName: `${user.firstName} ${user.lastName}` };
            return {
                access_token: await this.jwtService.signAsync(payload),
            };
        }



        return null;
    }
}
