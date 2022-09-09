import { INestApplication } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { AppModule } from './app.module';
import request from 'supertest';

describe('App Module', () => {
  let app: INestApplication;

  beforeAll(async () => {
    const appModule: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.example'],
        }),
        AppModule,
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
});
