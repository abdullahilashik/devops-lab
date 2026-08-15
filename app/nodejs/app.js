const http = require('http');

const PORT = process.env.PORT || 3000;

const server = http.createServer((req, res) => {
    if (req.url == '/crash') {
        console.log('Simulating a fatal crash 🔥 ....');
        throw new Error('Force crashed');
    }

    res.end(`Hello! I am running in a raw OS process ${[PORT]}. Try visiting /crash`);
});



server.listen(PORT, function () {
    console.log(`Running node app on http://localhost:${PORT}`);
    console.log(`My Process ID (PID) is: ${process.pid}`);
});