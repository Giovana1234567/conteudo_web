
import {
  Column,
  CreateDateColumn,
  Entity,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * O entity TecnicoEntity vai ser usado para mapear os dados da tabela de usuários no PostgreSQL,
 * ele pode ser testado com o TypeORM em tempo de inicialização
 * e vai ser importado em TecnicoModule e AulaModule para gerar tabelas e relacionamentos FK no banco de dados.
 */
@Entity('Tecnico')
export class TecnicoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    nullable: false
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 11,
    nullable: false, // não pode ser nulo
    unique: true // tem que ser unico
  })
  cpf: string;

  @Column({
    type: 'varchar',
    notNull: true
  })
  email: string;


  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

}
