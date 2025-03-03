import Request from '../../types/custom_request';
import { NextFunction, Response } from 'express';
import { responseMiddleware } from './response_middleware';
import { z } from 'zod';

export const validationMiddleware = (
    zodObjects: {
        param?: z.ZodType,
        query?: z.ZodType,
        body?: z.ZodType,
        headers?: z.ZodType,
    }
) => {
    return async (req: Request, res: Response, next: NextFunction) => {
        try {
            if (zodObjects.param) {
                zodObjects.param.parse(req.params);
            }
            if (zodObjects.query) {
                zodObjects.query.parse(req.query);
            }
            if (zodObjects.body) {
                zodObjects.body.parse(req.body);
            }
            if (zodObjects.headers) {
                zodObjects.headers.parse(req.headers);
            }
        }
        catch (error) {
            console.log(error.errors);
            res.status(400);
            await responseMiddleware(req, res, next);
            return;
        }
        next();
    };
};