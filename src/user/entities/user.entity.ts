import { Entity, Column, OneToOne, JoinColumn } from 'typeorm';
import { Base } from '@shared/entities/base.entity';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;
}
