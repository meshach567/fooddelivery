import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';
import { loginDto, RegisterDto } from './dto/users.dto';
import { Prisma } from '@prisma/client';
import { PrismaService } from '../../../prisma/Prisma.service';

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma:PrismaService,
    private readonly configService: ConfigService,
  ) { }

  // register user service
  async register(registerDto: RegisterDto) {
    const { name, email, password } = registerDto;
    const user = {
      name,
      email,
      password
    };

    return user;
  }

  //  Login Service

  async Login(loginDto: loginDto) {
    const { email, password } = loginDto;
    const user = {
      email,
      password
    };

    return user;  
  }

  // get all users service
  async getUsers() {
    return this.prisma.user.findMany({});
  }


}
