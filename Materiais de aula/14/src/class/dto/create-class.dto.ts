import { IsBoolean, IsNotEmpty, IsNumber, IsString } from 'class-validator';

export class CreateClassDto {
  @IsString()
  @IsNotEmpty()
  readonly name: string;

  @IsBoolean()
  @IsNotEmpty()
  readonly status: boolean;

  @IsNumber()
  @IsNotEmpty()
  readonly idUser: number;
}
