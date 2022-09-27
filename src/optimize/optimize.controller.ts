import {
  Body,
  Controller,
  Post,
  UploadedFiles,
  UseInterceptors,
  UsePipes,
} from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from './pipes/image-validation.pipe';
import { OptimizeService } from './optimize.service';
import {
  ApiBadRequestResponse,
  ApiBody,
  ApiConsumes,
  ApiTags,
} from '@nestjs/swagger';
import { UploadResponseDto } from '../storage/dto/upload-response.dto';

@Controller('optimize')
export class OptimizeController {
  constructor(private optimizeService: OptimizeService) {}

  @Post('/')
  @ApiConsumes('multipart/form-data')
  @ApiBody({
    schema: {
      type: 'object',
      properties: {
        quality: { type: 'integer' },
        images: {
          type: 'string',
          format: 'binary',
        },
      },
    },
  })
  @ApiTags('optimize')
  @ApiBadRequestResponse({
    status: 400,
    schema: {
      type: 'object',
      properties: {
        statusCode: { type: 'integer' },
        message: { type: 'string' },
        error: { type: 'string' },
      },
    },
  })
  @UsePipes(ImageValidationPipe)
  @UseInterceptors(FilesInterceptor('images'))
  async optimizeImage(
    @UploadedFiles() images: Array<Express.Multer.File>,
    @Body() OptimizeImage,
  ): Promise<UploadResponseDto[]> {
    const res = await this.optimizeService.optimizeImage(
      images,
      parseInt(OptimizeImage.quality),
    );
    return res;
  }
}
