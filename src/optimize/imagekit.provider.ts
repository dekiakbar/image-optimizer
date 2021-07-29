import { Provider } from '@nestjs/common';
import ImageKit from 'imagekit';

export const ImagekitProvider: Provider = {
    provide: ImageKit,
    useFactory: () => {
        return new ImageKit({
            publicKey : process.env.IMAGEKIT_PUBLIC_KEY,
            privateKey : process.env.IMAGEKIT_PRIVATE_KEY,
            urlEndpoint : process.env.URL_ENDPOINT
        });
    }
}