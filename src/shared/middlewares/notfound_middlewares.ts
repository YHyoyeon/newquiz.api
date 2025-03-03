import Request from '../../types/custom_request';
import { NextFunction, Response } from 'express';
import { logger } from '../../shared/logger/logger';

export function notfoundMiddleware(req: Request, res: Response, next: NextFunction) {
    const logModel = {
        url: req.url,
        headers: req.headers,
        sid: req.address,
        method: req.method,
        path: req.path,
        response: req.response,
    };

    logger.warn('notfound', logModel);
    res.json().status(404);
}