# Guia 02 - Validação de Entrada & Tratamento de Erros

---

## 1. HttpException e Exceções Especializadas
No NestJS, erros devem ser lançados usando exceções nativas. O framework captura esses erros e os formata em uma resposta JSON apropriada para o cliente.

### Exemplo de lançamento de HttpException
```typescript
import { HttpException, HttpStatus, Injectable } from '@nestjs/common';

@Injectable()
export class UserService {
  buscarPorId(id: number) {
    const usuario = null; // Simulação
    if (!usuario) {
      // Método genérico
      throw new HttpException('Usuário não encontrado', HttpStatus.NOT_FOUND);
    }
  }
}
```

### Exceções Especializadas (Mais recomendadas)
O NestJS possui atalhos prontos que estendem `HttpException`:
- `BadRequestException` (HTTP 400)
- `UnauthorizedException` (HTTP 401)
- `ForbiddenException` (HTTP 403)
- `NotFoundException` (HTTP 404)
- `ConflictException` (HTTP 409)
- `InternalServerErrorException` (HTTP 500)

```typescript
import { NotFoundException, BadRequestException } from '@nestjs/common';

throw new NotFoundException('Usuário não encontrado');
throw new BadRequestException('Formato de e-mail inválido');
```

---

## 2. DTO (Data Transfer Object) e Entity
- **Entity**: Representa a tabela/coleção do Banco de Dados. Contém as anotações do ORM (TypeORM).
- **DTO**: Objeto simples usado para descrever o formato dos dados enviados na requisição HTTP. É nele que aplicamos as validações de dados de entrada.

---

## 3. Validação com `class-validator` e `class-transformer`
Para habilitar a validação automática, precisamos instalar as dependências de validação e configurar o `ValidationPipe` globalmente.

### Instalação das bibliotecas
```bash
npm i --save class-validator class-transformer
```

### Configuração Global no `main.ts`
```typescript
import { ValidationPipe } from '@nestjs/common';
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  
  // Habilita validação automática globalmente
  app.useGlobalPipes(
    new ValidationPipe({
      whitelist: true,            // Remove propriedades extras que não estão descritas no DTO
      forbidNonWhitelisted: true, // Retorna erro HTTP 400 se propriedades extras forem passadas
      transform: true,            // Converte os dados do payload para as classes DTO correspondentes
    })
  );

  await app.listen(3000);
}
bootstrap();
```

---

## 4. Criando e Validando DTOs

### Exemplo de DTO de Criação (`create-user.dto.ts`)
```typescript
import { IsString, IsEmail, IsInt, MinLength, MaxLength } from 'class-validator';

export class CreateUserDto {
  @IsString()
  @MinLength(3, { message: 'O nome deve ter no mínimo 3 caracteres' })
  nome: string;

  @IsEmail({}, { message: 'E-mail inválido' })
  email: string;

  @IsInt()
  idade: number;
}
```

No Controller:
```typescript
import { Controller, Post, Body } from '@nestjs/common';
import { CreateUserDto } from './dtos/create-user.dto';

@Controller('users')
export class UserController {
  @Post()
  criar(@Body() createUserDto: CreateUserDto) {
    return createUserDto; // Dados já validados e tipados
  }
}
```

---

## 5. Reaproveitando DTOs com `@nestjs/mapped-types` (Update)
Para a rota de atualização parcial (PATCH), geralmente os campos são opcionais. Em vez de duplicar o DTO, usamos o helper `PartialType`.

### Instalação do pacote
```bash
npm i --save @nestjs/mapped-types
```

### Exemplo de DTO de Atualização (`update-user.dto.ts`)
```typescript
import { PartialType } from '@nestjs/mapped-types';
import { CreateUserDto } from './create-user.dto';

// O PartialType faz com que todos os campos do CreateUserDto fiquem opcionais
export class UpdateUserDto extends PartialType(CreateUserDto) {}
```
