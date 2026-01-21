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

    @Post("admin/login")
    @HttpCode(HttpStatus.OK)
    adminLogin(@Body() loginDto: LoginDto) {
        return this.authService.adminLogin(loginDto);
    }

    @Post("admin/logout")
    @HttpCode(HttpStatus.OK)
    adminLogout() {
        return { message: "Logged out successfully" };
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
