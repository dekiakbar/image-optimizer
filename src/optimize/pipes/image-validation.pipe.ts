import { ArgumentMetadata, BadRequestException, Injectable, PipeTransform } from '@nestjs/common';

@Injectable()
export class ImageValidationPipe implements PipeTransform {
    transform(values: any) {
        values.forEach(
            image => {
                if(!this.isImageValid(image)) {
                    throw new BadRequestException(`image with name : "${image.originalname}" has an invalid extension`);
                }
            }
        );
        return values;
    }

    private isImageValid(image: any){
        return image.originalname.match(/\.(jpg|jpeg|png|gif)$/);
    }
}
