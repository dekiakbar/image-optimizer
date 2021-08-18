import { Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { GetConfigDto } from './dto/get-config.dto';

@Injectable()
export class ConfigApiService {
    constructor(
        private configService: ConfigService
    ){}

    async getConfig(): Promise<GetConfigDto>{
        const getConfig: GetConfigDto = {
            maxFileUpload: await this.configService.get('MAX_FILE_UPLOAD'),
            maxUploadSize: await this.configService.get('MAX_UPLOAD_SIZE'),
            allowedFileTypes: await this.configService.get('ALLOWED_FILE_TYPE').split(' '),
        }

        return getConfig;
    }
}
