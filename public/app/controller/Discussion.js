
Ext.define('testing.controller.Discussion', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Logger'],
    config: {
        refs: {
            addToQueueButton: "button[action=addToQueueEvent]",
            messageLabel: "#messageLabel",
            timeRemainingLabel: "#timeRemainingLabel",
            beepSound: "#beeper"
        }
    },

    doAddToQueue: function() {
        this.getApplication().fireEvent('clientMessage', { type: 'requestToSpeak' });
    },

    doRemoveFromQueue: function() {
        this.getApplication().fireEvent('clientMessage', { type: 'relinquishTurn' });
    },

    doDiscussionOver: function(data) {
        this.getMessageLabel().setHtml('Waiting for New Speaker');
        this.getTimeRemainingLabel().setHtml('');
        Ext.Msg.alert('', 'The discussion is over.');
        // a group was deleted on server, time to reload
        Ext.getStore('groups').load();
    },

    doNewSpeaker: function(data) {
        this.getMessageLabel().setHtml('Current speaker is ' + data.name);
        this.doUpdateTimeRemaining(data);
    },

    doWaitingForNewSpeaker: function(data) {
        this.getMessageLabel().setHtml('Waiting for New Speaker');
        this.doUpdateTimeRemaining(data);
    },

    doMyTurn: function(data) {
        this.getBeepSound().play();
    },

    doUpdateTimeRemaining: function(data) {
        var formattedTime = this.getFormattedTime(data);
        this.getTimeRemainingLabel().setHtml(formattedTime);
    },

    getFormattedTime: function(data) {
        var timeRemaining = data.timeLeft;
        var date = new Date(null);
        var offsetInSeconds = (date.getTimezoneOffset()) * 60;
        date.setSeconds(timeRemaining / 1000 + offsetInSeconds);
        var formattedTime = date.toTimeString().substr(0, 8);
        return formattedTime;
    },

    init: function() {
        this.getApplication().on({
            discussionOver: this.doDiscussionOver,
            newSpeaker: this.doNewSpeaker,
            yourTurn: this.doMyTurn,
            waitingForNewSpeaker: this.doWaitingForNewSpeaker,
            scope: this
        });
    },

    launch: function() {
        this.getAddToQueueButton().element.on({
            touchstart: 'doAddToQueue',
            touchend: 'doRemoveFromQueue',
            scope: this
        })
    }
});