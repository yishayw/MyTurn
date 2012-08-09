var messageDispatcher = require('./messageDispatcher')
    , timedAction = require('./models/timedAction')
    , db = require('./db');

function rulesEngine(room, messageDispatcher) {
    this.room = room.name;
    this.discussionLength = room.discussionLength;
    this.turnLimit = room.turnLength;
    this.discussionOverActionId = null;
    this.nextTimedActionId = null;
    this.nextTimedActionTime = null;
    this.speakerQueue = [];
    this.activeSpeaker = null;
    this.messageDispatcher = messageDispatcher;
}

rulesEngine.prototype.listen = function() {
    var context = this;
    this.messageDispatcher.on('message', function(data) {
        var clientId = data.clientId;
        var user = db.load(clientId);
        if (user && (user.room == context.room)) {
             context.receiveClientMessage(user, data);
        }
    });
}

rulesEngine.prototype.receiveClientMessage = function(user, data) {
    var type = data.type;
    if(type == 'requestToSpeak') {
        this.doRequestToSpeak(user, data);
    }
    this.reprocess();
}

rulesEngine.prototype.log = function(msg) {
    var now = new Date().toLocaleString();
    console.log(now + ": " + msg);
}

rulesEngine.prototype.doRequestToSpeak = function(user, data) {
    // add user to queue if he's not there already,
    this.log('doRequestToSpeak');
    var length = this.speakerQueue.length;
    for(var i = 0; i < length; i++) {
        var currentUser = this.speakerQueue[i];
        if(currentUser.id == user.id) {
            return;
        }
    }
    this.speakerQueue.push(user);
}

rulesEngine.prototype.reprocess = function() {
    this.log('first reprocess');
    var now = new Date().getTime();
    // get possible message events and set the closest as a timeout
    var nextSpeakerAction = this.getNextSpeaker();
    // enforce discussion length if it hasn't been done already
    var context = this;
    if(nextSpeakerAction && !this.discussionOverActionId) {
        this.discussionOverActionId = setTimeout(function() {
            context.doDiscussionOver.call(context);
        },
        this.discussionLength);
    }
    var nextAction = nextSpeakerAction; // in the future there will be more than one possible next action
    // make sure nextAction exists and that it isn't after an already existing timed event
    if(!nextAction || (this.nextTimedActionTime != null && (now + nextAction.time > this.nextTimedActionTime))) {
        return;
    }
    this.log('reprocess ' + nextAction.time);
    this.nextTimedActionTime = now + nextAction.time;
    this.nextTimedActionId = setTimeout(nextAction.action, nextAction.time);

}

rulesEngine.prototype.getNextSpeaker = function() {
    // check for next speaker
    var currentTime = new Date().getTime();
    var length = this.speakerQueue.length;
    var modestSpeaker = length > 0 ? this.speakerQueue[0] : null;
    for(var i = 0; i < length; i++) {
        var currentUser = this.speakerQueue[i];
        if(currentUser.elapsedTime < modestSpeaker.elapsedTime) {
            modestSpeaker = currentUser;
        }
    }
    if(!modestSpeaker) {
        return null;
    }
    var context = this;
    var nextAction = new timedAction(0, function() {
        context.doNextSpeaker(modestSpeaker);
    });
    // let active speaker finish his turn
    var activeSpeaker = this.activeSpeaker;
    if(activeSpeaker) {
        var timeRemaining = this.turnLimit - (currentTime - activeSpeaker.lastTurnBeginning);
        if(timeRemaining > 0) {
            nextAction.time += timeRemaining;
        }
    }
    return nextAction;
}

rulesEngine.prototype.doDiscussionOver = function() {
    // discussion is over, make sure no further actions are performed
    clearTimeout(this.nextTimedActionId);
    clearTimeout(this.discussionOverActionId);
    // clean up server
    this.messageDispatcher.emit('discussionOverInServer', this.room);
    // let client know
    this.messageDispatcher.sendMessageToRoom(this.room, {
        messageType: 'discussionOver'
    });
}

rulesEngine.prototype.doNextSpeaker = function(speaker) {
    // remove speaker from wait queue
    var length = this.speakerQueue.length;
    for(var i = 0; i < length; i++) {
        var currentSpeaker = this.speakerQueue[i];
        if(currentSpeaker.id == speaker.id) {
            this.speakerQueue.splice(i, 1);
            break;
        }
    }
    var currentTime = new Date().getTime();
    // update active speaker
    if(this.activeSpeaker) {
        this.activeSpeaker.elapsedTime += currentTime - this.activeSpeaker.lastTurnBeginning;
    }
    // update new speaker
    speaker.lastTurnBeginning = currentTime;
    // replace active speaker
    this.activeSpeaker = speaker;
    // send message
    this.messageDispatcher.sendMessageToRoom(this.room, {
        messageType: 'newSpeaker',
        name: speaker.name
    });
    this.nextTimedActionId = null;
    this.nextTimedActionTime = null;
    this.reprocess();
}

module.exports = rulesEngine;