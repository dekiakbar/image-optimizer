import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { ConfigApiModule } from './config-api.module';

describe('ConfigApi Module', () => {
  let configApiModule: ConfigApiModule;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
        }),
        ConfigApiModule,
      ],
    }).compile();

    configApiModule = module.get<ConfigApiModule>(ConfigApiModule);
  });

  it('chould be defined', () => {
    expect(configApiModule).toBeDefined();
  });
});
