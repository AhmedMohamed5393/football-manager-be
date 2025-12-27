import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { Team } from "src/team/entities";
import { TransferService } from "./transfer.service";
import { Player } from "src/player/entities";
import { TransferController } from "./transfer.controller";

@Module({
    imports: [
        TypeOrmModule.forFeature([Player, Team]),
    ],
    controllers: [TransferController],
    providers: [TransferService],
    exports: [TransferService],
})
export class TransferModule {}
