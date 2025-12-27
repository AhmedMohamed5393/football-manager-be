import { ApiProperty } from "@nestjs/swagger";
import { IsNotEmpty, IsString } from "class-validator";

export class BuyPlayerDto {
    @ApiProperty({ type: 'string', example: 'player123' })
    @IsNotEmpty()
    @IsString()
    id: string;
}
