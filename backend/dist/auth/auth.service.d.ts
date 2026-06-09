import { JwtService } from '@nestjs/jwt';
import { Repository } from 'typeorm';
import { User } from '../user/user.entity';
export declare class AuthService {
    private userRepository;
    private jwtService;
    constructor(userRepository: Repository<User>, jwtService: JwtService);
    register(registerDto: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
    login(loginDto: {
        email: string;
        password: string;
    }): Promise<{
        user: {
            id: string;
            email: string;
        };
        accessToken: string;
    }>;
    validateUser(email: string, password: string): Promise<User | null>;
}
