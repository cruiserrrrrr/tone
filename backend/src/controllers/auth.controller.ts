import {
    Body,
    Controller,
    Post,
    Get,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
    Res,
    UnauthorizedException,
} from "@nestjs/common";
import { Response } from "express";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";
import { getAppConfig, getAuthConfig } from "../config/env";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    async register(
        @Body() registerDto: RegisterDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.register(registerDto);
        this.setAuthCookies(res, result.access_token, result.refresh_token);
        return {
            user: result.user,
        };
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    async login(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.login(loginDto);
        this.setAuthCookies(res, result.access_token, result.refresh_token);
        return {
            user: result.user,
        };
    }

    @Post("admin/login")
    @HttpCode(HttpStatus.OK)
    async adminLogin(
        @Body() loginDto: LoginDto,
        @Res({ passthrough: true }) res: Response,
    ) {
        const result = await this.authService.adminLogin(loginDto);
        this.setAuthCookies(res, result.access_token, result.refresh_token);
        return {
            user: result.user,
        };
    }

    @Post("logout")
    @HttpCode(HttpStatus.OK)
    logout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return { message: "Logged out successfully" };
    }

    @Post("admin/logout")
    @HttpCode(HttpStatus.OK)
    adminLogout(@Res({ passthrough: true }) res: Response) {
        res.clearCookie("access_token");
        res.clearCookie("refresh_token");
        return { message: "Logged out successfully" };
    }

    @Get("refresh")
    async refresh(@Request() req, @Res({ passthrough: true }) res: Response) {
        const refreshToken = req.cookies["refresh_token"];
        if (!refreshToken) {
            throw new UnauthorizedException();
        }

        const result = await this.authService.refresh(refreshToken);
        this.setAuthCookies(res, result.access_token, result.refresh_token);

        return {
            user: result.user,
        };
    }

    private setAuthCookies(
        res: Response,
        accessToken: string,
        refreshToken: string,
    ) {
        const isProd = getAppConfig().isProduction;
        const authConfig = getAuthConfig();

        res.cookie("access_token", accessToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            maxAge: authConfig.accessTokenTtlSeconds * 1000,
        });

        res.cookie("refresh_token", refreshToken, {
            httpOnly: true,
            secure: isProd,
            sameSite: "strict",
            maxAge: authConfig.refreshTokenTtlSeconds * 1000,
        });
    }

    @UseGuards(JwtAuthGuard)
    @Get("check")
    checkAuth(@Request() req) {
        return {
            authorized: true,
            user: req.user,
        };
    }
}
