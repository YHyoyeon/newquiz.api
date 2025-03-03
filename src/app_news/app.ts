import { config } from '../config';
import http from 'http';
import express from 'express';
import * as loader from './loaders';
import { logger } from '../shared/logger/logger';
import os from 'os';

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

function logServerInfo() {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0]; // 현재 시간
    const uptime = process.uptime(); // 서버 운영 시간 (초)
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const loadAvg = os.loadavg(); // 시스템 평균 로드 (1, 5, 15분)

    logger.info(`
🖥️  [${now}] 서버 상태 정보:
---------------------------------
⏳  Uptime: ${Math.floor(uptime)}s
     SERVER_ENV: ${process.env.SERVER_ENV}
     FILE_EXT: ${process.env.FILE_EXT}
💾  메모리 사용량:
    - RSS: ${(memoryUsage.rss / 1024 / 1024).toFixed(2)} MB
    - Heap Total: ${(memoryUsage.heapTotal / 1024 / 1024).toFixed(2)} MB
    - Heap Used: ${(memoryUsage.heapUsed / 1024 / 1024).toFixed(2)} MB
⚡  CPU 사용량:
    - User: ${cpuUsage.user} μs
    - System: ${cpuUsage.system} μs
📊  Load Average (1m, 5m, 15m): ${loadAvg.map(l => l.toFixed(2)).join(', ')}
🔹  Process ID (PID): ${process.pid}
---------------------------------
`);
}

// 추가 서비스 초기화
async function initService() {
    setInterval(logServerInfo, 30000);
}

async function initExpress(): Promise<http.Server<typeof http.IncomingMessage, typeof http.ServerResponse>> {
    logger.debug('Express Init Begin');

    const app = express();
    logger.debug(`FILE_EXT= ${process.env.FILE_EXT}`);
    logger.debug(`SERVER_ENV = ${process.env.SERVER_ENV}`);

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