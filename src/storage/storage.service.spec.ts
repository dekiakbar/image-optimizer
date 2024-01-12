import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3 } from '@aws-sdk/client-s3';

describe('StorageService', () => {
  let storageService: StorageService;
  let s3Service;

  const buffer = Buffer.from('whoever you are, you are the best');
  const imageName = 'image.png';
  const sizeBefore = Buffer.byteLength(buffer);
  const fieldName = 'images';
  const s3Endpoint = 'http://s3.example.com';
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
    $metadata: {
      httpStatusCode: 200,
      requestId: 's3/1705058504.663883/PtJX',
      extendedRequestId: 'node-sgp-1',
      cfId: undefined,
      attempts: 1,
      totalRetryDelay: 0,
    },
    Expiration:
      'expiry-date="Sat, 13 Jan 2024 12:00:00 GMT", rule-id="AUTODELETE"',
    ETag: 'd83314360b2dcb998a1af013be3dcf04',
  };

  const mockUploadResponse = {
    imageId: mockS3Response.ETag,
    name: imageName,
    url: `${s3Endpoint}/${s3BucketName}/${imageName}`,
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
              putObject: jest.fn().mockReturnThis(),
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

              if (key === 'S3_BUCKET_NAME') {
                return s3BucketName;
              }

              if (key === 'S3_ENDPOINT') {
                return s3Endpoint;
              }

              return null;
            }),
          },
        },
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
      jest
        .spyOn(s3Service, 'putObject')
        .mockReturnValue(Promise.resolve(mockS3Response));

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

      jest
        .spyOn(storageService, 'uploadS3')
        .mockReturnValue(Promise.resolve(mockS3Response));

      const uploadResponseFromS3 = await storageService.upload(mockImage);
      expect(uploadResponseFromS3).toBeDefined();
      expect(uploadResponseFromS3).toEqual(mockUploadResponse);
      jest.spyOn(storageService, 'getStorageType').mockClear();
    });
  });

  const percentageResult = 90;
  describe('Calculate saved size', () => {
    it('should return percentage from size', async () => {
      const percentage = storageService.calculateSizePercentage(1000, 100);
      expect(percentage).toEqual(percentageResult);
    });
  });

  describe('Get storage type', () => {
    it('should return S3', async () => {
      const storageType = await storageService.getStorageType();
      expect(['S3']).toContain(storageType);
    });
  });
});
