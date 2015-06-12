var http = require('http');
var ecstatic = require('ecstatic');
var browserify = require('browserify');
var websocket = require('websocket-stream');
var through = require('through2');
var mod = require('mod-op');
var observ = require('observ');
var observStream = require('observ-stream');


var staticHandler = ecstatic('./');
var httpHandler = function(req, res) {
  if (req.url === '/client.js') {
    browserify('./client.js').bundle().pipe(res);
  } else {
    staticHandler(req, res);
  }
};

var httpServer = http.createServer(httpHandler);

var initialPosition = [50, 50];
var positionObserv = observ(initialPosition);
var positionStream = observStream(
  positionObserv, { objectMode: false }
);

var handleActions = function(positionObserv) {
  return through(function(buf, enc, next) {
    // get incoming key
    var key = buf.toString();

    // get current position
    var pos = positionObserv();
    // update position based on key
    switch (key) {
      case 'right':
        pos[0] = mod((pos[0] + 1), 100);
        break;
      case 'left':
        pos[0] = mod((pos[0] - 1), 100);
        break;
      case 'up':
        pos[1] = mod((pos[1] + 1), 100);
        break;
      case 'down':
        pos[1] = mod((pos[1] - 1), 100);
        break;
      default:
        return next();
    }
    // set new position
    positionObserv.set(pos);
    next();
  });
};

var wsHandler = function(stream) {
  var position = positionObserv();
  stream.write(JSON.stringify(position));
  // pipe data from client to stdout
  positionStream.pipe(stream);
  stream.pipe(handleActions(positionObserv));
};


websocket.createServer({
  server: httpServer
}, wsHandler);


httpServer.listen(5000);
