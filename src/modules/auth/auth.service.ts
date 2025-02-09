import { BadRequestException, Injectable } from '@nestjs/common';
import { JwtService } from '@nestjs/jwt';
import * as bcrypt from 'bcrypt';
import { CreateUserDto } from '../users/dto/create-user.dto';
import { User } from '../users/entities/user.entity';
import { UsersService } from '../users/users.service';
import { LoginUserDto } from './dto/login-user.dto';
import { JwtPayload } from './interfaces/jwt-payload.interface';
import { ValidateUserInterface } from './interfaces/validate-user.interface';

@Injectable()
export class AuthService {
  constructor(
    private usersService: UsersService,
    private jwtService: JwtService,
  ) {}

  async validateUser(
    credentials: ValidateUserInterface,
  ): Promise<Omit<User, 'password'> | null> {
    const { email, password } = credentials;
    const user = await this.usersService.findOneByEmail(email);
    if (!user) {
      return null;
    }
    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      return null;
    }
    const { password: _, ...result } = user;

    return result;
  }

  async login(loginUserDto: LoginUserDto) {
    const user = await this.validateUser(loginUserDto);
    if (!user) {
      throw new BadRequestException('Invalid credentials');
    }
    const payload: JwtPayload = { id: user.id, email: user.email };
    return {
      access_token: this.jwtService.sign(payload),
    };
  }

  async register(dto: CreateUserDto) {
    const existingUser = await this.usersService.findOneByEmail(dto.email);
    if (existingUser) {
      throw new BadRequestException('Email already in use');
    }
    const newUser = await this.usersService.createUser(dto);
    return this.login({ email: newUser.email, password: dto.password });
  }
}
