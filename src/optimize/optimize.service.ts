import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import ImageKit from 'imagekit';
import { UploadResponse } from 'imagekit/dist/libs/interfaces';
import { exit } from 'process';

@Injectable()
export class OptimizeService {
    constructor(
        private Imagekit: ImageKit
    ){}
    async optimizeImage(
        images: Array<Express.Multer.File>,
        quality: number
    ){
        const optimizedImages:Array<UploadResponse> = await Promise.all(
            images.map( async (image): Promise<UploadResponse> => {
                image = await this.compressImage(image, quality);
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
        image: Express.Multer.File,
        quality: number
    ): Promise<Express.Multer.File>{
        if(image.originalname.match(/\.(png)$/)){
            image = await this.compressPng(image, quality);
        }else if(image.originalname.match(/\.(jpg|jpeg)$/)){
            image = await this.compressJpeg(image, quality);
        }
        
        return image;
    }

    async compressPng(
        image: Express.Multer.File,
        quality: number
    ): Promise<Express.Multer.File>{
        const buffer = await sharp(image.buffer)
            .png({
                progressive: true,
                compressionLevel: 8,
                quality: quality
            })
            .toBuffer();

        image.buffer = buffer;
        
        return image;
    }

    async compressJpeg(
        image: Express.Multer.File,
        quality: number
    ): Promise<Express.Multer.File>{
        const buffer = await sharp(image.buffer)
            .jpeg({
                progressive: true,
                quality: quality
            })
            .toBuffer();

        image.buffer = buffer;
        
        return image;
    }
}
