import {
    Body,
    Controller,
    Post,
    Get,
    HttpCode,
    HttpStatus,
    UseGuards,
    Request,
} from "@nestjs/common";
import { AuthService } from "../services/auth.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import { JwtAuthGuard } from "../guards/jwt-auth.guard";

@Controller("auth")
export class AuthController {
    constructor(private authService: AuthService) {}

    @Post("register")
    register(@Body() registerDto: RegisterDto) {
        return this.authService.register(registerDto);
    }

    @Post("login")
    @HttpCode(HttpStatus.OK)
    login(@Body() loginDto: LoginDto) {
        return this.authService.login(loginDto);
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
