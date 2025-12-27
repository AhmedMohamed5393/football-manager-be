import { Controller, UseGuards, Post, Body } from "@nestjs/common";
import { JwtAuthGuard } from "@shared/guards";
import { PlayerService } from "./player.service";
import { ApiBearerAuth, ApiBody, ApiNotFoundResponse, ApiProperty } from "@nestjs/swagger";
import { AuthenticatedUser } from "@shared/decorators";
import { SuccessClass } from "@shared/classes";
import { ListPlayerRequestDto, UnListPlayerRequestDto } from "./dto";

@Controller('players')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class PlayerController {
  constructor(private readonly playerService: PlayerService) {}

  @ApiProperty({ type: ListPlayerRequestDto })
  @ApiNotFoundResponse({ description: 'Player not found' })
  @Post('list')
  async list(
    @Body() listingDto: ListPlayerRequestDto,
    @AuthenticatedUser('id') userId: string,
  ) {
    const data = await this.playerService.listPlayer(listingDto, userId);

    return new SuccessClass(data, 'Player listed successfully');
  }

  @ApiProperty({ type: UnListPlayerRequestDto })
  @ApiNotFoundResponse({ description: 'Player not found' })
  @Post('unlist')
  async unList(
    @Body() unListingDto: UnListPlayerRequestDto,
    @AuthenticatedUser('id') userId: string,
  ) {
    const data = await this.playerService.unListPlayer(unListingDto, userId);

    return new SuccessClass(data, 'Player unlisted successfully');
  }
}
