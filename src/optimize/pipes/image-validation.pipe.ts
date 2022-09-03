import {
  ArgumentMetadata,
  BadRequestException,
  Injectable,
  PipeTransform,
} from '@nestjs/common';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
  constructor(private configService: ConfigService) {}
  transform(value: any, metadata: ArgumentMetadata) {
    if (metadata.type === 'body') {
      if (typeof value === 'object' && 'quality' in value && value.quality) {
        if (!isNaN(parseFloat(value.quality))) {
          if (value.quality > 100 || value.quality <= 0) {
            throw new BadRequestException(`quality must >= 0 and <= 100`);
          }
        } else {
          throw new BadRequestException(`quality must a number`);
        }
      } else {
        throw new BadRequestException(`quality field is empty`);
      }
    } else if (metadata.type === 'custom') {
      if (value !== undefined && Array.isArray(value) && value.length) {
        value.forEach((image) => {
          if (!this.isImageValid(image)) {
            throw new BadRequestException(
              `image with name : "${image.originalname}" has an invalid extension`,
            );
          }
        });
      } else {
        throw new BadRequestException(`image field is empty`);
      }
    }
    return value;
  }

  private isImageValid(image: any) {
    const allowedFileTypes = this.configService
      .get('ALLOWED_FILE_TYPE')
      .split('.')
      .join('')
      .split(' ')
      .join('|');
    const regex = new RegExp('.(' + allowedFileTypes + ')$');

    return image.originalname.match(regex);
  }
}
