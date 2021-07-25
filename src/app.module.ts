import { Module } from '@nestjs/common';
import { RouterModule } from 'nest-router';
import { OptimizerModule } from './optimizer/optimizer.module';
import { routes } from './routes';

@Module({
  imports: [
    RouterModule.forRoutes(routes),
    OptimizerModule
  ],
})
export class AppModule {}
