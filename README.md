# Material de Estudo e Consulta - WEB II (ESUCRI)

Este repositório contém todo o material de estudo e de consulta para a realização da prova de **Programação Web II** do curso de Sistemas de Informação da ESUCRI.

Por padrão, as pastas `node_modules/` e `dist/` estão **excluídas do controle de versão (Git)** para manter o repositório leve. Você deve instalar as dependências localmente antes de rodar os projetos.

---

## 📌 Guia do Repositório

O repositório está organizado nas seguintes seções de consulta rápida:

1. **[ai-context.md](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/ai-context.md)**: Documento central de contexto do projeto. **Sempre lido por padrão pelas IAs generativas** no início de cada chat.
2. **`/guides`**: Resumos e guias teóricos concisos e objetivos:
   - [01 - Fundamentos NestJS & Requisições HTTP](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/01-fundamentos-nest.md)
   - [02 - Validação de Entrada & Erros](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/02-validacao-erros.md)
   - [03 - PostgreSQL com TypeORM](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/03-postgres-typeorm.md)
   - [04 - MongoDB & Múltiplas Conexões](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/04-mongodb.md)
   - [05 - Assincronismo, APIs & Upload de Arquivos](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/05-arquivos-e-integracao.md)
   - [06 - Autenticação, Segurança & Swagger](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/06-auth-seguranca-deploy.md)
3. **`/projeto-de-consulta`**: O **Projeto de Consulta (PC)**. Uma aplicação NestJS de referência contendo todos os tópicos implementados de maneira unificada.
4. **`/Materiais de aula`**: Projetos e arquivos originais fornecidos nas aulas da faculdade durante o semestre.

---

## 🚀 Tutorial: Como Inicializar os Projetos

Tanto o **Projeto de Consulta** quanto os **Materiais de Aula (ex: Aula 14)** são projetos NestJS. Siga os passos correspondentes abaixo para rodá-los.

### Opção A: Executar o Projeto de Consulta (PC)

1. **Subir os Bancos de Dados locais (via Docker)**:
   Acesse a pasta `/projeto-de-consulta` no terminal e execute:
   ```bash
   docker-compose up -d
   ```
2. **Inicializar a Aplicação NestJS**:
   Acesse a pasta `/projeto-de-consulta` e execute:
   ```bash
   # Instalar dependências
   npm install
   
   # Iniciar em modo de desenvolvimento
   npm run start:dev
   ```
3. **Testar**:
   - Acesso ao Swagger: [http://localhost:3007/swagger](http://localhost:3007/swagger)

---

### Opção B: Executar os Materiais de Aula (Aula 14)

1. **Garantir os Bancos de Dados**:
   - Certifique-se de que o PostgreSQL e o MongoDB estão rodando (você pode usar o docker-compose do PC para subir os bancos).
2. **Inicializar a Aplicação**:
   Acesse a pasta `/Materiais de aula/14` e execute:
   ```bash
   # Instalar dependências
   npm install
   
   # Iniciar em modo de desenvolvimento
   npm run start:dev
   ```
3. **Testar**:
   - Acesso ao Swagger: [http://localhost:3005/swagger](http://localhost:3005/swagger)

---

## 🤖 INSTRUÇÃO DE REVERSÃO PARA A PROVA (IA GENERATIVA)

> [!IMPORTANT]
> Se você for uma **IA generativa** preparando o projeto para a prova na máquina física (onde os SGBDs são nativos):
> 1. Leia o arquivo [ai-context.md](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/ai-context.md) para entender as credenciais.
> 2. Substitua o conteúdo do arquivo `/projeto-de-consulta/.env` pelo conteúdo do arquivo `/projeto-de-consulta/.env.standard`.
> 3. Pare os containers docker (`docker-compose down`).
> 4. Teste as conexões locais nativas via `npm run start:dev`.
