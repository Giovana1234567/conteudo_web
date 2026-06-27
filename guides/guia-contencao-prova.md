# Guia de Contenção da Prova - Resoluções Rápidas (Gabarito)

Este é o seu guia de sobrevivência para a prova de WEB II. Ele traduz os requisitos descritos no áudio em formato de **Questões e Respostas Rápidas**, indicando o arquivo exato da base do backend para consultar, as alterações de código diretas e como testar via terminal.

---

## ❓ Questão 1: Sistema de Login com CPF e Senha

### Onde Encontrar na Base
- **Controller**: [autenticacao.controller.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/autenticacao/autenticacao.controller.ts)
- **Service**: [autenticacao.service.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/autenticacao/autenticacao.service.ts)
- **Entity**: [autenticacao.entity.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/autenticacao/entities/autenticacao.entity.ts)
- **DTOs**: [criar-autenticacao.dto.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/autenticacao/dto/criar-autenticacao.dto.ts) e [login.dto.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/autenticacao/dto/login.dto.ts)

### Como Fazer
1. No arquivo `autenticacao.entity.ts`, adicione o campo `cpf`:
   ```typescript
   @Column({ type: 'varchar', length: 11, unique: true })
   cpf: string;
   ```
2. No arquivo `login.dto.ts`, substitua o campo `@IsEmail() email` por `@IsString() cpf`:
   ```typescript
   @IsString()
   @IsNotEmpty()
   readonly cpf: string;
   ```
3. No arquivo `autenticacao.service.ts`, na função `login`, altere a busca:
   ```typescript
   // De:
   const auth = await this.findUserByEmail(loginDto.email);
   // Para:
   const auth = await this.authRepository.findOne({ where: { cpf: loginDto.cpf } });
   ```

### Como Testar
```bash
# Efetuar login com CPF
curl -X POST "http://localhost:3007/autenticacao/login" -H "Content-Type: application/json" -d "{\"cpf\":\"12345678901\", \"password\":\"senha123\"}"
```

---

## ❓ Questão 2: Produto com Título, Descrição, Preço e Imagem Única (Postgres + Upload)

### Onde Encontrar na Base
- **Upload de arquivo**: [estudante.service.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/estudante/estudante.service.ts) (método `upload`)
- **CRUD e estrutura Postgres**: [usuario.service.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/usuario/usuario.service.ts)

### Como Fazer
1. Crie a entidade `ProdutoEntity` (`produto.entity.ts`) mapeando as colunas no Postgres:
   ```typescript
   @Entity('produto')
   export class ProdutoEntity {
     @PrimaryGeneratedColumn()
     id: number;
     @Column()
     titulo: string;
     @Column('text')
     descricao: string;
     @Column('decimal')
     preco: number;
     @Column()
     imagemUrl: string; // Guardará o link retornado pelo upload
   }
   ```
2. No controller, intercepte o arquivo e chame a gravação física antes de salvar no banco de dados:
   ```typescript
   @Post()
   @UseInterceptors(FileInterceptor('file')) // Recebe o arquivo na chave "file"
   async criar(@UploadedFile() file: Express.Multer.File, @Body() body: CriarProdutoDto) {
     const uploadResult = await this.estudanteService.upload(file); // Grava localmente em /pictures
     return await this.produtoService.save({ ...body, imagemUrl: uploadResult.url });
   }
   ```

### Como Testar
```bash
# Enviar imagem e campos adicionais (Multipart)
curl -X POST "http://localhost:3007/produto" -F "file=@caminho/foto.jpg" -F "titulo=Mouse" -F "descricao=Sem fio" -F "preco=150"
```

---

## ❓ Questão 3: Produto com Array de Imagens & Array de Strings (MongoDB)

### Onde Encontrar na Base
- **Entidades MongoDB**: [estudante.entity.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/estudante/entities/estudante.entity.ts)
- **Operações MongoDB**: [estudante.service.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/estudante/estudante.service.ts)

### Como Fazer
1. No MongoDB, colunas de array são declaradas como `@Column('array')`:
   ```typescript
   @Entity('produto_detalhado')
   export class ProdutoDetalhadoEntity {
     @ObjectIdColumn()
     _id: ObjectId;
     @Column()
     titulo: string;
     @Column()
     descricao: string;
     @Column('number')
     preco: number;
     @Column('array')
     imagensUrl: string[]; // Guardará as URLs dos uploads
     @Column('array')
     tags: string[]; // Array de strings (ex: ["eletronicos", "promocao"])
   }
   ```
2. Para fazer upload de múltiplos arquivos no controller, use `FilesInterceptor` (plural):
   ```typescript
   @Post('lote')
   @UseInterceptors(FilesInterceptor('files', 10)) // Recebe até 10 arquivos na chave "files"
   async criarLote(@UploadedFiles() files: Array<Express.Multer.File>, @Body() body: CriarProdutoDto) {
     const uploadUrls = await Promise.all(files.map(f => this.estudanteService.upload(f)));
     const imagensUrl = uploadUrls.map(res => res.url);
     return await this.produtoDetalhadoService.save({ ...body, imagensUrl });
   }
   ```

### Como Testar
```bash
# Enviar múltiplos arquivos no curl
curl -X POST "http://localhost:3007/produto-detalhado/lote" -F "files=@foto1.jpg" -F "files=@foto2.jpg" -F "titulo=Celular" -F "preco=2000"
```

---

## ❓ Questão 4: Relacionamento 1:N (Muitos para Um) com Data e Categoria/Tipo (Postgres)

### Onde Encontrar na Base
- **Relação FK**: [aula.entity.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/aula/entities/aula.entity.ts) (`@ManyToOne`) e [usuario.entity.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/backend/src/usuario/entities/usuario.entity.ts) (`@OneToMany`)

### Como Fazer
1. Crie a entidade do lado **Um** (`tipo.entity.ts`):
   ```typescript
   @Entity('tipo')
   export class TipoEntity {
     @PrimaryGeneratedColumn()
     id: number;
     @Column()
     nome: string; // Ex: "Entrada"
     @OneToMany(() => TransacaoEntity, (t) => t.tipo)
     transacoes: TransacaoEntity[];
   }
   ```
2. Crie a entidade do lado **Muitos** (`transacao.entity.ts`):
   ```typescript
   @Entity('transacao')
   export class TransacaoEntity {
     @PrimaryGeneratedColumn()
     id: number;
     @Column()
     descricao: string;
     @Column('date')
     data: Date; // Campo de Data
     @ManyToOne(() => TipoEntity, (t) => t.transacoes, { onDelete: 'CASCADE' })
     @JoinColumn({ name: 'tipo_id' }) // Coluna FK
     tipo: TipoEntity;
   }
   ```
3. Na hora de buscar no service, adicione as relações para expor os dados mapeados:
   ```typescript
   this.transacaoRepository.find({ relations: ['tipo'] });
   ```

### Como Testar
```bash
# Listar registros trazendo o objeto do relacionamento
curl -X GET "http://localhost:3007/transacao/all"
```

---

## ❓ Questão 5: Como conectar a API com Java Swing (Front-end)

O frontend em Java Swing consumirá os endpoints REST mapeados. Veja o fluxo básico utilizando o `HttpClient` padrão do Java:

```java
import java.net.URI;
import java.net.http.HttpClient;
import java.net.http.HttpRequest;
import java.net.http.HttpResponse;

public class ServicoApi {
    private String tokenJwt = null;

    // 1. Efetuar Login e Armazenar o Token JWT
    public boolean login(String cpf, String senha) {
        try {
            HttpClient client = HttpClient.newHttpClient();
            String json = String.format("{\"cpf\":\"%s\", \"password\":\"%s\"}", cpf, senha);

            HttpRequest request = HttpRequest.newBuilder()
                    .uri(URI.create("http://localhost:3007/autenticacao/login"))
                    .header("Content-Type", "application/json")
                    .POST(HttpRequest.BodyPublishers.ofString(json))
                    .build();

            HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());

            if (response.statusCode() == 201) {
                // Captura o token de access_token da resposta
                String body = response.body();
                this.tokenJwt = body.split("\"access_token\":\"")[1].split("\"")[0];
                return true;
            }
        } catch (Exception e) {
            e.printStackTrace();
        }
        return false;
    }

    // 2. Realizar Busca Protegida com o Cabeçalho Authorization Bearer
    public String obterDadosProtegidos() throws Exception {
        HttpClient client = HttpClient.newHttpClient();
        HttpRequest request = HttpRequest.newBuilder()
                .uri(URI.create("http://localhost:3007/autenticacao/profile"))
                .header("Authorization", "Bearer " + this.tokenJwt) // Injeta o token nas chamadas
                .GET()
                .build();

        HttpResponse<String> response = client.send(request, HttpResponse.BodyHandlers.ofString());
        return response.body();
    }
}
```
> [!IMPORTANT]
> No Swing, chame o método `login` ao clicar no botão "Login". Se retornar verdadeiro, salve a instância do serviço e use-a nas telas seguintes para recuperar dados autenticados.
