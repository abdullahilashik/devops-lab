import { Body, Injectable } from '@nestjs/common';
import { PrismaService } from 'src/prisma/prisma.service';
import { AuthDTO } from './dto/auth.dto';
import * as bcrypt from 'bcrypt';
import { Token } from './types/token.types';
import { JwtService } from '@nestjs/jwt';

@Injectable()
export class AuthService {

  constructor(private prismaService: PrismaService, private jwtService: JwtService) { }

  async hashedData(data: string) {
    return await bcrypt.hash(data, 10);
  }


  async getTokens(userId: string | number, email: string): Promise<Token> {
    const [at, rt] = await Promise.all([

      this.jwtService.signAsync({
        sub: userId,
        email
      }, {
        secret: 'at-secret'
      }),

      this.jwtService.signAsync({
        sub: userId,
        email
      }, {
        secret: 'at-secret'
      })
    ]);

    return {
      access_token: at,
      refresh_token: rt
    }
  }


  async signUpLocal(dto: AuthDTO): Promise<Token> {
    const hash = await this.hashedData(dto.password);

    const user = await this.prismaService.user.create({
      data: {
        email: dto.email,
        hash
      }
    });
    const result = await this.getTokens(user.id, user.email);
    return result;
  }

  signInLocal() {
    return 'test sign in';
  }

  logout() { }

  refresh() { }
}
