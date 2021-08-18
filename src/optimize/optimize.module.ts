import { Module } from '@nestjs/common';
import { OptimizeController } from './optimize.controller';
import { OptimizeService } from './optimize.service';
import { ImagekitProvider } from './imagekit.provider';
import { MulterModule } from '@nestjs/platform-express';
import { ConfigModule, ConfigService } from '@nestjs/config';

@Module({
    imports:[
        MulterModule.registerAsync({
            imports: [ConfigModule],
            useFactory: async (config: ConfigService) => ({
                limits: {
                    fileSize:  parseInt(config.get('MAX_UPLOAD_SIZE'), 10) * 1024,
                    files: parseInt(config.get('MAX_FILE_UPLOAD'), 10)
                },
            }),
            inject: [ConfigService],
        })
    ],
    controllers: [OptimizeController],
    providers: [
        OptimizeService,
        ImagekitProvider
    ]
})
export class OptimizeModule {}
