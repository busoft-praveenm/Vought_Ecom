import { Entity, PrimaryGeneratedColumn, Column, CreateDateColumn, UpdateDateColumn, OneToOne, JoinColumn } from "typeorm";
import { UserDb } from "./tbl_user.entity";

@Entity('tbl_user_profile')
export class UserProfileDb {
  @PrimaryGeneratedColumn('increment', { type: 'int' })
  id: number;

  @Column({ nullable: true })
  firstName: string;

  @Column({ nullable: true })
  lastName: string;

  @Column({ nullable: true })
  mobileNumber: string;

  @Column({ type: 'text', nullable: true })
  billingAddress: string;

  @Column({ type: 'text', nullable: true })
  deliveryAddress: string;

  @Column({ type: 'decimal', precision: 10, scale: 8, nullable: true })
  deliveryLat: number;

  @Column({ type: 'decimal', precision: 11, scale: 8, nullable: true })
  deliveryLng: number;

  @OneToOne(() => UserDb, user => user.profile, { onDelete: 'CASCADE' })
  @JoinColumn({ name: 'user_id' })
  user: UserDb;

  @Column({ name: 'user_id' })
  userId: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;
}
