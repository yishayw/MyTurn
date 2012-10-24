Ext.define('testing.util.TimeUtils', {
	statics: {
	    getFormattedTime: function(time) {
	        var date = new Date(null);
	        var offsetInSeconds = (date.getTimezoneOffset()) * 60;
	        date.setSeconds(time / 1000 + offsetInSeconds);
	        var formattedTime = date.toTimeString().substr(0, 8);
	        return formattedTime;
	    }
	}
});