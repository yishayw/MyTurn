
Ext.define('testing.controller.GroupsRefresher', {
    extend: 'Ext.app.Controller',
    config: {
    	intervalId: 0
    },

    startPollingGroups: function() {
    	this.setIntervalId(setInterval(function() 
    		{
    			Ext.getStore('groups').load();
    		}, 2000
    	));
    },
    
    stopPollingGroups: function() {
    	clearInterval(this.getIntervalId());
    },
    

    init: function () {
    	this.startPollingGroups();
        this.getApplication().on({
            userLoggedIn: this.stopPollingGroups,
            userLoggedOut: this.startPollingGroups,
            scope: this
        });
    }
});