# Guia 03 - Persistência PostgreSQL com TypeORM

---

## 1. Instalação e Configuração Inicial
Para conectar o NestJS ao PostgreSQL utilizando o TypeORM, precisamos das seguintes bibliotecas:

```bash
npm install --save @nestjs/typeorm typeorm pg
```

### Configuração no `app.module.ts`
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: Number(process.env.POSTGRES_PORT) || 5432,
      username: process.env.POSTGRES_USER || 'postgres',
      password: process.env.POSTGRES_PASSWORD || 'postgres',
      database: process.env.POSTGRES_DB || 'faculdade_db',
      autoLoadEntities: true, // Carrega entities automaticamente
      synchronize: true,      // Sincroniza tabelas no banco (NÃO usar em produção)
    }),
  ],
 })
export class AppModule {}
```
ou sem .env

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    TypeOrmModule.forRoot({
        type: 'postgres',
      host: 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'postgres',
      database: 'faculdade_db',
      autoLoadEntities: true, // Carrega entities automaticamente
      synchronize: true,     // Sincroniza tabelas no banco (NÃO usar em produção)
    }),
  ],
 })
export class AppModule {}
```

---

## 2. Decorators de Entidade (PostgreSQL)
A entidade define o esquema da tabela no PostgreSQL.

```typescript
import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn } from 'typeorm';

@Entity('usuario') // Nome da tabela no banco de dados
export class UsuarioEntity {
  @PrimaryGeneratedColumn('uuid') // Gera UUID autoincremental
  id: string;

  @Column({ type: 'varchar', length: 150, nullable: false })
  nome: string;

  @Column({ unique: true })
  email: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
```

---

## 3. Repositories e Injeção de Dependências
Para utilizar a entidade no Service:

1. **Registrar a entidade no módulo correspondente (`usuario.module.ts`)**:
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { UsuarioService } from './usuario.service';

@Module({
  imports: [TypeOrmModule.forFeature([UsuarioEntity])],
  providers: [UsuarioService],
  exports: [UsuarioService], // Exporta se outros módulos precisarem usar
})
export class UsuarioModule {}
```

2. **Injetar o Repository no Service (`usuario.service.ts`)**:
```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { UsuarioEntity } from './entities/usuario.entity';
import { CriarUsuarioDto } from './dtos/criar-usuario.dto';

@Injectable()
export class UsuarioService {
  constructor(
    @InjectRepository(UsuarioEntity)
    private readonly usuarioRepository: Repository<UsuarioEntity>,
  ) {}
}
```

---

## 4. Operações CRUD Básicas com TypeORM
Principais métodos utilizados do `Repository`:

```typescript
// 1. Criar e Salvar (Create/Save)
async criar(dto: CriarUsuarioDto): Promise<UsuarioEntity> {
  // O método create cria apenas a instância da classe, não grava no banco
  const novoUsuario = this.usuarioRepository.create(dto);
  // O save executa o INSERT ou UPDATE no banco
  return await this.usuarioRepository.save(novoUsuario);
}

// 2. Buscar Todos (Find)
async buscarTodos(): Promise<UsuarioEntity[]> {
  return await this.usuarioRepository.find();
}

// 3. Buscar Um (FindOne)
async buscarPorId(id: string): Promise<UsuarioEntity> {
  const usuario = await this.usuarioRepository.findOne({ where: { id } });
  if (!usuario) throw new NotFoundException('Usuário não encontrado');
  return usuario;
}

// 4. Mesclar e Salvar (Update)
async atualizar(id: string, dto: any): Promise<UsuarioEntity> {
  const usuario = await this.buscarPorId(id);
  // O merge copia as propriedades do DTO para a entidade encontrada
  const usuarioAtualizado = this.usuarioRepository.merge(usuario, dto);
  return await this.usuarioRepository.save(usuarioAtualizado);
}

// 5. Remover (Remove)
async deletar(id: string): Promise<void> {
  const usuario = await this.buscarPorId(id);
  // O remove deleta o registro do banco de dados
  await this.usuarioRepository.remove(usuario);
}
```

---

## 5. Vinculação de Entidades (Relacionamentos FK)
Para mapear chaves estrangeiras entre tabelas:

### Relacionamento 1:N (Um Usuário possui muitas Classes/Aulas)

- **Entidade do Lado "Muitos" (`aula.entity.ts`)**:
```typescript
import { Entity, PrimaryGeneratedColumn, Column, ManyToOne, JoinColumn } from 'typeorm';
import { UsuarioEntity } from '../../usuario/entities/usuario.entity';

@Entity('aula')
export class AulaEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  // ManyToOne define que muitas aulas pertencem a um usuário
  @ManyToOne(() => UsuarioEntity, (usuario) => usuario.listClass, {
    onDelete: 'CASCADE', // Se o usuário for deletado, suas aulas também serão
    onUpdate: 'CASCADE',
  })
  @JoinColumn({ name: 'user_id' }) // Especifica o nome da coluna FK no banco
  user: UsuarioEntity;
}
```

- **Entidade do Lado "Um" (`usuario.entity.ts`)**:
```typescript
import { OneToMany } from 'typeorm';
import { AulaEntity } from '../../aula/entities/aula.entity';

// Adicione dentro da classe UsuarioEntity:
@OneToMany(() => AulaEntity, (aula) => aula.user, { cascade: true })
listClass: AulaEntity[];
```

### Consultando com Campos Vinculados
Por padrão, o TypeORM não traz dados relacionados. É necessário declarar o array `relations`:

```typescript
// Retorna o usuário trazendo a lista de aulas vinculadas
async buscarUsuarioComAulas(id: string): Promise<UsuarioEntity> {
  const usuario = await this.usuarioRepository.findOne({
    where: { id },
    relations: ['listClass'], // Nome do atributo definido no @OneToMany
  });
  if (!usuario) throw new NotFoundException('Usuário não encontrado');
  return usuario;
}
```
