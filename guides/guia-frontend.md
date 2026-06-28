# Guia de Replicação do Frontend (Next.js / React)

Este guia ensina como integrar e adaptar a aplicação frontend em **Next.js (React)** para consumir as APIs REST do NestJS durante a prova de WEB II. A estrutura foi criada de forma modular para que você possa copiar e colar arquivos inteiros diretamente para o seu projeto da prova.

---

## 🔌 1. Configuração de Porta e URL de Conexão com o Backend

Todas as chamadas do frontend para a API do NestJS são centralizadas na constante `API_BASE_URL`.

- **Onde alterar**: [config.ts](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/config.ts)
- **Código de Exemplo**:
  ```typescript
  // Altere a URL e a porta abaixo para coincidir com as configurações da sua API NestJS
  export const API_BASE_URL = 'http://localhost:3007';
  ```

---

## 📂 2. Estrutura Modular de Arquivos (Copy & Paste)

A pasta `/app` está estruturada em submódulos separados. Cada tela contém apenas os seus arquivos independentes:

- **Autenticação**:
  - [login/page.tsx](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/autenticacao/login/page.tsx): Tela para realizar o login e salvar o JWT.
  - [registrar/page.tsx](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/autenticacao/registrar/page.tsx): Tela para cadastrar novas credenciais.
  - [perfil/page.tsx](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/autenticacao/perfil/page.tsx): Rota protegida por token que consome perfil e pesquisa CEP.
- **Usuários (PostgreSQL)**:
  - [criar/page.tsx](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/usuario/criar/page.tsx): Cadastro de usuários simples.
  - [listar/page.tsx](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/usuario/listar/page.tsx): Listagem com ações de Excluir e Editar.
  - [atualizar/[id]/page.tsx](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/usuario/atualizar/[id]/page.tsx): Edição que recebe o ID pela URL.
- **Aulas (PostgreSQL FK)**:
  - [criar/page.tsx](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/aula/criar/page.tsx): Cadastro carregando a lista de usuários no `<select>`.
  - [listar/page.tsx](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/aula/listar/page.tsx): Listagem exibindo dados do usuário associado (aula.user.name).
- **Estudantes (MongoDB + Upload)**:
  - [criar/page.tsx](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/estudante/criar/page.tsx): Upload da foto e salvamento do estudante.
  - [listar/page.tsx](file:///c:/Users/supor/Desktop/Pessoal/conteudo_recuperacao/projeto-de-consulta/frontend/app/estudante/listar/page.tsx): Grid contendo exibição da foto armazenada estaticamente.

---

## 🔑 3. Armazenamento e Envio do Token JWT (Rotas Protegidas)

Após efetuar login com sucesso, salvamos o token JWT retornado no `localStorage`:
```typescript
// Salvar no Login:
localStorage.setItem("token", data.access_token);

// Limpar no Logout:
localStorage.removeItem("token");
```

Para fazer requisições a endpoints que exijam autenticação, recupere o token e insira o cabeçalho `Authorization` com o prefixo `Bearer`:
```typescript
const token = localStorage.getItem("token");

const response = await fetch(`${API_BASE_URL}/autenticacao/profile`, {
  method: "GET",
  headers: {
    "Authorization": `Bearer ${token}`, // Injeta o token de autenticação
  },
});
```

---

## 📤 4. Upload de Arquivos via Multipart/Form-Data em JS Puro

Ao enviar arquivos (como imagens ou PDFs) para o backend NestJS integrado com Multer:

1. Capture o arquivo do input `<input type="file" onChange={handleFileChange} />`.
2. Use a classe nativa `FormData` para agrupar o binário.
3. **MUITO IMPORTANTE**: **Não defina o header `Content-Type` manualmente** nas chamadas Fetch com FormData. O browser calcula o header com o `boundary` correto automaticamente.

```typescript
const uploadData = new FormData();
// A chave "file" deve bater com a mesma chave configurada no interceptor do NestJS
uploadData.append("file", selectedFile);

const uploadResponse = await fetch(`${API_BASE_URL}/estudante/upload`, {
  method: "POST",
  body: uploadData, // O browser define o Content-Type como multipart/form-data
});

const uploadResult = await uploadResponse.json();
const photoUrl = uploadResult.url; // Retorna o caminho da foto gravada (/img/pictures/...)
```

---

## 📚 5. Renderizando Relacionamentos (Dropdown dinâmico de Chave Estrangeira)

Para cadastrar registros vinculando chaves estrangeiras (ex: agendar uma aula associando-a a um usuário):

1. Carregue no carregamento da página (useEffect) as opções de registros pai do banco de dados:
   ```typescript
   const response = await fetch(`${API_BASE_URL}/usuario/all`);
   const data = await response.json();
   setUsers(data);
   ```
2. Renderize as opções dinamicamente no `<select>` do HTML:
   ```jsx
   <select value={userId} onChange={(e) => setUserId(Number(e.target.value))}>
     <option value="">Selecione...</option>
     {users.map(u => (
       <option key={u.id} value={u.id}>{u.name}</option>
     ))}
   </select>
   ```
