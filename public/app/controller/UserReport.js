
Ext.define('testing.controller.UserReport', {
    extend: 'Ext.app.Controller',
    requires: ['testing.util.TimeUtils'],
    config: {
        refs: {
            /*userReportView: "userReportView",*/
            userReportData: "#userReportData"
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
            store.add({name: user.name, elapsedTime: formattedTime});
        }
        //this.getUserReportView().show();
    },

    init: function() {
        this.getApplication().on({
            usersSaved: this.doUsersSaved,
            scope: this
        });
    },

    launch: function() {
        this.doUsersSaved([{name: 'Yosi', elapsedTime: '1234'}, {name: 'Tal', elapsedTime: '3432'}])
        //this.getUserReportView().hide();
    }
});