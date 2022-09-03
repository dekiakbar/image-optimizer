import { Controller, Get } from '@nestjs/common';
import { ConfigApiService } from './config-api.service';

@Controller('config')
export class ConfigApiController {
  constructor(private configApiService: ConfigApiService) {}

  @Get('/')
  getConfig() {
    return this.configApiService.getConfig();
  }
}
