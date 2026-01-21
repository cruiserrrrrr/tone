import {
    Injectable,
    UnauthorizedException,
    ConflictException,
    ForbiddenException,
} from "@nestjs/common";
import { JwtService } from "@nestjs/jwt";
import { UsersService } from "./users.service";
import { RegisterDto } from "../dto/register.dto";
import { LoginDto } from "../dto/login.dto";
import * as bcrypt from "bcrypt";
import { UserRole } from "../enums/user-role.enum";
import { User } from "../entities/user.entity";

@Injectable()
export class AuthService {
    constructor(
        private usersService: UsersService,
        private jwtService: JwtService,
    ) {}

    async register(registerDto: RegisterDto) {
        const existingUser = await this.usersService.findOneByEmail(
            registerDto.email,
        );
        if (existingUser) {
            throw new ConflictException("User with this email already exists");
        }

        const hashedPassword = await bcrypt.hash(registerDto.password, 10);
        const user = await this.usersService.create({
            ...registerDto,
            password: hashedPassword,
            role: UserRole.CLIENT,
        });

        return this.loginUser(user);
    }

    async login(loginDto: LoginDto) {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        const isPasswordMatching = await bcrypt.compare(
            loginDto.password,
            user.password,
        );
        if (!isPasswordMatching) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return this.loginUser(user);
    }

    async adminLogin(loginDto: LoginDto) {
        const user = await this.usersService.findOneByEmail(loginDto.email);
        if (!user) {
            throw new UnauthorizedException("Invalid credentials");
        }

        if (user.role !== UserRole.ADMIN) {
            throw new ForbiddenException("Access denied");
        }

        const isPasswordMatching = await bcrypt.compare(
            loginDto.password,
            user.password,
        );
        if (!isPasswordMatching) {
            throw new UnauthorizedException("Invalid credentials");
        }

        return this.loginUser(user, true);
    }

    private loginUser(user: User, includeRole = false) {
        const payload = { email: user.email, sub: user.id, role: user.role };
        const response: any = {
            access_token: this.jwtService.sign(payload),
            user: {
                id: user.id,
                email: user.email,
                name: user.name,
                lastname: user.lastname,
                telegramId: user.telegramId,
            },
        };

        if (includeRole) {
            response.user.role = user.role;
        }

        return response;
    }
}
