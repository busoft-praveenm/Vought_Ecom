import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToMany } from "typeorm";
import { UserDb } from "./tbl_user.entity";

@Entity('tbl_role')
export class RoleDb {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ unique: true })
  name: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany(() => UserDb, (user) => user.role)
  users: UserDb[];
}
