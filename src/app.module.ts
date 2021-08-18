import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { RouterModule } from 'nest-router';
import { OptimizeModule } from './optimize/optimize.module';
import { routes } from './routes';
import { ConfigApiModule } from './config-api/config-api.module';

@Module({
  imports: [
    ConfigModule.forRoot({
        isGlobal: true
    }),
    RouterModule.forRoutes(routes),
    OptimizeModule,
    ConfigApiModule,
  ],
})
export class AppModule {}
