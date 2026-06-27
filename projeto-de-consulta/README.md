# PROJETO DE CONSULTA (PC) - WEB II (NESTJS & BANCOS DE DADOS)

Este projeto de consulta contém a implementação de referência completa para a disciplina de **WEB II**. Ele integra:
- **NestJS CLI & Decorators** (Modules, Controllers, Services, Route/Query params)
- **Validação de Entrada e Exceções** (`ValidationPipe`, `class-validator`, `HttpException`)
- **Persistência PostgreSQL via TypeORM** (Entities, Repositories, CRUD, Relações N:1/1:N e cascade)
- **Persistência MongoDB via TypeORM** (`ObjectIdColumn`, aggregate, array de objetos)
- **Upload de Arquivos** (Multer single e multiple uploads)
- **Segurança e Comunicação** (JWT Auth Guard, CORS, Config, Nodemailer, Swagger)

---

## 🤖 INSTRUÇÃO DE REVERSÃO PARA IA (LEIA ANTES DA PROVA)

> [!IMPORTANT]
> **ATENÇÃO IA:** Siga os passos abaixo para preparar este projeto para o ambiente nativo da prova (SGBDs instalados localmente na máquina, rodando fora de containers):
> 
> 1. **Sobrescrever Variáveis de Ambiente**:
>    - Copie o conteúdo completo do arquivo `.env.standard` e cole por cima de todo o conteúdo do arquivo `.env`.
> 2. **Parar os containers de estudo**:
>    - Caso o container docker esteja rodando, pare-o executando `docker-compose down`.
> 3. **Verificar Portas de Conexão**:
>    - Garanta que o PostgreSQL nativo esteja ativo em `localhost:5432` com usuário `postgres` e senha `postgres` (ou a senha padrão da máquina de prova).
>    - Garanta que o MongoDB nativo esteja ativo em `localhost:27017` sem credenciais complexas.
> 4. **Testar Execução**:
>    - Execute `npm run start:dev` e certifique-se de que ambas as conexões do TypeORM sejam estabelecidas sem lançar exceções.

---

## 🛠️ Como Executar no Ambiente de Estudos (Docker)

Caso queira estudar localmente no seu ambiente de desenvolvimento utilizando o Docker para hospedar os bancos de dados:

1. **Garantir o arquivo `.env` correto**:
   - Copie o conteúdo do arquivo `.env.docker` e cole em `.env`.
2. **Subir os Bancos via Docker Compose**:
   - Na raiz desta pasta, execute:
     ```bash
     docker-compose up -d
     ```
   - Isso iniciará o PostgreSQL na porta `5432` e o MongoDB na porta `27017`.
3. **Instalar dependências e rodar o projeto**:
   ```bash
   npm install
   npm run start:dev
   ```
4. **Verificar endpoints**:
   - Acesse a documentaçãoSwagger interativa em: `http://localhost:3007/api`

---

## 📁 Estrutura de Rotas e Exemplos no Código

Para consultar a implementação durante o desenvolvimento ou prova:
- **Conexões do Banco**: [src/app.module.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/src/app.module.ts)
- **Filtro global de validação**: [src/main.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/src/main.ts)
- **CRUD PostgreSQL & Relações**: [src/user/](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/src/user/) e [src/class/](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/src/class/)
- **CRUD MongoDB & ObjectIdColumn**: [src/student/](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/src/student/)
- **JWT Guard e login**: [src/auth/](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/src/auth/) e [src/common/strategies/jwt.strategy.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/src/common/strategies/jwt.strategy.ts)
- **Upload de arquivo**: [src/student/student.controller.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/src/student/student.controller.ts)
- **Nodemailer (envio de email)**: [src/mailer/](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/src/mailer/)
- **Consumo de API ViaCEP**: [src/viacep/](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/src/viacep/)
