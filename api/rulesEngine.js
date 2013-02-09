/**
 * State machine like. Client messages change state and initiate a timed callback which emits a message to back to client.
 */
var messageDispatcher = require('./messageDispatcher')
    , timedAction = require('./models/timedAction')
    , db = require('./db');

function rulesEngine(room, messageDispatcher) {
    this.room = room.name;
    this.discussionLength = room.discussionLength;
    this.turnLimit = room.turnLength;
    this.speakerQueue = [];
    this.messageDispatcher = messageDispatcher;
    this.discussionBeginning = null;
    this.discussionOverActionId = null;
    this.nextTimedActionId = null;
    this.nextTimedActionTime = null;
    this.activeSpeaker = null;
    this.discussionRepeating = false;
    this.discussionEnding = false;
    this.callback = null;
}

rulesEngine.prototype.listen = function() {
    var context = this;
    this.callback = function(data) {
        var clientId = data.clientId;
        var user = db.load(clientId);
        if (user && (user.room == context.room)) {
             context.receiveClientMessage(user, data);
        }
    };
    this.messageDispatcher.on('message', this.callback);
}

rulesEngine.prototype.stopListening = function() {
    if(this.callback && this.messageDispatcher) {
        this.messageDispatcher.removeListener('message', this.callback);
    }
}

rulesEngine.prototype.receiveClientMessage = function(user, data) {
    var type = data.type;
    var shouldReprocess = false;
    if(type == 'requestToSpeak') {
        shouldReprocess = this.doRequestToSpeak(user, data);
    } else if(type == 'relinquishTurn') {
        shouldReprocess = this.doRelinquishTurn(user, data);
    } else if(type == 'repeatDiscussion') {
        shouldReprocess = this.doRepeatDiscussion(user, data);
    } else if(type == 'discussionOver') {
        shouldReprocess = this.doDiscussionOver(user, data);
    }
    if(shouldReprocess) {
        this.reprocess();
    }
}

rulesEngine.prototype.log = function(msg) {
    var now = new Date().toLocaleString();
    console.log(now + ": " + msg);
}

rulesEngine.prototype.doRequestToSpeak = function(user, data) {
    // add user to queue if he's not there already,
    var length = this.speakerQueue.length;
    for(var i = 0; i < length; i++) {
        var currentUser = this.speakerQueue[i];
        if(currentUser.name == user.name) {
            return false;
        }
    }
    this.speakerQueue.push(user);
    return true;
}

rulesEngine.prototype.doDiscussionOver = function(user, data) {
    this.discussionEnding = true;
    return true;
}

rulesEngine.prototype.doRepeatDiscussion = function(user, data) {
    this.discussionBeginning = null;
    this.discussionOverActionId = null;
    this.nextTimedActionId = null;
    this.nextTimedActionTime = null;
    this.activeSpeaker = null;
    this.discussionRepeating = true;
    return true;
}

rulesEngine.prototype.doRelinquishTurn = function(user, data) {
    // interrupt user if speaking
    if(this.activeSpeaker && (user.name == this.activeSpeaker.name)) {
        this.updateActiveSpeaker(new Date().getTime());
        this.activeSpeaker = null;
    }
    // remove use user from queue
    var length = this.speakerQueue.length;
    for(var i = 0; i < length; i++) {
        var currentUser = this.speakerQueue[i];
        if(currentUser.name == user.name) {
            this.speakerQueue.splice(i, 1);
            return true;
        }
    }
}

rulesEngine.prototype.reprocess = function() {
    var now = new Date().getTime();
    // get possible message events and set the closest as a timeout
    var nextSpeakerAction = this.getNextSpeaker();
    // enforce discussion length if it hasn't been done already
    var context = this;
    if(nextSpeakerAction && !this.discussionOverActionId) {
        this.discussionBeginning = now;
        this.discussionOverActionId = setTimeout(function() {
            context.doPersistUsers.call(context);
        },
        this.discussionLength);
    }
    // check for phantom groups (e.g. time was over but no user responded to repeat/terminate dialog)
    var timeLeft = this.getTimeLeft(now);
    var cleanupNecessary = isNaN(timeLeft) || timeLeft < 0;
    var nextAction = cleanupNecessary || this.discussionEnding ? this.getEndingDiscussion() :
        this.discussionRepeating ? this.getRepeatingDiscussion() : 
            nextSpeakerAction ? nextSpeakerAction : this.getWaitingForSpeaker();
    //  make sure next action isn't after an already existing timed event
    if(!nextAction || (this.nextTimedActionTime != null && (now + nextAction.time > this.nextTimedActionTime))) {
        return;
    }
    this.nextTimedActionTime = now + nextAction.time;
    clearTimeout(this.nextTimedActionId);
    this.nextTimedActionId = setTimeout(nextAction.action, nextAction.time);
}

rulesEngine.prototype.getNextSpeaker = function() {
    // check for next speaker
    var currentTime = new Date().getTime();
    var length = this.speakerQueue.length;
    var modestSpeaker = length > 0 ? this.speakerQueue[0] : null;
    var activeSpeaker = this.activeSpeaker;
    // active speakers are treated differently, better not use them
    if(activeSpeaker && modestSpeaker == activeSpeaker && length > 1) {
        modestSpeaker = this.speakerQueue[1];
    }
    var timeRemaining = activeSpeaker ? this.turnLimit - (currentTime - activeSpeaker.lastTurnBeginning) : 0;
    for(var i = 0; i < length; i++) {
        var currentUser = this.speakerQueue[i];
        var currentUserElapsedTime = currentUser.elapsedTime;
        if(currentUser == activeSpeaker) {
            // we add 500 to avoid turns not changing because of setTimeout() inaccuaracies
            currentUserElapsedTime += timeRemaining + 500;
        }
        if(currentUserElapsedTime < modestSpeaker.elapsedTime) {
            modestSpeaker = currentUser;
        }
    }
    if(!modestSpeaker) {
        return null;
    }
    var nextAction = this.createTimedAction(this.doNextSpeaker, [modestSpeaker]);
    // let active speaker finish his turn
    if(activeSpeaker) {
        if(timeRemaining > 0) {
            nextAction.time += timeRemaining;
        }
    }
    return nextAction;
}

rulesEngine.prototype.getWaitingForSpeaker = function() {
    // if next action doesn't exist, send such message to clients
    if(!this.activeSpeaker) {
        return this.createTimedAction(this.doWaitingForSpeaker, [], true);
    }
}

rulesEngine.prototype.getRepeatingDiscussion = function() {
    return this.createTimedAction(this.doRepeatingDiscussion, [], true);
}

rulesEngine.prototype.getEndingDiscussion = function() {
    return this.createTimedAction(this.doEndingDiscussion, [], true);
}

rulesEngine.prototype.doRepeatingDiscussion = function() {
    this.messageDispatcher.sendMessageToRoom(this.room, {
        messageType: 'repeatingDiscussion'
    });
    this.discussionRepeating = false;
}

rulesEngine.prototype.doEndingDiscussion = function() {
    this.messageDispatcher.emit('discussionOverInServer', this.room);
    this.messageDispatcher.sendMessageToRoom(this.room, {
        messageType: 'discussionOver'
    });
    this.discussionEnding = false;
}

rulesEngine.prototype.doWaitingForSpeaker = function() {
    var now = new Date().getTime();
    this.messageDispatcher.sendMessageToRoom(this.room, {
        messageType: 'waitingForNewSpeaker',
        timeLeft: this.getTimeLeft(now)
    });
}

rulesEngine.prototype.doPersistUsers = function() {
    // discussion is over, make sure no further actions are performed
    clearTimeout(this.nextTimedActionId);
    clearTimeout(this.discussionOverActionId);
    this.updateActiveSpeaker(new Date().getTime());
    // write discussion details to a peristent DB.
    // users will choose whether or not to repeat discussion
    // if not, 'discussionOver' will be emitted
    this.messageDispatcher.emit('persistRoomData', this.room);
    // schedule cleanup in 10 minutes in case persist doesn't yield repeat or over messages
    var context = this;
    setTimeout(function(){context.reprocess()}, 10*60*1000);
}

rulesEngine.prototype.updateActiveSpeaker = function(currentTime) {
    if(this.activeSpeaker) {
        this.activeSpeaker.elapsedTime += currentTime - this.activeSpeaker.lastTurnBeginning;
        db.save(this.activeSpeaker);
    }
}

rulesEngine.prototype.doNextSpeaker = function(speaker) {
    var currentTime = new Date().getTime();
    // update active speaker
    this.updateActiveSpeaker(currentTime);
    // update new speaker
    speaker.lastTurnBeginning = currentTime;
    // replace active speaker
    this.activeSpeaker = speaker;
    // send message
    this.messageDispatcher.sendMessageToRoom(this.room, {
        messageType: 'newSpeaker',
        name: speaker.name,
        timeLeft: this.getTimeLeft(currentTime)
    });
    this.messageDispatcher.sendMessageToClient(speaker.id, {
        messageType: 'yourTurn'
    });
}

rulesEngine.prototype.getTimeLeft = function(now) {
    var result = this.discussionLength - (now - this.discussionBeginning);
    return result;
}

rulesEngine.prototype.createTimedAction = function(actionFunction, params, noReprocess) {
    var context = this;
    var nextAction = new timedAction(0, function() {
        actionFunction.apply(context, params);
        context.nextTimedActionId = null;
        context.nextTimedActionTime = null;
        if (!noReprocess) {
            context.reprocess();         
        }
    });
    return nextAction;
}

module.exports = rulesEngine;