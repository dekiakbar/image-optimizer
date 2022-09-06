import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageModule } from '../storage/storage.module';
import { OptimizeModule } from './optimize.module';

describe('OptimizeModule', () => {
  let optimizeModule: OptimizeModule;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        OptimizeModule,
        StorageModule,
      ],
      providers: [ConfigService],
    }).compile();

    optimizeModule = module.get<OptimizeModule>(OptimizeModule);
  });

  it('should be defined', () => {
    expect(optimizeModule).toBeDefined();
  });
});
