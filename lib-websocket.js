(function(){

  'use strict';

  exports.connectWebsocketServer = function(server) {

    var WebSocketServer = require('websocket').server;
    var utils = require('./serv-utils');

    var connections = [];

    var wsServer = new WebSocketServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    wsServer.on('request', function(request) {

        if (!utils.originIsAllowed(request.origin)) {
          // Make sure we only accept requests from an allowed origin
          request.reject();
          console.log((new Date()) + ' Connection from origin ' + request.origin + ' rejected.');
          return;
        }

        var connection = request.accept('echo-protocol', request.origin);
        console.log(request.origin+", "+(new Date()) + ', Connection accepted.');
        connections.push(connection);
        
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

  }

})();
