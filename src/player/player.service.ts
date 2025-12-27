import { Injectable, NotFoundException } from "@nestjs/common";
import { InjectRepository } from "@nestjs/typeorm";
import { Repository } from "typeorm";
import { Player } from "./entities";
import { ListPlayerRequestDto, UnListPlayerRequestDto } from "./dto";

@Injectable()
export class PlayerService {
  constructor(
    @InjectRepository(Player)
    private readonly playerRepository: Repository<Player>,
  ) {}

  public async listPlayer(dto: ListPlayerRequestDto, userId: string) {
    const player = await this.playerRepository.findOne({
      where: { id: dto.id, team: { user: { id: userId } } },
      relations: ['team'],
    });

    if (!player) throw new NotFoundException('Player not found');

    player.isListed = true;
    player.askingPrice = dto.price;

    return this.savePlayer(player);
  }

  public async unListPlayer(dto: UnListPlayerRequestDto, userId: string) {
    const player = await this.playerRepository.findOne({
      where: { id: dto.id, team: { user: { id: userId } } },
    });

    if (!player) throw new NotFoundException('Player not found');

    player.isListed = false;
    player.askingPrice = null;

    return this.savePlayer(player);
  }

  public createPlayers(players: Partial<Player>[]) {
    return this.playerRepository.save(players);
  }

  private savePlayer(player: Player) {
    return this.playerRepository.save(player);
  }
}
