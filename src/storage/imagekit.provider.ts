import { Provider } from '@nestjs/common';
import ImageKit from 'imagekit';
import { ConfigService } from '@nestjs/config';

export const ImagekitProvider: Provider = {
  provide: ImageKit,
  useFactory: async (configService: ConfigService) => {
    return new ImageKit({
      publicKey: configService.get('IMAGEKIT_PUBLIC_KEY'),
      privateKey: configService.get('IMAGEKIT_PRIVATE_KEY'),
      urlEndpoint: configService.get('URL_ENDPOINT'),
    });
  },
  inject: [ConfigService],
};
