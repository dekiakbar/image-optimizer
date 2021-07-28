"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
exports.__esModule = true;
exports.ImageValidationPipe = void 0;
var common_1 = require("@nestjs/common");
var ImageValidationPipe = /** @class */ (function () {
    function ImageValidationPipe() {
    }
    ImageValidationPipe.prototype.transform = function (values) {
        var _this = this;
        values.forEach(function (image) {
            if (!_this.isImageValid(image)) {
                throw new common_1.BadRequestException("image with name : \"" + image.originalname + "\" has an invalid extension");
            }
        });
        return values;
    };
    ImageValidationPipe.prototype.isImageValid = function (image) {
        return image.originalname.match(/\.(jpg|jpeg|png|gif)$/);
    };
    ImageValidationPipe = __decorate([
        common_1.Injectable()
    ], ImageValidationPipe);
    return ImageValidationPipe;
}());
exports.ImageValidationPipe = ImageValidationPipe;
