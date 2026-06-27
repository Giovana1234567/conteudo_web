# Guia 05 - Assincronismo, Consumo de APIs & Upload de Arquivos

---

## 1. Programação Síncrona vs Assíncrona (`async`/`await`)
No NestJS e no Next.js (Node.js), operações de E/S (como chamadas de banco de dados ou requisições de rede) são assíncronas por padrão e retornam uma `Promise`.
- **`async`**: Define uma função que retorna uma Promise de forma implícita.
- **`await`**: Pausa a execução do código de maneira não-bloqueante até que a Promise seja resolvida. Só pode ser usado dentro de funções `async`.

```typescript
// Exemplo no NestJS (Service)
async buscarDadosExternos(): Promise<any> {
  try {
    const dados = await this.requisicaoBanco();
    return dados;
  } catch (error) {
    throw new Error('Falha ao buscar dados');
  }
}
```

---

## 2. Consumo de APIs Externas (Ex: ViaCEP)
Para fazer requisições HTTP do NestJS para APIs externas, instalamos o pacote `axios` e `@nestjs/axios`:

```bash
npm i --save @nestjs/axios axios
```

### Configuração no Módulo (`viacep.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { HttpModule } from '@nestjs/axios';
import { ViaCepService } from './viacep.service';
import { ViaCepController } from './viacep.controller';

@Module({
  imports: [HttpModule], // Registra o módulo HTTP
  providers: [ViaCepService],
  controllers: [ViaCepController],
})
export class ViaCepModule {}
```

### Chamada à API no Service (`viacep.service.ts`)
```typescript
import { Injectable, BadRequestException } from '@nestjs/common';
import { HttpService } from '@nestjs/axios';
import { firstValueFrom } from 'rxjs';

@Injectable()
export class ViaCepService {
  constructor(private readonly httpService: HttpService) {}

  async buscarCep(cep: string): Promise<any> {
    const cepLimpo = cep.replace(/\D/g, ''); // Remove traço e espaços
    if (cepLimpo.length !== 8) {
      throw new BadRequestException('CEP inválido');
    }

    const url = `https://viacep.com.br/ws/${cepLimpo}/json/`;
    
    // O HttpService do Nest retorna Observables. Usamos firstValueFrom para convertê-lo em Promise/await
    const response = await firstValueFrom(this.httpService.get(url));
    
    if (response.data.erro) {
      throw new BadRequestException('CEP não encontrado');
    }
    
    return response.data;
  }
}
```

---

## 3. Upload de Arquivos (Formulários multipart/form-data)
O NestJS vem com suporte embutido para upload de arquivos baseado no Middleware Multer.

---

### A. Upload de Arquivo Único
Para receber um único arquivo (como foto de perfil), usamos o interceptor `FileInterceptor` e o decorator `@UploadedFile()`.

```typescript
import { Controller, Post, UseInterceptors, UploadedFile, Body } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';

@Controller('arquivos')
export class ArquivosController {

  @Post('upload-unico')
  @UseInterceptors(FileInterceptor('arquivo')) // 'arquivo' é a chave (key) no Body Multipart
  uploadUnico(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: any // Recebe campos simples adicionais no formulário
  ) {
    return {
      mensagem: 'Arquivo recebido com sucesso!',
      arquivoOriginal: file.originalname,
      tamanho: file.size,
      dadosFormulario: body
    };
  }
}
```

---

### B. Upload de Múltiplos Arquivos
Para receber múltiplos arquivos em uma mesma chave (ex: fotos de produtos), usamos `FilesInterceptor` e `@UploadedFiles()`.

```typescript
import { Controller, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';

@Controller('arquivos')
export class ArquivosController {

  @Post('upload-multiplos')
  @UseInterceptors(FilesInterceptor('arquivos', 5)) // 'arquivos' é a chave, e o limite é de 5 arquivos
  uploadMultiplos(@UploadedFiles() files: Array<Express.Multer.File>) {
    return {
      mensagem: `${files.length} arquivos enviados com sucesso.`,
      nomes: files.map(f => f.originalname)
    };
  }
}
```

---

### C. Múltiplas Chaves de Arquivos Diferentes (FileFieldsInterceptor)
Caso queira receber arquivos de chaves diferentes (ex: `fotoPerfil` e `comprovanteEndereco` no mesmo POST), use `FileFieldsInterceptor`.

```typescript
import { Controller, Post, UseInterceptors, UploadedFiles } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';

@Controller('arquivos')
export class ArquivosController {

  @Post('upload-campos')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'avatar', maxCount: 1 },
    { name: 'documentos', maxCount: 3 }
  ]))
  uploadCampos(
    @UploadedFiles() files: { avatar?: Express.Multer.File[], documentos?: Express.Multer.File[] }
  ) {
    return {
      avatarRecebido: files.avatar ? files.avatar[0].originalname : null,
      documentosRecebidos: files.documentos ? files.documentos.map(f => f.originalname) : []
    };
  }
}
```
