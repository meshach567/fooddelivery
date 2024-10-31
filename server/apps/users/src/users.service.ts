import { BadRequestException, Injectable } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import { JwtService } from "@nestjs/jwt"
import { loginDto, RegisterDto } from './dto/users.dto';
import { Prisma } from "@prisma/client";
import { PrismaService } from '../../../prisma/Prisma.service';
import * as bcrypt from 'bcrypt';
import { EmailService } from "./email/email.service";

interface UserData {  
  name: string,
  email: string,
  password: string,
  phonenum:  number
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
    const { name, email, password, phonenum, } = registerDto;

    // Use email_key for the unique constraint on email
    // const isEmailExist = await this.prisma.user.findUnique({
    //   where: {
    //     email: email  // Use the correct unique constraint name
    //   } as any
    // });

    // Alternative method that also works
    const isEmailExist = await this.prisma.user.findFirst({
      where: {
        email: email
      }
    });

    if (isEmailExist) {
      throw new BadRequestException("User already exists with this email")
    }

    const isPhoneNumberExist = await this.prisma.user.findUnique({
      where: {
        phonenum
      },
    });

    if (isPhoneNumberExist) {
      throw new BadRequestException("Phonenum already exists with this email")
    }

    const hashedpassword = await bcrypt.hash(password, 10);

    const user = {
      name,
      email,
      password: hashedpassword,
      phonenum,
    }

    const activationToken = await this.createActivationToken(user);
    const activationCode = activationToken.activationCode;

    // console.log(activationCode)
    await this.emailService.sendMail({
      email,
      subject: 'Activation your account',
      template: './activation-mail',
      name,
      activationCode
    })

    return { user, response }
  }

  // create activation token
  async createActivationToken(user: UserData) {
    const activationCode = Math.floor(1000 + Math.random() * 9000).toString();

    const token = this.jwtService.sign(
      {
        user,
        activationCode
      },
      {
        secret: this.configService.get<string>('ACTIVATION_SECRET'),
        expiresIn: '5m'
      }
    )

    return { token, activationCode }
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
