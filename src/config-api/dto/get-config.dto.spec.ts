import * as classTransformer from 'class-transformer';
import { GetConfigDto } from './get-config.dto';
import * as classValidator from 'class-validator';

describe('GetConfigApi', () => {
  it('should return object instance of GetConfigDto', async () => {
    const mockGetConfigApiDto = {
      maxFileUpload: 5,
      maxUploadSize: 8192,
      allowedFileTypes: ['.jpg', '.png'],
    };

    const getConfigDto = classTransformer.plainToClass(
      GetConfigDto,
      mockGetConfigApiDto,
    );

    const result = await classValidator.validate(getConfigDto);
    expect(result.length).toBe(0);
  });

  it('should return error', async () => {
    const mockGetConfigApiDto = {
      maxFileUpload: 5,
      maxUploadSize: undefined,
      allowedFileTypes: undefined,
    };

    const getConfigDto = classTransformer.plainToClass(
      GetConfigDto,
      mockGetConfigApiDto,
    );

    const result = await classValidator.validate(getConfigDto);
    expect(result.length).not.toBe(0);
  });
});
