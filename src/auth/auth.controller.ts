import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Request,
    Res,

} from '@nestjs/common';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from './constants';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('Adminlogin')
    async signIn(@Body() signInDto: Record<string, any>, @Res() res: Response) {
        const token = await this.authService.signIn(signInDto.email, signInDto.password);
        if (token) {
            return res.status(HttpStatus.CREATED).json(token.access_token);
        } else {
            return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Username or password is incorrect' })
        }

    }
    // @Public()
    // @HttpCode(HttpStatus.OK)
    // @Post('Adminlogin')
    // async signIn(@Body() signInDto: Record<string, any>, @Res() res: Response) {
    //     const token = await this.authService.signIn(signInDto.username, signInDto.password);
    //     if (token) {
    //         return res.status(HttpStatus.CREATED).json(token.access_token);
    //     } else {
    //         return res.status(HttpStatus.UNAUTHORIZED).json({ message: 'Username or password is incorrect' })
    //     }

    // }

    @Get('profile')
    getProfile(@Request() req) {
        return req.user;
    }
}
