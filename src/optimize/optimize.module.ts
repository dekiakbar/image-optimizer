import { Module } from '@nestjs/common';
import { OptimizeController } from './optimize.controller';
import { OptimizeService } from './optimize.service';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';
import { StorageModule } from '../storage/storage.module';

@Module({
  imports: [
    MulterModule.registerAsync({
      imports: [ConfigModule],
      useFactory: async (config: ConfigService) => ({
        limits: {
          fileSize: parseInt(config.get('MAX_UPLOAD_SIZE'), 10) * 1024,
          files: parseInt(config.get('MAX_FILE_UPLOAD'), 10),
        },
      }),
      inject: [ConfigService],
    }),
    StorageModule,
  ],
  controllers: [OptimizeController],
  providers: [OptimizeService],
})
export class OptimizeModule {}
