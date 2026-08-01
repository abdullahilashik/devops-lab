module.exports = {
  apps: [
    {
      name: 'nodejs-app',
      script: './app.js',
      instances: 1,
      watch: false,
      autorestart: true,
      max_memory_restart: '40M'
    }
  ]
};