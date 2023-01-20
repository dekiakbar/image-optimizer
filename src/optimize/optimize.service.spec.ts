import { Test, TestingModule } from '@nestjs/testing';
import { ConfigService } from 'aws-sdk';
import { StorageService } from '../storage/storage.service';
import { OptimizeService } from './optimize.service';
import * as fs from 'fs';

describe('OptimizeService', () => {
  let optimizeService: OptimizeService;
  let storageService: StorageService;

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      providers: [
        OptimizeService,
        {
          provide: ConfigService,
          useFactory: () => {
            return {
              get: jest.fn(),
            };
          },
        },
        {
          provide: StorageService,
          useFactory: () => {
            return {
              upload: jest.fn(),
              uploadS3: jest.fn(),
              uploadImagekit: jest.fn(),
            };
          },
        },
      ],
    }).compile();

    optimizeService = module.get<OptimizeService>(OptimizeService);
    storageService = module.get<StorageService>(StorageService);
  });

  it('should be defined', () => {
    expect(optimizeService).toBeDefined();
  });

  it('optimizeImage', async () => {
    const bufferPng = await fs.promises.readFile('./mock/mock.png');
    const imageNamePng = 'image.png';
    const sizeBeforePng = Buffer.byteLength(bufferPng);
    const fieldNamePng = 'images';

    const mockImagePng = {
      fieldname: fieldNamePng,
      originalname: imageNamePng,
      encoding: '7bit',
      mimetype: 'image/png',
      buffer: bufferPng,
      size: sizeBeforePng,
      stream: undefined,
      destination: 'anywhere',
      filename: imageNamePng,
      path: 'anywhere',
    };

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

    const bufferJpeg = await fs.promises.readFile('./mock/mock.jpeg');
    const imageNameJpeg = 'image.jpeg';
    const sizeBeforeJpeg = Buffer.byteLength(bufferJpeg);
    const fieldNameJpeg = 'images';

    const mockImageJpeg = {
      fieldname: fieldNameJpeg,
      originalname: imageNameJpeg,
      encoding: '7bit',
      mimetype: 'image/jpeg',
      buffer: bufferJpeg,
      size: sizeBeforeJpeg,
      stream: undefined,
      destination: 'anywhere',
      filename: imageNameJpeg,
      path: 'anywhere',
    };

    const mockOptimizeResult = {
      imageId: fieldNameJpg,
      name: imageNameJpg,
      url: 'http://s3.example.com/bucket/image.jpg',
      sizeBefore: sizeBeforeJpg,
      sizeAfter: 33,
      optimizePercentage: '70',
    };

    const mockOptimizeResults = Promise.resolve([
      mockOptimizeResult,
      mockOptimizeResult,
      mockOptimizeResult,
    ]);
    jest
      .spyOn(storageService, 'upload')
      .mockReturnValue(Promise.resolve(mockOptimizeResult));

    const optimizeImageResult = optimizeService.optimizeImage(
      [mockImagePng, mockImageJpg, mockImageJpeg],
      90,
    );
    expect(optimizeImageResult).toMatchObject(mockOptimizeResults);

    const optimizeJpegImage = await optimizeService.compressJpeg(
      mockImageJpeg,
      90,
    );
    expect(optimizeJpegImage).toMatchObject(mockImageJpeg);
  });
});
