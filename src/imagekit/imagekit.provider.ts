import { Provider } from '@nestjs/common';
import ImageKit from 'imagekit';

export const ImagekitLib = 'lib:imagekit';

export const imagekitProvider: Provider = {
    provide: ImagekitLib,
    useExisting: ImageKit,
};