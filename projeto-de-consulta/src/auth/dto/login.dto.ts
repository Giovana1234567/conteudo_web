import { ApiProperty } from "@nestjs/swagger";
import { IsEmail, IsNotEmpty, IsString } from "class-validator";

export class LoginDto {
    @IsString()
    @IsNotEmpty()
    @IsEmail()
    @ApiProperty({
        type: 'string',
        example: 'cristiano@esucri.com.br',
        description: 'E-mail do usuário',
        nullable: false,
    })
    readonly email: string;
    
    @IsString()
    @IsNotEmpty()
    @ApiProperty({
        type: 'string',
        example: '123456',
        description: 'Senha do usuário',
        nullable: false,
    })
    readonly password: string;
}