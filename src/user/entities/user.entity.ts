import { Base } from '@shared/entities';
import { Team } from 'src/team/entities';
import { Entity, Column, OneToOne } from 'typeorm';

@Entity()
export class User extends Base {
  @Column({ unique: true })
  email: string;

  @Column()
  password: string;

  @OneToOne(() => Team, team => team.user)
  team: Team;
}
