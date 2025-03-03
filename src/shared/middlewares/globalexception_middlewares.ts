import Request from '../../types/custom_request';
import { NextFunction, Response } from 'express';
import { logger } from '../../shared/logger/logger';
import { ApiResult } from '../../types/result_api';
import { ResultCode } from '../../types/result_code';
import { responseMiddleware } from './response_middleware';
import { getClientIp } from '../../shared/ip_helper';
import { HttpLogModel } from '../../types/http_log';
import GeoHelper from '../geo_hepler';

export async function errorMiddleware(err: Error, req: Request, res: Response, next: NextFunction): Promise<void> {
    const ip = getClientIp(req);

    const logModel: HttpLogModel = {
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
        geo: GeoHelper.lookup(ip),
        body: req.body,
        query: req.query,
    };

    if (err instanceof SyntaxError && err.stack.includes('body-parser')) {
        logger.warn('JSON body-parse error', logModel);
        res.status(400);
        responseMiddleware(req, res, next);
        return;
    }

    logger.error('global exception error', logModel);

    const result: ApiResult = {
        code: ResultCode.GlobalExceptionError,
        message: process.env.SERVER_ENV === 'dev' ? err.message : 'GlobalExceptionError',
    };

    res.status(500).json(result);
    return;
}