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
exports.requestMiddleware = requestMiddleware;
const logger_1 = require("../../shared/logger/logger");
const ip_helper_1 = require("../../shared/ip_helper");
const geo_hepler_1 = __importDefault(require("../geo_hepler"));
const uuid_1 = require("uuid");
function requestMiddleware(req, res, next) {
    return __awaiter(this, void 0, void 0, function* () {
        const uuid = (0, uuid_1.v4)();
        req.clientIp = (0, ip_helper_1.getClientIp)(req);
        req.geo = geo_hepler_1.default.lookup(req.clientIp);
        req.uuid = uuid;
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
            ip: req.clientIp,
            geo: req.geo,
            body: req.body,
            query: req.query,
        };
        logger_1.logger.http('incoming', logModel);
        return next();
    });
}
//# sourceMappingURL=request_middleware.js.map