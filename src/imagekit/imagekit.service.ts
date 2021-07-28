import { Injectable, Inject } from '@nestjs/common';
import { ImagekitLib } from './imagekit.provider';

@Injectable()
export class ImagekitService {
    constructor(
        @Inject(ImagekitLib) private imagekit 
    ){}

    async uploadImage(images: any){
        const res = await this.imagekit.upload({
            file : images.buffer,
            fileName : images.originalname,
        });

        console.log(res);
    }
}
