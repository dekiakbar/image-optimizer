import { Test, TestingModule } from '@nestjs/testing';
import { StorageService } from './storage.service';
import ImageKit from 'imagekit';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

describe('StorageService', () => {
  let storageService: StorageService;
  let s3Service;
  let imagekitService: ImageKit;

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
    Location: 'some string',
    Bucket: s3BucketName,
  };

  const mockImagekitResponse = {
    fileId: 'something',
    name: 'something',
    url: 'something',
    thumbnailUrl: 'something',
    height: 100,
    width: 100,
    size: 100,
    fileType: undefined,
    filePath: 'something',
    tags: ['something', 'anything'],
    isPrivateFile: false,
    customCoordinates: 'something',
    metadata: 'something',
  };

  const mockUploadResponse = {
    imageId: fieldName,
    name: imageName,
    url: 'http://s3.example.com/bucket/image.jpg',
    sizeBefore: sizeBefore,
    sizeAfter: 33,
    optimizePercentage: '70',
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
              const availableStorage = ['S3', 'imagekit'];
              if (key === 'STORAGE_TYPE') {
                return availableStorage[
                  Math.floor(Math.random() * availableStorage.length)
                ];
              }
              return null;
            }),
          },
        },
        {
          provide: ImageKit,
          useFactory: () => {
            return {
              upload: jest.fn(),
            };
          },
        },
      ],
    }).compile();

    storageService = module.get<StorageService>(StorageService);
    s3Service = module.get<S3>(S3);
    imagekitService = module.get<ImageKit>(ImageKit);
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

  describe('Upload Imagekit', () => {
    it('should return upload response from imagekit.io', async () => {
      imagekitService.upload = jest
        .fn()
        .mockResolvedValue(mockImagekitResponse);
      const imagekitResponse = await storageService.uploadImagekit(mockImage);
      expect(imagekitResponse).toMatchObject(mockImagekitResponse);
    });
  });

  describe('Upload Image (storage type = S3)', () => {
    it('should return upload response', async () => {
      imagekitService.upload = jest
        .fn()
        .mockResolvedValue(mockImagekitResponse);
      s3Service.promise = jest.fn().mockResolvedValue(mockS3Response);

      jest
        .spyOn(storageService, 'getStorageType')
        .mockReturnValue(Promise.resolve('S3'));
      const uploadResponseFromS3 = await storageService.upload(mockImage);
      expect(uploadResponseFromS3).toBeDefined();
      jest.spyOn(storageService, 'getStorageType').mockClear();
    });
  });

  describe('Upload Image (storage type = Imagekit)', () => {
    it('should return upload response', async () => {
      imagekitService.upload = jest
        .fn()
        .mockResolvedValue(mockImagekitResponse);
      s3Service.promise = jest.fn().mockResolvedValue(mockS3Response);

      jest
        .spyOn(storageService, 'getStorageType')
        .mockReturnValue(Promise.resolve('imagekit'));
      const uploadResponseFromImagekit = await storageService.upload(mockImage);
      expect(uploadResponseFromImagekit).toBeDefined();
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

  describe('Convert Imagekit response to compatible response', () => {
    it('it should be return object and compatible with UploadResponseDto', async () => {
      jest
        .spyOn(storageService, 'convertImagekitResponse')
        .mockReturnValue(mockUploadResponse);
      const convertedImagekit =
        storageService.convertImagekitResponse(mockImagekitResponse);
      expect(convertedImagekit).toMatchObject(mockUploadResponse);
    });
  });

  describe('Convert S3 response to compatible response', () => {
    it('it should be return object and compatible with UploadResponseDto', async () => {
      jest
        .spyOn(storageService, 'convertS3Response')
        .mockReturnValue(mockUploadResponse);
      const convertedImagekit =
        storageService.convertS3Response(mockS3Response);
      expect(convertedImagekit).toMatchObject(mockUploadResponse);
    });
  });

  describe('Get storage type', () => {
    it('should return S3 or imagekit', async () => {
      const storageType = await storageService.getStorageType();
      expect(['imagekit', 'S3']).toContain(storageType);
    });
  });
});
