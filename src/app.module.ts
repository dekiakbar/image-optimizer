import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { OptimizeModule } from './optimize/optimize.module';
import { routes } from './routes';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    OptimizeModule,
  ],
})
export class AppModule {}
