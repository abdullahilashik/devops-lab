import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto/auth.dto';

@Injectable()
export class AuthService {

  constructor(private prismaService: PrismaService) { }

  signUpLocal(dto: AuthDTO) {
    return 'test signup';
  }

  signInLocal() {
    return 'test sign in';
  }

  logout() { }

  refresh() { }
}
