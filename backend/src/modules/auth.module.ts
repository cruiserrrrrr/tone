import { Module } from "@nestjs/common";
import { JwtModule } from "@nestjs/jwt";
import { PassportModule } from "@nestjs/passport";
import { AuthService } from "../services/auth.service";
import { AuthController } from "../controllers/auth.controller";
import { UsersModule } from "./users.module";
import { JwtStrategy } from "../strategies/jwt.strategy";
import { getAuthConfig } from "../config/env";

@Module({
    imports: [
        UsersModule,
        PassportModule,
        JwtModule.registerAsync({
            useFactory: async () => ({
                secret: getAuthConfig().jwtSecret,
                signOptions: {
                    expiresIn: getAuthConfig().accessTokenTtlSeconds,
                },
            }),
        }),
    ],
    providers: [AuthService, JwtStrategy],
    controllers: [AuthController],
})
export class AuthModule {}
