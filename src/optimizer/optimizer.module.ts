import { Module } from '@nestjs/common';
import { OptimizerController } from './optimizer.controller';

@Module({
  controllers: [OptimizerController]
})
export class OptimizerModule {}
