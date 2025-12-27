import { Entity, Column, OneToOne, JoinColumn, OneToMany } from "typeorm";
import { Base } from "@shared/entities";
import { User } from "src/user/entities";
import { Player } from "src/player/entities";
import { bigintTransformer } from "@shared/util";

@Entity()
export class Team extends Base {
  @Column()
  name: string;

  @Column({ type: 'bigint', transformer: bigintTransformer, default: 5000000 })
  budget: number;

  @OneToOne(() => User, user => user.team)
  @JoinColumn()
  user: User;

  @OneToMany(() => Player, player => player.team)
  players: Player[];
}
