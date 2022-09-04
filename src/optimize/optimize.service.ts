import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import { StorageService } from '../storage/storage.service';
import { UploadResponseDto } from 'src/storage/dto/upload-response.dto';
@Injectable()
export class OptimizeService {
  constructor(private storageService: StorageService) {}

  async optimizeImage(images: Array<Express.Multer.File>, quality: number) {
    const optimizedImages: Array<UploadResponseDto> = await Promise.all(
      images.map(async (image): Promise<UploadResponseDto> => {
        image = await this.compressImage(image, quality);
        return this.storageService.upload(image);
      }),
    );

    return optimizedImages;
  }

  async compressImage(
    image: Express.Multer.File,
    quality: number,
  ): Promise<Express.Multer.File> {
    if (image.originalname.match(/\.(png)$/)) {
      image = await this.compressPng(image, quality);
    } else if (image.originalname.match(/\.(jpg|jpeg)$/)) {
      image = await this.compressJpeg(image, quality);
    }

    return image;
  }

  async compressPng(
    image: Express.Multer.File,
    quality: number,
  ): Promise<Express.Multer.File> {
    const buffer = await sharp(image.buffer)
      .png({
        progressive: true,
        compressionLevel: 8,
        quality: quality,
      })
      .toBuffer();

    image.buffer = buffer;

    return image;
  }

  async compressJpeg(
    image: Express.Multer.File,
    quality: number,
  ): Promise<Express.Multer.File> {
    const buffer = await sharp(image.buffer)
      .jpeg({
        progressive: true,
        quality: quality >= 90 ? 90 : quality,
        optimiseScans: true,
        optimizeScans: true,
        mozjpeg: true,
      })
      .toBuffer();

    image.buffer = buffer;

    return image;
  }
}
