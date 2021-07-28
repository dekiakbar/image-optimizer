import { Controller, Post, Res, UploadedFiles, UseInterceptors, UsePipes } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from './pipes/image-validation.pipe';
import { OptimizeService } from './optimize.service';
import { Response } from 'express';

@Controller('optimize')
export class OptimizeController {
    constructor(
        private OptimizeService: OptimizeService
    ){}

    @Post('/')
    @UsePipes(ImageValidationPipe)
    @UseInterceptors(
        FilesInterceptor('images',5)
    )
    async optimizeImage(
        @UploadedFiles() images: Array<Express.Multer.File>
    ){
        return this.OptimizeService.optimizeImage(images);
    }
}
