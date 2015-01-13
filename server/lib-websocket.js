(function(){

  'use strict';

  exports.connectWebsocketServer = function(server) {

    var websocketLibServer = require('websocket').server;
    var utils = require('./serv-utils');

    var connections = [];

    var websocketServer = new websocketLibServer({
        httpServer: server,
        autoAcceptConnections: false
    });

    websocketServer.on('request', function(request) {

        if (!utils.originIsAllowed(request.origin)) {
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
