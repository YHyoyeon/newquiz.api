import { Request } from 'express';

export function getClientIp(req: Request): string {
    // 1. API Gateway에서 클라이언트 IP 가져오기
    const clientIp = (req as any).sourceIp; // sourceIp는 Express 기본 타입에 없으므로 any로 타입 단언

    // 2. X-Forwarded-For 헤더에서 IP 가져오기 (ALB나 프록시 환경)
    const forwardedIp = req.headers['x-forwarded-for'] || req.headers['X-Forwarded-For'];

    // X-Forwarded-For 값에서 첫 번째 IP만 가져오기
    const parsedForwardedIp = Array.isArray(forwardedIp)
        ? forwardedIp[0]
        : typeof forwardedIp === 'string'
            ? forwardedIp.split(',')[0].trim()
            : null;

    const ip = clientIp || parsedForwardedIp || req.connection?.remoteAddress || 'Unknown IP';

    return ip.replace(/^::ffff:/, ''); // IPv4 형식으로 변환 (::ffff: 제거)
}
