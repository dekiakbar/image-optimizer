import { Module } from '@nestjs/common';
import { ImagekitService } from './imagekit.service';
import { imagekitProvider } from './imagekit.provider';
import ImageKit from 'imagekit';

@Module({
    providers: [
        ImagekitService,
        imagekitProvider,
        {
            useFactory: () => {
                return new ImageKit({
                    publicKey : "public_1y3kBMF6xPyFV1fXqsr0AmtTTIw=",
                    privateKey : "private_442m9BAhGY05YzZekvka5zFZGN8=",
                    urlEndpoint : "https://ik.imagekit.io/8wrbe79w23x/"
                });
            },
            provide: ImageKit
        },
    ],
    exports: [ImagekitService, imagekitProvider]
})
export class ImagekitModule {}
