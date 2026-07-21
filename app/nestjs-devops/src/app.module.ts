import { forwardRef, Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { UsersModule } from './users/users.module';
import { AuthModule } from './auth/auth.module';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { PrismaModule } from './prisma/prisma.module';
import { PrefModule } from './pref/pref.module';

@Module({
  imports: [
    UsersModule, 
    PrismaModule, 
    ConfigModule, 
    PrefModule, 
    AuthModule,
    PrefModule.forRootAsync({
      inject: [ConfigService],
      useFactory: (configService: ConfigService) => {
        return {
          apiKey: configService.get('API_KEY') || '',
        }
      },
    })
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
