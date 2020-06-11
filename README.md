# Sample Server Sent Event

This is a POC of [issue #369, ERR_MULTIPLE_CALLBACK](https://github.com/spdy-http2/node-spdy/issues/369).

### Env:
Node v12.17.0, v12.18.0

### Setup
I am facing this issue with https, so i am providing certs for this POC. You may need to inject/generate your own certs. You can place key and certs under `./certs` folder, like:
```
-- certs
   |--- server.key
   |--- server.crt
```

If you have a different registered port, you can update it in [server.js, line 11](/server.js#L11)

### Start the app
```
npm install
npm start
```

Then you should be able to see the page running on the PORT. There is two buttons where you can easily start/stop SSE.

## Issue identified
After you stop the SSE on the page, you should be able to see the following error in console.

![screenshot](/screenshot.png)

Notice here i print out the stopping time in both page and terminal, there is a little gap between them. Actually, the printed time in terminal is the time which next message will be sent.

## Fix:
https://github.com/spdy-http2/handle-thing/pull/16
