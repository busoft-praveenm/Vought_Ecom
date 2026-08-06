import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn, ManyToOne, JoinColumn, OneToOne } from "typeorm";
import { RoleDb } from "./tbl_role.entity";
import { UserProfileDb } from "./tbl_user_profile.entity";

export enum UserStatus {
  "ACTIVE"="active",
  "INACTIVE"="inactive",
  "BLOCKED"="blocked"
}

@Entity('tbl_user')
export class UserDb {

  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ unique: true })
  userUid: string;

  @Column({ unique: true })
  firebaseUid: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @OneToOne(() => UserProfileDb, profile => profile.user, { cascade: true, eager: true })
  profile: UserProfileDb;

  @ManyToOne(() => RoleDb, role => role.users, { nullable: true, eager: true })
  @JoinColumn({ name: 'role_id' })
  role: RoleDb;

  @Column({ nullable: true })
  provider: string;

  @Column({ type: "enum", enum: UserStatus, default: UserStatus.ACTIVE })
  status: UserStatus;

  @Column({ type: 'text', nullable: true })
  photoUrl: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @DeleteDateColumn()
  deletedAt: Date;

  @Column({ type: "boolean", default: true })
  isActive: boolean;

  @Column({ type: "boolean", default: false })  
  isDeleted: boolean;

}