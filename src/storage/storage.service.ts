import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class StorageService {
  private uploadResponse: UploadResponseDto;
  private sizeBefore: number;
  private sizeAfter: number;

  constructor(
    private s3: S3,
    private configService: ConfigService
  ) {}

  /**
   * Upload image to S3
   *
   * @param image
   * @returns
   */
  async uploadS3(
    image: Express.Multer.File,
  ): Promise<S3.ManagedUpload.SendData> {
    const bucketName = await this.configService.get('S3_BUCKET_NAME');
    const response = await this.s3
      .upload({
        Bucket: bucketName,
        Key: image.originalname,
        Body: image.buffer,
        ACL: 'public-read',
      })
      .promise();

    return response;
  }

  /**
   * Upload Image to S3
   * depend on STORAGE_TYPE in env
   *
   * @param image
   * @returns
   */
  async upload(image: Express.Multer.File): Promise<UploadResponseDto> {
    this.sizeAfter = image.buffer.byteLength;
    this.sizeBefore = image.size;

    if ((await this.getStorageType()) === 'S3') {
      const response = await this.uploadS3(image);
      this.uploadResponse = this.convertS3Response(response);
    }

    return this.uploadResponse;
  }

  /**
   * Calculate saved image size, in Byte
   *
   * @param oldSize
   * @param newSize
   * @returns
   */
  calculateSizePercentage(oldSize: number, newSize: number): number {
    return 100 - (newSize / oldSize) * 100;
  }

  /**
   * Convert S3 response to UploadResponseDto
   *
   * @param response
   * @returns
   */
  convertS3Response(response: S3.ManagedUpload.SendData): UploadResponseDto {
    return {
      imageId: response.ETag.replace(/['"]+/g, ''),
      name: response.Key,
      url: response.Location,
      sizeBefore: this.sizeBefore,
      sizeAfter: this.sizeAfter,
      optimizePercentage: this.calculateSizePercentage(
        this.sizeBefore,
        this.sizeAfter,
      ).toFixed(2),
    };
  }

  /**
   * Get Storage type based on environment variable
   *
   * @returns
   */
  async getStorageType(): Promise<string> {
    return await this.configService.get('STORAGE_TYPE');
  }
}
