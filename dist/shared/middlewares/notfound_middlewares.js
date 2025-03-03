"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.notfoundMiddleware = notfoundMiddleware;
const logger_1 = require("../../shared/logger/logger");
function notfoundMiddleware(req, res, next) {
    const logModel = {
        url: req.url,
        headers: req.headers,
        sid: req.address,
        method: req.method,
        path: req.path,
        response: req.response,
    };
    logger_1.logger.warn('notfound', logModel);
    res.json().status(404);
}
//# sourceMappingURL=notfound_middlewares.js.map