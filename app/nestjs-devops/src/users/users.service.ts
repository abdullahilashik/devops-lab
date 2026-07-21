import { Injectable, Logger } from '@nestjs/common';
import { AuthService } from '../auth/auth.service';

@Injectable()
export class UsersService {
  private readonly logger = new Logger(UsersService.name, { timestamp: true });
  constructor(public authService: AuthService) {}

  sayHello() {
    this.logger.log('User service returned auth check');
    return `Hello user`;
  }
}
