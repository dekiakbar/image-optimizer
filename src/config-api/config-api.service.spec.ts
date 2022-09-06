import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { random } from 'lodash';
import { ConfigApiModule } from './config-api.module';
import { ConfigApiService } from './config-api.service';

describe('ConfigApiService', () => {
  let configApiService: ConfigApiService;
  let configService: ConfigService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        ConfigApiModule,
      ],
      providers: [
        ConfigApiService,
        {
          provide: ConfigService,
          useFactory: jest.fn((key: string) => {
            if (key === 'MAX_FILE_UPLOAD') {
              return random(0, 100);
            }

            if (key === 'MAX_UPLOAD_SIZE') {
              return random(0, 100);
            }
          }),
        },
      ],
    }).compile();

    configApiService = module.get<ConfigApiService>(ConfigApiService);
    configService = module.get<ConfigService>(ConfigService);
  });

  it('should be defined', () => {
    expect(configApiService).toBeDefined();
  });

  it('should return config value', async () => {
    const getConfigResult = await configApiService.getConfig();
    expect(getConfigResult).toBeDefined();
  });
});
