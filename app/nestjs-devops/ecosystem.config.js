module.exports = {
  apps: [
    {
      name: 'nestjs-devops',
      script: 'dist/main.js',
      watch: '.',
      instances: 2,
      max_memory_restart: '45m'
    }
  ]
};
