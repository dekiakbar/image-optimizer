import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageModule } from './storage.module';
import { StorageService } from './storage.service';

describe('Storage Module', () => {
  let storageModule: StorageModule;
  let storageService: StorageService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.example'],
        }),
        StorageModule,
      ],
    }).compile();

    storageModule = module.get<StorageModule>(StorageModule);
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(storageModule).toBeDefined();
    expect(storageService).toBeInstanceOf(StorageService);
  });
});
