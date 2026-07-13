import { AuthService } from '../auth/auth.service';
export declare class UsersService {
    authService: AuthService;
    private readonly logger;
    constructor(authService: AuthService);
    sayHello(): string;
}
