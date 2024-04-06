import {
    Body,
    Controller,
    Get,
    HttpCode,
    HttpStatus,
    Post,
    Req,
    Res,
    UseGuards,

} from '@nestjs/common';
import { Request } from 'express';
import { AuthService } from './auth.service';
import { Response } from 'express';
import { Public } from './constants';
import { AuthDto } from './dto/auth.dto';
import { RefreshTokenGuard } from './guard/refreshToken.guard';

@Controller('auth')
export class AuthController {
    constructor(private authService: AuthService) { }

    @Public()
    @HttpCode(HttpStatus.OK)
    @Post('login')
    signin(@Body() data: AuthDto) {
        return this.authService.signIn(data);
    }


    // @Post('signup')
    // signup(@Body() createUserDto: CreateUserDto) {
    //   return this.authService.signUp(createUserDto);
    // }

    @Get('logout')
    logout(@Req() req: Request) {
        this.authService.logout(req.user['sub']);
    }

    @UseGuards(RefreshTokenGuard)
    @Get('refresh')
    refreshTokens(@Req() req: Request) {
        const userId = req.user['sub'];
        const refreshToken = req.user['refreshToken'];
        return this.authService.refreshTokens(userId, refreshToken);
    }
}
