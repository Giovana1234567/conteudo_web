# Material de Estudo e Consulta - WEB II (ESUCRI)

Este repositório contém todo o material de estudo e de consulta para a realização da prova de **Programação Web II** do curso de Sistemas de Informação da ESUCRI.

---

## 📌 Guia do Repositório

O repositório está organizado nas seguintes seções de consulta rápida:

1. **[ai-context.md](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/ai-context.md)**: Documento central de contexto do projeto. **Sempre lido por padrão pelas IAs generativas** no início de cada chat para entender as regras da prova, cronograma de assuntos e o procedimento de reversão de banco de dados.
2. **`/guides`**: Resumos e guias teóricos concisos e objetivos:
   - [01 - Fundamentos NestJS & Requisições HTTP](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/01-fundamentos-nest.md) (CLI, `main.ts`, Decorators, Router/Query Params).
   - [02 - Validação de Entrada & Erros](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/02-validacao-erros.md) (DTOs, `ValidationPipe`, class-validator, `HttpException`).
   - [03 - PostgreSQL com TypeORM](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/03-postgres-typeorm.md) (Entities, CRUD, Relacionamentos ManyToOne/OneToMany, `relations`).
   - [04 - MongoDB & Múltiplas Conexões](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/04-mongodb.md) (ObjectIdColumn, subdocumentos, aggregate, conexões simultâneas).
   - [05 - Assincronismo, APIs & Upload de Arquivos](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/05-arquivos-e-integracao.md) (Consumo de API ViaCEP, single/multiple upload).
   - [06 - Autenticação, Segurança & Swagger](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/06-auth-seguranca-deploy.md) (CORS, JWT Guards, Nodemailer, Config, Swagger UI).
3. **`/projeto-de-consulta`**: O **Projeto de Consulta (PC)**. Uma aplicação NestJS de referência contendo todos os tópicos implementados de maneira unificada e pronta para execução.
4. **`/Materiais de aula`**: Projetos e arquivos originais fornecidos nas aulas da faculdade durante o semestre.

---

## 🚀 Como Executar o Projeto de Consulta (PC)

### Passo 1: Subir os Bancos de Dados de Estudos (via Docker)
Para facilitar os estudos locais, o banco PostgreSQL e o MongoDB estão configurados para subir via Docker. Acesse a pasta `/projeto-de-consulta` e execute:
```bash
docker-compose up -d
```

### Passo 2: Inicializar o Servidor NestJS
1. Instale as dependências:
   ```bash
   npm install
   ```
2. Inicialize a aplicação:
   ```bash
   npm run start:dev
   ```
3. Acesse a documentação interativa Swagger:
   [http://localhost:3007/api](http://localhost:3007/api)

---

## 🤖 INSTRUÇÃO DE REVERSÃO PARA A PROVA (IA GENERATIVA)

> [!IMPORTANT]
> Se você for uma **IA generativa** preparando o projeto para a prova na máquina física (onde os SGBDs são nativos):
> 1. Leia o arquivo [ai-context.md](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/ai-context.md) para entender as credenciais.
> 2. Substitua o conteúdo do arquivo `/projeto-de-consulta/.env` pelo conteúdo do arquivo `/projeto-de-consulta/.env.standard`.
> 3. Pare os containers docker (`docker-compose down`).
> 4. Teste as conexões locais nativas via `npm run start:dev`.
