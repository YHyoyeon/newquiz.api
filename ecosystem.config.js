module.exports = {
    apps: [
        {
            name: 'news_server',
            script: 'dist/app_news/app.js',
            watch: false,
            env_local: {
                SERVER_ENV: 'local',
            },
            env_dev: {
                SERVER_ENV: 'dev',
            },
            env_qa: {
                SERVER_ENV: 'qa',
            },
            env_live: {
                SERVER_ENV: 'live',
            },
            instances: process.env.INSTANCES,
            exec_mode: 'cluster',
            listen_timeout: 50000,
            kill_timeout: 5000,
        },
    ],
};
