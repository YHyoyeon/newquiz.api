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
const config_1 = require("../config");
const express_1 = __importDefault(require("express"));
const loader = __importStar(require("./loaders"));
const logger_1 = require("../shared/logger/logger");
const os_1 = __importDefault(require("os"));
const serverConfig = config_1.config.newsServer;
const serverName = 'News';
function start() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.info(`🏁 ${serverName} Server Init Begin`, { env: config_1.config.NODE_ENV, port: serverConfig.port });
        const server = yield initExpress();
        yield initService();
        logger_1.logger.info(`🆗 ${serverName} Server Init completed!`, { env: config_1.config.NODE_ENV, port: serverConfig.port });
        logger_1.logger.info('⭐ app start! ⭐');
        return server;
    });
}
function logServerInfo() {
    const now = new Date().toISOString().replace('T', ' ').split('.')[0]; // 현재 시간
    const uptime = process.uptime(); // 서버 운영 시간 (초)
    const memoryUsage = process.memoryUsage();
    const cpuUsage = process.cpuUsage();
    const loadAvg = os_1.default.loadavg(); // 시스템 평균 로드 (1, 5, 15분)
    logger_1.logger.info(`
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
function initService() {
    return __awaiter(this, void 0, void 0, function* () {
        setInterval(logServerInfo, 30000);
    });
}
function initExpress() {
    return __awaiter(this, void 0, void 0, function* () {
        logger_1.logger.debug('Express Init Begin');
        const app = (0, express_1.default)();
        logger_1.logger.debug(`FILE_EXT= ${process.env.FILE_EXT}`);
        logger_1.logger.debug(`SERVER_ENV = ${process.env.SERVER_ENV}`);
        const server = app.listen(serverConfig.port, () => __awaiter(this, void 0, void 0, function* () {
            if (process.env.SERVER_ENV === 'live') {
                process.send('ready');
            }
            logger_1.logger.info(`⚡️ Express starting http server listen port=${serverConfig.port}`);
        }));
        process.on('SIGINT', () => {
            server.close(() => __awaiter(this, void 0, void 0, function* () {
                logger_1.logger.info('👿 server closed');
                process.exit(0);
            }));
        });
        yield loader.express.init(app);
        logger_1.logger.debug('Express Init ✔️');
        return server;
    });
}
const server = start();
exports.default = server;
//# sourceMappingURL=app.js.map