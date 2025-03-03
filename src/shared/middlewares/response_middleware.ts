import Request from '../../types/custom_request';
import { NextFunction, Response } from 'express';
import { logger } from '../../shared/logger/logger';
import { HttpLogModel } from '../../types/http_log';

export async function responseMiddleware(req: Request, res: Response, next: NextFunction) {
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
        response: req.response,
        statusCode: res.statusCode,
    };
    logger.http('outgoing', logModel);

    if (res.statusCode !== 200) {
        return res.json();
    }

    return res.status(200).json(req.response);
}