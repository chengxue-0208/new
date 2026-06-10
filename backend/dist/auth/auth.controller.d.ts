import { AuthService } from './auth.service';
import { RegisterDto } from './dto/register.dto';
import { LoginDto } from './dto/login.dto';
export declare class AuthController {
    private readonly authService;
    constructor(authService: AuthService);
    register(registerDto: RegisterDto): Promise<{
        statusCode: number;
        message: string;
        user?: undefined;
        accessToken?: undefined;
    } | {
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
        statusCode?: undefined;
        message?: undefined;
    }>;
    login(loginDto: LoginDto): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
}
