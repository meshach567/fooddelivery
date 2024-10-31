import { BadRequestException, UseFilters } from "@nestjs/common";
import { Args, Context, Query, Mutation, Resolver } from "@nestjs/graphql";
import { UserService } from "./users.service";
import { RegisterRepose } from "./types/user.types";
import { RegisterDto } from "./dto/users.dto";
import { User } from "./entities/users.entity";


@Resolver('Users')
// @UseFilters

export class UsersResolver {
    constructor(
        private readonly userService: UserService
    ){}

    @Mutation(() => RegisterRepose)

    async register(
        @Args('registerInput') registerDto: RegisterDto,
        @Context() context: { res: Response},
    ): Promise<RegisterRepose> {
        if (!registerDto.name || !registerDto.email || !registerDto.password) {
            throw new BadRequestException('Pls fill all the fields  ');
        }

        const user = await this.userService.register(registerDto, context.res );

        return { user }
    }

    @Query(() => [User])
    async getUsers() {
        return this.userService.getUsers()
    }
}
