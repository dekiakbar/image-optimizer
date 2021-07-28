import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { OptimizeModule } from './optimize/optimize.module';
import { routes } from './routes';
import { ImagekitModule } from './imagekit/imagekit.module';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    OptimizeModule,
    ImagekitModule
  ],
})
export class AppModule {}
