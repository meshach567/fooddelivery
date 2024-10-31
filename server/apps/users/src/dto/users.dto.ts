import { Field, InputType } from '@nestjs/graphql';
import { IsEmail, IsNotEmpty, IsString, MinLength } from 'class-validator';


@InputType()
export class RegisterDto {
    @Field()
    @IsNotEmpty({ message: 'Name is Required '})
    @IsString({ message: 'Name must be need to be one string'})
    name: string;

    @Field()
    @IsNotEmpty({ message: 'Password is Required '})
    @MinLength(8, { message: 'Password must be at least 8 characters'})
    password: string

    @Field()
    @IsNotEmpty( { message: 'Email is required. '})
    @IsEmail({}, { message: 'Email is invalid '})
    email: string

    @Field()
    @IsNotEmpty({ message: 'Phone Number is required'})
    phonenum: number;

    @Field()
    @IsNotEmpty({ message: 'Address is Required'})
    address: String;


}

@InputType() 
export class loginDto {
    @Field()
    @IsNotEmpty({ message: 'Password is required '})
    password: string

    @Field()
    @IsNotEmpty( { message: 'Email is required. '})
    @IsEmail({}, { message: 'Email is valid '})
    email: string
}

