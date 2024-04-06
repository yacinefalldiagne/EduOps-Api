import { Injectable, ExecutionContext } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';
import { Reflector } from '@nestjs/core';
import { Observable } from 'rxjs';
import { IS_PUBLIC_KEY } from 'src/auth/constants';

@Injectable()
export class AccessTokenGuard extends AuthGuard('jwt') {
    constructor(private reflector: Reflector) {
        super();
    }

    canActivate(context: ExecutionContext): boolean | Promise<boolean> | Observable<boolean> {
        const isPublic = this.reflector.get<boolean>(IS_PUBLIC_KEY, context.getHandler());
        if (isPublic) {
            return true;
        }
        return super.canActivate(context);
    }
}
