import { Injectable, UnauthorizedException } from '@nestjs/common';
import { AuthGuard } from '@nestjs/passport';

@Injectable()
export class JwtAuthGuard extends AuthGuard('jwt') {
  handleRequest(err: Error | null, user: any, info: any | undefined) {
    if (err || !user) {
      throw err || new UnauthorizedException();
    }
    return user;
  }
}