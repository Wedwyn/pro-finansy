import { Body, Controller, Post, Req } from '@nestjs/common';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { Request } from '../types';
import { AuthService } from './auth.service';

@Controller('auth')
export class AuthController {
  constructor(private authService: AuthService) {}

  @Post('/login')
  login(@Body() userDto: CreateUserDto, @Req() req: Request) {
    return this.authService.login(userDto, req);
  }

  @Post('/registration')
  registration(@Body() userDto: CreateUserDto, @Req() req: Request) {
    return this.authService.registration(userDto, req);
  }
}
