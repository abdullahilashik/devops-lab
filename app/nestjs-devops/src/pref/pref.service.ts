import { Injectable } from '@nestjs/common';

@Injectable()
export class PrefService {
    sayHello() {
        return 'Hello';
    }
}
