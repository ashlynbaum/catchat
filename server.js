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

function wsHandler(stream) {
  console.log('new connection!');
}

websocket.createServer({
  server: httpServer
}, wsHandler);


httpServer.listen(5000);
