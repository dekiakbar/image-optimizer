import { Controller, Post, UploadedFiles, UseInterceptors, UsePipes } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
import { ImageValidationPipe } from './pipes/image-validation.pipe';

@Controller('optimizer')
export class OptimizerController {
    
    @Post('/')
    @UsePipes(ImageValidationPipe)
    @UseInterceptors(
        FilesInterceptor('image',5)
    )
    optimizeImage(
        @UploadedFiles() file: Array<Express.Multer.File>
    ){
        // console.log(file);
        return file;
    }
}
