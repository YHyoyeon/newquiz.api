"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.validationMiddleware = void 0;
const response_middleware_1 = require("./response_middleware");
const validationMiddleware = (zodObjects) => {
    return (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
        try {
            if (zodObjects.param) {
                zodObjects.param.parse(req.params);
            }
            if (zodObjects.query) {
                zodObjects.query.parse(req.query);
            }
            if (zodObjects.body) {
                zodObjects.body.parse(req.body);
            }
            if (zodObjects.headers) {
                zodObjects.headers.parse(req.headers);
            }
        }
        catch (error) {
            console.log(error.errors);
            res.status(400);
            yield (0, response_middleware_1.responseMiddleware)(req, res, next);
            return;
        }
        next();
    });
};
exports.validationMiddleware = validationMiddleware;
//# sourceMappingURL=validation_middleware.js.map