export const enum ServerTypes {
    NEWS_SERVER = 'news_server'
}

interface ServerConfig {
    serverType: ServerTypes;
    id: number;
    name: string;
    // NODE_ENV: string;
    port: number;
    httpsPort?: number;
    httpsCertPath?: string;
    httpsKeyPath?: string;
}

export interface RootServerConfig {
    NODE_ENV: 'default' | 'local' | 'dev' | 'qa' | 'live';
    newsServer: ServerConfig,
}

export interface Configs {
    local: RootServerConfig,
    dev: RootServerConfig,
    qa: RootServerConfig,
    live: RootServerConfig,
    default: RootServerConfig,
} 