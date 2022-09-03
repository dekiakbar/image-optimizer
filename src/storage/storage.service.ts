import { Injectable } from '@nestjs/common';
import { S3 } from 'aws-sdk';
import { ConfigService } from '@nestjs/config';
import ImageKit from 'imagekit';
import { UploadResponseDto } from './dto/upload-response.dto';
import { UploadResponse } from 'imagekit/dist/libs/interfaces';

@Injectable()
export class StorageService {
  private uploadResonse: UploadResponseDto;
  private sizeBefore: number;
  private sizeAfter: number;
  
  constructor(
    private s3: S3,
    private configService: ConfigService,
    private imagekit: ImageKit,
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
   * Upload Image to imgekit.io
   *
   * @param image
   * @returns
   */
  async uploadImagekit(image: Express.Multer.File): Promise<UploadResponse> {
    const response = await this.imagekit.upload({
      file: image.buffer,
      fileName: image.originalname,
      isPrivateFile: false,
    });

    return response;
  }

  /**
   * Upload Image to S3 or Imagekit
   * depend on STORAGE_TYPE in env
   *
   * @param image
   * @returns
   */
  async upload(
    image: Express.Multer.File
  ): Promise<UploadResponseDto> {
    this.sizeAfter = image.buffer.byteLength;
    this.sizeBefore = image.size;

    if ((await this.getStorageType()) === 'S3') {
      const response = await this.uploadS3(image);
      this.uploadResonse = this.convertS3Response(response);
    }

    if ((await this.getStorageType()) === 'imagekit') {
      const response = await this.uploadImagekit(image);
      this.uploadResonse = this.convertImagekitResponse(response);
    }

    return this.uploadResonse;
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
   * Convert imagekit response to UploadResponseDto
   *
   * @param response
   * @returns
   */
  convertImagekitResponse(response: UploadResponse): UploadResponseDto {
    return {
      imageId: response.fileId,
      name: response.name,
      url: response.url,
      sizeBefore: this.sizeBefore,
      sizeAfter: response.size,
      optimizePercentage: this.calculateSizePercentage(
        this.sizeBefore,
        response.size,
      ).toFixed(2),
    };
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
