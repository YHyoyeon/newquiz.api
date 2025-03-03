import { NextFunction, Response } from 'express';
import Request from '../../../types/custom_request';
import { Handler, HandlerMeta } from '../../../types/route_handler';
import { ApiResult } from '../../../types/result_api';
import { ResultCode } from '../../../types/result_code';

export const execute: Handler = async (req: Request, res: Response, next: NextFunction) => {
    const result: ApiResult = {
        code: 1,
        message: ResultCode[ResultCode.Fail],
    };

    result.message = ResultCode[ResultCode.Success];
    req.response = result;
    return next();
};

export const meta: HandlerMeta = {
    method: 'get',
    description: 'health api',
};