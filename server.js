var http = require ('http');
var ecstatic = require ('ecstatic');
var browserify = require ('browserify');
var websocket = require('websocket-stream');

var staticHandler = ecstatic('./');
function httpHandler (req, res) {
  if (req.url === '/client.js') {
    browserify('./client.js').bundle().pipe(res);
  } else {
    staticHandler(req, res);
  }
}

var httpServer = http.createServer(httpHandler);

var position = [25, 25];
function wsHandler(stream) {
  console.log('new connection!');
  stream.write(JSON.stringify(position));
}

websocket.createServer({
  server: httpServer
}, wsHandler);


httpServer.listen(5000);
