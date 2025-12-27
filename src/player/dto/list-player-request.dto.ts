import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";
import { PlayerDto } from "./player.dto";
import { Type } from "class-transformer";

export class ListPlayerRequestDto extends PlayerDto {
    @ApiProperty({ type: 'number', example: 1000000 })
    @IsNotEmpty()
    @Type(() => Number)
    price: number;
}
