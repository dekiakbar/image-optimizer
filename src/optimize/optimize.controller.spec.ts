import { ConfigModule } from '@nestjs/config';
import { Test, TestingModule } from '@nestjs/testing';
import { StorageModule } from '../storage/storage.module';
import { OptimizeController } from './optimize.controller';
import { OptimizeService } from './optimize.service';
import * as fs from 'fs';

describe('OptimizeController', () => {
  let optimizeController: OptimizeController;
  let optimizeService: OptimizeService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [
        ConfigModule.forRoot({
          isGlobal: true,
          envFilePath: ['.env.local'],
        }),
        StorageModule,
      ],
      controllers: [OptimizeController],
      providers: [OptimizeService],
    }).compile();

    optimizeController = module.get<OptimizeController>(OptimizeController);
    optimizeService = module.get<OptimizeService>(OptimizeService);
  });

  it('should be defined', () => {
    expect(optimizeController).toBeDefined();
  });

  it('should not throw error (PNG)', async () => {
    const bufferJpg = await fs.promises.readFile('./mock/mock.jpg');
    const imageNameJpg = 'image.jpg';
    const sizeBeforeJpg = Buffer.byteLength(bufferJpg);
    const fieldNameJpg = 'images';

    const mockImageJpg = {
      fieldname: fieldNameJpg,
      originalname: imageNameJpg,
      encoding: '7bit',
      mimetype: 'image/jpg',
      buffer: bufferJpg,
      size: sizeBeforeJpg,
      stream: undefined,
      destination: 'anywhere',
      filename: imageNameJpg,
      path: 'anywhere',
    };

    const mockOptimizeResultJpg = [
      {
        imageId: fieldNameJpg,
        name: imageNameJpg,
        url: 'http://s3.example.com/bucket/image.jpg',
        sizeBefore: sizeBeforeJpg,
        sizeAfter: 33,
        optimizePercentage: '70',
      },
    ];

    jest
      .spyOn(optimizeService, 'optimizeImage')
      .mockReturnValue(Promise.resolve(mockOptimizeResultJpg));
    const optimizeResultPng = await optimizeController.optimizeImage(
      [mockImageJpg],
      { quality: '70' },
    );
    expect(optimizeResultPng).toMatchObject(mockOptimizeResultJpg);
  });
});
