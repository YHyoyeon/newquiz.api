"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || (function () {
    var ownKeys = function(o) {
        ownKeys = Object.getOwnPropertyNames || function (o) {
            var ar = [];
            for (var k in o) if (Object.prototype.hasOwnProperty.call(o, k)) ar[ar.length] = k;
            return ar;
        };
        return ownKeys(o);
    };
    return function (mod) {
        if (mod && mod.__esModule) return mod;
        var result = {};
        if (mod != null) for (var k = ownKeys(mod), i = 0; i < k.length; i++) if (k[i] !== "default") __createBinding(result, mod, k[i]);
        __setModuleDefault(result, mod);
        return result;
    };
})();
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.init = init;
const express_1 = __importDefault(require("express"));
const compression_1 = __importDefault(require("compression"));
const xss_clean_1 = __importDefault(require("xss-clean"));
const cors_1 = __importDefault(require("cors"));
const express_rate_limit_1 = require("express-rate-limit");
const middlewares = __importStar(require("../../shared/middlewares"));
const config_1 = require("../../config");
const route_generator_1 = __importDefault(require("../routes/route_generator"));
// import swaggerUi from 'swagger-ui-express';
function init(app) {
    return __awaiter(this, void 0, void 0, function* () {
        const corsOptions = {
            origin: config_1.config.NODE_ENV,
            allowedHeaders: [
                'content-type',
                'authorization',
                'idempotency-key',
                'refresh',
                'language',
            ],
        };
        app.use((0, cors_1.default)(corsOptions));
        // app.use('/api-doc', swaggerUi.serveFiles(swaggerDocs), swaggerUi.setup(swaggerDocs));
        // app.use('/api-doc-test', swaggerUi.serveFiles(swaggerTestDocs), swaggerUi.setup(swaggerTestDocs));
        app.set('trust proxy', 1);
        // 메모리 저장소가 내장되어 있다. (Redis, Memcached 등을 사용하려면 express-rate-limit 페이지 참조)
        const limiter = (0, express_rate_limit_1.rateLimit)({
            windowMs: 15 * 60 * 1000, // 15분 
            limit: 100, // 각 IP를 `window`당 100개의 요청으로 제한합니다(여기서는 15분당)
            standardHeaders: 'draft-7', // draft-6: `RateLimit-*` 헤더; draft-7: 결합된 `RateLimit` 헤더 
            legacyHeaders: false, // `X-RateLimit-*` 헤더를 비활성화합니다. 
            // store: ... , // Redis, Memcached 등
        });
        // // 모든 요청에 속도 제한 미들웨어 적용
        app.use(limiter);
        app.use(express_1.default.json({ limit: '1mb' })); // 1MB 이상 요청 금지
        app.use(express_1.default.json());
        app.use(express_1.default.urlencoded({ extended: true }));
        app.use((0, xss_clean_1.default)());
        app.use((0, compression_1.default)());
        // 라우터 생성
        const router = express_1.default.Router();
        // 동적 라우트 등록
        yield (0, route_generator_1.default)(router);
        app.use('/api', router);
        // // 동적으로 등록된 라우트를 확인
        // router.stack.forEach((layer) => {
        //     if (layer.route) {
        //         console.log(`Registered route: ${Object.keys(layer.route)[0].toUpperCase()} ${layer.route.path}`);
        //     }
        // });
        app.use(middlewares.notfoundMiddleware);
        app.use(middlewares.errorMiddleware);
    });
}
//# sourceMappingURL=express.js.map