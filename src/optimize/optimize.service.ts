import { Injectable } from '@nestjs/common';
import imagemin from 'imagemin';
import imageminJpegtran from 'imagemin-jpegtran';
import imageminPngquant from 'imagemin-pngquant';
import ImageKit from 'imagekit';
import { UploadResponse } from 'imagekit/dist/libs/interfaces';

@Injectable()
export class OptimizeService {
    constructor(
        private Imagekit: ImageKit
    ){}
    async optimizeImage(
        images: Array<Express.Multer.File>
    ){
        const optimizedImages:Array<UploadResponse> = await Promise.all(
            images.map( async (image): Promise<UploadResponse> => {
                image = await this.compressImage(image);
                return this.uploadImage(image);
            }
        ));

        return optimizedImages;
    }

    async uploadImage(
        image: Express.Multer.File
    ): Promise<UploadResponse>{
        const response = await this.Imagekit.upload({
            file : image.buffer,
            fileName : image.originalname,
        });

        return response;
    }

    async compressImage(
        image: Express.Multer.File
    ): Promise<Express.Multer.File>{
        const buffer = await imagemin.buffer(
            image.buffer,
            {
                plugins: [
                    imageminJpegtran({ quality: 50 }),
                    imageminPngquant({ quality: [0.6, 0.8] })
                ]
            }
        );
        image.buffer = buffer;

        return image;
    }
}
