# Guia 01 - Fundamentos NestJS & Requisições HTTP

---

## 1. Métodos HTTP & Postman
As APIs modernas se comunicam através dos métodos do protocolo HTTP:
- **GET**: Retorna dados de um recurso. Não envia dados no corpo (Body).
- **POST**: Cria um novo recurso. Os dados do recurso vão no Body.
- **PUT**: Substitui ou atualiza completamente um recurso existente.
- **PATCH**: Atualiza parcialmente um recurso existente.
- **DELETE**: Remove um recurso.

No **Postman**, você testa essas requisições escolhendo o método correspondente, definindo a URL (ex: `http://localhost:3000/users`) e configurando o `Body` como `raw -> JSON` para POST/PUT/PATCH.

---

## 2. Instalação e CLI NestJS
O CLI (Command Line Interface) do NestJS facilita a criação e gerenciamento do projeto:

```bash
# Instalação global do NestJS CLI
npm i -g @nestjs/cli

# Criar um novo projeto (use --help para ver as opções)
nest new nome-do-projeto

# Iniciar o servidor em modo de desenvolvimento (atualiza a cada alteração)
npm run start:dev
```

### Comandos de Geração do CLI (Geração Automática)
O comando `generate` (ou `g`) cria arquivos já registrados em seus respectivos módulos.
```bash
# Gerar Module, Controller e Service via CLI
nest g mo nome-modulo
nest g co nome-controller
nest g s nome-service
```

---

## 3. Estrutura do Projeto & `main.ts`
A estrutura básica inicial do NestJS conta com:
- `main.ts`: Arquivo de entrada do sistema. Inicializa o Nest com o módulo principal (`AppModule`).
- `app.module.ts`: O módulo raiz da aplicação.
- `app.controller.ts`: Lida com requisições HTTP básicas.
- `app.service.ts`: Lógica de negócio básica.

### Exemplo padrão de `main.ts`
```typescript
import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';

async function bootstrap() {
  const app = await NestFactory.create(AppModule);
  // Habilitar CORS se for conectar com frontend
  app.enableCors();
  await app.listen(3000);
}
bootstrap();
```

---

## 4. Decorators e Criação Manual de Componentes
Decorators são anotações que definem o papel de uma classe.

- **`@Module()`**: Agrupa controladores, provedores e exportações.
- **`@Controller()`**: Define que a classe receberá requisições HTTP. Pode receber um prefixo de rota (ex: `@Controller('users')`).
- **`@Injectable()`**: Define que a classe (geralmente um Service) pode ser injetada em outras classes pelo container de Injeção de Dependências do Nest.

### Criação Manual de um Módulo, Controller e Service
Caso precise criar manualmente sem o CLI:

1. **Service (`exemplo.service.ts`)**:
```typescript
import { Injectable } from '@nestjs/common';

@Injectable()
export class ExemploService {
  obterDados(): string {
    return 'Dados retornados';
  }
}
```

2. **Controller (`exemplo.controller.ts`)**:
```typescript
import { Controller, Get } from '@nestjs/common';
import { ExemploService } from './exemplo.service';

@Controller('exemplo')
export class ExemploController {
  constructor(private readonly exemploService: ExemploService) {}

  @Get()
  buscar(): string {
    return this.exemploService.obterDados();
  }
}
```

3. **Module (`exemplo.module.ts`)**:
```typescript
import { Module } from '@nestjs/common';
import { ExemploController } from './exemplo.controller';
import { ExemploService } from './exemplo.service';

@Module({
  controllers: [ExemploController],
  providers: [ExemploService],
})
export class ExemploModule {}
```

---

## 5. Router Parameters & Query Parameters
Parâmetros são formas de passar informações para as rotas HTTP:

- **Router Parameters (Parâmetros de Rota)**: Identificam um recurso específico na URL. Definido com `:` no decorator `@Get(':id')` e lido com `@Param('id')`.
- **Query Parameters**: Parâmetros opcionais usados para filtros/paginação na URL (ex: `?busca=nome`). Lido com `@Query('busca')`.
- **Request Body (Corpo)**: Payload para POST/PUT. Lido com `@Body()`.

### Exemplo de Controller recebendo parâmetros
```typescript
import { Controller, Get, Post, Put, Patch, Delete, Param, Query, Body } from '@nestjs/common';

@Controller('items')
export class ItemsController {

  // GET http://localhost:3000/items?categoria=eletronicos
  @Get()
  listarTodos(@Query('categoria') categoria: string) {
    return `Listando itens da categoria: ${categoria}`;
  }

  // GET http://localhost:3000/items/123
  @Get(':id')
  obterUm(@Param('id') id: string) {
    return `Retornando item id: ${id}`;
  }

  // POST http://localhost:3000/items
  @Post()
  criar(@Body() body: any) {
    return { mensagem: 'Item criado', payload: body };
  }

  // PUT http://localhost:3000/items/123
  @Put(':id')
  atualizarTotal(@Param('id') id: string, @Body() body: any) {
    return { mensagem: `Substituição completa do item ${id}`, payload: body };
  }

  // PATCH http://localhost:3000/items/123
  @Patch(':id')
  atualizarParcial(@Param('id') id: string, @Body() body: any) {
    return { mensagem: `Atualização parcial do item ${id}`, payload: body };
  }

  // DELETE http://localhost:3000/items/123
  @Delete(':id')
  remover(@Param('id') id: string) {
    return `Item ${id} deletado`;
  }
}
```

---

## 6. Como Testar via cURL (Linha de Comando)
Você pode testar esses tipos de rotas e parâmetros rodando comandos cURL no terminal (Powershell ou CMD):

```bash
# 1. Testar GET com Query Parameter (?categoria=computador)
curl -X GET "http://localhost:3000/items?categoria=computador"

# 2. Testar GET com Router Parameter (ID = 123)
curl -X GET "http://localhost:3000/items/123"

# 3. Testar POST com JSON no Body (Payload)
curl -X POST "http://localhost:3000/items" -H "Content-Type: application/json" -d "{\"nome\":\"Teclado\",\"preco\":150}"

# 4. Testar PUT com JSON no Body (Atualização Total)
curl -X PUT "http://localhost:3000/items/123" -H "Content-Type: application/json" -d "{\"nome\":\"Mouse\",\"preco\":80}"

# 5. Testar PATCH com JSON no Body (Atualização Parcial)
curl -X PATCH "http://localhost:3000/items/123" -H "Content-Type: application/json" -d "{\"preco\":75}"

# 6. Testar DELETE com Router Parameter
curl -X DELETE "http://localhost:3000/items/123"
```
