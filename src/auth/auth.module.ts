import { Module } from "@nestjs/common";
import { ConfigModule, ConfigService } from "@nestjs/config";
import { JwtModule } from "@nestjs/jwt";
import { AuthController } from "./auth.controller";
import { AuthService } from "./auth.service";
import { UserModule } from "src/user/user.module";
import { JwtStrategy } from "../shared/strategies";
import { PassportModule } from "@nestjs/passport";
import { TeamModule } from "src/team/team.module";

@Module({
    imports: [
        UserModule,
        TeamModule,
        ConfigModule,
        JwtModule.registerAsync({
            imports: [ConfigModule],
            inject: [ConfigService],
            useFactory: (config: ConfigService) => ({
                secret: config.getOrThrow<string>('JWT_SECRET'),
                signOptions: { expiresIn: '200s' },
            }),
        }),
        PassportModule.register({ defaultStrategy: 'jwt' })
    ],
    controllers: [
        AuthController,
    ],
    providers: [
        AuthService,
        JwtStrategy,
    ],
    exports: [PassportModule],
})
export class AuthModule {}
