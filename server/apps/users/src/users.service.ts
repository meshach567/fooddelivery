import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService, JwtVerifyOptions } from "@nestjs/jwt"
import { ActivationDto, LoginDto, RegisterDto } from './dto/users.dto';
import { Prisma } from "@prisma/client";
import { PrismaService } from '../../../prisma/Prisma.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from "./email/email.service";
import { User } from "./entities/users.entity";
import { TokenSender } from "./utils/sendToken";

interface UserData {  
  name: string,
  email: string,
  password: string,
  phone_number: number;

}

@Injectable()
export class UserService {
  constructor(
    private readonly jwtService: JwtService,
    private readonly prisma: PrismaService,
    private readonly configService: ConfigService,
    private readonly emailService: EmailService
  ) { }

  // register user service
  async register(registerDto: RegisterDto, response: Response) {
    const { name, email, password, phone_number, } = registerDto;

    // Use email_key for the unique constraint on email
    // const isEmailExist = await this.prisma.user.findUnique({
    //   where: {
    //     email: email  // Use the correct unique constraint name
    //   } as any
    // });

    // Alternative method that also works
    const isEmailExist = await this.prisma.user.findFirst({
      where: {
        email
      }
    });

    if (isEmailExist) {
      throw new BadRequestException("User already exists with this email")
    }

    const phoneNumbersToCheck = [phone_number];

    const usersWithPhoneNumber = await this.prisma.user.findMany({
      where: {
        phone_number: {
          not: null,
          in: phoneNumbersToCheck,
        },
      },
    });

    if (usersWithPhoneNumber.length > 0) {
      throw new BadRequestException(
        'User already exist with this phone number!',
      );
    }

    const hashedPassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedPassword,
      phone_number,
    };

    const activationToken = await this.createActivationToken(user);

    const activationCode = activationToken.activationCode;

    const activation_token = activationToken.token;

    await this.emailService.sendMail({
      email,
      subject: 'Activate your account!',
      template: './activation-mail',
      name,
      activationCode,
    });

    return { activation_token, response };
  }

  // create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode,
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m',
      },
    );
    return { token, activationCode };
  }


  async activateUser(activationDto: ActivationDto, response: Response) {
    const { activationToken, activationCode } = activationDto;

    const newUser: { user: UserData; activationCode: string } =
      this.jwtService.verify(activationToken, {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
      } as JwtVerifyOptions) as { user: UserData; activationCode: string };

    if (newUser.activationCode !== activationCode) {
      throw new BadRequestException('Invalid activation code');
    }

    const { name, email, password, phone_number } = newUser.user;

    const existUser = await this.prisma.user.findUnique({
      where: {
        email,
      },
    });

    if (existUser) {
      throw new BadRequestException('User already exist with this email!');
    }

    const user = await this.prisma.user.create({
      data: {
        name,
        email,
        password,
        phone_number,
      },
    });

    return { user, response };
  }

  //  Login Service

  async Login(loginDto: LoginDto) {
    const { email, password } = loginDto;
    const user = await this.prisma.user.findUnique({
      where: {email}
    });

    if( user && (await this.comparePassword(password, user.password))) {
      const tokenSender = new TokenSender(this.configService);
      tokenSender.sendToken(user);      

    } else {
      throw new BadRequestException(' Invalid Credentials');
    }
  }

  async comparePassword(
    password: string,
    hashedPassword: string,
  ): Promise<boolean> {
    return await bcrypt.compare(password, hashedPassword)
  }

  // get all users service
  async getUsers() {
    return this.prisma.user.findMany({});
  }


}
