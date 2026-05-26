import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, DeleteDateColumn } from "typeorm";

export enum UserStatus {
  "ACTIVE"="active",
  "INACTIVE"="inactive",
  "BLOCKED"="blocked"
}

@Entity('tbl_user')
export class UserDb {

  @PrimaryGeneratedColumn()
  id: number;

  @Column({ unique: true })
  userUid: string;

  @Column({ unique: true })
  firebaseUid: string;

  @Column({ nullable: false, unique: true })
  email: string;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  role: string;

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