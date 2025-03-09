"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.newServerSwaggerDocs = void 0;
const swagger_jsdoc_1 = __importDefault(require("swagger-jsdoc"));
const serverUrl = process.env.SERVER_ENV === 'local' ? 'http://localhost:12041' : 'http://1.235.234.86';
const newServerOptions = {
    definition: {
        openapi: '3.0.0',
        info: {
            title: 'New Server API',
            version: '2.0.0',
            description: 'NEWQUIZ New Server  API',
        },
        servers: [
            {
                url: serverUrl,
                description: '뉴스 API',
            },
        ],
        // components: {
        //     securitySchemes: {
        //         bearerAuth: {
        //             type: 'http',
        //             scheme: 'bearer',
        //             description: 'JWT Authorization header using the Bearer scheme.',
        //             bearerFormat: 'JWT',
        //         }
        //     }
        // },
        security: [{
                bearerAuth: []
            }]
    },
    apis: ['./src/app_news/controllers/**/*.ts', './dist/app_news/controllers/**/*.js'],
};
exports.newServerSwaggerDocs = (0, swagger_jsdoc_1.default)(newServerOptions);
//# sourceMappingURL=swagger_doc.js.map