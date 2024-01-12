import { Injectable } from '@nestjs/common';
import { S3, PutObjectCommandOutput } from '@aws-sdk/client-s3';
import { ConfigService } from '@nestjs/config';
import { UploadResponseDto } from './dto/upload-response.dto';

@Injectable()
export class StorageService {
  private uploadResponse: UploadResponseDto;
  private sizeBefore: number;
  private sizeAfter: number;

  constructor(private s3: S3, private configService: ConfigService) {}

  /**
   * Upload image to S3
   *
   * @param image
   * @returns
   */
  async uploadS3(image: Express.Multer.File): Promise<PutObjectCommandOutput> {
    const bucketName = await this.configService.get('S3_BUCKET_NAME');

    const upload = {
      Bucket: bucketName,
      Key: image.originalname,
      Body: image.buffer,
      ACL: 'public-read',
    };

    const response = await this.s3.putObject(upload);

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
      this.uploadResponse = await this.convertS3Response(image, response);
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
  async convertS3Response(
    image: Express.Multer.File,
    response: any,
  ): Promise<UploadResponseDto> {
    const url = await this.getImageUrl(image);

    return {
      imageId: response.ETag.replace(/['"]+/g, ''),
      name: image.originalname,
      url: url,
      sizeBefore: this.sizeBefore,
      sizeAfter: this.sizeAfter,
      optimizePercentage: this.calculateSizePercentage(
        this.sizeBefore,
        this.sizeAfter,
      ).toFixed(2),
    };
  }

  /**
   * Build image URL based on endpoint, bucket name and filename
   *
   * @param image
   * @returns
   */
  async getImageUrl(image: Express.Multer.File): Promise<string> {
    const bucketName = await this.configService.get('S3_BUCKET_NAME');
    const endpoint = await this.configService.get('S3_ENDPOINT');

    return new URL(
      `${endpoint}/${bucketName}/${image.originalname}`,
    ).toString();
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
