import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';
import { StorageService } from './../src/storage/storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

describe('AppController (e2e)', () => {
  let app: INestApplication;
  let storageService: StorageService;

  beforeAll(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.example'],
        }),
        ThrottlerModule.forRootAsync({
          imports: [ConfigModule],
          inject: [ConfigService],
          useFactory: (config: ConfigService) => ({
            ttl: config.get('THROTTLE_TTL'),
            limit: config.get('THROTTLE_LIMIT'),
          }),
        }),
        AppModule,
      ],
      providers: [
        {
          provide: StorageService,
          useFactory: () => {
            return {
              upload: jest.fn(),
              uploadS3: jest.fn(),
            };
          },
        },
        {
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    storageService = moduleFixture.get<StorageService>(StorageService);
    app = moduleFixture.createNestApplication();
    await app.init();
  });

  describe('Config API api/v1/config', () => {
    it('should return OK (200)', () => {
      return request(app.getHttpServer()).get('/api/v1/config').expect(200);
    });

    it('should return Not Found (404)', () => {
      return request(app.getHttpServer()).post('/api/v1/config').expect(404);
    });
  });

  describe('Optimize API api/v1/optimize', () => {
    describe('Error test', () => {
      it('should return Not Found (404)', () => {
        return request(app.getHttpServer()).get('/api/v1/optimize').expect(404);
      });

      it('should return Bad Request (400)', () => {
        return request(app.getHttpServer())
          .post('/api/v1/optimize')
          .expect(400);
      });

      it('should return Bad Request (400)', () => {
        return request(app.getHttpServer())
          .post('/api/v1/optimize')
          .attach('images', 'mock/mock.png')
          .expect(400);
      });

      it('should return Bad Request (400)', () => {
        return request(app.getHttpServer())
          .post('/api/v1/optimize')
          .field('quality', '60')
          .expect(400);
      });
    });

    describe('Success test', () => {
      it('should be return Created (201)', async () => {
        const mockUploadResponse = {
          imageId: 'abcd12345',
          name: 'image.png',
          url: 'http://s3.example.com/bucket/image.jpg',
          sizeBefore: 102,
          sizeAfter: 33,
          optimizePercentage: '70',
        };

        jest
          .spyOn(storageService, 'upload')
          .mockReturnValue(Promise.resolve(mockUploadResponse));
        return request(app.getHttpServer())
          .post('/api/v1/optimize')
          .attach('images', 'mock/mock.png')
          .field('quality', '60')
          .expect(201);
      });
    });
  });

  /**
   * close app when test is finished.
   * prevent warning :
   *
   * This usually means that there are asynchronous operations that weren't stopped in your tests.
   * Consider running Jest with `--detectOpenHandles` to troubleshoot this issue.
   */
  afterAll(() => {
    app.close();
  });
});
