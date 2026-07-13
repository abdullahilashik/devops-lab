import { UsersService } from './users.service';
export declare class UsersController {
    userService: UsersService;
    constructor(userService: UsersService);
    sayHi(): string;
}
