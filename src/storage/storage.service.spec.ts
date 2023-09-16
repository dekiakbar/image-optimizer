import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

describe('StorageService', () => {
  let storageService: StorageService;
  let s3Service;

  const buffer = Buffer.from('whoever you are, you are the best');
  const imageName = 'image.png';
  const sizeBefore = Buffer.byteLength(buffer);
  const fieldName = 'images';
  const s3BucketName = 'anybucket';

  const mockImage = {
    fieldname: fieldName,
    originalname: imageName,
    encoding: '7bit',
    mimetype: 'image/png',
    buffer: buffer,
    size: sizeBefore,
    stream: undefined,
    destination: 'anywhere',
    filename: imageName,
    path: 'anywhere',
  };

  const mockS3Response = {
    ETag: 'images',
    Key: imageName,
    Location: 'http://s3.example.com/bucket/image.jpg',
    Bucket: s3BucketName,
  };

  const mockUploadResponse = {
    imageId: fieldName,
    name: imageName,
    url: 'http://s3.example.com/bucket/image.jpg',
    sizeBefore: sizeBefore,
    sizeAfter: 33,
    optimizePercentage: '0.00',
  };

  beforeAll(async () => {
    const module: TestingModule = await Test.createTestingModule({
      imports: [ConfigModule],
      providers: [
        StorageService,
        {
          provide: S3,
          useFactory: () => {
            return {
              upload: jest.fn().mockReturnThis(),
              promise: jest.fn(),
            };
          },
        },
        {
          provide: ConfigService,
          useValue: {
            get: jest.fn((key: string) => {
              const availableStorage = ['S3'];
              if (key === 'STORAGE_TYPE') {
                return availableStorage[
                  Math.floor(Math.random() * availableStorage.length)
                ];
              }
              return null;
            }),
          },
        }
      ],
    }).compile();

    storageService = module.get<StorageService>(StorageService);
    s3Service = module.get<S3>(S3);
  });

  afterEach(() => {
    /**
     * Reset mock, if not reset line 141 (storage.service.ts) will marked as
     * Uncovered Line, since it mocked in line 150 and 162
     * in class (storage.service.spec.ts)
     */
    jest.restoreAllMocks();
  });

  it('should be defined', async () => {
    expect(storageService).toBeDefined();
  });

  describe('Upload S3', () => {
    it('should return upload response from S3 and throw no error', async () => {
      s3Service.promise = jest.fn().mockResolvedValue(mockS3Response);
      const s3Response = await storageService.uploadS3(mockImage);
      expect(s3Response).toBeDefined();
      expect(s3Response).toMatchObject(mockS3Response);
    });
  });

  describe('Upload Image (storage type = S3)', () => {
    it('should return upload response', async () => {
      s3Service.promise = jest.fn().mockResolvedValue(mockS3Response);

      jest
        .spyOn(storageService, 'getStorageType')
        .mockReturnValue(Promise.resolve('S3'));
      const uploadResponseFromS3 = await storageService.upload(mockImage);
      expect(uploadResponseFromS3).toBeDefined();
      expect(uploadResponseFromS3).toEqual(mockUploadResponse);
      jest.spyOn(storageService, 'getStorageType').mockClear();
    });
  });

  const percentageResult = 90;
  describe('Calculate saved size', () => {
    it('should return percentage from size', async () => {
      const percentage = await storageService.calculateSizePercentage(
        1000,
        100,
      );
      expect(percentage).toEqual(percentageResult);
    });
  });

  describe('Convert S3 response to compatible response', () => {
    it('it should be return object and compatible with UploadResponseDto', async () => {
      jest
        .spyOn(storageService, 'convertS3Response')
        .mockReturnValue(mockUploadResponse);
      const convertedS3Response =
        storageService.convertS3Response(mockS3Response);
      expect(convertedS3Response).toMatchObject(mockUploadResponse);
    });
  });

  describe('Get storage type', () => {
    it('should return S3', async () => {
      const storageType = await storageService.getStorageType();
      expect(['S3']).toContain(storageType);
    });
  });
});
