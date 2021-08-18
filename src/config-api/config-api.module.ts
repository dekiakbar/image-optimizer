import { Module } from '@nestjs/common';
import { ConfigApiController } from './config-api.controller';
import { ConfigApiService } from './config-api.service';

@Module({
  controllers: [ConfigApiController],
  providers: [ConfigApiService]
})
export class ConfigApiModule {}
