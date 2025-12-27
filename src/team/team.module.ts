import { Module } from "@nestjs/common";
import { TypeOrmModule } from "@nestjs/typeorm";
import { BullModule } from "@nestjs/bull";
import { Team } from "./entities";
import { TeamService } from "./team.service";
import { PlayerModule } from "src/player/player.module";
import { TeamController } from "./team.controller";
import { TEAM_QUEUE } from "./constants";
import { TeamProcessor } from "./team.processor";

@Module({
    imports: [
        TypeOrmModule.forFeature([Team]),
        BullModule.registerQueue({ name: TEAM_QUEUE }),
        PlayerModule,
    ],
    controllers: [TeamController],
    providers: [TeamService, TeamProcessor],
    exports: [TeamService],
})
export class TeamModule {}
