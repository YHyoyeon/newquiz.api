import express from 'express';
import { IGeoInfo } from '../shared/geo_hepler';

interface Request extends express.Request {
    uuid: string,
    address: string,
    response: any,
    // true 이면 responseMiddleware에서 redis에 response 저장
    isIdempotency: boolean,
    clientIp: string,
    geo: IGeoInfo,
}

export default Request;