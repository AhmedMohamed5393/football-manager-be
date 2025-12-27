import { Injectable } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { InjectQueue } from "@nestjs/bull";
import { Player, PlayerPosition } from "src/player/entities";
import { User } from "src/user/entities";
import { Queue } from "bull";
import { Team } from "./entities";
import { PlayerService } from "src/player/player.service";
import { TEAM_QUEUE } from "./constants";

@Injectable()
export class TeamService {
  constructor(
    @InjectRepository(Team) private readonly teamRepository: Repository<Team>,
    @InjectQueue(TEAM_QUEUE) private teamQueue: Queue,
    private readonly playerService: PlayerService,
  ) {}

  public async getTeamByUserId(userId: string) {
    return this.teamRepository.findOne({
      where: { user: { id: userId } },
      relations: ['players', 'user'],
      select: {
        user: {
          id: true,
          email: true,
        },
      },
    });
  }

  public async createTeamAsync(user: User) {
    await this.teamQueue.add('create-team', { user });
  }

  public async createTeamForUser(user: User) {
    const team = await this.teamRepository.save({
      name: `${user.email.split('@')[0]} FC`,
      user: user,
    });

    // async background creation
    setTimeout(async () => await this.generateInitialPlayers(team), 0);

    return team;
  }

  private async generateInitialPlayers(team: Team) {
    const players: Partial<Player>[] = [
      ...Array(3).fill(PlayerPosition.GK),
      ...Array(6).fill(PlayerPosition.DEF),
      ...Array(6).fill(PlayerPosition.MID),
      ...Array(5).fill(PlayerPosition.ATT),
    ].map(position => ({
      name: `${position}-${Math.random().toString(36).slice(2, 7)}`,
      position,
      team,
    }));

    await this.playerService.createPlayers(players);
  }
}
