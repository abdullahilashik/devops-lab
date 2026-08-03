import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Token } from './types/token.types';

@Injectable()
export class AuthService {

  constructor(private prismaService: PrismaService) { }

  async hashedData(data: string) {
    return await bcrypt.hash(data, 10);
  }

  async signUpLocal(dto: AuthDTO): Promise<Token> {
    const hash = await this.hashedData(dto.password);

    const user = this.prismaService.user.create({
      data: {
        email: dto.email,
        hash
      }
    });
    return user;
  }

  signInLocal() {
    return 'test sign in';
  }

  logout() { }

  refresh() { }
}
