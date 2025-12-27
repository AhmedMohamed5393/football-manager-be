import { Entity, Column, ManyToOne } from "typeorm";
import { Team } from "src/team/entities";
import { Base } from "@shared/entities";
import { bigintTransformer } from "@shared/util";

export enum PlayerPosition {
  GK = 'GK',
  DEF = 'DEF',
  MID = 'MID',
  ATT = 'ATT',
}

@Entity()
export class Player extends Base {
  @Column()
  name: string;

  @Column({ type: 'enum', enum: PlayerPosition })
  position: PlayerPosition;

  @ManyToOne(() => Team, team => team.players, { nullable: true })
  team: Team | null;

  // transfer market
  @Column({ default: false })
  isListed: boolean;

  @Column({ type: 'bigint', transformer: bigintTransformer, nullable: true })
  askingPrice: number | null;
}
