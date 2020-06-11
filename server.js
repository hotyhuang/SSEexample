const fs = require('fs')
const http = require('http')
const http2 = require('http2')
const path = require('path')
const cors = require('cors')
const compression = require('compression')
const cookieParser = require('cookie-parser')
const express = require('express')
const spdy = require('spdy')

const PORT = 9091;

const app = express();

const corsOptions = {
    exposedHeaders: ['Content-Length', 'Content-Disposition']
};

app.use(cors(corsOptions));
app.use(compression());
app.use(cookieParser());
app.use(express.json());
app.use(express.urlencoded({ extended: false }));

app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './index.html'))
})

app.get('/events', (req, res) => {
    const _headers = {
        'Content-Type': 'text/event-stream; charset=utf-8',
        'Cache-Control': 'no-cache',
        Connection: 'keep-alive'
    };
    res.writeHead(200, _headers);

    res.writeStream = (data, eventType = 'message') => {
        res.write(`event: ${eventType}\n`);
        res.write(`data: ${JSON.stringify(data)}\n\n`);

        res.flush(); // IMPORTANT: this is NEEDED when using compression middleware
    };

    const ticker = setInterval(() => {
        res.writeStream('Server says hi!');
    }, 3000);

    // res.writeStream('yoyo', 'open')

    res.on('close', function() {
        clearInterval(ticker);
        console.log('Client disconnected from event stream', new Date());
        res.end();
    });
})

app.get('*', (req, res) => {
    res.writeHead(404);
    res.end();
});


const options = {
    key: fs.readFileSync(path.resolve(__dirname, 'certs/server.key')),
    cert: fs.readFileSync(path.resolve(__dirname, 'certs/server.crt')),
};

const server = spdy.createServer(options, app);

server.listen(PORT, err => {
    if (err) {
        process.exit(1);
        return;
    }

    console.log(`App Started, Listening on Port ${PORT}...`);
})




// const server = http2.createSecureServer(options)

// server.on('error', (err) => console.error(err))

// server.on('stream', (stream, headers) => {
//     // stream is a Duplex
//     stream.respond({
//         'content-type': 'text/html',
//         ':status': 200
//     });
//     stream.sendFile(path.resolve(__dirname, './index.html'))
//     // stream.end('<h1>Hello World</h1>');
// });

// server.listen(PORT);
