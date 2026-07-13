import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(public userService: UsersService) {}

  @Get('/')
  sayHi() {
    return this.userService.sayHello();
  }
}
