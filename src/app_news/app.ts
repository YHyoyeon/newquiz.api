import { config } from '../config';
import http from 'http';
import express from 'express';
import * as loader from './loaders';
import { logger } from '../shared/logger/logger';

const serverConfig = config.newsServer;

const serverName = 'News';

async function start() {
    logger.info(`🏁 ${serverName} Server Init Begin`, { env: config.NODE_ENV, port: serverConfig.port });

    const server = await initExpress();
    await initService();

    logger.info(`🆗 ${serverName} Server Init completed!`, { env: config.NODE_ENV, port: serverConfig.port });
    logger.info('⭐ app start! ⭐');

    return server;
}

// 추가 서비스 초기화
async function initService() {

}

async function initExpress(): Promise<http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>> {
    logger.debug('Express Init Begin');

    const app = express();
    const server = app.listen(serverConfig.port, async () => {
        if (process.env.SERVER_ENV === 'live') {
            process.send('ready');
        }

        logger.info(`⚡️ Express starting http server listen port=${serverConfig.port}`);
    });

    process.on('SIGINT', () => {
        server.close(async () => {
            logger.info('👿 server closed');
            process.exit(0);
        });
    });

    await loader.express.init(app);

    logger.debug('Express Init ✔️');
    return server;
}

const server = start();
export default server;