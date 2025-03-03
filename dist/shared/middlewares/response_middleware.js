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
exports.responseMiddleware = responseMiddleware;
const logger_1 = require("../../shared/logger/logger");
function responseMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const logModel = {
            uuid: req.uuid,
            sid: req.address,
            method: req.method,
            path: req.path,
            headers: {
                x_forwarded_for: req.headers['x-forwarded-for'],
                user_agent: req.headers['user-agent'],
                origin: req.headers['origin'],
                authorization: req.headers['authorization'],
                idempotency_key: req.headers['idempotency-key'],
                refresh: req.headers['refresh'],
                language: req.headers['language'],
            },
            response: req.response,
            statusCode: res.statusCode,
        };
        logger_1.logger.http('outgoing', logModel);
        if (res.statusCode !== 200) {
            return res.json();
        }
        return res.status(200).json(req.response);
    });
}
//# sourceMappingURL=response_middleware.js.map