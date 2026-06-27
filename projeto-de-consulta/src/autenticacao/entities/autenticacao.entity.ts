import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from 'typeorm';

/**
 * O entity AutenticacaoEntity vai ser usado para mapear as credenciais de login no PostgreSQL,
 * ele pode ser testado com o TypeORM em tempo de inicialização
 * e vai ser importado em AutenticacaoModule para gerar as tabelas de credenciais no banco relacional.
 */
@Entity('autenticacao')
export class AutenticacaoEntity {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'varchar',
    length: 100,
  })
  name: string;

  @Column({
    type: 'varchar',
    length: 100,
    unique: true,
  })
  email: string;

  @Column({
    type: 'varchar',
    length: 100,
  })
  password: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
