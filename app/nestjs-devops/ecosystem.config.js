module.exports = {
    apps: [
        {
            name: 'nestjs-dev',
            script: 'npm',
            args: 'run start:dev',
            // On Windows, PM2 requires script_args or pointing to npm.cmd:
            // script: 'C:\\Program Files\\nodejs\\npm.cmd', // alternative if npm fails
        }
    ]
};