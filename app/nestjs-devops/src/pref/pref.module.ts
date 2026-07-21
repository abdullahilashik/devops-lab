import { DynamicModule, Module } from '@nestjs/common';
import { PrefService } from './pref.service';

@Module({})
export class PrefModule {
  static register(options: {apiKey: string}) : DynamicModule {
    return {
      module: PrefModule,
      providers: [
        {provide: `API_KEY`, useValue: options},
        PrefService
      ],
      exports: [PrefService]
    };
  }

  static forRootAsync(options: {
    useFactory: (...args: any[]) => Promise<any> | any,
    inject: any[]
  }) : DynamicModule {
    return {
      module: PrefModule,
      providers: [
        {
          provide: 'API_KEY',
          inject: options.inject,
          useFactory: options.useFactory,
        },
        PrefService
      ],
      exports: [PrefService]
    }
  }
}
