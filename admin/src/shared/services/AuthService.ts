import ServiceBase from "./ServiceBase";

export interface User {
  id: string;
  email: string;
  name?: string;
  lastname?: string;
  role?: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

export interface LoginDto {
  email: string;
  password: string;
}

class AuthService extends ServiceBase {
  constructor() {
    super("/api/auth");
  }

  public static async adminLogin(data: LoginDto): Promise<AuthResponse> {
    return this.post<AuthResponse>("/api/auth/admin/login", data);
  }

  public static async checkAuth(): Promise<{
    authorized: boolean;
    user: User;
  }> {
    return this.get<{ authorized: boolean; user: User }>("/api/auth/check");
  }
}

export default AuthService;
