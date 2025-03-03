"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getClientIp = getClientIp;
function getClientIp(req) {
    var _a;
    // 1. API Gateway에서 클라이언트 IP 가져오기
    const clientIp = req.sourceIp; // sourceIp는 Express 기본 타입에 없으므로 any로 타입 단언
    // 2. X-Forwarded-For 헤더에서 IP 가져오기 (ALB나 프록시 환경)
    const forwardedIp = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'];
    // X-Forwarded-For 값에서 첫 번째 IP만 가져오기
    const parsedForwardedIp = Array.isArray(forwardedIp)
        ? forwardedIp[0]
        : typeof forwardedIp === 'string'
            ? forwardedIp.split(',')[0].trim()
            : null;
    const ip = clientIp || parsedForwardedIp || ((_a = req.connection) === null || _a === void 0 ? void 0 : _a.remoteAddress) || 'Unknown IP';
    return ip.replace(/^::ffff:/, ''); // IPv4 형식으로 변환 (::ffff: 제거)
}
//# sourceMappingURL=ip_helper.js.map