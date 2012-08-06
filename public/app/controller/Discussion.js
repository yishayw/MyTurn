
Ext.define('testing.controller.Discussion', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            addToQueueButton: { tap: 'doAddToQueue' }
            /*removeFromQueueButton: { tap: 'doRemoveFromQueue' }*/
        },
        refs: {
            addToQueueButton: "button[action=addToQueueEvent]"
        }
    },

    doAddToQueue: function() {
 //       this.getAddToQueueButton().setDisabled(true);
        this.getApplication().fireEvent('clientMessage', {type : 'requestToSpeak'});
    },

    doDiscussionOver: function(data) {
        alert('The discussion is over.');
    },

    doNewSpeaker: function(data) {
        alert('New speaker is ' + data.name);
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
    },

    launch: function() {
    }
});