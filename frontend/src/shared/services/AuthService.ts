import ServiceBase from "./ServiceBase";

export interface User {
    id: string;
    email: string;
    name?: string;
    lastname?: string;
    telegramId?: string;
    planExpiresAt: string | null; // date
    planId: number | null;
    planPurchasedAt: string | null;
    requestsLeft: number;
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

    public static async checkAuth(): Promise<{
        authorized: boolean;
        user: User;
    }> {
        return this.get<{ authorized: boolean; user: User }>("/api/auth/check");
    }

    public static async logout(): Promise<{ message: string }> {
        return this.post<{ message: string }>("/api/auth/logout", {});
    }
}

export default AuthService;
