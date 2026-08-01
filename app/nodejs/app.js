const http = require('http');

const server = http.createServer((req, res) => {
    if (req.url == '/crash') {
        console.log('Simulating a fatal crash 🔥 ....');
        throw new Error('Force crashed');
    }

    res.end("Hello! I am running in a raw OS process. Try visiting /crash");
});


server.listen(3001, function () {
    console.log('Running node app on http://localhost:3001');
    console.log(`My Process ID (PID) is: ${process.pid}`);
});