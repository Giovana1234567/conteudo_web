# Guia 04 - MongoDB & Conexão a Múltiplos Bancos de Dados

---

## 1. Conexão MongoDB via TypeORM
Para conectar com o MongoDB no NestJS utilizando TypeORM, precisamos instalar o driver do MongoDB:

```bash
npm install --save mongodb
```

### Configuração de Múltiplos Bancos no `app.module.ts`
Para rodar PostgreSQL e MongoDB ao mesmo tempo no mesmo projeto, definimos o Postgres como conexão padrão e o MongoDB como uma conexão nomeada (`name: 'mongoConnection'`).

```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';

@Module({
  imports: [
    // Conexão Padrão (PostgreSQL)
    TypeOrmModule.forRoot({
      type: 'postgres',
      host: process.env.POSTGRES_HOST || 'localhost',
      port: 5432,
      username: 'postgres',
      password: 'mysecretpassword',
      database: 'estudos_db',
      autoLoadEntities: true,
      synchronize: true,
    }),

    // Segunda Conexão Nomeada (MongoDB)
    TypeOrmModule.forRoot({
      name: 'mongoConnection', // Nome da conexão para injeção posterior
      type: 'mongodb',
      url: process.env.MONGO_URL || 'mongodb://localhost:27017/programacaoweb',
      useUnifiedTopology: true,
      useNewUrlParser: true,
      autoLoadEntities: true, // Registra entities associadas ao driver mongo
    }),
  ],
})
export class AppModule {}
```

---

## 2. Decorators de Entidade (MongoDB)
As entidades do MongoDB no TypeORM usam decorators específicos devido à sua natureza noSQL:

```typescript
import { Entity, ObjectIdColumn, ObjectId, Column } from 'typeorm';

// Classe de apoio para subdocumentos/arrays de objetos
export class Telefone {
  @Column()
  ddd: string;

  @Column()
  numero: string;
}

@Entity('estudantes')
export class EstudanteEntity {
  @ObjectIdColumn() // Coluna de chave primária padrão do Mongo (_id)
  _id: ObjectId;

  @Column()
  nome: string;

  @Column(() => Telefone) // Array de objetos (documentos embarcados)
  telefones: Telefone[];

  @Column()
  cursoId: string; // Campo de referência simples para outra entidade
}
```

---

## 3. Repositories e Ajustes no Service
Ao utilizar múltiplas conexões e o MongoDB, precisamos especificar o nome da conexão ao registrar no Module e injetar no Service.

### Registro no Módulo (`estudante.module.ts`)
```typescript
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EstudanteEntity } from './entities/estudante.entity';
import { EstudanteService } from './estudante.service';

@Module({
  // Importante: Passar o nome da conexão MongoDB no segundo argumento do forFeature
  imports: [TypeOrmModule.forFeature([EstudanteEntity], 'mongoConnection')],
  providers: [EstudanteService],
})
export class EstudanteModule {}
```

### Injeção de Repositório MongoDB (`estudante.service.ts`)
No MongoDB do TypeORM, usamos `MongoRepository` em vez do `Repository` genérico.

```typescript
import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { MongoRepository } from 'typeorm';
import { ObjectId } from 'mongodb';
import { EstudanteEntity } from './entities/estudante.entity';

@Injectable()
export class EstudanteService {
  constructor(
    // Especificar a conexão do MongoDB na injeção
    @InjectRepository(EstudanteEntity, 'mongoConnection')
    private readonly estudanteRepository: MongoRepository<EstudanteEntity>,
  ) {}

  // 1. Buscar estudante por ID (Convertendo string para ObjectId)
  async buscarPorId(id: string): Promise<EstudanteEntity> {
    if (!ObjectId.isValid(id)) {
      throw new NotFoundException('ID do MongoDB inválido');
    }
    const estudante = await this.estudanteRepository.findOne({
      where: { _id: new ObjectId(id) },
    });
    if (!estudante) throw new NotFoundException('Estudante não encontrado');
    return estudante;
  }

  // 2. Criar Estudante
  async criar(dados: any): Promise<EstudanteEntity> {
    const novoEstudante = this.estudanteRepository.create(dados);
    return await this.estudanteRepository.save(novoEstudante);
  }

  // 3. Atualizar Estudante
  async atualizar(id: string, dados: any): Promise<EstudanteEntity> {
    const estudante = await this.buscarPorId(id);
    const estudanteAtualizado = this.estudanteRepository.merge(estudante, dados);
    return await this.estudanteRepository.save(estudanteAtualizado);
  }
}
```

---

## 4. Consultas MongoDB Avançadas (Aggregate)
O `MongoRepository` do TypeORM permite executar pipelines de agregação do MongoDB de forma nativa:

```typescript
// Exemplo: Buscar estudantes agrupados por Curso
async obterEstatisticasPorCurso(): Promise<any[]> {
  const pipeline = [
    {
      $group: {
        _id: '$cursoId',
        totalEstudantes: { $sum: 1 },
        nomes: { $push: '$nome' }
      }
    },
    {
      $sort: { totalEstudantes: -1 }
    }
  ];

  // Executa o aggregate diretamente no MongoDB
  return await this.estudanteRepository.aggregate(pipeline).toArray();
}
```
