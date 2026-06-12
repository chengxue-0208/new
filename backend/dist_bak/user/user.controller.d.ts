import { UserService } from './user.service';
export declare class UsersController {
    private readonly usersService;
    constructor(usersService: UserService);
    findAll(): Promise<import("./user.entity").User[]>;
    search(email: string): Promise<import("./user.entity").User>;
    getUserSubscription(userId: string): Promise<any>;
    findOne(id: string): Promise<import("./user.entity").User>;
    create(userData: any): Promise<import("./user.entity").User>;
    update(id: string, userData: Partial<any>): Promise<import("./user.entity").User>;
    remove(id: string): Promise<void>;
}
