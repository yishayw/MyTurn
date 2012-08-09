
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./api/models/user')
  , rulesEngine = require('./api/rulesEngine')
  , db = require('./api/db.js')
  , messageDispatcher = require('./api/messageDispatcher')
  , apiServer = require('./api/nodejs_server.js');
var app = module.exports = express.createServer();

var messageDispatcherInstance;
var rulesEngineMap = {};
// Configuration

app.configure(function() {
    app.set('views', __dirname + '/views');
    app.set('view engine', 'jade');
    app.use(express.bodyParser());
    app.use(express.methodOverride());
    app.use(app.router);
    app.use('/api', apiServer);
    app.use(express.static(__dirname + '/public'));
});

app.configure('development', function(){
  app.use(express.errorHandler({ dumpExceptions: true, showStack: true }));
});

app.configure('production', function(){
  app.use(express.errorHandler());
});

// Routes

// app.get('/', routes.index);

app.listen(process.env.port || 3000);
console.log("Express server listening on port %d in %s mode", app.address().port, app.settings.env);

var io = require('socket.io').listen(app);
io.configure(function() {
    // Configure socket.io
    io.set('resource', '/api/socket.io');
    io.set('transports', ['xhr-polling']);
    io.set('polling duration', 10);
    messageDispatcherInstance = new messageDispatcher(io);
    messageDispatcherInstance.on('discussionOverInServer', function(room) {
        delete rulesEngineMap[room];
    });
    io.sockets.on('connection', function(socket) {
        socket.on('login', function(data) {
            login(socket, data);
        });
        socket.on('disconnect', function(reason) {
            db.remove(socket.id);
        });
        socket.on('clientMessage', function(messageData) {
            messageDispatcherInstance.sendMessageFromClient(socket.id, messageData);
        });
    });
});

function login(socket, data) {
    var name = data.name;
    var room = data.room;
    // check if user already exists
    var clientsInRoom = io.sockets.clients(room);
    var length = clientsInRoom ? clientsInRoom.length : 0;
    for (var i=0; i<length; i++)
    {
        var client = clientsInRoom[i];
        var userObject = db.load(client.id);
        if (userObject && userObject.name == name && userObject.room == room)
        {
            socket.emit('userRejected', {reason: 'alreadyExists'});
            return;
        }
    }
    var roomList = db.load('groups').data;
    var numberOfRooms = roomList.length;
    var roomObject = null;
    for (var i=0; i < numberOfRooms; i++) {
        if (roomList[i].name == room) {
            roomObject = roomList[i];
            break;
        }
    }
    if (!roomObject) {
        socket.emit('userRejected', {reason: 'groupNotDefined'});
        return;
    }
    // save new client data
    db.save(new user(data, socket.id, room));
    // create a rules engine if it doesn't already exist
    if (!rulesEngineMap[room]) {
        var newRulesEngine = new rulesEngine(roomObject, messageDispatcherInstance);
        newRulesEngine.listen();
        rulesEngineMap[room] = newRulesEngine;
    }
    socket.join(room);
    socket.emit('userAccepted');
}