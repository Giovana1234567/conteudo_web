# CONTEXTO DE DESENVOLVIMENTO & INSTRUÇÕES DE REVERSÃO PARA IA

> [!IMPORTANT]
> **ATENÇÃO IA:** Este arquivo é a fonte primária de contexto deste repositório. Sempre que iniciar uma nova sessão, leia este arquivo integralmente e utilize-o como base para guiar suas ações. Qualquer alteração ou nova diretriz deve ser registrada aqui.

---

## 1. O Cenário e Objetivo Geral
Este repositório foi construído para servir de material de consulta completo e prático para a prova de **WEB II** do curso de Sistemas de Informação da **ESUCRI**.

- **Tempo Limitado**: Todas as explicações em arquivos de código ou guias devem ser **curtas, objetivas e diretas ao ponto**.
- **Foco em Integração**: O professor costuma cobrar questões abrangentes conectando conceitos (ex: autenticação JWT no backend ligada a um frontend que renderiza uma página de dashboard após o login, tratando CORS).
- **Materiais de Aula**: Os arquivos originais da disciplina estão sob a pasta `/Materiais de aula` e devem ser mantidos e respeitados, servindo de base direta para as soluções.

---

## 2. A Estrutura do Repositório
- `/Materiais de aula/`: Códigos fornecidos originalmente durante o semestre.
- `/guides/`: Resumos rápidos da teoria e dos comandos mais comuns para consulta rápida.
- `/projeto-de-consulta/` (PC): Um projeto NestJS contendo a aplicação de referência prática contendo todas as técnicas descritas no cronograma, configurado para rodar localmente no Docker e facilmente conversível.

---

## 3. Estratégia de Banco de Dados: Estudo (Docker) vs. Prova (Nativo)

### Cenário de Estudos (Atual)
Para viabilizar o desenvolvimento local do aluno sem necessidade de instalar localmente os bancos de dados, configuramos um ambiente baseado em **Docker**:
- O projeto NestJS aponta para os bancos do Docker por meio das variáveis no arquivo `.env` (que recebe o conteúdo de `.env.docker`).
- PostgreSQL e MongoDB são gerenciados pelo arquivo `docker-compose.yml`.

### Cenário da Prova
Na prova, a execução dos bancos de dados será **nativa na máquina física** (executando diretamente como serviço do Windows), utilizando as instalações e portas padrão do SGBD.

#### INSTRUÇÃO DE REVERSÃO PARA A IA (Antes da Prova)
Antes da prova, a IA generativa em atendimento deve realizar a reversão do projeto para as configurações padrão locais. Siga os passos:

1. **Substituir o arquivo de ambiente**:
   - Sobrescreva o conteúdo do arquivo `/projeto-de-consulta/.env` com o conteúdo do arquivo `/projeto-de-consulta/.env.standard`.
2. **Confirmar as portas e credenciais padrão**:
   - **PostgreSQL**: host `localhost`, porta `5432`, usuário `postgres`, senha vazia ou a padrão de instalação local.
   - **MongoDB**: host `localhost`, porta `27017`, banco `programacaoweb` (sem usuário/senha caso seja instalação padrão simples).
3. **Desativar Docker**:
   - Não iniciar o container docker e garantir que a aplicação NestJS em `/projeto-de-consulta` se conecte diretamente nas portas nativas da máquina host.
4. **Verificar Conexões**:
   - Rodar `npm run start:dev` e validar se o NestJS inicializa com sucesso apontando para os serviços instalados localmente no Windows.

---

## 4. Grade Completa de Assuntos (Cronograma de Estudos)

1. **Fundamentos NestJS**:
   - Comandos CLI (`nest --help`, `nest g mo`, `nest g co`, `nest g s`).
   - Estrutura: `main.ts`, Decorators (`@Module`, `@Controller`, `@Injectable`, etc.), injeção de dependência manual vs CLI.
   - Parâmetros de rotas: Router parameters (`@Param`), Query parameters (`@Query`), Body (`@Body`).
2. **Erros e Validação**:
   - `HttpException` e exceções customizadas/especializadas.
   - DTOs, `useGlobalPipes(new ValidationPipe({...}))`, `class-validator` e `class-transformer`.
   - `PartialType` (reaproveitar DTO para Update), `whitelist: true`, `forbidNonWhitelisted: true`.
3. **Persistência PostgreSQL com TypeORM**:
   - Configuração de conexão do TypeORM, `autoLoadEntities`, `synchronize`.
   - Decorators: `@Entity`, `@PrimaryGeneratedColumn`, `@CreateDateColumn`, `@UpdateDateColumn`, `@Column`.
   - Repositories (`@InjectRepository(Entity)`), métodos CRUD (`find`, `findOne`, `create`, `save`, `merge`, `remove`).
   - Relacionamentos (FK): `@ManyToOne`, `@JoinColumn`, `@OneToMany`, opções `onDelete: 'CASCADE'`, `onUpdate: 'CASCADE'`. Retornar relações via consulta.
4. **Persistência MongoDB**:
   - String de conexão, conexão via TypeORM (`mongoConnection`).
   - Decorators: `@ObjectIdColumn` (TypeORM com MongoDB), arrays de objetos, campos de referência.
   - Ajustes nos Services para `_id` (`ObjectId`) e consultas MongoDB agregadas (`aggregate`).
5. **Assincronismo e Upload de Arquivos**:
   - Requisições assíncronas no frontend/backend (`async` e `await`).
   - Upload de arquivos no Nest: arquivo simples (`FileInterceptor`), múltiplos arquivos (`FilesInterceptor` ou `FileFieldsInterceptor`).
6. **Autenticação, CORS e Integrações**:
   - Configuração de CORS no NestJS (`app.enableCors()`).
   - Autenticação com JWT (Guard, Strategy, Sign, Payload).
   - NestJS Config e Variáveis de Ambiente (`ConfigModule.forRoot`).
   - Envio de emails com Nodemailer.
   - Documentação de APIs com Swagger (`@nestjs/swagger`).
