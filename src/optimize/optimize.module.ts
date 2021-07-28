import { Module } from '@nestjs/common';
import { ImagekitModule } from 'src/imagekit/imagekit.module';
import { OptimizeController } from './optimize.controller';
import { OptimizeService } from './optimize.service';

@Module({
    imports:[
        ImagekitModule
    ],
    controllers: [OptimizeController],
    providers: [OptimizeService]
})
export class OptimizeModule {}
