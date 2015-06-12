var websocket = require('websocket-stream');
var through = require('through2');
var dom = require('domquery');
var codeToKey = require('keycode');

var stream = websocket('ws://' + location.host + '/');

var cat = dom('.cat')[0];

stream.pipe(through(function(state, enc, next) {
  // get current position from server
  var position = JSON.parse(state);

  // set cat x and y coordinates based on position
  cat.setAttribute('x', position[0] + '%');
  cat.setAttribute('y', (100 - position[1]) + '%');

  next();
}));

dom(document).on('keydown', function(ev) {
  // get key name from keydown event
  var key = codeToKey(ev);
  stream.write(key);
});
