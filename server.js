const SseChannel = require('sse-channel');
const fs = require('fs')
const path = require('path')
const express = require('express')
const spdy = require('spdy')

const PORT = 9091;

const app = express();


app.get('/', (req, res) => {
    res.sendFile(path.resolve(__dirname, './index.html'))
})

app.get('/stream/:id', (req, res) => {
    const { id } = req.params
    const myChannel = new SseChannel();
    myChannel.addClient(req, res);

    let num = 0;
    setInterval(() => {
        myChannel.send({
            event: 'slamdunk',
            data: `I am number ${id}, this is my ${num++} times dunk`
        })
    }, 1000);
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
