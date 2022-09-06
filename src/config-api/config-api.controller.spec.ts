import { Test, TestingModule } from '@nestjs/testing';
import { ConfigApiController } from './config-api.controller';
import { ConfigApiService } from './config-api.service';
import { ConfigService } from '@nestjs/config';

describe('ConfigApiController', () => {
  let configApiController: ConfigApiController;
  let configApiService: ConfigApiService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      controllers: [ConfigApiController],
      providers: [
        ConfigApiService,
        {
          provide: ConfigService,
          useFactory: () => {
            return {
              get: jest.fn(),
            };
          },
        },
      ],
    }).compile();

    configApiController = module.get<ConfigApiController>(ConfigApiController);
    configApiService = module.get<ConfigApiService>(ConfigApiService);
  });

  it('should be defined', () => {
    expect(configApiController).toBeDefined();
  });

  const mockGetConfigResponse = {
    maxFileUpload: 10,
    maxUploadSize: 1000,
    allowedFileTypes: ['jpg', 'jpeg', 'png'],
  };
  it('should be defined', async () => {
    jest
      .spyOn(configApiService, 'getConfig')
      .mockResolvedValue(mockGetConfigResponse);

    const resultGetConfig = await configApiController.getConfig();
    expect(resultGetConfig).toMatchObject(mockGetConfigResponse);
  });
});
