import Request from '../../types/custom_request';
import { NextFunction, Response } from 'express';
import { logger } from '../../shared/logger/logger';
import { getClientIp } from '../../shared/ip_helper';
import { HttpLogModel } from '../../types/http_log';
import GeoHelper from '../geo_hepler';
import { v4 as uuidv4 } from 'uuid';

export async function requestMiddleware(req: Request, res: Response, next: NextFunction) {
    const uuid = uuidv4();

    req.clientIp = getClientIp(req);
    req.geo = GeoHelper.lookup(req.clientIp);
    req.uuid = uuid;

    const logModel: HttpLogModel = {
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

    logger.http('incoming', logModel);
    return next();
}
