import express from 'express';
import compression from 'compression';
import xss from 'xss-clean';
import cors from 'cors';
import { } from '../../swagger_doc';
import { rateLimit } from 'express-rate-limit';
import * as middlewares from '../../shared/middlewares';
import { config } from '../../config';
import dynamicRouteLoader from '../routes/route_generator';
// import swaggerUi from 'swagger-ui-express';

export async function init(app: express.Express) {
    const corsOptions = {
        origin: config.NODE_ENV,
        allowedHeaders: [
            'content-type',
            'authorization',
            'idempotency-key',
            'refresh',
            'language',
        ],
    };

    app.use(cors(corsOptions));

    // app.use('/api-doc', swaggerUi.serveFiles(swaggerDocs), swaggerUi.setup(swaggerDocs));
    // app.use('/api-doc-test', swaggerUi.serveFiles(swaggerTestDocs), swaggerUi.setup(swaggerTestDocs));

    // // 메모리 저장소가 내장되어 있다. (Redis, Memcached 등을 사용하려면 express-rate-limit 페이지 참조)
    const limiter = rateLimit({
        windowMs: 15 * 60 * 1000,  // 15분 
        limit: 100,  // 각 IP를 `window`당 100개의 요청으로 제한합니다(여기서는 15분당)
        standardHeaders: 'draft-7',  // draft-6: `RateLimit-*` 헤더; draft-7: 결합된 `RateLimit` 헤더 
        legacyHeaders: false,  // `X-RateLimit-*` 헤더를 비활성화합니다. 
        // store: ... , // Redis, Memcached 등
    });

    // // 모든 요청에 속도 제한 미들웨어 적용
    app.use(limiter);

    app.use(express.json({ limit: '1mb' })); // 1MB 이상 요청 금지

    app.use(express.json());
    app.use(express.urlencoded({ extended: true }));
    app.use(xss());
    app.use(compression());

    // 라우터 생성
    const router = express.Router();
    // 동적 라우트 등록
    await dynamicRouteLoader(router);

    app.use('/api', router);


    // // 동적으로 등록된 라우트를 확인
    // router.stack.forEach((layer) => {
    //     if (layer.route) {
    //         console.log(`Registered route: ${Object.keys(layer.route)[0].toUpperCase()} ${layer.route.path}`);
    //     }
    // });

    app.use(middlewares.notfoundMiddleware);
    app.use(middlewares.errorMiddleware);
}