import { IsArray, IsNotEmpty, IsNumber } from 'class-validator';

export class GetConfigDto {
  @IsNumber()
  @IsNotEmpty()
  maxFileUpload: number;

  @IsNumber()
  @IsNotEmpty()
  maxUploadSize: number;

  @IsNotEmpty()
  @IsArray()
  allowedFileTypes: Array<string>;
}
