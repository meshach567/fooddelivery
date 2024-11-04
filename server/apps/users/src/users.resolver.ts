import { BadRequestException, UseFilters } from "@nestjs/common";
import { Args, Context, Query, Mutation, Resolver } from "@nestjs/graphql";
import { UserService } from "./users.service";
import { RegisterRepose } from "./types/user.types";
import { ActivationDto, RegisterDto } from "./dto/users.dto";
import { User } from "./entities/users.entity";


@Resolver('Users')
// @UseFilters

export class UsersResolver {
    constructor(
        private readonly userService: UserService
    ){}

    @Mutation(() => RegisterRepose)

    async register(
        @Args('registerDto') registerDto: RegisterDto,
        @Context() context: { res: Response},
    ): Promise<RegisterRepose> {
        if (!registerDto.name || !registerDto.email || !registerDto.password) {
            throw new BadRequestException('Pls fill all the fields  ');
        }

        const { activation_token } = await this.userService.register(
            registerDto,
            context.res
        )

        return { activation_token}

        // const user = await this.userService.register(registerDto, context.res );

        // return { user }
    }

    @Mutation(() => ActivationResponse)
    async activateUser(
      @Args('activationDto') activationDto: ActivationDto,
      @Context() context: { res: Response },
    ): Promise<ActivationResponse> {
      return await this.userService.activateUser(activationDto, context.res);
    }

    @Query(() => [User])
    async getUsers() {
        return this.userService.getUsers()
    }
}
