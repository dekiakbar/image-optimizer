import { Routes } from 'nest-router';
import { ConfigApiModule } from './config-api/config-api.module';
import { OptimizeModule } from './optimize/optimize.module';

export const routes: Routes = [
  {
    path: '/api/v1',
    module: OptimizeModule,
  },
  {
    path: '/api/v1',
    module: ConfigApiModule,
  },
];
