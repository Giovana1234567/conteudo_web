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
   - [**Guia de Contenção da Prova (FAQ de Sobrevivência)**](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/guia-contencao-prova.md)
3. **`/projeto-de-consulta`**: O **Projeto de Consulta (PC)**, estruturado em:
   - **`/backend`**: Aplicação NestJS contendo a API completa e documentada de referência.
   - **`/frontend`**: Pasta para acomodar o front-end simples que se conecta à API.
4. **`/Materiais de aula`**: Projetos e arquivos originais fornecidos nas aulas da faculdade durante o semestre.

---

## 🚀 Tutorial: Como Inicializar os Projetos

Tanto o **Projeto de Consulta (Backend)** quanto os **Materiais de Aula (ex: Aula 14)** são projetos NestJS. Siga os passos correspondentes abaixo para rodá-los.

### Opção A: Executar o Projeto de Consulta (PC)

1. **Subir os Bancos de Dados locais (via Docker)**:
   Acesse a pasta `/projeto-de-consulta` no terminal e execute:
   ```bash
   docker-compose up -d
   ```
2. **Inicializar a Aplicação NestJS (Backend)**:
   Acesse a pasta `/projeto-de-consulta/backend` e execute:
   ```bash
   # Instalar dependências
   npm install
   
   # Iniciar em modo de desenvolvimento
   npm run start:dev
   ```
3. **Inicializar a Aplicação React/Next.js (Frontend)**:
   Acesse a pasta `/projeto-de-consulta/frontend` e execute:
   ```bash
   # Instalar dependências
   npm install
   
   # Iniciar em modo de desenvolvimento
   npm run dev
   ```
4. **Testar**:
   - Acesso ao Frontend (Portal): [http://localhost:3003](http://localhost:3003) (ou porta indicada no terminal)
   - Acesso ao Backend Swagger: [http://localhost:3007/swagger](http://localhost:3007/swagger)
   - Guia de replicação: [guia-frontend.md](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/guides/guia-frontend.md)

---

### Opção B: Executar os Materiais de Aula (Aula 14)

1. **Garantir os Bancos de Dados**:
   - Certifique-se de que o PostgreSQL e o MongoDB estão rodando (você pode usar o docker-compose do PC na raiz para subir os bancos).
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

## 🛠️ Como Criar e Resetar os Projetos (CMD Windows)

Caso precise recriar os projetos do zero ou realizar um reset completo/rápido diretamente pelo **Prompt de Comando (CMD)** do Windows:

### 1. Criar Backend do Zero (NestJS)
Cria uma nova estrutura limpa para o servidor:
```cmd
npx -y @nestjs/cli new backend --package-manager=npm --skip-git
```

### 2. Criar Frontend do Zero (Next.js)
Cria uma nova estrutura limpa para o portal (sem Tailwind):
```cmd
npx -y create-next-app@latest frontend --ts --eslint --app --src-dir=false --import-alias="@/*" --use-npm --tailwind=false
```

### 3. Reset Completo (Apagar pastas e Recriar do zero)
Remove as pastas existentes e inicializa projetos limpos no local padrão:
```cmd
:: Reset do Backend
rd /s /q projeto-de-consulta\backend
npx -y @nestjs/cli new projeto-de-consulta/backend --package-manager=npm --skip-git

:: Reset do Frontend
rd /s /q projeto-de-consulta\frontend
npx -y create-next-app@latest projeto-de-consulta/frontend --ts --eslint --app --src-dir=false --import-alias="@/*" --use-npm --tailwind=false
```

### 4. Reset Rápido (Apenas limpar dependências e caches para reinstalar)
Remove pastas pesadas de build e bibliotecas sem apagar seu código-fonte, pronto para rodar `npm install` novamente:
```cmd
:: Limpar Backend
rd /s /q projeto-de-consulta\backend\node_modules projeto-de-consulta\backend\dist
del /f /q projeto-de-consulta\backend\package-lock.json

:: Limpar Frontend
rd /s /q projeto-de-consulta\frontend\node_modules projeto-de-consulta\frontend\.next
del /f /q projeto-de-consulta\frontend\package-lock.json

:: Limpar Tentativa de Prova
rd /s /q tentativa_prova\backend\node_modules tentativa_prova\backend\dist
del /f /q tentativa_prova\backend\package-lock.json
```
