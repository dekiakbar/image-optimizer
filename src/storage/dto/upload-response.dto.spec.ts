import { UploadResponseDto } from './upload-response.dto';
import * as classTransformer from 'class-transformer';
import * as classValidator from 'class-validator';

describe('UploadResponseDto', () => {
  it('should return instance of UploadResponseDto and throw no error', async () => {
    const mockUploadResponse = {
      imageId: 'some id',
      name: 'some name',
      url: 'https://someweb.com/bukcet/image.jpg',
      sizeBefore: 99,
      sizeAfter: 10,
      optimizePercentage: 80,
    };

    const uploadResponseDto = classTransformer.plainToClass(
      UploadResponseDto,
      mockUploadResponse,
    );
    const result = await classValidator.validate(uploadResponseDto);
    expect(result.length).toBe(0);
  });

  it('should return instance of UploadResponseDto and throw no error', async () => {
    const mockUploadResponseError = {
      imageId: undefined,
      name: 'some name',
      url: 'https://someweb.com/bukcet/image.jpg',
      sizeBefore: 99,
      sizeAfter: 10,
      optimizePercentage: 80,
    };

    const uploadResponseDtoError = classTransformer.plainToClass(
      UploadResponseDto,
      mockUploadResponseError,
    );
    const resultErrors = await classValidator.validate(uploadResponseDtoError);
    expect(resultErrors.length).not.toBe(0);
  });
});
