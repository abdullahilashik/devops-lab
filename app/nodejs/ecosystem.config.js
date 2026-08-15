module.exports = {
    apps: [
        {
            name: "server-a",
            script: "app.js",
            interceptor: 'node',
            instances: 'max',
            exec_mode: 'cluster',
            max_memory_restart: "50M",
            env: {
                PORT: 3000
            }
        },
        {
            name: 'server-b',
            script: 'app.js',
            interceptor: 'node',
            env: {
                PORT: 3001
            }
        },
        {
            name: 'server-c',
            script: 'app.js',
            interceptor: 'node',
            env: {
                PORT: 3002
            }
        }
    ]
};