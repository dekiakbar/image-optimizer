import { Module } from '@nestjs/common';
import { OptimizeController } from './optimize.controller';
import { OptimizeService } from './optimize.service';
import { ImagekitProvider } from './imagekit.provider';

@Module({
    controllers: [OptimizeController],
    providers: [
        OptimizeService,
        ImagekitProvider
    ]
})
export class OptimizeModule {}
