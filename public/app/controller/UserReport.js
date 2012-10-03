
Ext.define('testing.controller.UserReport', {
    extend: 'Ext.app.Controller',
    requires: ['testing.util.TimeUtils', 'Ext.MessageBox'],
    config: {
        refs: {
            userReportView: "userReportView",
            userReportData: "#userReportData",
            mainView: "mainView",
            discussionView: "discussionView"
        }
    },

    messageBox: null,

    timeUtils: null,

    doUsersSaved: function(dataContainer) {
        var userReportData = this.getUserReportData();
        var store = userReportData.getStore();
        store.remove(store.getRange());
        var length = dataContainer && dataContainer.data ? dataContainer.data.length : 0;
        for(var i = 0; i < length; i++) {
            var user = dataContainer.data[i];
            var formattedTime = this.timeUtils.getFormattedTime(user.elapsedTime);
            store.add({ name: user.name, elapsedTime: formattedTime });
        }
        var userReportView = this.getUserReportView();
        userReportView.setDisabled(false);
        this.getMainView().setActiveItem(userReportView);
        this.messageBox = Ext.Msg.confirm('', "Discussion time is up. Do you wish to repeat it?", function(answer) {
            var application = this.getApplication();
            if(answer == 'yes') {
                application.fireEvent('clientMessage', { type: 'repeatDiscussion' });
            } else {
                application.fireEvent('clientMessage', { type: 'discussionOver' });
            }
            this.messageBox = null;
        }, this);
    },

    clearMessageBox: function() {
        if(this.messageBox) {
            this.messageBox.hide();
            this.messageBox.setModal(false);
            this.messageBox = null;
        }
    },

    doRepeatingDiscussion: function() {
        var mainView = this.getMainView();
        mainView.setActiveItem(this.getDiscussionView());
        this.getUserReportView().setDisabled(true);
        this.clearMessageBox();
    },

    init: function() {
        this.getApplication().on({
            usersSaved: this.doUsersSaved,
            repeatingDiscussion: this.doRepeatingDiscussion,
            discussionOver: this.clearMessageBox,
            scope: this
        });
        this.timeUtils = Ext.create('testing.util.TimeUtils');        
    },

    launch: function() {
        var store = this.getUserReportData().getStore();
        store.remove(store.getRange());
    }
});