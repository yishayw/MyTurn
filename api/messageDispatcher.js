var sys = require('util'),
    events = require('events');

var messageDispatcher = function(io) {
    if(false === (this instanceof messageDispatcher)) {
        return new messageDispatcher();
    }
    this.io = io;
    events.EventEmitter.call(this);
}
sys.inherits(messageDispatcher, events.EventEmitter);

messageDispatcher.prototype.sendMessageFromClient = function(id, data) {
    data.clientId = id;
    this.emit('message', data);
}

messageDispatcher.prototype.sendMessageToClient = function(id, data) {
    var emitter = this.io && this.io.sockets && this.io.sockets.sockets ? this.io.sockets.sockets[id] : null;
    if  (emitter) {
        emitter.emit('message', data);
    }
}

messageDispatcher.prototype.sendMessageToRoom = function(room, message) {
   this.io.sockets.in(room).emit('message', message);
}

module.exports = messageDispatcher;