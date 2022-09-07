import { ConfigModule } from '@nestjs/config';
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
          envFilePath: ['.env.local'],
        }),
        OptimizeModule,
        StorageModule,
      ],
    }).compile();

    optimizeModule = module.get<OptimizeModule>(OptimizeModule);
  });

  it('should be defined', () => {
    expect(optimizeModule).toBeDefined();
  });
});
