import { Provider } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { S3 } from 'aws-sdk';

export const S3Provider: Provider = {
  provide: S3,
  useFactory: async (configService: ConfigService) => {
    return new S3({
      endpoint: configService.get('S3_ENDPOINT'),
      credentials: {
        accessKeyId: configService.get('S3_ACCESS_KEY_ID'),
        secretAccessKey: configService.get('S3_SECRET_ACCESS_KEY'),
      },
      region: configService.get('S3_REGION'),
    });
  },
  inject: [ConfigService],
};
