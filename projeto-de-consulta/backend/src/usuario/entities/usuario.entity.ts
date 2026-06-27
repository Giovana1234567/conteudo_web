import { AulaEntity } from 'src/aula/entities/aula.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  OneToMany,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * O entity UsuarioEntity vai ser usado para mapear os dados da tabela de usuários no PostgreSQL,
 * ele pode ser testado com o TypeORM em tempo de inicialização
 * e vai ser importado em UsuarioModule e AulaModule para gerar tabelas e relacionamentos FK no banco de dados.
 */
@Entity('usuario')
export class UsuarioEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'boolean',
    default: false,
  })
  status: boolean;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => AulaEntity, (item) => item.user)
  listClass: AulaEntity[];
}
