import swaggerJsdoc from 'swagger-jsdoc';

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

export const newServerSwaggerDocs = swaggerJsdoc(newServerOptions);