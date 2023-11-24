import {
  CanActivate,
  ExecutionContext,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { Observable } from 'rxjs';

@Injectable()
export class JwtAuthGuard implements CanActivate {
  constructor(private jwtService: JwtService) {}

  canActivate(
    context: ExecutionContext,
  ): boolean | Promise<boolean> | Observable<boolean> {
    const req = context.switchToHttp().getRequest();
    try {
      const authHeader = req.headers.authorization;
      const bearer = authHeader.split(' ')[0];
      const token = authHeader.split(' ')[1];
      console.log(token);

      if (bearer !== 'Bearer' || !token) {
        console.log(`here`);
        console.log(token);
        throw new UnauthorizedException({
          message: 'Пользователь не авторизован',
        });
      }
      const user = this.jwtService.verify(token);
      req.user = user;
      return true;
    } catch (e) {
      console.log(process.env.JWT_SECRET_KEY);
      console.log(e);
      throw new UnauthorizedException({
        message: 'Пользователь не авторизован',
      });
    }
  }
}
