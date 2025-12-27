import { Controller, UseGuards, Post, Param, Get, Query, Body } from "@nestjs/common";
import { AuthenticatedUser } from "@shared/decorators";
import { JwtAuthGuard } from "@shared/guards";
import { TransferService } from "./transfer.service";
import { ApiBadRequestResponse, ApiBearerAuth, ApiNotFoundResponse, ApiParam, ApiProperty, ApiQuery } from "@nestjs/swagger";
import { SuccessClass } from "@shared/classes";
import { BuyPlayerDto, FilterTransfersDto } from "./dto";

@Controller('transfers')
@ApiBearerAuth('jwt')
@UseGuards(JwtAuthGuard)
export class TransferController {
  constructor(private readonly transferService: TransferService) {}

  @ApiBadRequestResponse({ description: 'Player not available' })
  @ApiBadRequestResponse({ description: 'Squad limit exceeded' })
  @ApiBadRequestResponse({ description: 'Insufficient budget' })
  @ApiNotFoundResponse({ description: 'Buyer team not found' })
  @Post('buy')
  async buy(
    @Body() buyPlayerDto: BuyPlayerDto,
    @AuthenticatedUser('id') userId: string,
  ) {
    const data = await this.transferService.buyPlayer(buyPlayerDto.id, userId);

    return new SuccessClass(data, 'Player transferred successfully');
  }

  @ApiQuery({ name: 'playerName', required: false })
  @ApiQuery({ name: 'teamName', required: false })
  @ApiQuery({ name: 'minPrice', required: false, type: Number })
  @ApiQuery({ name: 'maxPrice', required: false, type: Number })
  @Get()
  async getTransfersList(@Query() filterTransfersDto: FilterTransfersDto) {
    const data = await this.transferService.getTransferMarket(filterTransfersDto);

    return new SuccessClass(data);
  }
}
