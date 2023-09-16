import { Module } from '@nestjs/common';
import { StorageService } from './storage.service';
import { S3Provider } from './s3.provider';

@Module({
  providers: [StorageService, S3Provider],
  exports: [StorageService],
})
export class StorageModule {}
