import { Module } from '@nestjs/common';
import { UserService } from './users.service';
import { GraphQLModule } from '@nestjs/graphql';
import { ApolloFederationDriver, ApolloFederationDriverConfig } from '@nestjs/apollo';
import { JwtService } from '@nestjs/jwt';
import { ConfigService } from '@nestjs/config';
import { PrismaService } from '../../../prisma/Prisma.service';
import { UsersResolver } from './users.resolver';



@Module({
  imports: [
    GraphQLModule.forRoot<ApolloFederationDriverConfig>({
      driver: ApolloFederationDriver,
      autoSchemaFile: {
        federation: 2
      },
    }),
  ],
  controllers: [],
  providers: [UserService, ConfigService, JwtService, PrismaService, UsersResolver],
})
export class UsersModule { }
