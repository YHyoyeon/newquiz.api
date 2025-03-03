module.exports = {
    apps: [
        {
            name: 'news_server',
            script: 'dist/app_news/app.js',
            watch: false,
            env_local: {
                SERVER_ENV: 'local',
                FILE_EXT: 'js',
            },
            env_dev: {
                SERVER_ENV: 'dev',
                FILE_EXT: 'js',
            },
            instances: process.env.INSTANCES || 2,
            exec_mode: 'cluster',
            listen_timeout: 50000,
            kill_timeout: 5000,
        },
    ],
};
