import { Column, CreateDateColumn, Entity, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";

@Entity()
export class AuthEntity {
      @PrimaryGeneratedColumn()
      id: number;
    
      @Column({
        type: 'varchar',
        length: 100,
      })
      name: string;
    
      @Column({
        type: 'varchar',
        length: 150,
      })
      email: string;
    
      @Column({
        type: 'varchar',
        length: 200,
      })
      password: string; 
    
      @CreateDateColumn()
      createdAt: Date;
    
      @UpdateDateColumn()
      updatedAt: Date;
}
