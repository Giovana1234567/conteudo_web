import { UsuarioEntity } from 'src/usuario/entities/usuario.entity';
import {
  Column,
  CreateDateColumn,
  Entity,
  JoinColumn,
  ManyToOne,
  PrimaryGeneratedColumn,
  UpdateDateColumn,
} from 'typeorm';

/**
 * O entity AulaEntity vai ser usado para mapear os dados da tabela de aulas/classes no PostgreSQL,
 * ele pode ser testado com o TypeORM em tempo de inicialização
 * e vai ser importado em AulaModule para gerar tabelas e chaves estrangeiras no banco de dados.
 */
@Entity('aula')
export class AulaEntity {
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

  @ManyToOne(() => UsuarioEntity, { onDelete: 'CASCADE', onUpdate: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UsuarioEntity;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
