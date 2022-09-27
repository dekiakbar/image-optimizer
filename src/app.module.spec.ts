import { INestApplication } from '@nestjs/common';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import request from 'supertest';
import { ThrottlerGuard, ThrottlerModule } from '@nestjs/throttler';
import { APP_GUARD } from '@nestjs/core';

describe('App Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
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
          provide: APP_GUARD,
          useClass: ThrottlerGuard,
        },
      ],
    }).compile();

    app = appModule.createNestApplication();

    await app.init();
  });

  it('App module should be defined', async () => {
    return expect(app).toBeDefined();
  });

  describe('Optimize API api/v1/optimize', () => {
    describe('Error test', () => {
      it('should return Not Found (404), no route', () => {
        return request(app.getHttpServer()).get('/api/v1/optimize').expect(404);
      });

      it('should return Bad Request (400), image and quality are required', () => {
        return request(app.getHttpServer())
          .post('/api/v1/optimize')
          .expect(400);
      });

      it('should return Bad Request (400), quality is required', () => {
        return request(app.getHttpServer())
          .post('/api/v1/optimize')
          .attach('images', 'mock/mock.png')
          .expect(400);
      });

      it('should return Bad Request (400), image is required', () => {
        return request(app.getHttpServer())
          .post('/api/v1/optimize')
          .field('quality', '60')
          .expect(400);
      });

      it('should return Bad Request (400), quality must be number', () => {
        return request(app.getHttpServer())
          .post('/api/v1/optimize')
          .field('quality', 'abcd')
          .expect(400);
      });

      it('should return Bad Request (400), quality must >= 0 and <= 100', () => {
        return request(app.getHttpServer())
          .post('/api/v1/optimize')
          .field('quality', '110')
          .expect(400);
      });

      it('should return Bad Request (400), pdf file must be rejected', () => {
        return request(app.getHttpServer())
          .post('/api/v1/optimize')
          .attach('images', 'mock/mock.pdf')
          .field('quality', '110')
          .expect(400);
      });
    });
  });

  /**
   * close app when test is finished.
   * prevent warning :
   *
   * A worker process has failed to exit gracefully and has been force exited.
   * This is likely caused by tests leaking due to improper teardown. Try running with --detectOpenHandles to find leaks.
   */
  afterAll(() => {
    app.close();
  });
});
