import { Injectable } from '@nestjs/common';
import sharp from 'sharp';
import ImageKit from 'imagekit';
import { ResponseDto } from './dto/response.dto';

@Injectable()
export class OptimizeService {
    constructor(
        private Imagekit: ImageKit,
    ){}

    private response;

    async optimizeImage(
        images: Array<Express.Multer.File>,
        quality: number
    ){
        const optimizedImages:Array<ResponseDto> = await Promise.all(
            images.map( async (image): Promise<ResponseDto> => {
                image = await this.compressImage(image, quality);
                return this.uploadImage(image);
            }
        ));

        return optimizedImages;
    }

    async uploadImage(
        image: Express.Multer.File
    ): Promise<ResponseDto>{
        const responseApi = await this.Imagekit.upload({
            file: image.buffer,
            fileName: image.originalname,
            isPrivateFile: false
        });

        this.response = responseApi;
        this.response.oldSize = image.size;
        this.response.optimizePercentage = this.calculateSizePercentage(this.response.oldSize, this.response.size).toFixed(2);

        return this.response;
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
                quality: quality >= 90 ? 90 : quality,
                optimiseScans: true,
                optimizeScans: true,
                mozjpeg: true
            })
            .toBuffer();

        image.buffer = buffer;
        
        return image;
    }

    calculateSizePercentage(
        oldSize: number,
        newSize: number
    ): Number{
        return 100 - (newSize/oldSize * 100);
    }
}
