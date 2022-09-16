import { Controller, Get } from '@nestjs/common';
import { ApiTags } from '@nestjs/swagger';
import { ConfigApiService } from './config-api.service';
import { GetConfigDto } from './dto/get-config.dto';

@Controller('config')
export class ConfigApiController {
  constructor(private configApiService: ConfigApiService) {}

  @ApiTags('config')
  @Get('/')
  getConfig(): Promise<GetConfigDto> {
    return this.configApiService.getConfig();
  }
}
