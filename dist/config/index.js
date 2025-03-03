"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.config = void 0;
const extend_1 = __importDefault(require("extend"));
const configs = {
    local: null,
    dev: null,
    qa: null,
    live: null,
    default: null,
};
configs.default = {
    NODE_ENV: 'default',
    newsServer: {
        serverType: "news_server" /* ServerTypes.NEWS_SERVER */,
        id: 1000,
        name: "news_server" /* ServerTypes.NEWS_SERVER */,
        port: 12041
    }
};
configs.local = (0, extend_1.default)(true, {}, configs.default, {
    NODE_ENV: 'local',
});
configs.dev = (0, extend_1.default)(true, {}, configs.default, {
    NODE_ENV: 'dev',
});
configs.qa = (0, extend_1.default)(true, {}, configs.default, {
    NODE_ENV: 'qa',
});
configs.live = (0, extend_1.default)(true, {}, configs.default, {
    NODE_ENV: 'live',
});
if (!process.env.SERVER_ENV) {
    process.env.SERVER_ENV = 'local';
}
if (!configs[process.env.SERVER_ENV]) {
    console.error(`config invalid env name: ${process.env.SERVER_ENV} env=${JSON.stringify(process.env)}`);
    process.exit(-1);
}
exports.config = configs[process.env.SERVER_ENV];
//# sourceMappingURL=index.js.map