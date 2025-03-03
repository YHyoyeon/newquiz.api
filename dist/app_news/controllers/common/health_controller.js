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
exports.meta = exports.execute = void 0;
const result_code_1 = require("../../../types/result_code");
const execute = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const result = {
        code: 1,
        message: result_code_1.ResultCode[result_code_1.ResultCode.Fail],
    };
    result.message = result_code_1.ResultCode[result_code_1.ResultCode.Success];
    req.response = result;
    return next();
});
exports.execute = execute;
exports.meta = {
    method: 'get',
    description: 'health api',
};
//# sourceMappingURL=health_controller.js.map