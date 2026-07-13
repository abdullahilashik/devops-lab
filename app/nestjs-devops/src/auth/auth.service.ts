import { Injectable } from '@nestjs/common';

@Injectable()
export class AuthService {
  checkAuth() {
    return 'authenticated';
  }
}
