import { Test, TestingModule } from '@nestjs/testing';
import { INestApplication } from '@nestjs/common';
import request from 'supertest';
import { AppModule } from './../src/app.module';

describe('AppController (e2e)', () => {
  let app: INestApplication;

  beforeEach(async () => {
    const moduleFixture: TestingModule = await Test.createTestingModule({
      imports: [AppModule],
    }).compile();

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
    it('should return Not Found (404)', () => {
      return request(app.getHttpServer()).get('/api/v1/optimize').expect(404);
    });

    it('should return Bad Request (400)', () => {
      return request(app.getHttpServer()).post('/api/v1/optimize').expect(400);
    });
  });
});
