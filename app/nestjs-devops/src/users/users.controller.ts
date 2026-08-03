import { Controller, Get } from '@nestjs/common';
import { UsersService } from './users.service';

@Controller('users')
export class UsersController {
  constructor(public userService: UsersService) { }

  @Get('/')
  sayHi() {
    return this.userService.sayHello();
  }
}


/**


const data = largeMixedData[0].groups[0].projects[0][0];

if ( typeof(data) == 'object' ) {
  console.log('Title: ', data.title);
} else {
    console.log('This is not an object');
}

 */