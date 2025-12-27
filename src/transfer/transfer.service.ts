import { Injectable, BadRequestException, NotFoundException } from "@nestjs/common";
import { DataSource, EntityManager, Filter, Not } from "typeorm";
import { Team } from "src/team/entities";
import { Player } from "src/player/entities";
import { FilterTransfersDto } from "./dto";

@Injectable()
export class TransferService {
  constructor(private readonly dataSource: DataSource) {}

  async buyPlayer(playerId: string, buyerUserId: string) {
    return this.dataSource.transaction(async (manager: EntityManager) => {
      const player = await manager.findOne(Player, {
        where: {
          id: playerId,
          isListed: true,
          team: { user: { id: Not(buyerUserId) } },
        },
        relations: ['team'],
      });
      if (!player || !player.askingPrice) {
        throw new BadRequestException('Player not available');
      }

      const sellerTeam: Team = player.team;
      const buyerTeam = await manager.findOne(Team, {
        where: { user: { id: buyerUserId } },
        relations: ['players'],
      });

      if (!buyerTeam) throw new NotFoundException('Buyer team not found');

      if (buyerTeam.players.length >= 25) {
        throw new BadRequestException('Squad limit exceeded');
      }

      const price: number = Math.floor(player.askingPrice * 0.95);
      if (buyerTeam.budget < price) {
        throw new BadRequestException('Insufficient budget');
      }

      // money transfer
      buyerTeam.budget -= price;
      sellerTeam.budget += price;

      // player transfer
      player.team = buyerTeam;
      player.isListed = false;
      player.askingPrice = null;

      await manager.save([buyerTeam, sellerTeam, player]);

      return player;
    });
  }

  async getTransferMarket(filter: FilterTransfersDto) {
    const { playerName, teamName, minPrice, maxPrice } = filter;

    const query = this.dataSource
      .createQueryBuilder(Player, 'player')
      .leftJoinAndSelect('player.team', 'team')
      .where('player.isListed = true')
      .andWhere('player.askingPrice IS NOT NULL');

    if (playerName) {
      query.andWhere('player.name ILIKE :playerName', {
        playerName: `%${playerName}%`,
      });
    }

    if (teamName) {
      query.andWhere('team.name ILIKE :teamName', {
        teamName: `%${teamName}%`,
      });
    }

    if (minPrice !== undefined) {
      query.andWhere('player.askingPrice >= :minPrice', { minPrice });
    }

    if (maxPrice !== undefined) {
      query.andWhere('player.askingPrice <= :maxPrice', { maxPrice });
    }

    return query.getMany();
  }
}
