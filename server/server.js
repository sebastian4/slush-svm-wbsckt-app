(function(){

  'use strict';

  var connect = require('connect');
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');
  var utils = require('./serv-utils');

  var http = require('http');

  var app = connect()
        .use(require('connect-livereload')({ port: 35729 }))
        .use(serveStatic('app'))
        .use(serveIndex('app'));

  var server = http.createServer(app)
        .listen(9000)
        .on('listening', function() {
            console.log('Started connect web server on http://localhost:9000.');
        });

  var websocketLib = require('./lib-websocket');
  //var websocketLib = require('./lib-ws');

  websocketLib.connectWebsocketServer(server);

})();
