
Ext.define('testing.controller.Discussion', {
    extend: 'Ext.app.Controller',
    requires: ['Ext.Logger'],
    config: {
        refs: {
            addToQueueButton: "button[action=addToQueueEvent]",
            messageLabel: "label[id=messageLabel]",
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
        Ext.Msg.alert('', 'The discussion is over.');
        // a group was deleted on server, time to reload
        Ext.getStore('groups').load();
    },

    doNewSpeaker: function(data) {
        this.getMessageLabel().setHtml('Current speaker is ' + data.name);
    },

    doWaitingForNewSpeaker: function(data) {
        Ext.Logger.log('Waiting for new');
        this.getMessageLabel().setHtml('Waiting for New Speaker');
    },

    doMyTurn: function(data) {
        this.getBeepSound().play();
    },

    init: function() {
        this.getApplication().on({
            discussionOver: this.doDiscussionOver,
            scope: this
        });
        this.getApplication().on({
            newSpeaker: this.doNewSpeaker,
            scope: this
        });
        this.getApplication().on({
            yourTurn: this.doMyTurn,
            scope: this
        });
        this.getApplication().on({
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