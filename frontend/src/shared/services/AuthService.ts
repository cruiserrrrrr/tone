import ServiceBase from "./ServiceBase";

export interface User {
    id: string;
    email: string;
    name?: string;
    lastname?: string;
    telegramId?: string;
}

export interface AuthResponse {
    access_token: string;
    user: User;
}

export interface RegisterDto {
    email: string;
    password: string;
    name?: string;
    lastname?: string;
    telegramId?: string;
}

export interface LoginDto {
    email: string;
    password: string;
}

class AuthService extends ServiceBase {
    constructor() {
        super("/api/auth");
    }

    public static async register(data: RegisterDto): Promise<AuthResponse> {
        return this.post<AuthResponse>("/api/auth/register", data);
    }

    public static async login(data: LoginDto): Promise<AuthResponse> {
        return this.post<AuthResponse>("/api/auth/login", data);
    }
}

export default AuthService;
