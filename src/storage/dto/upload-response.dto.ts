import { IsNotEmpty } from "class-validator";

export class UploadResponseDto {
  @IsNotEmpty()
  imageId: string;

  @IsNotEmpty()
  name: string;

  @IsNotEmpty()
  url: string;

  @IsNotEmpty()
  sizeBefore: number;

  @IsNotEmpty()
  sizeAfter: number;

  @IsNotEmpty()
  optimizePercentage: string;
}
