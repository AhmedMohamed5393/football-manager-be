import { Controller, UseGuards, Get } from "@nestjs/common";
import { SuccessClass } from "@shared/classes";
import { AuthenticatedUser } from "@shared/decorators";
import { JwtAuthGuard } from "@shared/guards";
import { TeamService } from "./team.service";
import { ApiBearerAuth } from "@nestjs/swagger";

@Controller('teams')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class TeamController {
  constructor(private readonly teamService: TeamService) {}

  @Get('mine')
  async getMyTeam(@AuthenticatedUser('id') userId: string) {
    const data = await this.teamService.getTeamByUserId(userId);

    return new SuccessClass(data, 'Team fetched successfully');
  }
}
