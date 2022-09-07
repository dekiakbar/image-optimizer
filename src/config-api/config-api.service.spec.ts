import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigApiModule } from './config-api.module';
import { ConfigApiService } from './config-api.service';

describe('ConfigApiService', () => {
  let configApiService: ConfigApiService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.example'],
        }),
        ConfigApiModule,
      ],
      providers: [ConfigApiService],
    }).compile();

    configApiService = module.get<ConfigApiService>(ConfigApiService);
  });

  it('should be defined', () => {
    expect(configApiService).toBeDefined();
  });

  it('should return config value', async () => {
    const getConfigResult = await configApiService.getConfig();
    expect(getConfigResult).toBeDefined();
  });
});
