import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsUUID } from "class-validator";

export class PlayerDto {
    @ApiProperty({ type: 'string', example: 'player123' })
    @IsNotEmpty()
    @IsUUID()
    id: string;
}
