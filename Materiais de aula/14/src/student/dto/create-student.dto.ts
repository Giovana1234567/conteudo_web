import { IsArray, IsNotEmpty, IsObject, IsString } from "class-validator";

export class CreateStudentDto {
    @IsString()
    @IsNotEmpty()
    name: string;
    
    @IsObject() // Diferente no MongoDB
    address: {
      street: string,
      streetNumber: number,
      city: string,
      state: string,
    };
    
    @IsArray() // Diferente no MongoDB
    listContacts: {
      name: string,
      phoneNumber: string,
    }[];
    
    @IsString()
    @IsNotEmpty()
    courseId: string;
}
