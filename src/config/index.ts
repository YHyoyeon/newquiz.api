import extend from 'extend';
import { Configs, ServerTypes, RootServerConfig } from '../types/server';

const configs: Configs = {
    local: null,
    dev: null,
    qa: null,
    live: null,
    default: null,
};

configs.default = {
    NODE_ENV: 'default',
    newsServer: {
        serverType: ServerTypes.NEWS_SERVER,
        id: 1000,
        name: ServerTypes.NEWS_SERVER,
        port: 12041
    }
}

configs.local = extend(true, {}, configs.default, {
    NODE_ENV: 'local',
});

configs.dev = extend(true, {}, configs.default, {
    NODE_ENV: 'dev',
});

configs.qa = extend(true, {}, configs.default, {
    NODE_ENV: 'qa',
});

configs.live = extend(true, {}, configs.default, {
    NODE_ENV: 'live',
});


if (!process.env.SERVER_ENV) {
    process.env.SERVER_ENV = 'local';
}

if (!configs[process.env.SERVER_ENV]) {
    console.error(
        `config invalid env name: ${process.env.SERVER_ENV} env=${JSON.stringify(process.env)}`
    );
    process.exit(-1);
}

export const config: RootServerConfig = configs[process.env.SERVER_ENV];