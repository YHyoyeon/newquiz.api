export interface HttpLogModel {
    // uuid: string,
    method: string,
    path: string,
    headers?: {
        x_forwarded_for: string | string[],
        user_agent: string,
        origin: string,
        authorization: string,
        idempotency_key: string | string[],
        refresh: string | string[],
        language: string | string[],
    }
    [key: string]: any,
}