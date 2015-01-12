(function(){

  'use strict';

  var connect = require('connect');
  var serveStatic = require('serve-static');
  var serveIndex = require('serve-index');

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

  //////

  var utils = require('./pr_utils');

  var WebSocketServer = require('websocket').server;

  var connections = [];

  var wsServer = new WebSocketServer({
      httpServer: server,
      autoAcceptConnections: false
  });

  function originIsAllowed(origin) {
    // put logic here to detect whether the specified origin is allowed.
    return true;
  }

  wsServer.on('request', function(request) {

      if (!originIsAllowed(request.origin)) {
        // Make sure we only accept requests from an allowed origin
        request.reject();
        console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
        return;
      }

      var connection = request.accept('echo-protocol', request.origin);
      console.log(request.origin+", "+(new Date()) + ', Connection accepted.');
      connections.push(connection);
      //console.log(connection);
      
      connection.on('message', function(message) {
          if (message.type === 'utf8') {
              console.log('Received Message: ' + message.utf8Data);
              //connection.sendUTF(message.utf8Data + ', message accepted, over');
              for (var cn in connections) {
          connections[cn].sendUTF('someone said '+message.utf8Data);
        }
          }
      });
      
      connection.on('close', function(reasonCode, description) {
          console.log((new Date()) + ' Peer ' + connection.remoteAddress + ' disconnected.');
          utils.takeout(connections,connection);
      });
      
  });

})();
