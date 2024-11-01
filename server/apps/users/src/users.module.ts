import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { JwtService } from '@nestjs/jwt';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/Prisma.service';
import { UsersResolver } from './users.resolver';
import { EmailModule } from './email/email.module';
import { EmailService } from './email/email.service';



@Module({
  imports: [
    ConfigModule.forRoot({
      isGlobal: true
    }),
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2
      },
    }),
    EmailModule,
    
  ],
  controllers: [],
  providers: [UserService, ConfigService, JwtService, PrismaService, UsersResolver, EmailService],
})
export class UsersModule { }
