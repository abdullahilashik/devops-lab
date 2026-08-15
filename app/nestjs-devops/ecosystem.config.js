module.exports = {
  apps: [
    {
      name: "nestjs",
      script: "./dist/apps/nestjs-devops/main.js",
      interceptor: "node",
      instances: 'max',
      exec_mode: 'cluster',
      autorestart: true,
      watch: false,
      out_file: "./logs/out.log",
      error_file: "./logs/errors.log",
      log_date_format: "YYYY-MM-DD HH:mm Z",
      max_memory_restart: "20M",
      env: {
        NODE_ENV: "development"
      },
      env_production: {
        NODE_ENV: "production",
        PORT: 3002
      }
    },
    {
      name: "attendance",
      script: "./dist/apps/attendance/main.js",
      interceptor: "node",
      instances: 1,
      autorestart: true,
      watch: false,
      max_memory_restart: "25M",
      env: {
        NODE_ENV: 'development',
        PORT: 3001
      },
      env_production: {
        PORT: 3001,
        NODE_ENV: 'production'
      }
    }
  ]
};