"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.ResultCode = void 0;
var ResultCode;
(function (ResultCode) {
    // 실패 
    ResultCode[ResultCode["Fail"] = 0] = "Fail";
    // 성공
    ResultCode[ResultCode["Success"] = 1] = "Success";
    // GlobalExceptionError
    ResultCode[ResultCode["GlobalExceptionError"] = -9999] = "GlobalExceptionError";
})(ResultCode || (exports.ResultCode = ResultCode = {}));
//# sourceMappingURL=result_code.js.map