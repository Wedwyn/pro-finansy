import {
  HttpException,
  HttpStatus,
  Injectable,
  UnauthorizedException,
} from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import { CreateUserDto } from 'src/users/dto/create-user.dto';
import { UsersService } from 'src/users/users.service';
import * as bcrypt from 'bcryptjs';
import { User } from 'src/users/users.models';
import { Request } from '../types';

@Injectable()
export class AuthService {
  constructor(
    private userService: UsersService,
    private jwtService: JwtService,
  ) {}
  async login(userDto: CreateUserDto, req: Request) {
    const user = await this.validateUser(userDto);
    const jwtToken = await this.generateToken(user);
    req.session.jwt = jwtToken;
    return jwtToken;
  }

  async registration(userDto: CreateUserDto, req: Request) {
    const newUser = await this.userService.getUserByEmail(userDto.email);
    if (newUser) {
      throw new HttpException(
        'Пользователь c таким email уже зарегистрирован',
        HttpStatus.BAD_REQUEST,
      );
    }
    const passwordHash = await bcrypt.hash(userDto.password, 5);
    const user = await this.userService.createUser({
      ...userDto,
      password: passwordHash,
    });
    const jwtToken = await this.generateToken(user);
    console.log(user);
    req.session.jwt = jwtToken;
    return jwtToken;
  }

  private async generateToken(user: User) {
    const payload = { email: user.email, id: user.id };
    return {
      token: this.jwtService.sign(payload),
    };
  }

  private async validateUser(userDto: CreateUserDto) {
    const user = await this.userService.getUserByEmail(userDto.email);
    const passwordEquals = await bcrypt.compare(
      userDto.password,
      user.password,
    );
    if (user && passwordEquals) {
      return user;
    }
    throw new UnauthorizedException({
      message: 'Неправильный email или пароль',
    });
  }
}
