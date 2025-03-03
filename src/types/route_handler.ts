import { Request, Response, NextFunction } from 'express';
import { ZodSchema } from 'zod';

export interface HandlerMeta {
    method?: 'get' | 'post' | 'put' | 'delete' | 'patch'; // HTTP 메서드
    validationSchema?: {
        query?: ZodSchema<any>;
        body?: ZodSchema<any>;
        params?: ZodSchema<any>;
    };
    description?: string;
}

export type Handler = (req: Request, res: Response, next: NextFunction) => void | Promise<void>;

export interface RouteHandler extends Handler {
    meta?: HandlerMeta;
}