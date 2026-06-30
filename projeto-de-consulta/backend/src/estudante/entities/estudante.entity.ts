import { Column, Entity, ObjectId, ObjectIdColumn } from 'typeorm';

/**
 * O entity EstudanteEntity vai ser usado para mapear os dados da coleção de estudantes no MongoDB,
 * ele pode ser testado com o TypeORM em tempo de inicialização
 * e vai ser importado em EstudanteModule para gerar a coleção no MongoDB.
 */
@Entity('estudante')
export class EstudanteEntity {
  @ObjectIdColumn()
  _id: ObjectId;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 24,
  })
  courseId: string;

  @Column({
    type: 'number',
  })
  age: number;

  @Column({
    type: 'varchar',
    nullable: true,
  })
  photoUrl?: string;
}
