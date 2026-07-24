import { Module } from '@nestjs/common';
import { UsersService } from './users.service';
import { UsersController } from './users.controller';
import { AuthService } from 'src/auth/auth.service';
import { PrismaService } from 'src/prisma/prisma.service';

@Module({
  providers: [UsersService, AuthService, PrismaService],
  controllers: [UsersController],
  imports: [],
  exports: [],
})
export class UsersModule {}
