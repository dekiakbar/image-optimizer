import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageModule } from './storage.module'

describe('Storage Module', () => {
  let storageModule: StorageModule;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        StorageModule
      ],
    }).compile();

    storageModule = module.get<StorageModule>(StorageModule);
  });

  it('should be defined', () => {
    expect(storageModule).toBeDefined();
  });
});
