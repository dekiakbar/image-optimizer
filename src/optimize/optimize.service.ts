import { Inject, Injectable } from '@nestjs/common';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import { ImagekitLib } from 'src/imagekit/imagekit.provider';
import { ImagekitService } from 'src/imagekit/imagekit.service';

@Injectable()
export class OptimizeService {
    constructor(
        // @Inject(ImagekitLib) private imagekit
        private ImagekitService: ImagekitService
    ){}
    async optimizeImage(
        images: Array<Express.Multer.File>
    ){
        const optimizedImages:Array<Express.Multer.File> = await Promise.all(
            images.map( async (image): Promise<Express.Multer.File> => {
                image.buffer = await imagemin.buffer(
                    image.buffer,
                    {
                        plugins: [
                            imageminJpegtran(),
                            imageminPngquant({
                                quality: [0.6, 0.8]
                            })
                        ]
                    }
                );
                
                return image;
            }
        ));
        
        this.ImagekitService.uploadImage(images[0]);
        return images[0].originalname;
    }
}
