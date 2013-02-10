
/**
 * Module dependencies.
 */

var express = require('express')
  , routes = require('./routes')
  , user = require('./api/models/user')
  , rulesEngine = require('./api/rulesEngine')
  , db = require('./api/db.js')
  , messageDispatcherInstance = require('./api/messageDispatcher')
  , apiServer = require('./api/nodejs_server.js');
var app = module.exports = express.createServer();

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

app.get('/data/readme.json', function(req, res) {
    res.sendfile('Readme.txt');
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
    messageDispatcherInstance.setIo(io);
    messageDispatcherInstance.on('persistRoomData', function(room) {
        persistRoomData(room);
    });
    messageDispatcherInstance.on('discussionOverInServer', function(room) {
        cleanRoomData(room);
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
    var roomObject = getRoomObject(room);
    if (!roomObject) {
        socket.emit('userRejected', {reason: 'groupNotDefined'});
        return;
    }
    // save new client data
    db.save(new user(data, socket.id, room));
    roomObject.userIds.push(socket.id);
    saveRoomObject(roomObject);
    // create a rules engine if it doesn't already exist
    if (!rulesEngineMap[room]) {
        var newRulesEngine = new rulesEngine(roomObject, messageDispatcherInstance);
        newRulesEngine.listen();
        rulesEngineMap[room] = newRulesEngine;
    }
    socket.join(room);
    socket.emit('userAccepted');
}

function getRoomObject(room) {
    if (!room) {
        return null;
    }
    var groups = db.load('groups');
    if (!groups) {
        return null;
    }
    var roomList = groups.data;
    if (!roomList) {
        return null;
    }
    var numberOfRooms = roomList.length;
    for (var i=0; i < numberOfRooms; i++) {
        if (roomList[i].name == room) {
            return roomList[i];
        }
    }
    return null;
}

function removeRoomObject(room) {
    var groups = db.load('groups');
    var roomList = groups.data;
    var numberOfRooms = roomList.length;
    for (var i=0; i < numberOfRooms; i++) {
        if (roomList[i].name == room) {
            var removedObject = roomList[i];
            roomList.splice(i, 1);
            db.save(groups);
            return removedObject;
        }
    }
    return null;
}

function saveRoomObject(roomObject) {
    var room = roomObject.name;
    var groups = db.load('groups');
    var roomList = groups.data;
    var numberOfRooms = roomList.length;
     for (var i=0; i < numberOfRooms; i++) {
        if (roomList[i].name == room) {
            roomList[i] = roomObject;
            db.save(groups);
            return roomObject;
        }
    }
}

function persistRoomData(room) {
    var roomObj = getRoomObject(room);
    var userIds = roomObj.userIds;
    var length = userIds.length;
    roomObj.users = [];
    for(var i = 0; i < length; i++) {
        var userObj = db.load(userIds[i]);
        roomObj.users.push(userObj);
    }
    db.savePersistent('rooms', roomObj, function(err) {
        var msg = err ? ('error persisting users: ' + err) : 'users persisted';
        console.log(msg);
        if(!err) {
            messageDispatcherInstance.sendMessageToRoom(room, {
                messageType: 'usersSaved',
                data: roomObj.users
            });
        }
    });
}

function cleanRoomData(room) {
    // destroy rule engine
    var ruleEngineToBeCleaned = rulesEngineMap[room];
    if (ruleEngineToBeCleaned) {
        // remove from event dispatcher
        ruleEngineToBeCleaned.stopListening();
    }
    // remove from map
    delete rulesEngineMap[room];
    // clean up db
    removeRoomObject(room);
}