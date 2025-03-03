"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.logger = void 0;
const path_1 = __importDefault(require("path"));
const winston_logger_1 = require("./winston_logger");
const events_1 = __importDefault(require("events"));
const config_1 = require("../../config");
const name = config_1.config.newsServer.name;
const logPath = path_1.default.join('./log/', name); // 로그 디렉터리 설정
const channel = new events_1.default(); // 이벤트 채널 생성
class Logger extends winston_logger_1.WinstonLogger {
    constructor(directoryPath, name, logLevel, enableConsole = true) {
        super(directoryPath, name, logLevel, enableConsole); // 부모 클래스 초기화
    }
    emit(eventName, msg) {
        if (channel.listenerCount('error') > 0) {
            channel.emit('error', msg); // 'error' 이벤트 발생
        }
    }
    addListener(event, listener) {
        channel.addListener(event, listener); // 이벤트 리스너 추가
    }
    removeListener(event, listener) {
        channel.removeListener(event, listener); // 이벤트 리스너 제거
    }
}
exports.logger = new Logger(logPath, name).Logger; // Logger 인스턴스 생성 및 내보내기
//# sourceMappingURL=logger.js.map