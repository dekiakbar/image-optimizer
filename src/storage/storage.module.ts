import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { S3Provider } from './s3.provider';
import { ImagekitProvider } from './imagekit.provider';

@Module({
  providers: [StorageService, S3Provider, ImagekitProvider],
  exports: [StorageService],
})
export class StorageModule {}
