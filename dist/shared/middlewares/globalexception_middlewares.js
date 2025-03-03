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
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.errorMiddleware = errorMiddleware;
const logger_1 = require("../../shared/logger/logger");
const result_code_1 = require("../../types/result_code");
const response_middleware_1 = require("./response_middleware");
const ip_helper_1 = require("../../shared/ip_helper");
const geo_hepler_1 = __importDefault(require("../geo_hepler"));
function errorMiddleware(err, req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const ip = (0, ip_helper_1.getClientIp)(req);
        const logModel = {
            uuid: req.uuid,
            name: err.name,
            message: err.message,
            stack: err.stack,
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
            ip: ip,
            geo: geo_hepler_1.default.lookup(ip),
            body: req.body,
            query: req.query,
        };
        if (err instanceof SyntaxError && err.stack.includes('body-parser')) {
            logger_1.logger.warn('JSON body-parse error', logModel);
            res.status(400);
            (0, response_middleware_1.responseMiddleware)(req, res, next);
            return;
        }
        logger_1.logger.error('global exception error', logModel);
        const result = {
            code: result_code_1.ResultCode.GlobalExceptionError,
            message: process.env.SERVER_ENV === 'dev' ? err.message : 'GlobalExceptionError',
        };
        res.status(500).json(result);
        return;
    });
}
//# sourceMappingURL=globalexception_middlewares.js.map