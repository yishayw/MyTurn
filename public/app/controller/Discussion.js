
Ext.define('testing.controller.Discussion', {
    extend: 'Ext.app.Controller',
    config: {
        control: {
            addToQueueButton: { tap: 'doAddToQueue' }
            /*removeFromQueueButton: { tap: 'doRemoveFromQueue' }*/
        },
        refs: {
            addToQueueButton: "button[action=addToQueueEvent]",
            messageLabel: "label[id=messageLabel]"
        }
    },

    doAddToQueue: function() {
 //       this.getAddToQueueButton().setDisabled(true);
        this.getApplication().fireEvent('clientMessage', {type : 'requestToSpeak'});
    },

    doDiscussionOver: function(data) {
        this.getMessageLabel().setHtml('The discussion is over.');
    },

    doNewSpeaker: function(data) {
        this.getMessageLabel().setHtml('Current speaker is ' + data.name);
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