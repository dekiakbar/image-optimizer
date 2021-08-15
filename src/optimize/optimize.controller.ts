import { Body, Controller, Post, UploadedFiles, UseInterceptors, UsePipes } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from './pipes/image-validation.pipe';
import { OptimizeService } from './optimize.service';

@Controller('optimize')
export class OptimizeController {
    constructor(
        private OptimizeService: OptimizeService
    ){}
    
    @Post('/')
    @UsePipes(ImageValidationPipe)
    @UseInterceptors(
        FilesInterceptor(
            'images',5,
            {
                limits:{ fileSize: 8 * 1024 * 1024 },
            }
        ),
    )
    async optimizeImage(
        @UploadedFiles() images: Array<Express.Multer.File>,
        @Body() OptimizeImage
    ){
        const res = await this.OptimizeService.optimizeImage(images, parseInt(OptimizeImage.quality));
        return res;
    }
}
