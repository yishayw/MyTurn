
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

    timeUtils: Ext.create('testing.util.TimeUtils'),

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
        Ext.Msg.confirm('', "Discussion's over. Do you wish to repeat it?", function(answer) {
            var application = this.getApplication();
            if(answer == 'yes') {
                application.fireEvent('clientMessage', { type: 'repeatDiscussion' });
            } else {
                application.fireEvent('clientMessage', { type: 'discussionOver' });
            }
        }, this);

    },

    doRepeatingDiscussion: function() {
        var mainView = this.getMainView();
        mainView.setActiveItem(this.getDiscussionView());
        this.getUserReportView().setDisabled(true);
    },

    init: function() {
        this.getApplication().on({
            usersSaved: this.doUsersSaved,
            repeatingDiscussion: this.doRepeatingDiscussion,
            scope: this
        });
    },

    launch: function() {
        var store = this.getUserReportData().getStore();
        store.remove(store.getRange());
    }
});